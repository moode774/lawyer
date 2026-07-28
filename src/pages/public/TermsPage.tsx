import React from 'react'
import { FileText } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { BRAND } from '../../config/brand'
import { Card } from '../../components/ui/card'
import { useSEO } from '../../lib/seo'

export default function TermsPage() {
  const { t } = useT()
  useSEO({ title: 'الشروط والأحكام | ' + BRAND.nameAr })

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <div className="space-y-3 border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-ink">{t('الشروط والأحكام لاستخدام المنصة', 'Terms & Conditions')}</h1>
        <p className="text-xs text-ink-muted">{t('تطبيقًا للأنظمة السعودية الصادرة عن وزارة العدل وهيئة المحامين', 'Regulated by Saudi Ministry of Justice & Bar Association')}</p>
      </div>

      <Card className="p-8 bg-white border-border text-xs text-ink-muted leading-relaxed space-y-6">
        <section className="space-y-2">
          <h3 className="font-bold text-ink text-sm">{t('1. نطاق الاستشارات والتنبيه النظامي', '1. Scope & Legal Disclaimer')}</h3>
          <p>{t('المعلومات والاستشارات المقدمة تعتمد على البيانات الواردة من المستفيد، ولا تشكل أي ضمان للنتائج القضائية المستقبلية.', 'Consultations do not guarantee future court trial outcomes.')}</p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-ink text-sm">{t('2. حجز ومواعيد الاستشارات', '2. Consultations & Cancellation')}</h3>
          <p>{t('يتم تأكيد الموعد عند استكمال البيانات، ويمكن إعادة الجدولة قبل 12 ساعة من موعد الانعقاد المحدد.', 'Rescheduling allowed up to 12 hours prior to start time.')}</p>
        </section>
      </Card>
    </div>
  )
}
