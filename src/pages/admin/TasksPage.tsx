import React, { useState } from 'react'
import { Plus, Search, CheckSquare, Clock, AlertCircle } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { store } from '../../lib/store'
import { Task } from '../../types'
import { Card } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { StatusBadge } from '../../components/ui/status-badge'
import { PageHeader } from '../../components/ui/page-header'
import { useSEO } from '../../lib/seo'

export default function TasksPage() {
  const { t } = useT()
  useSEO({ title: 'إدارة المهام | ' + t('مكتب المحاماة', 'Law Firm') })

  const [tasks, setTasks] = useState<Task[]>(store.getTasks())
  const [filter, setFilter] = useState<'all' | 'todo' | 'done'>('all')

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, status: t.status === 'done' ? ('todo' as const) : ('done' as const) } : t))
    setTasks(updated)
  }

  const filtered = tasks.filter((t) => (filter === 'all' ? true : filter === 'done' ? t.status === 'done' : t.status !== 'done'))

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title={t('مهام ومتابعات العمل القانوني', 'Internal Tasks')}
        description={t('تحديد الأولويات والمواعيد النهائية لجلسات وصياغة العقود', 'Task allocation & deadlines')}
      />

      <Card className="p-4 bg-white border-border flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-navy text-white' : ''}
          >
            {t('جميع المهام', 'All')}
          </Button>
          <Button
            size="sm"
            variant={filter === 'todo' ? 'default' : 'outline'}
            onClick={() => setFilter('todo')}
            className={filter === 'todo' ? 'bg-navy text-white' : ''}
          >
            {t('قيد التنفيذ / المتبقية', 'Pending')}
          </Button>
          <Button
            size="sm"
            variant={filter === 'done' ? 'default' : 'outline'}
            onClick={() => setFilter('done')}
            className={filter === 'done' ? 'bg-navy text-white' : ''}
          >
            {t('المكتملة', 'Done')}
          </Button>
        </div>
      </Card>

      <div className="space-y-3">
        {filtered.map((task) => (
          <Card key={task.id} className="p-4 bg-white border-border flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.status === 'done'}
                onChange={() => toggleTask(task.id)}
                className="size-5 rounded border-border text-navy focus:ring-navy cursor-pointer"
              />
              <div>
                <h4 className={`font-semibold text-sm ${task.status === 'done' ? 'line-through text-ink-muted' : 'text-ink'}`}>
                  {task.title}
                </h4>
                <p className="text-xs text-ink-muted flex items-center gap-3 mt-1">
                  <span>المسؤول: {task.assignedTo}</span>
                  <span>•</span>
                  <span>الموعد: {task.dueDate}</span>
                </p>
              </div>
            </div>
            <StatusBadge status={task.priority} />
          </Card>
        ))}
      </div>
    </div>
  )
}
