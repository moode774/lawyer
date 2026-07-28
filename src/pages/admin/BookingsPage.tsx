import React, { useState } from 'react'
import { Calendar, Clock, Video, Building, Phone, CheckCircle2, XCircle, Search } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { store } from '../../lib/store'
import { Appointment } from '../../types'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { StatusBadge } from '../../components/ui/status-badge'
import { PageHeader } from '../../components/ui/page-header'
import { Avatar } from '../../components/ui/avatar'
import { useSEO } from '../../lib/seo'

export default function BookingsPage() {
  const { t } = useT()
  useSEO({ title: 'جدول المواعيد والاستشارات | ' + t('مكتب المحاماة', 'Law Firm') })

  const [appointments, setAppointments] = useState<Appointment[]>(store.getAppointments())
  const [search, setSearch] = useState('')

  const filtered = appointments.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.ref.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t('جدولة المواعيد والاستشارات', 'Consultation Calendar')}
        description={t('متابعة المواعيد المجدولة حضوريًا وعن بعد وتحديث حالة المقابلات', 'Manage video, phone & office consultations')}
      />

      <Card className="p-4 bg-white border-border">
        <div className="relative max-w-md">
          <Search className="absolute start-3 top-2.5 size-4 text-ink-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('بحث باسم طالب الاستشارة...', 'Search appointments...')}
            className="ps-9"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((appt) => (
          <Card key={appt.id} className="p-5 bg-white border-border space-y-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={appt.name} />
                <div>
                  <h4 className="font-bold text-ink text-base">{appt.name}</h4>
                  <span className="font-mono text-xs text-ink-muted">{appt.ref}</span>
                </div>
              </div>
              <StatusBadge status={appt.status} />
            </div>

            <div className="p-3 rounded-xl bg-surface border border-border/60 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-ink-muted">{t('تاريخ الموعد:', 'Date:')}</span>
                <span className="font-mono font-bold text-navy">{appt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">{t('التوقيت والمدة:', 'Time:')}</span>
                <span className="font-mono text-ink">{appt.time} ({appt.duration})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">{t('المكان / الطريقة:', 'Location:')}</span>
                <span className="font-medium text-navy">{appt.location || appt.type}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
