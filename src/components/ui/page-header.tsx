import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  action?: ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, action, className }: PageHeaderProps) {
  const headerActions = actions || action
  return (
    <div className={cn('mb-6 flex flex-wrap items-start justify-between gap-3', className)}>
      <div>
        <h1 className="font-display text-xl font-bold text-ink">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
      </div>
      {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
    </div>
  )
}
