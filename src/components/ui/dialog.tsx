import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  wide?: boolean
}

export function Dialog({ open, onClose, title, description, children, wide }: DialogProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-[2px] animate-fade-in" onClick={onClose} />
      <div
        className={cn(
          'relative w-full rounded-lg bg-white shadow-xl animate-fade-up',
          wide ? 'max-w-2xl' : 'max-w-md',
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div>
              {title && <h2 className="font-display text-base font-semibold text-ink">{title}</h2>}
              {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
            </div>
            <button onClick={onClose} className="rounded-md p-1 text-ink-muted hover:bg-surface-2" aria-label="إغلاق">
              <X className="size-4" />
            </button>
          </div>
        )}
        <div className="max-h-[75vh] overflow-y-auto p-5 scrollbar-thin">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
