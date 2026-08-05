import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, FileText } from 'lucide-react'
import { Card } from '../../components/ui/card'
import { StatusBadge } from '../../components/ui/status-badge'
import { PageHeader } from '../../components/ui/page-header'
import { getMyMatter, listMyDocuments } from '../../lib/portal'

export default function PortalMatterDetailPage() {
  const { id = '' } = useParams()
  const { data: matter, isLoading, error } = useQuery({ queryKey: ['portal','matter',id], queryFn: () => getMyMatter(id), enabled: Boolean(id) })
  const { data: docs = [] } = useQuery({ queryKey: ['portal','matter-documents',id], queryFn: () => listMyDocuments(id), enabled: Boolean(matter) })
  if (isLoading) return <div className="p-8 text-ink-muted">جاري التحميل...</div>
  if (error || !matter) return <div className="p-8 text-danger">{error ? (error as Error).message : 'الملف غير موجود أو غير متاح لحسابك'}</div>
  return <div className="mx-auto max-w-4xl space-y-6 py-8">
    <Link to="/portal/matters" className="flex items-center gap-1 text-xs font-bold text-navy"><ArrowLeft className="size-3.5"/>العودة للقضايا</Link>
    <PageHeader title={matter.title} description={`المرجع: ${matter.ref} • الجهة: ${matter.court || 'غير محددة'}`} action={<StatusBadge status={matter.status}/>} />
    <Card className="space-y-4 bg-white p-6"><h3 className="border-b pb-2 font-bold">ملخص الملف</h3><p className="text-sm leading-7 text-ink-muted">{matter.description || 'لا يوجد وصف متاح للعميل.'}</p></Card>
    <Card className="space-y-4 bg-white p-6"><h3 className="border-b pb-2 font-bold">المستندات المتاحة</h3>{docs.map(d => <div key={d.id} className="flex items-center justify-between rounded-xl border p-3 text-xs"><span className="flex items-center gap-2 font-semibold"><FileText className="size-4 text-navy"/>{d.name}</span><span>{d.size}</span></div>)}{docs.length===0 && <p className="py-4 text-center text-xs text-ink-muted">لا توجد مستندات متاحة حاليًا.</p>}</Card>
  </div>
}
