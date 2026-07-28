import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Award,
  Scale,
  CalendarCheck,
  ArrowLeft,
  Briefcase,
  Sparkles
} from 'lucide-react'
import { useT } from '../../lib/i18n'
import { BRAND } from '../../config/brand'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { buttonVariants } from '../../components/ui/button'
import { cn } from '../../lib/utils'
import { useSEO } from '../../lib/seo'

// MAGAZINE ARTICLES WITH INTERACTIVE MODAL CONTENT
const MAGAZINE_ARTICLES = [
  {
    id: 1,
    titleAr: '5 نصائح جوهرية قبل قيد أي دعوى تجارية أمام المحاكم',
    titleEn: '5 Critical Tips Before Filing Commercial Litigation',
    category: 'التقاضي والنزاعات',
    publishedAt: '2026-01-15',
    author: BRAND.lawyerNameAr,
    readMinutes: 6,
    excerptAr: 'اختيار الكيان والتجهيز المستندي المحكم أول خطوات الفوز بالدعوى التجارية والتنفيذ السريع.',
    contentAr: [
      'تأكد من توثيق كافة المراسلات السابقة والعقود بالسجلات الرسمية والمستندات الكتابية.',
      'راجع المهل النظامية والتقادم المنصوص عليه في نظام المحاكم التجارية.',
      'قم بتحديد طلباتك المالية الدقيقة بجدول حسابي معتمد.',
      'تأكد من توفير الوكالات الشرعية أو النظامية السارية قبل البدء بقيد الصحيفة.',
      'استشر محاميًا متخصصًا لتقييم فرص الفوز وقابلية تنفيذ الحكم لاحقًا.'
    ]
  },
  {
    id: 2,
    titleAr: 'أفكار حوكمة وقائية لوقاية الشركات العائلية من النزاعات',
    titleEn: 'Preventative Governance for Family Businesses',
    category: 'الشركات والحوكمة',
    publishedAt: '2026-01-10',
    author: 'سارة العتيبي',
    readMinutes: 5,
    excerptAr: 'تأطير الملكيات والإدارة عبر ميثاق عائلي يضمن استمرار الأجيال واستقرار الكيان التجارية.',
    contentAr: [
      'صياغة اتفاقية شركاء (Family Constitution) واضحة تحدد ملكيات وحصص كل طرف.',
      'فصل الإدارة التنفيذية عن الملكية العائلية لضمان الاستمرارية والاحترافية.',
      'تحديد آلية التقييم والتخارج عند رغبة أحد الشركاء في البيع.',
      'إنشاء مجلس استشاري محايد للفصل في التباينات التشغيلية.',
      'اعتماد لائحة توزيع الأرباح والاحتياطيات النظامية بشكل شفاف.'
    ]
  },
  {
    id: 3,
    titleAr: 'كيف تراجع عقدك التجاري لمنع الثغرات التخريبية؟',
    titleEn: 'How to Review Commercial Contracts Against Legal Risks',
    category: 'العقود والصياغة',
    publishedAt: '2025-12-28',
    author: BRAND.lawyerNameAr,
    readMinutes: 5,
    excerptAr: 'معظم النزاعات التعاقدية كان يمكن تجنبها بمراجعة دقيقة قبل التوقيع مع المحامي.',
    contentAr: [
      'التحقق من صلة الأطراف وصلاحيات التوقيع المقيدة بالسجل التجاري.',
      'مراجعة بند الشرط الجزائي والتأكد من عدم مغالاته أو مخالفته للنظام.',
      'تحديد آلية الفسخ والإخطارات الكتابية المسبقة.',
      'تأكيد بند الاختصاص القضائي للمحاكم التجارية بالسعودية.',
      'التحقق من حماية السرية وشرط عدم المنافسة التعاقدي.'
    ]
  },
  {
    id: 4,
    titleAr: 'أحدث التعديلات في نظام العمل واللوائح التنفيذية 2026',
    titleEn: 'Latest Saudi Labor Law Amendments 2026',
    category: 'نظام العمل',
    publishedAt: '2025-12-15',
    author: 'خالد الشمري',
    readMinutes: 7,
    excerptAr: 'شرح عملي للتعديلات الحديثة على المادتين 77 و 80 وضوابط فترات التجربة والإنهاء.',
    contentAr: [
      'التعديلات الجديدة على فترات التجربة وضوابط التمديد.',
      'تحديثات ساعات العمل والإجازات السنوية والمكافآت.',
      'الضوابط النظامية لإنهاء العقود وفق المادة 77 و المادة 80.',
      'التزام المنشآت بتطبيق منصة قوى واللوائح التنفيذية المعتمدة.',
      'حقوق الموظف عند نقل الخدمات أو اندماج المنشآت.'
    ]
  }
]

