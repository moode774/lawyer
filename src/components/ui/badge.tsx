import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

type Tone = 'neutral' | 'navy' | 'success' | 'warning' | 'danger' | 'info' | 'bronze' | 'outline' | 'secondary' | 'accent'

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-2 text-ink-muted',
  secondary: 'bg-surface-2 text-ink-muted border border-border/40',
  navy: 'bg-navy/10 text-navy',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
  warning: 'bg-amber-50 text-amber-800 border border-amber-200/60',
  danger: 'bg-rose-50 text-rose-700 border border-rose-200/60',
  info: 'bg-blue-50 text-blue-700 border border-blue-200/60',
  bronze: 'bg-accent/10 text-accent',
  accent: 'bg-accent/15 text-accent border border-accent/30',
  outline: 'border border-border bg-transparent text-ink'
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  variant?: Tone
}

export function Badge({ className, tone, variant = 'neutral', ...props }: BadgeProps) {
  const selectedTone = tone || variant || 'neutral'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5',
        tones[selectedTone as Tone] || tones.neutral,
        className,
      )}
      {...props}
    />
  )
}
