import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, ArrowDownCircle, ArrowUpCircle, Banknote, CalendarClock, HandCoins, Loader2, Plus, Scale, Trash2, Wallet } from 'lucide-react'
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
  createDebt, deleteDebt, formatSAR, listDebts, payDebt, PAYMENT_METHOD_AR,
  type Debt, type DebtDirection, type NewDebtInput, type PaymentMethod,
} from '../../lib/finance'

const today = () => new Date().toISOString().slice(0, 10)
const emptyDebt = (direction: DebtDirection): NewDebtInput => ({ direction, partyName: '', title: '', totalAmount: 0, dueDate: '', notes: '' })

export default function DebtsPage() {
  useSEO({ title: 'الذمم والمديونيات | مكتب بن نوح' })
  const { toast } = useToast()
  const qc = useQueryClient()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<NewDebtInput>(emptyDebt('receivable'))
  const [paying, setPaying] = useState<Debt | null>(null)
  const [payAmount, setPayAmount] = useState(0)
  const [payDate, setPayDate] = useState(today())
  const [payMethod, setPayMethod] = useState<PaymentMethod>('transfer')
  const [confirmDelete, setConfirmDelete] = useState<Debt | null>(null)

  const { data: debts = [], isLoading, error } = useQuery({ queryKey: ['finance-debts'], queryFn: listDebts })

  const stats = useMemo(() => {
    const rec = debts.filter((d) => d.direction === 'receivable')
    const pay = debts.filter((d) => d.direction === 'payable')
    const sum = (list: Debt[]) => list.reduce((a, d) => a + d.remaining, 0)
    const overdue = debts.filter((d) => d.remaining > 0 && d.dueDate && d.dueDate < today()).length
    return { recRemaining: sum(rec), payRemaining: sum(pay), overdue, rec, pay }
  }, [debts])

  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ['finance-debts'] })
    void qc.invalidateQueries({ queryKey: ['finance-records'] })
  }

  const createMut = useMutation({
    mutationFn: () => createDebt(form),
    onSuccess: () => { toast('تم تسجيل الذمة'); setDialogOpen(false); refresh() },
    onError: (e: Error) => toast(e.message, 'error'),
  })
  const payMut = useMutation({
    mutationFn: () => payDebt(paying as Debt, payAmount, payDate, payMethod),
    onSuccess: () => { toast('تم تسجيل الدفعة وقيدها في السجل المالي تلقائيًا'); setPaying(null); refresh() },
    onError: (e: Error) => toast(e.message, 'error'),
  })
  const delMut = useMutation({
    mutationFn: (id: string) => deleteDebt(id),
    onSuccess: () => { toast('تم حذف الذمة'); setConfirmDelete(null); refresh() },
    onError: (e: Error) => toast(e.message, 'error'),
  })

  function openCreate(direction: DebtDirection) { setForm(emptyDebt(direction)); setDialogOpen(true) }
  function openPay(d: Debt) { setPaying(d); setPayAmount(d.remaining); setPayDate(today()); setPayMethod('transfer') }

  function DebtColumn({ direction }: { direction: DebtDirection }) {
    const list = direction === 'receivable' ? stats.rec : stats.pay
    const isRec = direction === 'receivable'
    return (
      <Card className="border-border bg-white p-5">
        <div className={`mb-4 flex items-center justify-between rounded-xl px-4 py-3 text-white ${isRec ? 'bg-success' : 'bg-navy'}`}>
          <span className="flex items-center gap-2 font-bold">
            {isRec ? <ArrowUpCircle className="size-4" /> : <ArrowDownCircle className="size-4" />}
            {isRec ? 'مستحقات لنا عند الغير' : 'التزامات علينا للغير'}
          </span>
          <span className="font-display text-lg font-bold">{formatSAR(isRec ? stats.recRemaining : stats.payRemaining)}</span>
        </div>

        {list.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-muted">{isRec ? 'لا مستحقات مسجلة.' : 'لا التزامات مسجلة.'}</p>
        ) : (
          <div className="space-y-3">
            {list.map((d) => {
              const pct = Math.min(100, Math.round((d.paidAmount / d.totalAmount) * 100))
              const isOverdue = d.remaining > 0 && d.dueDate && d.dueDate < today()
              const isPaid = d.remaining <= 0
              return (
                <div key={d.id} className={`rounded-xl border p-4 ${isPaid ? 'border-success/30 bg-success-soft/40' : isOverdue ? 'border-danger/40 bg-danger-soft/40' : 'border-border bg-surface-subtle/40'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-ink">{d.title}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {d.partyName}
                        {d.dueDate && (
                          <span className={`mr-2 inline-flex items-center gap-1 ${isOverdue ? 'font-bold text-danger' : ''}`}>
                            <CalendarClock className="size-3" /> الاستحقاق: {d.dueDate} {isOverdue && '— متأخر!'}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {!isPaid && (
                        <Button size="sm" onClick={() => openPay(d)} className={`h-8 gap-1 px-2.5 text-xs text-white ${isRec ? 'bg-success hover:bg-success/90' : 'bg-navy hover:bg-navy-800'}`}>
                          <Banknote className="size-3.5" /> {isRec ? 'تحصيل' : 'سداد'}
                        </Button>
                      )}
                      <button onClick={() => setConfirmDelete(d)} className="rounded-md p-1.5 text-ink-muted hover:bg-danger-soft hover:text-danger" aria-label="حذف">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-ink-muted">سُدد {formatSAR(d.paidAmount)} من {formatSAR(d.totalAmount)}</span>
                      <span className={`font-bold ${isPaid ? 'text-success' : 'text-ink'}`}>{isPaid ? 'مكتمل ✓' : `متبقٍ ${formatSAR(d.remaining)}`}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-border/60" dir="ltr">
                      <div className={`h-full rounded-full transition-all ${isPaid ? 'bg-success' : isRec ? 'bg-success/70' : 'bg-navy/70'}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  {d.notes && <p className="mt-2 text-xs text-ink-faint">{d.notes}</p>}
                </div>
              )
            })}
          </div>
        )}
      </Card>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="الذمم والمديونيات"
        description="من يستحق لنا ومن نستحق له — وكل دفعة تُقيد في السجل المالي تلقائيًا"
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/finance">
              <Button size="sm" variant="outline" className="gap-1.5 border-navy/30 text-navy"><Wallet className="size-4" /> السجل المالي</Button>
            </Link>
            <Button id="tour-debts-new-payable" size="sm" variant="outline" onClick={() => openCreate('payable')} className="gap-1.5 border-navy/30 text-navy">
              <ArrowDownCircle className="size-4" /> التزام علينا
            </Button>
            <Button id="tour-debts-new-receivable" size="sm" onClick={() => openCreate('receivable')} className="gap-1.5 bg-navy text-white hover:bg-navy-800">
              <Plus className="size-4" /> مستحق لنا
            </Button>
          </div>
        }
      />

      <div id="tour-debts-metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="متبقٍ لنا عند الغير" value={formatSAR(stats.recRemaining)} icon={<ArrowUpCircle className="size-5" />} />
        <MetricCard label="متبقٍ علينا للغير" value={formatSAR(stats.payRemaining)} icon={<ArrowDownCircle className="size-5" />} />
        <MetricCard label="صافي المركز" value={formatSAR(stats.recRemaining - stats.payRemaining)} icon={<Scale className="size-5" />} trend={stats.recRemaining - stats.payRemaining >= 0 ? 'up' : 'down'} />
        <MetricCard label="ذمم متأخرة" value={stats.overdue} icon={<AlertTriangle className="size-5" />} hint={stats.overdue > 0 ? 'تجاوزت تاريخ الاستحقاق' : 'لا تأخير'} />
      </div>

      <div id="tour-debts-lists">
      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2"><Skeleton className="h-64 w-full" /><Skeleton className="h-64 w-full" /></div>
      ) : error ? (
        <Card className="border-danger/30 bg-danger-soft p-6 text-sm text-danger">{(error as Error).message}</Card>
      ) : debts.length === 0 ? (
        <EmptyState icon={<HandCoins className="size-8" />} title="لا ذمم مسجلة بعد" description="سجّل المستحقات التي لك عند العملاء أو الالتزامات التي عليك للموردين، وتابع سدادها أولًا بأول." />
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-2">
          <DebtColumn direction="receivable" />
          <DebtColumn direction="payable" />
        </div>
      )}
      </div>

      {/* تسجيل ذمة */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title={form.direction === 'receivable' ? 'تسجيل مستحق لنا' : 'تسجيل التزام علينا'} wide>
        <form onSubmit={(e) => { e.preventDefault(); if (!form.partyName.trim() || !form.title.trim() || form.totalAmount <= 0) { toast('أكمل الحقول المطلوبة', 'error'); return } createMut.mutate() }} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-ink">النوع</span>
              <Select value={form.direction} onChange={(e) => setForm({ ...form, direction: e.target.value as DebtDirection })}
                options={[{ value: 'receivable', label: 'مستحق لنا (عند الغير)' }, { value: 'payable', label: 'التزام علينا (للغير)' }]} />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-ink">{form.direction === 'receivable' ? 'اسم العميل / الجهة *' : 'اسم المورد / الجهة *'}</span>
              <Input value={form.partyName} onChange={(e) => setForm({ ...form, partyName: e.target.value })} required />
            </label>
          </div>
          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-ink">الوصف *</span>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder={form.direction === 'receivable' ? 'مثال: أتعاب قضية عمالية — الدفعة الثانية' : 'مثال: متبقي فاتورة تجهيزات المكتب'} required />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-ink">المبلغ الكلي (ر.س) *</span>
              <Input type="number" min="0" step="0.01" dir="ltr" value={form.totalAmount || ''} onChange={(e) => setForm({ ...form, totalAmount: Number(e.target.value) })} required />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-ink">تاريخ الاستحقاق (اختياري)</span>
              <Input type="date" dir="ltr" value={form.dueDate || ''} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </label>
          </div>
          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-ink">ملاحظات</span>
            <Textarea rows={2} value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </label>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button type="submit" disabled={createMut.isPending} className="gap-1.5 bg-navy text-white hover:bg-navy-800">
              {createMut.isPending && <Loader2 className="size-4 animate-spin" />} حفظ
            </Button>
          </div>
        </form>
      </Dialog>

      {/* تسجيل دفعة */}
      <Dialog open={!!paying} onClose={() => setPaying(null)} title={paying?.direction === 'receivable' ? 'تسجيل تحصيل دفعة' : 'تسجيل سداد دفعة'}
        description={paying ? `«${paying.title}» — المتبقي ${formatSAR(paying.remaining)}` : undefined}>
        <form onSubmit={(e) => { e.preventDefault(); payMut.mutate() }} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-bold text-ink">مبلغ الدفعة (ر.س) *</span>
            <Input type="number" min="0.01" step="0.01" max={paying?.remaining} dir="ltr" value={payAmount || ''} onChange={(e) => setPayAmount(Number(e.target.value))} required />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-ink">التاريخ</span>
              <Input type="date" dir="ltr" value={payDate} onChange={(e) => setPayDate(e.target.value)} required />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-bold text-ink">طريقة الدفع</span>
              <Select value={payMethod} onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                options={Object.entries(PAYMENT_METHOD_AR).map(([value, label]) => ({ value, label }))} />
            </label>
          </div>
          <p className="rounded-lg bg-surface-subtle p-3 text-xs leading-5 text-ink-muted">
            ستُسجل الدفعة تلقائيًا كقيد {paying?.direction === 'receivable' ? 'إيراد' : 'مصروف'} في السجل المالي وتُحدث نسبة السداد.
          </p>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={() => setPaying(null)}>إلغاء</Button>
            <Button type="submit" disabled={payMut.isPending} className="gap-1.5 bg-navy text-white hover:bg-navy-800">
              {payMut.isPending && <Loader2 className="size-4 animate-spin" />} تسجيل الدفعة
            </Button>
          </div>
        </form>
      </Dialog>

      {/* حذف */}
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="حذف الذمة">
        <p className="text-sm leading-6 text-ink">حذف «{confirmDelete?.title}»؟ القيود المالية السابقة المرتبطة بها ستبقى في السجل، لكن الذمة نفسها ستُحذف نهائيًا.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmDelete(null)}>إلغاء</Button>
          <Button onClick={() => confirmDelete && delMut.mutate(confirmDelete.id)} disabled={delMut.isPending} className="gap-1.5 bg-danger text-white hover:bg-danger/90">
            {delMut.isPending && <Loader2 className="size-4 animate-spin" />} حذف نهائي
          </Button>
        </div>
      </Dialog>
    </div>
  )
}
