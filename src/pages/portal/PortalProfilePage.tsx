import { useQuery } from '@tanstack/react-query'
import { Card } from '../../components/ui/card'
import { PageHeader } from '../../components/ui/page-header'
import { getMyClient } from '../../lib/portal'
import { useAuth } from '../../lib/auth'

export default function PortalProfilePage() {
  const { user } = useAuth()
  const { data: client, isLoading, error } = useQuery({ queryKey: ['portal','client'], queryFn: getMyClient })
  return <div className="space-y-6 pb-12"><PageHeader title="بيانات حساب العميل" description="البيانات المرتبطة بحسابك في النظام" />
    {isLoading ? <p>جاري التحميل...</p> : error ? <p className="text-danger">{(error as Error).message}</p> : <Card className="mx-auto max-w-xl space-y-4 bg-white p-6 text-sm">
      {[['الاسم / المنشأة',client?.name || user?.name],['رقم المرجع',client?.ref || 'لم يُربط ملف عميل بعد'],['رقم الجوال',client?.phone || user?.phone],['البريد الإلكتروني',client?.email || user?.email],['العنوان',client?.address]].map(([label,value]) => <div key={label} className="flex justify-between gap-4 border-b pb-2"><span className="text-ink-muted">{label}</span><span className="font-bold text-ink">{value || '—'}</span></div>)}
    </Card>}
  </div>
}