export default function AboutPage() {
  const { t, isRTL } = useT()
  useSEO({ title: `عن المكتب والمحامي والمعرفة | ${BRAND.nameAr}` })

  const [selectedArticle, setSelectedArticle] = useState<typeof MAGAZINE_ARTICLES[0] | null>(null)
  const [activeTab, setActiveTab] = useState<'firm' | 'lawyer' | 'insights'>('firm')

  return (
    <div className={cn('w-full bg-[#f6f8fa] text-[#1C2B48] pb-20 space-y-16 font-tajawal', isRTL ? 'text-right' : 'text-left')}>
      
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 bg-[#E8ECEF] border-b border-[#C4D8E5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Badge className="font-reem bg-[#8EB1D1] text-[#1C2B48] font-bold text-xs px-4 py-1.5 inline-flex items-center gap-2 shadow-sm border-none">
            <ShieldCheck className="size-4 text-[#1C2B48]" />
            <span>{t('مكتب محاماة مرخص رسميًا من وزارة العدل', 'Licensed Saudi Law Firm')}</span>
            <span>•</span>
            <span className="font-mono">{BRAND.licenseNumber}</span>
          </Badge>

          <h1 className="font-amiri text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C2B48] leading-tight max-w-4xl mx-auto">
            {t(`عن ${BRAND.nameAr} وسيرتنا القانونية`, `About ${BRAND.nameEn} & Legal Expertise`)}
          </h1>

          <p className="font-tajawal text-[#527094] text-base sm:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            {t(
              'صرح قانوني رائد يجمع بين التقاليد الراسخة للمحاماة بالشرق الأوسط والحلول الرقمية الحديثة لحماية مصالح المنشآت والأفراد بأعلى المعايير.',
              'A premier Saudi legal practice combining deep jurisprudence with modern digital infrastructure for corporate & private clients.'
            )}
          </p>

          {/* Quick Tab Switch */}
          <div className="pt-6 flex justify-center font-tajawal">
            <div className="inline-flex p-1.5 rounded-full bg-white border border-[#C4D8E5] shadow-sm text-xs font-bold gap-1">
              <button
                onClick={() => setActiveTab('firm')}
                className={cn('px-6 py-2.5 rounded-full transition-all cursor-pointer', activeTab === 'firm' ? 'bg-[#1C2B48] text-white shadow' : 'text-[#527094] hover:text-[#1C2B48]')}
              >
                {t('عن المكتب ورؤيتنا', 'About the Firm')}
              </button>
              <button
                onClick={() => setActiveTab('lawyer')}
                className={cn('px-6 py-2.5 rounded-full transition-all cursor-pointer', activeTab === 'lawyer' ? 'bg-[#1C2B48] text-white shadow' : 'text-[#527094] hover:text-[#1C2B48]')}
              >
                {t('المحامي الرئيسي', 'The Lawyer')}
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={cn('px-6 py-2.5 rounded-full transition-all cursor-pointer', activeTab === 'insights' ? 'bg-[#1C2B48] text-white shadow' : 'text-[#527094] hover:text-[#1C2B48]')}
              >
                {t('المدونة والمعرفة النظامية', 'Legal Insights')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* SECTION 1: ABOUT THE FIRM */}
        <section id="firm-section" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-reem text-xs font-bold text-[#8EB1D1] uppercase tracking-widest block">
              {t('القسم الأول', 'Part I')}
            </span>
            <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#1C2B48]">{t('رؤيتنا ورسالتنا في العمل القانوني', 'Our Vision & Core Values')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-8 bg-white border border-[#C4D8E5] shadow-sm hover:shadow-xl transition-all space-y-4 text-center group rounded-3xl">
              <div className="size-14 rounded-2xl bg-[#E8ECEF] text-[#1C2B48] flex items-center justify-center mx-auto group-hover:bg-[#1C2B48] group-hover:text-white transition-colors duration-300">
                <ShieldCheck className="size-7" />
              </div>
              <h3 className="font-amiri text-2xl font-bold text-[#1C2B48]">{t('رؤيتنا', 'Our Vision')}</h3>
              <p className="font-tajawal text-sm text-[#527094] leading-relaxed">
                {t('أن نكون المنظومة القانونية الأولى في المملكة العربية السعودية التي تمزج الممارسة الميدانية الاحترافية بالتنظيم الرقمي المبتكر.', 'To be the premier digital-first law firm providing trusted Saudi legal services.')}
              </p>
            </Card>

            <Card className="p-8 bg-white border border-[#C4D8E5] shadow-sm hover:shadow-xl transition-all space-y-4 text-center group rounded-3xl">
              <div className="size-14 rounded-2xl bg-[#E8ECEF] text-[#8EB1D1] flex items-center justify-center mx-auto group-hover:bg-[#8EB1D1] group-hover:text-[#1C2B48] transition-colors duration-300">
                <Scale className="size-7" />
              </div>
              <h3 className="font-amiri text-2xl font-bold text-[#1C2B48]">{t('قيمنا المهنية', 'Core Values')}</h3>
              <p className="font-tajawal text-sm text-[#527094] leading-relaxed">
                {t('الشفافية المطلقة، الحفاظ على السرية المهنية، الالتزام الصارم بالمهل، والدقة المتناهية في صياغة العقود والمذكرات.', 'Absolute transparency, confidentiality, strict deadlines, and precise contract drafting.')}
              </p>
            </Card>

            <Card className="p-8 bg-white border border-[#C4D8E5] shadow-sm hover:shadow-xl transition-all space-y-4 text-center group rounded-3xl">
              <div className="size-14 rounded-2xl bg-[#E8ECEF] text-[#1C2B48] flex items-center justify-center mx-auto group-hover:bg-[#1C2B48] group-hover:text-white transition-colors duration-300">
                <Award className="size-7" />
              </div>
              <h3 className="font-amiri text-2xl font-bold text-[#1C2B48]">{t('الامتثال والترخيص', 'Licensing & Compliance')}</h3>
              <p className="font-tajawal text-sm text-[#527094] leading-relaxed">
                {t(`مرخص رسميًا من وزارة العدل وهيئة المحامين برقم ترخيص: ${BRAND.licenseNumber}، مع التزام تام بالأنظمة واللوائح السعودية.`, `Officially licensed by Saudi Ministry of Justice & SBA (License ${BRAND.licenseNumber}).`)}
              </p>
            </Card>
          </div>

          {/* Stats Bar */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#1C2B48] text-white grid grid-cols-2 md:grid-cols-4 gap-8 text-center shadow-xl border border-[#8EB1D1]/30">
            <div className="space-y-1">
              <p className="font-amiri text-3xl sm:text-4xl font-bold text-white font-mono">+12</p>
              <p className="font-reem text-xs text-[#C4D8E5] font-bold">{t('سنوات خبرة في القضاء والترافع', 'Years Experience')}</p>
            </div>
            <div className="space-y-1">
              <p className="font-amiri text-3xl sm:text-4xl font-bold text-[#8EB1D1] font-mono">+500</p>
              <p className="font-reem text-xs text-[#C4D8E5] font-bold">{t('استشارة منجزة بنجاح', 'Consultations Delivered')}</p>
            </div>
            <div className="space-y-1">
              <p className="font-amiri text-3xl sm:text-4xl font-bold text-white font-mono">SAR 60M+</p>
              <p className="font-reem text-xs text-[#C4D8E5] font-bold">{t('قيمة العقود والتحصيلات', 'Value Drafted & Collected')}</p>
            </div>
            <div className="space-y-1">
              <p className="font-amiri text-3xl sm:text-4xl font-bold text-[#A7C7E7] font-mono">100%</p>
              <p className="font-reem text-xs text-[#C4D8E5] font-bold">{t('سرية وأمان البيانات', 'Confidentiality')}</p>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE LAWYER PROFILE */}
        <section id="lawyer-section" className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-reem text-xs font-bold text-[#8EB1D1] uppercase tracking-widest block">
              {t('القسم الثاني', 'Part II')}
            </span>
            <h2 className="font-amiri text-3xl sm:text-4xl font-bold text-[#1C2B48]">{t('المحامي والمستشار القانوني الرئيسي', 'Principal Lawyer & Attorney Profile')}</h2>
          </div>

          <Card className="p-8 sm:p-12 bg-white border border-[#C4D8E5] shadow-lg rounded-3xl flex flex-col lg:flex-row items-center gap-10">
            <div className="size-36 sm:size-44 rounded-3xl bg-gradient-to-br from-[#1C2B48] to-[#283d63] text-[#8EB1D1] flex items-center justify-center text-5xl font-bold font-amiri shrink-0 shadow-2xl border-2 border-[#8EB1D1]/40 relative overflow-hidden">
              <span>{BRAND.lawyerNameAr.charAt(0)}</span>
              <div className="absolute bottom-2 inset-x-0 text-center">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C4D8E5] bg-[#1C2B48]/90 py-0.5 px-2.5 rounded-full border border-[#8EB1D1]/30 font-bold">
                  Advocate
                </span>
              </div>
            </div>

            <div className="space-y-6 text-center lg:text-start flex-1 font-tajawal">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <h3 className="font-amiri text-3xl font-bold text-[#1C2B48]">{BRAND.lawyerNameAr}</h3>
                  <Badge className="font-reem bg-[#8EB1D1] text-[#1C2B48] font-bold text-xs">{BRAND.licenseNumber}</Badge>
                </div>
                <p className="text-sm font-bold text-[#8EB1D1]">{t('محامٍ ومستشار قانوني معتمد', 'Senior Advocate & Legal Consultant')}</p>
              </div>

              <p className="text-sm text-[#527094] leading-relaxed">
                {t(
                  'مستشار محاماة وترافع معتمد أمام كافة المحاكم السعودية. ممتد في خبرته عبر استشارات الشركات، العقود الاستثمارية، والنزاعات التجارية المعقدة مع سجل حافل بإنجاز ملفات كبرى بالأنظمة السعودية.',
                  'Senior advocate and legal consultant practicing across Saudi courts with over a decade of specialized corporate & litigation mastery.'
                )}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link to="/book" className={cn(buttonVariants({ variant: 'accent', size: 'md' }), 'rounded-full font-bold px-6')}>
                  <CalendarCheck className="size-4" />
                  <span>{t('احجز جلسة مع المحامي', 'Book Direct Session')}</span>
                </Link>
              </div>
            </div>
          </Card>
        </section>

      </div>
    </div>
  )
}
