import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Video,
  Building2,
  Phone,
  User,
  Mail,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Info,
  Lock,
  ChevronDown,
} from 'lucide-react'
import { useT } from '../lib/i18n'
import { track } from '../lib/analytics'
import { createAppointment, createLead } from '../lib/store'
import { DEMO_SERVICES } from '../data/demo'
import { cn } from '../lib/utils'
import { useSEO, breadcrumbLd } from '../lib/seo'

const TIME_SLOTS = ['09:00 ص', '10:30 ص', '02:30 م', '04:30 م', '06:30 م', '07:30 م']

const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
]

/** 2026-08-07 → 07 أغسطس 2026 */
function formatArabicDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return `${String(d).padStart(2, '0')} ${MONTHS_AR[m - 1]} ${y}`
}

const LABEL = 'block text-[12px] font-bold text-[#0F172A] mb-2'
const FIELD =
  'h-12 w-full rounded-xl border border-[#E8DFCF] bg-white text-[13px] text-[#0F172A] ' +
  'placeholder:text-slate-400 placeholder:font-normal font-medium transition-colors ' +
  'focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/25'

const MEETING_TYPES = [
  { id: 'video', icon: Video, ar: 'مرئية', en: 'Video' },
  { id: 'office', icon: Building2, ar: 'بالمكتب', en: 'Office' },
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
      ? t('مرئية', 'Video')
      : selectedType === 'office'
        ? t('بالمكتب', 'In office')
        : t('هاتفية', 'Phone')

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

  /* ── شاشة التأكيد ────────────────────────────────────────── */
  if (isSuccess) {
    return (
      <div className="bg-[#FAF9F5] font-tajawal min-h-[80vh] text-[#0F172A] antialiased flex items-center">
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <CheckCircle2 className="size-10 text-[#C5A880] mx-auto mb-5" strokeWidth={1.25} />

          <h1 className="font-amiri text-[30px] font-bold leading-snug">
            {t('تم استلام طلب الحجز', 'Booking Request Received')}
          </h1>
          <span className="block h-px w-16 bg-[#C5A880] mx-auto my-4" />
          <p className="text-[13px] text-[#64748B] font-medium leading-[1.9]">
            {t('سيراجع الفريق طلبك، ويصبح الحجز مؤكداً بعد إشعارك.', 'Our team will review your request; it is confirmed once you are notified.')}
          </p>

          <div className="mt-7 bg-white border border-[#EADFCF] rounded-2xl divide-y divide-[#F1E8DA] text-start overflow-hidden">
            {[
              [t('الرقم المرجعي', 'Reference'), bookingRef],
              [t('التخصص', 'Practice Area'), selectedService],
              [t('التاريخ', 'Date'), formatArabicDate(selectedDate)],
              [t('الوقت', 'Time'), selectedTime],
              [t('طريقة الانعقاد', 'Format'), typeLabel],
            ].map(([k, v]) => (
              <div key={k} className="px-6 py-4 flex items-center justify-between gap-4">
                <span className="text-[11px] font-semibold text-slate-400 shrink-0">{k}</span>
                <span className="text-[13px] font-bold text-end">{v}</span>
              </div>
            ))}
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-7 h-12 px-8 rounded-xl bg-[#0B1E33] hover:bg-[#16294a] text-white text-[13px] font-bold transition-colors"
          >
            <span>{t('العودة للرئيسية', 'Back to Home')}</span>
            <ArrowLeft className={cn('size-4 text-[#D6B57E]', !isRTL && 'rotate-180')} />
          </Link>
        </div>
      </div>
    )
  }

  /* ── نموذج الحجز ─────────────────────────────────────────── */
  return (
    <div className="bg-[#FAF9F5] font-tajawal min-h-screen pb-16 text-[#0F172A] antialiased">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12">

        {/* العنوان */}
        <div className="text-center mb-9">
          <h1 className="font-amiri text-[30px] sm:text-[34px] font-bold leading-tight">
            {t('حجز استشارة قانونية', 'Legal Consultation Booking')}
          </h1>
          <span className="block h-[2px] w-14 bg-[#C5A880] rounded-full mx-auto mt-3.5 mb-4" />
          <p className="text-[13px] text-[#7A8699] font-medium">
            {t('اختر الوقت المناسب واملأ بياناتك، وسيتواصل معك أحد محامينا.', 'Pick a suitable time, fill in your details, and one of our lawyers will contact you.')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* النموذج */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-8 bg-white border border-[#EFE6D8] rounded-2xl p-6 sm:p-8 space-y-6 shadow-[0_1px_3px_rgba(15,23,42,0.03)]"
          >
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700 font-medium flex items-center gap-2.5">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* التخصص · طريقة الانعقاد · التاريخ */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-5">
                <label className={LABEL}>{t('التخصص', 'Practice Area')}</label>
                <div className="relative">
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className={cn(FIELD, 'appearance-none cursor-pointer ps-4 pe-10')}
                  >
                    {DEMO_SERVICES.map((s) => (
                      <option key={s.id} value={s.titleAr}>{s.titleAr}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label className={LABEL}>{t('طريقة الانعقاد', 'Format')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {MEETING_TYPES.map((type) => {
                    const Icon = type.icon
                    const active = selectedType === type.id
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={cn(
                          'h-12 rounded-xl border flex items-center justify-center gap-1.5 transition-colors px-1',
                          active
                            ? 'border-[#C5A880] bg-[#FBF6EC] text-[#0F172A]'
                            : 'border-[#E8DFCF] bg-white text-[#64748B] hover:border-[#C5A880]/60'
                        )}
                      >
                        <Icon className={cn('size-4 shrink-0', active ? 'text-[#B08A45]' : 'text-[#9AA5B4]')} strokeWidth={1.6} />
                        <span className="text-[11.5px] font-bold">{t(type.ar, type.en)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className={LABEL}>{t('التاريخ', 'Date')}</label>
                <div className="relative">
                  <CalendarIcon className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 size-4 text-[#9AA5B4]" strokeWidth={1.6} />
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={cn(FIELD, 'ps-10 pe-3')}
                  />
                </div>
              </div>
            </div>

            {/* الوقت */}
            <div>
              <label className={LABEL}>{t('الوقت', 'Time')}</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const active = selectedTime === slot
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={cn(
                        'h-11 rounded-xl border flex items-center justify-center gap-1.5 text-[11.5px] font-bold tracking-wide transition-colors',
                        active
                          ? 'border-[#0B1E33] bg-[#0B1E33] text-white'
                          : 'border-[#E8DFCF] bg-white text-[#64748B] hover:border-[#C5A880]/60'
                      )}
                    >
                      <span>{slot}</span>
                      {active && <CheckCircle2 className="size-3.5 text-[#D6B57E] shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* بيانات التواصل */}
            <div>
              <label className={LABEL}>{t('بيانات التواصل', 'Contact Details')}</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <User className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 size-4 text-[#9AA5B4]" strokeWidth={1.6} />
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={cn(FIELD, 'ps-10 pe-3')}
                    placeholder={t('الاسم الكامل', 'Full name')}
                  />
                </div>

                <div className="relative">
                  <Phone className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 size-4 text-[#9AA5B4]" strokeWidth={1.6} />
                  <input
                    required
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={cn(FIELD, 'ps-10 pe-3 text-end tracking-wide')}
                    placeholder="05XXXXXXXX"
                  />
                </div>

                <div className="relative">
                  <Mail className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 size-4 text-[#9AA5B4]" strokeWidth={1.6} />
                  <input
                    required
                    type="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(FIELD, 'ps-10 pe-3 text-end')}
                    placeholder="name@domain.com"
                  />
                </div>
              </div>
            </div>

            {/* نبذة */}
            <div>
              <label className={LABEL}>{t('نبذة مختصرة عن موضوع الاستشارة (اختياري)', 'Brief description (optional)')}</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={cn(FIELD, 'h-auto resize-none p-4 leading-relaxed')}
                placeholder={t('اكتب بإيجاز عن موضوع استشارتك...', 'Briefly describe your matter...')}
              />
            </div>

            {/* التأكيد */}
            <div className="pt-1 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="mx-auto flex h-[52px] w-full max-w-[340px] items-center justify-center gap-3 rounded-xl bg-[#0B1E33] text-[15px] font-bold text-white transition-colors hover:bg-[#16294a] disabled:opacity-60"
              >
                <span>{isSubmitting ? t('جارٍ الإرسال...', 'Sending...') : t('تأكيد الحجز', 'Confirm Booking')}</span>
                <ArrowLeft className={cn('size-4 text-[#D6B57E]', !isRTL && 'rotate-180')} />
              </button>

              <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#94A3B8] font-medium">
                <Lock className="size-3 shrink-0" strokeWidth={2} />
                <span>{t('نستخدم بياناتك فقط لحجز الاستشارة والتواصل معك.', 'Your data is used only to arrange the consultation.')}</span>
              </p>
            </div>
          </form>

          {/* ملخص الحجز */}
          <aside className="lg:col-span-4">
            <div className="bg-[#0B1E33] text-white rounded-2xl overflow-hidden lg:sticky lg:top-24">
              <div className="px-6 pt-7 pb-6 flex items-center justify-between gap-3">
                <h2 className="font-amiri text-[19px] font-bold text-white">
                  {t('ملخص الحجز', 'Booking Summary')}
                </h2>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[#C5A880]/40 bg-white/[0.04]">
                  <CalendarIcon className="size-[18px] text-[#D6B57E]" strokeWidth={1.5} />
                </span>
              </div>

              <div className="px-6">
                {[
                  [t('التخصص', 'Practice Area'), selectedService, false],
                  [t('التاريخ', 'Date'), formatArabicDate(selectedDate), false],
                  [t('الوقت', 'Time'), selectedTime, false],
                  [t('طريقة الانعقاد', 'Format'), typeLabel, true],
                  [t('مدة الجلسة', 'Duration'), t('45 دقيقة', '45 minutes'), false],
                ].map(([label, value, gold]) => (
                  <div key={label as string} className="border-t border-white/[0.09] py-4">
                    <span className="block text-[11px] text-slate-400 font-medium mb-1.5">{label as string}</span>
                    <span className={cn('block text-[13.5px] font-bold leading-relaxed', gold ? 'text-[#D6B57E]' : 'text-white')}>
                      {value as string}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mx-6 mb-6 mt-2 flex items-start gap-2 border-t border-white/[0.09] pt-4">
                <Info className="size-3.5 shrink-0 text-slate-500 mt-0.5" strokeWidth={2} />
                <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
                  {t('سيتم تأكيد الحجز بعد إرسال الطلب', 'Your booking is confirmed after review')}
                </p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
