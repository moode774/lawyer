import { useQuery } from '@tanstack/react-query'
import { CircleCheck, Clock3, ReceiptText } from 'lucide-react'
import { Card } from '../../components/ui/card'
import { PageHeader } from '../../components/ui/page-header'
import { listMyInvoices } from '../../lib/portal'

const money = (value: number) => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(value)

export default function PortalInvoicesPage() {
  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ['portal', 'invoices'],
    queryFn: listMyInvoices,
  })

  return (
    <div className="space-y-6 pb-12">
      <PageHeader title="الفواتير والمدفوعات" description="عرض الفواتير المرتبطة بحسابك وحالة السداد فقط" />
      {isLoading ? <p className="text-sm text-ink-muted">جاري التحميل...</p> : error ? (
        <p className="text-sm text-danger">{(error as Error).message}</p>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {invoices.map((invoice) => {
            const paid = invoice.remaining === 0
            return (
              <Card key={invoice.id} className="space-y-4 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-2xl bg-[#EAF0F4] p-3 text-[#152743]"><ReceiptText className="size-5" /></span>
                    <div><p className="font-bold">فاتورة {invoice.invoiceNumber}</p><p className="text-xs text-ink-muted">تاريخ الإصدار: {new Date(invoice.issueDate).toLocaleDateString('ar-SA')}</p></div>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${paid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
                    {paid ? <CircleCheck className="size-3.5" /> : <Clock3 className="size-3.5" />}{paid ? 'مسددة' : 'مستحقة'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 border-t pt-4 text-center">
                  <div><p className="text-[11px] text-ink-muted">الإجمالي</p><p className="mt-1 text-sm font-bold">{money(invoice.total)}</p></div>
                  <div><p className="text-[11px] text-ink-muted">المدفوع</p><p className="mt-1 text-sm font-bold text-emerald-700">{money(invoice.paidAmount)}</p></div>
                  <div><p className="text-[11px] text-ink-muted">المتبقي</p><p className="mt-1 text-sm font-bold text-[#152743]">{money(invoice.remaining)}</p></div>
                </div>
                {invoice.vatAmount > 0 && <p className="text-[11px] text-ink-muted">يشمل ضريبة قيمة مضافة: {money(invoice.vatAmount)}</p>}
              </Card>
            )
          })}
          {invoices.length === 0 && <div className="rounded-3xl border border-dashed bg-white p-12 text-center text-sm text-ink-muted xl:col-span-2">لا توجد فواتير مرتبطة بحسابك حاليًا</div>}
        </div>
      )}
    </div>
  )
}
