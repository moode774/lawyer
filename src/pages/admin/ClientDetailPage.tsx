import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Briefcase, FileText, Calendar, Plus, Phone, Mail, MapPin } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { store } from '../../lib/store'
import { Client, Matter, Doc } from '../../types'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/ui/status-badge'
import { PageHeader } from '../../components/ui/page-header'
import { Tabs } from '../../components/ui/tabs'
import { useSEO } from '../../lib/seo'

export default function ClientDetailPage() {
  const { id } = useParams()
  const { t } = useT()

  const client: Client | undefined = store.getClient(id || '')
  useSEO({ title: client ? `ملف العميل | ${client.name}` : 'ملف العميل' })

  if (!client) {
    return <div className="p-8 text-ink-muted">{t('العميل غير موجود', 'Client not found')}</div>
  }

  const matters: Matter[] = store.getMatters(client.id)
  const docs = store.getDocuments().filter((d: Doc) => d.clientId === client.id)

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-2 text-xs text-ink-muted">
        <Link to="/admin/clients" className="hover:text-navy">{t('العملاء', 'Clients')}</Link>
        <span>/</span>
        <span className="font-mono">{client.ref}</span>
      </div>

      <PageHeader
        title={client.name}
        description={`مرجع العميل: ${client.ref} • تاريخ الانضمام: ${client.createdAt}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content (Matters & Documents Tabs) */}
        <div className="lg:col-span-8 space-y-6">
          <Tabs
            tabs={[
              {
                id: 'matters',
                label: `القضايا والملفات (${matters.length})`,
                content: (
                  <div className="space-y-4 pt-4">
                    {matters.map((m) => (
                      <Card key={m.id} className="p-4 bg-white border-border flex items-center justify-between">
                        <div>
                          <Link to={`/admin/matters/${m.id}`} className="font-bold text-ink hover:text-navy text-sm">
                            {m.title}
                          </Link>
                          <div className="text-xs text-ink-muted font-mono">{m.ref} • {m.category}</div>
                        </div>
                        <StatusBadge status={m.status} />
                      </Card>
                    ))}

                    {matters.length === 0 && (
                      <div className="p-8 text-center text-xs text-ink-muted">{t('لا توجد قضايا مرتبطة حاليًا', 'No active legal matters')}</div>
                    )}
                  </div>
                )
              },
              {
                id: 'docs',
                label: `المستندات والعقود (${docs.length})`,
                content: (
                  <div className="space-y-3 pt-4">
                    {docs.map((d: Doc) => (
                      <Card key={d.id} className="p-3 bg-white border-border flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="size-4 text-navy" />
                          <span className="font-medium text-ink">{d.name}</span>
                        </div>
                        <span className="font-mono text-ink-muted">{d.size}</span>
                      </Card>
                    ))}
                  </div>
                )
              }
            ]}
          />
        </div>

        {/* Right Info Box */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 bg-surface border-border space-y-4 text-xs">
            <h3 className="font-bold text-ink text-sm border-b border-border pb-2">{t('بيانات الاتصال', 'Contact Information')}</h3>
            <div>
              <span className="text-ink-muted block">{t('الجوال:', 'Phone:')}</span>
              <span className="font-mono font-semibold text-navy" dir="ltr">{client.phone}</span>
            </div>
            <div>
              <span className="text-ink-muted block">{t('البريد الإلكتروني:', 'Email:')}</span>
              <span className="font-mono text-ink" dir="ltr">{client.email}</span>
            </div>
            <div>
              <span className="text-ink-muted block">{t('العنوان / المقر:', 'Address:')}</span>
              <span className="text-ink">{client.address || 'الرياض - المملكة العربية السعودية'}</span>
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}
