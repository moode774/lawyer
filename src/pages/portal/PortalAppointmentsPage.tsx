import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Calendar, Plus } from 'lucide-react'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/ui/status-badge'
import { PageHeader } from '../../components/ui/page-header'
import { listMyAppointments } from '../../lib/portal'

export default function PortalAppointmentsPage() {
  const { data: appts = [], isLoading, error } = useQuery({ queryKey: ['portal','appointments'], queryFn: listMyAppointments })
  return <div className="space-y-6 pb-12"><PageHeader title="مواعيدك واستشاراتك" description="المواعيد المرتبطة بملف العميل" action={<Link to="/book"><Button className="gap-2 bg-navy text-white"><Plus className="size-4"/>طلب موعد</Button></Link>} />
    {isLoading ? <p className="text-sm text-ink-muted">جاري التحميل...</p> : error ? <p className="text-sm text-danger">{(error as Error).message}</p> : <div className="grid gap-4 md:grid-cols-2">{appts.map(a => <Card key={a.id} className="space-y-3 bg-white p-5"><div className="flex justify-between"><span className="font-bold">{a.name}</span><StatusBadge status={a.status}/></div><div className="text-xs text-ink-muted">{a.date} — {a.time}<br/>{a.location}</div></Card>)}{appts.length === 0 && <div className="md:col-span-2 rounded-3xl border border-dashed bg-white p-12 text-center"><Calendar className="mx-auto mb-3 size-8 text-[#9CB1C0]"/>لا توجد مواعيد مرتبطة بالحساب</div>}</div>}
  </div>
}
