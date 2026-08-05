/**
 * مخزن بيانات مركز التسويق الذكي — طبقة بيانات مستقلة على LocalStorage.
 * يتبع نفس نمط src/lib/store.ts (db على مستوى الوحدة + saveDb + wait + uid).
 */
import * as demo from '../../data/marketing-demo'
import { supabase } from '../supabase'
import type {
  Ad,
  AIConversation,
  AIInsight,
  AIProviderConfig,
  AIUsage,
  Approval,
  ApprovalStatus,
  BrandKit,
  Campaign,
  CampaignStatus,
  ChatMessage,
  ConnectionStatus,
  ContentItem,
  ContentStatus,
  ContentType,
  ConversionEvent,
  MarketingAuditLog,
  MarketingConnection,
  MarketingJob,
  PlatformId,
} from '../../types/marketing'

const STORAGE_KEY = 'lawyer_firm_marketing_v1'

interface MarketingDb {
  connections: MarketingConnection[]
  campaigns: Campaign[]
  contentItems: ContentItem[]
  brandKit: BrandKit
  insights: AIInsight[]
  aiProviders: AIProviderConfig[]
  aiUsage: AIUsage[]
  conversations: AIConversation[]
  approvals: Approval[]
  conversions: ConversionEvent[]
  auditLogs: MarketingAuditLog[]
  jobs: MarketingJob[]
}

function seedDb(): MarketingDb {
  return {
    connections: [
      { id: 'conn-meta', platform: 'meta', status: 'not_configured', scopes: [] },
      { id: 'conn-google', platform: 'google', status: 'not_configured', scopes: [] },
      { id: 'conn-tiktok', platform: 'tiktok', status: 'not_configured', scopes: [] },
      { id: 'conn-snapchat', platform: 'snapchat', status: 'not_configured', scopes: [] },
    ],
    campaigns: [],
    contentItems: [],
    brandKit: JSON.parse(JSON.stringify(demo.demoBrandKit)) as BrandKit,
    insights: [],
    aiProviders: demo.demoAiProviders.map((p) => ({
      ...p,
      status: p.id === 'openrouter' || p.id === 'aip-openai' ? 'active' : 'not_configured',
      apiKey: p.apiKey,
      models: p.models.map((m) => ({ ...m }))
    })),
    aiUsage: [],
    conversations: [],
    approvals: [],
    conversions: [],
    auditLogs: [],
    jobs: [],
  }
}

function loadDb(): MarketingDb {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as MarketingDb
      // تنظيف وإزالة أي بيانات تجريبية مخزنة مسبقاً تلقائياً
      const hasDemo = (parsed.campaigns || []).some((c) => c.demo) || (parsed.contentItems || []).some((c) => c.demo)
      if (hasDemo) {
        localStorage.removeItem(STORAGE_KEY)
        return seedDb()
      }
      return parsed
    }
  } catch (e) {
    console.error('Failed to load marketing DB state:', e)
  }
  return seedDb()
}

const db = loadDb()

function saveDb() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch (e) {
    console.error('Failed to save marketing DB state:', e)
  }
}

const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms))
const uid = () => `mkt-${Math.random().toString(36).slice(2, 10)}`

/** إضافة سجل تدقيق لكل عملية تعديل */
function audit(
  userName: string,
  action: string,
  entityType: string,
  entityId?: string,
  previousValue?: string,
  newValue?: string,
) {
  db.auditLogs.unshift({
    id: uid(),
    userName,
    action,
    entityType,
    entityId,
    previousValue,
    newValue,
    createdAt: new Date().toISOString(),
  })
  saveDb()
}

const DEFAULT_USER = 'أنت'

// ===== الاتصالات بالمنصات =====
export async function listConnections(): Promise<MarketingConnection[]> {
  const { data, error } = await supabase.from('marketing_connections').select('id,platform,account_name,account_id,status,scopes,connected_at,last_sync_at,token_status,last_error').order('platform')
  if (error) throw new Error(`تعذر تحميل اتصالات المنصات: ${error.message}`)
  return (data || []).map((r: any) => ({
    id: r.id, platform: r.platform, accountName: r.account_name || undefined,
    accountId: r.account_id || undefined, status: r.status, scopes: r.scopes || [],
    connectedAt: r.connected_at || undefined, lastSyncAt: r.last_sync_at || undefined,
    tokenStatus: r.token_status, error: r.last_error || undefined,
  }))
}

