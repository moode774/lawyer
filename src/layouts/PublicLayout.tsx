import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Calendar, Menu, Phone, Mail, MapPin, Clock, MessageCircle, X } from 'lucide-react'
import { track, trackPageView } from '../lib/analytics'
import { useLang } from '../lib/i18n'
import { cn } from '../lib/utils'
import { BRAND } from '../config/brand'

const navLinks = [
  { to: '/', ar: 'الرئيسية', en: 'Home' },
  { to: '/about', ar: 'عن المكتب', en: 'About Us' },
  { to: '/services', ar: 'خدماتنا', en: 'Services' },
  { to: '/insights', ar: 'مقالات قانونية', en: 'Insights' },
  { to: '/faq', ar: 'الأسئلة الشائعة', en: 'FAQ' },
  { to: '/contact', ar: 'تواصل معنا', en: 'Contact' },
]

const footerServices = [
  { slug: 'corporate-law', ar: 'الأنظمة التجارية وتأسيس الشركات', en: 'Corporate & Commercial' },
  { slug: 'commercial-disputes', ar: 'النزاعات التجارية والتقاضي', en: 'Commercial Disputes' },
  { slug: 'employment-law', ar: 'نظام العمل والقضايا العمالية', en: 'Employment & Labor' },
  { slug: 'real-estate', ar: 'العقارات والمقاولات والبيوع', en: 'Real Estate' },
  { slug: 'execution', ar: 'التنفيذ وتحصيل الديون', en: 'Enforcement & Debt' },
]

function HeaderLogo() {
  return (
    <Link to="/" className="flex items-center shrink-0 overflow-hidden" aria-label="Bin Nouh - Home">
      <img
        src="/icon11.webp"
        alt="شعار مكتب بن نوح للمحاماة والاستشارات القانونية"
        className="h-9 sm:h-10 lg:h-12 max-w-[190px] w-auto object-contain transition-transform hover:scale-105"
      />
    </Link>
  )
}

