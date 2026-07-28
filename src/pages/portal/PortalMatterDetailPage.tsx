import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Calendar, CheckSquare } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { store } from '../../lib/store'
import type { Doc } from '../../types'
import { Card } from '../../components/ui/card'
import { StatusBadge } from '../../components/ui/status-badge'
import { PageHeader } from '../../components/ui/page-header'
import { useSEO } from '../../lib/seo'

export default function PortalMatterDetailPage() {
  const { id } = useParams()
  const { t, isRTL } = useT()

  const matter = store.getMatter(id || '')
  useSEO({ title: matter ? `مستجدات القضية | ${matter.ref}` : 'مستجدات القضية' })

  if (!matter) {
    return <div className="p-8 text-ink-muted">{t('الملف غير موجود', 'Matter not found')}</div>
  }

  const docs = store.getDocuments().filter((d: Doc) => d.matterId === matter.id && d.visibility === 'client')

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <Link to="/portal/matters" className="text-xs font-bold text-navy hover:underline flex items-center gap-1">
        <ArrowLeft className={isRTL ? 'rotate-0 size-3.5' : 'rotate-180 size-3.5'} />
        <span>{t('العودة للقضايا', 'Back to Matters')}</span>
      </Link>

      <PageHeader
        title={matter.title}
        description={`المرجع: ${matter.ref} • الجهة المعنية: ${matter.court || 'استشارة وحوكمة'}`}
        action={<StatusBadge status={matter.status} />}
      />

      <Card className="p-6 bg-white border-border space-y-4">
        <h3 className="font-bold text-ink text-base border-b border-border pb-2">{t('الخلاصة ومراحل المتابعة', 'Case Overview')}</h3>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">{matter.description}</p>
      </Card>

      <Card className="p-6 bg-white border-border space-y-4">
        <h3 className="font-bold text-ink text-base border-b border-border pb-2">{t('المستندات المتاحة لك', 'Accessible Client Documents')}</h3>
        <div className="space-y-3">
          {docs.map((d: Doc) => (
            <div key={d.id} className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-navy" />
                <span className="font-semibold text-ink">{d.name}</span>
              </div>
              <span className="font-mono text-ink-muted">{d.size}</span>
            </div>
          ))}
          {docs.length === 0 && (
            <p className="text-xs text-ink-muted text-center py-4">{t('لا توجد مستندات مرفوعة متوفرة حاليًا.', 'No documents available.')}</p>
          )}
        </div>
      </Card>
    </div>
  )
}
