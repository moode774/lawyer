import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Scale, Shield, ArrowLeft } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { DEMO_FAQS } from '../../data/demo'
import { cn } from '../../lib/utils'
import { useSEO, breadcrumbLd } from '../../lib/seo'

export default function FaqPage() {
  const { t, isRTL } = useT()
  useSEO({
    title: 'الأسئلة الشائعة | مكتب المحامي ابن نوح',
    description: 'إجابات رسمية عن الاستفسارات المتكررة حول حجز الاستشارات، الأتعاب، السرية المهنية، والترافع أمام المحاكم واللجان.',
    path: '/faq',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: DEMO_FAQS.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      },
      breadcrumbLd([
        { name: 'الرئيسية', path: '/' },
        { name: 'الأسئلة الشائعة', path: '/faq' },
      ]),
    ],
  })

  const categories = useMemo(() => Array.from(new Set(DEMO_FAQS.map((f) => f.category))), [])

  const [activeCat, setActiveCat] = useState<string>('all')
  const [activeId, setActiveId] = useState<string | null>(DEMO_FAQS[0]?.id ?? null)

  const visible = activeCat === 'all' ? DEMO_FAQS : DEMO_FAQS.filter((f) => f.category === activeCat)

  return (
    <div className="bg-[#FAF9F5] font-tajawal min-h-screen pb-24 text-[#0F172A] antialiased">
      {/* LUXURY HERO HEADER */}
      <section className="relative pt-20 pb-24 bg-[#0B132B] text-white border-b border-[#C5A880]/30 overflow-hidden mb-16">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C5A880 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] text-xs font-bold">
            <Shield className="size-4 text-[#C5A880]" />
            <span>{t('الأسئلة الشائعة والتوضيحات', 'FAQs & Answers')}</span>
          </div>

          <h1 className="font-amiri text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {t('إجابات عن تساؤلاتك القانونية', 'Frequently Asked Questions')}
          </h1>

          {/* Scale Ornament */}
          <div className="flex items-center justify-center gap-4 py-1">
            <div className="h-[1px] w-16 bg-[#C5A880]/60" />
            <Scale className="size-5 text-[#C5A880]" strokeWidth={1.5} />
            <div className="h-[1px] w-16 bg-[#C5A880]/60" />
          </div>

          <p className="font-tajawal text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            {t('كل ما تحتاج معرفته عن إجراءات الاستشارات والعقود وسرية البيانات.', 'Clear insights about booking, confidentiality & services.')}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* SIDE — CATEGORY INDEX + QUIET CTA */}
        <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-8">
          <div>
            <span className="text-[10px] font-bold text-[#C5A880] tracking-[0.22em] uppercase block mb-4">
              {t('تصفية حسب الموضوع', 'Filter by Topic')}
            </span>

            <div className="flex flex-col">
              <button
                onClick={() => setActiveCat('all')}
                className={cn(
                  'group flex items-center justify-between gap-3 py-3 border-b border-[#F1E8DA] text-start transition-colors',
                  activeCat === 'all' ? 'text-[#0F172A]' : 'text-slate-500 hover:text-[#9A7B3E]'
                )}
              >
                <span className="font-tajawal text-[13px] font-bold">{t('جميع الأسئلة', 'All Questions')}</span>
                <span className={cn('text-[11px] font-bold tabular-nums', activeCat === 'all' ? 'text-[#C5A880]' : 'text-slate-400')}>
                  {DEMO_FAQS.length}
                </span>
              </button>

              {categories.map((cat) => {
                const count = DEMO_FAQS.filter((f) => f.category === cat).length
                const isActive = activeCat === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCat(cat)}
                    className={cn(
                      'group flex items-center justify-between gap-3 py-3 border-b border-[#F1E8DA] text-start transition-colors',
                      isActive ? 'text-[#0F172A]' : 'text-slate-500 hover:text-[#9A7B3E]'
                    )}
                  >
                    <span className="font-tajawal text-[13px] font-bold">{cat}</span>
                    <span className={cn('text-[11px] font-bold tabular-nums', isActive ? 'text-[#C5A880]' : 'text-slate-400')}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quiet CTA */}
          <div className="bg-[#0B132B] rounded-2xl border border-white/10 p-7">
            <h3 className="font-amiri text-xl font-bold text-white leading-snug mb-2">
              {t('لم تجد إجابة سؤالك؟', 'Question Not Answered?')}
            </h3>
            <p className="font-tajawal text-[12.5px] text-slate-400 font-medium leading-relaxed mb-5">
              {t('يمكنكم عرض حالتكم على أحد المستشارين للحصول على رأي نظامي مباشر.', 'Present your case to one of our consultants for a direct legal opinion.')}
            </p>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 text-[12px] font-bold text-[#D6B57E] hover:text-white transition-colors"
            >
              <span>{t('احجز استشارة', 'Book a Consultation')}</span>
              <ArrowLeft className={cn('size-3.5', !isRTL && 'rotate-180')} />
            </Link>
          </div>
        </aside>

        {/* MAIN — ACCORDION */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-[#EADFCF] rounded-2xl overflow-hidden">
            {visible.map((faq, i) => {
              const isOpen = activeId === faq.id
              return (
                <div key={faq.id} className={cn(i > 0 && 'border-t border-[#F1E8DA]')}>
                  <button
                    onClick={() => setActiveId(isOpen ? null : faq.id)}
                    aria-expanded={isOpen}
                    className="group w-full text-start flex items-start gap-5 px-6 sm:px-8 py-6 transition-colors hover:bg-[#FCFAF6]"
                  >
                    <span className="font-amiri text-lg text-[#C5A880]/50 group-hover:text-[#C5A880] transition-colors tabular-nums shrink-0 pt-0.5 w-7">
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <span className="flex-1 min-w-0">
                      <span className="block font-tajawal text-[15px] sm:text-base font-bold text-[#0F172A] leading-relaxed group-hover:text-[#9A7B3E] transition-colors">
                        {faq.question}
                      </span>
                      <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 mt-1.5">
                        {faq.category}
                      </span>
                    </span>

                    <Plus
                      className={cn(
                        'size-4 text-[#C5A880] shrink-0 mt-1 transition-transform duration-300',
                        isOpen && 'rotate-45'
                      )}
                      strokeWidth={1.5}
                    />
                  </button>

                  {/* Answer — animated without layout jump */}
                  <div
                    className={cn(
                      'grid transition-all duration-300 ease-out',
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-7 pe-6 sm:pe-8 ps-[68px] sm:ps-[76px]">
                        <div className="border-s-2 border-[#EFE1CB] ps-5">
                          <p className="font-tajawal text-[13.5px] text-[#64748B] font-medium leading-[2]">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

