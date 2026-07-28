import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Scale,
  Building2,
  Users,
  Briefcase,
  FileText,
  CalendarCheck,
  Clock,
  Sparkles,
  CheckCircle,
  Award,
  HelpCircle,
  MessageSquare,
  Lock,
  ChevronLeft,
  ChevronRight,
  Star,
  Gem,
  ExternalLink,
  PhoneCall
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useT } from '../../lib/i18n'
import { BRAND } from '../../config/brand'
import { track } from '../../lib/analytics'
import { DEMO_SERVICES, DEMO_ARTICLES, DEMO_FAQS } from '../../data/demo'
import { useSEO } from '../../lib/seo'
import { cn } from '../../lib/utils'
import { Badge } from '../../components/ui/badge'
import { PatternLattice } from '../../components/shared/PatternLattice'

// CATEGORIES DATA - LAW PRACTICE AREAS
const CATEGORIES_DATA = [
  {
    id: 'corporate',
    titleAr: 'الأنظمة التجارية والشركات',
    titleEn: 'Corporate & Commercial Law',
    countAr: '32 قضية منجزة',
    countEn: '32 Cases',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    slug: 'corporate-law'
  },
  {
    id: 'disputes',
    titleAr: 'النزاعات والتقاضي',
    titleEn: 'Commercial Disputes',
    countAr: '45 قضية قائمة',
    countEn: '45 Active Cases',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    slug: 'commercial-disputes'
  },
  {
    id: 'labor',
    titleAr: 'نظام العمل والحوكمة',
    titleEn: 'Employment & Labor Law',
    countAr: '55 لائحة معتمدة',
    countEn: '55 Governance Docs',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    slug: 'employment-law'
  },
  {
    id: 'realestate',
    titleAr: 'العقارات والمقاولات',
    titleEn: 'Real Estate & Construction',
    countAr: '28 عقدًا ضخمًا',
    countEn: '28 Major Contracts',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?auto=format&fit=crop&w=800&q=80',
    slug: 'real-estate'
  },
  {
    id: 'execution',
    titleAr: 'التنفيذ وتحصيل الديون',
    titleEn: 'Execution & Debt Collection',
    countAr: '60M+ SAR تحصيل',
    countEn: 'SAR 60M+ Collected',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    slug: 'execution'
  },
  {
    id: 'consultation',
    titleAr: 'الاستشارات التنفيذية',
    titleEn: 'Executive Consultations',
    countAr: '500+ استشارة',
    countEn: '500+ Sessions',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    slug: 'legal-consultation'
  }
]

