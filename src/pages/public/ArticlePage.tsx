import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, User, Scale, BookOpen } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { DEMO_ARTICLES } from '../../data/demo'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { cn } from '../../lib/utils'
import { useSEO, breadcrumbLd, SITE_URL } from '../../lib/seo'

export default function ArticlePage() {
  const { slug } = useParams()
  const { t, isRTL } = useT()

  const article = DEMO_ARTICLES.find((a) => a.slug === slug) || DEMO_ARTICLES[0]
  useSEO({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    path: `/insights/${article.slug}`,
    type: 'article',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.seoDescription || article.excerpt,
        datePublished: article.publishedAt,
        dateModified: article.publishedAt,
        articleSection: article.category,
        inLanguage: 'ar',
        mainEntityOfPage: `${SITE_URL}/insights/${article.slug}`,
        author: { '@type': 'Person', name: article.author },
        publisher: { '@id': `${SITE_URL}/#legalservice` },
      },
      breadcrumbLd([
        { name: 'الرئيسية', path: '/' },
        { name: 'المقالات القانونية', path: '/insights' },
        { name: article.title, path: `/insights/${article.slug}` },
      ]),
    ],
  })

  return (
    <div className="bg-[#FAF9F5] font-tajawal min-h-screen pb-24 text-[#0F172A] antialiased">
      {/* LUXURY HERO HEADER */}
      <section className="relative pt-16 pb-20 bg-[#0B132B] text-white border-b border-[#C5A880]/30 overflow-hidden mb-12">
        <div className="max-w-4xl mx-auto px-4 space-y-6 relative z-10">
          <Link to="/insights" className="inline-flex items-center gap-2 text-xs font-bold text-[#C5A880] hover:underline">
            <ArrowLeft className={cn('size-3.5', !isRTL && 'rotate-180')} />
            <span>{t('العودة للمقالات', 'Back to Insights')}</span>
          </Link>

          <div className="space-y-4">
            <Badge className="bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/40 font-bold text-xs">{article.category}</Badge>
            <h1 className="font-amiri text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">{article.title}</h1>
            
            <div className="flex items-center gap-4 text-xs text-slate-300 font-mono pt-2">
              <span className="flex items-center gap-1.5"><User className="size-3.5 text-[#C5A880]" /> {article.author}</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><Calendar className="size-3.5 text-[#C5A880]" /> {article.publishedAt}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Card className="p-8 sm:p-12 bg-white border border-[#EADFCF] rounded-2xl text-base text-slate-700 leading-loose space-y-6 shadow-sm whitespace-pre-line">
          {article.content}
        </Card>
      </div>
    </div>
  )
}
