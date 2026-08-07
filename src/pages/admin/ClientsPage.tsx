import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ExternalLink, Plus } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { store } from '../../lib/store'
import { Client } from '../../types'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { PageHeader } from '../../components/ui/page-header'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table'
import { Avatar } from '../../components/ui/avatar'
import { useSEO } from '../../lib/seo'

export default function ClientsPage() {
  const { t } = useT()
  useSEO({ title: 'قاعدة العملاء | ' + t('مكتب المحاماة', 'Law Firm') })

  const clients: Client[] = store.getClients()
  const [search, setSearch] = useState('')

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.ref.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t('سجل العملاء المعتمدين', 'Clients Database')}
        description={t('جميع العملاء والأشخاص الاكتسابيين مع ربط القضايا والمستندات', 'Verified clients with associated legal matters')}
        action={
          <Button id="tour-clients-add" size="sm" className="bg-navy text-white hover:bg-navy-light gap-2">
            <Plus className="size-4" />
            <span>{t('إضافة عميل جديد', 'Add Client')}</span>
          </Button>
        }
      />

      <Card id="tour-clients-search" className="p-4 bg-white border-border">
        <div className="relative max-w-md">
          <Search className="absolute start-3 top-2.5 size-4 text-ink-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('بحث باسم العميل، المرجع، الجوال...', 'Search client...')}
            className="ps-9"
          />
        </div>
      </Card>

      <Card id="tour-clients-table" className="bg-white border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('العميل والرمز', 'Client & Ref')}</TableHead>
              <TableHead>{t('النوع والمنشأة', 'Type')}</TableHead>
              <TableHead>{t('رقم الجوال والبريد', 'Contact')}</TableHead>
              <TableHead>{t('السجل / الهوية', 'ID / Commercial Reg')}</TableHead>
              <TableHead>{t('تاريخ الانضمام', 'Joined Date')}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={client.name} />
                    <div>
                      <Link to={`/admin/clients/${client.id}`} className="font-bold text-ink hover:text-navy text-sm">
                        {client.name}
                      </Link>
                      <div className="text-xs text-ink-muted font-mono">{client.ref}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-xs">
                  <span className="font-semibold text-navy">
                    {client.type === 'company' ? client.company || 'منشأة تجارية' : 'فرد'}
                  </span>
                </TableCell>
                <TableCell className="text-xs font-mono" dir="ltr">
                  <div>{client.phone}</div>
                  <div className="text-ink-muted">{client.email}</div>
                </TableCell>
                <TableCell className="text-xs font-mono text-ink-muted">
                  {client.nationalId || '-'}
                </TableCell>
                <TableCell className="text-xs font-mono text-ink-muted">
                  {client.createdAt}
                </TableCell>
                <TableCell>
                  <Link to={`/admin/clients/${client.id}`}>
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
