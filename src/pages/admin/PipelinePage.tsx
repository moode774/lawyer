import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  Users,
  Phone,
  Mail,
  Calendar,
  MoreVertical,
  ArrowRightLeft,
  CheckCircle2,
  DollarSign
} from 'lucide-react'
import { useT } from '../../lib/i18n'
import { store } from '../../lib/store'
import { Lead } from '../../types'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { StatusBadge } from '../../components/ui/status-badge'
import { PageHeader } from '../../components/ui/page-header'
import { cn } from '../../lib/utils'
import { useSEO } from '../../lib/seo'

const PIPELINE_COLUMNS: { id: Lead['status']; titleAr: string; titleEn: string; color: string }[] = [
  { id: 'new', titleAr: 'طلب جديد', titleEn: 'New Lead', color: 'border-blue-500' },
  { id: 'contacted', titleAr: 'تم التواصل', titleEn: 'Contacted', color: 'border-amber-500' },
  { id: 'qualified', titleAr: 'مؤهل استشاريًا', titleEn: 'Qualified', color: 'border-indigo-500' },
  { id: 'consultation_booked', titleAr: 'استشارة مجدولة', titleEn: 'Booked', color: 'border-purple-500' },
  { id: 'consultation_completed', titleAr: 'استشارة مكتملة', titleEn: 'Completed', color: 'border-emerald-500' },
  { id: 'proposal_sent', titleAr: 'عرض قانوني', titleEn: 'Proposal Sent', color: 'border-teal-500' },
  { id: 'won', titleAr: 'عميل مكتسب (فوز)', titleEn: 'Won', color: 'border-emerald-600 bg-emerald-50/50' },
  { id: 'lost', titleAr: 'غير مستمر', titleEn: 'Lost', color: 'border-slate-400 opacity-60' }
]

export default function PipelinePage() {
  const { t } = useT()
  useSEO({ title: 'خط أنبوب العملاء المحتملين CRM | ' + t('مكتب المحاماة', 'Law Firm') })

  const [leads, setLeads] = useState<Lead[]>(store.getLeads())
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm)
    const matchesCategory = selectedCategory === 'all' || l.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleStatusChange = (leadId: string, newStatus: Lead['status']) => {
    const updated = store.updateLeadStatus(leadId, newStatus)
    if (updated) {
      setLeads([...store.getLeads()])
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t('إدارة خط أنبوب العملاء CRM', 'Lead CRM Pipeline')}
        description={t('متابعة مراحل تحويل العملاء من طلب الاستفسار المبدئي إلى اكتساب العميل', 'Track lead stages from inquiry to acquisition')}
        action={
          <Link to="/admin/leads">
            <Button size="sm" className="bg-navy text-white hover:bg-navy-light gap-2">
              <Plus className="size-4" />
              <span>{t('قائمة الجدول التفصيلية', 'List View')}</span>
            </Button>
          </Link>
        }
      />

      {/* Filter & Search Bar */}
      <Card className="p-4 bg-white border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute start-3 top-2.5 size-4 text-ink-muted" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('بحث بالاسم أو المرجع أو رقم الجوال...', 'Search by name, ref, phone...')}
            className="ps-9"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={[
              { value: 'all', label: t('جميع التخصصات', 'All Categories') },
              { value: 'استشارات الشركات', label: 'استشارات الشركات' },
              { value: 'القضايا التجارية', label: 'القضايا التجارية' },
              { value: 'الصياغة والعقود', label: 'الصياغة والعقود' },
              { value: 'قضايا العمل والعمال', label: 'قضايا العمل والعمال' }
            ]}
          />
        </div>
      </Card>

      {/* KANBAN BOARD BOARD GRID */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-thin">
        {PIPELINE_COLUMNS.map((col) => {
          const colLeads = filteredLeads.filter((l) => l.status === col.id)
          const totalVal = colLeads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0)

          return (
            <div
              key={col.id}
              className="w-72 sm:w-80 shrink-0 bg-surface rounded-2xl p-4 border border-border/70 flex flex-col max-h-[750px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                <div className="flex items-center gap-2">
                  <div className={cn('size-3 rounded-full border-2', col.color)} />
                  <h3 className="font-bold text-ink text-sm">{t(col.titleAr, col.titleEn)}</h3>
                  <Badge variant="secondary" className="font-mono text-xs">{colLeads.length}</Badge>
                </div>

                {totalVal > 0 && (
                  <span className="text-[11px] font-mono text-ink-muted font-semibold">
                    {totalVal.toLocaleString()} SAR
                  </span>
                )}
              </div>

              {/* Column Cards List */}
              <div className="space-y-3 overflow-y-auto flex-1 pe-1">
                {colLeads.map((lead) => (
                  <Card
                    key={lead.id}
                    className="p-4 bg-white shadow-sm hover:shadow-md transition-all border-border space-y-3 group cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/admin/leads/${lead.id}`}
                        className="font-bold text-ink hover:text-navy text-sm leading-snug"
                      >
                        {lead.name}
                      </Link>
                      <span className="font-mono text-[10px] text-ink-muted">{lead.ref}</span>
                    </div>

                    <div className="text-xs text-ink-muted space-y-1">
                      <div className="font-medium text-navy">{lead.category}</div>
                      {lead.company && <div className="text-ink text-[11px] font-semibold">{lead.company}</div>}
                    </div>

                    <div className="pt-2 border-t border-border/50 flex items-center justify-between text-[11px]">
                      <span className="text-ink-muted font-mono" dir="ltr">{lead.phone}</span>
                      
                      {/* Move status select quick dropdown */}
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                        className="text-[10px] rounded border border-border bg-surface px-1.5 py-0.5 text-navy font-semibold focus:outline-none"
                      >
                        {PIPELINE_COLUMNS.map((c) => (
                          <option key={c.id} value={c.id}>{c.titleAr}</option>
                        ))}
                      </select>
                    </div>
                  </Card>
                ))}

                {colLeads.length === 0 && (
                  <div className="h-28 border-2 border-dashed border-border/60 rounded-xl flex items-center justify-center text-xs text-ink-muted">
                    {t('لا يوجد طلبات في هذه المرحلة', 'No leads in stage')}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
