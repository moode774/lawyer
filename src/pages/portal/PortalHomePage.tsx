import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Briefcase, FileText, Calendar, MessageSquare, ShieldCheck, ArrowLeft, Plus, LockKeyhole } from 'lucide-react'
import { useT } from '../../lib/i18n'
import type { Appointment, Doc, Matter } from '../../types'
import { listMyAppointments, listMyDocuments, listMyMatters } from '../../lib/portal'
import { Card } from '../../components/ui/card'
import { StatusBadge } from '../../components/ui/status-badge'
import { useSEO } from '../../lib/seo'
import { useAuth } from '../../lib/auth'

export default function PortalHomePage() {
  const { t, isRTL } = useT()
  const { user } = useAuth()
  useSEO({ title: 'بوابة العميل | متابعة المستجدات والقضايا' })

  const { data: matters = [] } = useQuery({ queryKey: ['portal','matters'], queryFn: listMyMatters })
  const { data: allAppts = [] } = useQuery({ queryKey: ['portal','appointments'], queryFn: listMyAppointments })
  const { data: allDocs = [] } = useQuery({ queryKey: ['portal','documents'], queryFn: () => listMyDocuments() })
  const appts = allAppts.slice(0, 2)
  const docs = allDocs.slice(0, 3)

  return (
    <div className="mx-auto max-w-[1500px] space-y-7 pb-12">
      <div className="relative overflow-hidden rounded-[30px] border border-[#284463] bg-[#152743] p-6 text-white shadow-[0_18px_45px_rgba(21,39,67,0.2)] sm:p-8 lg:p-10">
        <div className="absolute -end-20 -top-28 size-72 rounded-full border border-white/10 bg-[#8EB1D1]/10" />
        <div className="absolute -bottom-28 end-24 size-64 rounded-full border border-white/10" />
        <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-[#C8D8E4]">
              <ShieldCheck className="size-3.5" /> مساحة خاصة بحسابك
            </div>
            <h1 className="font-amiri text-3xl font-bold sm:text-4xl">{t(`مرحبًا بك، ${user?.name || 'عميلنا الكريم'}`, `Welcome, ${user?.name || 'Client'}`)}</h1>
            <p className="max-w-xl text-sm leading-7 text-[#C8D8E4]">
              {t('تابع ملفاتك ومواعيدك والمستندات التي أتاحها الفريق لحسابك، وتواصل من قناة واحدة منظمة.', 'Track your matters, appointments, shared documents, and messages in one organized space.')}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/portal/messages" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white px-5 py-3 text-xs font-bold text-[#152743] hover:bg-[#EAF0F4]">
              <MessageSquare className="size-4" /> {t('مراسلة الفريق', 'Message the team')}
            </Link>
            <Link to="/book" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold text-white hover:bg-white/15">
              <Plus className="size-4" /> {t('طلب موعد', 'Request appointment')}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-3xl border-[#D9E3EA] bg-white p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-ink text-base">{t('القضايا النشطة', 'Active Matters')}</h3>
            <span className="rounded-2xl bg-[#EAF0F4] p-3"><Briefcase className="size-5 text-[#152743]" /></span>
          </div>
          <p className="text-3xl font-bold text-navy font-mono">{matters.length}</p>
          <Link to="/portal/matters" className="text-xs font-semibold text-navy hover:underline flex items-center gap-1">
            <span>{t('عرض كافة الملفات', 'View matters')}</span>
            <ArrowLeft className={isRTL ? 'rotate-0 size-3.5' : 'rotate-180 size-3.5'} />
          </Link>
        </Card>

        <Card className="rounded-3xl border-[#D9E3EA] bg-white p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-ink text-base">{t('المستندات والعقود', 'Documents')}</h3>
            <span className="rounded-2xl bg-[#EEF4F8] p-3"><FileText className="size-5 text-[#527094]" /></span>
          </div>
          <p className="text-3xl font-bold text-accent font-mono">{docs.length}</p>
          <Link to="/portal/documents" className="text-xs font-semibold text-navy hover:underline flex items-center gap-1">
            <span>{t('تصفح المستندات', 'View documents')}</span>
            <ArrowLeft className={isRTL ? 'rotate-0 size-3.5' : 'rotate-180 size-3.5'} />
          </Link>
        </Card>

        <Card className="rounded-3xl border-[#D9E3EA] bg-white p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-ink text-base">{t('المواعيد القادمة', 'Appointments')}</h3>
            <span className="rounded-2xl bg-[#ECF7F2] p-3"><Calendar className="size-5 text-emerald-700" /></span>
          </div>
          <p className="text-3xl font-bold text-emerald-600 font-mono">{appts.length}</p>
          <Link to="/portal/appointments" className="text-xs font-semibold text-navy hover:underline flex items-center gap-1">
            <span>{t('جدول الجلسات', 'View calendar')}</span>
            <ArrowLeft className={isRTL ? 'rotate-0 size-3.5' : 'rotate-180 size-3.5'} />
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_.75fr]">
      <Card className="rounded-3xl border-[#D9E3EA] bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E3EAF0] pb-4">
          <div><h3 className="font-bold text-[#152743] text-lg">{t('الملفات القانونية', 'Legal Matters')}</h3><p className="mt-1 text-[11px] text-[#7890A9]">آخر الحالات المتاحة لحسابك</p></div>
          <Link to="/portal/matters" className="text-xs font-bold text-[#527094] hover:text-[#152743]">عرض الكل</Link>
        </div>
        <div className="space-y-3">
          {matters.map((m: Matter) => (
            <div key={m.id} className="p-4 rounded-2xl bg-[#F7F9FA] border border-[#E1E8ED] flex items-center justify-between">
              <div>
                <Link to={`/portal/matters/${m.id}`} className="font-bold text-ink hover:text-navy text-sm">
                  {m.title}
                </Link>
                <div className="text-xs text-ink-muted font-mono">{m.ref} • {m.category}</div>
              </div>
              <StatusBadge status={m.status} />
            </div>
          ))}
          {matters.length === 0 && (
            <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-[#CBD8E1] bg-[#F8FAFB] p-6 text-center">
              <Briefcase className="mb-3 size-7 text-[#9CB1C0]" />
              <p className="text-sm font-bold text-[#152743]">لا توجد ملفات ظاهرة حاليًا</p>
              <p className="mt-1 text-[11px] text-[#7890A9]">ستظهر الملفات هنا بعد قبول التكليف وإتاحتها لحسابك.</p>
            </div>
          )}
        </div>
      </Card>

      <Card className="rounded-3xl border-[#D9E3EA] bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3"><span className="rounded-2xl bg-[#EEF4F8] p-3"><LockKeyhole className="size-5 text-[#527094]" /></span><div><h3 className="text-sm font-bold text-[#152743]">حالة الحساب</h3><p className="text-[10px] text-[#7890A9]">وصول خاص ومحمي بالصلاحيات</p></div></div>
        <div className="space-y-4 border-s border-[#D8E3EA] ps-5">
          {[['تحديثات الملفات','تظهر بعد اعتمادها من الفريق'],['المستندات','تظهر النسخ المصرح بها فقط'],['المواعيد','تتأكد بعد إشعار المكتب']].map(([title, text]) => (
            <div key={title} className="relative"><span className="absolute -start-[25px] top-1 size-2.5 rounded-full border-2 border-white bg-[#8EB1D1] ring-1 ring-[#C9D7E0]" /><p className="text-xs font-bold text-[#152743]">{title}</p><p className="mt-1 text-[10px] leading-5 text-[#7890A9]">{text}</p></div>
          ))}
        </div>
      </Card>
      </div>
    </div>
  )
}
