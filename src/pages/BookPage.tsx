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
  Lock,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react'
import { useT } from '../lib/i18n'
import { track } from '../lib/analytics'
import { createAppointment, createLead } from '../lib/store'
import { DEMO_SERVICES } from '../data/demo'
import { cn } from '../lib/utils'
import { useSEO, breadcrumbLd } from '../lib/seo'

const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
]

const DAYS_AR = ['أحد', 'اتنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']

const MORNING_SLOTS = ['09:00 ص', '10:30 ص', '11:30 ص']
const EVENING_SLOTS = ['02:30 م', '04:30 م', '06:30 م', '07:30 م']

const MEETING_TYPES = [
  { id: 'video', icon: Video, ar: 'مرئية', en: 'Video' },
  { id: 'office', icon: Building2, ar: 'بالمكتب', en: 'Office' },
  { id: 'phone', icon: Phone, ar: 'هاتفية', en: 'Phone' },
] as const

function formatArabicDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return `${String(d).padStart(2, '0')} ${MONTHS_AR[m - 1]} ${y}`
}

export default function BookPage() {
  const { t, isRTL } = useT()
  const [searchParams] = useSearchParams()
  const initialServiceId = searchParams.get('service')

  useSEO({
    title: 'حجز الاستشارات القانونية | مكتب المحامي ابن نوح',
    description: 'اختر اليوم والوقت المناسب من الأجندة لحجز الاستشارة القانونية.',
    path: '/book',
    jsonLd: breadcrumbLd([
      { name: 'الرئيسية', path: '/' },
      { name: 'حجز استشارة', path: '/book' },
    ]),
  })

  // State
  const [selectedType, setSelectedType] = useState<'video' | 'office' | 'phone'>('phone')
  const [selectedService, setSelectedService] = useState<string>(
    DEMO_SERVICES.find((s) => s.id === initialServiceId)?.titleAr || 'النزاعات التجارية والتفاضي'
  )
  
  // Date picker state (Default: 7th August 2026 as in mockup)
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(7) // August (0-indexed: 7)
  const [currentYear, setCurrentYear] = useState(2026)
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-07')
  const [selectedTime, setSelectedTime] = useState<string>('11:30 ص')

  // Form state
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')

  const [isSuccess, setIsSuccess] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const typeLabel =
    selectedType === 'video'
      ? t('مرئية (فيديو)', 'Video')
      : selectedType === 'office'
        ? t('حضورياً بالمكتب', 'In Office')
        : t('استشارة هاتفية', 'Phone')

  // Days in month calculation
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDateClick = (dayNum: number) => {
    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
    setSelectedDate(formattedDate)
  }

  const handleSlotSelect = (timeSlot: string) => {
    setSelectedTime(timeSlot)
    setShowConfirmModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError(t('يرجى تعبئة جميع الحقول المطلوبة لربط الموعد', 'Please complete required fields'))
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
      setShowConfirmModal(false)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'تعذر حفظ الحجز، يرجى المحاولة مرة أخرى')
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ── شاشة التأكيد والنجاح ────────────────────────────────────────── */
  if (isSuccess) {
    return (
      <div className="bg-[#FAF9F5] font-tajawal min-h-[85vh] text-[#0F172A] antialiased flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#0B1E33] via-[#C5A880] to-[#0B1E33]" />
          
          <div className="size-14 bg-[#FDFBF7] border border-[#C5A880] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
            <CheckCircle2 className="size-8 text-[#B08A45]" strokeWidth={1.75} />
          </div>

          <h1 className="font-amiri text-[24px] font-bold leading-tight text-[#0F172A]">
            {t('تم حجز الموعد بنجاح', 'Appointment Confirmed')}
          </h1>
          <p className="text-[12px] text-slate-500 font-medium mt-1">
            {t('تم إصدار رقم الحجز المرجعي وإرسال التنبيه إلى المحامي.', 'Reference number generated and alert sent.')}
          </p>

          <div className="mt-5 bg-[#FAF8F5] border border-[#EFE6D8] rounded-2xl p-4 divide-y divide-[#EFE6D8] text-start text-[11.5px]">
            <div className="pb-2 flex items-center justify-between">
              <span className="text-slate-400 font-semibold">{t('الرقم المرجعي', 'Reference')}</span>
              <span className="font-mono font-bold text-[#0B1E33] bg-white px-2.5 py-0.5 rounded-md border border-[#E8DFCF]">{bookingRef}</span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-400 font-semibold">{t('التخصص', 'Practice Area')}</span>
              <span className="font-bold text-[#0F172A]">{selectedService}</span>
            </div>
            <div className="py-2 flex items-center justify-between">
              <span className="text-slate-400 font-semibold">{t('الموعد', 'Date & Time')}</span>
              <span className="font-bold text-[#B08A45]">{formatArabicDate(selectedDate)} — {selectedTime}</span>
            </div>
          </div>

          <Link
            to="/"
            className="mt-5 inline-flex items-center justify-center gap-2 h-11 w-full rounded-2xl bg-[#0B1E33] hover:bg-[#16294a] text-white text-[13px] font-bold transition-all shadow-md"
          >
            <span>{t('العودة للصفحة الرئيسية', 'Back to Home')}</span>
            <ArrowLeft className={cn('size-4 text-[#D6B57E]', !isRTL && 'rotate-180')} />
          </Link>
        </div>
      </div>
    )
  }

  // Days matrix for current month
  const totalDays = getDaysInMonth(currentYear, currentMonth)
  const startDay = getFirstDayOfMonth(currentYear, currentMonth)
  const dayCells = []
  for (let i = 0; i < startDay; i++) {
    dayCells.push(null)
  }
  for (let d = 1; d <= totalDays; d++) {
    dayCells.push(d)
  }

  const selectedDayNumber = Number(selectedDate.split('-')[2])

  return (
    <div className="bg-[#FAF9F5] font-tajawal min-h-screen pb-16 text-[#0F172A] antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">

        {/* 1. Header Banner Card (Matching Mockup 100%) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-13 rounded-2xl bg-[#0B1E33] text-white flex items-center justify-center shrink-0 shadow-sm">
              <CalendarIcon className="size-6 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="font-amiri text-[24px] sm:text-[26px] font-bold text-[#0F172A] leading-tight">
                {t('حجز الاستشارات القانونية', 'Legal Consultation Booking')}
              </h1>
              <p className="text-[12.5px] text-slate-400 font-medium mt-0.5">
                {t('اختر اليوم والوقت المناسب من الجدولة أدناه لحجز الاستشارة', 'Select suitable date and time from agenda below')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[12px] font-bold text-[#8C6D3F] bg-[#FDFBF7] px-4 py-2.5 rounded-full border border-[#E5D7C2] shrink-0 self-start sm:self-auto shadow-2xs">
            <ShieldCheck className="size-4 text-[#B08A45]" />
            <span>{t('مكتب مرخص - ترخيص 4210', 'MOJ License 4210')}</span>
          </div>
        </div>

        {/* 2. Main 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* RIGHT COLUMN in RTL (lg:col-span-8): Main Selection Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">

              {/* Row 1: Filters (طريقة الانعقاد & التخصص المطلوب) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                
                {/* طريقة الانعقاد (Pill selector on left in RTL) */}
                <div className="space-y-1.5">
                  <label className="block text-[12px] font-bold text-slate-800 text-center sm:text-start">
                    {t('طريقة الانعقاد', 'Format')}
                  </label>
                  <div className="flex items-center gap-2">
                    {MEETING_TYPES.map((type) => {
                      const Icon = type.icon
                      const active = selectedType === type.id
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedType(type.id)}
                          className={cn(
                            'h-10 px-4 rounded-full border flex items-center justify-center gap-2 transition-all text-[12px] font-bold',
                            active
                              ? 'border-[#0B1E33] bg-[#0B1E33] text-white shadow-xs'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          )}
                        >
                          <Icon className={cn('size-3.5', active ? 'text-[#D6B57E]' : 'text-slate-400')} strokeWidth={1.8} />
                          <span>{t(type.ar, type.en)}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* التخصص القانوني المطلوب (Dropdown on right in RTL) */}
                <div className="space-y-1.5 sm:w-64">
                  <label className="block text-[12px] font-bold text-slate-800">
                    {t('التخصص القانوني المطلوب', 'Practice Area')}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="h-10 w-full rounded-2xl border border-slate-200 bg-white text-[12.5px] text-[#0F172A] font-bold ps-4 pe-9 appearance-none focus:outline-none focus:border-[#C5A880] shadow-2xs cursor-pointer"
                    >
                      {DEMO_SERVICES.map((s) => (
                        <option key={s.id} value={s.titleAr}>{s.titleAr}</option>
                      ))}
                      <option value="النزاعات التجارية والتفاضي">النزاعات التجارية والتفاضي</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  </div>
                </div>

              </div>

              {/* Row 2: Selected Date & Status Pill Banner */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">{t('اليوم والتاريخ', 'Date & Day')}</span>
                  <h2 className="text-[15px] font-bold text-[#0F172A] flex items-center gap-2 mt-0.5">
                    <span>{formatArabicDate(selectedDate)}</span>
                    <CalendarIcon className="size-4 text-slate-400" />
                  </h2>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-bold">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{t('متاح في هذا اليوم', 'Available Today')}</span>
                </div>
              </div>

              {/* Row 3: ☀️ Morning Sessions (الفترة الصباحية) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-[13px] font-bold text-slate-800">
                  <Sun className="size-4 text-[#B08A45]" />
                  <span>{t('الفترة الصباحية', 'Morning Sessions')}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {MORNING_SLOTS.map((slot) => {
                    const isSelected = selectedTime === slot
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleSlotSelect(slot)}
                        className={cn(
                          'p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 shadow-2xs',
                          isSelected
                            ? 'border-[#0B1E33] bg-[#0B1E33] text-white shadow-md'
                            : 'border-slate-200 bg-white hover:border-[#C5A880] hover:bg-[#FDFBF7]'
                        )}
                      >
                        <span className={cn('text-[15px] font-bold font-mono', isSelected ? 'text-white' : 'text-[#0F172A]')}>
                          {slot}
                        </span>
                        <span className={cn('text-[11px] font-medium', isSelected ? 'text-slate-300' : 'text-slate-400')}>
                          {t('احجز هذا الموعد', 'Book this slot')}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Row 4: 🌙 Evening Sessions (الفترة المسائية) */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-[13px] font-bold text-slate-800">
                  <Moon className="size-4 text-[#B08A45]" />
                  <span>{t('الفترة المسائية', 'Evening Sessions')}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {EVENING_SLOTS.map((slot) => {
                    const isSelected = selectedTime === slot
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleSlotSelect(slot)}
                        className={cn(
                          'p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 shadow-2xs',
                          isSelected
                            ? 'border-[#0B1E33] bg-[#0B1E33] text-white shadow-md'
                            : 'border-slate-200 bg-white hover:border-[#C5A880] hover:bg-[#FDFBF7]'
                        )}
                      >
                        <span className={cn('text-[15px] font-bold font-mono', isSelected ? 'text-white' : 'text-[#0F172A]')}>
                          {slot}
                        </span>
                        <span className={cn('text-[11px] font-medium', isSelected ? 'text-slate-300' : 'text-slate-400')}>
                          {t('احجز هذا الموعد', 'Book this slot')}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* LEFT COLUMN in RTL (lg:col-span-4): Month Calendar Card */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
              
              {/* Month Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[16px] text-[#0F172A] flex items-center gap-2">
                  <CalendarIcon className="size-4 text-[#B08A45]" />
                  <span>{MONTHS_AR[currentMonth]} {currentYear}</span>
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="size-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <ChevronRight className={cn('size-4', !isRTL && 'rotate-180')} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="size-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <ChevronLeft className={cn('size-4', !isRTL && 'rotate-180')} />
                  </button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 text-center text-[12px] font-bold text-slate-400">
                {DAYS_AR.map((day) => (
                  <span key={day} className="py-1">{day}</span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-2 pt-1">
                {dayCells.map((dayNum, idx) => {
                  if (!dayNum) {
                    return <div key={`empty-${idx}`} className="size-10" />
                  }

                  const isSelected =
                    dayNum === selectedDayNumber &&
                    currentMonth === Number(selectedDate.split('-')[1]) - 1 &&
                    currentYear === Number(selectedDate.split('-')[0])

                  const isHighlighted = dayNum === 13

                  return (
                    <button
                      key={`day-${dayNum}`}
                      type="button"
                      onClick={() => handleDateClick(dayNum)}
                      className={cn(
                        'size-10 rounded-full text-[13px] font-bold transition-all flex items-center justify-center mx-auto',
                        isSelected
                          ? 'bg-[#0B1E33] text-white shadow-md'
                          : isHighlighted
                            ? 'border-2 border-[#C5A880] bg-white text-[#0F172A] hover:bg-[#FDFBF7]'
                            : 'bg-slate-50/90 text-slate-700 hover:bg-[#FDFBF7] hover:text-[#B08A45]'
                      )}
                    >
                      {dayNum}
                    </button>
                  )
                })}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Floating Confirmation Booking Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="text-[11px] font-bold text-[#B08A45] block">{t('تأكيد الحجز المباشر', 'Instant Confirmation')}</span>
                <h3 className="text-[18px] font-bold text-[#0F172A] font-amiri">
                  {t('إدخال بيانات التواصل', 'Enter Contact Information')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="size-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-[12px] font-bold"
              >
                ✕
              </button>
            </div>

            {/* Selected Summary Pill */}
            <div className="bg-[#FAF8F5] border border-[#EFE6D8] rounded-2xl p-3 mb-4 flex items-center justify-between text-[12px]">
              <div>
                <span className="text-slate-400 font-semibold block">{t('الموعد المختار', 'Selected Slot')}</span>
                <span className="font-bold text-[#0B1E33]">{formatArabicDate(selectedDate)} — {selectedTime}</span>
              </div>
              <span className="bg-[#0B1E33] text-[#D6B57E] text-[11px] font-bold px-3 py-1 rounded-full">
                {typeLabel}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-[12px] text-rose-700 font-medium flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-[11.5px] font-bold text-slate-700 mb-1">{t('الاسم الكامل', 'Full Name')}</label>
                <div className="relative">
                  <User className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 w-full rounded-2xl border border-slate-300 bg-white ps-9 pe-3 text-[12.5px] text-slate-900 font-medium focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20"
                    placeholder={t('اكتب اسمك الثلاثي', 'Enter full name')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11.5px] font-bold text-slate-700 mb-1">{t('رقم الجوال', 'Phone')}</label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-10 w-full rounded-2xl border border-slate-300 bg-white ps-9 pe-3 text-[12.5px] text-slate-900 font-mono focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20"
                      placeholder="05XXXXXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-slate-700 mb-1">{t('البريد الإلكتروني', 'Email')}</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 w-full rounded-2xl border border-slate-300 bg-white ps-9 pe-3 text-[12.5px] text-slate-900 font-medium focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20"
                      placeholder="name@domain.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11.5px] font-bold text-slate-700 mb-1">{t('نبذة مختصرة (اختياري)', 'Notes (optional)')}</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white p-3 text-[12px] text-slate-900 leading-relaxed focus:outline-none focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20 resize-none"
                  placeholder={t('اكتب بإيجاز تفاصيل موضوعك لمساعدة المحامي...', 'Brief notes...')}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-2xl bg-[#0B1E33] text-white text-[13.5px] font-bold flex items-center justify-center gap-2 hover:bg-[#16294a] transition-all shadow-md disabled:opacity-60"
                >
                  <span>{isSubmitting ? t('جارٍ التأكيد والحفظ...', 'Confirming...') : t('تأكيد وحجز الموعد الآن', 'Confirm Booking')}</span>
                  <ArrowLeft className={cn('size-4 text-[#D6B57E]', !isRTL && 'rotate-180')} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
