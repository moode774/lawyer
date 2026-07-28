import React from 'react'
import { ShieldCheck, Lock } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { BRAND } from '../../config/brand'
import { Card } from '../../components/ui/card'
import { useSEO } from '../../lib/seo'

export default function PrivacyPage() {
  const { t } = useT()
  useSEO({ title: 'سياسة الخصوصية وحماية البيانات | ' + BRAND.nameAr })

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <div className="space-y-3 border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-ink">{t('سياسة الخصوصية وحماية البيانات', 'Privacy Policy')}</h1>
        <p className="text-xs text-ink-muted">{t('تاريخ التحديث: يناير 2026م - التزامًا بنظام حماية البيانات الشخصية بالمملكة', 'Updated: Jan 2026 - Saudi Personal Data Protection Law (PDPL) Compliant')}</p>
      </div>

      <Card className="p-8 bg-white border-border text-xs text-ink-muted leading-relaxed space-y-6">
        <section className="space-y-2">
          <h3 className="font-bold text-ink text-sm">{t('1. جمع البيانات والغرض منها', '1. Data Collection')}</h3>
          <p>{t('يتم جمع البيانات الشخصية (الاسم، الجوال، البريد) لغرض تقديم الاستشارات وتثبيت المواعيد فقط، مع الالتزام التام بعدم إفشائها لأي طرف ثالث.', 'Personal data collected solely for legal service delivery.')}</p>
        </section>

        <section className="space-y-2">
          <h3 className="font-bold text-ink text-sm">{t('2. السرية المهنية القانونية', '2. Legal Privilege & Confidentiality')}</h3>
          <p>{t('جميع المستندات والمراسلات المدخلة عبر المنصة تتمتع بالحماية المطلقة والسرية المهنية المنصوص عليها بنظام المحاماة في المملكة العربية السعودية.', 'All client communication protected under attorney-client privilege.')}</p>
        </section>
      </Card>
    </div>
  )
}
