import { useQuery } from '@tanstack/react-query'
import {
  getClient,
  getMatter,
  listAppointments,
  listDocuments,
  listMatters,
  listMessages,
} from '../../lib/store'
import { brand } from '../../config/brand'
import type { Appointment, ConsultationType, Doc, DocCategory, Matter, Message } from '../../types'

/**
 * بوابة العميل — كل البيانات تُرشَّح على العميل الحالي فقط (c2 في العرض التجريبي).
 * مبدأ الأمان: لا تظهر إلا المستندات ذات visibility === 'client'،
 * ولا تُعرض أي ملاحظات أو أنشطة داخلية إطلاقًا.
 * في الإنتاج تُفرض هذه القيود عبر RLS في Supabase على مستوى قاعدة البيانات.
 */
export const PORTAL_CLIENT_ID = 'c2'
/** العميل المحتمل الذي تحوّل إلى هذا العميل — لربط مواعيد ما قبل التعاقد. */
export const PORTAL_LEAD_ID = 'ld1'

export function usePortalClient() {
  return useQuery({
    queryKey: ['portal', 'client', PORTAL_CLIENT_ID],
    queryFn: () => getClient(PORTAL_CLIENT_ID),
  })
}

export function usePortalMatters() {
  return useQuery({
    queryKey: ['portal', 'matters', PORTAL_CLIENT_ID],
    queryFn: async () => (await listMatters()).filter((m: Matter) => m.clientId === PORTAL_CLIENT_ID),
  })
}

export function usePortalMatter(id: string | undefined) {
  return useQuery({
    queryKey: ['portal', 'matter', id],
    queryFn: () => getMatter(id ?? ''),
    enabled: Boolean(id),
  })
}

/** المستندات المشتركة مع العميل فقط — لا يظهر أي مستند داخلي. */
export function usePortalDocuments() {
  return useQuery({
    queryKey: ['portal', 'documents', PORTAL_CLIENT_ID],
    queryFn: async () =>
      (await listDocuments()).filter(
        (d: Doc) => d.clientId === PORTAL_CLIENT_ID && d.visibility === 'client',
      ),
  })
}

/** مواعيد العميل + المواعيد المرتبطة بطلبه قبل التحول إلى عميل. */
export function usePortalAppointments() {
  return useQuery({
    queryKey: ['portal', 'appointments', PORTAL_CLIENT_ID],
    queryFn: async () =>
      (await listAppointments()).filter(
        (a: Appointment) => a.clientId === PORTAL_CLIENT_ID || a.leadId === PORTAL_LEAD_ID,
      ),
  })
}

export function usePortalMessages() {
  return useQuery({
    queryKey: ['portal', 'messages', PORTAL_CLIENT_ID],
    queryFn: () => listMessages(),
  })
}

// ===== تسميات عربية =====

export const appointmentTypeLabels: Record<ConsultationType, string> = {
  office: 'حضورية',
  phone: 'هاتفية',
  video: 'مرئية',
}

export const docCategoryLabels: Record<DocCategory, string> = {
  contracts: 'عقود',
  evidence: 'مستندات ثبوتية',
  identity: 'هويات',
  court: 'مستندات محكمة',
  correspondence: 'مراسلات',
  invoices: 'فواتير',
  other: 'أخرى',
}

export const messageStatusLabels: Record<Message['status'], string> = {
  sent: 'أُرسلت',
  delivered: 'تم التسليم',
  failed: 'فشل الإرسال',
  queued: 'في الانتظار',
}

// ===== أدوات عرض =====

/** رقم واتساب بصيغة دولية دون رموز — لروابط wa.me. */
export const whatsappDigits = brand.whatsappNumber.replace(/\D/g, '')

export function whatsappUrl(text?: string) {
  return `https://wa.me/${whatsappDigits}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

export function formatSize(sizeKb: number) {
  if (sizeKb >= 1024) return `${(sizeKb / 1024).toFixed(1)} م.ب`
  return `${sizeKb} ك.ب`
}

export function dayNumber(isoDate: string) {
  return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { day: 'numeric' }).format(new Date(isoDate))
}

export function monthName(isoDate: string) {
  return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { month: 'long' }).format(new Date(isoDate))
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}
