import { Badge } from './badge'
import type { BookingStatus, MatterStatus, PipelineStage, TaskPriority, TaskStatus } from '../../types'

type AnyStatus = PipelineStage | BookingStatus | MatterStatus | TaskStatus | TaskPriority | string

const map: Record<string, { label: string; tone: 'neutral' | 'navy' | 'success' | 'warning' | 'danger' | 'info' | 'bronze' }> = {
  // pipeline
  new: { label: 'جديد', tone: 'info' },
  contacted: { label: 'تم التواصل', tone: 'navy' },
  qualified: { label: 'مؤهل', tone: 'bronze' },
  consultation_booked: { label: 'حُجزت استشارة', tone: 'warning' },
  consultation_completed: { label: 'اكتملت الاستشارة', tone: 'navy' },
  proposal_sent: { label: 'أُرسل العرض', tone: 'warning' },
  won: { label: 'تم التعاقد', tone: 'success' },
  lost: { label: 'مفقود', tone: 'neutral' },
  // booking
  pending: { label: 'بانتظار التأكيد', tone: 'warning' },
  confirmed: { label: 'مؤكد', tone: 'info' },
  completed: { label: 'مكتمل', tone: 'success' },
  cancelled: { label: 'ملغي', tone: 'neutral' },
  no_show: { label: 'لم يحضر', tone: 'danger' },
  // matter
  active: { label: 'نشطة', tone: 'success' },
  waiting: { label: 'بانتظار إجراء', tone: 'warning' },
  hearing_scheduled: { label: 'جلسة مجدولة', tone: 'info' },
  closed: { label: 'مغلقة', tone: 'neutral' },
  // task
  todo: { label: 'للتنفيذ', tone: 'neutral' },
  in_progress: { label: 'قيد التنفيذ', tone: 'info' },
  done: { label: 'مكتملة', tone: 'success' },
  low: { label: 'منخفضة', tone: 'neutral' },
  normal: { label: 'عادية', tone: 'navy' },
  high: { label: 'عالية', tone: 'warning' },
  urgent: { label: 'عاجلة', tone: 'danger' },
}

export function StatusBadge({ status }: { status: AnyStatus }) {
  const conf = map[status] ?? { label: status, tone: 'neutral' as const }
  return <Badge tone={conf.tone}>{conf.label}</Badge>
}

export const statusLabel = (s: AnyStatus) => map[s]?.label ?? s
