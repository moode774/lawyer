/**
 * طبقة بيانات السجلات (عملاء · قضايا · مهام · مستندات) — Supabase حصرًا.
 *
 * سبب وجود هذا الملف: كانت هذه الكيانات تُحفظ في localStorage داخل store.ts،
 * فلا يراها إلا الجهاز الذي أنشأها، وتضيع بمسح ذاكرة المتصفح، ولا تظهر في
 * شاشة الفواتير التي تقرأ العملاء من قاعدة البيانات. كل شيء هنا يذهب للخادم.
 *
 * متتبّعات activity_log مركّبة على هذه الجداول الأربعة، فكل عملية تُسجَّل
 * باسم منفّذها تلقائيًا دون أي استدعاء إضافي من الواجهة.
 */
import { supabase } from './supabase'
import type { Client, Doc, Matter, Task } from '../types'

/* ── محوّلات الصفوف ─────────────────────────────────────────── */

const mapClient = (r: any): Client => ({
  id: r.id,
  ref: r.reference_number,
  type: r.client_type,
  name: r.full_name,
  phone: r.phone || '',
  email: r.email || undefined,
  company: r.company_name || undefined,
  nationalId: r.national_id_cr || undefined,
  address: r.address || undefined,
  notes: r.notes || undefined,
  portalAccess: Boolean(r.user_id),
  convertedFromLeadId: r.converted_from_lead_id || undefined,
  createdAt: r.created_at,
})

const mapMatter = (r: any): Matter => ({
  id: r.id,
  ref: r.reference_number,
  clientId: r.client_id,
  title: r.title,
  category: r.category || '',
  status: r.status,
  assignedLawyer: r.assigned_lawyer_id || '',
  team: [],
  court: r.court_or_authority || undefined,
  description: r.description || undefined,
  importantDates: Array.isArray(r.important_dates) ? r.important_dates : [],
  createdAt: r.created_at,
})

const mapTask = (r: any): Task => ({
  id: r.id,
  title: r.title,
  description: r.description || undefined,
  entityType: r.matter_id ? 'matter' : r.client_id ? 'client' : r.lead_id ? 'lead' : undefined,
  entityId: r.matter_id || r.client_id || r.lead_id || undefined,
  assignedTo: r.assigned_to_id || '',
  dueDate: r.due_date || '',
  priority: r.priority,
  status: r.status,
  createdAt: r.created_at,
})

const mapDoc = (r: any): Doc => ({
  id: r.id,
  name: r.name,
  category: r.category,
  size: r.size_human || undefined,
  uploadedAt: r.created_at,
  clientId: r.client_id || undefined,
  leadId: r.lead_id || undefined,
  matterId: r.matter_id || undefined,
  visibility: r.visibility,
})

/** ترقيم مرجعي متسلسل يعتمد على عدد السجلات القائمة في الخادم. */
async function nextRef(table: 'clients' | 'matters', prefix: string) {
  const { count } = await supabase.from(table).select('id', { count: 'exact', head: true })
  return `${prefix}-${new Date().getFullYear()}-${String((count ?? 0) + 1).padStart(4, '0')}`
}

function fail(action: string, message: string): never {
  throw new Error(`${action}: ${message}`)
}

/* ── العملاء ────────────────────────────────────────────────── */

export async function listClients(): Promise<Client[]> {
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
  if (error) fail('تعذر تحميل العملاء', error.message)
  return (data ?? []).map(mapClient)
}

export async function getClient(id: string): Promise<Client | undefined> {
  const { data, error } = await supabase.from('clients').select('*').eq('id', id).maybeSingle()
  if (error) fail('تعذر تحميل بيانات العميل', error.message)
  return data ? mapClient(data) : undefined
}

export interface NewClientInput {
  name: string
  phone: string
  email?: string
  type?: Client['type']
  company?: string
  nationalId?: string
  address?: string
  notes?: string
  convertedFromLeadId?: string
}

export async function createClient(input: NewClientInput): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .insert({
      reference_number: await nextRef('clients', 'CL'),
      full_name: input.name.trim(),
      client_type: input.type || 'individual',
      phone: input.phone.trim(),
      email: input.email?.trim() || null,
      company_name: input.company?.trim() || null,
      national_id_cr: input.nationalId?.trim() || null,
      address: input.address?.trim() || null,
      notes: input.notes?.trim() || null,
      converted_from_lead_id: input.convertedFromLeadId || null,
    })
    .select()
    .single()

  if (error) fail('تعذر حفظ العميل', error.message)
  return mapClient(data)
}

export async function updateClient(id: string, patch: Partial<NewClientInput>): Promise<void> {
  const payload: Record<string, unknown> = {}
  if (patch.name !== undefined) payload.full_name = patch.name.trim()
  if (patch.phone !== undefined) payload.phone = patch.phone.trim()
  if (patch.email !== undefined) payload.email = patch.email?.trim() || null
  if (patch.company !== undefined) payload.company_name = patch.company?.trim() || null
  if (patch.nationalId !== undefined) payload.national_id_cr = patch.nationalId?.trim() || null
  if (patch.address !== undefined) payload.address = patch.address?.trim() || null
  if (patch.notes !== undefined) payload.notes = patch.notes?.trim() || null

  const { error } = await supabase.from('clients').update(payload).eq('id', id)
  if (error) fail('تعذر تحديث بيانات العميل', error.message)
}

