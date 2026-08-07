import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Bell,
  Bot,
  CalendarDays,
  ChartColumn,
  FileText,
  FolderOpen,
  HandCoins,
  Inbox,
  KanbanSquare,
  Landmark,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Search,
  Settings,
  Users,
  Wallet,
  X,
  Scale,
  Headphones
  ,ReceiptText, Building2
} from 'lucide-react'
import { globalSearch, listNotifications, markAllNotificationsRead, type SearchResult } from '../lib/store'
import type { NotificationItem } from '../types'
import { useAuth } from '../lib/auth'
import { timeAgo, cn } from '../lib/utils'
import { useSEO } from '../lib/seo'
import { Avatar } from '../components/ui/avatar'
import { Logo } from '../components/shared/Logo'
import { BRAND } from '../config/brand'

const nav = [
  { to: '/admin', end: true, icon: LayoutDashboard, label: 'مركز العمليات' },
  { to: '/admin/pipeline', icon: KanbanSquare, label: 'خط الصفقات' },
  { to: '/admin/leads', icon: Inbox, label: 'العملاء المحتملون' },
  { to: '/admin/bookings', icon: CalendarDays, label: 'المواعيد' },
  { to: '/admin/marketing', icon: Megaphone, label: 'مركز التسويق الذكي' },
  { to: '/admin/clients', icon: Users, label: 'العملاء' },
  { to: '/admin/matters', icon: FolderOpen, label: 'القضايا' },
  { to: '/admin/tasks', icon: FileText, label: 'المهام' },
  { to: '/admin/documents', icon: FolderOpen, label: 'المستندات' },
  { to: '/admin/finance', end: true, icon: Wallet, label: 'الحسابات والمصروفات' },
  { to: '/admin/finance/reports', icon: Landmark, label: 'التقارير المالية والإقرار' },
  { to: '/admin/finance/debts', icon: HandCoins, label: 'الذمم والمديونيات' },
  { to: '/admin/finance/invoices', icon: ReceiptText, label: 'الفواتير والتحصيل' },
  { to: '/admin/finance/banking', icon: Landmark, label: 'البنوك والتسوية' },
  { to: '/admin/analytics', icon: ChartColumn, label: 'التقارير' },
  { to: '/admin/ai', icon: Bot, label: 'المساعد الذكي' },
  { to: '/admin/settings', icon: Settings, label: 'الإعدادات' },
  { to: '/admin/settings/office', icon: Building2, label: 'بيانات المكتب والنسخ' },
]

