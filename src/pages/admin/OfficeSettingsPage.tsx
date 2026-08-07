import { useEffect,useState } from 'react'
import { useMutation,useQuery } from '@tanstack/react-query'
import { Building2,Download,Save,ShieldCheck } from 'lucide-react'
import{PageHeader}from'../../components/ui/page-header';import{Card}from'../../components/ui/card';import{Button}from'../../components/ui/button';import{Input}from'../../components/ui/input';import{useToast}from'../../components/ui/toast'
import{exportOperationalBackup,getBusinessSettings,saveBusinessSettings,type BusinessSettings}from'../../lib/billing'
const empty:BusinessSettings={
  legalName:'مكتب المحامي احمد عبد الحفيظ عبد الرحمن بن نوح للمحاماة و الاستشارت القانونية',
  commercialRegistration:'7050561203',
  vatNumber:'',
  address:'8006 طريق الملك فهد الفرعي، حي المحمدية، الرياض 12363، المملكة العربية السعودية',
  phone:'966500424282',
  email:'ahmednouh42@gmail.com',
  iban:'',
  bankName:'',
  invoicePrefix:'INV',
  fiscalYearStart:1,
  vatRate:15
}
export default function OfficeSettingsPage(){const{toast}=useToast();const[s,setS]=useState(empty);const{data}=useQuery({queryKey:['business-settings'],queryFn:getBusinessSettings});useEffect(()=>{if(data)setS(data)},[data]);const save=useMutation({mutationFn:()=>saveBusinessSettings(s),onSuccess:()=>toast('تم حفظ بيانات المكتب'),onError:(e:Error)=>toast(e.message,'error')});async function backup(){try{const json=await exportOperationalBackup();const blob=new Blob([json],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`bin-nouh-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);toast('تم تنزيل النسخة التشغيلية')}catch(e){toast((e as Error).message,'error')}}const field=(key:keyof BusinessSettings,label:string,type='text')=><label className="space-y-1.5"><span className="text-xs font-bold text-ink">{label}</span><Input type={type} value={String(s[key])} onChange={e=>setS({...s,[key]:type==='number'?Number(e.target.value):e.target.value})}/></label>
return <div className="space-y-6 pb-12"><PageHeader title="بيانات المكتب والجاهزية" description="البيانات الرسمية المستخدمة في الفواتير والتقارير" actions={<div className="flex gap-2"><Button id="tour-office-backup" variant="outline" onClick={backup}><Download className="size-4"/>نسخة تشغيلية</Button><Button id="tour-office-save" onClick={()=>save.mutate()} className="bg-navy text-white"><Save className="size-4"/>حفظ</Button></div>}/><Card id="tour-office-form" className="grid gap-4 bg-white p-6 md:grid-cols-2">{field('legalName','الاسم القانوني للمكتب')}{field('commercialRegistration','السجل التجاري / الترخيص')}{field('vatNumber','الرقم الضريبي')}{field('phone','رقم التواصل')}{field('email','البريد الإلكتروني')}{field('address','العنوان الوطني')}{field('bankName','اسم البنك')}{field('iban','الآيبان')}{field('invoicePrefix','بادئة أرقام الفواتير')}{field('vatRate','نسبة الضريبة %','number')}{field('fiscalYearStart','شهر بداية السنة المالية','number')}</Card><Card className="border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900"><ShieldCheck className="mb-2 size-5"/><strong>تنبيه:</strong> النسخة التشغيلية تنزيل يدوي للبيانات وليست بديلًا عن نسخ Supabase المُدارة. لا تعتمد الإقرار الضريبي قبل مراجعة محاسب مرخص.</Card></div>}
