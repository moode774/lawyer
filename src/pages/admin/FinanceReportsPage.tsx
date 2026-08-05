import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  BadgePercent,
  BookOpen,
  CalendarClock,
  ChartColumn,
  CheckCircle2,
  FolderTree,
  Landmark,
  Lightbulb,
  Loader2,
  Paperclip,
  Plus,
  Scale,
  Wallet,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageHeader } from '../../components/ui/page-header'
import { MetricCard } from '../../components/ui/metric-card'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { useToast } from '../../components/ui/toast'
import { Skeleton } from '../../components/ui/skeleton'
import { useSEO } from '../../lib/seo'
import {
  createFinanceCategory,
  formatSAR,
  listFinanceCategories,
  listFinanceRecords,
  summarize,
  vatForPeriod,
  vatQuarters,
  type FinanceKind,
  type FinanceRecord,
} from '../../lib/finance'

const BRAND_COLORS = ['#1C2B48', '#345577', '#5a82a6', '#8EB1D1', '#A7C7E7', '#8a6b36', '#2e7d56', '#b57b18', '#c0392b', '#253d5a']

const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']

const compactSAR = (n: number) =>
  new Intl.NumberFormat('ar-SA', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

export default function FinanceReportsPage() {
  useSEO({ title: 'التقارير المالية والإقرار الضريبي | مكتب بن نوح' })
  const { toast } = useToast()
  const qc = useQueryClient()

  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const quarters = useMemo(() => vatQuarters(year), [year])
  const defaultQuarter = Math.floor(new Date().getMonth() / 3)
  const [quarterIdx, setQuarterIdx] = useState(defaultQuarter)

  const [newCatKind, setNewCatKind] = useState<FinanceKind>('expense')
  const [newCatName, setNewCatName] = useState('')

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['finance-records-year', year],
    queryFn: () => listFinanceRecords({ year }),
  })
  const { data: categories = [] } = useQuery({
    queryKey: ['finance-categories'],
    queryFn: listFinanceCategories,
    staleTime: 5 * 60_000,
  })

  const yearSummary = useMemo(() => summarize(records), [records])

  // بيانات الرسم الشهري
  const monthlyData = useMemo(() => {
    const rows = MONTHS_AR.map((name, i) => ({ name, month: i, الإيرادات: 0, المصروفات: 0 }))
    for (const r of records) {
      const m = Number(r.recordDate.slice(5, 7)) - 1
      if (r.kind === 'income') rows[m].الإيرادات += r.amount
      else rows[m].المصروفات += r.amount
    }
    return rows
  }, [records])

  // توزيع المصروفات حسب التصنيف
  const expenseByCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const r of records) {
      if (r.kind !== 'expense') continue
      map.set(r.categoryName || 'أخرى', (map.get(r.categoryName || 'أخرى') || 0) + r.amount)
    }
    return [...map.entries()]
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [records])

  // شجرة الحسابات مع الإجماليات
  const tree = useMemo(() => {
    const totals = new Map<string, { total: number; count: number }>()
    for (const r of records) {
      const t = totals.get(r.categoryId) || { total: 0, count: 0 }
      t.total += r.amount
      t.count += 1
      totals.set(r.categoryId, t)
    }
    const group = (kind: FinanceKind) =>
      categories
        .filter((c) => c.kind === kind)
        .map((c) => ({ ...c, total: totals.get(c.id)?.total || 0, count: totals.get(c.id)?.count || 0 }))
    return { expense: group('expense'), income: group('income') }
  }, [categories, records])

  // الإقرار الضريبي للربع المختار
  const q = quarters[quarterIdx]
  const vat = useMemo(() => vatForPeriod(records, q.start, q.end), [records, q])
  const daysToDeadline = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return Math.ceil((new Date(q.filingDeadline).getTime() - new Date(today).getTime()) / 86400000)
  }, [q])

  // تنبيهات ذكية
  const alerts = useMemo(() => {
    const list: { icon: React.ReactNode; text: string; tone: 'warn' | 'info' | 'ok' }[] = []
    const noAttach = records.filter((r: FinanceRecord) => !r.attachmentPath)
    if (noAttach.length > 0)
      list.push({
        icon: <Paperclip className="size-4" />,
        text: `${noAttach.length} قيدًا بلا مستند مؤيد — أرفق الإيصالات أولًا بأول حتى يكون الملف جاهزًا لأي مراجعة.`,
        tone: 'warn',
      })
    if (daysToDeadline >= 0 && daysToDeadline <= 30 && quarterIdx === defaultQuarter && year === currentYear)
      list.push({
        icon: <CalendarClock className="size-4" />,
        text: `يتبقى ${daysToDeadline} يومًا تقريبًا على الموعد المعتاد لتقديم إقرار ${q.label} (${q.filingDeadline}).`,
        tone: 'warn',
      })
    if (yearSummary.net < 0)
      list.push({
        icon: <AlertTriangle className="size-4" />,
        text: `المصروفات تتجاوز الإيرادات هذه السنة بمقدار ${formatSAR(Math.abs(yearSummary.net))} — راجع أكبر بنود المصروفات في الرسم أدناه.`,
        tone: 'warn',
      })
    if (list.length === 0)
      list.push({ icon: <CheckCircle2 className="size-4" />, text: 'لا توجد ملاحظات — السجل المالي مكتمل ومنظم.', tone: 'ok' })
    return list
  }, [records, daysToDeadline, quarterIdx, defaultQuarter, year, currentYear, yearSummary, q])

  const addCatMut = useMutation({
    mutationFn: () => createFinanceCategory(newCatKind, newCatName),
    onSuccess: () => {
      toast('تمت إضافة التصنيف')
      setNewCatName('')
      void qc.invalidateQueries({ queryKey: ['finance-categories'] })
    },
    onError: (e: Error) => toast(e.message, 'error'),
  })

  const yearOptions = [currentYear, currentYear - 1, currentYear - 2].map((y) => ({ value: String(y), label: `سنة ${y}` }))

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="التقارير المالية والإقرار الضريبي"
        description="قراءة مبسطة لأرقام المكتب: رسوم بيانية، شجرة حسابات، وحاسبة الإقرار — بلا حاجة لخبرة محاسبية"
        actions={
          <div className="flex items-center gap-2">
            <Select value={String(year)} onChange={(e) => setYear(Number(e.target.value))} options={yearOptions} className="w-32" />
            <Link to="/admin/finance">
              <Button size="sm" variant="outline" className="gap-1.5 border-navy/30 text-navy">
                <Wallet className="size-4" /> سجل القيود
              </Button>
            </Link>
          </div>
        }
      />

      {/* تنبيهات */}
      <div className="space-y-2">
        {alerts.map((a, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-xl border p-3.5 text-sm font-medium ${
              a.tone === 'warn'
                ? 'border-warning/30 bg-warning-soft text-[#7a5410]'
                : a.tone === 'ok'
                  ? 'border-success/30 bg-success-soft text-success'
                  : 'border-border bg-white text-ink'
            }`}
          >
            {a.icon}
            <span>{a.text}</span>
          </div>
        ))}
      </div>

      {/* ملخص السنة */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label={`إيرادات ${year}`} value={formatSAR(yearSummary.income)} icon={<ArrowUpCircle className="size-5" />} />
        <MetricCard label={`مصروفات ${year}`} value={formatSAR(yearSummary.expense)} icon={<ArrowDownCircle className="size-5" />} />
        <MetricCard label="صافي السنة" value={formatSAR(yearSummary.net)} icon={<Scale className="size-5" />} trend={yearSummary.net >= 0 ? 'up' : 'down'} hint={yearSummary.net >= 0 ? 'فائض' : 'عجز'} />
        <MetricCard label="عدد القيود" value={yearSummary.count} icon={<ChartColumn className="size-5" />} hint="خلال السنة المختارة" />
      </div>

      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* الرسم الشهري */}
          <Card className="border-border bg-white p-5">
            <h3 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-ink">
              <ChartColumn className="size-4 text-navy-500" /> الإيرادات مقابل المصروفات شهريًا
            </h3>
            <div dir="ltr" className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8ECEF" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#527094', fontFamily: 'Tajawal' }} reversed />
                  <YAxis tickFormatter={compactSAR} tick={{ fontSize: 11, fill: '#527094' }} orientation="right" />
                  <Tooltip formatter={(v) => formatSAR(Number(v))} contentStyle={{ fontFamily: 'Tajawal', direction: 'rtl', borderRadius: 12, borderColor: '#C4D8E5' }} />
                  <Legend wrapperStyle={{ fontFamily: 'Tajawal', fontSize: 12 }} />
                  <Bar dataKey="الإيرادات" fill="#2e7d56" radius={[6, 6, 0, 0]} maxBarSize={22} />
                  <Bar dataKey="المصروفات" fill="#1C2B48" radius={[6, 6, 0, 0]} maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* توزيع المصروفات */}
          <Card className="border-border bg-white p-5">
            <h3 className="mb-4 flex items-center gap-2 font-display text-base font-bold text-ink">
              <BadgePercent className="size-4 text-navy-500" /> أين تذهب المصروفات؟
            </h3>
            {expenseByCategory.length === 0 ? (
              <p className="flex h-64 items-center justify-center text-sm text-ink-muted">لا مصروفات مسجلة في هذه السنة بعد.</p>
            ) : (
              <div dir="ltr" className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseByCategory} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="85%" paddingAngle={2} stroke="#fff">
                      {expenseByCategory.map((_, i) => (
                        <Cell key={i} fill={BRAND_COLORS[i % BRAND_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatSAR(Number(v))} contentStyle={{ fontFamily: 'Tajawal', direction: 'rtl', borderRadius: 12, borderColor: '#C4D8E5' }} />
                    <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontFamily: 'Tajawal', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* شجرة الحسابات */}
        <Card className="border-border bg-white p-5">
          <h3 className="mb-1 flex items-center gap-2 font-display text-base font-bold text-ink">
            <FolderTree className="size-4 text-navy-500" /> شجرة الحسابات
          </h3>
          <p className="mb-4 text-xs text-ink-muted">تصنيفات المكتب وإجمالي كل بند خلال سنة {year}</p>

          {(['expense', 'income'] as FinanceKind[]).map((kind) => (
            <div key={kind} className="mb-4">
              <div className={`mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-white ${kind === 'expense' ? 'bg-navy' : 'bg-success'}`}>
                {kind === 'expense' ? <ArrowDownCircle className="size-4" /> : <ArrowUpCircle className="size-4" />}
                {kind === 'expense' ? 'المصروفات' : 'الإيرادات'}
                <span className="mr-auto font-display">
                  {formatSAR(kind === 'expense' ? yearSummary.expense : yearSummary.income)}
                </span>
              </div>
              <div className="space-y-1 pr-3">
                {tree[kind].map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border border-border/60 bg-surface-subtle/50 px-3 py-2 text-sm">
                    <span className="flex items-center gap-2 text-ink">
                      <span className="inline-block size-1.5 rounded-full bg-navy-400" />
                      {c.nameAr}
                      {c.count > 0 && <span className="text-xs text-ink-faint">({c.count} قيد)</span>}
                    </span>
                    <span className={`font-display font-semibold ${c.total > 0 ? 'text-ink' : 'text-ink-faint'}`}>{formatSAR(c.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* إضافة تصنيف */}
          <div className="mt-4 rounded-xl border border-dashed border-border p-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-ink">
              <Plus className="size-3.5 text-navy" /> إضافة تصنيف جديد
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={newCatKind} onChange={(e) => setNewCatKind(e.target.value as FinanceKind)} className="w-28" options={[{ value: 'expense', label: 'مصروف' }, { value: 'income', label: 'إيراد' }]} />
              <Input value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="اسم التصنيف، مثال: صيانة المكتب" className="min-w-40 flex-1" />
              <Button
                size="sm"
                disabled={!newCatName.trim() || addCatMut.isPending}
                onClick={() => addCatMut.mutate()}
                className="gap-1 bg-navy text-white hover:bg-navy-800"
              >
                {addCatMut.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />} إضافة
              </Button>
            </div>
          </div>
        </Card>

        {/* الإقرار الضريبي */}
        <div className="space-y-4">
          <Card className="border-border bg-white p-5">
            <h3 className="mb-1 flex items-center gap-2 font-display text-base font-bold text-ink">
              <Landmark className="size-4 text-navy-500" /> حاسبة الإقرار الضريبي (ضريبة القيمة المضافة)
            </h3>
            <p className="mb-4 text-xs text-ink-muted">تجمع الأرقام تلقائيًا من قيودك — اختر الربع وستجد ما يلزم لتعبئة الإقرار</p>

            <Select value={String(quarterIdx)} onChange={(e) => setQuarterIdx(Number(e.target.value))} className="mb-4"
              options={quarters.map((qq, i) => ({ value: String(i), label: `${qq.label} — آخر موعد معتاد للتقديم: ${qq.filingDeadline}` }))}
            />

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-surface-subtle px-3 py-2.5">
                <span className="text-ink">الإيرادات الخاضعة خلال الفترة</span>
                <span className="font-display font-bold text-ink">{formatSAR(vat.taxableSales)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-subtle px-3 py-2.5">
                <span className="text-ink">ضريبة المخرجات <span className="text-xs text-ink-muted">(المحصلة من العملاء)</span></span>
                <span className="font-display font-bold text-ink">{formatSAR(vat.outputVat)}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-surface-subtle px-3 py-2.5">
                <span className="text-ink">ضريبة المدخلات <span className="text-xs text-ink-muted">(المدفوعة على المشتريات)</span></span>
                <span className="font-display font-bold text-ink">{formatSAR(vat.inputVat)}</span>
              </div>
              <div className={`flex items-center justify-between rounded-lg px-3 py-3 text-white ${vat.netVat >= 0 ? 'bg-navy' : 'bg-success'}`}>
                <span className="font-bold">{vat.netVat >= 0 ? 'الصافي المستحق للسداد' : 'رصيد قابل للاسترداد/الترحيل'}</span>
                <span className="font-display text-lg font-bold">{formatSAR(Math.abs(vat.netVat))}</span>
              </div>
            </div>

            <p className="mt-4 rounded-lg bg-surface-subtle p-3 text-xs leading-5 text-ink-muted">
              هذه الأرقام مستخرجة من القيود المسجلة لديك وهي أداة مساعدة للتنظيم، ولا تغني عن مراجعة
              محاسب أو مستشار زكاة وضريبة مرخص قبل تقديم الإقرار الرسمي، إذ تخضع الالتزامات النهائية
              لوضع المكتب النظامي ولأنظمة هيئة الزكاة والضريبة والجمارك.
            </p>
          </Card>

          {/* قواعد مبسطة لغير المحاسب */}
          <Card className="border-border bg-white p-5">
            <h3 className="mb-3 flex items-center gap-2 font-display text-base font-bold text-ink">
              <Lightbulb className="size-4 text-[#8a6b36]" /> قواعد بسيطة تكفيك
            </h3>
            <ul className="space-y-2.5 text-sm leading-6 text-ink">
              <li className="flex gap-2"><BookOpen className="mt-1 size-4 shrink-0 text-navy-400" /> سجّل كل مصروف أو إيراد يوم حدوثه — لا تؤجل لنهاية الشهر.</li>
              <li className="flex gap-2"><Paperclip className="mt-1 size-4 shrink-0 text-navy-400" /> أرفق الإيصال أو الفاتورة مع كل قيد؛ القيد بلا مستند يظهر في التنبيهات أعلاه.</li>
              <li className="flex gap-2"><BadgePercent className="mt-1 size-4 shrink-0 text-navy-400" /> إن كانت الفاتورة تشمل ضريبة قيمة مضافة، اكتب مبلغ الضريبة في خانة «منها ضريبة» — الحاسبة تجمعها لك تلقائيًا.</li>
              <li className="flex gap-2"><CalendarClock className="mt-1 size-4 shrink-0 text-navy-400" /> افتح هذه الصفحة بداية كل شهر: التنبيهات تخبرك بما ينقص وبمواعيد الإقرار.</li>
              <li className="flex gap-2"><Scale className="mt-1 size-4 shrink-0 text-navy-400" /> راقب «الصافي»: إن تحول أحمر فراجع أكبر ثلاثة بنود مصروفات في الرسم الدائري.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
