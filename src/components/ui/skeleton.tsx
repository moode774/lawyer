import { cn } from '../../lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-surface-2', className)} />
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  )
}
