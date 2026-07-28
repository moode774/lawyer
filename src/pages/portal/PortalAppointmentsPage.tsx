import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Video, Building, Plus } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { store } from '../../lib/store'
import type { Appointment } from '../../types'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/ui/status-badge'
import { PageHeader } from '../../components/ui/page-header'
import { useSEO } from '../../lib/seo'

export default function PortalAppointmentsPage() {
  const { t } = useT()
  useSEO({ title: 'مواعيدي واستشاراتي | بوابة العميل' })

  const appts = store.getAppointments()

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t('جدول استشاراتك والمواعيد', 'Your Appointments')}
        description={t('الاطلاع على مواعيد الجلسات وحجز موعد جديد', 'View calendar & request new session')}
        action={
          <Link to="/book">
            <Button className="bg-navy text-white hover:bg-navy-light gap-2">
              <Plus className="size-4" />
              <span>{t('طلب موعد جديد', 'Book New')}</span>
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appts.map((a: Appointment) => (
          <Card key={a.id} className="p-5 bg-white border-border space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-ink text-sm">{a.name}</span>
              <StatusBadge status={a.status} />
            </div>
            <div className="text-xs text-ink-muted space-y-1 font-mono">
              <div>التاريخ: {a.date} ({a.time})</div>
              <div>المكان: {a.location}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
