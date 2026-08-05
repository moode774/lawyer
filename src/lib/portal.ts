import { supabase } from './supabase'
import type { Appointment, Client, Doc, Matter } from '../types'

const mapClient = (r: any): Client => ({
  id: r.id, ref: r.reference_number, type: r.client_type, name: r.full_name,
  phone: r.phone, email: r.email || undefined, company: r.company_name || undefined,
  nationalId: r.national_id_cr || undefined, address: r.address || undefined,
  portalAccess: true, convertedFromLeadId: r.converted_from_lead_id || undefined,
  notes: r.notes || undefined, createdAt: r.created_at,
})

const mapMatter = (r: any): Matter => ({
  id: r.id, ref: r.reference_number, clientId: r.client_id, title: r.title,
  category: r.category, status: r.status, assignedLawyer: '', team: [],
  court: r.court_or_authority || undefined, description: r.description || undefined,
  importantDates: Array.isArray(r.important_dates) ? r.important_dates : [], createdAt: r.created_at,
})

const mapDoc = (r: any): Doc => ({
  id: r.id, name: r.name, category: r.category, size: r.size_human,
  uploadedAt: r.created_at, clientId: r.client_id || undefined,
  leadId: r.lead_id || undefined, matterId: r.matter_id || undefined, visibility: r.visibility,
})

const mapAppointment = (r: any): Appointment => ({
  id: r.id, ref: r.reference_number, name: r.name, phone: r.phone || '',
  email: r.email || undefined, leadId: r.lead_id || undefined, clientId: r.client_id || undefined,
  type: r.meeting_type, category: r.category || undefined, date: r.appointment_date,
  time: r.appointment_time, preferredDate: r.appointment_date, preferredTime: r.appointment_time,
  duration: r.duration, status: r.status, location: r.location_details || undefined,
  notes: r.notes || undefined, createdAt: r.created_at,
})

export interface PortalMessage {
  id: string
  direction: 'inbound' | 'outbound'
  body: string
  status: string
  createdAt: string
}

export interface PortalInvoice {
  id: string
  invoiceNumber: string
  status: string
  issueDate: string
  dueDate?: string
  subtotal: number
  vatAmount: number
  total: number
  paidAmount: number
  remaining: number
}

export async function getMyClient(): Promise<Client | null> {
  const { data, error } = await supabase.from('clients').select('*').maybeSingle()
  if (error) throw new Error(`تعذر تحميل ملف العميل: ${error.message}`)
  return data ? mapClient(data) : null
}

export async function listMyMatters(): Promise<Matter[]> {
  const { data, error } = await supabase.from('matters').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(`تعذر تحميل القضايا: ${error.message}`)
  return (data || []).map(mapMatter)
}

export async function getMyMatter(id: string): Promise<Matter | null> {
  const { data, error } = await supabase.from('matters').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(`تعذر تحميل القضية: ${error.message}`)
  return data ? mapMatter(data) : null
}

export async function listMyDocuments(matterId?: string): Promise<Doc[]> {
  let query = supabase.from('documents').select('*').eq('visibility', 'client').order('created_at', { ascending: false })
  if (matterId) query = query.eq('matter_id', matterId)
  const { data, error } = await query
  if (error) throw new Error(`تعذر تحميل المستندات: ${error.message}`)
  return (data || []).map(mapDoc)
}

export async function listMyAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase.from('appointments').select('*').order('appointment_date', { ascending: true })
  if (error) throw new Error(`تعذر تحميل المواعيد: ${error.message}`)
  return (data || []).map(mapAppointment)
}

export async function listMyMessages(): Promise<PortalMessage[]> {
  const { data, error } = await supabase.from('messages').select('id,direction,body,status,created_at').eq('channel', 'portal').order('created_at')
  if (error) throw new Error(`تعذر تحميل الرسائل: ${error.message}`)
  return (data || []).map((r: any) => ({ id: r.id, direction: r.direction, body: r.body, status: r.status, createdAt: r.created_at }))
}

export async function listMyInvoices(): Promise<PortalInvoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('id,invoice_number,status,issue_date,due_date,subtotal,vat_amount,total,paid_amount')
    .order('issue_date', { ascending: false })
  if (error) throw new Error(`تعذر تحميل الفواتير: ${error.message}`)
  return (data || []).map((r: any) => ({
    id: r.id,
    invoiceNumber: r.invoice_number,
    status: r.status,
    issueDate: r.issue_date,
    dueDate: r.due_date || undefined,
    subtotal: Number(r.subtotal || 0),
    vatAmount: Number(r.vat_amount || 0),
    total: Number(r.total || 0),
    paidAmount: Number(r.paid_amount || 0),
    remaining: Math.max(0, Number(r.total || 0) - Number(r.paid_amount || 0)),
  }))
}

export async function sendMyPortalMessage(body: string): Promise<void> {
  const client = await getMyClient()
  if (!client) throw new Error('لم يرتبط الحساب بملف عميل بعد')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('انتهت جلسة الدخول')
  const { error } = await supabase.from('messages').insert({
    channel: 'portal', direction: 'inbound', sender_id: user.id,
    recipient_phone_or_email: 'office-portal', body: body.trim(), status: 'sent', client_id: client.id,
  })
  if (error) throw new Error(`تعذر إرسال الرسالة: ${error.message}`)
}
