import React from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { BRAND } from '../../config/brand'
import { Card } from '../../components/ui/card'
import { buttonVariants } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { cn } from '../../lib/utils'
import { useSEO } from '../../lib/seo'

export default function LawyerPage() {
  const { t } = useT()
  useSEO({ title: `${BRAND.lawyerNameAr} | السيرة الذاتية والخبرات` })

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-12">
      <Card className="p-8 bg-white border-border flex flex-col md:flex-row items-center gap-8">
        <div className="size-32 rounded-3xl bg-navy text-accent flex items-center justify-center text-4xl font-bold font-mono shrink-0 shadow-lg">
          {BRAND.lawyerNameAr.charAt(0)}
        </div>
        <div className="space-y-3 text-center md:text-start">
          <Badge variant="outline" className="border-accent/40 text-accent font-mono text-xs">{BRAND.licenseNumber}</Badge>
          <h1 className="text-3xl font-bold text-ink">{BRAND.lawyerNameAr}</h1>
          <p className="text-sm font-medium text-navy">{t('المحامي والمستشار القانوني - مؤسس المكتب', 'Principal Attorney & Legal Consultant')}</p>
          <p className="text-xs text-ink-muted leading-relaxed max-w-xl">
            {t('خبير في الأنظمة السعودية التجارية، تأسيس الشركات، وحوكمة الأعمال بخبرة تتجاوز 12 عامًا في الترافع وصياغة العقود الكبرى.', 'Over 12 years of experience in Saudi commercial law & corporate advisory.')}
          </p>
          <div className="pt-2">
            <Link to="/book" className={cn(buttonVariants({ size: 'md' }), 'bg-navy text-white font-bold')}>
              <CalendarCheck className="size-4 me-2" />
              {t('احجز موعد مع المحامي', 'Book Consultation')}
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
