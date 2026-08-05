import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowUpDown,
  Download,
  FileText,
  Loader2,
  Paperclip,
  Pencil,
  Plus,
  RotateCcw,
  Scale,
  Search,
  Trash2,
  Wallet,
} from 'lucide-react'
import { PageHeader } from '../../components/ui/page-header'
import { MetricCard } from '../../components/ui/metric-card'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Textarea } from '../../components/ui/textarea'
import { Dialog } from '../../components/ui/dialog'
import { EmptyState } from '../../components/ui/empty-state'
import { Skeleton } from '../../components/ui/skeleton'
import { useToast } from '../../components/ui/toast'
import { useSEO } from '../../lib/seo'
import {
  createFinanceRecord,
  deleteFinanceRecord,
  formatSAR,
  getAttachmentUrl,
  listFinanceCategories,
  listFinanceRecords,
  PAYMENT_METHOD_AR,
  summarize,
  updateFinanceRecord,
  type FinanceKind,
  type FinanceRecord,
  type NewFinanceRecordInput,
  type PaymentMethod,
} from '../../lib/finance'

const thisMonth = () => new Date().toISOString().slice(0, 7)

const monthLabel = (ym: string) => {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('ar-SA-u-ca-gregory', { month: 'long', year: 'numeric' })
}

function monthOptions(): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = [{ value: '', label: 'كل الفترات' }]
  const d = new Date()
  for (let i = 0; i < 13; i++) {
    const ym = new Date(d.getFullYear(), d.getMonth() - i, 1)
    const value = `${ym.getFullYear()}-${String(ym.getMonth() + 1).padStart(2, '0')}`
    out.push({ value, label: monthLabel(value) })
  }
  return out
}

const emptyForm = (kind: FinanceKind): NewFinanceRecordInput => ({
  kind,
  categoryId: '',
  title: '',
  amount: 0,
  vatAmount: 0,
  recordDate: new Date().toISOString().slice(0, 10),
  paymentMethod: 'transfer',
  partyName: '',
  notes: '',
})

type SortKey = 'date' | 'amount'

