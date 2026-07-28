import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { CalendarCheck, Menu, Phone, X, Shield, Sparkles } from 'lucide-react'
import { brand } from '../config/brand'
import { track, trackPageView } from '../lib/analytics'
import { useLang } from '../lib/i18n'
import { buttonVariants, Button } from '../components/ui/button'
import { Logo } from '../components/shared/Logo'
import { PatternLattice } from '../components/shared/PatternLattice'
import { cn } from '../lib/utils'

const navLinks = [
  { to: '/', ar: 'الرئيسية', en: 'Home' },
  { to: '/services', ar: 'خدماتنا', en: 'Services' },
  { to: '/about', ar: 'عن المكتب', en: 'About Firm' },
  { to: '/faq', ar: 'الأسئلة الشائعة', en: 'FAQ' },
  { to: '/contact', ar: 'تواصل معنا', en: 'Contact' },
]

export default function PublicLayout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { t, locale, setLocale } = useLang()

  useEffect(() => {
    setOpen(false)
    trackPageView(pathname)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f8fa] text-[#1C2B48]">
      {/* Sticky Header with Cool Cerulean & Midnight Blue styling */}
      <header className="sticky top-0 z-40 border-b border-[#C4D8E5]/60 bg-white/90 backdrop-blur-md shadow-xs transition-all">
        <div className="container flex h-20 items-center justify-between gap-4">
          <Logo />
          
          <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-[#1C2B48] text-white shadow-sm'
                      : 'text-[#2a3e5c] hover:bg-[#E8ECEF] hover:text-[#1C2B48]',
                  )
                }
              >
                {t(l.ar, l.en)}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
              className="hidden rounded-xl bg-[#E8ECEF] px-3 py-2 font-latin text-xs font-bold text-[#1C2B48] hover:bg-[#C4D8E5] transition-colors sm:block"
              aria-label="Switch language"
            >
              {locale === 'ar' ? 'English' : 'عربي'}
            </button>

            <a
              href={`tel:${brand.phone}`}
              onClick={() => track('phone_click')}
              className="hidden items-center gap-2 text-xs font-bold text-[#1C2B48] hover:text-[#8EB1D1] transition-colors md:flex bg-[#E8ECEF]/80 px-3 py-2 rounded-xl border border-[#C4D8E5]/50"
            >
              <Phone className="size-3.5 text-[#8EB1D1]" />
              <span className="font-latin" dir="ltr">{brand.phoneDisplay}</span>
            </a>

            <Link
              to="/book"
              onClick={() => track('cta_click', { cta: 'book_nav' })}
              className={cn(buttonVariants({ variant: 'accent', size: 'md' }), 'hidden sm:inline-flex shadow-sm')}
            >
              <CalendarCheck className="size-4" />
              {t('احجز استشارة', 'Book Consultation')}
            </Link>

            <button className="rounded-xl p-2 text-[#1C2B48] hover:bg-[#E8ECEF] lg:hidden" onClick={() => setOpen(!open)} aria-label="القائمة">
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-[#C4D8E5] bg-white px-6 py-5 lg:hidden animate-fade-in shadow-xl" aria-label="قائمة الجوال">
            <div className="flex flex-col gap-2">
              {navLinks.map((l) => (
                <NavLink key={l.to} to={l.to} className="rounded-xl px-4 py-3 text-base font-semibold text-[#1C2B48] hover:bg-[#E8ECEF]">
                  {t(l.ar, l.en)}
                </NavLink>
              ))}
              <Link to="/book" onClick={() => track('cta_click', { cta: 'book_mobile_nav' })} className={cn(buttonVariants({ variant: 'accent', size: 'lg' }), 'mt-4 w-full')}>
                <CalendarCheck className="size-5" />
                {t('احجز استشارة قانونية', 'Book a consultation')}
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Sticky Mobile CTA */}
      <div className="sticky bottom-0 z-30 border-t border-[#C4D8E5] bg-white/95 p-3 backdrop-blur sm:hidden shadow-lg">
        <Link to="/book" className={cn(buttonVariants({ variant: 'accent', size: 'lg' }), 'w-full shadow-md')}>
          <CalendarCheck className="size-5" />
          {t('احجز استشارة الآن', 'Book Consultation Now')}
        </Link>
      </div>

      {/* Luxury Midnight Blue Footer with Cool Cerulean Details */}
      <footer className="border-t border-[#1C2B48] bg-[#1C2B48] text-white relative overflow-hidden">
        <PatternLattice opacity={0.08} color="#8EB1D1" />
        <div className="container relative z-10 grid gap-12 py-16 md:grid-cols-4">
          <div className="md:col-span-2 space-y-4">
            <Logo dark />
            <p className="max-w-md text-sm leading-relaxed text-[#C4D8E5]">
              {t(
                'منظومة استشارات وخدمات قانونية رفيعة المستوى للأفراد والمنشآت في المملكة العربية السعودية، وفق أفضل المعايير المهنية وحماية السرية.',
                'Premier legal advisory and advocacy services in the Kingdom of Saudi Arabia, engineered for distinction, agility, and absolute confidentiality.',
              )}
            </p>
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-1.5 text-xs text-[#A7C7E7] border border-[#8EB1D1]/30">
              <Shield className="size-3.5 text-[#8EB1D1]" />
              <span>{t('رقم ترخيص المحاماة', 'License No.')}: <span className="font-latin font-bold">{brand.licenseNumber}</span></span>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-base font-bold text-white flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#8EB1D1]" />
              {t('روابط سريعة', 'Quick Links')}
            </h4>
            <ul className="space-y-3 text-sm text-[#C4D8E5]">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-white hover:translate-x-1 transition-all inline-block">{t(l.ar, l.en)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-base font-bold text-white flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#A7C7E7]" />
              {t('معلومات التواصل', 'Contact Info')}
            </h4>
            <ul className="space-y-3 text-sm text-[#C4D8E5]">
              <li dir="ltr" className="font-latin text-end md:text-start text-white font-bold">{brand.phoneDisplay}</li>
              <li className="font-latin text-[#A7C7E7]">{brand.email}</li>
              <li>{t(brand.officeAddress, brand.officeAddressEn)}</li>
              <li className="text-xs text-[#8EB1D1]">{t(brand.workingHours, 'Sun–Thu: 9 AM – 6 PM')}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#8EB1D1]/20 bg-[#131e33] py-6">
          <div className="container flex flex-wrap items-center justify-between gap-4 text-xs text-[#C4D8E5]/80">
            <p>© {new Date().getFullYear()} {t(brand.firmNameAr, brand.firmNameEn)}. {t('جميع الحقوق محفوظة.', 'All rights reserved.')}</p>
            <div className="flex gap-6 font-medium">
              <Link to="/privacy" className="hover:text-white transition-colors">{t('سياسة الخصوصية', 'Privacy Policy')}</Link>
              <Link to="/terms" className="hover:text-white transition-colors">{t('الشروط والأحكام', 'Terms of Service')}</Link>
              <Link to="/login" className="text-[#8EB1D1] hover:text-white transition-colors font-bold">{t('دخول الموظفين والعملاء', 'Portal Sign in')}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
