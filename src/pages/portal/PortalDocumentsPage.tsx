import { useQuery } from '@tanstack/react-query'
import { FileText } from 'lucide-react'
import { Card } from '../../components/ui/card'
import { PageHeader } from '../../components/ui/page-header'
import { listMyDocuments } from '../../lib/portal'

export default function PortalDocumentsPage() {
  const { data: docs = [], isLoading, error } = useQuery({ queryKey: ['portal','documents'], queryFn: () => listMyDocuments() })
  return <div className="space-y-6 pb-12"><PageHeader title="المستندات المتاحة لحسابك" description="المستندات التي شاركها الفريق القانوني معك فقط" />
    {isLoading ? <p className="text-sm text-ink-muted">جاري التحميل...</p> : error ? <p className="text-sm text-danger">{(error as Error).message}</p> : <div className="space-y-3">{docs.map(d => <Card key={d.id} className="flex items-center gap-3 bg-white p-4"><FileText className="size-5 text-navy"/><div><h4 className="font-bold">{d.name}</h4><p className="text-xs text-ink-muted">{d.size} • {new Date(d.uploadedAt).toLocaleDateString('ar-SA')}</p></div></Card>)}{docs.length === 0 && <div className="rounded-3xl border border-dashed bg-white p-12 text-center">لا توجد مستندات متاحة حاليًا</div>}</div>}
  </div>
}
