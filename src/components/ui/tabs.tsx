import React, { useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export interface Tab {
  id: string
  label: string
  count?: number | string
  content?: ReactNode
}

export interface TabsProps {
  tabs: Tab[]
  active?: string
  onChange?: (id: string) => void
  className?: string
}

export function Tabs({ tabs, active: controlledActive, onChange, className }: TabsProps) {
  const [internalActive, setInternalActive] = useState<string>(tabs[0]?.id || '')

  const activeId = controlledActive !== undefined ? controlledActive : internalActive

  const handleTabClick = (id: string) => {
    if (onChange) {
      onChange(id)
    }
    if (controlledActive === undefined) {
      setInternalActive(id)
    }
  }

  const currentTab = tabs.find((t) => t.id === activeId) || tabs[0]

  return (
    <div className="space-y-4">
      <div className={cn('flex items-center gap-1 border-b border-border', className)} role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={activeId === t.id}
            onClick={() => handleTabClick(t.id)}
            className={cn(
              '-mb-px flex items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors',
              activeId === t.id
                ? 'border-navy text-navy font-bold'
                : 'border-transparent text-ink-muted hover:text-ink',
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-semibold text-ink-muted border border-border">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {currentTab?.content && (
        <div className="animate-fadeIn">
          {currentTab.content}
        </div>
      )}
    </div>
  )
}

export function useTabs(initial: string) {
  const [active, setActive] = useState(initial)
  return { active, setActive }
}

export function TabPanel({ children }: { children: ReactNode }) {
  return <div className="pt-5">{children}</div>
}
