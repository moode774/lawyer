import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Video, Building, Phone, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react'
import { useT } from '../lib/i18n'
import { track } from '../lib/analytics'
import { createAppointment, createLead } from '../lib/store'
import { DEMO_SERVICES } from '../data/demo'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { cn } from '../lib/utils'
import { useSEO, breadcrumbLd } from '../lib/seo'

const TIME_SLOTS = ['09:00 ص', '10:30 ص', '01:00 م', '02:30 م', '04:30 م', '06:00 م', '07:30 م']

const LABEL = 'block text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 mb-2'
const FIELD =
  'h-11 w-full rounded-lg border-[#E5D9C5] bg-white text-[14px] text-[#0F172A] placeholder:text-slate-400 placeholder:font-normal focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 transition-colors font-medium'

const MEETING_TYPES = [
  { id: 'video', icon: Video, ar: 'مرئية', en: 'Video' },
  { id: 'office', icon: Building, ar: 'بالمكتب', en: 'Office' },
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
        ? t('حضورية بالمكتب', 'In office')
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

  /* ── شاشة التأكيد ────────────────────────────────────────── */
  if (isSuccess) {
    return (
      <div className="bg-[#FAF9F5] font-tajawal min-h-[80vh] text-[#0F172A] antialiased flex items-center">
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <CheckCircle2 className="size-9 text-[#C5A880] mx-auto mb-5" strokeWidth={1.25} />

          <h1 className="font-amiri text-[28px] font-bold leading-snug">
            {t('تم استلام طلب الموعد', 'Booking Request Received')}
          </h1>
          <p className="text-[13px] text-[#64748B] font-medium leading-[1.9] mt-3">
            {t(
              'سيراجع الفريق الطلب، ويصبح الحجز مؤكداً بعد إشعاركم.',
              'Our team will review the request; it is confirmed after you are notified.'
            )}
          </p>

          <div className="mt-7 bg-white border border-[#EADFCF] rounded-xl divide-y divide-[#F1E8DA] text-start">
            {[
              [t('الرقم المرجعي', 'Reference'), bookingRef],
              [t('التخصص', 'Practice Area'), selectedService],
              [t('الموعد', 'Date & Time'), `${selectedDate} — ${selectedTime}`],
              [t('طريقة الانعقاد', 'Format'), typeLabel],
            ].map(([k, v]) => (
              <div key={k} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 shrink-0">{k}</span>
                <span className="text-[13px] font-semibold text-end">{v}</span>
              </div>
            ))}
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-7 h-11 px-7 rounded-lg bg-[#0B132B] hover:bg-[#16203f] text-white text-[13px] font-bold transition-colors"
          >
            <span>{t('العودة للرئيسية', 'Back to Home')}</span>
            <ArrowLeft className={cn('size-3.5 text-[#D6B57E]', !isRTL && 'rotate-180')} />
          </Link>
        </div>
      </div>
    )
  }

  /* ── نموذج الحجز — مضغوط في شاشة واحدة ──────────────────── */
  return (
    <div className="bg-[#FAF9F5] font-tajawal min-h-screen pb-16 text-[#0F172A] antialiased">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* عنوان الصفحة — سطر واحد، بلا ترويسة عملاقة */}
        <div className="flex flex-wrap items-end justify-between gap-4 pt-10 pb-6 border-b border-[#EADFCF]">
          <div>
            <span className="text-[10px] font-bold text-[#C5A880] tracking-[0.22em] uppercase block mb-2">
              {t('طلب موعد', 'Book an Appointment')}
            </span>
            <h1 className="font-amiri text-[26px] sm:text-[30px] font-bold leading-tight">
              {t('حجز استشارة قانونية', 'Legal Consultation Booking')}
            </h1>
          </div>

          <Link
            to="/services"
            className="group inline-flex items-center gap-2 text-[11.5px] font-bold text-[#64748B] hover:text-[#9A7B3E] transition-colors pb-1"
          >
            <ArrowLeft className={cn('size-3.5 text-[#C5A880] transition-transform', isRTL ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1')} />
            <span>{t('التخصصات', 'Practice Areas')}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-7">

          {/* النموذج */}
          <form onSubmit={handleSubmit} className="lg:col-span-8 bg-white border border-[#EADFCF] rounded-xl p-6 sm:p-7 space-y-6">

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-[13px] text-rose-700 font-medium flex items-center gap-2.5">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* طريقة الانعقاد + التخصص */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <span className={LABEL}>{t('طريقة الانعقاد', 'Format')}</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {MEETING_TYPES.map((type) => {
                    const Icon = type.icon
                    const active = selectedType === type.id
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={cn(
                          'h-11 rounded-lg border flex items-center justify-center gap-1.5 transition-colors',
                          active
                            ? 'border-[#C5A880] bg-[#FAF5EB] text-[#0F172A]'
                            : 'border-[#EADFCF] bg-white text-slate-500 hover:border-[#C5A880]/60'
                        )}
                      >
                        <Icon className={cn('size-4 shrink-0', active ? 'text-[#9A7B3E]' : 'text-[#C5A880]')} strokeWidth={1.5} />
                        <span className="text-[11.5px] font-bold">{t(type.ar, type.en)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <span className={LABEL}>{t('التخصص', 'Practice Area')}</span>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className={cn(FIELD, 'px-3 cursor-pointer')}
                >
                  {DEMO_SERVICES.map((s) => (
                    <option key={s.id} value={s.titleAr}>{s.titleAr}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* التاريخ + الأوقات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <span className={LABEL}>{t('التاريخ', 'Date')}</span>
                <Input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className={FIELD}
                />
              </div>

              <div>
                <span className={LABEL}>{t('الوقت', 'Time')}</span>
                <div className="flex flex-wrap gap-1.5">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={cn(
                        'rounded-lg border px-2.5 py-2 text-[11px] font-bold tracking-wide transition-colors',
                        selectedTime === slot
                          ? 'border-[#C5A880] bg-[#0B132B] text-[#D6B57E]'
                          : 'border-[#EADFCF] bg-white text-slate-500 hover:border-[#C5A880]/60'
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* بيانات التواصل */}
            <div className="pt-5 border-t border-[#F1E8DA]">
              <span className={LABEL}>{t('بيانات التواصل', 'Contact Details')}</span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input required value={name} onChange={(e) => setName(e.target.value)} className={FIELD} placeholder={t('الاسم الكامل', 'Full name')} />
                <Input required dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className={cn(FIELD, 'tracking-wide')} placeholder="05XXXXXXXX" />
                <Input required type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className={FIELD} placeholder="name@domain.com" />
              </div>

              <Textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={cn(FIELD, 'h-auto resize-none p-3 mt-3 leading-relaxed')}
                placeholder={t('نبذة مختصرة عن الموضوع (اختياري)', 'Brief description (optional)')}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-11 px-7 bg-[#0B132B] hover:bg-[#16203f] disabled:opacity-60 text-white font-bold rounded-lg text-[14px] transition-colors inline-flex items-center justify-center gap-2.5 shrink-0"
              >
                <span>{isSubmitting ? t('جارٍ الإرسال...', 'Sending...') : t('تأكيد الحجز', 'Confirm Booking')}</span>
                <ArrowLeft className={cn('size-3.5 text-[#D6B57E]', !isRTL && 'rotate-180')} />
              </button>

              <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed">
                {t(
                  'يُؤكَّد الحجز بعد المراجعة. البيانات تخضع للسرية المهنية.',
                  'Confirmed after review. All data is professionally confidential.'
                )}
              </p>
            </div>
          </form>

          {/* ملخص الموعد */}
          <aside className="lg:col-span-4">
            <div className="bg-[#0B132B] text-white rounded-xl border border-white/10 overflow-hidden lg:sticky lg:top-24">
              <div className="px-5 py-4 border-b border-white/10">
                <span className="text-[10px] font-bold text-[#C5A880] tracking-[0.2em] uppercase">
                  {t('ملخص الموعد', 'Summary')}
                </span>
              </div>

              <div className="divide-y divide-white/[0.07]">
                {[
                  [t('التخصص', 'Area'), selectedService],
                  [t('التاريخ', 'Date'), selectedDate],
                  [t('الوقت', 'Time'), selectedTime],
                  [t('الانعقاد', 'Format'), typeLabel],
                ].map(([k, v], i) => (
                  <div key={k} className="px-5 py-3.5 flex items-start justify-between gap-3">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400 font-semibold shrink-0 pt-0.5">{k}</span>
                    <span className={cn('text-[12.5px] font-semibold text-end leading-relaxed', i === 3 ? 'text-[#D6B57E]' : 'text-white')}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>

              <div className="px-5 py-3.5 bg-white/[0.03] border-t border-white/10">
                <p className="text-[10.5px] leading-relaxed text-slate-400 font-medium">
                  {t('مدة الجلسة 45 دقيقة — يُفضّل تجهيز المستندات.', 'Sessions run 45 minutes — please prepare documents.')}
                </p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  )
}
