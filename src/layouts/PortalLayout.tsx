import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  FileText,
  FolderOpen,
  Home,
  LogOut,
  MessageSquare,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../lib/auth'
import { Avatar } from '../components/ui/avatar'
import { Logo } from '../components/shared/Logo'
import { cn } from '../lib/utils'

const nav = [
  { to: '/portal', end: true, icon: Home, label: 'الرئيسية' },
  { to: '/portal/matters', icon: FolderOpen, label: 'قضاياي' },
  { to: '/portal/documents', icon: FileText, label: 'المستندات' },
  { to: '/portal/appointments', icon: CalendarDays, label: 'المواعيد' },
  { to: '/portal/messages', icon: MessageSquare, label: 'الرسائل' },
  { to: '/portal/profile', icon: UserRound, label: 'الملف الشخصي' },
]

export default function PortalLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    if (!user) navigate('/login', { replace: true })
  }, [user, navigate])

  if (!user) return null

  return (
    <div className="flex min-h-screen bg-[#f6f8fa] font-tajawal">
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-64 flex-col bg-[#1C2B48] lg:flex border-e border-[#8EB1D1]/20 shadow-2xl">
        <div className="flex h-20 items-center border-b border-[#8EB1D1]/20 px-6">
          <Logo dark />
        </div>
        <p className="px-6 pb-2 pt-6 font-reem text-xs font-bold uppercase tracking-wider text-[#8EB1D1]">
          بوابة العميل المعتمدة
        </p>
        <nav className="flex-1 space-y-1 p-4" aria-label="قائمة البوابة">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-200',
                  isActive ? 'bg-[#8EB1D1] text-[#1C2B48] shadow-md font-extrabold' : 'text-[#C4D8E5] hover:bg-white/10 hover:text-white',
                )
              }
            >
              <item.icon className="size-4.5 shrink-0" strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-[#8EB1D1]/20 p-4 bg-[#131e33]">
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar name={user.name} color="#8EB1D1" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{user.name}</p>
              <p className="text-[10px] text-[#8EB1D1] font-reem">عميل معتمد</p>
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

      <div className="flex min-w-0 flex-1 flex-col lg:ms-64">
        {/* شريط علوي للجوال */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-[#C4D8E5] bg-white/90 backdrop-blur-md px-4 lg:hidden">
          <Logo compact />
          <span className="ms-3 font-reem text-sm font-bold text-[#1C2B48]">بوابة العميل</span>
        </header>

        <main className="flex-1 p-4 pb-24 lg:p-8 lg:pb-8">
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