/** ربط منصة (عنصر نائب لعملية OAuth الحقيقية) */
export async function connectPlatform(
  platform: PlatformId,
  accountName: string,
  userName: string = DEFAULT_USER,
): Promise<MarketingConnection | undefined> {
  await wait(120)
  const conn = db.connections.find((c) => c.platform === platform)
  if (!conn) return undefined
  const prev: ConnectionStatus = conn.status
  conn.accountName = accountName
  conn.status = 'connected'
  conn.tokenStatus = 'valid'
  conn.connectedAt = new Date().toISOString()
  conn.error = undefined
  saveDb()
  audit(userName, 'ربط منصة إعلانية', 'connection', conn.id, prev, 'connected')
  return conn
}

export async function disconnectPlatform(
  platform: PlatformId,
  userName: string = DEFAULT_USER,
): Promise<MarketingConnection | undefined> {
  await wait(100)
  const conn = db.connections.find((c) => c.platform === platform)
  if (!conn) return undefined
  const prev: ConnectionStatus = conn.status
  conn.status = 'not_configured'
  conn.tokenStatus = 'missing'
  conn.accountName = undefined
  conn.accountId = undefined
  conn.scopes = []
  conn.connectedAt = undefined
  saveDb()
  audit(userName, 'فصل منصة إعلانية', 'connection', conn.id, prev, 'not_configured')
  return conn
}

export async function refreshConnection(
  platform: PlatformId,
  userName: string = DEFAULT_USER,
): Promise<MarketingConnection | undefined> {
  await wait(150)
  const conn = db.connections.find((c) => c.platform === platform)
  if (!conn) return undefined
  conn.lastSyncAt = new Date().toISOString()
  saveDb()
  audit(userName, 'مزامنة اتصال منصة', 'connection', conn.id)
  return conn
}

// ===== الحملات =====
export interface CampaignFilter {
  platform?: PlatformId
  status?: CampaignStatus
  service?: string
  search?: string
}

const mapCampaignRow = (r: any): Campaign => ({
  id: r.id, name: r.name, platform: r.platform, objective: r.objective,
  service: r.service, status: r.status, budgetType: r.budget_type,
  budget: Number(r.budget || 0), spend: Number(r.spend || 0),
  impressions: Number(r.impressions || 0), reach: Number(r.reach || 0),
  clicks: Number(r.clicks || 0), leads: Number(r.leads || 0),
  conversions: Number(r.conversions || 0), revenue: Number(r.revenue || 0),
  startDate: r.start_date || '', endDate: r.end_date || '', audience: r.audience || {},
  ads: Array.isArray(r.ads) ? r.ads : [], createdBy: r.created_by || '', createdAt: r.created_at,
})

export async function listCampaigns(filter?: CampaignFilter): Promise<Campaign[]> {
  let query = supabase.from('marketing_campaigns').select('*').order('created_at', { ascending: false })
  if (filter?.platform) query = query.eq('platform', filter.platform)
  if (filter?.status) query = query.eq('status', filter.status)
  if (filter?.service) query = query.eq('service', filter.service)
  if (filter?.search) query = query.or(`name.ilike.%${filter.search.trim()}%,service.ilike.%${filter.search.trim()}%`)
  const { data, error } = await query
  if (error) throw new Error(`تعذر تحميل الحملات: ${error.message}`)
  return (data || []).map(mapCampaignRow)
}

export async function getCampaign(id: string): Promise<Campaign | undefined> {
  const { data, error } = await supabase.from('marketing_campaigns').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(`تعذر تحميل الحملة: ${error.message}`)
  return data ? mapCampaignRow(data) : undefined
}

export type NewCampaignInput = Pick<
  Campaign,
  'name' | 'platform' | 'objective' | 'service' | 'budgetType' | 'budget' | 'startDate' | 'endDate' | 'audience'
> & { ads?: Ad[]; createdBy?: string }

export async function createCampaign(
  input: NewCampaignInput,
  userName: string = DEFAULT_USER,
): Promise<Campaign> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('marketing_campaigns').insert({
    name: input.name, platform: input.platform, objective: input.objective,
    service: input.service, budget_type: input.budgetType, budget: input.budget,
    start_date: input.startDate || null, end_date: input.endDate || null,
    audience: input.audience, ads: input.ads || [], created_by: user?.id || null,
  }).select('*').single()
  if (error) throw new Error(`تعذر إنشاء الحملة: ${error.message}`)
  return mapCampaignRow(data)
}

