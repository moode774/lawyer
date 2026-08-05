import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, x-client-info, content-type' }
const json = (body: unknown, status=200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type':'application/json' } })
const platforms = new Set(['meta','google','tiktok','snapchat'])

async function verify(platform: string, credentials: Record<string,string>) {
  if (platform === 'meta') {
    const token=credentials.accessToken
    const r=await fetch(`https://graph.facebook.com/v23.0/me?fields=id,name,adaccounts.limit(1){id,name}&access_token=${encodeURIComponent(token||'')}`)
    const d=await r.json(); if(!r.ok) throw new Error(d?.error?.message||'فشل التحقق من Meta')
    const ad=d?.adaccounts?.data?.[0]
    return { accountId: ad?.id||d.id, accountName: ad?.name||d.name, scopes:['ads_read','ads_management'] }
  }
  if (platform === 'google') {
    const r=await fetch('https://googleads.googleapis.com/v25/customers:listAccessibleCustomers',{headers:{Authorization:`Bearer ${credentials.accessToken||''}`,'developer-token':credentials.developerToken||'','Accept':'application/json'}})
    const raw=await r.text()
    let d: any
    try { d=JSON.parse(raw) } catch { throw new Error(`Google Ads أعاد استجابة غير صالحة (${r.status}). تحقق من Developer Token وصلاحية adwords.`) }
    if(!r.ok) throw new Error(d?.error?.message||d?.error?.details?.[0]?.errors?.[0]?.message||`فشل التحقق من Google Ads (${r.status})`)
    const id=(d.resourceNames?.[0]||'').replace('customers/','')
    return { accountId:id, accountName:`Google Ads ${id}`, scopes:['https://www.googleapis.com/auth/adwords'] }
  }
  if (platform === 'tiktok') {
    const id=credentials.advertiserId
    const r=await fetch(`https://business-api.tiktok.com/open_api/v1.3/advertiser/info/?advertiser_ids=${encodeURIComponent(JSON.stringify([id]))}`,{headers:{'Access-Token':credentials.accessToken||''}})
    const d=await r.json(); if(!r.ok||d.code!==0) throw new Error(d.message||'فشل التحقق من TikTok Ads')
    return { accountId:id, accountName:d?.data?.list?.[0]?.name||`TikTok ${id}`, scopes:['advertiser.info'] }
  }
  if (!credentials.accessToken) throw new Error('يلزم Access Token صالح لـ Snapchat Ads')
  const r=await fetch('https://adsapi.snapchat.com/v1/me',{headers:{Authorization:`Bearer ${credentials.accessToken}`}})
  const d=await r.json(); if(!r.ok) throw new Error(d?.request_status||'فشل التحقق من Snapchat Ads')
  return { accountId:d?.me?.id||'snapchat', accountName:d?.me?.display_name||'Snapchat Ads', scopes:['snapchat-marketing-api'] }
}

Deno.serve(async req => {
  if(req.method==='OPTIONS') return new Response('ok',{headers:cors})
  if(req.method!=='POST') return json({success:false,error:'Method not allowed'},405)
  const url=Deno.env.get('SUPABASE_URL')!, anon=Deno.env.get('SUPABASE_ANON_KEY')!, service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const auth=req.headers.get('Authorization')||''
  const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}}})
  const {data:{user}}=await userClient.auth.getUser(); if(!user) return json({success:false,error:'غير مصرح'},401)
  const {data:profile}=await userClient.from('profiles').select('role').eq('id',user.id).maybeSingle()
  if(!profile||!['super_admin','admin','lawyer','staff'].includes(profile.role)) return json({success:false,error:'صلاحية إدارية مطلوبة'},403)
  const body=await req.json(); const platform=String(body.platform||'')
  if(!platforms.has(platform)) return json({success:false,error:'منصة غير مدعومة'},400)
  const admin=createClient(url,service)
  try {
    if(body.action==='disconnect') {
      await admin.from('marketing_connections').update({status:'not_configured',token_status:'missing',account_name:null,account_id:null,last_error:null}).eq('platform',platform)
      return json({success:true})
    }
    if(body.action==='connect') {
      const credentials=body.credentials||{}
      const verified=await verify(platform,credentials)
      const {error:secretError}=await admin.rpc('save_marketing_credentials',{p_platform:platform,p_credentials:JSON.stringify(credentials)})
      if(secretError) throw secretError
      const {error}=await admin.from('marketing_connections').update({account_name:verified.accountName,account_id:verified.accountId,scopes:verified.scopes,status:'connected',token_status:'valid',connected_at:new Date().toISOString(),last_sync_at:new Date().toISOString(),last_error:null}).eq('platform',platform)
      if(error) throw error
      return json({success:true,...verified})
    }
    return json({success:false,error:'إجراء غير مدعوم'},400)
  } catch(e) {
    const message=e instanceof Error?e.message:'تعذر ربط المنصة'
    await admin.from('marketing_connections').update({status:'error',last_error:message}).eq('platform',platform)
    return json({success:false,error:message},400)
  }
})
