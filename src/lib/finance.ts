/**
 * وحدة المحاسبة — طبقة بيانات Supabase حصرًا (بلا بيانات محلية أو تجريبية).
 * أي فشل في القاعدة يظهر كخطأ واضح للمستخدم.
 */
import { supabase } from './supabase'

export type FinanceKind = 'expense' | 'income'
export type PaymentMethod = 'cash' | 'transfer' | 'card' | 'cheque' | 'other'

export interface FinanceCategory {
  id: string
  kind: FinanceKind
  nameAr: string
  sortOrder: number
}

export interface FinanceRecord {
  id: string
  kind: FinanceKind
  categoryId: string
  categoryName: string
  title: string
  amount: number
  vatAmount: number
  recordDate: string // YYYY-MM-DD
  paymentMethod: PaymentMethod
  partyName?: string
  clientId?: string
  matterId?: string
  notes?: string
  attachmentPath?: string
  attachmentName?: string
  createdAt: string
}

export interface FinanceFilters {
  month?: string // YYYY-MM
  year?: number
  kind?: FinanceKind | 'all'
  categoryId?: string
}

export interface NewFinanceRecordInput {
  kind: FinanceKind
  categoryId: string
  title: string
  amount: number
  vatAmount?: number
  recordDate: string
  paymentMethod: PaymentMethod
  partyName?: string
  clientId?: string
  matterId?: string
  notes?: string
}

const BUCKET = 'finance-attachments'

const mapCategory = (row: any): FinanceCategory => ({
  id: row.id,
  kind: row.kind,
  nameAr: row.name_ar,
  sortOrder: row.sort_order,
})

const mapRecord = (row: any): FinanceRecord => ({
  id: row.id,
  kind: row.kind,
  categoryId: row.category_id,
  categoryName: row.finance_categories?.name_ar || '',
  title: row.title,
  amount: Number(row.amount),
  vatAmount: Number(row.vat_amount || 0),
  recordDate: row.record_date,
  paymentMethod: row.payment_method,
  partyName: row.party_name || undefined,
  clientId: row.client_id || undefined,
  matterId: row.matter_id || undefined,
  notes: row.notes || undefined,
  attachmentPath: row.attachment_path || undefined,
  attachmentName: row.attachment_name || undefined,
  createdAt: row.created_at,
})

export async function listFinanceCategories(): Promise<FinanceCategory[]> {
  const { data, error } = await supabase
    .from('finance_categories')
    .select('*')
    .eq('is_active', true)
    .order('kind')
    .order('sort_order')
  if (error) throw new Error(`تعذر تحميل التصنيفات: ${error.message}`)
  return (data || []).map(mapCategory)
}

export async function listFinanceRecords(filters: FinanceFilters = {}): Promise<FinanceRecord[]> {
  let query = supabase
    .from('finance_records')
    .select('*, finance_categories(name_ar)')
    .order('record_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (filters.month) {
    const [y, m] = filters.month.split('-').map(Number)
    const start = `${filters.month}-01`
    const end = new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 10)
    query = query.gte('record_date', start).lt('record_date', end)
  } else if (filters.year) {
    query = query.gte('record_date', `${filters.year}-01-01`).lt('record_date', `${filters.year + 1}-01-01`)
  }
  if (filters.kind && filters.kind !== 'all') query = query.eq('kind', filters.kind)
  if (filters.categoryId) query = query.eq('category_id', filters.categoryId)

  const { data, error } = await query
  if (error) throw new Error(`تعذر تحميل السجلات المالية: ${error.message}`)
  return (data || []).map(mapRecord)
}

async function uploadAttachment(file: File): Promise<{ path: string; name: string }> {
  const now = new Date()
  // مفتاح التخزين يجب أن يكون ASCII فقط — الاسم العربي الأصلي يُحفظ في attachment_name للعرض.
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin'
  const path = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw new Error(`تعذر رفع المرفق: ${error.message}`)
  return { path, name: file.name }
}

