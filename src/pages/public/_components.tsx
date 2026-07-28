import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Building2,
  ChevronDown,
  Gavel,
  Home,
  MessageCircle,
  MessageSquareText,
  Scale,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Article, Service } from '../../types'
import { brand } from '../../config/brand'
import { track } from '../../lib/analytics'
import { useLang } from '../../lib/i18n'
import { cn, formatDate } from '../../lib/utils'
import { Badge } from '../../components/ui/badge'
import { buttonVariants } from '../../components/ui/button'

/** رقم واتساب بصيغة أرقام فقط لروابط wa.me */
export const waHref = `https://wa.me/${brand.whatsappNumber.replace(/\+/g, '')}`

const serviceIcons: Record<string, LucideIcon> = {
  building: Building2,
  scale: Scale,
  users: Users,
  home: Home,
  gavel: Gavel,
  message: MessageSquareText,
}

export function ServiceIcon({ icon, className }: { icon: Service['icon']; className?: string }) {
  const Icon = serviceIcons[icon] ?? Scale
  return <Icon className={className} strokeWidth={1.6} />
}

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  center?: boolean
  className?: string
}

export function SectionHeading({ eyebrow, title, description, center, className }: SectionHeadingProps) {
  return (
    <div className={cn('max-w-2xl', center && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p className={cn('flex items-center gap-2 text-xs font-semibold text-bronze-600', center && 'justify-center')}>
          <span className="size-1.5 rounded-full bg-bronze-500" />
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 font-display text-3xl font-bold leading-snug text-navy-800 sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-8 text-ink-muted">{description}</p>}
    </div>
  )
}

/** شريط تعريفي أعلى الصفحات الداخلية */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="container py-16 sm:py-20">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        {children}
      </div>
    </section>
  )
}

export interface AccordionItem {
  q: string
  a: string
}

/** أكورديون خفيف بدون مكتبات — سهم يدور عند الفتح */
export function Accordion({ items, defaultOpen = 0 }: { items: AccordionItem[]; defaultOpen?: number }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-white shadow-xs">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={i}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-ink">{item.q}</span>
              <ChevronDown
                className={cn('size-4 shrink-0 text-ink-faint transition-transform duration-200', isOpen && 'rotate-180')}
                strokeWidth={1.8}
              />
            </button>
            {isOpen && (
              <div className="animate-fade-in px-5 pb-5">
                <p className="text-sm leading-7 text-ink-muted">{item.a}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function ArticleCard({ article, className }: { article: Article; className?: string }) {
  const { t } = useLang()
  return (
    <Link
      to={`/insights/${article.slug}`}
      className={cn(
        'group flex flex-col rounded-lg border border-border bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Badge tone="navy">{article.category}</Badge>
        <span className="text-xs text-ink-faint">{formatDate(article.publishedAt)}</span>
      </div>
      <h3 className="mt-4 font-display text-lg font-bold leading-snug text-ink transition-colors group-hover:text-navy-600">
        {article.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-7 text-ink-muted">{article.excerpt}</p>
      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-ink-faint">
        <span>{article.readMinutes} {t('دقائق قراءة', 'min read')}</span>
        <span className="flex items-center gap-1 font-semibold text-navy-700">
          {t('اقرأ المقال', 'Read article')}
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.8} />
        </span>
      </div>
    </Link>
  )
}

interface CtaBandProps {
  title?: string
  description?: string
  primaryTo?: string
  primaryLabel?: string
}

/** شريط CTA ختامي موحد */
export function CtaBand({ title, description, primaryTo = '/book', primaryLabel }: CtaBandProps) {
  const { t } = useLang()
  return (
    <section className="bg-navy-800 text-white">
      <div className="container flex flex-col items-center py-20 text-center sm:py-24">
        <h2 className="max-w-2xl font-display text-3xl font-bold leading-snug sm:text-4xl">
          {title ?? t('جاهز لاتخاذ خطوة قانونية واثقة؟', 'Ready to take a confident legal step?')}
        </h2>
        <p className="mt-4 max-w-xl text-base leading-8 text-white/60">
          {description ??
            t(
              'احجز استشارتك الأولى بوضوح تام في التكلفة، أو تواصل معنا مباشرة عبر واتساب وسنرد عليك في أقرب وقت.',
              'Book your first consultation with full cost clarity, or reach us directly on WhatsApp.',
            )}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={primaryTo}
            onClick={() => track('cta_click', { cta: 'cta_band_book' })}
            className={cn(buttonVariants({ size: 'lg' }), 'bg-bronze-500 text-white hover:bg-bronze-600')}
          >
            {primaryLabel ?? t('احجز استشارة', 'Book a consultation')}
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            onClick={() => track('whatsapp_click', { location: 'cta_band' })}
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'border-white/25 text-white hover:bg-white/10')}
          >
            <MessageCircle className="size-4" strokeWidth={1.8} />
            {t('تواصل عبر واتساب', 'Chat on WhatsApp')}
          </a>
        </div>
      </div>
    </section>
  )
}