export default function PublicLayout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { t, locale, setLocale } = useLang()
  const isHome = pathname === '/'

  useEffect(() => {
    setOpen(false)
    trackPageView(pathname)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFCFB] text-[#0B1221] font-tajawal" dir={locale === 'ar' ? 'rtl' : 'ltr'}>

      {/* تخطّي إلى المحتوى — يظهر عند التنقّل بلوحة المفاتيح */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[60] focus:rounded-lg focus:bg-[#0B132B] focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
      >
        {t('تخطّي إلى المحتوى', 'Skip to content')}
      </a>

      {/* SINGLE UNIFIED LUXURY HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#F0EBE1] shadow-sm">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 flex h-[80px] items-center justify-between">
          
          {/* Right Side (RTL Start) -> Logo */}
          <HeaderLogo />

          {/* Center -> Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8" aria-label={t('التنقل الرئيسي', 'Main navigation')}>
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    'relative py-7 text-[15px] font-bold transition-colors',
                    isActive
                      ? 'text-[#C7A87D] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#C7A87D]'
                      : 'text-[#334155] hover:text-[#0B1221]',
                  )
                }
              >
                {t(l.ar, l.en)}
              </NavLink>
            ))}
          </nav>

          {/* Left Side (RTL End) -> Phone, Language & CTA Button */}
          <div className="hidden md:flex items-center gap-5">
            <a href={`tel:${BRAND.phone}`} onClick={() => track('phone_click')} className="flex items-center gap-2 text-xs font-bold text-[#334155] hover:text-[#C7A87D] transition-colors">
              <Phone className="size-3.5 text-[#C7A87D]" />
              <span dir="ltr" className="font-mono tracking-wide">{BRAND.phoneDisplay}</span>
            </a>

            <span className="text-gray-300">|</span>

            <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')} className="text-xs font-bold text-[#334155] hover:text-[#C7A87D] transition-colors" aria-label="Switch language">
              {locale === 'ar' ? 'EN' : 'العربية'}
            </button>

            <Link
              to="/book"
              onClick={() => track('cta_click', { cta: 'header_book' })}
              className="inline-flex items-center gap-2 rounded-lg bg-[#C7A87D] hover:bg-[#b8986c] text-[#060B19] px-5 py-2.5 font-bold transition-all text-xs shadow-sm hover:shadow"
            >
              <Calendar className="size-4" />
              <span>{t('احجز استشارة', 'Book Consultation')}</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="rounded p-2 text-[#0B1221] lg:hidden bg-slate-50"
            onClick={() => setOpen(!open)}
            aria-label={t('فتح القائمة', 'Open menu')}
            aria-expanded={open}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <nav className="border-t border-[#F0EBE1] bg-white px-6 py-4 lg:hidden shadow-lg absolute w-full space-y-3">
            <div className="flex flex-col gap-1">
              {navLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-3 text-base font-bold transition-all rounded-md',
                      isActive ? 'bg-[#FDFBF7] text-[#C7A87D]' : 'text-[#334155]'
                    )
                  }
                >
                  {t(l.ar, l.en)}
                </NavLink>
              ))}
            </div>

            <div className="pt-3 border-t border-[#F0EBE1] flex flex-col gap-3">
              <Link
                to="/book"
                onClick={() => track('cta_click', { cta: 'mobile_menu_book' })}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C7A87D] text-[#060B19] py-3 font-bold text-sm"
              >
                <Calendar className="size-4" />
                <span>{t('احجز استشارة', 'Book Consultation')}</span>
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main id="main-content" className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-[#060B19] text-white">
        <div className="w-full max-w-[1240px] mx-auto px-6 lg:px-8 pt-16 pb-8">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

            {/* Identity */}
            <div className="lg:col-span-1">
              <img
                src="/icon11.webp"
                alt={t('شعار مكتب المحامي ابن نوح للمحاماة', 'Bin Nouh Law Firm logo')}
                className="h-10 w-auto object-contain mb-5"
                width={420}
                height={260}
                loading="lazy"
              />
              <p className="text-[12.5px] text-slate-400 font-medium leading-[1.9]">
                {t(BRAND.nameAr, BRAND.nameEn)}
              </p>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-4">
                {t(
                  `مرخّص من وزارة العدل برقم (${BRAND.licenseNumber})`,
                  `Licensed by the Ministry of Justice No. (${BRAND.licenseNumber})`
                )}
                <br />
                {t(
                  `سجل الهيئة السعودية للمحامين (${BRAND.legalEntityId})`,
                  `Saudi Bar Association No. (${BRAND.legalEntityId})`
                )}
              </p>
            </div>

            {/* Practice areas */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C7A87D] mb-5">
                {t('التخصصات', 'Practice Areas')}
              </h3>
              <ul className="space-y-3">
                {footerServices.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/services/${s.slug}`} className="text-[12.5px] text-slate-400 hover:text-white transition-colors font-medium">
                      {t(s.ar, s.en)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Site links */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C7A87D] mb-5">
                {t('روابط', 'Navigate')}
              </h3>
              <ul className="space-y-3">
                {[...navLinks, { to: '/book', ar: 'حجز استشارة', en: 'Book' }].map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-[12.5px] text-slate-400 hover:text-white transition-colors font-medium">
                      {t(l.ar, l.en)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C7A87D] mb-5">
                {t('التواصل', 'Contact')}
              </h3>
              <ul className="space-y-4 text-[12.5px] text-slate-400 font-medium">
                <li>
                  <a href={`tel:${BRAND.phone}`} onClick={() => track('phone_click')} className="hover:text-white transition-colors flex items-center gap-2.5">
                    <Phone className="size-3.5 text-[#C7A87D] shrink-0" strokeWidth={1.5} />
                    <span dir="ltr">{BRAND.phoneDisplay}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${BRAND.email}`} className="hover:text-white transition-colors flex items-center gap-2.5">
                    <Mail className="size-3.5 text-[#C7A87D] shrink-0" strokeWidth={1.5} />
                    <span dir="ltr" className="break-all">{BRAND.email}</span>
                  </a>
                </li>
                <li className="flex items-start gap-2.5 leading-relaxed">
                  <MapPin className="size-3.5 text-[#C7A87D] shrink-0 mt-1" strokeWidth={1.5} />
                  <span>{t(BRAND.officeAddress, BRAND.officeAddressEn)}</span>
                </li>
                <li className="flex items-start gap-2.5 leading-relaxed">
                  <Clock className="size-3.5 text-[#C7A87D] shrink-0 mt-1" strokeWidth={1.5} />
                  <span>{BRAND.workingHours}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11.5px] text-slate-400 font-medium text-center sm:text-start">
              © {new Date().getFullYear()} {t(BRAND.nameAr, BRAND.nameEn)}. {t('جميع الحقوق محفوظة.', 'All rights reserved.')}
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-[11.5px] text-slate-400 hover:text-white transition-colors font-medium">
                {t('سياسة الخصوصية', 'Privacy Policy')}
              </Link>
              <Link to="/terms" className="text-[11.5px] text-slate-400 hover:text-white transition-colors font-medium">
                {t('الشروط والأحكام', 'Terms')}
              </Link>
            </div>
          </div>

          <p className="mt-6 text-[10.5px] text-slate-400 leading-relaxed text-center sm:text-start">
            {t(
              'ما يُنشر في هذا الموقع ذو طابع تعريفي عام ولا يُعدّ استشارة قانونية لحالة بعينها، ولا تنشأ علاقة موكّل بمحامٍ إلا بعد قبول العمل كتابةً وتحديد نطاقه.',
              'Content on this website is general information and does not constitute legal advice for any specific matter. No attorney-client relationship arises until engagement is accepted in writing.'
            )}
          </p>
        </div>
      </footer>

      {/* اتصال سريع — واتساب وهاتف */}
      <div className="fixed bottom-5 end-5 z-40 flex flex-col gap-3 print:hidden">
        <a
          href={`https://wa.me/${BRAND.whatsappNumber.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => track('whatsapp_click')}
          aria-label={t('تواصل عبر واتساب', 'Contact via WhatsApp')}
          className="size-12 rounded-full bg-[#0B132B] hover:bg-[#16203f] text-[#D6B57E] border border-[#C5A880]/40 shadow-lg flex items-center justify-center transition-colors"
        >
          <MessageCircle className="size-5" strokeWidth={1.5} />
        </a>
        <a
          href={`tel:${BRAND.phone}`}
          onClick={() => track('phone_click')}
          aria-label={t('اتصال مباشر', 'Call the office')}
          className="size-12 rounded-full bg-white hover:bg-[#FAF5EB] text-[#0B132B] border border-[#E6DBC9] shadow-lg flex items-center justify-center transition-colors sm:hidden"
        >
          <Phone className="size-5" strokeWidth={1.5} />
        </a>
      </div>
    </div>
  )
}

