import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  Bell,
  CircleHelp,
  FileText,
  FolderOpen,
  Home,
  LogOut,
  MessageSquare,
  ReceiptText,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../lib/auth'
import { Avatar } from '../components/ui/avatar'
import { Logo } from '../components/shared/Logo'
import { cn } from '../lib/utils'
import { useSEO } from '../lib/seo'

const nav = [
  { to: '/portal', end: true, icon: Home, label: 'الرئيسية' },
  { to: '/portal/matters', icon: FolderOpen, label: 'قضاياي' },
  { to: '/portal/documents', icon: FileText, label: 'المستندات' },
  { to: '/portal/appointments', icon: CalendarDays, label: 'المواعيد' },
  { to: '/portal/messages', icon: MessageSquare, label: 'الرسائل' },
  { to: '/portal/invoices', icon: ReceiptText, label: 'الفواتير' },
  { to: '/portal/profile', icon: UserRound, label: 'الملف الشخصي' },
]

export default function PortalLayout() {
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // بوابة العميل خاصة — لا تُفهرس إطلاقًا
  useSEO({ title: 'بوابة العميل', noindex: true })

  useEffect(() => {
    // انتظار انتهاء استعادة الجلسة قبل أي إعادة توجيه.
    if (loading) return
    if (!user || user.role !== 'client') navigate('/login', { replace: true })
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fa] font-tajawal text-sm text-[#66778b]">
        جارٍ التحقق من الجلسة...
      </div>
    )
  }

  if (!user || user.role !== 'client') return null

  return (
    <div className="flex min-h-screen bg-[#F2F5F7] font-tajawal text-[#1C2B48]">
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-[280px] flex-col bg-[#152743] lg:flex border-e border-white/10 shadow-[12px_0_35px_rgba(21,39,67,0.1)]">
        <div className="flex h-24 items-center border-b border-white/10 px-7">
          <Logo dark />
        </div>
        <p className="px-7 pb-2 pt-7 font-reem text-[11px] font-bold tracking-wider text-[#9FB9CC]">
          بوابة العميل الرقمية
        </p>
        <nav className="flex-1 space-y-1 p-4" aria-label="قائمة البوابة">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-xs font-bold transition-all duration-200',
                  isActive ? 'bg-white text-[#152743] shadow-lg font-extrabold' : 'text-[#C8D6E0] hover:bg-white/10 hover:text-white',
                )
              }
            >
              <item.icon className="size-4.5 shrink-0" strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4 bg-[#102036]">
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3">
            <Avatar name={user.name} color="#8EB1D1" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{user.name}</p>
              <p className="text-[10px] text-[#9FB9CC] font-reem">حساب عميل</p>
            </div>
            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
              className="rounded-xl p-2 text-[#C4D8E5] hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              aria-label="تسجيل الخروج"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:ms-[280px]">
        {/* شريط علوي للجوال */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-[#D6E1E9] bg-white/90 backdrop-blur-md px-4 lg:hidden">
          <Logo compact />
          <span className="ms-3 font-reem text-sm font-bold text-[#1C2B48]">بوابة العميل</span>
        </header>

        <header className="sticky top-0 z-20 hidden h-20 items-center justify-between border-b border-[#DCE5EB] bg-white/90 px-8 backdrop-blur-md lg:flex">
          <div>
            <p className="text-[11px] font-bold text-[#7890A9]">مساحتك القانونية</p>
            <p className="mt-1 text-sm font-bold text-[#152743]">متابعة الملفات والتواصل مع الفريق</p>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/contact" className="flex items-center gap-2 rounded-xl border border-[#D6E1E9] bg-white px-3.5 py-2.5 text-xs font-bold text-[#527094] hover:bg-[#F2F5F7]">
              <CircleHelp className="size-4" /> مساعدة
            </NavLink>
            <button aria-label="الإشعارات" className="relative rounded-xl border border-[#D6E1E9] bg-white p-2.5 text-[#527094] hover:bg-[#F2F5F7]">
              <Bell className="size-4" />
            </button>
            <div className="ms-2 flex items-center gap-3 border-s border-[#D6E1E9] ps-4">
              <Avatar name={user.name} color="#8EB1D1" />
              <div><p className="text-xs font-bold text-[#152743]">{user.name}</p><p className="text-[10px] text-[#7890A9]">حساب العميل</p></div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 pb-24 sm:p-6 lg:p-8 xl:p-10 lg:pb-10">
          <Outlet />
        </main>

        {/* تنقل سفلي للجوال */}
        <nav className="fixed bottom-0 z-40 flex w-full items-stretch justify-around border-t border-[#C4D8E5] bg-white/95 backdrop-blur lg:hidden font-tajawal" aria-label="تنقل البوابة">
          {nav.slice(0, 5).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition-all',
                  isActive || pathname.startsWith(item.to + '/') ? 'text-[#1C2B48] font-extrabold' : 'text-[#527094]',
                )
              }
            >
              <item.icon className="size-5" strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
