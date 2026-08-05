import React from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Award,
  Scale,
  Briefcase,
  ArrowLeft
} from 'lucide-react'
import { useT } from '../../lib/i18n'
import { BRAND } from '../../config/brand'
import { cn } from '../../lib/utils'
import { useSEO, breadcrumbLd, SITE_URL } from '../../lib/seo'

const PRINCIPLES = [
  {
    titleAr: 'رؤيتنا',
    titleEn: 'Our Vision',
    bodyAr: 'تقديم تجربة قانونية منظمة تجمع الدراسة المهنية للملف بوضوح التواصل والاستفادة المسؤولة من الحلول الرقمية.',
    bodyEn: 'An organized legal experience combining professional assessment, clear communication, and responsible digital tools.'
  },
  {
    titleAr: 'قيمنا المهنية',
    titleEn: 'Core Values',
    bodyAr: 'الوضوح، والمحافظة على السرية المهنية، ومراعاة المهل النظامية، والعناية في إعداد العقود والمذكرات.',
    bodyEn: 'Clarity, professional confidentiality, attention to statutory deadlines, and careful drafting.'
  },
  {
    titleAr: 'الامتثال والترخيص',
    titleEn: 'Licensing & Compliance',
    bodyAr: 'نلتزم بالأنظمة السعودية ذات الصلة وقواعد السلوك المهني، مع التحقق من تعارض المصالح قبل قبول العمل.',
    bodyEn: 'Aligned with applicable Saudi regulations and professional conduct rules, subject to conflict checks.'
  }
]

const COMMITMENTS = [
  { icon: ShieldCheck, ar: 'سرية مهنية', en: 'Confidentiality' },
  { icon: Scale, ar: 'دراسة مستقلة لكل ملف', en: 'Individual Assessment' },
  { icon: Briefcase, ar: 'نطاق عمل واضح', en: 'Defined Scope' },
  { icon: Award, ar: 'التزام مهني', en: 'Professional Commitment' }
]

