import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Calendar as CalendarIcon,
  Video,
  Building,
  Phone,
  CheckCircle2,
  AlertCircle,
  Scale,
  ArrowLeft,
} from 'lucide-react'
import { useT } from '../lib/i18n'
import { track } from '../lib/analytics'
import { createAppointment, createLead } from '../lib/store'
import { DEMO_SERVICES } from '../data/demo'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { cn } from '../lib/utils'
import { useSEO, breadcrumbLd } from '../lib/seo'

const TIME_SLOTS = ['09:00 ص', '10:30 ص', '01:00 م', '02:30 م', '04:30 م', '06:00 م', '07:30 م']

const LABEL = 'block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500'
const FIELD =
  'h-12 w-full rounded-lg border-[#E5D9C5] bg-white text-[15px] text-[#0F172A] placeholder:text-slate-400 placeholder:font-normal focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 transition-colors font-medium'

const MEETING_TYPES = [
  { id: 'video', icon: Video, ar: 'مرئية عن بُعد', en: 'Video' },
  { id: 'office', icon: Building, ar: 'حضورية بالمكتب', en: 'In Office' },
  { id: 'phone', icon: Phone, ar: 'هاتفية', en: 'Phone' },
] as const

export default function BookPage() {
  const { t, isRTL } = useT()
  const [searchParams] = useSearchParams()
  const initialServiceId = searchParams.get('service')

  useSEO({
    title: 'حجز استشارة قانونية | مكتب المحامي ابن نوح',
    description: 'احجز جلسة استشارة قانونية مع مكتب المحامي ابن نوح بالرياض — حضورياً بالمكتب أو هاتفياً أو عبر الفيديو.',
    path: '/book',
    jsonLd: breadcrumbLd([
      { name: 'الرئيسية', path: '/' },
      { name: 'حجز استشارة', path: '/book' },
    ]),
  })

  const [selectedType, setSelectedType] = useState<'video' | 'office' | 'phone'>('video')
  const [selectedService, setSelectedService] = useState<string>(
    DEMO_SERVICES.find((s) => s.id === initialServiceId)?.titleAr || DEMO_SERVICES[0].titleAr
  )
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [selectedTime, setSelectedTime] = useState<string>(TIME_SLOTS[1])

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')

  const [isSuccess, setIsSuccess] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const typeLabel =
    selectedType === 'video'
      ? t('مرئية عبر الفيديو', 'Video call')
      : selectedType === 'office'
        ? t('حضورية بالمكتب — الرياض', 'In office — Riyadh')
        : t('مكالمة هاتفية', 'Phone call')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError(t('يرجى تعبئة كافة الحقول المطلوبة للتواصل', 'Please complete all required fields'))
      return
    }

    if (isSubmitting) return
    setIsSubmitting(true)
    track('booking_completed', { selectedType, selectedService, selectedDate, selectedTime })

    try {
      const lead = await createLead({
        name: name.trim(), phone: phone.trim(), email: email.trim(), type: 'individual',
        category: selectedService, source: 'direct', consultationType: selectedType,
        preferredDate: selectedDate,
        summary: notes || `حجز موعد استشارة: ${selectedService} | الوقت: ${selectedTime} | طريقة الانعقاد: ${selectedType}`,
      })
      const appt = await createAppointment({
        leadId: lead.id, name: name.trim(), phone: phone.trim(), email: email.trim(),
        type: selectedType, category: selectedService, preferredDate: selectedDate,
        preferredTime: selectedTime, notes,
      })
      setBookingRef(appt.ref)
      setIsSuccess(true)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'تعذر حفظ الحجز، يرجى المحاولة مرة أخرى')
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ── شاشة التأكيد ────────────────────────────────────────────── */
  if (isSuccess) {
    return (
      <div className="bg-[#FAF9F5] font-tajawal min-h-screen text-[#0F172A] antialiased flex items-center">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
          <CheckCircle2 className="size-10 text-[#C5A880] mx-auto" strokeWidth={1.25} />

          <div className="flex items-center justify-center gap-4 py-5">
            <div className="h-px w-14 bg-[#E6DBC9]" />
            <Scale className="size-4 text-[#C5A880]" strokeWidth={1.5} />
            <div className="h-px w-14 bg-[#E6DBC9]" />
          </div>

          <h1 className="font-amiri text-3xl font-bold text-[#0F172A] leading-snug">
            {t('تم استلام طلب الموعد', 'Booking Request Received')}
          </h1>

          <p className="font-tajawal text-[13.5px] text-[#64748B] font-medium leading-[2] mt-4">
            {t(
              'سيراجع الفريق الموعد والبيانات المرسلة، ويصبح الحجز مؤكداً بعد إشعاركم عبر إحدى قنوات التواصل المسجّلة.',
              'Our team will review your request. The appointment is confirmed only after you receive a confirmation notice.'
            )}
          </p>

          <div className="mt-8 bg-white border border-[#EADFCF] rounded-2xl overflow-hidden text-start">
            <div className="px-6 py-4 border-b border-[#F1E8DA] flex items-center justify-between gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {t('الرقم المرجعي', 'Reference')}
              </span>
              <span className="text-[15px] font-bold text-[#9A7B3E] tracking-wide">{bookingRef}</span>
            </div>
            <div className="px-6 py-4 border-b border-[#F1E8DA] flex items-center justify-between gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {t('التخصص', 'Practice Area')}
              </span>
              <span className="text-[13.5px] font-semibold text-[#0F172A] text-end">{selectedService}</span>
            </div>
            <div className="px-6 py-4 border-b border-[#F1E8DA] flex items-center justify-between gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {t('الموعد', 'Date & Time')}
              </span>
              <span className="text-[13.5px] font-semibold text-[#0F172A]">{selectedDate} — {selectedTime}</span>
            </div>
            <div className="px-6 py-4 flex items-center justify-between gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                {t('طريقة الانعقاد', 'Format')}
              </span>
              <span className="text-[13.5px] font-semibold text-[#0F172A]">{typeLabel}</span>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-8 h-11 px-7 rounded-lg bg-[#0B132B] hover:bg-[#16203f] text-white text-[13px] font-bold transition-colors"
          >
            <span>{t('العودة للرئيسية', 'Back to Home')}</span>
            <ArrowLeft className={cn('size-3.5 text-[#D6B57E]', !isRTL && 'rotate-180')} />
          </Link>
        </div>
      </div>
    )
  }

  /* ── نموذج الحجز ─────────────────────────────────────────────── */
  return (
    <div className="bg-[#FAF9F5] font-tajawal min-h-screen pb-24 text-[#0F172A] antialiased">

      {/* الترويسة — بنفس هوية بقية الصفحات */}
      <section className="relative pt-20 pb-24 bg-[#0B132B] text-white border-b border-[#C5A880]/30 overflow-hidden mb-16">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C5A880 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />

        <div className="max-w-4xl mx-auto px-4 text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] text-xs font-bold">
            <CalendarIcon className="size-4 text-[#C5A880]" />
            <span>{t('طلب موعد استشارة', 'Consultation Request')}</span>
          </div>

          <h1 className="font-amiri text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {t('احجز جلسة استشارة قانونية', 'Book a Legal Consultation')}
          </h1>

          <div className="flex items-center justify-center gap-4 py-1">
            <div className="h-[1px] w-16 bg-[#C5A880]/60" />
            <Scale className="size-5 text-[#C5A880]" strokeWidth={1.5} />
            <div className="h-[1px] w-16 bg-[#C5A880]/60" />
          </div>

          <p className="font-tajawal text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            {t(
              'اختر الموعد وطريقة الانعقاد المناسبة، وسيؤكد الفريق التوفر ونطاق الاستشارة بعد مراجعة الطلب.',
              'Choose your preferred time and format; availability and scope are confirmed after review.'
            )}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* مسار التنقّل — رجوع واضح */}
        <Link
          to="/services"
          className="group inline-flex items-center gap-2 mb-8 text-[12px] font-bold text-[#64748B] hover:text-[#9A7B3E] transition-colors"
        >
          <ArrowLeft className={cn('size-3.5 text-[#C5A880] transition-transform', isRTL ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1')} />
          <span>{t('العودة إلى التخصصات', 'Back to Practice Areas')}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* النموذج */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-[#EADFCF] rounded-2xl p-8 sm:p-10">
              <form onSubmit={handleSubmit} className="space-y-9">

                {error && (
                  <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 font-medium flex items-center gap-3">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* ١ — طريقة الانعقاد */}
                <div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-amiri text-lg text-[#C5A880]">01</span>
                    <span className={LABEL}>{t('طريقة الانعقاد', 'Meeting Format')}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {MEETING_TYPES.map((type) => {
                      const Icon = type.icon
                      const active = selectedType === type.id
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedType(type.id)}
                          className={cn(
                            'flex flex-col items-center gap-2.5 rounded-lg border px-3 py-5 transition-colors',
                            active
                              ? 'border-[#C5A880] bg-[#FAF5EB] text-[#0F172A]'
                              : 'border-[#EADFCF] bg-white text-slate-500 hover:border-[#C5A880]/60 hover:bg-[#FCFAF6]'
                          )}
                        >
                          <Icon className={cn('size-5', active ? 'text-[#9A7B3E]' : 'text-[#C5A880]')} strokeWidth={1.5} />
                          <span className="text-[11.5px] font-bold leading-tight text-center">{t(type.ar, type.en)}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* ٢ — التخصص */}
                <div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-amiri text-lg text-[#C5A880]">02</span>
                    <span className={LABEL}>{t('التخصص أو الخدمة', 'Practice Area')}</span>
                  </div>

                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className={cn(FIELD, 'px-4 cursor-pointer')}
                  >
                    {DEMO_SERVICES.map((s) => (
                      <option key={s.id} value={s.titleAr}>{s.titleAr}</option>
                    ))}
                  </select>
                </div>

                {/* ٣ — التاريخ والوقت */}
                <div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="font-amiri text-lg text-[#C5A880]">03</span>
                    <span className={LABEL}>{t('التاريخ والوقت', 'Date & Time')}</span>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-slate-500">{t('تاريخ الموعد', 'Date')}</span>
                      <Input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className={FIELD}
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-slate-500">{t('الأوقات المتاحة', 'Available Slots')}</span>
                      <div className="flex flex-wrap gap-2">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            type="button"
                            key={slot}
                            onClick={() => setSelectedTime(slot)}
                            className={cn(
                              'rounded-lg border px-4 py-2.5 text-[12px] font-bold tracking-wide transition-colors',
                              selectedTime === slot
                                ? 'border-[#C5A880] bg-[#0B132B] text-[#D6B57E]'
                                : 'border-[#EADFCF] bg-white text-slate-500 hover:border-[#C5A880]/60 hover:bg-[#FCFAF6]'
                            )}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ٤ — بيانات التواصل */}
                <div className="pt-2 border-t border-[#F1E8DA]">
                  <div className="flex items-baseline gap-2 mb-4 mt-7">
                    <span className="font-amiri text-lg text-[#C5A880]">04</span>
                    <span className={LABEL}>{t('بيانات التواصل', 'Contact Details')}</span>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className={LABEL}>{t('الاسم الكامل', 'Full Name')}</label>
                      <Input required value={name} onChange={(e) => setName(e.target.value)} className={FIELD} placeholder={t('الاسم الكامل', 'Full name')} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className={LABEL}>{t('رقم الجوال', 'Mobile')}</label>
                        <Input required dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className={cn(FIELD, 'tracking-wide')} placeholder="05XXXXXXXX" />
                      </div>
                      <div className="space-y-2">
                        <label className={LABEL}>{t('البريد الإلكتروني', 'Email')}</label>
                        <Input required type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className={FIELD} placeholder="name@domain.com" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={LABEL}>{t('نبذة مختصرة عن الموضوع (اختياري)', 'Brief Description (optional)')}</label>
                      <Textarea
                        rows={4}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className={cn(FIELD, 'h-auto resize-none p-4 leading-relaxed')}
                        placeholder={t('اذكر موضوع الاستشارة بإيجاز ليطّلع عليه المحامي قبل الموعد...', 'Briefly describe your matter...')}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 px-8 bg-[#0B132B] hover:bg-[#16203f] disabled:opacity-60 text-white font-bold rounded-lg text-[15px] transition-colors inline-flex items-center justify-center gap-2.5"
                  >
                    <span>{isSubmitting ? t('جارٍ الإرسال...', 'Sending...') : t('تأكيد طلب الحجز', 'Confirm Booking')}</span>
                    <ArrowLeft className={cn('size-4 text-[#D6B57E]', !isRTL && 'rotate-180')} />
                  </button>

                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    {t(
                      'الحجز يصبح مؤكداً بعد مراجعة الطلب وإشعاركم. جميع البيانات تخضع للسرية المهنية.',
                      'The booking is confirmed after review. All data is covered by professional confidentiality.'
                    )}
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* ملخص الموعد */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[#0B132B] text-white rounded-2xl border border-white/10 overflow-hidden">
              <div className="px-7 pt-7 pb-5 border-b border-white/10">
                <span className="text-[10px] font-bold text-[#C5A880] tracking-[0.22em] uppercase block mb-2">
                  {t('مراجعة الطلب', 'Request Summary')}
                </span>
                <h2 className="font-amiri font-bold text-xl text-white leading-snug">
                  {t('ملخص الموعد', 'Appointment Summary')}
                </h2>
              </div>

              <div>
                <div className="px-7 py-5 border-b border-white/[0.07]">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-semibold block mb-1.5">
                    {t('التخصص المختار', 'Selected Area')}
                  </span>
                  <span className="block text-white text-[14px] font-semibold leading-relaxed">{selectedService}</span>
                </div>

                <div className="grid grid-cols-2 border-b border-white/[0.07]">
                  <div className="px-7 py-5 border-e border-white/[0.07]">
                    <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-semibold block mb-1.5">
                      {t('التاريخ', 'Date')}
                    </span>
                    <span className="block text-white text-[13.5px] font-semibold tracking-wide">{selectedDate}</span>
                  </div>
                  <div className="px-7 py-5">
                    <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-semibold block mb-1.5">
                      {t('الوقت', 'Time')}
                    </span>
                    <span className="block text-white text-[13.5px] font-semibold tracking-wide">{selectedTime}</span>
                  </div>
                </div>

                <div className="px-7 py-5">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-semibold block mb-1.5">
                    {t('طريقة الانعقاد', 'Format')}
                  </span>
                  <span className="block text-[#D6B57E] text-[14px] font-semibold">{typeLabel}</span>
                </div>
              </div>

              <div className="px-7 py-5 bg-white/[0.03] border-t border-white/10">
                <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
                  {t(
                    'مدة الجلسة 45 دقيقة. يُفضّل تجهيز المستندات ذات العلاقة قبل الموعد.',
                    'Sessions run 45 minutes. Please prepare any relevant documents beforehand.'
                  )}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
