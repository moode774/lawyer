import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Megaphone,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Bot,
  Sparkles,
  Layers,
  Calendar,
  Share2,
  Settings,
  Link2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  Eye,
  Play,
  Pause,
  Copy,
  Wand2,
  Send,
  Sliders,
  DollarSign,
  PieChart as PieChartIcon,
  Video,
  Image as ImageIcon,
  FileText,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Download,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  X,
  Palette,
  Volume2,
  Lock,
  Globe,
  MessageSquare,
  Key,
  Flame,
  Check,
  SlidersHorizontal
} from 'lucide-react'
import { useSEO } from '../../lib/seo'
import { Card } from '../../components/ui/card'
import { BRAND } from '../../config/brand'
import {
  listConnections,
  listCampaigns,
  listContentItems,
  listInsights,
  listAiProviders,
  getBrandKit,
  updateBrandKit,
  getMarketingStats,
  createCampaign,
  setCampaignStatus,
  deleteCampaign,
  createContentItem,
  setInsightStatus,
  updateAiProvider,
  clearDemoData,
  listAuditLogs
} from '../../lib/marketing/store'
import { generateRealTextWithAI, generateRealImageWithAI } from '../../lib/marketing/ai-service'
import { supabase } from '../../lib/supabase'
import type {
  Campaign,
  CampaignObjective,
  CampaignStatus,
  ContentItem,
  PlatformId,
  AIInsight,
  AIProviderConfig,
  BrandKit
} from '../../types/marketing'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts'

const PLATFORM_INFO: Record<PlatformId, { name: string; color: string; bg: string; iconStr: string }> = {
  meta: { name: 'Meta (Facebook & Instagram)', color: '#1877F2', bg: 'bg-blue-50 text-blue-700 border-blue-200', iconStr: 'Meta' },
  google: { name: 'Google Ads', color: '#EA4335', bg: 'bg-red-50 text-red-700 border-red-200', iconStr: 'Google' },
  tiktok: { name: 'TikTok Ads', color: '#000000', bg: 'bg-slate-900 text-white border-slate-700', iconStr: 'TikTok' },
  snapchat: { name: 'Snapchat Ads', color: '#FFFC00', bg: 'bg-amber-50 text-amber-900 border-amber-300', iconStr: 'Snap' }
}

export default function MarketingPage() {
  useSEO({ title: 'مركز التسويق الذكي | بن نوح للمحاماة' })
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab] = useState<
    'overview' | 'campaigns' | 'studio' | 'brand' | 'content' | 'leads' | 'connections' | 'assistant' | 'settings'
  >('overview')

  const { data: stats } = useQuery({ queryKey: ['mkt-stats'], queryFn: () => getMarketingStats() })
  const { data: campaigns = [] } = useQuery({ queryKey: ['mkt-campaigns'], queryFn: () => listCampaigns() })
  const { data: connections = [] } = useQuery({ queryKey: ['mkt-connections'], queryFn: () => listConnections() })
  const { data: contentItems = [] } = useQuery({ queryKey: ['mkt-content'], queryFn: () => listContentItems() })
  const { data: brandKit } = useQuery({ queryKey: ['mkt-brand'], queryFn: () => getBrandKit() })
  const { data: insights = [] } = useQuery({ queryKey: ['mkt-insights'], queryFn: () => listInsights() })
  const { data: aiProviders = [] } = useQuery({ queryKey: ['mkt-providers'], queryFn: () => listAiProviders() })
  const { data: auditLogs = [] } = useQuery({ queryKey: ['mkt-audit'], queryFn: () => listAuditLogs() })

  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false)

  return (
    <div className="space-y-8 pb-20 font-tajawal selection:bg-[#C4A35A] selection:text-white">
      {/* Dynamic Glassmorphism Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C2B48] via-[#152238] to-[#0D1526] p-6 sm:p-8 text-white shadow-2xl border border-white/10">
        <div className="absolute -end-16 -top-16 size-72 rounded-full bg-[#C4A35A]/10 blur-3xl pointer-events-none" />
        <div className="absolute -start-16 -bottom-16 size-72 rounded-full bg-[#8EB1D1]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center size-12 rounded-2xl bg-gradient-to-tr from-[#C4A35A] to-[#E6C687] text-[#1C2B48] shadow-lg font-bold">
                <Megaphone className="size-6" />
              </span>
              <div>
                <h1 className="font-amiri text-3xl sm:text-4xl font-bold tracking-wide text-white">
                  مركز التسويق الذكي
                </h1>
                <p className="text-xs text-[#C4D8E5] font-medium mt-0.5">
                  منظومة التحكم التسويقية وإدارة الحملات وصناعة المحتوى بالذكاء الاصطناعي
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsCreateCampaignOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#C4A35A] to-[#B08D46] text-[#1C2B48] px-5 py-3 text-xs font-extrabold hover:brightness-110 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="size-4 stroke-[3]" />
              <span>حملة إعلانية جديدة</span>
            </button>

            <button
              onClick={() => setActiveTab('studio')}
              className="flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white px-5 py-3 text-xs font-bold border border-white/15 backdrop-blur-md transition-all cursor-pointer"
            >
              <Wand2 className="size-4 text-[#C4A35A]" />
              <span>استوديو AI المباشر</span>
            </button>
          </div>
        </div>
      </div>

      {/* Luxury Tabs Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto p-2 bg-white/80 backdrop-blur-md rounded-2xl border border-[#C4D8E5]/70 shadow-xs scrollbar-thin">
        {[
          { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
          { id: 'campaigns', label: 'الحملات ومولد AI', icon: Target },
          { id: 'studio', label: 'استوديو الذكاء الاصطناعي', icon: Sparkles },
          { id: 'brand', label: 'هوية العلامة التجارية', icon: Palette },
          { id: 'content', label: 'النشر وجدولة المحتوى', icon: Calendar },
          { id: 'leads', label: 'العملاء والتحويلات', icon: Users },
          { id: 'connections', label: 'الحسابات والمنصات', icon: Link2 },
          { id: 'assistant', label: 'المساعد والتوصيات', icon: Bot },
          { id: 'settings', label: 'إعدادات AI والتدقيق', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                active
                  ? 'bg-[#1C2B48] text-white shadow-md font-extrabold border border-[#8EB1D1]/40'
                  : 'text-[#527094] hover:bg-[#E8ECEF] hover:text-[#1C2B48]'
              }`}
            >
              <Icon className={`size-4 ${active ? 'text-[#C4A35A]' : 'text-[#527094]'}`} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TABS VIEW CONTROLLERS */}

      {/* 1. OVERVIEW */}
      {activeTab === 'overview' && (
        <OverviewModule
          stats={stats}
          campaigns={campaigns}
          insights={insights}
          onNavigate={(tab) => setActiveTab(tab)}
        />
      )}

      {/* 2. CAMPAIGNS */}
      {activeTab === 'campaigns' && (
        <CampaignsModule
          campaigns={campaigns}
          onCreateClick={() => setIsCreateCampaignOpen(true)}
          onRefresh={() => queryClient.invalidateQueries({ queryKey: ['mkt-campaigns'] })}
        />
      )}

      {/* 3. AI STUDIO LIVE */}
      {activeTab === 'studio' && <AiStudioModule providers={aiProviders} brandKit={brandKit} />}

      {/* 4. BRAND KIT */}
      {activeTab === 'brand' && <BrandKitModule brandKit={brandKit} />}

      {/* 5. CONTENT */}
      {activeTab === 'content' && <ContentModule items={contentItems} />}

      {/* 6. LEADS */}
      {activeTab === 'leads' && <LeadsModule campaigns={campaigns} />}

      {/* 7. CONNECTIONS */}
      {activeTab === 'connections' && <ConnectionsModule connections={connections} />}

      {/* 8. ASSISTANT */}
      {activeTab === 'assistant' && <AssistantModule insights={insights} stats={stats} campaigns={campaigns} />}

      {/* 9. SETTINGS */}
      {activeTab === 'settings' && <SettingsModule providers={aiProviders} auditLogs={auditLogs} />}

      {/* CREATE CAMPAIGN WIZARD */}
      {isCreateCampaignOpen && (
        <CreateCampaignModal
          onClose={() => setIsCreateCampaignOpen(false)}
          onCreated={() => {
            setIsCreateCampaignOpen(false)
            queryClient.invalidateQueries({ queryKey: ['mkt-campaigns'] })
            queryClient.invalidateQueries({ queryKey: ['mkt-stats'] })
          }}
        />
      )}
    </div>
  )
}

