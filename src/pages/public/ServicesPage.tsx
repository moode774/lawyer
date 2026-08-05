import React from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  ArrowLeft,
  Scale,
  Shield,
  Building2,
  Gavel,
  Users,
  Home,
  CreditCard,
  Heart
} from 'lucide-react'
import { useT } from '../../lib/i18n'
import { DEMO_SERVICES } from '../../data/demo'
import { cn } from '../../lib/utils'
import { useSEO, breadcrumbLd, SITE_URL } from '../../lib/seo'

export default function ServicesPage() {
  const { t, isRTL } = useT()

  useSEO({
    title: 'التخصصات والخدمات القانونية | مكتب المحامي ابن نوح',
    description: 'استكشف كافة التخصصات والخدمات القانونية والمشاكل النظامية الشائعة التي يعالجها مكتب المحامي ابن نوح بالرياض.',
    keywords: 'خدمات قانونية, استشارات قانونية, قضايا تجارية, عمالية, عقارات, تنفيذ, أحوال شخصية',
    path: '/services',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'التخصصات والخدمات القانونية',
        itemListElement: DEMO_SERVICES.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Service',
            name: s.titleAr,
            description: s.shortAr,
            serviceType: s.titleEn,
            url: `${SITE_URL}/services/${s.slug}`,
            provider: { '@id': `${SITE_URL}/#legalservice` },
            areaServed: { '@type': 'Country', name: 'المملكة العربية السعودية' },
          },
        })),
      },
      breadcrumbLd([
        { name: 'الرئيسية', path: '/' },
        { name: 'التخصصات والخدمات', path: '/services' },
      ]),
    ],
  })

  // Map service icon string to Lucide component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'building':
        return Building2
      case 'scale':
        return Scale
      case 'users':
        return Users
      case 'home':
        return Home
      case 'gavel':
        return Gavel
      case 'briefcase':
        return CreditCard
      case 'heart':
        return Heart
      default:
        return Briefcase
    }
  }

  return (
    <div className="bg-[#FAF9F5] font-tajawal min-h-screen pb-24 text-[#0F172A] antialiased">
      
      {/* LUXURY HERO HEADER */}
      <section className="relative pt-20 pb-24 bg-[#0B132B] text-white border-b border-[#C5A880]/30 overflow-hidden mb-12">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C5A880 1px, transparent 0)', backgroundSize: '24px 24px' }}
        />

        <div className="max-w-4xl mx-auto px-4 text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#D6B57E] text-xs font-bold shadow-sm">
            <Shield className="size-4 text-[#C5A880]" />
            <span>{t('التخصصات والخدمات القانونية الشاملة', 'Comprehensive Legal Practice Areas')}</span>
          </div>

          <h1 className="font-amiri text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {t('دليلك الشامل للتخصصات والقضايا المعالجة', 'Your Comprehensive Guide to Our Legal Practice Areas')}
          </h1>

          <div className="flex items-center justify-center gap-4 py-1">
            <div className="h-[1px] w-16 bg-[#C5A880]/60" />
            <Scale className="size-5 text-[#C5A880]" strokeWidth={1.5} />
            <div className="h-[1px] w-16 bg-[#C5A880]/60" />
          </div>

          <p className="font-tajawal text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            {t('نستعرض هنا كافة التخصصات والخدمات والمشاكل النظامية والقضايا الشائعة التي نتولى معالجتها وفق الأنظمة السعودية الحديثة.', 'Explore all practice areas, services, and common legal scenarios handled in full accordance with Saudi regulations.')}
          </p>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* PRACTICE AREAS — EDITORIAL INDEX */}
        <div className="bg-white border border-[#EADFCF] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(11,19,43,0.04)]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {DEMO_SERVICES.map((s, i) => {
              const IconComp = getIcon(s.icon)
              return (
                <Link
                  key={s.id}
                  to={`/services/${s.slug}`}
                  className={cn(
                    'group relative flex items-center gap-5 px-6 sm:px-8 py-6 border-b border-[#F1E8DA] transition-colors duration-300 hover:bg-[#FCFAF6]',
                    'last:border-b-0 lg:[&:nth-last-child(-n+2)]:border-b-0',
                    'lg:[&:nth-child(odd)]:border-e lg:[&:nth-child(odd)]:border-e-[#F1E8DA]'
                  )}
                >
                  {/* Gold edge indicator */}
                  <span className="absolute inset-y-0 start-0 w-[2px] bg-[#C5A880] scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-300" />

                  {/* Index numeral */}
                  <span className="font-amiri text-2xl text-[#C5A880]/45 group-hover:text-[#C5A880] transition-colors tabular-nums shrink-0 w-8">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Icon */}
                  <IconComp className="size-5 text-[#C5A880] shrink-0" strokeWidth={1.5} />

                  {/* Titles */}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-amiri text-xl font-bold text-[#0F172A] group-hover:text-[#9A7B3E] transition-colors leading-snug truncate">
                      {t(s.titleAr, s.titleEn)}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.14em] block mt-1 truncate">
                      {s.titleEn}
                    </span>
                  </div>

                  {/* Arrow */}
                  <ArrowLeft
                    className={cn(
                      'size-4 text-[#C5A880] shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300',
                      !isRTL && 'rotate-180 translate-x-1 group-hover:translate-x-0'
                    )}
                  />
                </Link>
              )
            })}
          </div>
        </div>

        {/* BOTTOM CONSULTATION CARD */}
        <div className="mt-16 rounded-3xl bg-[#0B132B] text-white p-8 sm:p-12 text-center space-y-6 border border-[#C5A880]/30 shadow-xl">
          <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-white">
            {t('لم تجد تخصص قريباً من حالتك؟', 'Need Legal Advice for a Specific Case?')}
          </h2>
          <p className="font-tajawal text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-medium leading-relaxed">
            {t('يمكنكم طلب استشارة خاصة لمراجعة ملف قضيتكم وتحديد التكييف الشرعي والنظامي المناسب فوراً.', 'Request a private legal consultation to evaluate your case facts and receive an authoritative legal opinion.')}
          </p>
          <div className="pt-2">
            <Link
              to="/book"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D6B57E] to-[#C5A880] text-[#060B19] font-bold text-sm hover:from-[#c4a36b] hover:to-[#b8986c] transition-all shadow-lg"
            >
              <span>{t('احجز موعد استشارة الآن', 'Book Private Consultation')}</span>
              <ArrowLeft className={cn('size-4 text-[#060B19]', !isRTL && 'rotate-180')} />
            </Link>
          </div>
        </div>

      </div>

    </div>
  )
}