export async function updateCampaign(
  id: string,
  patch: Partial<Campaign>,
  userName: string = DEFAULT_USER,
): Promise<Campaign | undefined> {
  const dbPatch: any = { updated_at: new Date().toISOString() }
  const fields: Record<string,string> = { name:'name', platform:'platform', objective:'objective', service:'service', status:'status', budgetType:'budget_type', budget:'budget', spend:'spend', impressions:'impressions', reach:'reach', clicks:'clicks', leads:'leads', conversions:'conversions', revenue:'revenue', startDate:'start_date', endDate:'end_date', audience:'audience', ads:'ads' }
  for (const [key,column] of Object.entries(fields)) if ((patch as any)[key] !== undefined) dbPatch[column]=(patch as any)[key]
  const { data, error } = await supabase.from('marketing_campaigns').update(dbPatch).eq('id',id).select('*').maybeSingle()
  if (error) throw new Error(`تعذر تحديث الحملة: ${error.message}`)
  return data ? mapCampaignRow(data) : undefined
}

export async function setCampaignStatus(
  id: string,
  status: CampaignStatus,
  userName: string = DEFAULT_USER,
): Promise<Campaign | undefined> {
  return updateCampaign(id, { status }, userName)
}

export async function deleteCampaign(id: string, userName: string = DEFAULT_USER): Promise<boolean> {
  const { error, count } = await supabase.from('marketing_campaigns').delete({ count: 'exact' }).eq('id', id)
  if (error) throw new Error(`تعذر حذف الحملة: ${error.message}`)
  return Boolean(count)
}

// ===== المحتوى =====
export interface ContentFilter {
  type?: ContentType
  status?: ContentStatus
  search?: string
  tag?: string
}

export async function listContentItems(filter?: ContentFilter): Promise<ContentItem[]> {
  await wait()
  let list = [...db.contentItems]
  if (filter?.type) list = list.filter((c) => c.type === filter.type)
  if (filter?.status) list = list.filter((c) => c.status === filter.status)
  if (filter?.tag) list = list.filter((c) => c.tags.includes(filter.tag!))
  if (filter?.search) {
    const term = filter.search.trim().toLowerCase()
    list = list.filter(
      (c) => c.title.toLowerCase().includes(term) || (c.body ?? '').toLowerCase().includes(term),
    )
  }
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getContentItem(id: string): Promise<ContentItem | undefined> {
  await wait()
  return db.contentItems.find((c) => c.id === id)
}

export type NewContentInput = Omit<ContentItem, 'id' | 'createdAt' | 'status'> & { status?: ContentStatus }

export async function createContentItem(
  input: NewContentInput,
  userName: string = DEFAULT_USER,
): Promise<ContentItem> {
  await wait(100)
  const item: ContentItem = {
    ...input,
    id: uid(),
    status: input.status ?? 'draft',
    createdBy: input.createdBy || userName,
    createdAt: new Date().toISOString(),
  }
  db.contentItems.unshift(item)
  saveDb()
  audit(userName, 'إنشاء محتوى', 'content', item.id, undefined, item.title)
  return item
}

export async function updateContentItem(
  id: string,
  patch: Partial<ContentItem>,
  userName: string = DEFAULT_USER,
): Promise<ContentItem | undefined> {
  await wait(80)
  const item = db.contentItems.find((c) => c.id === id)
  if (!item) return undefined
  const prev = JSON.stringify({ title: item.title, status: item.status })
  Object.assign(item, patch, { id: item.id })
  saveDb()
  audit(userName, 'تحديث محتوى', 'content', id, prev, JSON.stringify({ title: item.title, status: item.status }))
  return item
}

export async function deleteContentItem(id: string, userName: string = DEFAULT_USER): Promise<boolean> {
  await wait(80)
  const idx = db.contentItems.findIndex((c) => c.id === id)
  if (idx === -1) return false
  const [removed] = db.contentItems.splice(idx, 1)
  saveDb()
  audit(userName, 'حذف محتوى', 'content', id, removed.title)
  return true
}

// ===== الموافقات =====
export async function listApprovals(status?: ApprovalStatus): Promise<Approval[]> {
  await wait()
  const list = status ? db.approvals.filter((a) => a.status === status) : db.approvals
  return [...list].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))
}

