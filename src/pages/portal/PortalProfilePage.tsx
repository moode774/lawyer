import React from 'react'
import { User, Building, Phone, Mail, Lock } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { store } from '../../lib/store'
import { Card } from '../../components/ui/card'
import { PageHeader } from '../../components/ui/page-header'
import { useSEO } from '../../lib/seo'

export default function PortalProfilePage() {
  const { t } = useT()
  useSEO({ title: 'ملف الحساب والبيانات | بوابة العميل' })

  const client = store.getClient('c_1')

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t('بيانات الحساب والمنشأة', 'Client Profile')}
        description={t('تفاصيل البيانات الشخصية والمنشأة المسجلة بالنظام', 'Company & identity details')}
      />

      <Card className="p-6 bg-white border-border max-w-xl mx-auto space-y-4 text-xs sm:text-sm">
        <div className="flex justify-between border-b border-border pb-2">
          <span className="text-ink-muted">{t('الاسم / المنشأة:', 'Name:')}</span>
          <span className="font-bold text-ink">{client?.name}</span>
        </div>
        <div className="flex justify-between border-b border-border pb-2">
          <span className="text-ink-muted">{t('رقم المرجع:', 'Client Ref:')}</span>
          <span className="font-mono font-semibold text-navy">{client?.ref}</span>
        </div>
        <div className="flex justify-between border-b border-border pb-2">
          <span className="text-ink-muted">{t('رقم الجوال:', 'Phone:')}</span>
          <span className="font-mono text-ink" dir="ltr">{client?.phone}</span>
        </div>
        <div className="flex justify-between border-b border-border pb-2">
          <span className="text-ink-muted">{t('البريد الإلكتروني:', 'Email:')}</span>
          <span className="font-mono text-ink" dir="ltr">{client?.email}</span>
        </div>
      </Card>
    </div>
  )
}
