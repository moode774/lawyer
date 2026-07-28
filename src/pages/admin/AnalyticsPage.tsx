import React from 'react'
import { TrendingUp, Users, BarChart2, PieChart as PieChartIcon, ArrowUpRight, ShieldCheck } from 'lucide-react'
import { useT } from '../../lib/i18n'
import { Card } from '../../components/ui/card'
import { PageHeader } from '../../components/ui/page-header'
import { useSEO } from '../../lib/seo'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts'

const ATTRIBUTION_DATA = [
  { source: 'Google Ads', leads: 42, conversions: 18, revenue: 63000 },
  { source: 'SEO / Organic', leads: 28, conversions: 12, revenue: 42000 },
  { source: 'X (Twitter)', leads: 19, conversions: 6, revenue: 21000 },
  { source: 'Direct / Word', leads: 15, conversions: 9, revenue: 31500 },
  { source: 'WhatsApp Ads', leads: 24, conversions: 11, revenue: 38500 }
]

const REVENUE_TREND = [
  { month: 'يناير', revenue: 120000, cases: 14 },
  { month: 'فبراير', revenue: 145000, cases: 18 },
  { month: 'مارس', revenue: 168000, cases: 22 },
  { month: 'أبريل', revenue: 190000, cases: 25 },
  { month: 'مايو', revenue: 235000, cases: 31 }
]

export default function AnalyticsPage() {
  const { t } = useT()
  useSEO({ title: 'تقارير التسويق والتحليلات | ' + t('مكتب المحاماة', 'Law Firm') })

  return (
    <div className="space-y-8 pb-12 font-tajawal">
      <PageHeader
        title={t('تقارير التسويق وإسناد الحملات (Marketing Attribution)', 'Marketing Analytics & Attribution')}
        description={t('قياس القنوات التسويقية الأكثر توليدًا للعملاء والاستشارات والقضايا الربحية', 'Track lead channels, ROI & conversion performance')}
      />

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 font-tajawal">
        <Card className="p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#527094]">إجمالي الزوار هذا الشهر</span>
            <div className="size-11 rounded-2xl bg-[#E8ECEF] text-[#1C2B48] flex items-center justify-center">
              <BarChart2 className="size-5" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-amiri text-3xl font-bold text-[#1C2B48] font-mono">14,250</h3>
            <p className="text-[11px] font-bold text-emerald-600">▲ +24% زوار جدد</p>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#527094]">إجمالي الطلبات المستلمة</span>
            <div className="size-11 rounded-2xl bg-[#E8ECEF] text-[#1C2B48] flex items-center justify-center">
              <Users className="size-5 text-[#8EB1D1]" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-amiri text-3xl font-bold text-[#1C2B48] font-mono">128</h3>
            <p className="text-[11px] font-bold text-emerald-600">▲ +15% مقارنة بالماضي</p>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-[#C4D8E5] rounded-3xl shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#527094]">العائد من استثمار التسويق ROAS</span>
            <div className="size-11 rounded-2xl bg-[#E8ECEF] text-[#1C2B48] flex items-center justify-center">
              <TrendingUp className="size-5 text-[#8EB1D1]" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-amiri text-3xl font-bold text-[#1C2B48] font-mono">4.8x</h3>
            <p className="text-[11px] font-bold text-[#8EB1D1]">أعلى أداء: Google Ads</p>
          </div>
        </Card>
      </div>

      {/* CHART 1: BAR CHART (ATTRIBUTION BY CHANNEL) */}
      <Card className="p-6 sm:p-8 bg-white border border-[#C4D8E5] rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#C4D8E5]/70 pb-4">
          <div className="flex items-center gap-2.5">
            <BarChart2 className="size-5 text-[#1C2B48]" />
            <h3 className="font-amiri text-xl font-bold text-[#1C2B48]">
              {t('توزيع الطلبات والتحويل حسب القناة التسويقية', 'Leads & Conversions by Channel')}
            </h3>
          </div>
          <span className="text-xs font-bold text-[#8EB1D1] bg-[#E8ECEF] px-3 py-1 rounded-full border border-[#C4D8E5]/50">
            بيانات مايو 2025
          </span>
        </div>

        <div className="h-80 w-full font-tajawal">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ATTRIBUTION_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECEF" />
              <XAxis dataKey="source" stroke="#527094" fontSize={12} tick={{ fontWeight: 'bold' }} />
              <YAxis stroke="#527094" fontSize={12} tick={{ fontWeight: 'bold' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1C2B48',
                  borderColor: '#8EB1D1',
                  borderRadius: '16px',
                  color: '#ffffff',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                  fontFamily: 'Tajawal'
                }}
                itemStyle={{ color: '#C4D8E5', fontWeight: 'bold', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ paddingTop: '15px', fontFamily: 'Tajawal', fontWeight: 'bold', fontSize: '13px' }} />
              <Bar dataKey="leads" name="إجمالي الطلبات (Leads)" fill="#1C2B48" radius={[8, 8, 0, 0]} />
              <Bar dataKey="conversions" name="العملاء المحولين (Conversions)" fill="#8EB1D1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* CHART 2: AREA CHART (REVENUE & GROWTH TREND) */}
      <Card className="p-6 sm:p-8 bg-white border border-[#C4D8E5] rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#C4D8E5]/70 pb-4">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="size-5 text-[#1C2B48]" />
            <h3 className="font-amiri text-xl font-bold text-[#1C2B48]">
              {t('اتجاه النمّو المالي وعوائد القضايا والتحصيلات (SAR)', 'Revenue Growth & Collections (SAR)')}
            </h3>
          </div>
          <span className="text-xs font-bold text-[#1C2B48] bg-[#8EB1D1] px-3 py-1 rounded-full">
            نمو متصاعد +42%
          </span>
        </div>

        <div className="h-72 w-full font-tajawal">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_TREND} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8EB1D1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1C2B48" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8ECEF" />
              <XAxis dataKey="month" stroke="#527094" fontSize={12} tick={{ fontWeight: 'bold' }} />
              <YAxis stroke="#527094" fontSize={12} tick={{ fontWeight: 'bold' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1C2B48',
                  borderColor: '#8EB1D1',
                  borderRadius: '16px',
                  color: '#ffffff',
                  fontFamily: 'Tajawal'
                }}
              />
              <Area type="monotone" dataKey="revenue" name="العوائد المالية (ر.س)" stroke="#1C2B48" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

    </div>
  )
}
