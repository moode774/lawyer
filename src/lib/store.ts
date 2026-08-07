/**
 * Persistent Data Store — طبقة البيانات المترابطة مع Supabase و LocalStorage.
 */
import * as demo from '../data/demo'
import type {
  Activity,
  Appointment,
  Client,
  Doc,
  Lead,
  Message,
  NotificationItem,
  PipelineStage,
  Task,
} from '../types'
import { supabase } from './supabase'

const STORAGE_KEY = 'lawyer_firm_db_clean_v3'

function loadLocalDb() {
  try {
    localStorage.removeItem('lawyer_firm_db_v1')
    localStorage.removeItem('lawyer_firm_db_v2')
    localStorage.removeItem('lawyer_firm_db_v3')
    localStorage.removeItem('lawyer_firm_db_clean_v1')
    localStorage.removeItem('lawyer_firm_db_clean_v2')
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load local DB state:', e)
  }
  return {
    leads: [],
    clients: [],
    matters: [],
    appointments: [],
    documents: [],
    tasks: [],
    activities: [],
    messages: [],
    notifications: [],
    users: [...demo.users],
  }
}

const db = loadLocalDb()

function saveDb() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch (e) {
    console.error('Failed to save DB state:', e)
  }
}

const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms))
const uid = () => `id-${Math.random().toString(36).slice(2, 10)}`

let leadSeq = 150 + db.leads.length
let bookingSeq = 210 + db.appointments.length
let clientSeq = 50 + db.clients.length

function logActivity(a: Omit<Activity, 'id' | 'createdAt'>) {
  db.activities.unshift({ ...a, id: uid(), createdAt: new Date().toISOString() })
  saveDb()
}

function notify(n: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) {
  db.notifications.unshift({ ...n, id: uid(), read: false, createdAt: new Date().toISOString() })
  saveDb()
}

function queueWhatsApp(to: string, body: string, entityType?: 'lead' | 'client', entityId?: string) {
  db.messages.unshift({
    id: uid(),
    channel: 'whatsapp',
    direction: 'outgoing',
    to,
    body,
    templateId: 'lead_confirmation',
    status: 'queued',
    entityType,
    entityId,
    createdAt: new Date().toISOString(),
  })
  saveDb()
}

// ===== Global Search & Notifications =====
export interface SearchResult {
  kind: 'lead' | 'client' | 'matter' | 'document'
  id: string
  title: string
  subtitle: string
  link: string
}

/** بحث شامل عبر قاعدة البيانات — يشمل ما أدخله بقية الفريق لا هذا الجهاز فقط. */
export async function globalSearch(q: string): Promise<SearchResult[]> {
  const term = q.trim()
  if (!term) return []
  const like = `%${term}%`

  const [leads, clients, matters, documents] = await Promise.all([
    supabase.from('leads').select('id, reference_number, full_name, category')
      .or(`full_name.ilike.${like},reference_number.ilike.${like},phone.ilike.${like}`).limit(5),
    supabase.from('clients').select('id, reference_number, full_name')
      .or(`full_name.ilike.${like},reference_number.ilike.${like},phone.ilike.${like}`).limit(5),
    supabase.from('matters').select('id, reference_number, title')
      .or(`title.ilike.${like},reference_number.ilike.${like}`).limit(5),
    supabase.from('documents').select('id, name, category').ilike('name', like).limit(5),
  ])

  const res: SearchResult[] = []

  ;(leads.data ?? []).forEach((l) =>
    res.push({ kind: 'lead', id: l.id, title: l.full_name, subtitle: `طلب ${l.reference_number} • ${l.category ?? ''}`, link: `/admin/leads/${l.id}` }))

  ;(clients.data ?? []).forEach((c) =>
    res.push({ kind: 'client', id: c.id, title: c.full_name, subtitle: `عميل ${c.reference_number}`, link: `/admin/clients/${c.id}` }))

  ;(matters.data ?? []).forEach((m) =>
    res.push({ kind: 'matter', id: m.id, title: m.title, subtitle: `قضية ${m.reference_number}`, link: `/admin/matters/${m.id}` }))

  ;(documents.data ?? []).forEach((d) =>
    res.push({ kind: 'document', id: d.id, title: d.name, subtitle: `مستند • ${d.category ?? ''}`, link: '/admin/documents' }))

  return res.slice(0, 10)
}

export async function listNotifications(): Promise<NotificationItem[]> {
  await wait()
  return [...db.notifications]
}

export async function markAllNotificationsRead(): Promise<void> {
  await wait()
  db.notifications.forEach((n: NotificationItem) => {
    n.read = true
  })
  saveDb()
}

// ===== Leads =====
export async function listLeads(): Promise<Lead[]> {
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
  if (!error && data) return data.map(mapLeadRow)
  return [...db.leads].sort((a: Lead, b: Lead) => b.createdAt.localeCompare(a.createdAt))
}

