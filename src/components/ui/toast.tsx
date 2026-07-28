import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, Info, XCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

type ToastKind = 'success' | 'error' | 'info'
interface Toast {
  id: number
  kind: ToastKind
  message: string
}

const ToastContext = createContext<{ toast: (message: string, kind?: ToastKind) => void }>({
  toast: () => {},
})

export const useToast = () => useContext(ToastContext)

let nextId = 1

const icons: Record<ToastKind, ReactNode> = {
  success: <CheckCircle2 className="size-4 text-success" />,
  error: <XCircle className="size-4 text-danger" />,
  info: <Info className="size-4 text-info" />,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = nextId++
    setToasts((t) => [...t, { id, kind, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-5 start-5 z-[60] flex flex-col gap-2" aria-live="polite">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={cn(
                'flex items-center gap-2.5 rounded-lg border border-border bg-white px-4 py-3 shadow-lg animate-fade-up',
              )}
            >
              {icons[t.kind]}
              <p className="text-sm font-medium text-ink">{t.message}</p>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}
