import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, ArrowLeft, CalendarCheck } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { DEMO_SERVICES } from '../../data/demo'
import { Card } from '../../components/ui/card'
import { buttonVariants } from '../../components/ui/button'
import { cn } from '../../lib/utils'
import { useSEO } from '../../lib/seo'

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const { t, isRTL } = useT()

  const service = DEMO_SERVICES.find((s) => s.slug === slug) || DEMO_SERVICES[0]
  useSEO({ title: `${service.titleAr} | خدماتنا القانونية` })

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 space-y-12 font-tajawal min-h-[85vh]">
      <div className="space-y-4">
        <Link to="/services" className="text-xs font-bold text-[#1C2B48] hover:text-[#8EB1D1] flex items-center gap-1">
          <ArrowLeft className={cn('size-3.5', isRTL && 'rotate-180')} />
          <span>{t('العودة للتخصصات', 'Back to Services')}</span>
        </Link>
        <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-[#1C2B48]">{service.titleAr}</h1>
        <p className="font-tajawal text-lg text-[#527094] leading-relaxed">{service.shortAr}</p>
      </div>

      {/* Main Explanation */}
      <Card className="p-8 sm:p-10 bg-white border border-[#C4D8E5] rounded-3xl space-y-8 shadow-sm">
        <h2 className="font-amiri text-2xl font-bold text-[#1C2B48] border-b border-[#C4D8E5] pb-4">{t('نطاق الخدمة والتفاصيل النظامية', 'Scope of Service')}</h2>
        <p className="font-tajawal text-sm text-[#527094] leading-relaxed">{service.descriptionAr}</p>

        {service.whoForAr && service.whoForAr.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-[#C4D8E5]/70">
            <h3 className="font-reem font-bold text-[#1C2B48] text-base">{t('من يستفيد من هذه الخدمة؟', 'Who is this for?')}</h3>
            <div className="space-y-2.5">
              {service.whoForAr.map((w, i) => (
                <div key={i} className="flex items-center gap-3 text-xs sm:text-sm font-bold text-[#1C2B48]">
                  <CheckCircle2 className="size-4 text-[#8EB1D1] shrink-0" />
                  <span>{w}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {service.processAr && service.processAr.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-[#C4D8E5]/70">
            <h3 className="font-reem font-bold text-[#1C2B48] text-base">{t('خطوات تقديم الخدمة', 'Service Execution Steps')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {service.processAr.map((p, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#E8ECEF]/60 border border-[#C4D8E5] flex items-center gap-3">
                  <span className="size-7 rounded-full bg-[#1C2B48] text-white flex items-center justify-center font-bold text-xs shrink-0 font-mono">{i + 1}</span>
                  <div>
                    <span className="font-bold text-[#1C2B48] block text-sm">{p.title}</span>
                    {p.text && <span className="text-[#527094] text-xs block mt-0.5">{p.text}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* CTA Box */}
      <Card className="p-10 bg-[#1C2B48] text-white text-center space-y-6 rounded-3xl shadow-xl border border-[#8EB1D1]/30">
        <h3 className="font-amiri text-3xl font-bold">{t(`هل تحتاج استشارة في ${service.titleAr}؟`, `Need advice in ${service.titleEn}?`)}</h3>
        <p className="font-tajawal text-[#C4D8E5] text-sm max-w-lg mx-auto leading-relaxed">
          {t('احجز جلسة استشارية مباشرة مع المحامي لتحديد الموقف النظامي وخطوات العمل.', 'Schedule a consultation with our senior attorney.')}
        </p>
        <Link to={`/book?service=${service.id}`} className={cn(buttonVariants({ variant: 'accent', size: 'lg' }), 'font-bold px-8 rounded-full shadow-lg')}>
          <CalendarCheck className="size-5 me-2" />
          {t('احجز موعد استشارة الآن', 'Book Consultation Now')}
        </Link>
      </Card>
    </div>
  )
}
