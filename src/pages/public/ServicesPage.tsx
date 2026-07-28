import React from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, ArrowLeft } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { DEMO_SERVICES } from '../../data/demo'
import { Card } from '../../components/ui/card'
import { buttonVariants } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { cn } from '../../lib/utils'
import { useSEO } from '../../lib/seo'

export default function ServicesPage() {
  const { t, isRTL } = useT()
  useSEO({ title: 'التخصصات والخدمات القانونية | ' + t('مكتب المحاماة', 'Law Firm') })

  return (
    <div className="space-y-16 py-16 bg-[#f6f8fa] font-tajawal min-h-[85vh]">
      <div className="text-center max-w-3xl mx-auto space-y-4 px-4">
        <Badge className="font-reem bg-[#8EB1D1] text-[#1C2B48] font-bold px-4 py-1.5 text-xs shadow-sm border-none">
          {t('التخصصات والخدمات', 'Practice Areas')}
        </Badge>
        <h1 className="font-amiri text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1C2B48] leading-tight">
          {t('حلول قانونية متكاملة مصممة لنشاطك وحمايتك', 'Comprehensive Legal Solutions')}
        </h1>
        <p className="font-tajawal text-[#527094] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          {t('نغطي كافة القطاعات والأنظمة السعودية بخبرة متخصصة ودقة متناهية تحفظ سرّيتك ومصالحك.', 'Covering Saudi legal sectors with deep expertise.')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 sm:px-6">
        {DEMO_SERVICES.map((s) => (
          <Card key={s.id} className="p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300 bg-white border border-[#C4D8E5] rounded-3xl group">
            <div className="space-y-5">
              <div className="size-14 rounded-2xl bg-[#E8ECEF] text-[#1C2B48] flex items-center justify-center group-hover:bg-[#1C2B48] group-hover:text-white transition-colors duration-300">
                <Briefcase className="size-7" />
              </div>
              <h3 className="font-amiri text-2xl font-bold text-[#1C2B48] group-hover:text-[#8EB1D1] transition-colors">{t(s.titleAr, s.titleEn)}</h3>
              <p className="font-tajawal text-sm text-[#527094] line-clamp-3 leading-relaxed">{t(s.shortAr, s.shortEn || s.shortAr)}</p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#C4D8E5]/70 flex items-center justify-between font-tajawal">
              <Link to={`/services/${s.slug}`} className="text-xs font-bold text-[#1C2B48] hover:text-[#8EB1D1] flex items-center gap-1.5">
                <span>{t('تفاصيل التخصص', 'Read Details')}</span>
                <ArrowLeft className={cn('size-3.5', !isRTL && 'rotate-180')} />
              </Link>
              <Link to={`/book?service=${s.id}`} className={cn(buttonVariants({ variant: 'accent', size: 'sm' }), 'rounded-full px-5')}>
                {t('احجز موعد', 'Book')}
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
