import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Clock, Scale, Shield } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { DEMO_ARTICLES } from '../../data/demo'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { cn } from '../../lib/utils'
import { useSEO, breadcrumbLd } from '../../lib/seo'

export default function InsightsPage() {
  const { t, isRTL } = useT()
  useSEO({
    title: 'المقالات والإضاءات القانونية | مكتب المحامي ابن نوح',
    description: 'مقالات وأدلة قانونية مبسطة في تأسيس الشركات، مراجعة العقود، نظام العمل، والتحضير للاستشارة القانونية وفق الأنظمة السعودية.',
    path: '/insights',
    jsonLd: breadcrumbLd([
      { name: 'الرئيسية', path: '/' },
      { name: 'المقالات القانونية', path: '/insights' },
    ]),
  })

  return (
    <div className="bg-[#FAF9F5] font-tajawal min-h-screen pb-24 text-[#0F172A] antialiased">
      {/* LUXURY HERO HEADER */}
      <section className="relative pt-20 pb-24 bg-[#0B132B] text-white border-b border-[#C5A880]/30 overflow-hidden mb-16">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C5A880 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C5A880]/20 border border-[#C5A880]/40 text-[#C5A880] text-xs font-bold">
            <BookOpen className="size-4 text-[#C5A880]" />
            <span>{t('المعرفة والأنظمة', 'Insights & Knowledge')}</span>
          </div>

          <h1 className="font-amiri text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {t('إضاءات قانونية وتحليلات نظامية', 'Legal Insights & Articles')}
          </h1>

          <div className="flex items-center justify-center gap-4 py-1">
            <div className="h-[1px] w-16 bg-[#C5A880]/60" />
            <Scale className="size-5 text-[#C5A880]" strokeWidth={1.5} />
            <div className="h-[1px] w-16 bg-[#C5A880]/60" />
          </div>

          <p className="font-tajawal text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            {t('مقالات وتحليلات لأحدث الأنظمة واللوائح الصادرة بالمملكة العربية السعودية', 'Analysis of latest Saudi regulations and legal practices')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {DEMO_ARTICLES.map((article) => (
          <Card key={article.id} className="p-7 bg-white border border-[#EADFCF] rounded-2xl space-y-4 flex flex-col justify-between group hover:shadow-xl transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-medium">
                <Badge className="bg-[#FAF5EB] text-[#C5A880] border border-[#E8D9C3] font-bold text-xs">{article.category}</Badge>
                <span className="font-mono text-slate-400">{article.publishedAt}</span>
              </div>
              <h3 className="font-amiri text-xl font-bold text-[#0F172A] group-hover:text-[#C5A880] transition-colors leading-snug">{article.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-medium">{article.excerpt}</p>
            </div>

            <div className="pt-4 border-t border-[#F0E6D8] flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500">{article.author}</span>
              <Link to={`/insights/${article.slug}`} className="text-[#0F172A] hover:text-[#C5A880] flex items-center gap-1.5 transition-colors">
                <span>{t('اقرأ المقال', 'Read')}</span>
                <ArrowLeft className={cn('size-3.5 text-[#C5A880]', !isRTL && 'rotate-180')} />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
