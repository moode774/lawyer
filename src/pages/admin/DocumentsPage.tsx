import React, { useState } from 'react'
import { Plus, Search, FileText, Upload, Download, Eye, Lock, ShieldCheck } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { store } from '../../lib/store'
import { Doc } from '../../types'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { PageHeader } from '../../components/ui/page-header'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table'
import { useSEO } from '../../lib/seo'

export default function DocumentsPage() {
  const { t } = useT()
  useSEO({ title: 'إدارة المستندات | ' + t('مكتب المحاماة', 'Law Firm') })

  const [docs, setDocs] = useState<Doc[]>(store.getDocuments())
  const [search, setSearch] = useState('')

  const filtered = docs.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.category.includes(search))

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t('المخزن الأمني للمستندات والوثائق', 'Document Management System')}
        description={t('تخزين وتصنيف العقود والصحائف واللوائح بتشفير تام وصلاحيات وصول موثقة', 'Encrypted file storage & access management')}
        action={
          <Button id="tour-library-upload" className="bg-navy text-white hover:bg-navy-light gap-2">
            <Upload className="size-4" />
            <span>{t('رفع مستند جديد', 'Upload Document')}</span>
          </Button>
        }
      />

      <Card className="p-4 bg-white border-border">
        <div className="relative max-w-md">
          <Search className="absolute start-3 top-2.5 size-4 text-ink-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('بحث باسم الملف أو التخصيص...', 'Search files...')}
            className="ps-9"
          />
        </div>
      </Card>

      <Card className="bg-white border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('اسم المستند', 'Document Name')}</TableHead>
              <TableHead>{t('التصنيف', 'Category')}</TableHead>
              <TableHead>{t('الحجم والتاريخ', 'Size & Date')}</TableHead>
              <TableHead>{t('المرفوع بواسطة', 'Uploaded By')}</TableHead>
              <TableHead>{t('مستوى الرؤية', 'Visibility')}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <FileText className="size-5 text-navy" />
                    <span className="font-semibold text-ink text-sm">{doc.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{doc.category}</Badge>
                </TableCell>
                <TableCell className="text-xs font-mono text-ink-muted">
                  {doc.size} • {doc.uploadedAt}
                </TableCell>
                <TableCell className="text-xs text-ink">{doc.uploadedBy}</TableCell>
                <TableCell>
                  <Badge variant={doc.visibility === 'client' ? 'success' : 'secondary'} className="text-[11px]">
                    {doc.visibility === 'client' ? t('متاح للعميل', 'Client Visible') : t('داخلي فقط', 'Internal Only')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="size-8 p-0">
                    <Download className="size-4 text-navy" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
