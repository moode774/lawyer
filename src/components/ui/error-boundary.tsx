import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error:', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4 text-right" dir="rtl">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-border shadow-xl space-y-6 text-center">
            <div className="size-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="size-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-ink">حدث خطأ غير متوقع</h2>
              <p className="text-xs text-ink-muted leading-relaxed">
                {this.state.error?.message || 'تعذر تحميل الصفحة بشكل صحيح. يمكنك إعادة تنشيط الشاشة لتحديث النظام.'}
              </p>
            </div>
            <button
              onClick={this.handleReload}
              className="w-full py-3 px-4 bg-navy text-white text-sm font-semibold rounded-xl hover:bg-navy-light transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="size-4" />
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
