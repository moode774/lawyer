import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, ExternalLink } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { store } from '../../lib/store'
import { Matter } from '../../types'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { StatusBadge } from '../../components/ui/status-badge'
import { PageHeader } from '../../components/ui/page-header'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table'
import { useSEO } from '../../lib/seo'

export default function MattersPage() {
  const { t } = useT()
  useSEO({ title: 'القضايا والملفات القانونية | ' + t('مكتب المحاماة', 'Law Firm') })

  const matters: Matter[] = store.getMatters()
  const [search, setSearch] = useState('')

  const filtered = matters.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.ref.toLowerCase().includes(search.toLowerCase()) ||
    m.court?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t('سجل القضايا والمعاملات النشطة', 'Legal Matters & Cases')}
        description={t('إدارة ملفات المرافعة والعقود والاستشارات مع المواعيد والمحاكم', 'Manage active court litigation & contract matters')}
        action={
          <Button id="tour-matters-add" size="sm" className="bg-navy text-white hover:bg-navy-light gap-2">
            <Plus className="size-4" />
            <span>{t('إضافة قضية جديدة', 'Add Matter')}</span>
          </Button>
        }
      />

      <Card id="tour-matters-filter" className="p-4 bg-white border-border">
        <div className="relative max-w-md">
          <Search className="absolute start-3 top-2.5 size-4 text-ink-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('بحث باسم القضية، المرجع، المحكمة...', 'Search matters...')}
            className="ps-9"
          />
        </div>
      </Card>

      <Card id="tour-matters-table" className="bg-white border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('الرمز والقضية', 'Ref & Title')}</TableHead>
              <TableHead>{t('التصنيف والمحكمة', 'Category & Authority')}</TableHead>
              <TableHead>{t('المحامي المسؤول', 'Assigned Lawyer')}</TableHead>
              <TableHead>{t('الحالة', 'Status')}</TableHead>
              <TableHead>{t('تاريخ الفتح', 'Opened Date')}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((matter) => (
              <TableRow key={matter.id}>
                <TableCell>
                  <div>
                    <Link to={`/admin/matters/${matter.id}`} className="font-bold text-ink hover:text-navy text-sm">
                      {matter.title}
                    </Link>
                    <div className="text-xs text-ink-muted font-mono">{matter.ref}</div>
                  </div>
                </TableCell>
                <TableCell className="text-xs">
                  <div className="font-semibold text-navy">{matter.category}</div>
                  <div className="text-ink-muted">{matter.court || 'استشارة / حوكمة'}</div>
                </TableCell>
                <TableCell className="text-xs text-ink font-medium">
                  {matter.assignedLawyer}
                </TableCell>
                <TableCell>
                  <StatusBadge status={matter.status} />
                </TableCell>
                <TableCell className="text-xs font-mono text-ink-muted">
                  {matter.createdAt}
                </TableCell>
                <TableCell>
                  <Link to={`/admin/matters/${matter.id}`}>
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
