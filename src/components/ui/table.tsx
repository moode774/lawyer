import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto scrollbar-thin">
      <table className={cn('w-full text-sm', className)} {...props} />
    </div>
  )
}

export function THead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('border-b border-border bg-surface text-start', className)} {...props} />
}

export function TBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />
}

export function TR({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn('border-b border-border last:border-0 hover:bg-surface/60 transition-colors', className)} {...props} />
  )
}

export function TH({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={cn('px-4 py-3 text-start text-xs font-semibold text-ink-muted whitespace-nowrap', className)} {...props} />
  )
}

export function TD({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-4 py-3 align-middle text-ink', className)} {...props} />
}

export const TableHeader = THead
export const TableBody = TBody
export const TableRow = TR
export const TableHead = TH
export const TableCell = TD
