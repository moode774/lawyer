import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Locale } from '../types'

interface LangContextValue {
  locale: Locale
  dir: 'rtl' | 'ltr'
  setLocale: (l: Locale) => void
  t: (ar: string, en?: string) => string
}

const LangContext = createContext<LangContextValue>({
  locale: 'ar',
  dir: 'rtl',
  setLocale: () => {},
  t: (ar) => ar,
})

export const useLang = () => useContext(LangContext)

export const useT = () => {
  const { t, locale, dir } = useLang()
  return { t, isRTL: dir === 'rtl', locale }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    // ‏?lang=en يمنح النسخة الإنجليزية رابطًا مستقلًا قابلًا للفهرسة (hreflang)
    const fromUrl = new URLSearchParams(window.location.search).get('lang')
    if (fromUrl === 'en' || fromUrl === 'ar') return fromUrl
    return (localStorage.getItem('lf_locale') as Locale) || 'ar'
  })

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('lf_locale', l)

    // مزامنة الرابط حتى تبقى النسخة قابلة للمشاركة والفهرسة
    const url = new URL(window.location.href)
    if (l === 'en') url.searchParams.set('lang', 'en')
    else url.searchParams.delete('lang')
    window.history.replaceState({}, '', url)
  }

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])

  const t = (ar: string, en?: string) => (locale === 'ar' ? ar : en || ar)

  return (
    <LangContext.Provider value={{ locale, dir: locale === 'ar' ? 'rtl' : 'ltr', setLocale, t }}>
      {children}
    </LangContext.Provider>
  )
}
