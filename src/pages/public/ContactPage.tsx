import React, { useState } from 'react'
import { Phone, Mail, MapPin, MessageSquare, CheckCircle2 } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { BRAND } from '../../config/brand'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Badge } from '../../components/ui/badge'
import { useSEO } from '../../lib/seo'

export default function ContactPage() {
  const { t } = useT()
  useSEO({ title: 'تواصل معنا | ' + BRAND.nameAr })

  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 space-y-12 font-tajawal min-h-[85vh]">
      <div className="text-center space-y-3">
        <Badge className="font-reem bg-[#8EB1D1] text-[#1C2B48] font-bold text-xs px-4 py-1.5 border-none shadow-sm">
          {t('قنوات التواصل المباشرة', 'Direct Channels')}
        </Badge>
        <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-[#1C2B48]">{t('تواصل معنا', 'Contact Us')}</h1>
        <p className="font-tajawal text-[#527094] text-sm sm:text-base">{t('يسعدنا استقبال استفساراتكم وحجوزاتكم عبر القنوات الرسمية بجميع الأوقات', 'We are happy to answer your inquiries')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-8 bg-[#1C2B48] text-white space-y-6 rounded-3xl shadow-xl border border-[#8EB1D1]/30">
            <h3 className="font-amiri font-bold text-xl border-b border-[#8EB1D1]/30 pb-3 text-white">{t('معلومات التواصل والمقر', 'Office Details')}</h3>
            
            <div className="space-y-5 text-sm font-tajawal">
              <div className="flex items-center gap-3">
                <Phone className="size-5 text-[#8EB1D1]" />
                <span dir="ltr" className="font-mono text-white font-bold">{BRAND.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageSquare className="size-5 text-[#A7C7E7]" />
                <span dir="ltr" className="font-mono text-[#A7C7E7] font-bold">{BRAND.whatsappNumber}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-[#8EB1D1]" />
                <span dir="ltr" className="font-mono text-[#C4D8E5]">{BRAND.email}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-[#8EB1D1] shrink-0 mt-0.5" />
                <span className="text-[#C4D8E5] leading-relaxed">{BRAND.officeAddress}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Card className="p-8 sm:p-10 bg-white border border-[#C4D8E5] rounded-3xl shadow-md">
            {sent ? (
              <div className="py-12 text-center space-y-3 font-tajawal">
                <CheckCircle2 className="size-14 text-emerald-600 mx-auto" />
                <h3 className="font-amiri text-2xl font-bold text-[#1C2B48]">{t('تم إرسال رسالتك بنجاح', 'Message Sent')}</h3>
                <p className="text-xs text-[#527094]">{t('سيتواصل معك الفريق القانوني في أقرب وقت خلال ساعات العمل.', 'We will contact you shortly.')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 font-tajawal">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#1C2B48] block">{t('الاسم الكريم', 'Your Name')}</span>
                  <Input required className="border-[#C4D8E5] rounded-xl focus:border-[#8EB1D1]" placeholder={t('أدخل اسمك الكامل', 'Full name')} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#1C2B48] block">{t('رقم الجوال', 'Mobile')}</span>
                    <Input required dir="ltr" className="border-[#C4D8E5] rounded-xl focus:border-[#8EB1D1]" placeholder="05XXXXXXXX" />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#1C2B48] block">{t('البريد الإلكتروني', 'Email')}</span>
                    <Input required type="email" dir="ltr" className="border-[#C4D8E5] rounded-xl focus:border-[#8EB1D1]" placeholder="name@domain.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#1C2B48] block">{t('نص الرسالة والاستفسار', 'Message')}</span>
                  <Textarea required rows={4} className="border-[#C4D8E5] rounded-xl focus:border-[#8EB1D1]" placeholder={t('اكتب استفسارك بالتفصيل هنا...', 'Your message...')} />
                </div>
                <Button type="submit" variant="accent" size="lg" className="w-full font-bold shadow-md rounded-2xl py-3.5 text-base">
                  {t('إرسال الرسالة', 'Send Message')}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