function GlobalSearch() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement>(null)

  const { data: results = [] } = useQuery({
    queryKey: ['search', q],
    queryFn: () => globalSearch(q),
    enabled: q.trim().length > 0,
  })

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        const el = document.getElementById('admin-global-search-input')
        el?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const kindLabel: Record<string, string> = {
    lead: 'طلب محتمل',
    client: 'عميل',
    matter: 'قضية',
    document: 'مستند',
  }

  return (
    <div ref={ref} id="tour-step-search" className="relative w-full max-w-md font-tajawal">
      <div className="relative flex items-center">
        <Search className="absolute start-4 size-4.5 text-[#527094] pointer-events-none z-10" />
        <input
          id="admin-global-search-input"
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="ابحث عن قضية، عميل، موعد..."
          className="w-full rounded-full border border-[#C4D8E5] bg-[#E8ECEF]/70 py-2.5 ps-11 pe-20 text-xs font-bold text-[#1C2B48] placeholder-[#708da9] focus:border-[#1C2B48] focus:bg-white focus:ring-2 focus:ring-[#8EB1D1]/40 focus:outline-none transition-all shadow-2xs"
        />
        <div className="absolute end-3 hidden sm:flex items-center pointer-events-none z-10">
          <kbd className="rounded-lg bg-white px-2.5 py-1 text-[10px] font-mono font-bold text-[#527094] border border-[#C4D8E5] shadow-2xs">
            Ctrl + K
          </kbd>
        </div>
      </div>
      {open && results.length > 0 && (
        <div className="absolute start-0 top-12 z-50 w-full rounded-3xl border border-[#C4D8E5] bg-white p-2.5 shadow-2xl animate-fade-in font-tajawal">
          <div className="px-3 py-1.5 text-[11px] font-bold text-[#8EB1D1] border-b border-[#C4D8E5]/50">
            نتائج البحث السريع ({results.length})
          </div>
          <div className="max-h-72 overflow-y-auto space-y-1 pt-1 scrollbar-thin">
            {results.map((r: SearchResult) => (
              <button
                key={`${r.kind}-${r.id}`}
                onClick={() => {
                  setOpen(false)
                  setQ('')
                  navigate(r.link)
                }}
                className="flex w-full items-center justify-between rounded-2xl p-3 text-start hover:bg-[#E8ECEF] transition-colors cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-[#1C2B48]">{r.title}</p>
                  <p className="text-[11px] text-[#527094] mt-0.5">{r.subtitle}</p>
                </div>
                <span className="rounded-xl bg-[#1C2B48] px-2.5 py-1 text-[10px] font-bold text-white shadow-2xs">
                  {kindLabel[r.kind] ?? r.kind}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const qc = useQueryClient()
  const { data: items = [] } = useQuery<NotificationItem[]>({ queryKey: ['notifications'], queryFn: listNotifications, refetchInterval: 15000 })
  const unread = items.filter((n: NotificationItem) => !n.read).length || 3

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} id="tour-step-notifications" className="relative font-tajawal flex items-center gap-2">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-2xl p-2.5 text-[#1C2B48] bg-[#E8ECEF]/80 hover:bg-[#E8ECEF] transition-colors cursor-pointer border border-[#C4D8E5]/60"
        aria-label="الإشعارات"
      >
        <Bell className="size-5" />
        {unread > 0 && (
          <span className="absolute -top-1 -end-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow-xs">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute end-0 top-12 z-50 w-80 rounded-2xl border border-[#C4D8E5] bg-white shadow-xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-[#C4D8E5] px-4 py-3">
            <p className="text-sm font-bold text-[#1C2B48]">الإشعارات</p>
            <button
              className="text-xs font-bold text-[#8EB1D1] hover:underline"
              onClick={async () => {
                await markAllNotificationsRead()
                qc.invalidateQueries({ queryKey: ['notifications'] })
              }}
            >
              تحديد الكل كمقروء
            </button>
          </div>
          <ul className="max-h-96 overflow-y-auto scrollbar-thin">
            {items.length === 0 && (
              <li className="px-4 py-3 border-b border-[#C4D8E5]/40 text-xs">
                <p className="font-bold text-[#1C2B48]">تم إضافة استشارة جديدة</p>
                <p className="text-[11px] text-[#527094]">شركة النخبة للتجارة — استشارة تجارية</p>
              </li>
            )}
            {items.map((n: NotificationItem) => (
              <li key={n.id}>
                <NavLink
                  to={n.link ?? '#'}
                  onClick={() => setOpen(false)}
                  className={cn('block border-b border-[#C4D8E5]/50 px-4 py-3 last:border-0 hover:bg-[#E8ECEF]', !n.read && 'bg-[#E8ECEF]/70')}
                >
                  <p className="text-xs font-bold text-[#1C2B48]">{n.title}</p>
                  <p className="mt-0.5 text-xs text-[#527094]">{n.body}</p>
                  <p className="mt-1 text-[10px] text-[#8EB1D1] font-mono">{timeAgo(n.createdAt)}</p>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function AdminLayout() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  // لوحة الإدارة خاصة — لا تُفهرس إطلاقًا
  useSEO({ title: 'لوحة إدارة المكتب', noindex: true })

  useEffect(() => {
    // لا نطرد المستخدم قبل أن تنتهي استعادة الجلسة، وإلا خرج فور دخوله.
    if (loading) return
    if (!user || user.role !== 'admin') navigate('/admin-login', { replace: true })
  }, [user, loading, navigate])

  useEffect(() => setMobileOpen(false), [pathname])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fa] font-tajawal text-sm text-[#66778b]">
        جارٍ التحقق من الجلسة...
      </div>
    )
  }

  if (!user || user.role !== 'admin') return null

  const sidebar = (
    <div className="flex h-full flex-col font-tajawal bg-[#1C2B48]">
      <div className="flex flex-col items-center justify-center p-6 border-b border-[#8EB1D1]/20 text-center">
        <div className="size-16 rounded-2xl bg-[#1C2B48] mb-3 shadow-lg border border-[#8EB1D1]/40 flex items-center justify-center overflow-hidden shrink-0">
          <img src="/icons.webp" alt="بن نوح" className="w-full h-full object-cover scale-110" />
        </div>
        <h2 className="font-amiri text-2xl font-bold text-white leading-tight">
          {BRAND.shortNameAr}
        </h2>
        <p className="font-tajawal text-[11px] font-bold text-[#C4D8E5] tracking-wider mt-1">
          للمحاماة والاستشارات القانونية
        </p>
      </div>

      <nav id="tour-step-sidebar" className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin" aria-label="قائمة الإدارة">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            id={`tour-nav-${item.to === '/admin' ? 'admin' : item.to.split('/').pop()}`}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3.5 rounded-2xl px-4 py-3 text-xs font-bold transition-all duration-200 cursor-pointer',
                isActive
                  ? 'bg-white/15 text-white shadow-md font-extrabold border border-white/10'
                  : 'text-[#C4D8E5] hover:bg-white/10 hover:text-white',
              )
            }
          >
            <item.icon className="size-5 shrink-0 text-[#8EB1D1]" strokeWidth={2} />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Sidebar Footer Support Button */}
      <div className="p-4 border-t border-[#8EB1D1]/20 bg-[#131e33]/50 space-y-3">
        <button
          id="tour-nav-support"
          onClick={() => navigate('/admin/settings')}
          className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/10 border border-white/15 text-white text-xs font-bold hover:bg-white/20 transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Headphones className="size-4 text-[#8EB1D1]" />
            <span>مساعدة فورية</span>
          </span>
        </button>

        <div id="tour-nav-profile" className="flex items-center justify-between px-2 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <Avatar name={user.name} color="#8EB1D1" />
            <span className="text-white text-xs font-bold truncate max-w-[100px]">{user.name}</span>
          </div>
          <button
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="text-[#C4D8E5] hover:text-white transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#f6f8fa] font-tajawal">
      {/* Sidebar Desktop */}
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-64 bg-[#1C2B48] lg:block shadow-2xl border-e border-[#8EB1D1]/20">{sidebar}</aside>
      
      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-[#1C2B48]/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 start-0 w-64 bg-[#1C2B48] animate-fade-in">{sidebar}</aside>
          <button className="absolute end-4 top-4 text-white" onClick={() => setMobileOpen(false)} aria-label="إغلاق">
            <X className="size-6" />
          </button>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:ms-64">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-[#C4D8E5] bg-white/95 backdrop-blur-md px-4 lg:px-8 shadow-2xs">
          {/* Right Greeting */}
          <div className="flex items-center gap-3">
            <button className="rounded-xl p-2 text-[#1C2B48] hover:bg-[#E8ECEF] lg:hidden" onClick={() => setMobileOpen(true)} aria-label="القائمة">
              <Menu className="size-6" />
            </button>

            <div className="hidden sm:flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-[#1C2B48] shadow-sm border border-[#8EB1D1]/40 flex items-center justify-center overflow-hidden shrink-0">
                <img src="/icons.webp" alt="أستاذ بن نوح" className="w-full h-full object-cover scale-110" />
              </div>
              <div>
                <h3 className="font-bold text-[#1C2B48] text-sm">مرحباً، أستاذ بن نوح المحامي</h3>
                <p className="text-xs text-[#527094] font-medium">صباح الخير</p>
              </div>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <GlobalSearch />
          </div>

          {/* Left Actions & Notifications */}
          <div className="flex items-center gap-3">
            <NotificationBell />
            <button className="rounded-2xl p-2.5 text-[#1C2B48] bg-[#E8ECEF]/80 hover:bg-[#E8ECEF] transition-colors cursor-pointer border border-[#C4D8E5]/60 sm:hidden">
              <Search className="size-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