export async function createFinanceRecord(input: NewFinanceRecordInput, attachment?: File | null): Promise<void> {
  let attachmentPath: string | null = null
  let attachmentName: string | null = null
  if (attachment) {
    const uploaded = await uploadAttachment(attachment)
    attachmentPath = uploaded.path
    attachmentName = uploaded.name
  }

  const { data: userData } = await supabase.auth.getUser()

  const { error } = await supabase.from('finance_records').insert({
    kind: input.kind,
    category_id: input.categoryId,
    title: input.title.trim(),
    amount: input.amount,
    vat_amount: input.vatAmount || 0,
    record_date: input.recordDate,
    payment_method: input.paymentMethod,
    party_name: input.partyName?.trim() || null,
    client_id: input.clientId || null,
    matter_id: input.matterId || null,
    notes: input.notes?.trim() || null,
    attachment_path: attachmentPath,
    attachment_name: attachmentName,
    created_by: userData.user?.id || null,
  })
  if (error) {
    // تنظيف المرفق إن فشل حفظ السجل
    if (attachmentPath) await supabase.storage.from(BUCKET).remove([attachmentPath])
    throw new Error(`تعذر حفظ القيد: ${error.message}`)
  }
}

export async function updateFinanceRecord(id: string, input: NewFinanceRecordInput, attachment?: File | null): Promise<void> {
  const patch: Record<string, unknown> = {
    kind: input.kind,
    category_id: input.categoryId,
    title: input.title.trim(),
    amount: input.amount,
    vat_amount: input.vatAmount || 0,
    record_date: input.recordDate,
    payment_method: input.paymentMethod,
    party_name: input.partyName?.trim() || null,
    notes: input.notes?.trim() || null,
    updated_at: new Date().toISOString(),
  }
  if (attachment) {
    const uploaded = await uploadAttachment(attachment)
    patch.attachment_path = uploaded.path
    patch.attachment_name = uploaded.name
  }
  const { error } = await supabase.from('finance_records').update(patch).eq('id', id)
  if (error) throw new Error(`تعذر تحديث القيد: ${error.message}`)
}

export async function deleteFinanceRecord(record: FinanceRecord): Promise<void> {
  const { error } = await supabase.from('finance_records').delete().eq('id', record.id)
  if (error) throw new Error(`تعذر حذف القيد: ${error.message}`)
  if (record.attachmentPath) {
    await supabase.storage.from(BUCKET).remove([record.attachmentPath])
  }
}

/** رابط مؤقت آمن لعرض/تنزيل المرفق (ساعة واحدة). */
export async function getAttachmentUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600)
  if (error || !data?.signedUrl) throw new Error('تعذر إنشاء رابط المرفق')
  return data.signedUrl
}

export interface FinanceSummary {
  income: number
  expense: number
  net: number
  vatIncome: number
  vatExpense: number
  count: number
}

export function summarize(records: FinanceRecord[]): FinanceSummary {
  const s: FinanceSummary = { income: 0, expense: 0, net: 0, vatIncome: 0, vatExpense: 0, count: records.length }
  for (const r of records) {
    if (r.kind === 'income') { s.income += r.amount; s.vatIncome += r.vatAmount }
    else { s.expense += r.amount; s.vatExpense += r.vatAmount }
  }
  s.net = s.income - s.expense
  return s
}

export const formatSAR = (n: number) =>
  new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 2 }).format(n)

export async function createFinanceCategory(kind: FinanceKind, nameAr: string): Promise<void> {
  const { error } = await supabase.from('finance_categories').insert({
    kind,
    name_ar: nameAr.trim(),
    sort_order: 500,
  })
  if (error) throw new Error(`تعذر إضافة التصنيف: ${error.message}`)
}

// ===== الإقرار الضريبي (ضريبة القيمة المضافة) =====
export interface VatQuarter {
  label: string       // مثال: الربع الثالث 2026
  start: string       // YYYY-MM-DD
  end: string         // exclusive
  filingDeadline: string // آخر يوم في الشهر التالي لنهاية الربع
}

export function vatQuarters(year: number): VatQuarter[] {
  const q = (n: number, sm: number): VatQuarter => {
    const start = `${year}-${String(sm).padStart(2, '0')}-01`
    const endMonth = sm + 3
    const end = endMonth > 12 ? `${year + 1}-01-01` : `${year}-${String(endMonth).padStart(2, '0')}-01`
    // آخر يوم من الشهر التالي لنهاية الربع
    const dl = new Date(endMonth > 12 ? Date.UTC(year + 1, 1, 0) : Date.UTC(year, endMonth, 0))
    return {
      label: `الربع ${['الأول', 'الثاني', 'الثالث', 'الرابع'][n - 1]} ${year}`,
      start,
      end,
      filingDeadline: dl.toISOString().slice(0, 10),
    }
  }
  return [q(1, 1), q(2, 4), q(3, 7), q(4, 10)]
}

