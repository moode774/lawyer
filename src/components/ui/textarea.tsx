import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'
