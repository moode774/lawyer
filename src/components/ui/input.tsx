import { forwardRef } from 'react'
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const baseField =
  'w-full rounded-md border border-border-strong bg-white px-3 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-100 disabled:cursor-not-allowed disabled:bg-surface'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(baseField, 'h-10', className)} {...props} />
  ),
)
Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(baseField, 'min-h-[100px] py-2.5', className)} {...props} />
  ),
)
Textarea.displayName = 'Textarea'

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(baseField, 'h-10 appearance-none pe-8', className)} {...props}>
      {children}
    </select>
  ),
)
Select.displayName = 'Select'

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('mb-1.5 block text-sm font-medium text-ink-soft', className)} {...props} />
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null
  return <p className="mt-1.5 text-xs font-medium text-danger">{children}</p>
}
