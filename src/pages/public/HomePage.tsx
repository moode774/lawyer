import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Scale,
  Users,
  Clock,
  Briefcase,
  Building2,
  FileText,
  Lock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Gavel,
  MessageSquare
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useT } from '../../lib/i18n'
import { track } from '../../lib/analytics'
import { useSEO } from '../../lib/seo'
import { cn } from '../../lib/utils'
import { BRAND } from '../../config/brand'
import { DEMO_SERVICES, DEMO_FAQS as ALL_FAQS } from '../../data/demo'

// Home page shows a short teaser; the full list lives on /faq
const DEMO_FAQS = ALL_FAQS.slice(0, 4)

/**
 * مؤشرات محايدة وقابلة للإثبات — تتجنّب ما يوحي بضمان النتائج أو المبالغة
 * وفق قواعد السلوك المهني للإعلان في نظام المحاماة السعودي.
 */
const STATS_DATA = [
  { val: BRAND.licenseNumber, labelAr: 'ترخيص وزارة العدل', labelEn: 'MOJ License' },
  { val: '8', labelAr: 'نطاقات تخصص', labelEn: 'Practice Areas' },
  { val: '24h', labelAr: 'مدة الرد على الاستفسار', labelEn: 'Inquiry Response' },
  { val: '100%', labelAr: 'التزام بالسرية المهنية', labelEn: 'Confidentiality' }
]

const FEATURE_CARDS = [
  {
    titleAr: 'خبرة واسعة',
    titleEn: 'Extensive Expertise',
    descAr: 'سنوات من الخبرة في تقديم حلول قانونية موثوقة وفعالة.',
    descEn: 'Years of proven track record delivering reliable legal solutions.',
    icon: Building2
  },
  {
    titleAr: 'استجابة سريعة',
    titleEn: 'Fast Response',
    descAr: 'نلتزم بالرد على الاستفسارات ومتابعة الملف أولاً بأول خلال أوقات العمل.',
    descEn: 'Committed to prompt responses and continuous follow-up during working hours.',
    icon: Clock
  },
  {
    titleAr: 'سرية تامة',
    titleEn: 'Strict Confidentiality',
    descAr: 'نلتزم بأعلى معايير السرية والخصوصية لحماية معلومات عملائنا.',
    descEn: 'Highest standards of privacy and client confidentiality.',
    icon: ShieldCheck
  },
  {
    titleAr: 'فريق متخصص',
    titleEn: 'Expert Team',
    descAr: 'محامون ومستشارون ذوو خبرة عالية في مختلف المجالات القانونية.',
    descEn: 'Specialized lawyers and advisors in diverse legal disciplines.',
    icon: Users
  }
]

