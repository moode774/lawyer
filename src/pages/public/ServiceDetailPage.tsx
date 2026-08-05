import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, ArrowLeft, CalendarCheck, Scale, Shield } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { DEMO_SERVICES } from '../../data/demo'
import { Card } from '../../components/ui/card'
import { buttonVariants } from '../../components/ui/button'
import { cn } from '../../lib/utils'
import { useSEO, breadcrumbLd, SITE_URL } from '../../lib/seo'

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const { t, isRTL } = useT()

  const service = DEMO_SERVICES.find((s) => s.slug === slug) || DEMO_SERVICES[0]
  useSEO({
    title: `${service.titleAr} | خدماتنا القانونية`,
    description: service.shortAr,
    path: `/services/${service.slug}`,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.titleAr,
        alternateName: service.titleEn,
        description: service.shortAr,
        url: `${SITE_URL}/services/${service.slug}`,
        provider: { '@id': `${SITE_URL}/#legalservice` },
        areaServed: { '@type': 'Country', name: 'المملكة العربية السعودية' },
        audience: service.whoForAr?.length
          ? service.whoForAr.map((who) => ({ '@type': 'Audience', audienceType: who }))
          : undefined,
      },
      breadcrumbLd([
        { name: 'الرئيسية', path: '/' },
        { name: 'التخصصات والخدمات', path: '/services' },
        { name: service.titleAr, path: `/services/${service.slug}` },
      ]),
    ],
  })

  return (
    <div className="bg-[#FAF9F5] font-tajawal min-h-screen pb-24 text-[#0F172A] antialiased">
      {/* LUXURY HERO HEADER */}
      <section className="relative pt-16 pb-24 bg-[#0B132B] text-white border-b border-[#C5A880]/30 overflow-hidden mb-12">
        <div className="max-w-4xl mx-auto px-4 space-y-5 relative z-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-xs font-bold text-[#C5A880] hover:underline mb-2">
            <ArrowLeft className={cn('size-3.5', !isRTL && 'rotate-180')} />
            <span>{t('العودة للتخصصات', 'Back to Services')}</span>
          </Link>

          <h1 className="font-amiri text-4xl sm:text-5xl font-bold text-white leading-tight">{service.titleAr}</h1>
          
          <div className="flex items-center gap-4 py-1">
            <div className="h-[1px] w-16 bg-[#C5A880]/60" />
            <Scale className="size-5 text-[#C5A880]" strokeWidth={1.5} />
            <div className="h-[1px] w-16 bg-[#C5A880]/60" />
          </div>

          <p className="font-tajawal text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-medium">{service.shortAr}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Main Explanation */}
        <Card className="p-8 sm:p-12 bg-white border border-[#EADFCF] rounded-2xl space-y-8 shadow-sm">
          <h2 className="font-amiri text-2xl font-bold text-[#0F172A] border-b border-[#F0E6D8] pb-4">{t('نطاق الخدمة والتفاصيل النظامية', 'Scope of Service')}</h2>
          <p className="font-tajawal text-base text-slate-600 leading-relaxed">{service.descriptionAr}</p>

          {service.scenariosAr && service.scenariosAr.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-[#F0E6D8]">
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-[#C5A880]" />
                <h3 className="font-amiri font-bold text-[#0F172A] text-xl">{t('المسائل والقضايا الشائعة التي نعالجها في هذا التخصص', 'Common Legal Issues & Scenarios We Handle')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {service.scenariosAr.map((sc, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#FAF8F3] border border-[#E8DFC9] flex items-start gap-3 text-xs font-bold text-[#0F172A] hover:border-[#C5A880]/50 transition-colors">
                    <span className="text-[#C5A880] text-sm shrink-0 mt-0.5">◆</span>
                    <span className="leading-relaxed">{sc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {service.whoForAr && service.whoForAr.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-[#F0E6D8]">
              <h3 className="font-amiri font-bold text-[#0F172A] text-xl">{t('من يستفيد من هذه الخدمة؟', 'Who is this for?')}</h3>
              <div className="space-y-3">
                {service.whoForAr.map((w, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-bold text-[#0F172A]">
                    <CheckCircle2 className="size-5 text-[#C5A880] shrink-0" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {service.processAr && service.processAr.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-[#F0E6D8]">
              <h3 className="font-amiri font-bold text-[#0F172A] text-xl">{t('خطوات تقديم الخدمة', 'Service Execution Steps')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {service.processAr.map((p, i) => (
                  <div key={i} className="p-5 rounded-xl bg-[#FAF5EB] border border-[#E8D9C3] flex items-center gap-4">
                    <span className="size-8 rounded-full bg-[#0B132B] text-[#C5A880] flex items-center justify-center font-bold text-xs shrink-0 font-mono">{i + 1}</span>
                    <div>
                      <span className="font-bold text-[#0F172A] block text-sm">{p.title}</span>
                      {p.text && <span className="text-slate-500 text-xs block mt-0.5">{p.text}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* CTA Box */}
        <Card className="p-10 bg-[#0B132B] text-white text-center space-y-6 rounded-2xl shadow-xl border border-[#C5A880]/30">
          <h3 className="font-amiri text-3xl font-bold text-white">{t(`هل تحتاج استشارة في ${service.titleAr}؟`, `Need advice in ${service.titleEn}?`)}</h3>
          <p className="font-tajawal text-slate-300 text-sm max-w-lg mx-auto leading-relaxed font-medium">
            {t('احجز جلسة استشارية مباشرة مع المحامي لتحديد الموقف النظامي وخطوات العمل.', 'Schedule a consultation with our senior attorney.')}
          </p>
          <Link to={`/book?service=${service.id}`} className="inline-flex items-center gap-2 rounded-full bg-[#C5A880] hover:bg-[#b8986c] text-[#0F172A] px-8 py-3.5 font-bold text-sm transition-all shadow-md">
            <CalendarCheck className="size-5" />
            <span>{t('احجز موعد استشارة الآن', 'Book Consultation Now')}</span>
          </Link>
        </Card>
      </div>
    </div>
  )
}