// MAGAZINE ARTICLES WITH INTERACTIVE MODAL CONTENT
const MAGAZINE_DATA = [
  {
    id: 1,
    titleAr: '5 نصائح جوهرية قبل قيد أي دعوى تجارية أمام المحاكم',
    titleEn: '5 Critical Tips Before Filing Commercial Litigation',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    contentAr: [
      'تأكد من توثيق كافة المراسلات السابقة والعقود بالسجلات الرسمية والمستندات الكتابية.',
      'راجع المهلم النظامية والتقادم المنصوص عليه في نظام المحاكم التجارية.',
      'قم بتحديد طلباتك المالية الدقيقة بجدول حسابي معتمد.',
      'تأكد من توفير الوكالات الشرعية أو النظامية السارية قبل البدء بقيد الصحيفة.',
      'استشر محاميًا متخصصًا لتقييم فرص الفوز وقابلية تنفيذ الحكم لاحقًا.'
    ],
    contentEn: [
      'Document all prior correspondence and contracts through official channels.',
      'Check commercial court statutes of limitations and prescribed deadlines.',
      'Specify clear, itemized financial claims backed by receipts.',
      'Ensure valid legal power of attorney (POA) is active before submission.',
      'Consult a specialized lawyer to assess win probability & judgment enforcement.'
    ]
  },
  {
    id: 2,
    titleAr: 'أفكار حوكمة وقائية لوقاية الشركات العائلية من النزاعات',
    titleEn: 'Preventative Governance for Family Businesses',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    contentAr: [
      'صياغة اتفاقية شركاء (Family Constitution) واضحة تحدد ملكيات وحصص كل طرف.',
      'فصل الإدارة التنفيذية عن الملكية العائلية لضمان الاستمرارية والاحترافية.',
      'تحديد آلية التقييم والتخارج عند رغبة أحد الشركاء في البيع.',
      'إنشاء مجلس استشاري محايد للفصل في التباينات التشغيلية.',
      'اعتماد لائحة توزيع الأرباح والاحتياطيات النظامية بشكل شفاف.'
    ],
    contentEn: [
      'Draft a clear Family Constitution regulating ownership shares.',
      'Separate executive management from family ownership.',
      'Establish fair valuation and exit mechanisms for partners.',
      'Form an independent advisory board for dispute resolution.',
      'Adopt a transparent dividend distribution policy.'
    ]
  },
  {
    id: 3,
    titleAr: 'كيف تراجع عقدك التجاري لمنع الثغرات التخريبية؟',
    titleEn: 'How to Review Commercial Contracts Against Legal Risks',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    contentAr: [
      'التحقق من صلة الأطراف وصلاحيات التوقيع المقيدة بالسجل التجاري.',
      'مراجعة بند الشرط الجزائي والتأكد من عدم مغالاته أو مخالفته للنظام.',
      'تحديد آلية الفسخ والإخطارات الكتابية المسبقة.',
      'تأكيد بند الاختصاص القضائي للمحاكم التجارية بالسعودية.',
      'التحقق من حماية السرية وشرط عدم المنافسة التعاقدي.'
    ],
    contentEn: [
      'Verify party identities and commercial registry signing authority.',
      'Review penalty clauses against Saudi regulations.',
      'Specify notice mechanisms for termination.',
      'Confirm jurisdiction lies with Saudi Commercial Courts.',
      'Ensure confidentiality and non-compete clauses are protected.'
    ]
  },
  {
    id: 4,
    titleAr: 'أحدث التعديلات في نظام العمل واللوائح التنفيذية 2026',
    titleEn: 'Latest Saudi Labor Law Amendments 2026',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
    contentAr: [
      'التعديلات الجديدة على فترات التجربة وضوابط التمديد.',
      'تحديثات ساعات العمل والإجازات السنوية والمكافآت.',
      'الضوابط النظامية لإنهاء العقود وفق المادة 77 و المادة 80.',
      'التزام المنشآت بتطبيق منصة قوى واللوائح التنفيذية المعتمدة.',
      'حقوق الموظف عند نقل الخدمات أو اندماج المنشآت.'
    ],
    contentEn: [
      'New regulations on probation periods and extensions.',
      'Updates regarding working hours, leaves, and end-of-service bonuses.',
      'Statutory rules for termination under Article 77 & 80.',
      'Compliance requirements with Qiwa platform & accredited bylaws.',
      'Employee rights during company mergers or service transfers.'
    ]
  }
]

// PROMO BANNER SLIDER DATA
const PROMO_DATA = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    tagAr: 'الحماية الوقائية',
    tagEn: 'Protective Governance',
    titleAr: 'دعنا نبني لك بيئة قانونية آمنة ومستقرة',
    titleEn: 'Let Us Build Your Secure Legal Ecosystem'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1600&q=80',
    tagAr: 'سرعة الاستجابة الرقمية',
    tagEn: 'Digital Speed & Agility',
    titleAr: 'منصة استشارات رقمية تجمع الخبرة بالأمان',
    titleEn: 'Digital Legal Platform Combining Expertise with Security'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1600&q=80',
    tagAr: 'فخامة وحوكمة الأعمال',
    tagEn: 'Corporate Excellence',
    titleAr: 'قرارات نظامية أكثر ثقة لحماية استثماراتك',
    titleEn: 'Confident Legal Decisions to Safeguard Your Assets'
  }
]

