import { supabase } from './supabase'

export interface ActivityEntry {
  id: string
  actorName: string
  actorEmail: string | null
  action: 'insert' | 'update' | 'delete'
  entityType: string
  entityId: string | null
  entityLabel: string | null
  changedFields: string[] | null
  oldData: Record<string, unknown> | null
  newData: Record<string, unknown> | null
  createdAt: string
}

/** أسماء عربية للحقول — حتى يقرأ الموظف "الحالة" لا "status". */
const FIELD_LABELS: Record<string, string> = {
  status: 'الحالة',
  stage: 'المرحلة',
  full_name: 'الاسم',
  full_name_ar: 'الاسم',
  phone: 'الجوال',
  email: 'البريد',
  notes: 'الملاحظات',
  category: 'التصنيف',
  source: 'المصدر',
  assigned_staff_id: 'الموظف المسؤول',
  estimated_value: 'القيمة التقديرية',
  client_id: 'العميل',
  matter_id: 'القضية',
  title: 'العنوان',
  description: 'الوصف',
  due_date: 'تاريخ الاستحقاق',
  priority: 'الأولوية',
  amount: 'المبلغ',
  total: 'الإجمالي',
  paid_amount: 'المدفوع',
  appointment_date: 'تاريخ الموعد',
  appointment_time: 'وقت الموعد',
  meeting_type: 'نوع الاجتماع',
  consultation_type: 'نوع الاستشارة',
  preferred_date: 'الموعد المفضل',
  role: 'الصلاحية',
  visibility: 'مستوى الظهور',
  reference_number: 'الرقم المرجعي',
  company_name: 'اسم المنشأة',
  invoice_number: 'رقم الفاتورة',
  due_amount: 'المبلغ المستحق',
}

/** قيم مترجمة للحالات الشائعة، حتى لا تظهر بالإنجليزية داخل نص عربي. */
const VALUE_LABELS: Record<string, string> = {
  new: 'جديد',
  contacted: 'تم التواصل',
  qualified: 'مؤهل',
  proposal: 'عرض مقدّم',
  won: 'مكتسب',
  lost: 'مفقود',
  pending: 'بانتظار التأكيد',
  confirmed: 'مؤكد',
  completed: 'منجز',
  cancelled: 'ملغى',
  no_show: 'لم يحضر',
  open: 'مفتوح',
  closed: 'مغلق',
  paid: 'مدفوع',
  unpaid: 'غير مدفوع',
  overdue: 'متأخر',
  draft: 'مسودة',
  sent: 'مُرسل',
  high: 'عالية',
  medium: 'متوسطة',
  low: 'منخفضة',
  client: 'عميل',
  super_admin: 'مدير عام',
  lawyer: 'محامٍ',
  staff: 'موظف',
  marketing: 'تسويق',
  office: 'في المكتب',
  phone: 'هاتفي',
  video: 'مرئي',
}

export function fieldLabel(key: string) {
  return FIELD_LABELS[key] || key
}

export function valueLabel(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'نعم' : 'لا'
  const raw = String(value)
  return VALUE_LABELS[raw] || raw
}

/** جلب أثر النشاط الخاص بسجل واحد (بترتيب زمني تنازلي). */
export async function listEntityActivity(entityType: string, entityId: string, limit = 30): Promise<ActivityEntry[]> {
  const { data, error } = await supabase
    .from('activity_log')
    .select('id, actor_name, actor_email, action, entity_type, entity_id, entity_label, changed_fields, old_data, new_data, created_at')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => ({
    id: row.id as string,
    actorName: (row.actor_name as string) || 'غير معروف',
    actorEmail: (row.actor_email as string) ?? null,
    action: row.action as ActivityEntry['action'],
    entityType: row.entity_type as string,
    entityId: (row.entity_id as string) ?? null,
    entityLabel: (row.entity_label as string) ?? null,
    changedFields: (row.changed_fields as string[]) ?? null,
    oldData: (row.old_data as Record<string, unknown>) ?? null,
    newData: (row.new_data as Record<string, unknown>) ?? null,
    createdAt: row.created_at as string,
  }))
}

const ENTITY_LABELS: Record<string, string> = {
  leads: 'عميل محتمل',
  clients: 'عميل',
  matters: 'قضية',
  tasks: 'مهمة',
  documents: 'مستند',
  appointments: 'موعد',
  invoices: 'فاتورة',
  finance_debts: 'ذمة مالية',
  finance_records: 'قيد مالي',
  contact_requests: 'رسالة تواصل',
  profiles: 'مستخدم',
}

const ACTION_LABELS: Record<ActivityEntry['action'], string> = {
  insert: 'أضاف',
  update: 'عدّل',
  delete: 'حذف',
}

/** أحدث النشاط عبر النظام كله — لمركز العمليات. */
export async function listRecentActivity(limit = 12): Promise<ActivityEntry[]> {
  const { data, error } = await supabase
    .from('activity_log')
    .select('id, actor_name, actor_email, action, entity_type, entity_id, entity_label, changed_fields, old_data, new_data, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)

  return (data ?? []).map((row) => ({
    id: row.id as string,
    actorName: (row.actor_name as string) || 'غير معروف',
    actorEmail: (row.actor_email as string) ?? null,
    action: row.action as ActivityEntry['action'],
    entityType: row.entity_type as string,
    entityId: (row.entity_id as string) ?? null,
    entityLabel: (row.entity_label as string) ?? null,
    changedFields: (row.changed_fields as string[]) ?? null,
    oldData: (row.old_data as Record<string, unknown>) ?? null,
    newData: (row.new_data as Record<string, unknown>) ?? null,
    createdAt: row.created_at as string,
  }))
}

/** جملة عربية واحدة تصف العملية: «محمد أضاف عميل: أحمد». */
export function summarize(entry: ActivityEntry): string {
  const what = ENTITY_LABELS[entry.entityType] || entry.entityType
  const who = ACTION_LABELS[entry.action]
  return entry.entityLabel ? `${entry.actorName} ${who} ${what}: ${entry.entityLabel}` : `${entry.actorName} ${who} ${what}`
}

/** صياغة سطر عربي مقروء لكل تغيير داخل عملية تعديل. */
export function describeChanges(entry: ActivityEntry): string[] {
  if (entry.action === 'insert') return ['أنشأ السجل']
  if (entry.action === 'delete') return ['حذف السجل']

  const fields = entry.changedFields ?? []
  return fields.slice(0, 6).map((key) => {
    const before = valueLabel(entry.oldData?.[key])
    const after = valueLabel(entry.newData?.[key])
    return `${fieldLabel(key)}: ${before} ← ${after}`
  })
}
