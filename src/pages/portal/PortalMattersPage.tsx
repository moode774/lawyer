import React from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, ExternalLink } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { store } from '../../lib/store'
import type { Matter } from '../../types'
import { Card } from '../../components/ui/card'
import { StatusBadge } from '../../components/ui/status-badge'
import { PageHeader } from '../../components/ui/page-header'
import { useSEO } from '../../lib/seo'

export default function PortalMattersPage() {
  const { t } = useT()
  useSEO({ title: 'قضاياي وملفاتي | بوابة العميل' })

  const matters = store.getMatters('c_1')

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t('قضاياك ومعاملاتك القانونية', 'Your Legal Matters')}
        description={t('متابعة مستجدات المرافعات والعقود الخاصة بحسابك فقط', 'Matters associated with your client account')}
      />

      <div className="space-y-4">
        {matters.map((m: Matter) => (
          <Card key={m.id} className="p-5 bg-white border-border flex items-center justify-between">
            <div>
              <Link to={`/portal/matters/${m.id}`} className="font-bold text-ink hover:text-navy text-base">
                {m.title}
              </Link>
              <div className="text-xs text-ink-muted font-mono">{m.ref} • {m.category}</div>
            </div>
            <StatusBadge status={m.status} />
          </Card>
        ))}
      </div>
    </div>
  )
}
