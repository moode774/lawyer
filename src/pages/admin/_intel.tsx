import type { ConsultationType, DocCategory, LeadSource, Role } from '../../types'

// تسميات عربية مشتركة لصفحات الذكاء الإداري (التحليلات، المساعد الذكي، الإعدادات)

export const SOURCE_LABELS: Record<LeadSource, string> = {
  google_ads: 'إعلانات قوقل',
  google_search: 'بحث قوقل',
  instagram: 'إنستقرام',
  x: 'منصة إكس',
  linkedin: 'لينكدإن',
  direct: 'مباشر',
  referral: 'إحالة',
  whatsapp: 'واتساب',
}

export const DOC_CATEGORY_LABELS: Record<DocCategory, string> = {
  contracts: 'عقود',
  evidence: 'أدلة وإثباتات',
  identity: 'هويات',
  court: 'أوراق قضائية',
  correspondence: 'مراسلات',
  invoices: 'فواتير',
  other: 'أخرى',
}

type Channel = 'whatsapp' | 'email' | 'internal'

export const CHANNEL_LABELS: Record<Channel, string> = {
  whatsapp: 'واتساب',
  email: 'بريد',
  internal: 'داخلي',
}

export const CHANNEL_TONES: Record<Channel, 'bronze' | 'info' | 'neutral'> = {
  whatsapp: 'bronze',
  email: 'info',
  internal: 'neutral',
}

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'مدير النظام',
  lawyer: 'محامٍ',
  staff: 'موظف',
  marketing: 'تسويق',
  client: 'عميل',
}

export const ROLE_TONES: Record<Role, 'danger' | 'navy' | 'neutral' | 'bronze' | 'info'> = {
  super_admin: 'danger',
  lawyer: 'navy',
  staff: 'neutral',
  marketing: 'bronze',
  client: 'info',
}

export const CONSULTATION_TYPE_LABELS: Record<ConsultationType, string> = {
  office: 'حضورية',
  phone: 'هاتفية',
  video: 'مرئية',
}

// 0=الأحد ... 6=السبت
export const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

export function IntegrationNote({ children }: { children: string }) {
  return (
    <div className="rounded-lg border border-info/20 bg-info-soft px-4 py-3 text-sm leading-6 text-info">
      {children}
    </div>
  )
}
