// ===== أنواع مركز التسويق الذكي — Marketing Hub Domain Types =====

// --- منصات الإعلان ---
export type PlatformId = 'meta' | 'google' | 'tiktok' | 'snapchat'

export type ConnectionStatus = 'connected' | 'not_configured' | 'error' | 'expired'

export interface MarketingConnection {
  id: string
  platform: PlatformId
  accountName?: string
  accountId?: string
  status: ConnectionStatus
  scopes: string[]
  connectedAt?: string
  lastSyncAt?: string
  tokenStatus?: 'valid' | 'expired' | 'missing'
  error?: string
}

// --- الحملات الإعلانية ---
export type CampaignStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'active'
  | 'paused'
  | 'completed'
  | 'rejected'

export type CampaignObjective =
  | 'leads'
  | 'traffic'
  | 'calls'
  | 'whatsapp'
  | 'awareness'
  | 'conversions'
  | 'retargeting'

export interface CampaignAudience {
  location: string
  ageMin: number
  ageMax: number
  gender: 'all' | 'male' | 'female'
  interests: string[]
  customAudience?: string
}

export interface Ad {
  id: string
  campaignId: string
  name: string
  status: 'active' | 'paused' | 'draft'
  headline: string
  body: string
  cta: string
  impressions: number
  clicks: number
  leads: number
  conversions: number
  spend: number
}

export interface Campaign {
  id: string
  name: string
  platform: PlatformId
  objective: CampaignObjective
  service: string
  status: CampaignStatus
  budgetType: 'daily' | 'total'
  budget: number
  spend: number
  impressions: number
  reach: number
  clicks: number
  leads: number
  conversions: number
  revenue: number
  startDate: string
  endDate: string
  audience: CampaignAudience
  ads: Ad[]
  demo?: boolean
  createdBy: string
  createdAt: string
}

// --- المحتوى ---
export type ContentType = 'text' | 'image' | 'video' | 'ad_copy' | 'article' | 'script' | 'logo' | 'file'
export type ContentStatus = 'draft' | 'pending_approval' | 'approved' | 'scheduled' | 'published' | 'failed'

export interface ContentItem {
  id: string
  type: ContentType
  title: string
  body?: string
  url?: string
  tags: string[]
  platform?: PlatformId | 'all'
  status: ContentStatus
  scheduledAt?: string
  publishedAt?: string
  sourceItemId?: string
  service?: string
  createdBy: string
  createdAt: string
  demo?: boolean
}

// --- مزودو الذكاء الاصطناعي ---
export type AIProviderType = 'openai' | 'gemini' | 'anthropic' | 'custom'
export type AIModelKind = 'text' | 'image' | 'video' | 'audio'

export interface AIModel {
  id: string
  label: string
  kind: AIModelKind
}

export interface AIProviderConfig {
  id: string
  name: string
  type: AIProviderType
  apiKey?: string
  baseUrl?: string
  models: AIModel[]
  defaultModels: Partial<Record<AIModelKind, string>>
  status: 'active' | 'not_configured' | 'error'
  monthlyLimit?: number
  dailyLimit?: number
  createdAt: string
}

export interface AIUsage {
  id: string
  providerId: string
  providerName: string
  model: string
  kind: AIModelKind
  feature: string
  tokens: number
  cost: number
  userName: string
  createdAt: string
}

// --- المحادثات ---
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface AIConversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
}

// --- الرؤى الذكية ---
export type InsightActionType =
  | 'pause_campaign'
  | 'increase_budget'
  | 'decrease_budget'
  | 'create_ad'
  | 'change_copy'
  | 'create_creative'

export interface AIInsight {
  id: string
  kind: 'warning' | 'positive' | 'suggestion'
  text: string
  campaignId?: string
  action?: { type: InsightActionType; label: string; payload?: Record<string, unknown> }
  status: 'new' | 'reviewed' | 'applied' | 'dismissed'
  createdAt: string
}

// --- الموافقات ---
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface Approval {
  id: string
  entityType: 'campaign' | 'content'
  entityId: string
  entityName: string
  status: ApprovalStatus
  requestedBy: string
  requestedAt: string
  decidedBy?: string
  decidedAt?: string
  note?: string
}

// --- سجل التدقيق ---
export interface MarketingAuditLog {
  id: string
  userName: string
  action: string
  entityType: string
  entityId?: string
  previousValue?: string
  newValue?: string
  createdAt: string
}

// --- أحداث التحويل ---
export type ConversionEventType =
  | 'form_submit'
  | 'whatsapp_click'
  | 'call_click'
  | 'booking'
  | 'client_registered'
  | 'payment'

export interface ConversionEvent {
  id: string
  type: ConversionEventType
  leadId?: string
  campaignId?: string
  platform?: PlatformId
  value?: number
  createdAt: string
}

// --- هوية العلامة التجارية ---
export interface BrandKit {
  brandVersion?: string
  tradeName: string
  description: string
  services: string[]
  logoUrl: string
  colors: { primary: string; secondary: string; accent: string }
  officialPalette?: { navy: string; navyLight: string; gold: string; warmGray: string; ivory: string }
  fonts: string[]
  defaultFont?: string
  generationDefaults?: { quality: 'medium' | 'high'; maxImagesPerAction: 1; confirmHighQuality: boolean }
  phone: string
  email: string
  website: string
  social: Record<string, string>
  toneOfVoice: string
  styleGuidelines: string
  preferredWords: string[]
  bannedWords: string[]
  aiInstructions: string
}

// --- مهام الخلفية ---
export interface MarketingJob {
  id: string
  type: string
  label: string
  status: 'queued' | 'running' | 'done' | 'failed'
  attempts: number
  lastError?: string
  lastRunAt?: string
  createdAt: string
}

// --- صلاحيات التسويق ---
export const MARKETING_PERMISSIONS = [
  'marketing.view',
  'marketing.manage',
  'campaign.create',
  'campaign.approve',
  'campaign.publish',
  'campaign.pause',
  'ai.use',
  'ai.settings',
  'connections.manage',
  'analytics.view',
] as const

export type MarketingPermission = (typeof MARKETING_PERMISSIONS)[number]
