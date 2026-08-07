import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Calendar, Clock, Video, Building, Phone, MapPin, Search, CalendarDays, MoreHorizontal, FileText, ChevronLeft, CalendarClock } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { listAppointments } from '../../lib/store'
import { Appointment } from '../../types'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { PageHeader } from '../../components/ui/page-header'
import { Avatar } from '../../components/ui/avatar'
import { useSEO } from '../../lib/seo'

export default function BookingsPage() {
  const { t } = useT()
  useSEO({ title: 'جدول المواعيد والاستشارات | ' + t('مكتب المحاماة', 'Law Firm') })

  const { data: appointments = [] } = useQuery<Appointment[]>({ queryKey: ['appointments'], queryFn: () => listAppointments() })
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return appointments.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.ref.toLowerCase().includes(search.toLowerCase()))
  }, [appointments, search])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="size-4 text-sky-600" />
      case 'office': return <Building className="size-4 text-navy" />
      case 'phone': return <Phone className="size-4 text-emerald-600" />
      default: return <MapPin className="size-4 text-slate-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">{t('مؤكد', 'Confirmed')}</span>
      case 'pending': return <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold">{t('بانتظار التأكيد', 'Pending')}</span>
      case 'cancelled': return <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">{t('ملغي', 'Cancelled')}</span>
      default: return <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold">{status}</span>
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t('جدولة المواعيد والاستشارات', 'Consultation Calendar')}
        description={t('إدارة وتنظيم مواعيد العملاء والجلسات الاستشارية', 'Manage client appointments and consultations')}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-6 divide-x divide-x-reverse divide-border/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-navy/5 text-navy rounded-lg">
              <CalendarDays className="size-5" />
            </div>
            <div>
              <p className="text-xs text-ink-muted font-semibold">{t('إجمالي المواعيد', 'Total Appointments')}</p>
              <p className="text-xl font-bold text-ink leading-tight">{appointments.length}</p>
            </div>
          </div>
          <div className="ps-6 flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
              <CalendarClock className="size-5" />
            </div>
            <div>
              <p className="text-xs text-ink-muted font-semibold">{t('بانتظار التأكيد', 'Pending')}</p>
              <p className="text-xl font-bold text-ink leading-tight">{appointments.filter(a => a.status === 'pending').length}</p>
            </div>
          </div>
        </div>

        <div id="tour-bookings-search" className="w-full md:w-96">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-ink-muted" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('بحث برقم المرجع أو اسم العميل...', 'Search appointments...')}
              className="ps-9 bg-surface/50 border-border hover:bg-white focus:bg-white transition-colors h-10 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      <div id="tour-bookings-list" className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="bg-surface/50 border-b border-border/60 text-ink-muted">
              <tr>
                <th className="py-4 px-6 text-start font-bold">{t('العميل', 'Client')}</th>
                <th className="py-4 px-6 text-start font-bold">{t('تاريخ ووقت الموعد', 'Date & Time')}</th>
                <th className="py-4 px-6 text-start font-bold">{t('نوع المقابلة والمكان', 'Location & Type')}</th>
                <th className="py-4 px-6 text-start font-bold">{t('حالة الموعد', 'Status')}</th>
                <th className="py-4 px-6 text-end font-bold">{t('الإجراءات', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((appt) => (
                <tr key={appt.id} className="hover:bg-surface/30 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Avatar name={appt.name} size="sm" />
                      <div>
                        <p className="font-bold text-ink">{appt.name}</p>
                        <p className="text-xs text-ink-muted font-mono mt-0.5">{appt.ref}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-ink">
                        <Calendar className="size-4 text-ink-muted" />
                        <span className="font-semibold">{appt.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-ink-muted text-xs">
                        <Clock className="size-3.5" />
                        <span>{appt.time} ({appt.duration})</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 bg-surface/50 border border-border/40 px-3 py-1.5 rounded-lg w-fit">
                      {getTypeIcon(appt.type)}
                      <span className="font-medium text-ink">{appt.location || appt.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(appt.status)}
                  </td>
                  <td className="py-4 px-6 text-end">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-navy hover:bg-navy/5 px-3">
                        {t('التفاصيل', 'Details')}
                      </Button>
                      <button className="p-1.5 text-ink-muted hover:text-navy hover:bg-navy/5 rounded-md transition-colors">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="size-12 rounded-full bg-surface flex items-center justify-center mb-3 text-ink-muted">
                        <Search className="size-5" />
                      </div>
                      <h3 className="font-bold text-ink text-base mb-1">{t('لا توجد مواعيد', 'No appointments found')}</h3>
                      <p className="text-sm text-ink-muted">
                        {t('لم يتم العثور على أي مواعيد تطابق بحثك.', 'No appointments match your search.')}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
