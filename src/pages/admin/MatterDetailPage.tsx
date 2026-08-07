import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Briefcase, Calendar, FileText, CheckSquare, Scale, Clock, Lock } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { store } from '../../lib/store'
import { Matter, Doc, Task } from '../../types'
import { Card } from '../../components/ui/card'
import { StatusBadge } from '../../components/ui/status-badge'
import { PageHeader } from '../../components/ui/page-header'
import { Tabs } from '../../components/ui/tabs'
import { useSEO } from '../../lib/seo'
import { ActivityTrail } from '../../components/shared/ActivityTrail'

export default function MatterDetailPage() {
  const { id } = useParams()
  const { t } = useT()

  const matter: Matter | undefined = store.getMatter(id || '')
  useSEO({ title: matter ? `ملف القضية | ${matter.ref}` : 'ملف القضية' })

  if (!matter) {
    return <div className="p-8 text-ink-muted">{t('الملف غير موجود', 'Matter not found')}</div>
  }

  const client = store.getClient(matter.clientId)
  const docs = store.getDocuments().filter((d: Doc) => d.matterId === matter.id)
  const tasks = store.getTasks().filter((t: Task) => t.entityId === matter.id)

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-2 text-xs text-ink-muted">
        <Link to="/admin/matters" className="hover:text-navy">{t('القضايا', 'Matters')}</Link>
        <span>/</span>
        <span className="font-mono">{matter.ref}</span>
      </div>

      <PageHeader
        title={matter.title}
        description={`المرجع: ${matter.ref} • الجهة/المحكمة: ${matter.court || 'غير محدد'}`}
        action={<StatusBadge status={matter.status} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Details & Tabs */}
        <div className="lg:col-span-8 space-y-6">
          
          <Card id="tour-matter-summary" className="p-6 bg-white border-border space-y-4">
            <h3 className="font-bold text-ink text-base border-b border-border pb-3">{t('تفاصيل الموضوع والملخص', 'Summary & Description')}</h3>
            <p className="text-sm text-ink-muted leading-relaxed">{matter.description || t('لا يوجد وصف إضافي مكتوب للموضوع.', 'No description')}</p>

            {matter.importantDates && matter.importantDates.length > 0 && (
              <div className="pt-4 border-t border-border space-y-2">
                <span className="font-semibold text-xs text-navy block">{t('المواعيد والجلسات الهامة:', 'Important Dates & Hearings:')}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {matter.importantDates.map((d, i) => (
                    <div key={i} className="p-3 rounded-lg bg-surface border border-border flex justify-between">
                      <span className="text-ink-muted">{d.label}</span>
                      <span className="font-mono font-bold text-navy">{d.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <div id="tour-matter-tabs">
            <Tabs
            tabs={[
              {
                id: 'tasks',
                label: `المهام (${tasks.length})`,
                content: (
                  <div className="space-y-3 pt-4">
                    {tasks.map((t: Task) => (
                      <Card key={t.id} className="p-3.5 bg-white border-border flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <CheckSquare className="size-4 text-navy" />
                          <span className="font-medium text-ink">{t.title}</span>
                        </div>
                        <StatusBadge status={t.status} />
                      </Card>
                    ))}
                  </div>
                )
              },
              {
                id: 'docs',
                label: `المستندات والمعروضات (${docs.length})`,
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

        </div>

        {/* Right Panel: Client & Assigned Lawyer */}
        <div className="lg:col-span-4 space-y-6">
          <Card id="tour-matter-assignees" className="p-6 bg-surface border-border space-y-4 text-xs">
            <h3 className="font-bold text-ink text-sm border-b border-border pb-2">{t('بيانات العميل والمحامي', 'Client & Counsel')}</h3>
            <div>
              <span className="text-ink-muted block">{t('العميل المرتبط:', 'Client:')}</span>
              <Link to={`/admin/clients/${client?.id}`} className="font-bold text-navy hover:underline">
                {client?.name || 'غير معروف'}
              </Link>
            </div>
            <div>
              <span className="text-ink-muted block">{t('المحامي المسؤول:', 'Assigned Attorney:')}</span>
              <span className="font-semibold text-ink">{matter.assignedLawyer}</span>
            </div>
          </Card>
        </div>

      </div>

      <ActivityTrail entityType="matters" entityId={matter.id} />
    </div>
  )
}
