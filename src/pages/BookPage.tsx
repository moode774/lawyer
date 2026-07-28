import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Calendar as CalendarIcon,
  Video,
  Building,
  Phone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { useT } from '../lib/i18n'
import { track } from '../lib/analytics'
import { store } from '../lib/store'
import { DEMO_SERVICES } from '../data/demo'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { cn } from '../lib/utils'
import { useSEO } from '../lib/seo'

const TIME_SLOTS = [
  '09:00 ص',
  '10:30 ص',
  '01:00 م',
  '02:30 م',
  '04:30 م',
  '06:00 م',
  '07:30 م'
]

export default function BookPage() {
  const { t, isRTL } = useT()
  const [searchParams] = useSearchParams()
  const initialServiceId = searchParams.get('service')
  useSEO({ title: 'حجز استشارة قانونية | ' + t('مكتب المحاماة', 'Law Firm') })

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError(t('يرجى تعبئة كافة الحقول المطلوب التواصل بها', 'Please complete all required fields'))
      return
    }

    track('booking_completed', { selectedType, selectedService, selectedDate, selectedTime })

    const appt = store.addAppointment({
      name,
      type: selectedType,
      date: selectedDate,
      time: selectedTime,
      duration: '45 دقيقة',
      status: 'confirmed',
      location: selectedType === 'video' ? 'رابط زوم المباشر (سيصلك واتساب)' : selectedType === 'office' ? 'مقر المكتب - الرياض' : 'اتصال هاتفي مباشر'
    })

    // Also register lead
    store.addLead({
      name,
      phone,
      email,
      type: 'individual',
      category: selectedService,
      source: 'حجز موعد مباشر',
      status: 'consultation_booked',
      consultationType: selectedType,
      preferredDate: selectedDate,
      notes: `حجز موعد استشارة: ${selectedService} | الوقت: ${selectedTime} | طريقة الانعقاد: ${selectedType}`
    })

    setBookingRef(appt.ref)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 font-tajawal min-h-[80vh] flex items-center">
        <Card className="p-8 sm:p-12 text-center space-y-6 bg-white shadow-xl border border-[#C4D8E5] rounded-3xl w-full">
          <div className="size-20 bg-[#E8ECEF] text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-300">
            <CheckCircle2 className="size-10 text-emerald-600" />
          </div>

          <div className="space-y-3">
            <Badge className="font-reem bg-[#8EB1D1] text-[#1C2B48] text-sm px-4 py-1.5 font-bold border-none shadow-sm">
              {t('تم تأكيد حجز الموعد بنجاح', 'Consultation Booking Confirmed')}
            </Badge>
            <h1 className="font-amiri text-3xl font-bold text-[#1C2B48]">
              {t('رقم الحجز:', 'Booking Reference:')} <span className="font-mono text-[#8EB1D1]">{bookingRef}</span>
            </h1>
            <p className="text-[#527094] text-base max-w-lg mx-auto leading-relaxed">
              {t(
                'تم تثبيت موعد استشارتك بنجاح. أرسلنا تفاصيل الانعقاد ورابط التذكير إلى رقم جوالك وبريدك الإلكتروني.',
                'Your appointment is set. Confirmation details have been sent via WhatsApp and email.'
              )}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#E8ECEF]/70 border border-[#C4D8E5] text-start space-y-3 max-w-md mx-auto text-sm font-tajawal">
            <div className="flex justify-between">
              <span className="text-[#527094]">{t('المحامي الخبير:', 'Lawyer:')}</span>
              <span className="font-bold text-[#1C2B48]">أ. أحمد المحامي</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#527094]">{t('التاريخ والوقت:', 'Date & Time:')}</span>
              <span className="font-bold text-[#1C2B48]">{selectedDate} ({selectedTime})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#527094]">{t('نوع الانعقاد:', 'Meeting Type:')}</span>
              <span className="font-bold text-[#1C2B48]">
                {selectedType === 'video' ? t('مرئي عبر الفيديو (Zoom)', 'Video Call') : selectedType === 'office' ? t('حضوري بالمكتب', 'Office Meeting') : t('مكالمة هاتفية', 'Phone Call')}
              </span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-center gap-4">
            <Link to="/" className="w-full sm:w-auto">
              <Button size="lg" variant="accent" className="w-full font-bold px-8 rounded-2xl">
                {t('العودة للرئيسية', 'Return to Home')}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 font-tajawal min-h-[85vh]">
      {/* Title */}
      <div className="text-center space-y-4 mb-12">
        <Badge className="font-reem bg-[#8EB1D1] text-[#1C2B48] font-bold text-xs px-4 py-1.5 border-none shadow-sm">
          <CalendarIcon className="size-3.5 me-1.5 inline text-[#1C2B48]" />
          {t('حجز مباشر ومؤكد', 'Direct Instant Booking')}
        </Badge>
        <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-[#1C2B48] leading-tight">
          {t('احجز جلسة استشارة قانونية مباشرة', 'Book Your Legal Consultation')}
        </h1>
        <p className="text-[#527094] text-base max-w-xl mx-auto leading-relaxed">
          {t('اختر الموعد وطريقة الانعقاد المناسبة لك لتأكيد الاستشارة مع المحامي مباشرة.', 'Select your preferred date, time slot, and meeting format.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left/Main Form */}
        <div className="lg:col-span-8">
          <Card className="p-6 sm:p-10 space-y-8 bg-white shadow-lg border border-[#C4D8E5] rounded-3xl">
            <form onSubmit={handleSubmit} className="space-y-8 font-tajawal">
              
              {error && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
                  <AlertCircle className="size-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Meeting Type */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1C2B48] block">1. {t('اختر طريقة الانعقاد', 'Select Meeting Format')}</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedType('video')}
                    className={cn(
                      'p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer font-bold',
                      selectedType === 'video' ? 'border-[#1C2B48] bg-[#1C2B48] text-white shadow-md' : 'border-[#C4D8E5] text-[#527094] hover:bg-[#E8ECEF]'
                    )}
                  >
                    <Video className="size-6" />
                    <span className="text-xs sm:text-sm">{t('مرئية (عن بعد)', 'Video')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedType('office')}
                    className={cn(
                      'p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer font-bold',
                      selectedType === 'office' ? 'border-[#1C2B48] bg-[#1C2B48] text-white shadow-md' : 'border-[#C4D8E5] text-[#527094] hover:bg-[#E8ECEF]'
                    )}
                  >
                    <Building className="size-6" />
                    <span className="text-xs sm:text-sm">{t('حضورية بالمكتب', 'In Office')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedType('phone')}
                    className={cn(
                      'p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 cursor-pointer font-bold',
                      selectedType === 'phone' ? 'border-[#1C2B48] bg-[#1C2B48] text-white shadow-md' : 'border-[#C4D8E5] text-[#527094] hover:bg-[#E8ECEF]'
                    )}
                  >
                    <Phone className="size-6" />
                    <span className="text-xs sm:text-sm">{t('هاتفية', 'Phone')}</span>
                  </button>
                </div>
              </div>

              {/* 2. Service Category */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1C2B48] block">2. {t('اختر التخصص / الخدمة', 'Select Legal Service')}</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full rounded-2xl border border-[#C4D8E5] bg-[#E8ECEF]/50 px-4 py-3.5 text-sm text-[#1C2B48] font-bold focus:outline-none focus:ring-2 focus:ring-[#8EB1D1]"
                >
                  {DEMO_SERVICES.map((s) => (
                    <option key={s.id} value={s.titleAr}>{s.titleAr}</option>
                  ))}
                </select>
              </div>

              {/* 3. Date & Time Selection */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-[#1C2B48] block">3. {t('حدد التاريخ والوقت المتاح', 'Choose Available Date & Time')}</label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#527094]">{t('تاريخ الموعد', 'Date')}</span>
                    <Input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="border-[#C4D8E5] rounded-xl font-bold text-[#1C2B48]"
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#527094]">{t('الأوقات المتاحة', 'Available Slots')}</span>
                    <div className="flex flex-wrap gap-2">
                      {TIME_SLOTS.map((tSlot) => (
                        <button
                          type="button"
                          key={tSlot}
                          onClick={() => setSelectedTime(tSlot)}
                          className={cn(
                            'px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer font-mono',
                            selectedTime === tSlot ? 'border-[#8EB1D1] bg-[#1C2B48] text-white shadow-sm' : 'border-[#C4D8E5] bg-white text-[#527094] hover:bg-[#E8ECEF]'
                          )}
                        >
                          {tSlot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Client Info */}
              <div className="space-y-4 pt-4 border-t border-[#C4D8E5]/70">
                <label className="text-sm font-bold text-[#1C2B48] block">4. {t('بياناتك للتواصل وتأكيد الحجز', 'Contact Details')}</label>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#1C2B48]">{t('الاسم الكامل', 'Full Name')}</span>
                    <Input required value={name} onChange={(e) => setName(e.target.value)} className="border-[#C4D8E5] rounded-xl" placeholder={t('أدخل اسمك', 'Your Name')} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#1C2B48]">{t('رقم الجوال', 'Mobile')}</span>
                      <Input required dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className="border-[#C4D8E5] rounded-xl font-mono" placeholder="05XXXXXXXX" />
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#1C2B48]">{t('البريد الإلكتروني', 'Email')}</span>
                      <Input required type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} className="border-[#C4D8E5] rounded-xl font-mono" placeholder="name@example.com" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#1C2B48]">{t('نبذة مختثرة عن موضوع الاستشارة (اختياري)', 'Notes')}</span>
                    <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="border-[#C4D8E5] rounded-xl" placeholder={t('اكتب تفاصيل الاستشارة ليطلع عليها المحامي قبل الموعد...', 'Brief details...')} />
                  </div>
                </div>
              </div>

              <Button type="submit" variant="accent" size="lg" className="w-full font-bold shadow-lg rounded-2xl py-4 text-base">
                {t('تأكيد الحجز الآن', 'Confirm Booking Now')}
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Sidebar Summary */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 bg-[#1C2B48] text-white space-y-6 rounded-3xl shadow-xl border border-[#8EB1D1]/30">
            <h3 className="font-amiri font-bold text-xl border-b border-[#8EB1D1]/30 pb-3">{t('ملخص الموعد', 'Booking Summary')}</h3>

            <div className="space-y-4 text-sm font-tajawal">
              <div>
                <span className="text-xs text-[#8EB1D1] block">{t('التخصص المختارات:', 'Selected Service:')}</span>
                <span className="font-bold text-white text-base">{selectedService}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#8EB1D1]/20">
                <div>
                  <span className="text-xs text-[#8EB1D1] block">{t('التاريخ:', 'Date:')}</span>
                  <span className="font-bold text-white font-mono">{selectedDate}</span>
                </div>
                <div>
                  <span className="text-xs text-[#8EB1D1] block">{t('الوقت:', 'Time:')}</span>
                  <span className="font-bold text-white font-mono">{selectedTime}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#8EB1D1]/20">
                <span className="text-xs text-[#8EB1D1] block">{t('طريقة الانعقاد:', 'Format:')}</span>
                <span className="font-bold text-[#A7C7E7]">
                  {selectedType === 'video' ? t('مرئية عبر الفيديو (Zoom)', 'Video Call') : selectedType === 'office' ? t('حضورية بالمكتب - الرياض', 'In Office') : t('مكالمة هاتفية', 'Phone Call')}
                </span>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}
