import React from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, FileText, Calendar, MessageSquare, ShieldCheck, ArrowLeft } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { store } from '../../lib/store'
import type { Doc, Matter } from '../../types'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/ui/status-badge'
import { useSEO } from '../../lib/seo'

export default function PortalHomePage() {
  const { t, isRTL } = useT()
  useSEO({ title: 'بوابة العميل | متابعة المستجدات والقضايا' })

  // Client c_1 demo data
  const matters = store.getMatters('c_1')
  const appts = store.getAppointments().slice(0, 2)
  const docs = store.getDocuments().filter((d: Doc) => d.clientId === 'c_1' || d.visibility === 'client').slice(0, 3)

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-gradient-to-r from-navy to-navy-light text-white p-6 sm:p-8 rounded-3xl space-y-2 shadow-lg">
        <span className="text-xs text-accent font-semibold">{t('بوابة العميل المعتمدة', 'Secure Client Portal')}</span>
        <h1 className="text-2xl sm:text-3xl font-bold">{t('مرحبًا بك، شركة الحلول الرقمية المحدودة', 'Welcome, Digital Solutions Co.')}</h1>
        <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
          {t('يمكنك متابعة حالة القضايا النشطة، والاطلاع على العقود واللائحة، وجدولة المواعيد بموثوقية وسرية.', 'Track your legal matters, view contracts & request appointments.')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-border space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-ink text-base">{t('القضايا النشطة', 'Active Matters')}</h3>
            <Briefcase className="size-5 text-navy" />
          </div>
          <p className="text-3xl font-bold text-navy font-mono">{matters.length}</p>
          <Link to="/portal/matters" className="text-xs font-semibold text-navy hover:underline flex items-center gap-1">
            <span>{t('عرض كافة الملفات', 'View matters')}</span>
            <ArrowLeft className={isRTL ? 'rotate-0 size-3.5' : 'rotate-180 size-3.5'} />
          </Link>
        </Card>

        <Card className="p-6 bg-white border-border space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-ink text-base">{t('المستندات والعقود', 'Documents')}</h3>
            <FileText className="size-5 text-accent" />
          </div>
          <p className="text-3xl font-bold text-accent font-mono">{docs.length}</p>
          <Link to="/portal/documents" className="text-xs font-semibold text-navy hover:underline flex items-center gap-1">
            <span>{t('تصفح المستندات', 'View documents')}</span>
            <ArrowLeft className={isRTL ? 'rotate-0 size-3.5' : 'rotate-180 size-3.5'} />
          </Link>
        </Card>

        <Card className="p-6 bg-white border-border space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-ink text-base">{t('المواعيد القادمة', 'Appointments')}</h3>
            <Calendar className="size-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-600 font-mono">{appts.length}</p>
          <Link to="/portal/appointments" className="text-xs font-semibold text-navy hover:underline flex items-center gap-1">
            <span>{t('جدول الجلسات', 'View calendar')}</span>
            <ArrowLeft className={isRTL ? 'rotate-0 size-3.5' : 'rotate-180 size-3.5'} />
          </Link>
        </Card>
      </div>

      {/* Active Matters Feed */}
      <Card className="p-6 bg-white border-border space-y-4">
        <h3 className="font-bold text-ink text-lg border-b border-border pb-3">{t('القضايا القائمة وتطورات المرافعة', 'Active Legal Matters')}</h3>
        <div className="space-y-3">
          {matters.map((m: Matter) => (
            <div key={m.id} className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
              <div>
                <Link to={`/portal/matters/${m.id}`} className="font-bold text-ink hover:text-navy text-sm">
                  {m.title}
                </Link>
                <div className="text-xs text-ink-muted font-mono">{m.ref} • {m.category}</div>
              </div>
              <StatusBadge status={m.status} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
