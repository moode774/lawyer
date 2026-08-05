import React from 'react'
import { Link } from 'react-router-dom'
import { Scale, ArrowLeft } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { cn } from '../../lib/utils'
import { useSEO } from '../../lib/seo'

const SUGGESTIONS = [
  { to: '/services', ar: 'التخصصات والخدمات', en: 'Practice Areas' },
  { to: '/insights', ar: 'المقالات القانونية', en: 'Legal Insights' },
  { to: '/faq', ar: 'الأسئلة الشائعة', en: 'FAQ' },
  { to: '/contact', ar: 'تواصل معنا', en: 'Contact' },
]

export default function NotFoundPage() {
  const { t, isRTL } = useT()
  useSEO({
    title: 'الصفحة غير موجودة',
    description: 'الصفحة المطلوبة غير متاحة على موقع مكتب المحامي ابن نوح للمحاماة والاستشارات القانونية.',
    noindex: true,
  })

  return (
    <div className="bg-[#FAF9F5] font-tajawal min-h-[70vh] text-[#0F172A] antialiased flex items-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">

        <span className="font-amiri text-[80px] sm:text-[110px] font-bold text-[#C5A880]/35 leading-none block">
          404
        </span>

        <div className="flex items-center justify-center gap-4 py-5">
          <div className="h-px w-14 bg-[#E6DBC9]" />
          <Scale className="size-5 text-[#C5A880]" strokeWidth={1.5} />
          <div className="h-px w-14 bg-[#E6DBC9]" />
        </div>

        <h1 className="font-amiri text-3xl sm:text-4xl font-bold text-[#0F172A] leading-snug">
          {t('الصفحة غير موجودة', 'Page Not Found')}
        </h1>

        <p className="font-tajawal text-sm text-[#64748B] font-medium leading-relaxed mt-4 max-w-md mx-auto">
          {t(
            'الرابط الذي فتحته غير متاح أو تم تغييره. يمكنكم المتابعة من الأقسام التالية.',
            'The page you requested is unavailable or has moved. You can continue from the sections below.'
          )}
        </p>

        <div className="mt-10 border-t border-[#EFE6D8] max-w-sm mx-auto">
          {SUGGESTIONS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group flex items-center justify-between gap-3 py-4 border-b border-[#EFE6D8] text-start transition-colors hover:text-[#9A7B3E]"
            >
              <span className="text-[13px] font-bold">{t(item.ar, item.en)}</span>
              <ArrowLeft
                className={cn(
                  'size-3.5 text-[#C5A880] transition-transform',
                  isRTL ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'
                )}
              />
            </Link>
          ))}
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-10 h-11 px-7 rounded-lg bg-[#0B132B] hover:bg-[#16203f] text-white text-[13px] font-bold transition-colors"
        >
          <span>{t('العودة للرئيسية', 'Back to Home')}</span>
          <ArrowLeft className={cn('size-3.5 text-[#D6B57E]', !isRTL && 'rotate-180')} />
        </Link>
      </div>
    </div>
  )
}