const makeRef = (prefix: 'LD' | 'BK' | 'MSG') =>
  `${prefix}-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`

const mapLeadRow = (row: any): Lead => ({
  id: row.id,
  ref: row.reference_number,
  type: row.client_type,
  name: row.full_name,
  phone: row.phone,
  email: row.email || undefined,
  company: row.company_name || undefined,
  category: row.category,
  summary: row.notes || undefined,
  notes: row.notes || undefined,
  consultationType: row.consultation_type || undefined,
  source: row.source,
  status: row.status,
  estimatedValue: Number(row.estimated_value || 0),
  createdAt: row.created_at,
  lastActivityAt: row.last_activity_at || row.created_at,
})

const mapAppointmentRow = (row: any): Appointment => ({
  id: row.id,
  ref: row.reference_number,
  leadId: row.lead_id || undefined,
  clientId: row.client_id || undefined,
  name: row.name,
  phone: row.phone || '',
  email: row.email || undefined,
  type: row.meeting_type,
  category: row.category || undefined,
  date: row.appointment_date,
  time: row.appointment_time,
  preferredDate: row.appointment_date,
  preferredTime: row.appointment_time,
  duration: row.duration,
  status: row.status,
  location: row.location_details || undefined,
  notes: row.notes || undefined,
  createdAt: row.created_at,
})

export async function getLead(id: string): Promise<Lead | undefined> {
  await wait()
  return db.leads.find((l: Lead) => l.id === id)
}

export interface NewLeadInput {
  type: Lead['type']
  name: string
  phone: string
  email?: string
  company?: string
  category: string
  summary?: string
  source: Lead['source']
  landingPage?: string
  utm?: Lead['utm']
  consultationType?: Lead['consultationType']
  preferredDate?: string
}

export async function createLead(input: NewLeadInput): Promise<Lead> {
  const now = new Date().toISOString()
  const lead: Lead = {
    id: crypto.randomUUID(),
    ref: makeRef('LD'),
    status: 'new',
    createdAt: now,
    lastActivityAt: now,
    ...input,
  }
  const { error } = await supabase.from('leads').insert([{
      id: lead.id,
      reference_number: lead.ref,
      full_name: lead.name,
      phone: lead.phone,
      email: lead.email || '',
      company_name: lead.company || null,
      client_type: lead.type,
      category: lead.category,
      source: lead.source,
      status: 'new',
      notes: lead.summary || null,
      consultation_type: lead.consultationType || null,
      preferred_date: input.preferredDate || null,
    }])
  if (error) throw new Error(`تعذر حفظ الطلب في قاعدة البيانات: ${error.message}`)

  db.leads.unshift(lead)
  saveDb()
  logActivity({ entityType: 'lead', entityId: lead.id, type: 'lead_created', text: 'تم إنشاء العميل المحتمل عبر نموذج الطلب القانوني', actor: 'النظام' })
  notify({ title: 'طلب استشارة جديد', body: `${lead.name} — ${lead.category}`, link: `/admin/leads/${lead.id}`, kind: 'lead' })

  void notifyOffice({
    kind: lead.consultationType || input.preferredDate ? 'booking' : 'intake',
    reference: lead.ref,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    message: lead.summary,
    service: lead.category,
    preferredAt: input.preferredDate,
  })

  return lead
}

/**
 * إشعار المكتب فورًا بالطلب الوارد (بريد/واتساب) عبر Edge Function `notify-lead`.
 * الاستدعاء صامت عمدًا: فشل الإشعار لا يجوز أن يمنع حفظ طلب العميل أو يُظهر له خطأ.
 */
async function notifyOffice(payload: {
  kind: 'contact' | 'booking' | 'intake'
  reference: string
  name: string
  phone: string
  email?: string | null
  message?: string | null
  service?: string | null
  preferredAt?: string | null
}): Promise<void> {
  try {
    await supabase.functions.invoke('notify-lead', { body: payload })
  } catch {
    // متجاهَل عمدًا — الطلب محفوظ في قاعدة البيانات ويظهر في لوحة الإدارة على كل حال.
  }
}

export async function createContactRequest(input: { name: string; phone: string; email?: string; message: string }): Promise<string> {
  const reference = makeRef('MSG')
  const { error } = await supabase.from('contact_requests').insert({
    id: crypto.randomUUID(),
    reference_number: reference,
    full_name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || null,
    message: input.message.trim(),
    status: 'new',
    source: 'website_contact',
  })
  if (error) throw new Error(`تعذر إرسال الرسالة: ${error.message}`)

  void notifyOffice({
    kind: 'contact',
    reference,
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || null,
    message: input.message.trim(),
  })

  return reference
}

