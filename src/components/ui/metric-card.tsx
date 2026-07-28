import type { ReactNode } from 'react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card } from './card'
import { cn } from '../../lib/utils'

interface MetricCardProps {
  label?: string
  title?: string
  value: string | number
  icon?: ReactNode
  trend?: number | 'up' | 'down' | 'neutral'
  hint?: string
  change?: string
}

export function MetricCard({ label, title, value, icon, trend, hint, change }: MetricCardProps) {
  const displayLabel = label || title
  const displayHint = hint || change

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-ink-muted">{displayLabel}</p>
          <p className="mt-2 font-display text-2xl font-semibold text-ink">{value}</p>
          {(trend !== undefined || displayHint) && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-muted">
              {trend !== undefined && (
                typeof trend === 'number' ? (
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 font-semibold',
                      trend >= 0 ? 'text-success' : 'text-danger',
                    )}
                  >
                    {trend >= 0 ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                    {Math.abs(trend)}%
                  </span>
                ) : (
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 font-semibold',
                      trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-slate-500',
                    )}
                  >
                    {trend === 'up' && <TrendingUp className="size-3.5" />}
                    {trend === 'down' && <TrendingDown className="size-3.5" />}
                  </span>
                )
              )}
              {displayHint}
            </p>
          )}
        </div>
        {icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-600">
            {icon}
          </span>
        )}
      </div>
    </Card>
  )
}