export default function HomePage() {
  const { t, isRTL } = useT()
  const [activeFaq, setActiveFaq] = useState<string | null>(DEMO_FAQS[0]?.id || null)

  useSEO({
    title: 'مكتب المحامي ابن نوح للمحاماة والاستشارات القانونية | بن نوح',
    description: 'مكتب المحامي ابن نوح للمحاماة والاستشارات القانونية بالرياض. تقديم خدمات قانونية احترافية للأفراد والشركات في المملكة العربية السعودية.',
    keywords: 'بن نوح, ابن نوح, المحامي ابن نوح, مكتب ابن نوح للمحاماة, محامي بالرياض, استشارات قانونية',
    path: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: DEMO_FAQS.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
  })

  return (
    <div className={cn('w-full bg-white text-[#050B15] font-tajawal antialiased selection:bg-[#CFA671] selection:text-[#050B15]', isRTL ? 'text-right' : 'text-left')}>

      {/* Hero - FULL SCREEN INITIAL FOLD */}
      <section className="relative w-full overflow-hidden bg-[#FAF9F5] min-h-[calc(100vh-80px)] flex items-center">
        <div className="flex w-full min-h-[calc(100vh-80px)] flex-col lg:flex-row-reverse items-center py-10 lg:py-0" dir="ltr">
          <div className="flex w-full items-center justify-center px-5 py-10 text-center lg:w-1/2 lg:px-10 lg:py-0" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="flex w-full max-w-[520px] flex-col items-center">
              <p className="text-[16px] font-bold text-[#C99755] sm:text-[18px]">
                {t('خبرة قانونية، حلول عملية', 'Legal Expertise, Practical Solutions')}
              </p>

              <h1 className="mt-4 font-amiri text-[40px] font-bold leading-[1.2] tracking-tight text-[#050B15] sm:text-[50px] lg:text-[60px] xl:text-[70px]">
                <span className="block">{t('تقديم الاستشارات', 'Providing Consultancy')}</span>
                <span className="block">{t('والحلول القانونية', '& Legal Solutions')}</span>
              </h1>

              <div className="mt-5 flex w-full items-center justify-center gap-4 text-[#D2A361]" aria-hidden="true">
                <span className="h-px w-[26%] max-w-[160px] bg-[#D7B47E]" />
                <Scale className="size-[22px] shrink-0" strokeWidth={1.45} />
                <span className="h-px w-[26%] max-w-[160px] bg-[#D7B47E]" />
              </div>

              <p className="mt-5 max-w-[430px] text-[16px] font-medium leading-[1.85] text-[#595B62] sm:text-[18px]">
                {t(
                  'نساعد الأفراد والشركات على تجاوز التحديات القانونية من خلال تقديم حلول دقيقة وفعالة لحماية مصالحهم وضمان الامتثال للأنظمة.',
                  'We help individuals and companies overcome legal challenges with precise, effective solutions that protect their interests and ensure compliance.'
                )}
              </p>

              <div className="mt-8 flex w-full max-w-[382px] flex-col-reverse items-stretch justify-center gap-3 sm:flex-row sm:items-center" dir="rtl">
                <Link
                  to="/book"
                  onClick={() => track('cta_click', { cta: 'hero_primary_book' })}
                  className="inline-flex h-[50px] flex-1 items-center justify-center gap-5 rounded-full bg-[#020A17] px-6 text-sm font-bold text-white shadow-[0_8px_20px_rgba(2,10,23,0.1)] transition-colors hover:bg-[#142033] focus-visible:ring-[#CFA671]"
                >
                  <span>{t('احجز استشارة الآن', 'Book Consultation Now')}</span>
                  {isRTL ? <ArrowLeft className="size-4 text-[#CFA671]" /> : <ArrowRight className="size-4 text-[#CFA671]" />}
                </Link>
                <Link
                  to="/services"
                  className="inline-flex h-[50px] min-w-[158px] items-center justify-center rounded-full border border-[#D7A866] bg-white px-6 text-sm font-bold text-[#C58F4D] transition-colors hover:bg-[#FCF8F1] focus-visible:ring-[#CFA671]"
                >
                  {t('تصفح خدماتنا', 'Explore Services')}
                </Link>
              </div>
            </div>
          </div>

          <div className="relative h-[450px] sm:h-[550px] lg:h-[calc(100vh-80px)] w-full overflow-hidden rounded-tr-[170px] rounded-br-[170px] sm:rounded-tr-[230px] sm:rounded-br-[230px] lg:w-1/2 lg:rounded-tr-[320px] lg:rounded-br-[320px]" dir="ltr">
            <img
              src="/binnouh-hero-arch.webp"
              alt={t('مقر مكتب المحامي ابن نوح للمحاماة والاستشارات القانونية بالرياض', 'Bin Nouh Law Firm office in Riyadh')}
              className="h-full w-full object-cover object-center"
              width={1535}
              height={1024}
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#FAF9F5] via-[#FAF9F5]/80 to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* WHY US — EDITORIAL PILLARS */}
      <section className="relative z-20 w-full bg-[#FAF9F5] px-4 pt-16 pb-16 sm:px-8 sm:pt-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mx-auto w-full max-w-[1180px]">

          {/* Section eyebrow */}
          <div className="flex items-center gap-4 mb-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C5A880] shrink-0">
              {t('لماذا مكتب بن نوح', 'Why Bin Nouh')}
            </span>
            <span className="h-px flex-1 bg-[#E6DBC9]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURE_CARDS.map((card, idx) => {
              const Icon = card.icon
              return (
                <motion.article
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className={cn(
                    'group relative border-[#EFE6D8] px-0 py-7 sm:px-8 sm:py-2',
                    'border-b last:border-b-0 sm:border-b-0',
                    'sm:[&:nth-child(even)]:border-s lg:[&:nth-child(n+2)]:border-s'
                  )}
                >
                  {/* Gold rule that grows on hover */}
                  <span className="absolute top-0 start-0 h-px w-0 bg-[#C5A880] transition-all duration-500 group-hover:w-12 hidden sm:block" />

                  <Icon className="size-6 text-[#C5A880] mb-4" strokeWidth={1.25} />

                  <h3 className="font-amiri text-xl font-bold text-[#0F172A] mb-2 leading-snug">
                    {t(card.titleAr, card.titleEn)}
                  </h3>

                  <p className="font-tajawal text-[13px] font-medium leading-[1.85] text-[#64748B]">
                    {t(card.descAr, card.descEn)}
                  </p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      {/* FIGURES — SLIM DARK BAND */}
      <section className="w-full bg-[#0B132B] border-y border-[#C5A880]/25" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-8 py-12">
          <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-y-0">
            {STATS_DATA.map((st, i) => (
              <div
                key={st.val}
                className={cn(
                  'relative px-4 text-center',
                  i > 0 && 'md:before:absolute md:before:inset-y-2 md:before:start-0 md:before:w-px md:before:bg-white/10'
                )}
              >
                <div className="font-amiri text-4xl sm:text-[42px] font-bold leading-none text-[#D6B57E]">
                  {st.val}
                </div>
                <div className="mt-3 font-tajawal text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {t(st.labelAr, st.labelEn)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FINAL LUXURY CALL TO ACTION (CTA BANNER) */}
      <section className="py-16 w-full max-w-[1440px] mx-auto px-4 sm:px-8 mb-16">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#060B19] via-[#0B132B] to-[#0A1835] text-white p-10 sm:p-16 overflow-hidden shadow-[0_25px_60px_-15px_rgba(11,19,43,0.4)] border border-[#C5A880]/40 text-center space-y-7">
          
          <div className="absolute -top-24 -left-24 size-96 rounded-full bg-[#C5A880]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 size-96 rounded-full bg-[#C5A880]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/40 text-[#D8B98F] text-xs font-bold font-tajawal tracking-wide shadow-sm">
            <span className="text-[#C5A880]">⚖</span>
            <span>حقوقكم ومصالحكم محميّة دائماً</span>
          </div>

          <h2 className="relative z-10 font-amiri text-3xl sm:text-4xl lg:text-5xl font-bold leading-snug text-white max-w-3xl mx-auto drop-shadow">
            {t('جاهز للحصول على ', 'Ready for a ')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D6B57E] to-[#C5A880]">
              {t('استشارة قانونية مخصصة', 'Tailored Legal Consultation')}
            </span>
            {t(' لقضيتك؟', ' for Your Case?')}
          </h2>

          <p className="relative z-10 font-tajawal text-[#CBD5E1] text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            {t('تواصل معنا اليوم لحجز موعد مع مستشارينا القانونيين وحصل على دراسة وافية لموقفك النظامي.', 'Contact us today to schedule an appointment with our legal consultants and receive a comprehensive review of your legal position.')}
          </p>

          <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 font-tajawal">
            <Link
              to="/book"
              onClick={() => track('cta_click', { cta: 'cta_banner_book' })}
              className="px-9 py-4 rounded-full bg-gradient-to-r from-[#D6B57E] to-[#C5A880] hover:from-[#c4a36b] hover:to-[#b8986c] text-[#060B19] font-bold text-base shadow-[0_10px_25px_rgba(197,168,128,0.35)] hover:shadow-[0_14px_30px_rgba(197,168,128,0.5)] transition-all transform hover:-translate-y-0.5 w-full sm:w-auto"
            >
              {t('حجز موعد استشارة', 'Book Appointment')}
            </Link>

            <a
              href="tel:+966500424282"
              onClick={() => track('phone_click', { source: 'cta_banner' })}
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-base hover:border-[#C5A880]/60 transition-all border border-white/20 flex items-center justify-center gap-3 w-full sm:w-auto backdrop-blur-sm"
            >
              <Phone className="size-4 text-[#D6B57E]" />
              <span dir="ltr" className="font-mono tracking-wide">+966 50 042 4282</span>
            </a>
          </div>

        </div>
      </section>

    </div>
  )
}
