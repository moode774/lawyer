import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Phone,
  Mail,
  Calendar,
  Building,
  UserCheck,
  Clock,
  Plus,
  MessageSquare,
  FileText,
  CheckCircle2,
  Share2
} from 'lucide-react'
import { useT } from '../../lib/i18n'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listLeads, updateLeadNotes } from '../../lib/store'
import { convertLeadToClient } from '../../lib/records'
import { Lead, Activity } from '../../types'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { StatusBadge } from '../../components/ui/status-badge'
import { PageHeader } from '../../components/ui/page-header'
import { Textarea } from '../../components/ui/textarea'
import { useSEO } from '../../lib/seo'
import { ActivityTrail } from '../../components/shared/ActivityTrail'

export default function LeadDetailPage() {
  const { id } = useParams()
  const { t, isRTL } = useT()
  const navigate = useNavigate()

  const queryClient = useQueryClient()
  const [newNote, setNewNote] = useState('')
  const [actionError, setActionError] = useState('')

  const { data: leads = [], isLoading } = useQuery<Lead[]>({ queryKey: ['leads'], queryFn: listLeads })
  const lead = leads.find((item) => item.id === id)

  // يُستدعى دائمًا قبل أي خروج مبكر — الخطافات لا تُستدعى شرطيًا.
  useSEO({ title: lead ? `ملف الطلب ${lead.ref} | ${lead.name}` : 'ملف غير موجود', noindex: true })

  // التحويل يكتب في قاعدة البيانات: عميل جديد + تحديث حالة الطلب إلى "مكتسب".
  const convert = useMutation({
    mutationFn: (leadId: string) => convertLeadToClient(leadId),
    onSuccess: (client) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      navigate(`/admin/clients/${client.id}`)
    },
    onError: (cause) => setActionError(cause instanceof Error ? cause.message : 'تعذر تحويل الطلب'),
  })

  const saveNote = useMutation({
    mutationFn: ({ leadId, notes }: { leadId: string; notes: string }) => updateLeadNotes(leadId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      setNewNote('')
    },
    onError: (cause) => setActionError(cause instanceof Error ? cause.message : 'تعذر حفظ الملاحظة'),
  })

  if (isLoading) {
    return <div className="p-12 text-center text-ink-muted">{t('جارٍ تحميل الطلب...', 'Loading lead...')}</div>
  }

  if (!lead) {
    return (
      <div className="p-12 text-center text-ink-muted">
        <p>{t('لم يتم العثور على طلب العميل المحتمل', 'Lead record not found')}</p>
        <Link to="/admin/leads" className="text-navy font-semibold underline mt-2 block">{t('العودة للقائمة', 'Back to leads')}</Link>
      </div>
    )
  }

  const handleConvert = () => {
    setActionError('')
    convert.mutate(lead.id)
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return
    setActionError('')
    const merged = lead.notes ? `${lead.notes}\n\n${newNote.trim()}` : newNote.trim()
    saveNote.mutate({ leadId: lead.id, notes: merged })
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-2 text-xs text-ink-muted">
        <Link to="/admin/leads" className="hover:text-navy">{t('العملاء المحتملين', 'Leads')}</Link>
        <span>/</span>
        <span className="font-mono">{lead.ref}</span>
      </div>

      <PageHeader
        title={lead.name}
        description={`المرجع: ${lead.ref} • المصدر: ${lead.source}`}
        action={
          <div className="flex items-center gap-3">
            <Button id="tour-lead-convert" onClick={handleConvert} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2">
              <UserCheck className="size-4" />
              <span>{t('تحويل إلى عميل مكتسب', 'Convert to Client')}</span>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Lead Info */}
        <div className="lg:col-span-8 space-y-6">
          
          <Card id="tour-lead-overview" className="p-6 bg-white border-border space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="font-bold text-ink text-base">{t('تفاصيل الطلب والاستشارة', 'Lead Overview')}</h3>
              <StatusBadge status={lead.status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
              <div>
                <span className="text-xs text-ink-muted block">{t('نوع المتقدم:', 'Applicant Type:')}</span>
                <span className="font-medium text-ink">{lead.type === 'company' ? t('شركة / منشأة', 'Company') : t('فرد', 'Individual')}</span>
              </div>
              <div>
                <span className="text-xs text-ink-muted block">{t('التخصص القانوني:', 'Category:')}</span>
                <span className="font-semibold text-navy">{lead.category}</span>
              </div>
              <div>
                <span className="text-xs text-ink-muted block">{t('رقم الجوال:', 'Phone:')}</span>
                <span className="font-mono text-ink font-semibold" dir="ltr">{lead.phone}</span>
              </div>
              <div>
                <span className="text-xs text-ink-muted block">{t('البريد الإلكتروني:', 'Email:')}</span>
                <span className="font-mono text-ink" dir="ltr">{lead.email}</span>
              </div>
              <div>
                <span className="text-xs text-ink-muted block">{t('طريقة الانعقاد:', 'Consultation Type:')}</span>
                <span className="font-medium text-ink">{lead.consultationType || 'غير محدد'}</span>
              </div>
              <div>
                <span className="text-xs text-ink-muted block">{t('تاريخ الإنشاء:', 'Created At:')}</span>
                <span className="font-mono text-ink">{lead.createdAt}</span>
              </div>
            </div>

            {lead.notes && (
              <div className="p-4 rounded-xl bg-surface border border-border/60 text-xs text-ink space-y-1">
                <span className="font-semibold text-navy block">{t('شرح الطلب / الملاحظات:', 'Request Notes:')}</span>
                <p className="leading-relaxed text-ink-muted">{lead.notes}</p>
              </div>
            )}
          </Card>

          {/* Timeline & Notes */}
          <Card id="tour-lead-timeline" className="p-6 bg-white border-border space-y-6">
            <h3 className="font-bold text-ink text-base border-b border-border pb-3">
              {t('سجل الملاحظات والأنشطة', 'Activity Timeline & Notes')}
            </h3>

            {actionError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-medium">
                {actionError}
              </div>
            )}

            <div className="space-y-3">
              <Textarea
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={t('أضف ملاحظة جديدة حول الاتصال أو التقييم...', 'Add internal note...')}
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={handleAddNote}
                  disabled={saveNote.isPending || !newNote.trim()}
                  className="bg-navy text-white"
                >
                  {saveNote.isPending ? t('جارٍ الحفظ...', 'Saving...') : t('إضافة الملاحظة', 'Add Note')}
                </Button>
              </div>
            </div>
          </Card>

        </div>

        {/* Right Panel: UTM & Marketing Attribution */}
        <div className="lg:col-span-4 space-y-6">
          <Card id="tour-lead-utm" className="p-6 bg-surface border-border space-y-6">
            <h3 className="font-bold text-ink text-base border-b border-border pb-3">
              {t('إسناد التسويق UTM Attribution', 'Marketing Attribution')}
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between">
                <span className="text-ink-muted">utm_source:</span>
                <span className="font-mono font-bold text-navy">{lead.utm?.source || 'direct'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">utm_medium:</span>
                <span className="font-mono text-ink">{lead.utm?.medium || 'cpc'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">utm_campaign:</span>
                <span className="font-mono text-ink">{lead.utm?.campaign || 'saudi_legal_2026'}</span>
              </div>
            </div>
          </Card>
        </div>

      </div>

      <ActivityTrail entityType="leads" entityId={lead.id} />
    </div>
  )
}
