import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, BookOpen, Clock } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { DEMO_ARTICLES } from '../../data/demo'
import { Card } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { cn } from '../../lib/utils'
import { useSEO } from '../../lib/seo'

export default function InsightsPage() {
  const { t, isRTL } = useT()
  useSEO({ title: 'المعرفة والإضاءات القانونية | ' + t('مكتب المحاماة', 'Law Firm') })

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 space-y-12">
      <div className="text-center space-y-3">
        <Badge variant="outline" className="border-accent/40 text-accent font-semibold px-3 py-1">
          {t('المعرفة والأنظمة', 'Insights & Knowledge')}
        </Badge>
        <h1 className="text-3xl font-bold text-ink">{t('إضاءات قانونية وتحليلات نظامية', 'Legal Insights & Articles')}</h1>
        <p className="text-ink-muted text-sm sm:text-base">{t('مقالات وتحليلات لأحدث الأنظمة واللوائح الصادرة بالمملكة', 'Analysis of latest Saudi regulations')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {DEMO_ARTICLES.map((article) => (
          <Card key={article.id} className="p-6 bg-white border-border space-y-4 flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-ink-muted">
                <Badge variant="secondary">{article.category}</Badge>
                <span className="font-mono">{article.publishedAt}</span>
              </div>
              <h3 className="text-lg font-bold text-ink group-hover:text-navy transition-colors">{article.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">{article.excerpt}</p>
            </div>

            <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs">
              <span className="text-ink-muted">{article.author}</span>
              <Link to={`/insights/${article.slug}`} className="font-bold text-navy flex items-center gap-1">
                <span>{t('اقرأ المقال', 'Read')}</span>
                <ArrowLeft className={cn('size-3.5', !isRTL && 'rotate-180')} />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