export interface VatSummary {
  outputVat: number  // ضريبة المخرجات (على الإيرادات)
  inputVat: number   // ضريبة المدخلات (على المصروفات)
  netVat: number     // الصافي المستحق (أو القابل للاسترداد إن كان سالبًا)
  taxableSales: number
  taxablePurchases: number
}

export function vatForPeriod(records: FinanceRecord[], start: string, end: string): VatSummary {
  const s: VatSummary = { outputVat: 0, inputVat: 0, netVat: 0, taxableSales: 0, taxablePurchases: 0 }
  for (const r of records) {
    if (r.recordDate < start || r.recordDate >= end) continue
    if (r.kind === 'income') { s.outputVat += r.vatAmount; s.taxableSales += r.amount }
    else { s.inputVat += r.vatAmount; s.taxablePurchases += r.amount }
  }
  s.netVat = s.outputVat - s.inputVat
  return s
}

// ===== الذمم والمديونيات =====
export type DebtDirection = 'receivable' | 'payable' // لنا / علينا

export interface Debt {
  id: string
  direction: DebtDirection
  partyName: string
  clientId?: string
  title: string
  totalAmount: number
  paidAmount: number
  remaining: number
  dueDate?: string
  notes?: string
  createdAt: string
}

const mapDebt = (row: any): Debt => ({
  id: row.id,
  direction: row.direction,
  partyName: row.party_name,
  clientId: row.client_id || undefined,
  title: row.title,
  totalAmount: Number(row.total_amount),
  paidAmount: Number(row.paid_amount),
  remaining: Number(row.total_amount) - Number(row.paid_amount),
  dueDate: row.due_date || undefined,
  notes: row.notes || undefined,
  createdAt: row.created_at,
})

export async function listDebts(): Promise<Debt[]> {
  const { data, error } = await supabase
    .from('finance_debts')
    .select('*')
    .order('due_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })
  if (error) throw new Error(`تعذر تحميل الذمم: ${error.message}`)
  return (data || []).map(mapDebt)
}

export interface NewDebtInput {
  direction: DebtDirection
  partyName: string
  title: string
  totalAmount: number
  dueDate?: string
  notes?: string
}

export async function createDebt(input: NewDebtInput): Promise<void> {
  const { data: userData } = await supabase.auth.getUser()
  const { error } = await supabase.from('finance_debts').insert({
    direction: input.direction,
    party_name: input.partyName.trim(),
    title: input.title.trim(),
    total_amount: input.totalAmount,
    due_date: input.dueDate || null,
    notes: input.notes?.trim() || null,
    created_by: userData.user?.id || null,
  })
  if (error) throw new Error(`تعذر حفظ الذمة: ${error.message}`)
}

/**
 * تسجيل سداد دفعة من ذمة:
 * يزيد المسدد في الذمة + ينشئ قيدًا ماليًا مرتبطًا تلقائيًا
 * (تحصيل مستحق لنا = إيراد، سداد التزام علينا = مصروف).
 */
export async function payDebt(debt: Debt, amount: number, date: string, method: PaymentMethod): Promise<void> {
  if (amount <= 0 || amount > debt.remaining) throw new Error('مبلغ الدفعة يجب أن يكون أكبر من صفر ولا يتجاوز المتبقي')

  const { error } = await supabase.rpc('record_debt_payment', {
    p_debt_id: debt.id,
    p_amount: amount,
    p_record_date: date,
    p_payment_method: method,
  })
  if (error) throw new Error(`تعذر تسجيل الدفعة: ${error.message}`)
}

export async function deleteDebt(id: string): Promise<void> {
  const { data: debt, error: readError } = await supabase
    .from('finance_debts').select('paid_amount').eq('id', id).single()
  if (readError) throw new Error(`تعذر التحقق من الذمة: ${readError.message}`)
  if (Number(debt.paid_amount) > 0) throw new Error('لا يمكن حذف ذمة لها دفعات مسجلة حفاظًا على السجل المالي')
  const { error } = await supabase.from('finance_debts').delete().eq('id', id)
  if (error) throw new Error(`تعذر حذف الذمة: ${error.message}`)
}

export const PAYMENT_METHOD_AR: Record<PaymentMethod, string> = {
  cash: 'نقدًا',
  transfer: 'تحويل بنكي',
  card: 'بطاقة',
  cheque: 'شيك',
  other: 'أخرى',
}