export async function updateLeadStage(id: string, newStage: PipelineStage): Promise<Lead | undefined> {
  const { error } = await supabase.from('leads').update({ status: newStage, last_activity_at: new Date().toISOString() }).eq('id', id)
  if (error) throw new Error(`تعذر تحديث الحالة: ${error.message}`)
  const lead = db.leads.find((l: Lead) => l.id === id)
  if (!lead) return (await listLeads()).find((item) => item.id === id)
  const old = lead.status
  lead.status = newStage
  lead.lastActivityAt = new Date().toISOString()
  saveDb()

  logActivity({
    entityType: 'lead',
    entityId: id,
    type: 'status_changed',
    text: `تغيرت حالة الطلب من [${old}] إلى [${newStage}]`,
    actor: 'أنت',
  })
  return lead
}

export async function updateLeadNotes(id: string, notes: string): Promise<Lead | undefined> {
  await wait(100)
  const lead = db.leads.find((l: Lead) => l.id === id)
  if (!lead) return undefined
  lead.summary = notes
  lead.lastActivityAt = new Date().toISOString()
  saveDb()

  logActivity({ entityType: 'lead', entityId: id, type: 'note_added', text: 'تم تحديث الملاحظات القانونية', actor: 'أنت' })
  return lead
}

// ===== Appointments / Bookings =====
export interface NewAppointmentInput {
  leadId?: string
  name: string
  phone: string
  email?: string
  type: Appointment['type']
  category?: string
  preferredDate?: string
  preferredTime?: string
  notes?: string
}

export async function createAppointment(input: NewAppointmentInput): Promise<Appointment> {
  const now = new Date().toISOString()
  const appt: Appointment = {
    id: crypto.randomUUID(),
    ref: makeRef('BK'),
    status: 'pending',
    createdAt: now,
    ...input,
  }
  const { error } = await supabase.from('appointments').insert([{
      id: appt.id,
      reference_number: appt.ref,
      lead_id: appt.leadId || null,
      name: appt.name,
      phone: appt.phone,
      email: appt.email || null,
      meeting_type: appt.type,
      category: appt.category || null,
      appointment_date: appt.preferredDate || appt.date,
      appointment_time: appt.preferredTime || appt.time,
      status: 'pending',
      notes: appt.notes || null,
      location_details: appt.type === 'office' ? 'مقر المكتب - الرياض' : appt.type === 'video' ? 'اجتماع مرئي' : 'اتصال هاتفي',
    }])
  if (error) throw new Error(`تعذر حفظ الموعد في قاعدة البيانات: ${error.message}`)

  db.appointments.unshift(appt)
  saveDb()
  logActivity({ entityType: 'appointment', entityId: appt.id, type: 'status_changed', text: `تم طلب موعد استشارة (${appt.type}) في ${appt.preferredDate} الساعة ${appt.preferredTime}`, actor: 'العميل' })
  notify({ title: 'موعد استشارة جديد', body: `${appt.name} — ${appt.preferredDate} ${appt.preferredTime}`, link: `/admin/bookings`, kind: 'booking' })

  return appt
}

export async function listAppointments(clientId?: string, leadId?: string): Promise<Appointment[]> {
  let query = supabase.from('appointments').select('*').order('created_at', { ascending: false })
  if (clientId) query = query.eq('client_id', clientId)
  if (leadId) query = query.eq('lead_id', leadId)
  const { data, error } = await query
  if (!error && data) return data.map(mapAppointmentRow)
  let list = db.appointments
  if (clientId || leadId) {
    list = list.filter((a: Appointment) => a.clientId === clientId || a.leadId === leadId)
  }
  return [...list].sort((a: Appointment, b: Appointment) => b.createdAt.localeCompare(a.createdAt))
}

/*
 * دوال العملاء والقضايا والمستندات القديمة (localStorage) حُذفت من هنا.
 * البديل: lib/records.ts — يقرأ ويكتب في Supabase حصرًا.
 */

/**
 * إعدادات الأتمتة — القيم الافتراضية المعروضة في شاشة الإعدادات.
 *
 * ملاحظة: الواجهة المتزامنة القديمة (store) التي كانت تحفظ العملاء والقضايا
 * والمهام والمستندات في localStorage حُذفت بالكامل. مكانها الآن lib/records.ts
 * وكلها تقرأ وتكتب في Supabase، فتظهر البيانات على كل الأجهزة ولا تضيع بمسح
 * ذاكرة المتصفح.
 */
export const store = {
  getAutomationSettings: () => ({
    whatsappEnabled: true,
    emailEnabled: true,
    n8nEnabled: true,
    n8nWebhookUrl: 'https://n8n.yourfirm.com/webhook/lead-event',
    leadCreatedTemplate: 'مرحبًا {name}، تم استلام طلبك لدى مكتب المحاماة. رقم الطلب: {reference}.',
    bookingConfirmedTemplate: 'تم تأكيد موعد استشارتك بنجاح في تاريخ {date} الساعة {time}.',
  }),
  updateAutomationSettings: (_newSettings: unknown) => {},
}