export default function HomePage() {
  const { t, isRTL } = useT()
  const navigate = useNavigate()
  useSEO({ title: `${BRAND.nameAr} | استشارات قانونية وحلول احترافية` })

  // State Management for Interactive Components
  const [promoSlide, setPromoSlide] = useState(0)
  const [selectedArticle, setSelectedArticle] = useState<typeof MAGAZINE_DATA[0] | null>(null)
  const [featuredSlideIndex, setFeaturedSlideIndex] = useState(0)
  const [isLightOn, setIsLightOn] = useState(false)
  const [activeFaq, setActiveFaq] = useState<string | null>(DEMO_FAQS[0]?.id || null)

  // Auto-play Promo Banner
  useEffect(() => {
    const timer = setInterval(() => {
      setPromoSlide((prev) => (prev === PROMO_DATA.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Auto-play Featured Services Grid
  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedSlideIndex((prev) => (prev === 1 ? 0 : prev + 1))
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={cn('w-full bg-[#f6f8fa] text-[#1C2B48] font-tajawal antialiased overflow-hidden selection:bg-[#A7C7E7] selection:text-[#1C2B48]', isRTL ? 'text-right' : 'text-left')}>
      
      {/* 1. HERO SECTION - TYPOGRAPHY HARMONY: AMIRI FOR MAIN TITLES, REEM KUFI FOR TAGS, TAJAWAL FOR BODY */}
      <section className="relative w-full min-h-[90vh] pt-6 pb-6 px-4 lg:px-8 bg-[#E8ECEF] flex items-center justify-center overflow-hidden">
        <div className="w-full h-full min-h-[calc(90vh-80px)] max-w-[1920px] mx-auto flex flex-col lg:flex-row bg-white rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-xl relative border border-[#C4D8E5]">

          {/* TEXT SIDE */}
          <div className="w-full lg:w-[48%] h-full flex flex-col justify-center px-6 sm:px-12 xl:px-20 py-10 lg:py-16 relative z-10 shrink-0 bg-white">
            <PatternLattice opacity={0.07} color="#1C2B48" />
            
            {/* Reem Kufi Tag */}
            <div className="flex items-center gap-3 mb-6 xl:mb-8">
              <div className="h-[3px] w-8 lg:w-12 bg-[#8EB1D1] rounded-full" />
              <span className="font-reem text-[#8EB1D1] font-bold text-sm lg:text-base tracking-widest uppercase">
                {t('مرحباً بكم في', 'Welcome to')}
              </span>
            </div>

            {/* Amiri Main Title */}
            <h1 className="font-amiri text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#1C2B48] leading-[1.2] tracking-tight mb-4">
              {t(BRAND.nameAr, BRAND.nameEn)}
            </h1>

            {/* Reem Kufi Subtitle */}
            <h2 className="font-reem text-lg sm:text-xl lg:text-2xl font-bold text-[#2a3e5c] mb-6 leading-relaxed">
              {t('وضوح قانوني. قرارات أكثر ثقة.', 'Legal Clarity. Confident Decisions.')}
            </h2>

            {/* Tajawal Description */}
            <p className="font-tajawal text-[#527094] text-sm sm:text-base xl:text-lg mb-8 lg:mb-10 max-w-[540px] leading-[1.9] font-medium">
              {t(
                'نقدم خدمات قانونية واستشارات مهنية رفيعة المستوى للأفراد والمنشآت، بتجربة رقمية آمنة تجمع الحماية الوقائية مع السرعة وسرية البيانات.',
                'Providing premier legal advisory & services for individuals and corporations with modern digital efficiency and confidentiality.'
              )}
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8 lg:mb-12">
              <Link
                to="/book"
                onClick={() => track('cta_click', { cta: 'hero_primary_split' })}
                className="group flex items-center justify-between gap-6 lg:gap-8 w-fit bg-[#1C2B48] text-white rounded-full p-2.5 hover:bg-[#283d63] transition-all duration-500 shadow-xl"
              >
                <span className={cn('font-tajawal font-bold text-xs lg:text-sm tracking-wide', isRTL ? 'pr-4 lg:pr-6' : 'pl-4 lg:pl-6')}>
                  {t('احجز استشارة الآن', 'Book Consultation')}
                </span>
                <div className="size-11 xl:size-12 bg-[#8EB1D1] text-[#1C2B48] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[#A7C7E7] transition-all duration-500 shadow-md">
                  {isRTL ? <ArrowLeft className="size-5 font-bold" /> : <ArrowRight className="size-5 font-bold" />}
                </div>
              </Link>

              <Link
                to="/legal-intake"
                onClick={() => track('cta_click', { cta: 'hero_intake_split' })}
                className="group flex items-center justify-center gap-3 w-fit bg-[#E8ECEF] text-[#1C2B48] border border-[#C4D8E5] rounded-full px-6 py-3.5 xl:py-4 hover:bg-[#C4D8E5] transition-all duration-500 font-tajawal font-bold text-xs lg:text-sm"
              >
                <Sparkles className="size-4 text-[#8EB1D1]" />
                <span>{t('ابدأ طلبك الرقمي', 'Start Legal Request')}</span>
                {isRTL ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
              </Link>
            </div>

            {/* Bottom Professional Stats Row */}
            <div className="mt-6 lg:mt-auto pt-6 lg:pt-8 w-full relative border-t border-[#C4D8E5]/70">
              <div className="flex items-center justify-between w-full">
                
                {/* Stat 1 */}
                <div className="flex flex-col items-center flex-1">
                  <h4 className="font-amiri text-3xl lg:text-4xl xl:text-5xl font-bold text-[#1C2B48] font-mono mb-1">+12</h4>
                  <p className="font-reem text-[11px] lg:text-xs text-[#527094] font-bold tracking-wide text-center uppercase">
                    {t('سنوات خبرة', 'YEARS EXP')}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-[1px] h-10 lg:h-14 bg-[#C4D8E5]" />

                {/* Stat 2 */}
                <div className="flex flex-col items-center flex-1">
                  <h4 className="font-amiri text-3xl lg:text-4xl xl:text-5xl font-bold text-[#1C2B48] font-mono mb-1">+500</h4>
                  <p className="font-reem text-[11px] lg:text-xs text-[#527094] font-bold tracking-wide text-center uppercase">
                    {t('استشارة منجزة', 'DELIVERED')}
                  </p>
                </div>

                {/* Divider */}
                <div className="w-[1px] h-10 lg:h-14 bg-[#C4D8E5]" />

                {/* Stat 3 */}
                <div className="flex flex-col items-center flex-1">
                  <h4 className="font-amiri text-3xl lg:text-4xl xl:text-5xl font-bold text-[#8EB1D1] font-mono mb-1">100%</h4>
                  <p className="font-reem text-[11px] lg:text-xs text-[#527094] font-bold tracking-wide text-center uppercase">
                    {t('سرية وأمان', 'CONFIDENTIAL')}
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* VISUAL SIDE WITH GLOW CORD */}
          <div className="w-full lg:w-[52%] h-[420px] sm:h-[500px] lg:h-auto relative shrink-0 overflow-hidden bg-[#1C2B48]">
            <PatternLattice opacity={0.12} color="#8EB1D1" />
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
              alt="Hero Base"
              className="w-full h-full object-cover opacity-50 mix-blend-luminosity"
            />
            
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-[#1C2B48] via-[#1C2B48]/50 to-transparent pointer-events-none"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: isLightOn ? 0.95 : 0.6 }}
              transition={{ duration: 0.8 }}
            />

            <motion.div 
              className="absolute inset-0 bg-[#8EB1D1]/20 mix-blend-color-dodge pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: isLightOn ? 1 : 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />

            {/* Content Over Overlay */}
            <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-between text-white z-10 pointer-events-none">
              <div className="flex justify-between items-start">
                <div className="bg-[#8EB1D1]/20 text-[#A7C7E7] backdrop-blur border border-[#8EB1D1]/40 px-4 py-1.5 font-mono text-xs rounded-xl font-bold">
                  {BRAND.licenseNumber}
                </div>
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center gap-2">
                  <ShieldCheck className="size-5 text-[#8EB1D1]" />
                  <span className="font-tajawal text-xs font-semibold text-white">{t('مرخص رسميًا من وزارة العدل', 'MoJ Licensed')}</span>
                </div>
              </div>

              <div className="space-y-4 max-w-md bg-[#1C2B48]/90 p-6 rounded-3xl backdrop-blur-md border border-[#8EB1D1]/30 shadow-2xl">
                <div className="flex items-center gap-2 text-[#8EB1D1] text-xs font-bold font-reem">
                  <Scale className="size-4" />
                  <span>{t('معيار العدالة والوضوح', 'Standard of Excellence')}</span>
                </div>
                <h3 className="font-amiri text-xl sm:text-2xl font-bold leading-relaxed text-white">
                  {t('نظام تشغيل قانوني شامل يحمي حقوقك ومصالحك بأعلى درجات الاحترافية', 'Complete Legal Infrastructure Safeguarding Your Assets')}
                </h3>
                <p className="font-tajawal text-xs text-[#C4D8E5]">
                  {t('اسحب المقبض في أعلى الشاشة لتشغيل وضع الإضاءة والتحليل.', 'Pull cord switch for interactive lighting view.')}
                </p>
              </div>
            </div>

            {/* PULL CORD SWITCH */}
            <motion.div
              className={cn('absolute top-0 z-30 flex flex-col items-center cursor-pointer group', isRTL ? 'left-8 lg:left-16' : 'right-8 lg:right-16')}
              onClick={() => setIsLightOn(!isLightOn)}
              whileHover={{ y: 6 }}
              whileTap={{ y: 35 }}
              transition={{ type: 'spring', stiffness: 300, damping: 12 }}
            >
              <div className="w-[2.5px] h-20 lg:h-28 bg-gradient-to-b from-[#8EB1D1]/40 via-[#8EB1D1] to-[#A7C7E7] shadow-lg" />
              <div className="w-5 h-8 lg:w-5 lg:h-10 rounded-full bg-gradient-to-b from-white via-[#8EB1D1] to-[#1C2B48] shadow-[0_5px_20px_rgba(142,177,209,0.8)] border border-white/40 group-hover:brightness-125 transition-all duration-300 relative">
                <div className="absolute top-1 left-1 size-1 bg-white/80 rounded-full" />
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 2xl:px-16 mt-16 space-y-24">

        {/* 2. PRACTICE AREAS */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-reem text-xs font-bold text-[#8EB1D1] uppercase tracking-widest block mb-1">
                {t('التخصصات والخدمات', 'Practice Areas')}
              </span>
              <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1C2B48]">{t('تصفح حسب المجالات القانونية', 'Explore Legal Fields')}</h2>
            </div>
            <Link
              to="/services"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-[#1C2B48] border border-[#C4D8E5] rounded-full hover:bg-[#E8ECEF] transition-colors font-tajawal"
            >
              <span>{t('عرض جميع التخصصات', 'View All Services')}</span>
              <ArrowLeft className={cn('size-4', !isRTL && 'rotate-180')} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES_DATA.map((cat) => (
              <Link
                key={cat.id}
                to={`/services/${cat.slug}`}
                className="group cursor-pointer rounded-2xl overflow-hidden flex flex-col bg-white hover:shadow-xl transition-all duration-300 border border-[#C4D8E5]"
              >
                <div className="w-full aspect-[4/3] overflow-hidden bg-[#E8ECEF] relative">
                  <img
                    src={cat.image}
                    alt={t(cat.titleAr, cat.titleEn)}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#1C2B48]/30 group-hover:bg-[#1C2B48]/10 transition-colors" />
                </div>
                <div className="p-4 flex items-center justify-between bg-white">
                  <div>
                    <h3 className="font-amiri text-sm font-bold text-[#1C2B48] mb-1 group-hover:text-[#8EB1D1] transition-colors">
                      {t(cat.titleAr, cat.titleEn)}
                    </h3>
                    <span className="font-tajawal text-[11px] text-[#527094] block font-mono">{t(cat.countAr, cat.countEn)}</span>
                  </div>
                  <div className="size-7 rounded-full bg-[#E8ECEF] text-[#1C2B48] flex items-center justify-center group-hover:bg-[#1C2B48] group-hover:text-white transition-colors shrink-0">
                    <ArrowLeft className={cn('size-3.5', !isRTL && 'rotate-180')} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. FEATURED SERVICES */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-reem text-xs font-bold text-[#8EB1D1] uppercase tracking-widest block mb-1">
                {t('خدمات متميزة', 'Featured Services')}
              </span>
              <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1C2B48]">{t('حلول واستشارات قانونية رائدة', 'Featured Legal Solutions')}</h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setFeaturedSlideIndex((prev) => Math.max(0, prev - 1))}
                disabled={featuredSlideIndex === 0}
                className={cn('size-9 rounded-full border border-[#C4D8E5] flex items-center justify-center transition-colors', featuredSlideIndex === 0 ? 'text-[#C4D8E5] cursor-not-allowed' : 'text-[#1C2B48] hover:bg-[#E8ECEF]')}
              >
                <ArrowRight className={cn('size-4', !isRTL && 'rotate-180')} />
              </button>
              <button
                onClick={() => setFeaturedSlideIndex((prev) => Math.min(1, prev + 1))}
                disabled={featuredSlideIndex === 1}
                className={cn('size-9 rounded-full border border-[#C4D8E5] flex items-center justify-center transition-colors', featuredSlideIndex === 1 ? 'text-[#C4D8E5] cursor-not-allowed' : 'text-[#1C2B48] hover:bg-[#E8ECEF]')}
              >
                <ArrowLeft className={cn('size-4', !isRTL && 'rotate-180')} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEMO_SERVICES.slice(featuredSlideIndex * 3, (featuredSlideIndex * 3) + 3).map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C4D8E5] shadow-sm hover:shadow-xl transition-all duration-300 space-y-6 flex flex-col justify-between h-full group">
                  <div className="space-y-4">
                    <div className="size-14 rounded-2xl bg-[#E8ECEF] text-[#1C2B48] flex items-center justify-center group-hover:bg-[#1C2B48] group-hover:text-white transition-colors duration-300">
                      <Briefcase className="size-7" />
                    </div>
                    <div>
                      <h3 className="font-amiri text-xl font-bold text-[#1C2B48] group-hover:text-[#8EB1D1] transition-colors">
                        {t(service.titleAr, service.titleEn)}
                      </h3>
                      <p className="font-tajawal text-sm text-[#527094] mt-3 line-clamp-3 leading-relaxed">
                        {t(service.shortAr, service.shortEn || service.shortAr)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#C4D8E5]/70 flex items-center justify-between font-tajawal">
                    <Link
                      to={`/services/${service.slug}`}
                      className="text-xs font-bold text-[#1C2B48] hover:text-[#8EB1D1] flex items-center gap-1.5"
                    >
                      <span>{t('تفاصيل التخصص', 'Read Details')}</span>
                      <ArrowLeft className={cn('size-3.5', !isRTL && 'rotate-180')} />
                    </Link>
                    <Link
                      to={`/book?service=${service.id}`}
                      className="px-4 py-2 rounded-full bg-[#E8ECEF] text-xs font-bold text-[#1C2B48] hover:bg-[#1C2B48] hover:text-white transition-colors"
                    >
                      {t('احجز موعد', 'Book')}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. PROMO BANNER */}
        <section className="relative rounded-3xl overflow-hidden bg-[#1C2B48] text-white min-h-[360px] flex items-center shadow-xl border border-[#8EB1D1]/30">
          <AnimatePresence mode="wait">
            <motion.div
              key={promoSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <img
                src={PROMO_DATA[promoSlide].image}
                alt="Promo Banner"
                className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1C2B48] via-[#1C2B48]/80 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 p-8 sm:p-14 max-w-2xl space-y-5">
            <Badge className="font-reem bg-[#8EB1D1] text-[#1C2B48] font-bold border-none px-4 py-1.5 text-xs">
              {t(PROMO_DATA[promoSlide].tagAr, PROMO_DATA[promoSlide].tagEn)}
            </Badge>
            <h2 className="font-amiri text-3xl sm:text-4xl font-bold leading-tight text-white">
              {t(PROMO_DATA[promoSlide].titleAr, PROMO_DATA[promoSlide].titleEn)}
            </h2>
            <div className="pt-4 flex items-center gap-4 font-tajawal">
              <Link
                to="/book"
                className="px-6 py-3.5 rounded-full bg-[#8EB1D1] text-[#1C2B48] font-bold text-sm hover:bg-[#A7C7E7] transition-all shadow-md"
              >
                {t('احجز استشارتك الخاصة', 'Book Private Consultation')}
              </Link>
              <Link
                to="/legal-intake"
                className="px-6 py-3.5 rounded-full bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all backdrop-blur border border-white/20"
              >
                {t('التقييم الذكي', 'AI Assessment')}
              </Link>
            </div>
          </div>
        </section>

        {/* 5. LEGAL MAGAZINE */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-reem text-xs font-bold text-[#8EB1D1] uppercase tracking-widest block mb-1">
                {t('المجلة الثقافية القانونية', 'Legal Insights')}
              </span>
              <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1C2B48]">{t('إرشادات وتوعية نظامية للمنشآت', 'Governance & Legal Awareness')}</h2>
            </div>
            <Link
              to="/faq"
              className="font-tajawal text-xs font-bold text-[#1C2B48] hover:underline"
            >
              {t('عرض جميع المقالات والأسئلة', 'View All Articles & FAQ')}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MAGAZINE_DATA.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-[#C4D8E5] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-48 overflow-hidden bg-[#E8ECEF] relative">
                    <img
                      src={article.image}
                      alt={t(article.titleAr, article.titleEn)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <span className="font-reem text-[11px] font-bold text-[#8EB1D1] uppercase tracking-wider block">
                      {t('إرشادات محاماة', 'Legal Guide')}
                    </span>
                    <h3 className="font-amiri text-base font-bold text-[#1C2B48] group-hover:text-[#8EB1D1] transition-colors leading-snug">
                      {t(article.titleAr, article.titleEn)}
                    </h3>
                  </div>
                </div>
                <div className="p-6 pt-0 flex items-center text-xs font-bold text-[#1C2B48] gap-2 font-tajawal">
                  <span>{t('اقرأ النقاط الخمس', 'Read 5 Key Points')}</span>
                  <ArrowLeft className={cn('size-3.5 text-[#8EB1D1]', !isRTL && 'rotate-180')} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. FAQ ACCORDION SECTION */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#C4D8E5] space-y-8 shadow-sm">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="font-reem text-xs font-bold text-[#8EB1D1] uppercase tracking-widest block">
              {t('الإجابات الشافية', 'Clear Answers')}
            </span>
            <h2 className="font-amiri text-2xl sm:text-3xl font-bold text-[#1C2B48]">{t('الأسئلة الشائعة والاستفسارات', 'Frequently Asked Questions')}</h2>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-[#C4D8E5]">
            {DEMO_FAQS.map((faq) => {
              const isOpen = activeFaq === faq.id
              return (
                <div key={faq.id} className="py-5">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between text-right gap-4 font-bold text-base text-[#1C2B48] hover:text-[#8EB1D1] transition-colors font-tajawal"
                  >
                    <span>{faq.question}</span>
                    <span className="size-7 rounded-full bg-[#E8ECEF] flex items-center justify-center shrink-0 font-bold text-sm">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 text-sm text-[#527094] leading-relaxed pr-2 font-tajawal"
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </div>
              )
            })}
          </div>
        </section>

      </div>

      {/* ARTICLE INTERACTIVE MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C2B48]/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#C4D8E5] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start">
                <Badge className="font-reem bg-[#8EB1D1] text-[#1C2B48] font-bold">
                  {t('المجلة القانونية', 'Legal Article')}
                </Badge>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="size-8 rounded-full bg-[#E8ECEF] text-[#1C2B48] flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>

              <h3 className="font-amiri text-xl sm:text-2xl font-bold text-[#1C2B48]">
                {t(selectedArticle.titleAr, selectedArticle.titleEn)}
              </h3>

              <div className="space-y-3 pt-2 font-tajawal">
                {(isRTL ? selectedArticle.contentAr : selectedArticle.contentEn).map((point, idx) => (
                  <div key={idx} className="flex gap-3 items-start bg-[#E8ECEF]/60 p-3.5 rounded-xl border border-[#C4D8E5]/50">
                    <span className="size-6 rounded-full bg-[#1C2B48] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-[#2a3e5c] leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#C4D8E5] flex justify-end font-tajawal">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2.5 rounded-full bg-[#1C2B48] text-white font-bold text-xs hover:bg-[#283d63]"
                >
                  {t('إغلاق', 'Close')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
