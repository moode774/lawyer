// ===== Domain types — النطاق الكامل للمنصة =====

export type Locale = 'ar' | 'en'

export type Role = 'super_admin' | 'lawyer' | 'staff' | 'marketing' | 'client'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  color: string
}

// --- Pipeline ---
export type PipelineStage =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'consultation_booked'
  | 'consultation_completed'
  | 'proposal_sent'
  | 'won'
  | 'lost'

export type LeadSource =
  | 'google_ads'
  | 'google_search'
  | 'instagram'
  | 'x'
  | 'linkedin'
  | 'direct'
  | 'referral'
  | 'whatsapp'

export interface Utm {
  source?: string
  medium?: string
  campaign?: string
  content?: string
  term?: string
}

export type PartyType = 'individual' | 'company'

export interface Lead {
  id: string
  ref: string
  type: PartyType
  name: string
  phone: string
  email?: string
  company?: string
  category: string
  summary?: string
  notes?: string
  consultationType?: ConsultationType
  source: LeadSource
  landingPage?: string
  utm?: Utm
  status: PipelineStage
  estimatedValue?: number
  assignedTo?: string
  createdAt: string
  lastActivityAt: string
}

export interface Intake {
  id: string
  leadId: string
  partyType: PartyType
  category: string
  answers: Record<string, string>
  consultationType: ConsultationType
  preferredDate?: string
  preferredTime?: string
  files: string[]
  createdAt: string
}

// --- Clients & matters ---
export interface Client {
  id: string
  ref: string
  type: PartyType
  name: string
  phone: string
  email?: string
  company?: string
  nationalId?: string
  address?: string
  portalAccess: boolean
  notes?: string
  convertedFromLeadId?: string
  createdAt: string
}

export type MatterStatus = 'new' | 'active' | 'waiting' | 'hearing_scheduled' | 'closed'

export interface MatterDate {
  label: string
  date: string
}

export interface Matter {
  id: string
  ref: string
  clientId: string
  title: string
  category: string
  status: MatterStatus
  assignedLawyer: string
  team: string[]
  court?: string
  description?: string
  importantDates: MatterDate[]
  createdAt: string
}

// --- Booking ---
export type ConsultationType = 'office' | 'phone' | 'video'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'

export interface Appointment {
  id: string
  ref: string
  name: string
  phone: string
  email?: string
  leadId?: string
  clientId?: string
  type: ConsultationType
  category?: string
  date?: string // ISO date
  time?: string // "HH:mm"
  preferredDate?: string
  preferredTime?: string
  durationMin?: number
  duration?: string
  status: BookingStatus
  location?: string
  notes?: string
  createdAt: string
}

export interface BookingSettings {
  workingDays: number[] // 0=Sunday ... 6=Saturday (Saudi: Sun-Thu default)
  startHour: number
  endHour: number
  durationMin: number
  bufferMin: number
  blockedDates: string[]
  types: ConsultationType[]
}

// --- Documents ---
export type DocCategory =
  | 'contracts'
  | 'evidence'
  | 'identity'
  | 'court'
  | 'correspondence'
  | 'invoices'
  | 'other'

export interface Doc {
  id: string
  name: string
  category: DocCategory
  sizeKb?: number
  size?: string
  mime?: string
  uploadedBy?: string
  uploadedAt: string
  clientId?: string
  leadId?: string
  matterId?: string
  visibility: 'internal' | 'client'
}

// --- Tasks ---
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface Task {
  id: string
  title: string
  description?: string
  entityType?: 'lead' | 'client' | 'matter'
  entityId?: string
  assignedTo: string
  dueDate: string
  priority: TaskPriority
  status: TaskStatus
  createdAt: string
}

// --- Activity timeline ---
export type ActivityType =
  | 'lead_created'
  | 'status_changed'
  | 'appointment_booked'
  | 'document_uploaded'
  | 'message_sent'
  | 'task_created'
  | 'task_completed'
  | 'client_converted'
  | 'converted_to_client'
  | 'matter_created'
  | 'note_added'

export interface Activity {
  id: string
  entityType: 'lead' | 'client' | 'matter' | 'appointment'
  entityId: string
  type: ActivityType
  text: string
  actor: string
  createdAt: string
}

// --- Messages ---
export interface Message {
  id: string
  channel: 'whatsapp' | 'email'
  direction: 'outgoing' | 'incoming'
  to: string
  body: string
  templateId?: string
  status: 'sent' | 'delivered' | 'failed' | 'queued'
  entityType?: 'lead' | 'client'
  entityId?: string
  createdAt: string
}

// --- Notifications ---
export interface NotificationItem {
  id: string
  title: string
  body: string
  kind?: 'lead' | 'booking' | 'task' | 'document' | 'system' | 'info'
  read: boolean
  link?: string
  createdAt: string
}

// --- Content ---
export interface ServiceFaq {
  q: string
  a: string
}

export interface Service {
  id: string
  slug: string
  icon: string // lucide icon name key
  titleAr: string
  titleEn: string
  shortAr: string
  shortEn?: string
  descriptionAr: string
  whoForAr: string[]
  scenariosAr: string[]
  processAr: { title: string; text: string }[]
  faqs: ServiceFaq[]
  relatedArticles: string[] // article slugs
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string[]
  author: string
  publishedAt: string
  category: string
  seoTitle: string
  seoDescription: string
  readMinutes: number
}

export interface Faq {
  id: string
  question: string
  answer: string
  category: string
}

export interface AutomationSetting {
  id: string
  event: string
  label: string
  channel: 'whatsapp' | 'email' | 'internal'
  enabled: boolean
  templateId?: string
}

export interface NotificationTemplate {
  id: string
  name: string
  channel: 'whatsapp' | 'email'
  body: string
}