export default function AboutPage() {
  const { t, isRTL } = useT()
  useSEO({
    title: `عن المكتب والمحامي | ${BRAND.nameAr}`,
    description: 'التعريف بمكتب المحامي ابن نوح للمحاماة والاستشارات القانونية، رؤيته ومبادئه المهنية وبيانات الترخيص الرسمية.',
    path: '/about',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'عن المكتب',
        mainEntity: { '@id': `${SITE_URL}/#legalservice` },
      },
      breadcrumbLd([
        { name: 'الرئيسية', path: '/' },
        { name: 'عن المكتب', path: '/about' },
      ]),
    ],
  })

  const registry = [
    { labelAr: 'ترخيص وزارة العدل', labelEn: 'MOJ License', value: BRAND.licenseNumber },
    { labelAr: 'سجل الهيئة السعودية للمحامين', labelEn: 'Bar Association', value: BRAND.legalEntityId },
    { labelAr: 'رمز النشاط', labelEn: 'Activity Code', value: BRAND.activityCode },
    { labelAr: 'المقر الرئيسي', labelEn: 'Head Office', value: t(`${BRAND.city} — ${BRAND.district}`, `${BRAND.districtEn}, ${BRAND.cityEn}`) }
  ]

  return (
    <div className={cn('w-full bg-[#FAF9F5] text-[#0F172A] pb-24 font-tajawal antialiased', isRTL ? 'text-right' : 'text-left')}>

      {/* HERO */}
      <section className="relative pt-20 pb-24 bg-[#0B132B] text-white border-b border-[#C5A880]/30 overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C5A880 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] text-xs font-bold">
            <ShieldCheck className="size-4 text-[#C5A880]" />
            <span>{t('ممارسة قانونية ملتزمة بالأنظمة وقواعد السلوك المهني', 'Committed to professional conduct')}</span>
          </div>

          <h1 className="font-amiri text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {t('عن المكتب', 'About the Firm')}
          </h1>

          <div className="flex items-center justify-center gap-4 py-1">
            <div className="h-[1px] w-16 bg-[#C5A880]/60" />
            <Scale className="size-5 text-[#C5A880]" strokeWidth={1.5} />
            <div className="h-[1px] w-16 bg-[#C5A880]/60" />
          </div>

          <p className="font-tajawal text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            {t(
              'ممارسة قانونية سعودية تجمع العناية المهنية بالتنظيم الرقمي، وتقدم خدماتها للأفراد والمنشآت وفق نطاق عمل واضح وسرية مهنية.',
              'A Saudi legal practice combining professional care with organized digital service for individuals and businesses.'
            )}
          </p>
        </div>
      </section>

      {/* OPENING STATEMENT + OFFICIAL REGISTRY */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          <div className="lg:col-span-7">
            <span className="text-[10px] font-bold text-[#C5A880] tracking-[0.22em] uppercase block mb-5">
              {t('من نحن', 'Who We Are')}
            </span>

            <p className="font-amiri text-2xl sm:text-[28px] font-bold text-[#0F172A] leading-[1.75] mb-6">
              {t(
                'مكتب متخصص في المحاماة والاستشارات القانونية بالرياض، يعمل وفق منهجية واضحة تبدأ بدراسة الوقائع والمستندات وتنتهي برأي نظامي مكتوب وخطة عمل محددة.',
                'A specialized law and legal consultancy office in Riyadh, working through a clear methodology that begins with reviewing facts and documents and ends with a written legal opinion and a defined action plan.'
              )}
            </p>

            <div className="space-y-4 text-[14px] text-[#64748B] font-medium leading-[2]">
              <p>
                {t(
                  'نخدم الأفراد والمنشآت في نطاقات الشركات والعقود والنزاعات التجارية والقضايا العمالية والعقارية والتنفيذ، مع تحديد نطاق العمل والأتعاب كتابةً قبل بدء أي إجراء.',
                  'We serve individuals and businesses across corporate, contracts, commercial disputes, labor, real estate, and enforcement matters — with scope and fees agreed in writing before any action begins.'
                )}
              </p>
              <p>
                {t(
                  'ولأن الملفات القانونية تحتمل التأخير أقل من غيرها، اعتمدنا نظاماً رقمياً لمتابعة القضايا والمواعيد والمستندات، يتيح للعميل الاطلاع على مستجدات ملفه دون انتظار.',
                  'Because legal matters tolerate delay least of all, we operate a digital system for tracking cases, appointments, and documents, giving clients direct visibility into their file.'
                )}
              </p>
            </div>
          </div>

          {/* Official registry — hairline definition list */}
          <div className="lg:col-span-5 w-full">
            <div className="border-t border-[#E6DBC9]">
              <div className="py-4 border-b border-[#F1E8DA]">
                <span className="text-[10px] font-bold text-[#C5A880] tracking-[0.22em] uppercase">
                  {t('البيانات النظامية', 'Official Registry')}
                </span>
              </div>

              {registry.map((row) => (
                <div key={row.labelAr} className="flex items-baseline justify-between gap-6 py-4 border-b border-[#F1E8DA]">
                  <span className="text-[12.5px] text-slate-500 font-medium shrink-0">
                    {t(row.labelAr, row.labelEn)}
                  </span>
                  <span className="text-[14px] font-bold text-[#0F172A] text-end">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLES — NUMBERED COLUMNS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex items-center gap-4 mb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A880] shrink-0">
            {t('المبادئ المهنية', 'Professional Principles')}
          </span>
          <span className="h-px flex-1 bg-[#E6DBC9]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <div
              key={p.titleEn}
              className={cn(
                'border-[#EFE6D8] py-7 md:px-8 md:py-2',
                'border-b last:border-b-0 md:border-b-0',
                i > 0 && 'md:border-s'
              )}
            >
              <span className="font-amiri text-2xl text-[#C5A880]/45 block mb-3 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-amiri text-xl font-bold text-[#0F172A] mb-3 leading-snug">
                {t(p.titleAr, p.titleEn)}
              </h3>
              <p className="text-[13px] text-[#64748B] font-medium leading-[1.95]">
                {t(p.bodyAr, p.bodyEn)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PRINCIPAL LAWYER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex items-center gap-4 mb-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A880] shrink-0">
            {t('المؤسس والمستشار', 'Founder & Principal')}
          </span>
          <span className="h-px flex-1 bg-[#E6DBC9]" />
        </div>

        <div className="bg-white border border-[#EADFCF] rounded-2xl overflow-hidden">
          <div className="flex flex-col sm:flex-row">

            {/* Monogram */}
            <div className="sm:w-52 bg-[#0B132B] flex flex-col items-center justify-center py-10 sm:py-12 shrink-0">
              <span className="font-amiri text-5xl font-bold text-[#D6B57E] leading-none">BN</span>
              <span className="h-px w-10 bg-[#C5A880]/50 my-4" />
              <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-slate-400">
                Advocate
              </span>
            </div>

            {/* Details */}
            <div className="flex-1 p-8 sm:p-10">
              <h3 className="font-amiri text-[26px] font-bold text-[#0F172A] leading-snug">
                {BRAND.lawyerNameAr}
              </h3>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#C5A880] mt-2">
                {t('محامٍ ومستشار قانوني', 'Lawyer & Legal Consultant')}
              </p>

              <p className="text-[13.5px] text-[#64748B] font-medium leading-[2] mt-5 pt-5 border-t border-[#F1E8DA]">
                {t(
                  'يتولى الاستشارة والتمثيل القانوني في نطاقات الشركات والعقود والنزاعات التجارية، بعد دراسة الوقائع والمستندات وتحديد نطاق العمل والخيارات النظامية المتاحة أمام العميل.',
                  'Handles advisory and representation in corporate, contracts, and commercial disputes — following review of the facts and documents, and definition of scope and available legal options.'
                )}
              </p>

              <div className="mt-6 pt-5 border-t border-[#F1E8DA] flex flex-wrap items-center gap-x-8 gap-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-semibold block mb-1">
                    {t('ترخيص وزارة العدل', 'MOJ License')}
                  </span>
                  <span className="text-[14px] font-bold text-[#0F172A]">{BRAND.licenseNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.16em] text-slate-400 font-semibold block mb-1">
                    {t('سجل هيئة المحامين', 'Bar Association')}
                  </span>
                  <span className="text-[14px] font-bold text-[#0F172A]">{BRAND.legalEntityId}</span>
                </div>

                <Link
                  to="/book"
                  className="ms-auto inline-flex items-center gap-2 text-[12px] font-bold text-[#0F172A] hover:text-[#C5A880] transition-colors"
                >
                  <span>{t('احجز جلسة مع المحامي', 'Book a Session')}</span>
                  <ArrowLeft className={cn('size-3.5 text-[#C5A880]', !isRTL && 'rotate-180')} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMITMENTS BAND */}
      <section className="w-full bg-[#0B132B] border-y border-[#C5A880]/25 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
          <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-y-0">
            {COMMITMENTS.map((c, i) => {
              const Icon = c.icon
              return (
                <div
                  key={c.en}
                  className={cn(
                    'relative px-5 text-center',
                    i > 0 && 'md:before:absolute md:before:inset-y-1 md:before:start-0 md:before:w-px md:before:bg-white/10'
                  )}
                >
                  <Icon className="size-5 text-[#C5A880] mx-auto mb-3" strokeWidth={1.25} />
                  <p className="text-[12px] font-semibold text-slate-300 leading-relaxed">
                    {t(c.ar, c.en)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}
