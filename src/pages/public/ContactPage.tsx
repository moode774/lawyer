import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, MessageSquare, CheckCircle2, Scale, Shield, Clock, ArrowLeft } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { BRAND } from '../../config/brand'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { cn } from '../../lib/utils'
import { useSEO, breadcrumbLd, SITE_URL } from '../../lib/seo'
import { track } from '../../lib/analytics'
import { createContactRequest } from '../../lib/store'

const LABEL = 'block text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500'
const FIELD =
  'h-12 w-full rounded-lg border-[#E5D9C5] bg-white text-[15px] text-[#0F172A] placeholder:text-slate-400 placeholder:font-normal focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/30 transition-colors font-medium'

export default function ContactPage() {
  const { t, isRTL } = useT()
  useSEO({
    title: 'تواصل معنا | ' + BRAND.nameAr,
    description: `قنوات التواصل الرسمية مع ${BRAND.nameAr} بالرياض — الهاتف، الواتساب، البريد، والمقر الرئيسي وأوقات العمل.`,
    path: '/contact',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'تواصل معنا',
        mainEntity: { '@id': `${SITE_URL}/#legalservice` },
      },
      breadcrumbLd([
        { name: 'الرئيسية', path: '/' },
        { name: 'تواصل معنا', path: '/contact' },
      ]),
    ],
  })

  const [sent, setSent] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    setError('')
    try {
      await createContactRequest({ name, phone, email, message })
      track('contact_submitted')
      setSent(true)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'تعذر إرسال الرسالة، يرجى المحاولة مرة أخرى')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#FAF9F5] font-tajawal min-h-screen pb-24 text-[#0F172A] antialiased">
      {/* LUXURY HERO HEADER */}
      <section className="relative pt-20 pb-24 bg-[#0B132B] text-white border-b border-[#C5A880]/30 overflow-hidden mb-16">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C5A880 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] text-xs font-bold">
            <Shield className="size-4 text-[#C5A880]" />
            <span>{t('قنوات التواصل المباشرة', 'Direct Channels')}</span>
          </div>

          <h1 className="font-amiri text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {t('تواصل معنا', 'Contact Us')}
          </h1>

          {/* Scale Ornament */}
          <div className="flex items-center justify-center gap-4 py-1">
            <div className="h-[1px] w-16 bg-[#C5A880]/60" />
            <Scale className="size-5 text-[#C5A880]" strokeWidth={1.5} />
            <div className="h-[1px] w-16 bg-[#C5A880]/60" />
          </div>

          <p className="font-tajawal text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            {t('يسعدنا استقبال استفساراتكم وحجوزاتكم عبر القنوات الرسمية بجميع الأوقات', 'We are happy to answer your inquiries')}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* RIGHT (RTL START) -> Official Contact Details */}
        <div className="lg:col-span-5">
          <Card className="bg-[#0B132B] text-white rounded-2xl border border-white/10 overflow-hidden shadow-none p-0">

            <div className="px-8 pt-8 pb-6 border-b border-white/10">
              <span className="text-[10px] font-bold text-[#C5A880] tracking-[0.22em] uppercase block mb-2">
                {t('بيانات المكتب الرسمية', 'Official Details')}
              </span>
              <h3 className="font-amiri font-bold text-2xl text-white leading-snug">
                {t('معلومات التواصل والمقر', 'Contact & Office')}
              </h3>
            </div>

            <div className="font-tajawal">
              {/* Phone */}
              <a
                href={`tel:${BRAND.phone}`}
                className="group flex items-start gap-4 px-8 py-5 border-b border-white/[0.07] transition-colors hover:bg-white/[0.03]"
              >
                <Phone className="size-4 text-[#C5A880] shrink-0 mt-1" strokeWidth={1.5} />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-semibold block mb-1">
                    {t('الهاتف المباشر', 'Phone')}
                  </span>
                  <span dir="ltr" className="block text-white text-[15px] font-semibold tracking-wide group-hover:text-[#D6B57E] transition-colors">
                    {BRAND.phoneDisplay}
                  </span>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${BRAND.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-4 px-8 py-5 border-b border-white/[0.07] transition-colors hover:bg-white/[0.03]"
              >
                <MessageSquare className="size-4 text-[#C5A880] shrink-0 mt-1" strokeWidth={1.5} />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-semibold block mb-1">
                    {t('واتساب', 'WhatsApp')}
                  </span>
                  <span dir="ltr" className="block text-white text-[15px] font-semibold tracking-wide group-hover:text-[#D6B57E] transition-colors">
                    {BRAND.phoneDisplay}
                  </span>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${BRAND.email}`}
                className="group flex items-start gap-4 px-8 py-5 border-b border-white/[0.07] transition-colors hover:bg-white/[0.03]"
              >
                <Mail className="size-4 text-[#C5A880] shrink-0 mt-1" strokeWidth={1.5} />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-semibold block mb-1">
                    {t('البريد الإلكتروني', 'Email')}
                  </span>
                  <span dir="ltr" className="block text-slate-200 text-[14px] font-medium truncate group-hover:text-[#D6B57E] transition-colors">
                    {BRAND.email}
                  </span>
                </div>
              </a>

              {/* Address */}
              <div className="flex items-start gap-4 px-8 py-5 border-b border-white/[0.07]">
                <MapPin className="size-4 text-[#C5A880] shrink-0 mt-1" strokeWidth={1.5} />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-semibold block mb-1">
                    {t('المقر الرئيسي', 'Head Office')}
                  </span>
                  <span className="block text-slate-200 text-[14px] font-medium leading-relaxed">
                    {BRAND.officeAddress}
                  </span>
                </div>
              </div>

              {/* Working hours */}
              <div className="flex items-start gap-4 px-8 py-5">
                <Clock className="size-4 text-[#C5A880] shrink-0 mt-1" strokeWidth={1.5} />
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-semibold block mb-1">
                    {t('أوقات العمل الرسمية', 'Office Hours')}
                  </span>
                  <span className="block text-slate-200 text-[14px] font-medium leading-relaxed">
                    {BRAND.workingHours}
                  </span>
                </div>
              </div>
            </div>

            {/* Licensing footer — formal credentials */}
            <div className="px-8 py-5 bg-white/[0.03] border-t border-white/10">
              <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
                {t(
                  `مرخّص من وزارة العدل برقم (${BRAND.licenseNumber}) — مسجّل بالهيئة السعودية للمحامين برقم (${BRAND.legalEntityId})`,
                  `Licensed by the Ministry of Justice No. (${BRAND.licenseNumber}) — Saudi Bar Association No. (${BRAND.legalEntityId})`
                )}
              </p>
            </div>
          </Card>

          {/* الوصول إلى المقر */}
          <Card className="mt-6 bg-white border border-[#EADFCF] rounded-2xl shadow-none p-7">
            <span className="text-[10px] font-bold text-[#C5A880] tracking-[0.22em] uppercase block mb-3">
              {t('الوصول إلى المقر', 'Getting Here')}
            </span>
            <p className="font-tajawal text-[13.5px] text-[#0F172A] font-semibold leading-relaxed">
              {t(BRAND.officeAddress, BRAND.officeAddressEn)}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BRAND.officeAddressEn)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-[12px] font-bold text-[#0F172A] hover:text-[#C5A880] transition-colors"
            >
              <MapPin className="size-3.5 text-[#C5A880]" strokeWidth={1.5} />
              <span>{t('فتح الموقع في خرائط قوقل', 'Open in Google Maps')}</span>
              <ArrowLeft className={cn('size-3.5 text-[#C5A880]', !isRTL && 'rotate-180')} />
            </a>
          </Card>
        </div>

        {/* LEFT (RTL END) -> Contact Form Card */}
        <div className="lg:col-span-7">
          <Card className="p-8 sm:p-10 bg-white border border-[#EADFCF] rounded-2xl shadow-none relative overflow-hidden">
            <div className="mb-8 pb-6 border-b border-[#F1E8DA]">
              <span className="text-[10px] font-bold text-[#C5A880] tracking-[0.22em] uppercase block mb-2">
                {t('نموذج الاستفسار', 'Inquiry Form')}
              </span>
              <h2 className="font-amiri text-2xl font-bold text-[#0F172A] leading-snug">{t('أرسل استفسارك القانوني', 'Send Legal Inquiry')}</h2>
              <p className="font-tajawal text-[13px] text-[#64748B] font-medium leading-relaxed mt-2">
                {t('يرجى تعبئة البيانات التالية وسيتواصل معكم أحد المستشارين المختصين خلال أوقات العمل الرسمية.', 'Complete the form below and one of our consultants will respond during official working hours.')}
              </p>
            </div>

            {sent ? (
              <div className="py-14 text-center space-y-4 font-tajawal">
                <CheckCircle2 className="size-10 text-[#C5A880] mx-auto" strokeWidth={1.25} />
                <h3 className="font-amiri text-2xl font-bold text-[#0F172A]">{t('تم استلام استفسارك', 'Inquiry Received')}</h3>
                <p className="text-sm text-[#64748B] max-w-md mx-auto font-medium leading-relaxed">{t('سيتواصل معكم أحد المستشارين خلال أوقات العمل الرسمية.', 'One of our consultants will contact you during official working hours.')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 font-tajawal">
                {error && <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 font-medium">{error}</div>}

                {/* Full Name */}
                <div className="space-y-2">
                  <label className={LABEL}>{t('الاسم الكريم', 'Full Name')}</label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={FIELD}
                    placeholder={t('الاسم الكامل', 'Full name')}
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className={LABEL}>{t('رقم الجوال', 'Mobile')}</label>
                    <Input
                      required
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={cn(FIELD, 'tracking-wide')}
                      placeholder="05XXXXXXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={LABEL}>{t('البريد الإلكتروني', 'Email')}</label>
                    <Input
                      required
                      type="email"
                      dir="ltr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={FIELD}
                      placeholder="name@domain.com"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className={LABEL}>{t('نص الاستفسار', 'Message')}</label>
                  <Textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={cn(FIELD, 'h-auto resize-none p-4 leading-relaxed')}
                    placeholder={t('اشرح موضوع استفسارك بإيجاز...', 'Briefly describe your inquiry...')}
                  />
                </div>

                {/* Submit */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 px-8 bg-[#0B132B] hover:bg-[#16203f] text-white font-bold rounded-lg text-[15px] shadow-none transition-colors flex items-center justify-center gap-2.5"
                  >
                    <span>{isSubmitting ? t('جارٍ الإرسال...', 'Sending...') : t('إرسال الاستفسار', 'Send Inquiry')}</span>
                    <ArrowLeft className={cn('size-4 text-[#D6B57E]', !isRTL && 'rotate-180')} />
                  </Button>

                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    {t(
                      'بإرسالك النموذج توافق على معالجة بياناتك للرد على استفسارك وفق ',
                      'By submitting this form you consent to processing your data to respond to your inquiry under our '
                    )}
                    <Link to="/privacy" className="font-bold text-[#9A7B3E] hover:text-[#C5A880] underline underline-offset-2">
                      {t('سياسة الخصوصية', 'Privacy Policy')}
                    </Link>
                    {t('، وتخضع جميع البيانات لالتزام السرية المهنية.', '. All data is covered by professional confidentiality.')}
                  </p>
                </div>

              </form>
            )}
          </Card>
        </div>

      </div>
    </div>
  )
}
