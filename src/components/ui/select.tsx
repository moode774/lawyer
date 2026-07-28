import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options = [], children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy cursor-pointer transition-colors',
          className
        )}
        {...props}
      >
        {children ||
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
      </select>
    )
  }
)
Select.displayName = 'Select'
