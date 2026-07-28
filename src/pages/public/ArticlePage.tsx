import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, User } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { DEMO_ARTICLES } from '../../data/demo'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { cn } from '../../lib/utils'
import { useSEO } from '../../lib/seo'

export default function ArticlePage() {
  const { slug } = useParams()
  const { t, isRTL } = useT()

  const article = DEMO_ARTICLES.find((a) => a.slug === slug) || DEMO_ARTICLES[0]
  useSEO({ title: `${article.title} | إضاءات قانونية` })

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <Link to="/insights" className="text-xs font-bold text-navy hover:underline flex items-center gap-1">
        <ArrowLeft className={cn('size-3.5', isRTL && 'rotate-180')} />
        <span>{t('العودة للمقالات', 'Back to Insights')}</span>
      </Link>

      <div className="space-y-4">
        <Badge variant="secondary">{article.category}</Badge>
        <h1 className="text-3xl font-bold text-ink leading-tight">{article.title}</h1>
        <div className="flex items-center gap-4 text-xs text-ink-muted border-b border-border pb-4 font-mono">
          <span>{article.author}</span>
          <span>•</span>
          <span>{article.publishedAt}</span>
        </div>
      </div>

      <Card className="p-8 bg-white border-border prose prose-sm max-w-none text-ink leading-relaxed space-y-4 whitespace-pre-line">
        {article.content}
      </Card>
    </div>
  )
}
