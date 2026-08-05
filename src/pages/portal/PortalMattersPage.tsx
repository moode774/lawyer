import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Briefcase } from 'lucide-react'
import { Card } from '../../components/ui/card'
import { StatusBadge } from '../../components/ui/status-badge'
import { PageHeader } from '../../components/ui/page-header'
import { listMyMatters } from '../../lib/portal'

export default function PortalMattersPage() {
  const { data: matters = [], isLoading, error } = useQuery({ queryKey: ['portal','matters'], queryFn: listMyMatters })
  return <div className="space-y-6 pb-12">
    <PageHeader title="قضاياك ومعاملاتك القانونية" description="الملفات المرتبطة بحسابك فقط وفق صلاحيات الوصول" />
    {isLoading ? <p className="text-sm text-ink-muted">جاري التحميل...</p> : error ? <p className="text-sm text-danger">{(error as Error).message}</p> :
      <div className="space-y-4">{matters.map(m => <Card key={m.id} className="flex items-center justify-between rounded-2xl border-[#D9E3EA] bg-white p-5 shadow-sm"><div><Link to={`/portal/matters/${m.id}`} className="font-bold text-ink hover:text-navy">{m.title}</Link><div className="text-xs text-ink-muted">{m.ref} • {m.category}</div></div><StatusBadge status={m.status} /></Card>)}
      {matters.length === 0 && <div className="rounded-3xl border border-dashed bg-white p-12 text-center"><Briefcase className="mx-auto mb-3 size-8 text-[#9CB1C0]"/><p className="text-sm font-bold">لا توجد ملفات ظاهرة حاليًا</p></div>}</div>}
  </div>
}