export async function requestApproval(
  entityType: 'campaign' | 'content',
  entityId: string,
  entityName: string,
  requestedBy: string,
): Promise<Approval> {
  await wait(100)
  const approval: Approval = {
    id: uid(),
    entityType,
    entityId,
    entityName,
    status: 'pending',
    requestedBy,
    requestedAt: new Date().toISOString(),
  }
  db.approvals.unshift(approval)

  // تحديث حالة الكيان إلى "بانتظار الاعتماد"
  if (entityType === 'campaign') {
    const c = db.campaigns.find((x) => x.id === entityId)
    if (c) c.status = 'pending_approval'
  } else {
    const c = db.contentItems.find((x) => x.id === entityId)
    if (c) c.status = 'pending_approval'
  }
  saveDb()
  audit(requestedBy, 'طلب اعتماد', entityType, entityId, undefined, entityName)
  return approval
}

export async function decideApproval(
  id: string,
  decision: 'approved' | 'rejected',
  decidedBy: string,
  note?: string,
): Promise<Approval | undefined> {
  await wait(100)
  const approval = db.approvals.find((a) => a.id === id)
  if (!approval) return undefined
  approval.status = decision
  approval.decidedBy = decidedBy
  approval.decidedAt = new Date().toISOString()
  approval.note = note

  if (approval.entityType === 'campaign') {
    const c = db.campaigns.find((x) => x.id === approval.entityId)
    if (c) c.status = decision === 'approved' ? 'approved' : 'rejected'
  } else {
    const c = db.contentItems.find((x) => x.id === approval.entityId)
    if (c) c.status = decision === 'approved' ? 'approved' : 'draft'
  }
  saveDb()
  audit(
    decidedBy,
    decision === 'approved' ? 'اعتماد' : 'رفض',
    approval.entityType,
    approval.entityId,
    'pending',
    decision,
  )
  return approval
}

