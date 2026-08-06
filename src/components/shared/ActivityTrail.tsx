import { useEffect, useState } from 'react'
import { History, ChevronDown } from 'lucide-react'
import { listEntityActivity, describeChanges, type ActivityEntry } from '../../lib/activity'
import { timeAgo, initials, cn } from '../../lib/utils'

interface Props {
  /** اسم الجدول في قاعدة البيانات، مثل: leads / clients / matters */
  entityType: string
  entityId: string
  className?: string
}

const ACTION_STYLE: Record<ActivityEntry['action'], { label: string; dot: string }> = {
  insert: { label: 'أنشأ', dot: 'bg-emerald-500' },
  update: { label: 'عدّل', dot: 'bg-amber-500' },
  delete: { label: 'حذف', dot: 'bg-rose-500' },
}

/**
 * أثر النشاط أسفل السجل — من فعل ماذا ومتى.
 * يُقرأ مباشرة من جدول activity_log الذي تكتبه متتبّعات قاعدة البيانات،
 * فيظهر أي تعديل حتى لو تمّ من خارج هذه الشاشة.
 */
export function ActivityTrail({ entityType, entityId, className }: Props) {
  const [entries, setEntries] = useState<ActivityEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError('')

    listEntityActivity(entityType, entityId)
      .then((rows) => { if (alive) setEntries(rows) })
      .catch((cause) => { if (alive) setError(cause instanceof Error ? cause.message : 'تعذر تحميل سجل النشاط') })
      .finally(() => { if (alive) setLoading(false) })

    return () => { alive = false }
  }, [entityType, entityId])

  const visible = expanded ? entries : entries.slice(0, 4)

  return (
    <section className={cn('mt-8 border-t border-[#E8ECEF] pt-5', className)}>
      <div className="mb-4 flex items-center gap-2">
        <History className="size-3.5 text-[#8EB1D1]" strokeWidth={1.75} />
        <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#66778b]">
          سجل النشاط
        </h3>
        {entries.length > 0 && (
          <span className="text-[10px] font-bold text-[#8EB1D1] tabular-nums">{entries.length}</span>
        )}
      </div>

      {loading && <p className="text-[11px] text-[#8a99ab]">جارٍ تحميل السجل...</p>}

      {!loading && error && (
        <p className="text-[11px] text-rose-600">{error}</p>
      )}

      {!loading && !error && entries.length === 0 && (
        <p className="text-[11px] text-[#8a99ab]">لا توجد عمليات مسجّلة على هذا السجل بعد.</p>
      )}

      {!loading && !error && entries.length > 0 && (
        <ol className="space-y-3.5">
          {visible.map((entry) => {
            const style = ACTION_STYLE[entry.action]
            const lines = describeChanges(entry)

            return (
              <li key={entry.id} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EEF3F8] text-[9px] font-bold text-[#4a627d]">
                  {initials(entry.actorName)}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] leading-relaxed text-[#33475e]">
                    <span className={cn('me-1.5 inline-block size-1.5 rounded-full align-middle', style.dot)} />
                    <span className="font-bold text-[#1C2B48]">{entry.actorName}</span>
                    <span className="text-[#66778b]"> {style.label} </span>
                    <span className="text-[#8a99ab]">— {timeAgo(entry.createdAt)}</span>
                  </p>

                  {entry.action === 'update' && lines.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {lines.map((line, i) => (
                        <li key={i} className="text-[10.5px] leading-relaxed text-[#66778b]">
                          <span className="text-[#b6c3d1]">•</span> {line}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      )}

      {entries.length > 4 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-[#4a627d] transition-colors hover:text-[#1C2B48]"
        >
          <span>{expanded ? 'عرض أقل' : `عرض كل السجل (${entries.length})`}</span>
          <ChevronDown className={cn('size-3.5 transition-transform', expanded && 'rotate-180')} />
        </button>
      )}
    </section>
  )
}

export default ActivityTrail