/** تحويل عميل محتمل إلى عميل مكتسب — عمليتان مترابطتان على الخادم. */
export async function convertLeadToClient(leadId: string): Promise<Client> {
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('id, full_name, phone, email, company_name, client_type, notes')
    .eq('id', leadId)
    .maybeSingle()

  if (leadError) fail('تعذر قراءة بيانات العميل المحتمل', leadError.message)
  if (!lead) fail('تعذر التحويل', 'العميل المحتمل غير موجود')

  const existing = await supabase.from('clients').select('*').eq('converted_from_lead_id', leadId).maybeSingle()
  if (existing.data) return mapClient(existing.data)

  const client = await createClient({
    name: lead.full_name,
    phone: lead.phone,
    email: lead.email || undefined,
    company: lead.company_name || undefined,
    type: lead.client_type,
    notes: lead.notes || undefined,
    convertedFromLeadId: leadId,
  })

  // تحديث حالة العميل المحتمل بعد نجاح الإنشاء، حتى لا تُفقد الإشارة إن فشل الحفظ.
  const { error: stageError } = await supabase
    .from('leads')
    .update({ status: 'won', last_activity_at: new Date().toISOString() })
    .eq('id', leadId)
  if (stageError) fail('تم إنشاء العميل لكن تعذر تحديث حالة الطلب', stageError.message)

  return client
}

/* ── القضايا ────────────────────────────────────────────────── */

export async function listMatters(clientId?: string): Promise<Matter[]> {
  let query = supabase.from('matters').select('*').order('created_at', { ascending: false })
  if (clientId) query = query.eq('client_id', clientId)

  const { data, error } = await query
  if (error) fail('تعذر تحميل القضايا', error.message)
  return (data ?? []).map(mapMatter)
}

export async function getMatter(id: string): Promise<Matter | undefined> {
  const { data, error } = await supabase.from('matters').select('*').eq('id', id).maybeSingle()
  if (error) fail('تعذر تحميل بيانات القضية', error.message)
  return data ? mapMatter(data) : undefined
}

export interface NewMatterInput {
  clientId: string
  title: string
  category?: string
  status?: Matter['status']
  court?: string
  description?: string
}

export async function createMatter(input: NewMatterInput): Promise<Matter> {
  const { data, error } = await supabase
    .from('matters')
    .insert({
      reference_number: await nextRef('matters', 'MT'),
      client_id: input.clientId,
      title: input.title.trim(),
      category: input.category?.trim() || null,
      status: input.status || 'new',
      court_or_authority: input.court?.trim() || null,
      description: input.description?.trim() || null,
    })
    .select()
    .single()

  if (error) fail('تعذر حفظ القضية', error.message)
  return mapMatter(data)
}

export async function updateMatterStatus(id: string, status: Matter['status']): Promise<void> {
  const { error } = await supabase.from('matters').update({ status }).eq('id', id)
  if (error) fail('تعذر تحديث حالة القضية', error.message)
}

/* ── المهام ─────────────────────────────────────────────────── */

export async function listTasks(): Promise<Task[]> {
  const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
  if (error) fail('تعذر تحميل المهام', error.message)
  return (data ?? []).map(mapTask)
}

export interface NewTaskInput {
  title: string
  description?: string
  entityType?: 'lead' | 'client' | 'matter'
  entityId?: string
  dueDate?: string
  priority?: Task['priority']
  status?: Task['status']
}

export async function createTask(input: NewTaskInput): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: input.title.trim(),
      description: input.description?.trim() || null,
      lead_id: input.entityType === 'lead' ? input.entityId : null,
      client_id: input.entityType === 'client' ? input.entityId : null,
      matter_id: input.entityType === 'matter' ? input.entityId : null,
      due_date: input.dueDate || null,
      priority: input.priority || 'normal',
      status: input.status || 'todo',
    })
    .select()
    .single()

  if (error) fail('تعذر حفظ المهمة', error.message)
  return mapTask(data)
}

export async function updateTaskStatus(id: string, status: Task['status']): Promise<void> {
  const { error } = await supabase.from('tasks').update({ status }).eq('id', id)
  if (error) fail('تعذر تحديث حالة المهمة', error.message)
}

/* ── المستندات ──────────────────────────────────────────────── */

export async function listDocuments(): Promise<Doc[]> {
  const { data, error } = await supabase.from('documents').select('*').order('created_at', { ascending: false })
  if (error) fail('تعذر تحميل المستندات', error.message)
  return (data ?? []).map(mapDoc)
}

export interface NewDocInput {
  name: string
  category: Doc['category']
  sizeHuman?: string
  filePath?: string
  clientId?: string
  leadId?: string
  matterId?: string
  visibility?: Doc['visibility']
}

export async function createDocument(input: NewDocInput): Promise<Doc> {
  const { data, error } = await supabase
    .from('documents')
    .insert({
      name: input.name.trim(),
      category: input.category,
      size_human: input.sizeHuman || null,
      file_path: input.filePath || null,
      client_id: input.clientId || null,
      lead_id: input.leadId || null,
      matter_id: input.matterId || null,
      visibility: input.visibility || 'internal',
    })
    .select()
    .single()

  if (error) fail('تعذر حفظ المستند', error.message)
  return mapDoc(data)
}

/* ── مؤشرات مركز العمليات ───────────────────────────────────── */

export interface DashboardStats {
  leads: number
  clients: number
  matters: number
  openTasks: number
  appointments: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const countOf = async (table: string, filter?: (q: any) => any) => {
    let q = supabase.from(table).select('id', { count: 'exact', head: true })
    if (filter) q = filter(q)
    const { count, error } = await q
    if (error) fail(`تعذر حساب ${table}`, error.message)
    return count ?? 0
  }

  const [leads, clients, matters, openTasks, appointments] = await Promise.all([
    countOf('leads'),
    countOf('clients'),
    countOf('matters'),
    countOf('tasks', (q) => q.neq('status', 'done')),
    countOf('appointments'),
  ])

  return { leads, clients, matters, openTasks, appointments }
}