// ===== الرؤى الذكية =====
export async function listInsights(): Promise<AIInsight[]> {
  await wait()
  return [...db.insights].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function setInsightStatus(
  id: string,
  status: AIInsight['status'],
  userName: string = DEFAULT_USER,
): Promise<AIInsight | undefined> {
  await wait(60)
  const insight = db.insights.find((i) => i.id === id)
  if (!insight) return undefined
  const prev = insight.status
  insight.status = status
  saveDb()
  audit(userName, 'تحديث حالة رؤية', 'insight', id, prev, status)
  return insight
}

/** محرك رؤى قائم على القواعد — يحسب من بيانات الحملات الحالية */
export async function generateInsights(): Promise<AIInsight[]> {
  await wait(200)
  const now = new Date().toISOString()
  const fresh: AIInsight[] = []
  const withSpend = db.campaigns.filter((c) => c.spend > 0)
  const withLeads = withSpend.filter((c) => c.leads > 0)

  // أفضل وأسوأ حملة حسب تكلفة العميل المحتمل
  if (withLeads.length >= 2) {
    const byCpl = [...withLeads].sort((a, b) => a.spend / a.leads - b.spend / b.leads)
    const best = byCpl[0]
    const worst = byCpl[byCpl.length - 1]
    fresh.push({
      id: uid(),
      kind: 'positive',
      text: `حملة «${best.name}» تسجل حاليًا أقل تكلفة للعميل المحتمل بمتوسط ${Math.round(best.spend / best.leads)} ريال — ويمكن دراسة زيادة الميزانية تدريجيًا مع متابعة الجودة والالتزام.`,
      campaignId: best.id,
      action: { type: 'increase_budget', label: 'زيادة الميزانية 20%', payload: { campaignId: best.id, increasePct: 20 } },
      status: 'new',
      createdAt: now,
    })
    if (worst.id !== best.id && worst.spend / worst.leads > 1.5 * (best.spend / best.leads)) {
      fresh.push({
        id: uid(),
        kind: 'warning',
        text: `حملة «${worst.name}» تسجل أعلى تكلفة عميل محتمل (${Math.round(worst.spend / worst.leads)} ريال) — راجع الاستهداف أو النص الإعلاني.`,
        campaignId: worst.id,
        action: { type: 'change_copy', label: 'اقتراح نص إعلاني بديل', payload: { campaignId: worst.id } },
        status: 'new',
        createdAt: now,
      })
    }
  }

  // حملات بلا عملاء محتملين مع إنفاق مرتفع
  for (const c of withSpend.filter((x) => x.leads === 0 && x.spend > 500)) {
    fresh.push({
      id: uid(),
      kind: 'warning',
      text: `حملة «${c.name}» أنفقت ${Math.round(c.spend)} ريال دون أي عميل محتمل — يُنصح بإيقافها مؤقتًا ومراجعة الإعلانات.`,
      campaignId: c.id,
      action: { type: 'pause_campaign', label: 'إيقاف الحملة مؤقتًا', payload: { campaignId: c.id } },
      status: 'new',
      createdAt: now,
    })
  }

  // ميزانية شبه مستنفدة (إنفاق > 85% من الميزانية الإجمالية)
  for (const c of db.campaigns.filter((x) => x.budgetType === 'total' && x.budget > 0 && x.spend / x.budget > 0.85 && x.status === 'active')) {
    fresh.push({
      id: uid(),
      kind: 'suggestion',
      text: `حملة «${c.name}» استهلكت ${Math.round((c.spend / c.budget) * 100)}% من ميزانيتها — قرر: زيادة الميزانية أو إنهاء الحملة.`,
      campaignId: c.id,
      action: { type: 'increase_budget', label: 'زيادة الميزانية', payload: { campaignId: c.id } },
      status: 'new',
      createdAt: now,
    })
  }

  // إعلانات بإنفاق مرتفع وبلا تحويلات
  for (const c of withSpend) {
    for (const ad of c.ads.filter((a) => a.spend > 500 && a.conversions === 0)) {
      fresh.push({
        id: uid(),
        kind: 'warning',
        text: `الإعلان «${ad.name}» في حملة «${c.name}» أنفق ${Math.round(ad.spend)} ريال دون تحويلات — جرّب مادة إبداعية جديدة.`,
        campaignId: c.id,
        action: { type: 'create_creative', label: 'إنشاء مادة إبداعية بديلة', payload: { campaignId: c.id, adId: ad.id } },
        status: 'new',
        createdAt: now,
      })
    }
  }

  // استبدال الرؤى ذات الحالة "جديدة" فقط
  db.insights = [...fresh, ...db.insights.filter((i) => i.status !== 'new')]
  saveDb()
  return [...db.insights]
}

// ===== مزودو الذكاء الاصطناعي والاستخدام =====
export async function listAiProviders(): Promise<AIProviderConfig[]> {
  await wait()
  return [...db.aiProviders]
}

export async function updateAiProvider(
  id: string,
  patch: Partial<AIProviderConfig>,
  userName: string = DEFAULT_USER,
): Promise<AIProviderConfig | undefined> {
  await wait(100)
  const provider = db.aiProviders.find((p) => p.id === id)
  if (!provider) return undefined
  const prevStatus = provider.status
  Object.assign(provider, patch, { id: provider.id })
  if (patch.apiKey && provider.status === 'not_configured') provider.status = 'active'
  saveDb()
  // لا تُسجل قيمة مفتاح API مطلقًا — تُخفى دائمًا
  audit(userName, 'تحديث إعدادات مزود ذكاء اصطناعي', 'ai_provider', id, prevStatus, patch.apiKey ? 'apiKey: •••' : provider.status)
  return provider
}

export async function recordAiUsage(
  entry: Omit<AIUsage, 'id' | 'createdAt'>,
): Promise<AIUsage> {
  await wait(40)
  const usage: AIUsage = { ...entry, id: uid(), createdAt: new Date().toISOString() }
  db.aiUsage.unshift(usage)
  saveDb()
  return usage
}

export async function listAiUsage(filter?: { from?: string; to?: string }): Promise<AIUsage[]> {
  await wait()
  let list = [...db.aiUsage]
  if (filter?.from) list = list.filter((u) => u.createdAt >= filter.from!)
  if (filter?.to) list = list.filter((u) => u.createdAt <= filter.to!)
  return list
}

// ===== المحادثات =====
export async function listConversations(): Promise<AIConversation[]> {
  await wait()
  return [...db.conversations].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getConversation(id: string): Promise<AIConversation | undefined> {
  await wait()
  return db.conversations.find((c) => c.id === id)
}

export async function createConversation(title = 'محادثة جديدة'): Promise<AIConversation> {
  await wait(60)
  const conv: AIConversation = { id: uid(), title, messages: [], createdAt: new Date().toISOString() }
  db.conversations.unshift(conv)
  saveDb()
  return conv
}

export async function appendMessage(
  conversationId: string,
  msg: Omit<ChatMessage, 'createdAt'>,
): Promise<AIConversation | undefined> {
  await wait(40)
  const conv = db.conversations.find((c) => c.id === conversationId)
  if (!conv) return undefined
  conv.messages.push({ ...msg, createdAt: new Date().toISOString() })
  if (conv.messages.length === 1 && msg.role === 'user') {
    conv.title = msg.content.slice(0, 40)
  }
  saveDb()
  return conv
}

export async function deleteConversation(id: string): Promise<boolean> {
  await wait(60)
  const idx = db.conversations.findIndex((c) => c.id === id)
  if (idx === -1) return false
  db.conversations.splice(idx, 1)
  saveDb()
  return true
}

// ===== أحداث التحويل =====
export async function listConversions(): Promise<ConversionEvent[]> {
  await wait()
  return [...db.conversions].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function recordConversion(event: Omit<ConversionEvent, 'id' | 'createdAt'>): Promise<ConversionEvent> {
  await wait(40)
  const conv: ConversionEvent = { ...event, id: uid(), createdAt: new Date().toISOString() }
  db.conversions.unshift(conv)
  saveDb()
  return conv
}

// ===== هوية العلامة التجارية =====
export async function getBrandKit(): Promise<BrandKit> {
  await wait()
  if (db.brandKit.brandVersion !== 'official-2025-v1') {
    Object.assign(db.brandKit, {
      brandVersion: 'official-2025-v1',
      colors: { primary: '#243447', secondary: '#33485E', accent: '#D4AF7A' },
      officialPalette: { navy: '#243447', navyLight: '#33485E', gold: '#D4AF7A', warmGray: '#BFBAB0', ivory: '#F4F0EB' },
      fonts: ['Tajawal', 'Amiri', 'Cairo', 'Noto Kufi Arabic', 'Noto Naskh Arabic'],
      defaultFont: 'Tajawal',
      generationDefaults: { quality: 'medium', maxImagesPerAction: 1, confirmHighQuality: true },
      styleGuidelines: 'الهوية الرسمية: كحلي #243447، كحلي ثانوي #33485E، ذهبي #D4AF7A، رمادي دافئ #BFBAB0، وعاجي #F4F0EB. زخرفة هندسية عربية رفيعة عند الأطراف، مساحات واسعة، وتكوين قانوني فاخر.',
      aiInstructions: 'طبّق هوية بن نوح الرسمية المحفوظة دون إعادة تحليلها. استخدم الألوان الرسمية والزخرفة الهندسية باعتدال. اكتب بالعربية الفصيحة، ولا تحاول تقليد خط الشعار؛ استخدم خط الحملة المحدد.',
    })
    saveDb()
  }
  return db.brandKit
}

export async function updateBrandKit(
  patch: Partial<BrandKit>,
  userName: string = DEFAULT_USER,
): Promise<BrandKit> {
  await wait(100)
  Object.assign(db.brandKit, patch)
  saveDb()
  audit(userName, 'تحديث الهوية التجارية', 'brand_kit', undefined, undefined, JSON.stringify(Object.keys(patch)))
  return db.brandKit
}

// ===== مهام الخلفية =====
export async function listJobs(): Promise<MarketingJob[]> {
  await wait()
  return [...db.jobs].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function listAuditLogs(): Promise<MarketingAuditLog[]> {
  await wait()
  return [...db.auditLogs].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function upsertJob(job: MarketingJob): Promise<MarketingJob> {
  await wait(40)
  const idx = db.jobs.findIndex((j) => j.id === job.id)
  if (idx === -1) db.jobs.unshift(job)
  else db.jobs[idx] = job
  saveDb()
  return job
}

// ===== الإحصائيات =====
export interface MarketingStats {
  totalSpend: number
  activeCampaigns: number
  totalLeads: number
  totalConversions: number
  cpl: number
  cpa: number
  conversionRate: number
  roas: number
  impressions: number
  clicks: number
  ctr: number
  reach: number
  revenue: number
  bestCampaign?: Campaign
  worstCampaign?: Campaign
  bestPlatform?: PlatformId
  bestAd?: Ad
}

export async function getMarketingStats(filter?: {
  from?: string
  to?: string
  platform?: PlatformId
}): Promise<MarketingStats> {
  let list = await listCampaigns(filter?.platform ? { platform: filter.platform } : undefined)
  if (filter?.platform) list = list.filter((c) => c.platform === filter.platform)
  if (filter?.from) list = list.filter((c) => c.endDate >= filter.from! || c.startDate >= filter.from!)
  if (filter?.to) list = list.filter((c) => c.startDate <= filter.to!)

  const sum = (fn: (c: Campaign) => number) => list.reduce((acc, c) => acc + fn(c), 0)
  const totalSpend = sum((c) => c.spend)
  const totalLeads = sum((c) => c.leads)
  const totalConversions = sum((c) => c.conversions)
  const revenue = sum((c) => c.revenue)
  const impressions = sum((c) => c.impressions)
  const clicks = sum((c) => c.clicks)
  const reach = sum((c) => c.reach)

  const withLeads = list.filter((c) => c.leads > 0)
  const bestCampaign = withLeads.length
    ? [...withLeads].sort((a, b) => a.spend / a.leads - b.spend / b.leads)[0]
    : undefined
  const worstCandidates = list.filter((c) => (c.leads === 0 && c.spend > 500) || c.leads > 0)
  const worstCampaign = worstCandidates.length
    ? [...worstCandidates].sort((a, b) => {
        const cplA = a.leads > 0 ? a.spend / a.leads : Number.MAX_SAFE_INTEGER
        const cplB = b.leads > 0 ? b.spend / b.leads : Number.MAX_SAFE_INTEGER
        return cplB - cplA
      })[0]
    : undefined

  // أفضل منصة: أقل تكلفة عميل محتمل مجمعة
  const byPlatform = new Map<PlatformId, { spend: number; leads: number }>()
  for (const c of list) {
    const agg = byPlatform.get(c.platform) ?? { spend: 0, leads: 0 }
    agg.spend += c.spend
    agg.leads += c.leads
    byPlatform.set(c.platform, agg)
  }
  let bestPlatform: PlatformId | undefined
  let bestCpl = Infinity
  for (const [platform, agg] of byPlatform) {
    if (agg.leads > 0 && agg.spend / agg.leads < bestCpl) {
      bestCpl = agg.spend / agg.leads
      bestPlatform = platform
    }
  }

  // أفضل إعلان: الأكثر تحويلات
  const allAds = list.flatMap((c) => c.ads)
  const bestAd = allAds.length ? [...allAds].sort((a, b) => b.conversions - a.conversions)[0] : undefined

  return {
    totalSpend,
    activeCampaigns: list.filter((c) => c.status === 'active').length,
    totalLeads,
    totalConversions,
    cpl: totalLeads > 0 ? totalSpend / totalLeads : 0,
    cpa: totalConversions > 0 ? totalSpend / totalConversions : 0,
    conversionRate: totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0,
    roas: totalSpend > 0 ? revenue / totalSpend : 0,
    impressions,
    clicks,
    ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
    reach,
    revenue,
    bestCampaign,
    worstCampaign,
    bestPlatform,
    bestAd,
  }
}

// ===== حذف البيانات التجريبية =====
export async function clearDemoData(userName: string = DEFAULT_USER): Promise<void> {
  await wait(100)
  db.campaigns = db.campaigns.filter((c) => !c.demo)
  db.contentItems = db.contentItems.filter((c) => !c.demo)
  db.insights = []
  db.approvals = []
  saveDb()
  audit(userName, 'حذف البيانات التجريبية', 'system')
}

// ===== الواجهة المتزامنة — تحاكي store في store.ts =====
export const marketingStore = {
  getCampaigns: () => db.campaigns,
  getCampaign: (id: string) => db.campaigns.find((c) => c.id === id),
  getConnections: () => db.connections,
  getContentItems: () => db.contentItems,
  getContentItem: (id: string) => db.contentItems.find((c) => c.id === id),
  getBrandKit: () => db.brandKit,
  getInsights: () => db.insights,
  getAiProviders: () => db.aiProviders,
  getAiUsage: () => db.aiUsage,
  getConversations: () => db.conversations,
  getApprovals: () => db.approvals,
  getConversions: () => db.conversions,
  getAuditLogs: () => db.auditLogs,
  getJobs: () => db.jobs,
}