export default function FinancePage() {
  useSEO({ title: 'الحسابات والمصروفات | مكتب بن نوح' })
  const { toast } = useToast()
  const qc = useQueryClient()

  // فلاتر الخادم
  const [month, setMonth] = useState(thisMonth())
  const [kind, setKind] = useState<FinanceKind | 'all'>('all')
  const [categoryId, setCategoryId] = useState('')
  // فلاتر محلية
  const [search, setSearch] = useState('')
  const [payMethod, setPayMethod] = useState('')
  const [onlyNoAttach, setOnlyNoAttach] = useState(false)
  // فرز
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDesc, setSortDesc] = useState(true)
  // نوافذ
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<FinanceRecord | null>(null)
  const [form, setForm] = useState<NewFinanceRecordInput>(emptyForm('expense'))
  const [attachment, setAttachment] = useState<File | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<FinanceRecord | null>(null)

  const { data: categories = [] } = useQuery({
    queryKey: ['finance-categories'],
    queryFn: listFinanceCategories,
    staleTime: 5 * 60_000,
  })

  const { data: records = [], isLoading, error } = useQuery({
    queryKey: ['finance-records', month, kind, categoryId],
    queryFn: () => listFinanceRecords({ month: month || undefined, kind, categoryId: categoryId || undefined }),
  })

  // تطبيق البحث والفلاتر المحلية ثم الفرز
  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    let list = records.filter((r) => {
      if (payMethod && r.paymentMethod !== payMethod) return false
      if (onlyNoAttach && r.attachmentPath) return false
      if (!term) return true
      return [r.title, r.partyName, r.notes, r.categoryName]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(term))
    })
    list = [...list].sort((a, b) => {
      const cmp = sortKey === 'date' ? a.recordDate.localeCompare(b.recordDate) : a.amount - b.amount
      return sortDesc ? -cmp : cmp
    })
    return list
  }, [records, search, payMethod, onlyNoAttach, sortKey, sortDesc])

  const summary = useMemo(() => summarize(visible), [visible])
  const hasActiveFilters = !!(search || payMethod || onlyNoAttach || categoryId || kind !== 'all' || month !== thisMonth())

  const formCategories = useMemo(() => categories.filter((c) => c.kind === form.kind), [categories, form.kind])
  const filterCategories = useMemo(
    () => (kind === 'all' ? categories : categories.filter((c) => c.kind === kind)),
    [categories, kind],
  )

  const saveMut = useMutation({
    mutationFn: () =>
      editing ? updateFinanceRecord(editing.id, form, attachment) : createFinanceRecord(form, attachment),
    onSuccess: () => {
      toast(editing ? 'تم تحديث القيد' : 'تم حفظ القيد بنجاح')
      setDialogOpen(false)
      setEditing(null)
      setAttachment(null)
      void qc.invalidateQueries({ queryKey: ['finance-records'] })
    },
    onError: (e: Error) => toast(e.message, 'error'),
  })

  const deleteMut = useMutation({
    mutationFn: (r: FinanceRecord) => deleteFinanceRecord(r),
    onSuccess: () => {
      toast('تم حذف القيد')
      setConfirmDelete(null)
      void qc.invalidateQueries({ queryKey: ['finance-records'] })
    },
    onError: (e: Error) => toast(e.message, 'error'),
  })

  async function openAttachment(r: FinanceRecord) {
    if (!r.attachmentPath) return
    try {
      const url = await getAttachmentUrl(r.attachmentPath)
      window.open(url, '_blank', 'noopener')
    } catch (e) {
      toast(e instanceof Error ? e.message : 'تعذر فتح المرفق', 'error')
    }
  }

  function openCreate(k: FinanceKind) {
    setEditing(null)
    setForm(emptyForm(k))
    setAttachment(null)
    setDialogOpen(true)
  }

  function openEdit(r: FinanceRecord) {
    setEditing(r)
    setForm({
      kind: r.kind,
      categoryId: r.categoryId,
      title: r.title,
      amount: r.amount,
      vatAmount: r.vatAmount,
      recordDate: r.recordDate,
      paymentMethod: r.paymentMethod,
      partyName: r.partyName || '',
      notes: r.notes || '',
    })
    setAttachment(null)
    setDialogOpen(true)
  }

  function resetFilters() {
    setSearch('')
    setPayMethod('')
    setOnlyNoAttach(false)
    setCategoryId('')
    setKind('all')
    setMonth(thisMonth())
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDesc(!sortDesc)
    else { setSortKey(key); setSortDesc(true) }
  }

  function exportCsv() {
    const head = ['التاريخ', 'النوع', 'الوصف', 'التصنيف', 'الجهة', 'طريقة الدفع', 'المبلغ', 'منها ضريبة', 'ملاحظات', 'مرفق']
    const rows = visible.map((r) => [
      r.recordDate,
      r.kind === 'income' ? 'إيراد' : 'مصروف',
      r.title,
      r.categoryName,
      r.partyName || '',
      PAYMENT_METHOD_AR[r.paymentMethod as PaymentMethod],
      r.amount.toFixed(2),
      r.vatAmount.toFixed(2),
      r.notes || '',
      r.attachmentPath ? 'نعم' : 'لا',
    ])
    const csv = '﻿' + [head, ...rows]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\r\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `سجل-مالي-${month || 'كامل'}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
    toast(`تم تصدير ${visible.length} قيدًا`)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.categoryId) { toast('اختر التصنيف', 'error'); return }
    if (!form.title.trim()) { toast('اكتب وصف القيد', 'error'); return }
    if (!form.amount || form.amount <= 0) { toast('أدخل مبلغًا صحيحًا', 'error'); return }
    if (form.vatAmount && form.vatAmount > form.amount) { toast('مبلغ الضريبة لا يتجاوز المبلغ الكلي', 'error'); return }
    saveMut.mutate()
  }

  const sortIndicator = (key: SortKey) => (
    <ArrowUpDown className={`size-3 transition-opacity ${sortKey === key ? 'opacity-100 text-navy' : 'opacity-30'}`} />
  )

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="الحسابات والمصروفات"
        description="سجل مالي موحد للمكتب: مصروفات وإيرادات مع المرفقات المؤيدة لكل قيد"
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/finance/reports">
              <Button size="sm" variant="outline" className="gap-1.5 border-navy/30 text-navy">
                <Scale className="size-4" /> التقارير والإقرار
              </Button>
            </Link>
            <Button size="sm" variant="outline" onClick={() => openCreate('income')} className="gap-1.5 border-success/40 text-success hover:bg-success-soft">
              <ArrowUpCircle className="size-4" /> إيراد جديد
            </Button>
            <Button size="sm" onClick={() => openCreate('expense')} className="gap-1.5 bg-navy text-white hover:bg-navy-800">
              <Plus className="size-4" /> مصروف جديد
            </Button>
          </div>
        }
      />

      {/* ملخص المعروض */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label={month ? `إيرادات ${monthLabel(month)}` : 'إجمالي الإيرادات'} value={formatSAR(summary.income)} icon={<ArrowUpCircle className="size-5" />} />
        <MetricCard label={month ? `مصروفات ${monthLabel(month)}` : 'إجمالي المصروفات'} value={formatSAR(summary.expense)} icon={<ArrowDownCircle className="size-5" />} />
        <MetricCard label="الصافي" value={formatSAR(summary.net)} icon={<Scale className="size-5" />} trend={summary.net >= 0 ? 'up' : 'down'} hint={summary.net >= 0 ? 'فائض' : 'عجز'} />
        <MetricCard label="القيود المعروضة" value={summary.count} icon={<Wallet className="size-5" />} hint={hasActiveFilters ? 'بحسب الفلاتر النشطة' : 'الشهر الحالي'} />
      </div>

      {/* شريط البحث والفلاتر */}
      <Card className="space-y-3 border-border bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className="absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في الوصف، الجهة، الملاحظات، التصنيف…"
              className="ps-10"
            />
          </div>
          <Select value={month} onChange={(e) => setMonth(e.target.value)} options={monthOptions()} className="w-40" aria-label="الفترة" />
          <Select
            value={kind}
            onChange={(e) => { setKind(e.target.value as FinanceKind | 'all'); setCategoryId('') }}
            options={[
              { value: 'all', label: 'مصروفات وإيرادات' },
              { value: 'expense', label: 'المصروفات فقط' },
              { value: 'income', label: 'الإيرادات فقط' },
            ]}
            className="w-44"
            aria-label="النوع"
          />
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-48" aria-label="التصنيف">
            <option value="">كل التصنيفات</option>
            {filterCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.nameAr}</option>
            ))}
          </Select>
          <Select value={payMethod} onChange={(e) => setPayMethod(e.target.value)} className="w-40" aria-label="طريقة الدفع">
            <option value="">كل طرق الدفع</option>
            {Object.entries(PAYMENT_METHOD_AR).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </Select>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setOnlyNoAttach(!onlyNoAttach)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
                onlyNoAttach
                  ? 'border-warning bg-warning-soft text-[#7a5410]'
                  : 'border-border text-ink-muted hover:border-navy/40 hover:text-navy'
              }`}
            >
              <Paperclip className="size-3.5" /> بلا مرفق فقط
            </button>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-bold text-ink-muted hover:border-danger/40 hover:text-danger"
              >
                <RotateCcw className="size-3.5" /> إعادة تعيين الفلاتر
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-muted">{visible.length} من {records.length} قيدًا</span>
            <Button size="sm" variant="outline" onClick={exportCsv} disabled={visible.length === 0} className="gap-1.5 border-navy/30 text-navy">
              <Download className="size-3.5" /> تصدير CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* الجدول */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : error ? (
        <Card className="border-danger/30 bg-danger-soft p-6 text-sm text-danger">{(error as Error).message}</Card>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<Wallet className="size-8" />}
          title={records.length === 0 ? 'لا توجد قيود في هذه الفترة' : 'لا نتائج مطابقة للبحث أو الفلاتر'}
          description={records.length === 0
            ? 'ابدأ بتسجيل أول مصروف أو إيراد — كل قيد يمكن إرفاق إيصاله أو مستنده المؤيد.'
            : 'جرّب تعديل كلمة البحث أو إعادة تعيين الفلاتر.'}
        />
      ) : (
        <Card className="overflow-hidden border-border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-subtle text-right text-xs font-bold text-ink-muted">
                  <th className="px-4 py-3">
                    <button onClick={() => toggleSort('date')} className="inline-flex items-center gap-1 hover:text-navy">
                      التاريخ {sortIndicator('date')}
                    </button>
                  </th>
                  <th className="px-4 py-3">الوصف</th>
                  <th className="px-4 py-3">التصنيف</th>
                  <th className="px-4 py-3">الجهة</th>
                  <th className="px-4 py-3">الدفع</th>
                  <th className="px-4 py-3">
                    <button onClick={() => toggleSort('amount')} className="inline-flex items-center gap-1 hover:text-navy">
                      المبلغ {sortIndicator('amount')}
                    </button>
                  </th>
                  <th className="px-4 py-3">مرفق</th>
                  <th className="px-4 py-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={r.id} className="group border-b border-border/60 last:border-0 hover:bg-surface-subtle/60">
                    <td className="whitespace-nowrap px-4 py-3 text-ink-muted">{r.recordDate}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink">{r.title}</p>
                      {r.notes && <p className="mt-0.5 max-w-64 truncate text-xs text-ink-faint" title={r.notes}>{r.notes}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        r.kind === 'income' ? 'bg-success-soft text-success' : 'bg-navy-50 text-navy-700'
                      }`}>
                        {r.kind === 'income' ? <ArrowUpCircle className="size-3" /> : <ArrowDownCircle className="size-3" />}
                        {r.categoryName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{r.partyName || '—'}</td>
                    <td className="px-4 py-3 text-ink-muted">{PAYMENT_METHOD_AR[r.paymentMethod as PaymentMethod]}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <p className={`font-display font-bold ${r.kind === 'income' ? 'text-success' : 'text-ink'}`}>
                        {r.kind === 'income' ? '+' : '−'} {formatSAR(r.amount)}
                      </p>
                      {r.vatAmount > 0 && <p className="text-[11px] text-ink-faint">منها ضريبة {formatSAR(r.vatAmount)}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {r.attachmentPath ? (
                        <button
                          onClick={() => void openAttachment(r)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-navy hover:underline"
                          title={r.attachmentName}
                        >
                          <FileText className="size-3.5" /> عرض
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-warning" title="أرفق المستند المؤيد">
                          <Paperclip className="size-3" /> ناقص
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1 opacity-100 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100">
                        <button onClick={() => openEdit(r)} className="rounded-md p-1.5 text-ink-muted hover:bg-navy-50 hover:text-navy" aria-label="تعديل">
                          <Pencil className="size-4" />
                        </button>
                        <button onClick={() => setConfirmDelete(r)} className="rounded-md p-1.5 text-ink-muted hover:bg-danger-soft hover:text-danger" aria-label="حذف">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-navy/20 bg-surface-subtle text-xs font-bold">
                  <td colSpan={5} className="px-4 py-3 text-ink">إجمالي المعروض ({summary.count} قيدًا)</td>
                  <td colSpan={3} className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-success">إيرادات: {formatSAR(summary.income)}</span>
                      <span className="text-ink">مصروفات: {formatSAR(summary.expense)}</span>
                      <span className={summary.net >= 0 ? 'text-success' : 'text-danger'}>الصافي: {formatSAR(summary.net)}</span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}

      {/* إضافة / تعديل قيد */}
      <Dialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditing(null) }}
        title={editing ? 'تعديل القيد' : form.kind === 'expense' ? 'تسجيل مصروف جديد' : 'تسجيل إيراد جديد'}
        description="جميع القيود تُحفظ في قاعدة بيانات المكتب مع مرفقها المؤيد"
        wide
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-ink">النوع</span>
              <Select
                value={form.kind}
                onChange={(e) => setForm({ ...form, kind: e.target.value as FinanceKind, categoryId: '' })}
                options={[
                  { value: 'expense', label: 'مصروف' },
                  { value: 'income', label: 'إيراد' },
                ]}
                disabled={!!editing}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-ink">التصنيف *</span>
              <Select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
                <option value="">اختر التصنيف…</option>
                {formCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.nameAr}</option>
                ))}
              </Select>
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-ink">الوصف *</span>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={form.kind === 'expense' ? 'مثال: فاتورة كهرباء المكتب — يوليو' : 'مثال: أتعاب استشارة عقد تجاري'}
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-ink">المبلغ (ر.س) *</span>
              <Input
                type="number" min="0" step="0.01" dir="ltr" inputMode="decimal"
                value={form.amount || ''}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                required
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-ink">منها ضريبة (اختياري)</span>
              <Input
                type="number" min="0" step="0.01" dir="ltr" inputMode="decimal"
                value={form.vatAmount || ''}
                onChange={(e) => setForm({ ...form, vatAmount: Number(e.target.value) })}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-ink">التاريخ *</span>
              <Input
                type="date" dir="ltr"
                value={form.recordDate}
                onChange={(e) => setForm({ ...form, recordDate: e.target.value })}
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-ink">طريقة الدفع</span>
              <Select
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as PaymentMethod })}
                options={Object.entries(PAYMENT_METHOD_AR).map(([value, label]) => ({ value, label }))}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-ink">{form.kind === 'expense' ? 'المورد / الجهة' : 'الدافع / العميل'}</span>
              <Input
                value={form.partyName || ''}
                onChange={(e) => setForm({ ...form, partyName: e.target.value })}
                placeholder={form.kind === 'expense' ? 'مثال: شركة الكهرباء' : 'اسم العميل أو الجهة'}
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-ink">ملاحظات</span>
            <Textarea
              rows={2}
              value={form.notes || ''}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="تفاصيل إضافية (اختياري)"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="flex items-center gap-1.5 text-sm font-bold text-ink">
              <Paperclip className="size-4 text-navy" /> المستند المؤيد (إيصال / فاتورة)
            </span>
            {editing?.attachmentPath && !attachment && (
              <p className="text-xs text-ink-muted">
                المرفق الحالي: <span className="font-semibold">{editing.attachmentName || 'مستند'}</span> — اختر ملفًا جديدًا لاستبداله.
              </p>
            )}
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={(e) => setAttachment(e.target.files?.[0] || null)}
              className="block w-full cursor-pointer rounded-xl border border-dashed border-border bg-surface px-4 py-3 text-sm text-ink-muted file:ml-3 file:rounded-lg file:border-0 file:bg-navy file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white hover:border-navy/40"
            />
            {attachment && <p className="text-xs text-ink-muted">سيُرفق: {attachment.name}</p>}
          </label>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); setEditing(null) }}>إلغاء</Button>
            <Button type="submit" disabled={saveMut.isPending} className="gap-1.5 bg-navy text-white hover:bg-navy-800">
              {saveMut.isPending && <Loader2 className="size-4 animate-spin" />} {editing ? 'حفظ التعديلات' : 'حفظ القيد'}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* تأكيد الحذف */}
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="حذف القيد">
        <p className="text-sm leading-6 text-ink">
          هل أنت متأكد من حذف القيد «{confirmDelete?.title}»؟ سيُحذف المرفق المرتبط به أيضًا ولا يمكن التراجع.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmDelete(null)}>إلغاء</Button>
          <Button
            onClick={() => confirmDelete && deleteMut.mutate(confirmDelete)}
            disabled={deleteMut.isPending}
            className="gap-1.5 bg-danger text-white hover:bg-danger/90"
          >
            {deleteMut.isPending && <Loader2 className="size-4 animate-spin" />} حذف نهائي
          </Button>
        </div>
      </Dialog>
    </div>
  )
}
