import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Search, ExternalLink } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { listLeads } from '../../lib/store'
import { Lead } from '../../types'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { StatusBadge } from '../../components/ui/status-badge'
import { PageHeader } from '../../components/ui/page-header'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table'
import { useSEO } from '../../lib/seo'

export default function LeadsPage() {
  const { t } = useT()
  useSEO({ title: 'قائمة العملاء المحتملين | ' + t('مكتب المحاماة', 'Law Firm') })

  const { data: leads = [] } = useQuery<Lead[]>({ queryKey: ['leads'], queryFn: listLeads })
  const [search, setSearch] = useState('')

  const filtered = leads.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.ref.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search) ||
    (l.email && l.email.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t('سجل العملاء المحتملين والطلبات', 'Leads Registry')}
        description={t('جميع طلبات الاستشارة والاستفسارات مع كامل تفاصيل مصدر التسويق والحالة', 'All inquiries & marketing attribution')}
        action={
          <Link to="/admin/pipeline">
            <Button size="sm" className="bg-navy text-white hover:bg-navy-light gap-2">
              <span>{t('عرض خط الأنابيب Kanban', 'Kanban Board')}</span>
            </Button>
          </Link>
        }
      />

      <Card className="p-4 bg-white border-border">
        <div className="relative max-w-md">
          <Search className="absolute start-3 top-2.5 size-4 text-ink-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('بحث بالاسم، الرقم المرجعي، الجوال...', 'Search...')}
            className="ps-9"
          />
        </div>
      </Card>

      <Card className="bg-white border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('المرجع والاسم', 'Ref & Name')}</TableHead>
              <TableHead>{t('التخصص والقناة', 'Service & Channel')}</TableHead>
              <TableHead>{t('معلومات التواصل', 'Contact Info')}</TableHead>
              <TableHead>{t('المصدر التسويقي', 'UTM Source')}</TableHead>
              <TableHead>{t('الحالة', 'Status')}</TableHead>
              <TableHead>{t('التاريخ', 'Date')}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div>
                    <Link to={`/admin/leads/${lead.id}`} className="font-bold text-ink hover:text-navy text-sm">
                      {lead.name}
                    </Link>
                    <div className="text-xs text-ink-muted font-mono">{lead.ref}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs space-y-0.5">
                    <div className="font-medium text-navy">{lead.category}</div>
                    <div className="text-ink-muted">{lead.consultationType || 'طلب عام'}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs space-y-0.5" dir="ltr">
                    <div className="font-mono text-ink font-semibold">{lead.phone}</div>
                    <div className="text-ink-muted">{lead.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs font-mono">
                    {lead.source}
                  </Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={lead.status} />
                </TableCell>
                <TableCell className="text-xs text-ink-muted font-mono">
                  {lead.createdAt}
                </TableCell>
                <TableCell>
                  <Link to={`/admin/leads/${lead.id}`}>
                    <Button variant="ghost" size="sm" className="size-8 p-0">
                      <ExternalLink className="size-4 text-navy" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