// ===== MODULE 1: OVERVIEW DASHBOARD =====
function OverviewModule({
  stats,
  campaigns,
  insights,
  onNavigate
}: {
  stats: any
  campaigns: Campaign[]
  insights: AIInsight[]
  onNavigate: (tab: any) => void
}) {
  const chartData = campaigns.map((c) => ({
    name: c.name.length > 15 ? c.name.slice(0, 15) + '...' : c.name,
    spend: c.spend,
    leads: c.leads,
    cpl: c.leads > 0 ? Math.round(c.spend / c.leads) : 0
  }))

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#527094]">إجمالي الإنفاق الإعلاني</span>
            <div className="size-11 rounded-2xl bg-[#E8ECEF] text-[#1C2B48] flex items-center justify-center font-bold text-xs shadow-2xs">
              SAR
            </div>
          </div>
          <div>
            <h3 className="font-amiri text-3xl font-bold text-[#1C2B48] font-mono">
              {stats?.totalSpend?.toLocaleString() || 0} ر.س
            </h3>
            <p className="text-[11px] font-bold text-emerald-600 mt-1">▲ أداء حقيقي مباشر</p>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#527094]">العملاء المحتملون (Leads)</span>
            <div className="size-11 rounded-2xl bg-[#E8ECEF] text-[#1C2B48] flex items-center justify-center">
              <Users className="size-5 text-[#8EB1D1]" />
            </div>
          </div>
          <div>
            <h3 className="font-amiri text-3xl font-bold text-[#1C2B48] font-mono">
              {stats?.totalLeads || 0} عميل
            </h3>
            <p className="text-[11px] font-bold text-[#8EB1D1] mt-1">
              معدل التحويل: {stats?.conversionRate?.toFixed(1) || 0}%
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#527094]">تكلفة العميل المحتمل (CPL)</span>
            <div className="size-11 rounded-2xl bg-[#E8ECEF] text-[#1C2B48] flex items-center justify-center">
              <Target className="size-5 text-[#8EB1D1]" />
            </div>
          </div>
          <div>
            <h3 className="font-amiri text-3xl font-bold text-[#1C2B48] font-mono">
              {Math.round(stats?.cpl || 0)} ر.س
            </h3>
            <p className="text-[11px] font-bold text-emerald-600 mt-1">CPA: {Math.round(stats?.cpa || 0)} ر.س</p>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-xs hover:shadow-md transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#527094]">عائد الاستثمار ROAS</span>
            <div className="size-11 rounded-2xl bg-[#1C2B48] text-[#C4A35A] flex items-center justify-center shadow-md">
              <TrendingUp className="size-5" />
            </div>
          </div>
          <div>
            <h3 className="font-amiri text-3xl font-bold text-[#1C2B48] font-mono">
              {stats?.roas ? `${stats.roas.toFixed(1)}x` : '0x'}
            </h3>
            <p className="text-[11px] font-bold text-amber-600 mt-1">العوائد: {stats?.revenue?.toLocaleString() || 0} ر.س</p>
          </div>
        </Card>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-600" /> أفضل حملة أداءً
            </span>
            <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
              أقل CPL
            </span>
          </div>
          <h4 className="font-bold text-sm text-emerald-950 truncate">
            {stats?.bestCampaign?.name || 'لا توجد حملات حقيقية كافية بعد'}
          </h4>
          <div className="flex items-center justify-between text-xs text-emerald-800 pt-2 border-t border-emerald-200/80 font-mono">
            <span>الإنفاق: {stats?.bestCampaign?.spend || 0} ر.س</span>
            <span>Leads: {stats?.bestCampaign?.leads || 0}</span>
          </div>
        </Card>

        <Card className="p-6 bg-blue-50/70 border border-blue-200 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="size-4 text-blue-600" /> أفضل منصة إعلانية
            </span>
            <span className="text-[10px] font-bold bg-blue-200 text-blue-900 px-2.5 py-0.5 rounded-full">
              أعلى تحويلات
            </span>
          </div>
          <h4 className="font-bold text-sm text-blue-950">
            {stats?.bestPlatform ? PLATFORM_INFO[stats.bestPlatform as PlatformId]?.name : 'Meta Ads'}
          </h4>
          <p className="text-xs text-blue-800 pt-2 border-t border-blue-200/80">
            تتميز بمعدل وصول مرتفع وتكلفة استجابة متزنة.
          </p>
        </Card>

        <Card className="p-6 bg-amber-50/70 border border-amber-200 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="size-4 text-amber-600" /> تنبيه تحسين AI
            </span>
            <button onClick={() => onNavigate('assistant')} className="text-[10px] font-bold text-amber-900 underline">
              عرض التفاصيل
            </button>
          </div>
          <p className="font-bold text-xs text-amber-950 leading-relaxed">
            {insights[0]?.text || 'تأكد من تزويد مفاتيح API الخاصة بالذكاء الاصطناعي والمنصات لبدء المزامنة الحية.'}
          </p>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-6 sm:p-8 bg-white border border-[#C4D8E5] rounded-3xl shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#C4D8E5]/70 pb-4">
          <div>
            <h3 className="font-amiri text-xl font-bold text-[#1C2B48]">
              مقارنة الإنفاق والعملاء المحتملين بحسب الحملة
            </h3>
            <p className="text-xs text-[#527094]">تحليل الأداء المباشر لجميع الحملات الإعلانية</p>
          </div>
          <button
            onClick={() => onNavigate('campaigns')}
            className="text-xs font-bold text-[#1C2B48] bg-[#E8ECEF] hover:bg-[#C4D8E5] px-4 py-2 rounded-full transition-all"
          >
            إدارة الحملات ←
          </button>
        </div>

        <div className="h-72 w-full font-tajawal">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECEF" />
              <XAxis dataKey="name" stroke="#527094" fontSize={11} tick={{ fontWeight: 'bold' }} />
              <YAxis stroke="#527094" fontSize={11} tick={{ fontWeight: 'bold' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1C2B48',
                  borderColor: '#8EB1D1',
                  borderRadius: '16px',
                  color: '#ffffff',
                  fontFamily: 'Tajawal'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontFamily: 'Tajawal', fontWeight: 'bold', fontSize: '12px' }} />
              <Bar dataKey="spend" name="الإنفاق (ر.س)" fill="#1C2B48" radius={[8, 8, 0, 0]} />
              <Bar dataKey="leads" name="العملاء المحتملون (Leads)" fill="#8EB1D1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

// ===== MODULE 2: CAMPAIGNS =====
function CampaignsModule({
  campaigns,
  onCreateClick,
  onRefresh
}: {
  campaigns: Campaign[]
  onCreateClick: () => void
  onRefresh: () => void
}) {
  const [search, setSearch] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')

  const filtered = campaigns.filter((c) => {
    if (selectedPlatform !== 'all' && c.platform !== selectedPlatform) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleStatusChange = async (id: string, status: CampaignStatus) => {
    await setCampaignStatus(id, status)
    onRefresh()
  }

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت تأكد من إيقاف وحذف هذه الحملة؟')) {
      await deleteCampaign(id)
      onRefresh()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-[#C4D8E5]">
        <div className="relative w-full sm:w-72">
          <Search className="absolute start-3.5 top-3 size-4 text-[#527094]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="البحث باسم الحملة..."
            className="w-full rounded-2xl border border-[#C4D8E5] bg-[#E8ECEF]/60 py-2 ps-10 pe-4 text-xs font-bold text-[#1C2B48] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="rounded-2xl border border-[#C4D8E5] bg-[#E8ECEF]/60 px-3 py-2 text-xs font-bold text-[#1C2B48] focus:outline-none"
          >
            <option value="all">جميع المنصات</option>
            <option value="meta">Meta Ads</option>
            <option value="google">Google Ads</option>
            <option value="tiktok">TikTok Ads</option>
            <option value="snapchat">Snapchat Ads</option>
          </select>

          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 rounded-2xl bg-[#1C2B48] text-white px-4 py-2 text-xs font-bold hover:bg-[#131e33] transition-all cursor-pointer"
          >
            <Plus className="size-4" />
            <span>إنشاء حملة</span>
          </button>
        </div>
      </div>

      <Card className="overflow-hidden border border-[#C4D8E5] rounded-3xl bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs font-tajawal">
            <thead className="bg-[#1C2B48] text-white font-bold">
              <tr>
                <th className="p-4 text-start">اسم الحملة والخدمة</th>
                <th className="p-4 text-start">المنصة</th>
                <th className="p-4 text-start">الحالة</th>
                <th className="p-4 text-start">الميزانية والإنفاق</th>
                <th className="p-4 text-start">Leads</th>
                <th className="p-4 text-start">CPL (تكلفة/عميل)</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C4D8E5]/40 font-medium text-[#1C2B48]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#527094]">
                    لا توجد حملات متاحة حالياً. قم بإنشاء حملة إعلانية جديدة.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const platform = PLATFORM_INFO[c.platform]
                  const cpl = c.leads > 0 ? Math.round(c.spend / c.leads) : 0
                  return (
                    <tr key={c.id} className="hover:bg-[#E8ECEF]/40 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-[#1C2B48] text-sm">{c.name}</p>
                        <p className="text-[11px] text-[#527094]">{c.service}</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${platform?.bg}`}>
                          {platform?.name}
                        </span>
                      </td>
                      <td className="p-4">
                        {c.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                            ● نشطة
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                            ❚❚ متوقفة
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-xs">
                        {c.spend.toLocaleString()} / {c.budget.toLocaleString()} ر.س
                      </td>
                      <td className="p-4 font-mono font-bold text-sm">{c.leads}</td>
                      <td className="p-4 font-mono font-bold text-xs">{cpl} ر.س</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {c.status === 'active' ? (
                            <button
                              onClick={() => handleStatusChange(c.id, 'paused')}
                              className="p-1.5 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200"
                            >
                              <Pause className="size-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(c.id, 'active')}
                              className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            >
                              <Play className="size-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ===== MODULE 3: AI STUDIO LIVE =====
const CAMPAIGN_STYLES = [
  { id: 'executive', name: 'تنفيذي فاخر', hint: 'إضاءة سينمائية، تكوين راقٍ، كحلي وذهبي', icon: '✦' },
  { id: 'editorial', name: 'تحريري حديث', hint: 'مساحات نظيفة، واقعية معاصرة، ثقة ووضوح', icon: '◫' },
  { id: 'corporate', name: 'شركات احترافي', hint: 'بيئة أعمال سعودية، موثوق، واقعي', icon: '◆' },
  { id: 'minimal', name: 'هادئ ومينيمال', hint: 'عنصر بصري واحد، تباين أنيق، بدون ازدحام', icon: '○' },
] as const

const CAMPAIGN_TEMPLATES = [
  {
    name: 'تأسيس الشركات', service: 'تأسيس الشركات', headline: 'ابدأ شركتك على أساس قانوني راسخ',
    subheadline: 'دراسة الكيان وإعداد المستندات ومتابعة الإجراءات النظامية', cta: 'اطلب دراسة احتياجك',
    scene: 'رائد أعمال سعودي في مكتب حديث يراجع مستندات تأسيس شركة مع مستشار قانوني، أجواء نجاح وثقة',
  },
  {
    name: 'العقود التجارية', service: 'العقود التجارية', headline: 'عقد واضح ينظم علاقتك التجارية',
    subheadline: 'صياغة ومراجعة البنود والحقوق والالتزامات وفق طبيعة التعامل', cta: 'اطلب مراجعة عقدك',
    scene: 'لقطة مقرّبة أنيقة لعقد تجاري على طاولة اجتماع فاخرة مع قلم وتفاصيل مكتب سعودي معاصر',
  },
  {
    name: 'الاستشارات القانونية', service: 'الاستشارات القانونية', headline: 'قرارك القانوني يبدأ برؤية واضحة',
    subheadline: 'دراسة قانونية توضح الموقف والخيارات المتاحة', cta: 'اطلب استشارة',
    scene: 'مستشار قانوني سعودي محترف في اجتماع استشاري راقٍ، ضوء طبيعي، تعبير واثق وودود',
  },
] as const

function AiStudioModule({ providers: _providers, brandKit }: { providers: AIProviderConfig[]; brandKit?: BrandKit }) {
  const [platform, setPlatform] = useState<'instagram' | 'story' | 'linkedin'>('instagram')
  const [style, setStyle] = useState<(typeof CAMPAIGN_STYLES)[number]['id']>('executive')
  const [service, setService] = useState('تأسيس الشركات')
  const [headline, setHeadline] = useState('ابدأ شركتك على أساس قانوني راسخ')
  const [subheadline, setSubheadline] = useState('دراسة الكيان وإعداد المستندات ومتابعة الإجراءات النظامية')
  const [cta, setCta] = useState('احجز استشارتك')
  const [scene, setScene] = useState('رائد أعمال سعودي في مكتب حديث يراجع مستندات تأسيس شركة مع مستشار قانوني، أجواء نجاح وثقة')
  const [quality, setQuality] = useState<'medium' | 'high'>(brandKit?.generationDefaults?.quality || 'medium')
  const [campaignFont, setCampaignFont] = useState(brandKit?.defaultFont || 'Tajawal')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const size = platform === 'story' ? '1024x1536' : platform === 'linkedin' ? '1536x1024' : '1024x1024'
  const selectedStyle = CAMPAIGN_STYLES.find((item) => item.id === style) || CAMPAIGN_STYLES[0]

  const applyTemplate = (template: (typeof CAMPAIGN_TEMPLATES)[number]) => {
    setService(template.service)
    setHeadline(template.headline)
    setSubheadline(template.subheadline)
    setCta(template.cta)
    setScene(template.scene)
  }

  const handleCampaignGenerate = async () => {
    if (!scene.trim() || !headline.trim()) return
    if (quality === 'high' && brandKit?.generationDefaults?.confirmHighQuality) {
      const approved = window.confirm('الجودة العالية أعلى تكلفة من المتوسطة. هل تريد إنشاء صورة واحدة بالجودة العالية؟')
      if (!approved) return
    }
    setIsGenerating(true)
    setErrorMsg(null)
    setImageUrl(null)

    const prompt = `صمّم إعلان حملة قانونية سعودي جاهز للنشر.
المشهد الرئيسي: ${scene.trim()}.
الأسلوب البصري: ${selectedStyle.name} — ${selectedStyle.hint}.
المنصة: ${platform === 'instagram' ? 'منشور إنستغرام مربع' : platform === 'story' ? 'ستوري إنستغرام طولي' : 'إعلان لينكدإن عرضي'}.
التكوين: صورة واقعية عالية الجودة مع مساحة نص واضحة ومتوازنة، تسلسل بصري احترافي، وهوامش آمنة.
الخط المطلوب للنصوص: ${campaignFont}. استخدم طابع هذا الخط أو أقرب خط عربي احترافي واضح، ولا تقلّد خط الشعار.
اكتب النصوص العربية التالية حرفيًا فقط، بخط عربي واضح وأنيق، من اليمين إلى اليسار، دون تغيير أو أخطاء إملائية:
العنوان الرئيسي الكبير: «${headline.trim()}»
النص المساند: «${subheadline.trim()}»
زر الدعوة للإجراء: «${cta.trim()}»
ضوابط مهنية ملزمة: لا تضف ضمانًا لنتيجة أو مدة، ولا توحِ بالفوز أو التحصيل المؤكد، ولا تستخدم مقارنة أو انتقاصًا من الآخرين، ولا تضف رقم خبرة أو ترخيص أو إنجاز غير وارد في النص المعتمد.
لا تضف أي نص آخر، ولا شعارًا وهميًا، ولا حروفًا لاتينية. اجعل النتيجة إعلان وكالة إبداعية سعودية فاخرة وجاهزًا للنشر.`

    const result = await generateRealImageWithAI(undefined, prompt, 'openai', {
      size,
      quality,
      serviceName: service,
      brandInstructions: `${brandKit?.aiInstructions || ''} الألوان الرسمية: #243447 و#33485E و#D4AF7A و#BFBAB0 و#F4F0EB. استخدم زخرفة هندسية عربية رفيعة عند حافة واحدة فقط، ولا تولّد شعارًا بديلًا أو مزيفًا.`,
    })

    setIsGenerating(false)
    if (result.success && result.url) setImageUrl(result.url)
    else setErrorMsg(result.error || 'تعذر توليد تصميم الحملة.')
  }

  return (
    <div className="space-y-5 font-tajawal">
      <div className="relative overflow-hidden rounded-[28px] bg-[#14213D] px-6 py-6 text-white shadow-xl">
        <div className="absolute -left-16 -top-20 size-56 rounded-full bg-[#C4A35A]/15 blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl border border-[#C4A35A]/40 bg-[#C4A35A]/10">
              <Wand2 className="size-6 text-[#E5C675]" />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2 text-[11px] font-bold text-[#E5C675]">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> GPT IMAGE 2 · الهوية الرسمية محفوظة
              </div>
              <h2 className="font-amiri text-2xl font-bold">استوديو الحملات الإبداعية</h2>
              <p className="mt-1 text-xs text-white/65">حوّل فكرة الحملة إلى تصميم عربي احترافي جاهز للنشر خلال دقائق.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5">
            {[
              { id: 'instagram', label: 'منشور 1:1' },
              { id: 'story', label: 'ستوري 2:3' },
              { id: 'linkedin', label: 'لينكدإن 3:2' },
            ].map((item) => (
              <button key={item.id} onClick={() => setPlatform(item.id as typeof platform)}
                className={`rounded-xl px-3 py-2 text-[11px] font-bold transition ${platform === item.id ? 'bg-[#C4A35A] text-[#14213D] shadow' : 'text-white/70 hover:bg-white/10'}`}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <Card className="xl:col-span-2 overflow-hidden rounded-[28px] border border-[#C4D8E5] bg-white shadow-sm">
          <div className="border-b border-[#E1EAF0] bg-[#F8FAFC] px-6 py-4">
            <div className="flex items-center justify-between">
              <div><p className="text-[10px] font-extrabold text-[#C4A35A]">إعداد الحملة</p><h3 className="mt-0.5 font-amiri text-xl font-bold text-[#1C2B48]">المحتوى والتوجيه الإبداعي</h3></div>
              <SlidersHorizontal className="size-5 text-[#8EB1D1]" />
            </div>
          </div>

          <div className="max-h-[720px] space-y-5 overflow-y-auto p-6">
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-[#1C2B48]">قوالب حملات جاهزة</label>
              <div className="flex flex-wrap gap-2">
                {CAMPAIGN_TEMPLATES.map((template) => (
                  <button key={template.name} onClick={() => applyTemplate(template)} className="rounded-full border border-[#C4D8E5] bg-[#F8FAFC] px-3 py-1.5 text-[11px] font-bold text-[#527094] transition hover:border-[#C4A35A] hover:bg-[#FFF9EA] hover:text-[#1C2B48]">
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1.5 text-xs font-bold text-[#527094]">الخدمة
                <select value={service} onChange={(e) => setService(e.target.value)} className="w-full rounded-xl border border-[#C4D8E5] bg-white p-2.5 font-bold text-[#1C2B48] outline-none focus:border-[#C4A35A]">
                  <option>تأسيس الشركات</option><option>العقود التجارية</option><option>الاستشارات القانونية</option><option>القضايا التجارية</option><option>الملكية الفكرية</option>
                </select>
              </label>
              <label className="space-y-1.5 text-xs font-bold text-[#527094]">جودة الإخراج
                <select value={quality} onChange={(e) => setQuality(e.target.value as typeof quality)} className="w-full rounded-xl border border-[#C4D8E5] bg-white p-2.5 font-bold text-[#1C2B48] outline-none focus:border-[#C4A35A]">
                  <option value="medium">متوسطة · موفرة وأسرع</option><option value="high">عالية · تكلفة أكبر</option>
                </select>
              </label>
            </div>

            <div className="rounded-2xl border border-[#D4AF7A]/40 bg-[#F4F0EB] p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-emerald-700" /><span className="text-xs font-extrabold text-[#243447]">هوية بن نوح الرسمية</span></div>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">محفوظة</span>
              </div>
              <div className="flex items-center gap-2">
                {['#243447', '#33485E', '#D4AF7A', '#BFBAB0', '#F4F0EB'].map((color) => (
                  <span key={color} title={color} className="size-7 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: color }} />
                ))}
                <span className="ms-1 text-[9px] leading-4 text-[#64788C]">تُطبق تلقائيًا<br />دون تحليل إضافي</span>
              </div>
            </div>

            <label className="block space-y-1.5 text-xs font-bold text-[#527094]">خط الحملة العربية
              <select value={campaignFont} onChange={(e) => setCampaignFont(e.target.value)} className="w-full rounded-xl border border-[#C4D8E5] bg-white p-2.5 font-bold text-[#1C2B48] outline-none focus:border-[#D4AF7A]">
                {(brandKit?.fonts || ['Tajawal', 'Amiri', 'Cairo', 'Noto Kufi Arabic', 'Noto Naskh Arabic']).map((font) => <option key={font} value={font}>{font}</option>)}
              </select>
              <span className="block text-[9px] font-medium text-[#8AA2B9]">الخط مستقل عن خط الشعار ويمكن تغييره لكل حملة.</span>
            </label>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-[#1C2B48]">الأسلوب البصري</label>
              <div className="grid grid-cols-2 gap-2">
                {CAMPAIGN_STYLES.map((item) => (
                  <button key={item.id} onClick={() => setStyle(item.id)} className={`rounded-2xl border p-3 text-start transition ${style === item.id ? 'border-[#C4A35A] bg-[#FFF9EA] ring-1 ring-[#C4A35A]/30' : 'border-[#D8E4EC] bg-white hover:bg-[#F8FAFC]'}`}>
                    <span className="text-lg text-[#C4A35A]">{item.icon}</span><span className="ms-2 text-xs font-extrabold text-[#1C2B48]">{item.name}</span>
                    <p className="mt-1 text-[9px] leading-relaxed text-[#7890A9]">{item.hint}</p>
                  </button>
                ))}
              </div>
            </div>

            <label className="block space-y-1.5 text-xs font-extrabold text-[#1C2B48]">المشهد المطلوب
              <textarea rows={3} value={scene} onChange={(e) => setScene(e.target.value)} className="w-full resize-none rounded-2xl border border-[#C4D8E5] bg-[#F8FAFC] p-3 text-xs font-medium leading-relaxed text-[#1C2B48] outline-none focus:border-[#C4A35A] focus:bg-white" />
            </label>

            <div className="space-y-3 rounded-2xl border border-[#DCE6ED] bg-[#F8FAFC] p-4">
              <div className="flex items-center gap-2"><FileText className="size-4 text-[#C4A35A]" /><span className="text-xs font-extrabold text-[#1C2B48]">النص العربي داخل التصميم</span></div>
              <label className="block text-[10px] font-bold text-[#7890A9]">العنوان الرئيسي<input value={headline} onChange={(e) => setHeadline(e.target.value)} maxLength={60} className="mt-1 w-full rounded-xl border border-[#D7E3EB] bg-white p-2.5 text-xs font-bold text-[#1C2B48] outline-none focus:border-[#C4A35A]" /></label>
              <label className="block text-[10px] font-bold text-[#7890A9]">النص المساند<input value={subheadline} onChange={(e) => setSubheadline(e.target.value)} maxLength={90} className="mt-1 w-full rounded-xl border border-[#D7E3EB] bg-white p-2.5 text-xs font-bold text-[#1C2B48] outline-none focus:border-[#C4A35A]" /></label>
              <label className="block text-[10px] font-bold text-[#7890A9]">زر الإجراء<input value={cta} onChange={(e) => setCta(e.target.value)} maxLength={28} className="mt-1 w-full rounded-xl border border-[#D7E3EB] bg-white p-2.5 text-xs font-bold text-[#1C2B48] outline-none focus:border-[#C4A35A]" /></label>
            </div>

            <button onClick={handleCampaignGenerate} disabled={isGenerating || !scene.trim() || !headline.trim()} className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#243447] py-3.5 text-xs font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#33485E] disabled:translate-y-0 disabled:opacity-50">
              {isGenerating ? <RefreshCw className="size-4 animate-spin text-[#E5C675]" /> : <Sparkles className="size-4 text-[#E5C675]" />}
              {isGenerating ? 'نصنع حملتك الآن…' : 'إنشاء تصميم الحملة الاحترافي'}
            </button>
            <p className="text-center text-[9px] font-medium text-[#8AA2B9]">صورة واحدة فقط في كل ضغطة لمنع الصرف غير المقصود.</p>
          </div>
        </Card>

        <Card className="xl:col-span-3 flex min-h-[720px] flex-col overflow-hidden rounded-[28px] border border-[#C4D8E5] bg-[#EEF3F6] shadow-sm">
          <div className="flex items-center justify-between border-b border-[#D7E2E9] bg-white px-6 py-4">
            <div><p className="text-[10px] font-extrabold text-[#8AA2B9]">لوحة المعاينة</p><h3 className="font-amiri text-lg font-bold text-[#1C2B48]">تصميم الحملة النهائي</h3></div>
            <div className="flex items-center gap-2"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">{size}</span><span className="rounded-full bg-[#FFF5D9] px-2.5 py-1 text-[10px] font-bold text-[#947529]">{quality === 'high' ? 'جودة عالية' : 'جودة متوسطة'}</span></div>
          </div>

          <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
            {errorMsg ? (
              <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-5 text-center shadow-sm"><AlertTriangle className="mx-auto mb-3 size-8 text-rose-500" /><p className="text-xs font-bold leading-relaxed text-rose-800">{errorMsg}</p></div>
            ) : isGenerating ? (
              <div className="text-center"><div className="relative mx-auto mb-5 size-20"><div className="absolute inset-0 rounded-full border-2 border-[#C4A35A]/20" /><div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#C4A35A]" /><Wand2 className="absolute inset-0 m-auto size-7 text-[#1C2B48]" /></div><h4 className="font-amiri text-xl font-bold text-[#1C2B48]">جاري بناء التصميم</h4><p className="mt-2 text-xs text-[#7890A9]">تكوين المشهد، ضبط الهوية، وكتابة النص العربي…</p></div>
            ) : imageUrl ? (
              <div className="w-full space-y-4">
                <div className="mx-auto overflow-hidden rounded-2xl bg-[#14213D] p-2 shadow-2xl" style={{ maxWidth: platform === 'story' ? 470 : 760 }}><img src={imageUrl} alt="تصميم حملة قانونية مولد بالذكاء الاصطناعي" className="max-h-[590px] w-full rounded-xl object-contain" /></div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <a href={imageUrl} download={`bin-nouh-campaign-${Date.now()}.png`} className="flex items-center gap-2 rounded-xl bg-[#1C2B48] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#14213D]"><Download className="size-4 text-[#E5C675]" />تحميل PNG</a>
                  <button onClick={handleCampaignGenerate} className="flex items-center gap-2 rounded-xl border border-[#C4D8E5] bg-white px-4 py-2.5 text-xs font-bold text-[#1C2B48] hover:border-[#C4A35A]"><RefreshCw className="size-4" />إنشاء نسخة أخرى</button>
                </div>
              </div>
            ) : (
              <div className="max-w-md text-center"><div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-[26px] border border-[#C4A35A]/30 bg-white shadow-sm"><ImageIcon className="size-9 text-[#C4A35A]" /></div><h4 className="font-amiri text-2xl font-bold text-[#1C2B48]">حملتك تبدأ من هنا</h4><p className="mt-2 text-xs leading-6 text-[#7890A9]">اختر قالبًا، عدّل النص والمشهد، ثم دع الاستوديو يصنع لك تصميمًا عربيًا أنيقًا جاهزًا للنشر.</p><div className="mt-5 flex justify-center gap-3 text-[10px] font-bold text-[#7890A9]"><span>✓ كتابة عربية</span><span>✓ هوية بن نوح</span><span>✓ دقة عالية</span></div></div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

function LegacyAiStudioModule({ providers, brandKit }: { providers: AIProviderConfig[]; brandKit?: BrandKit }) {
  const [studioType, setStudioType] = useState<'text' | 'image' | 'video'>('text')
  const [selectedProvider, setSelectedProvider] = useState<string>('openai')
  const [promptText, setPromptText] = useState('')
  const [customApiKey, setCustomApiKey] = useState('')
  const [imageSize, setImageSize] = useState<'1024x1024' | '1024x1536' | '1536x1024'>('1024x1024')
  const [imageQuality, setImageQuality] = useState<'medium' | 'high'>('high')
  const [service, setService] = useState('تأسيس الشركات')
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!promptText.trim()) return
    setIsGenerating(true)
    setErrorMsg(null)
    setGeneratedOutput(null)
    setImageUrl(null)

    if (studioType === 'image') {
      const res = await generateRealImageWithAI(undefined, promptText, selectedProvider as any, {
        size: imageSize,
        quality: imageQuality,
        serviceName: service,
        brandInstructions: brandKit?.aiInstructions,
      })
      setIsGenerating(false)
      if (res.success && res.url) {
        setImageUrl(res.url)
        const providerTag = res.providerName ? ` [المزود: ${res.providerName}]` : ''
        if (res.promptText) {
          setGeneratedOutput(`🎨 **الوصف البصري المولد بالذكاء الاصطناعي${providerTag}:**\n"${res.promptText}"`)
        }
      } else {
        setErrorMsg(res.error || 'تعذر توليد الصورة، يرجى التأكد من مفتاح OpenAI الخاص بك أو اختيار المحرك المجاني.')
      }
      return
    }

    // توليد نصوص مباشر عبر API
    const systemPrompt = `أنت المساعد الذكي لمكتب «${BRAND.nameAr}» للمحاماة والاستشارات القانونية بالرياض. التزم بنبرة: ${brandKit?.toneOfVoice || 'احترافي، موثوق، يعكس الفخامة'}. الكلمات المفضلة: ${brandKit?.preferredWords?.join(', ')}.`

    const res = await generateRealTextWithAI({
      providerId: selectedProvider,
      prompt: `الخدمة المستهدفة: ${service}\nالطلب: ${promptText}`,
      systemInstruction: systemPrompt,
      apiKey: customApiKey,
    })

    setIsGenerating(false)

    if (res.success) {
      setGeneratedOutput(res.content)
    } else {
      setErrorMsg(res.error || 'تعذر الاتصال بمزود الذكاء الاصطناعي.')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-tajawal">
      {/* Input Options */}
      <Card className="lg:col-span-1 p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-xs space-y-5">
        <div className="flex items-center gap-2 border-b border-[#C4D8E5]/60 pb-3">
          <Wand2 className="size-5 text-[#C4A35A]" />
          <h3 className="font-amiri text-lg font-bold text-[#1C2B48]">خيارات التوليد والمزود الحي</h3>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#527094]">نوع المحتوى المراد صناعته</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'text', label: 'نصوص وإعلانات', icon: FileText },
              { id: 'image', label: 'تصاميم وصور', icon: ImageIcon },
              { id: 'video', label: 'سكربت فيديو', icon: Video },
            ].map((st) => {
              const Icon = st.icon
              const active = studioType === st.id
              return (
                <button
                  key={st.id}
                  onClick={() => {
                    setStudioType(st.id as any)
                    if (st.id === 'image') setSelectedProvider('openai')
                  }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                    active ? 'bg-[#1C2B48] text-white border-[#1C2B48]' : 'bg-[#E8ECEF]/50 text-[#527094] border-[#C4D8E5]/60'
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{st.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#527094]">اختيار المزود (AI Provider Layer)</label>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="w-full rounded-2xl border border-[#C4D8E5] bg-[#E8ECEF]/60 p-2.5 text-xs font-bold text-[#1C2B48] focus:outline-none"
          >
            <option value="openai">OpenAI {studioType === 'image' ? '(GPT Image 2)' : '(للنصوص)'}</option>
            {studioType !== 'image' && <option value="openrouter">OpenRouter AI</option>}
          </select>
        </div>

        {studioType !== 'image' && <div className="space-y-2">
          <label className="text-xs font-bold text-[#527094]">مفتاح API الخاص بك (اختياري إذا أضيف بـ .env)</label>
          <div className="relative">
            <Key className="absolute start-3 top-3 size-4 text-[#527094]" />
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full rounded-2xl border border-[#C4D8E5] bg-[#E8ECEF]/60 py-2.5 ps-9 pe-3 text-xs font-mono text-[#1C2B48]"
            />
          </div>
        </div>}

        {studioType === 'image' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#527094]">مقاس الصورة</label>
              <select
                value={imageSize}
                onChange={(e) => setImageSize(e.target.value as typeof imageSize)}
                className="w-full rounded-2xl border border-[#C4D8E5] bg-[#E8ECEF]/60 p-2.5 text-xs font-bold text-[#1C2B48]"
              >
                <option value="1024x1024">مربع 1:1</option>
                <option value="1024x1536">طولي 2:3</option>
                <option value="1536x1024">عرضي 3:2</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#527094]">الجودة</label>
              <select
                value={imageQuality}
                onChange={(e) => setImageQuality(e.target.value as typeof imageQuality)}
                className="w-full rounded-2xl border border-[#C4D8E5] bg-[#E8ECEF]/60 p-2.5 text-xs font-bold text-[#1C2B48]"
              >
                <option value="high">عالية</option>
                <option value="medium">متوسطة</option>
              </select>
            </div>
            <p className="col-span-2 text-[11px] leading-relaxed text-[#527094]">
              المفتاح محفوظ في الخادم ولا يُرسل إلى المتصفح. اكتب فكرتك كما تريد وسيحافظ المولد على توجيهك البصري.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#527094]">وصف الفكرة للـAI المباشر</label>
          <textarea
            rows={4}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="اكتب لي إعلان لمنصة إنستغرام عن تأسيس الشركات بالرياض..."
            className="w-full rounded-2xl border border-[#C4D8E5] bg-[#E8ECEF]/60 p-3 text-xs font-bold text-[#1C2B48] focus:outline-none"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !promptText.trim()}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1C2B48] to-[#131e33] text-white py-3 text-xs font-bold hover:brightness-110 transition-all cursor-pointer shadow-md disabled:opacity-50"
        >
          {isGenerating ? <RefreshCw className="size-4 animate-spin text-[#C4A35A]" /> : <Wand2 className="size-4 text-[#C4A35A]" />}
          <span>{isGenerating ? 'جاري الاتصال وإجراء التوليد المباشر...' : 'توليد بالذكاء الاصطناعي الحقيقي'}</span>
        </button>
      </Card>

      {/* Output Preview */}
      <Card className="lg:col-span-2 p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-xs flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between border-b border-[#C4D8E5]/60 pb-3 mb-4">
            <h3 className="font-amiri text-lg font-bold text-[#1C2B48]">نتيجة التوليد الحقيقية المباشرة (Live Output)</h3>
            <span className="text-xs font-bold text-[#8EB1D1] bg-[#E8ECEF] px-3 py-1 rounded-full">
              تكامل حي المزامنة
            </span>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-bold">
                <AlertTriangle className="size-4" /> تنبيه الاتصال بالمزود:
              </div>
              <p className="leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {!generatedOutput && !imageUrl && !errorMsg && (
            <div className="flex flex-col items-center justify-center h-64 text-center text-[#527094] space-y-3 border-2 border-dashed border-[#C4D8E5]/80 rounded-2xl p-6">
              <Sparkles className="size-10 text-[#C4A35A]" />
              <p className="text-xs font-bold text-[#1C2B48]">أدخل الفكرة واضغط على "توليد بالذكاء الاصطناعي الحقيقي"</p>
              <p className="text-[11px] text-[#527094]">يتصل بالنموذج الحي مباشرة ويطبق هوية العلامة التجارية</p>
            </div>
          )}

          {imageUrl && (
            <div className="space-y-4 my-2">
              <div className="relative group overflow-hidden rounded-3xl border-2 border-[#C4D8E5] bg-[#1C2B48] p-2 shadow-2xl">
                <img
                  src={imageUrl}
                  alt="AI Generated Design"
                  className="w-full max-h-[500px] object-cover rounded-2xl shadow-lg transition-transform duration-500 hover:scale-[1.01]"
                  onError={() => setErrorMsg('تعذر عرض بيانات الصورة المولدة. أعد المحاولة أو اختر مقاسًا آخر.')}
                />
                <div className="mt-3 flex items-center justify-between px-2 pb-1 text-white">
                  <span className="text-xs font-extrabold flex items-center gap-2 text-[#C4A35A]">
                    <Sparkles className="size-4" />
                    <span>تصميم بصري مكرّر بالذكاء الاصطناعي 4K</span>
                  </span>
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    download="ai_marketing_design.png"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-md transition-all"
                  >
                    <Download className="size-3.5" />
                    <span>تحميل النسخة العالية الدقة HD</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {generatedOutput && (
            <div className="bg-[#E8ECEF]/40 border border-[#C4D8E5] p-5 rounded-2xl text-xs font-bold text-[#1C2B48] space-y-3 whitespace-pre-line leading-relaxed">
              {generatedOutput}
            </div>
          )}
        </div>

        {generatedOutput && (
          <div className="flex items-center gap-3 pt-4 border-t border-[#C4D8E5]/60">
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedOutput)
                alert('تم نسخ النص المولد!')
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E8ECEF] text-[#1C2B48] text-xs font-bold hover:bg-[#C4D8E5]"
            >
              <Copy className="size-4" />
              <span>نسخ النص</span>
            </button>
            <button
              onClick={() => {
                createContentItem({
                  title: `محتوى حقيقي — ${service}`,
                  type: studioType,
                  body: generatedOutput,
                  tags: [service],
                  createdBy: 'أنت',
                })
                alert('تم حفظ المحتوى الحقيقي في المكتبة بنجاح!')
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1C2B48] text-white text-xs font-bold hover:bg-[#131e33]"
            >
              <FileText className="size-4" />
              <span>حفظ في مكتبة المحتوى</span>
            </button>
          </div>
        )}
      </Card>
    </div>
  )
}

// ===== MODULE 4: BRAND KIT =====
function BrandKitModule({ brandKit }: { brandKit?: BrandKit }) {
  const [kit, setKit] = useState<BrandKit>(
    brandKit || {
      tradeName: BRAND.shortNameAr,
      description: 'مكتب محاماة واستشارات قانونية رائد بالرياض',
      services: ['تأسيس الشركات', 'القضايا التجارية', 'قضايا الأحوال الشخصية', 'التوقيع والعقود'],
      logoUrl: '/icons.webp',
      colors: { primary: '#1C2B48', secondary: '#8EB1D1', accent: '#C4A35A' },
      fonts: ['Tajawal', 'Amiri'],
      phone: BRAND.phone,
      email: BRAND.email,
      website: 'https://binnouh.sa',
      social: {},
      toneOfVoice: 'احترافي، رزين، موثوق، يعكس الفخامة القانونية السعودية',
      styleGuidelines: 'الالتزام بالألوان الملكية (الكحلي والذهبي)، وتجنب العبارات التجارية المبتذلة.',
      preferredWords: ['استشارة نظامية', 'حماية حقوقية', 'حكمة واحترافية'],
      bannedWords: ['تخفيضات', 'تصفية', 'أرخص محامي'],
      aiInstructions: 'تذكر دائماً أن يخاطب العميل بتقدير، وأن يبرز نظام الشركات السعودي الحديث.'
    }
  )

  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    await updateBrandKit(kit)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card className="p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-xs space-y-6 font-tajawal">
      <div className="flex items-center justify-between border-b border-[#C4D8E5]/60 pb-4">
        <div>
          <h3 className="font-amiri text-xl font-bold text-[#1C2B48]">هوية العلامة التجارية (Brand Kit)</h3>
          <p className="text-xs text-[#527094]">
            يتم تمرير هذه البيانات تلقائياً للذكاء الاصطناعي الحقيقي أثناء توليد الحملات والمحتوى
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#1C2B48] text-white text-xs font-bold hover:bg-[#131e33] transition-all cursor-pointer shadow-md"
        >
          {saved ? <CheckCircle2 className="size-4 text-emerald-400" /> : <ShieldCheck className="size-4 text-[#C4A35A]" />}
          <span>{saved ? 'تم الحفظ بنجاح!' : 'حفظ إعدادات الهوية'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#527094]">الاسم التجاري للمكتب</label>
            <input
              type="text"
              value={kit.tradeName}
              onChange={(e) => setKit({ ...kit, tradeName: e.target.value })}
              className="w-full rounded-2xl border border-[#C4D8E5] bg-[#E8ECEF]/60 p-2.5 text-xs font-bold text-[#1C2B48]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#527094]">نبرة الصوت (Tone of Voice)</label>
            <textarea
              rows={3}
              value={kit.toneOfVoice}
              onChange={(e) => setKit({ ...kit, toneOfVoice: e.target.value })}
              className="w-full rounded-2xl border border-[#C4D8E5] bg-[#E8ECEF]/60 p-2.5 text-xs font-bold text-[#1C2B48]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#527094]">الكلمات المفضلة لاستخدامها بالذكاء الاصطناعي</label>
            <input
              type="text"
              value={kit.preferredWords.join(', ')}
              onChange={(e) => setKit({ ...kit, preferredWords: e.target.value.split(',').map((s) => s.trim()) })}
              className="w-full rounded-2xl border border-[#C4D8E5] bg-[#E8ECEF]/60 p-2.5 text-xs font-bold text-[#1C2B48]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#527094]">الألوان المعتمدة (Primary, Secondary, Accent)</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="size-6 rounded-full border border-gray-300" style={{ backgroundColor: kit.colors.primary }} />
                <span className="text-xs font-mono font-bold">{kit.colors.primary}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-6 rounded-full border border-gray-300" style={{ backgroundColor: kit.colors.secondary }} />
                <span className="text-xs font-mono font-bold">{kit.colors.secondary}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-6 rounded-full border border-gray-300" style={{ backgroundColor: kit.colors.accent }} />
                <span className="text-xs font-mono font-bold">{kit.colors.accent}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#527094]">تعليمات الذكاء الاصطناعي الخاصة</label>
            <textarea
              rows={3}
              value={kit.aiInstructions}
              onChange={(e) => setKit({ ...kit, aiInstructions: e.target.value })}
              className="w-full rounded-2xl border border-[#C4D8E5] bg-[#E8ECEF]/60 p-2.5 text-xs font-bold text-[#1C2B48]"
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

// ===== MODULE 5: CONTENT =====
function ContentModule({ items }: { items: ContentItem[] }) {
  return (
    <div className="space-y-6 font-tajawal">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.length === 0 ? (
          <Card className="col-span-3 p-8 bg-white border border-[#C4D8E5] rounded-3xl text-center space-y-3">
            <FileText className="size-12 text-[#8EB1D1] mx-auto" />
            <h3 className="font-amiri text-xl font-bold text-[#1C2B48]">المكتبة فارغة</h3>
            <p className="text-xs text-[#527094]">قم بتوليد مقالات ونصوص جديدة عبر استوديو AI ليتم حفظها هنا.</p>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="p-5 bg-white border border-[#C4D8E5] rounded-3xl shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold bg-[#E8ECEF] text-[#1C2B48] px-2.5 py-0.5 rounded-full">
                  {item.type}
                </span>
                <h4 className="font-bold text-sm text-[#1C2B48] mt-2">{item.title}</h4>
                <p className="text-xs text-[#527094] line-clamp-3 mt-1">{item.body}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

// ===== MODULE 6: LEADS =====
function LeadsModule({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <Card className="p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-xs space-y-6 font-tajawal">
      <h3 className="font-amiri text-xl font-bold text-[#1C2B48] border-b border-[#C4D8E5]/60 pb-3">
        إسناد العملاء المحتملين وتتبع التحويلات (UTM Tracking)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-start text-xs">
          <thead className="bg-[#1C2B48] text-white font-bold">
            <tr>
              <th className="p-3 text-start">المنصة</th>
              <th className="p-3 text-start">الحملة</th>
              <th className="p-3 text-start">الخدمة</th>
              <th className="p-3 text-start">العملاء Leads</th>
              <th className="p-3 text-start">التحويلات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#C4D8E5]/40 font-medium text-[#1C2B48]">
            {campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-[#E8ECEF]/40">
                <td className="p-3 font-bold">{PLATFORM_INFO[c.platform]?.name}</td>
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.service}</td>
                <td className="p-3 font-mono font-bold">{c.leads}</td>
                <td className="p-3 font-mono font-bold text-emerald-700">{c.conversions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// ===== MODULE 7: CONNECTIONS =====
function ConnectionsModule({ connections }: { connections: any[] }) {
  const queryClient = useQueryClient()

  const handleConnect = async (platform: PlatformId) => {
    const accessToken = prompt(`أدخل Access Token لـ ${PLATFORM_INFO[platform].name}. سيُرسل مشفرًا إلى الخادم ولن يُحفظ في المتصفح:`)
    if (!accessToken) return
    const credentials: Record<string, string> = { accessToken }
    if (platform === 'google') {
      const developerToken = prompt('أدخل Google Ads Developer Token:')
      if (!developerToken) return
      credentials.developerToken = developerToken
    }
    if (platform === 'tiktok') {
      const advertiserId = prompt('أدخل TikTok Advertiser ID:')
      if (!advertiserId) return
      credentials.advertiserId = advertiserId
    }
    const { data, error } = await supabase.functions.invoke('marketing-platforms', {
      body: { action: 'connect', platform, credentials },
    })
    if (error || !data?.success) {
      let serverMessage = data?.error
      if (!serverMessage && (error as any)?.context) {
        try { serverMessage = (await (error as any).context.json())?.error } catch { /* ignore malformed response */ }
      }
      alert(`فشل التحقق: ${serverMessage || error?.message || 'تعذر الاتصال بالمنصة'}`)
      return
    }
    await queryClient.invalidateQueries({ queryKey: ['mkt-connections'] })
    alert('تم التحقق من الحساب وحفظ بيانات الربط بصورة مشفرة في Supabase Vault.')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-tajawal">
      {connections.map((conn) => {
        const info = PLATFORM_INFO[conn.platform as PlatformId]
        const isConnected = conn.status === 'connected'
        return (
          <Card key={conn.id} className="p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded-2xl text-xs font-bold border ${info?.bg}`}>
                  {info?.iconStr}
                </span>
                <div>
                  <h4 className="font-bold text-sm text-[#1C2B48]">{info?.name}</h4>
                  <p className="text-[11px] text-[#527094]">{conn.accountName || 'غير متصل بعد'}</p>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {isConnected ? '● متصل حقيقي' : 'غير مهيأ'}
              </span>
            </div>

            <div className="border-t border-b border-[#C4D8E5]/50 py-3 text-xs space-y-1 text-[#527094]">
              <p>تاريخ آخر مزامنة حية: <strong className="text-[#1C2B48]">{conn.lastSyncAt ? new Date(conn.lastSyncAt).toLocaleString('ar-SA') : 'لم تتم المزامنة بعد'}</strong></p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handleConnect(conn.platform)}
                className="px-4 py-2 rounded-xl bg-[#1C2B48] text-white text-xs font-bold hover:bg-[#131e33]"
              >
                {isConnected ? 'تحديث المفتاح' : 'ربط الحساب عبر API Key / OAuth'}
              </button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

// ===== MODULE 8: ASSISTANT =====
function AssistantModule({ insights, stats, campaigns }: { insights: AIInsight[]; stats: any; campaigns: Campaign[] }) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: 'أهلاً بك أستاذ بن نوح! أنا مساعدك التسويقي الحقيقي. يسعدني الإجابة على أي استفسارات وتطوير أداء حملاتك.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setLoading(true)

    const res = await generateRealTextWithAI({
      providerId: 'openai',
      prompt: `بيانات المكتب الحالية: إجمالي الإنفاق ${stats?.totalSpend || 0} ريال، عدد الحملات ${campaigns.length}. سؤال المستخدم: ${userMsg}`,
    })

    setLoading(false)

    if (res.success) {
      setMessages((prev) => [...prev, { role: 'assistant', text: res.content }])
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `[رد النظام المباشر]: ${res.error || 'يرجى تزويد مفتاح API الخاص بك في صفحة الإعدادات لتفعيل المحادثة الحية.'}`,
        },
      ])
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-tajawal">
      <Card className="lg:col-span-2 p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-xs flex flex-col justify-between h-[500px]">
        <div className="flex items-center gap-2 border-b border-[#C4D8E5]/60 pb-3">
          <Bot className="size-5 text-[#C4A35A]" />
          <h3 className="font-amiri text-lg font-bold text-[#1C2B48]">المساعد التسويقي الذكي المباشر</h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 my-4 pe-2 scrollbar-thin">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs font-bold leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#1C2B48] text-white rounded-br-none'
                    : 'bg-[#E8ECEF] text-[#1C2B48] rounded-bl-none border border-[#C4D8E5]/60'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-[#C4D8E5]/60">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب سؤالك للمساعد الذكي المباشر..."
            className="flex-1 rounded-2xl border border-[#C4D8E5] bg-[#E8ECEF]/60 px-4 py-2.5 text-xs font-bold text-[#1C2B48] focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="rounded-2xl bg-[#1C2B48] text-white p-2.5 hover:bg-[#131e33] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="size-4 animate-spin" /> : <Send className="size-4" />}
          </button>
        </div>
      </Card>

      <Card className="lg:col-span-1 p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-xs space-y-4">
        <h3 className="font-amiri text-lg font-bold text-[#1C2B48] border-b border-[#C4D8E5]/60 pb-3">توصيات وتحليلات الـAI</h3>
        <div className="space-y-3">
          {insights.map((insight) => (
            <div key={insight.id} className="p-3.5 rounded-2xl border border-[#C4D8E5] bg-[#E8ECEF]/40 space-y-2 text-xs font-bold text-[#1C2B48]">
              <p>{insight.text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ===== MODULE 9: SETTINGS & AUDIT =====
function SettingsModule({ providers, auditLogs }: { providers: AIProviderConfig[]; auditLogs: any[] }) {
  return (
    <div className="space-y-6 font-tajawal">
      <Card className="p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-xs space-y-4">
        <h3 className="font-amiri text-xl font-bold text-[#1C2B48] border-b border-[#C4D8E5]/60 pb-3">
          إعدادات مزودي الذكاء الاصطناعي الحقيقيين (AI Providers & API Keys)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {providers.map((p) => (
            <div key={p.id} className="p-4 rounded-2xl border border-[#C4D8E5] bg-[#E8ECEF]/30 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#1C2B48]">{p.name}</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                  {p.status === 'active' ? 'نشط' : 'غير مفعل'}
                </span>
              </div>
              <input
                type="password"
                placeholder="أدخل API Key الحقيقي"
                className="w-full rounded-xl border border-[#C4D8E5] bg-white p-2 text-xs font-mono"
              />
              <button
                onClick={() => updateAiProvider(p.id, { apiKey: 'user-provided-key' })}
                className="w-full py-1.5 rounded-xl bg-[#1C2B48] text-white text-xs font-bold hover:bg-[#131e33]"
              >
                حفظ المفتاح المشفر
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-xs space-y-4">
        <h3 className="font-amiri text-xl font-bold text-[#1C2B48] border-b border-[#C4D8E5]/60 pb-3">
          سجل عمليات التسويق والتدقيق (Audit Logs)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs font-tajawal">
            <thead className="bg-[#1C2B48] text-white font-bold">
              <tr>
                <th className="p-3 text-start">المستخدم</th>
                <th className="p-3 text-start">الإجراء</th>
                <th className="p-3 text-start">نوع الكيان</th>
                <th className="p-3 text-start">التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C4D8E5]/40 text-[#1C2B48] font-medium">
              {auditLogs.slice(0, 10).map((log) => (
                <tr key={log.id} className="hover:bg-[#E8ECEF]/40">
                  <td className="p-3 font-bold">{log.userName}</td>
                  <td className="p-3">{log.action}</td>
                  <td className="p-3 font-mono text-[11px]">{log.entityType}</td>
                  <td className="p-3 font-mono text-[11px]">{new Date(log.createdAt).toLocaleString('ar-SA')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ===== CREATE CAMPAIGN WIZARD =====
function CreateCampaignModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState('')
  const [platform, setPlatform] = useState<PlatformId>('meta')
  const [budget, setBudget] = useState(3000)

  const handleSubmit = async () => {
    if (!name.trim()) return
    await createCampaign({
      name,
      platform,
      objective: 'leads',
      service: 'تأسيس الشركات',
      budgetType: 'total',
      budget: Number(budget),
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      audience: { location: 'الرياض', ageMin: 25, ageMax: 55, gender: 'all', interests: ['تأسيس الشركات'] }
    })
    onCreated()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C2B48]/70 backdrop-blur-sm p-4 font-tajawal">
      <Card className="w-full max-w-lg bg-white border border-[#C4D8E5] rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#C4D8E5]/60 pb-3">
          <h3 className="font-amiri text-xl font-bold text-[#1C2B48]">إنشاء حملة حقيقية جديدة</h3>
          <button onClick={onClose} className="text-[#527094] hover:text-[#1C2B48]">
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#527094]">اسم الحملة</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="حملة القضايا التجارية..."
              className="w-full rounded-2xl border border-[#C4D8E5] bg-[#E8ECEF]/60 p-2.5 text-xs font-bold text-[#1C2B48]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#527094]">المنصة</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as PlatformId)}
              className="w-full rounded-2xl border border-[#C4D8E5] bg-[#E8ECEF]/60 p-2.5 text-xs font-bold text-[#1C2B48]"
            >
              <option value="meta">Meta Ads</option>
              <option value="google">Google Ads</option>
              <option value="tiktok">TikTok Ads</option>
              <option value="snapchat">Snapchat Ads</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#527094]">الميزانية (ر.س)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full rounded-2xl border border-[#C4D8E5] bg-[#E8ECEF]/60 p-2.5 text-xs font-bold text-[#1C2B48]"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="w-full py-3 rounded-2xl bg-[#1C2B48] text-white text-xs font-bold hover:bg-[#131e33] disabled:opacity-50"
          >
            حفظ وإنشاء الحملة
          </button>
        </div>
      </Card>
    </div>
  )
}
