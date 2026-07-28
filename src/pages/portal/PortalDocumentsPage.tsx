import React from 'react'
import { FileText, Download } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { store } from '../../lib/store'
import type { Doc } from '../../types'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { PageHeader } from '../../components/ui/page-header'
import { useSEO } from '../../lib/seo'

export default function PortalDocumentsPage() {
  const { t } = useT()
  useSEO({ title: 'المستندات والعقود | بوابة العميل' })

  const docs = store.getDocuments().filter((d: Doc) => d.clientId === 'c_1' || d.visibility === 'client')

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t('مستنداتك وعقودك الآمنة', 'Client Documents')}
        description={t('تنزيل واستعراض النسخ المعتمدة الخاصة بحسابك', 'Download approved documents')}
      />

      <div className="space-y-3">
        {docs.map((doc: Doc) => (
          <Card key={doc.id} className="p-4 bg-white border-border flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <FileText className="size-5 text-navy" />
              <div>
                <h4 className="font-bold text-ink">{doc.name}</h4>
                <p className="text-xs text-ink-muted font-mono">{doc.size} • {doc.uploadedAt}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="size-8 p-0">
              <Download className="size-4 text-navy" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
