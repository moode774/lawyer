import { useEffect } from 'react'
import { brand } from '../config/brand'

/** النطاق الرسمي — مصدر واحد لكل الروابط المطلقة (canonical / og / JSON-LD). */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.binnouh.com').replace(/\/$/, '')

export const DEFAULT_TITLE = `${brand.nameAr} | الرياض`
export const DEFAULT_DESCRIPTION =
  'مكتب المحامي ابن نوح للمحاماة والاستشارات القانونية بالرياض — استشارات قانونية، تمثيل قضائي، صياغة العقود التجارية، تأسيس الشركات، والقضايا العمالية والعقارية في المملكة العربية السعودية.'
const DEFAULT_IMAGE = `${SITE_URL}/saudi-law-firm-hero-v2.webp`

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  /** المسار الكنسي، مثل "/services/corporate-law". يُشتق من العنوان الحالي إن لم يُمرّر. */
  path?: string
  image?: string
  type?: 'website' | 'article'
  /** بيانات مهيكلة خاصة بالصفحة (FAQPage / Service / Article / BreadcrumbList). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  /** يمنع فهرسة الصفحة (الصفحات الخاصة وصفحة 404). */
  noindex?: boolean
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`
  let el = document.head.querySelector<HTMLLinkElement>(selector)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (hreflang) el.setAttribute('hreflang', hreflang)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** إدارة الوسوم التعريفية والروابط الكنسية والبيانات المهيكلة لكل صفحة. */
export function useSEO({ title, description, keywords, path, image, type = 'website', jsonLd, noindex }: SEOProps) {
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    const fullTitle = title
      ? title.includes('ابن نوح') || title.includes('بن نوح')
        ? title
        : `${title} | مكتب المحامي ابن نوح للمحاماة`
      : DEFAULT_TITLE

    const desc = description || DEFAULT_DESCRIPTION
    const cleanPath = (path ?? window.location.pathname).replace(/\/+$/, '') || '/'
    const url = `${SITE_URL}${cleanPath === '/' ? '/' : cleanPath}`
    const img = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : DEFAULT_IMAGE

    document.title = fullTitle

    setMeta('meta[name="title"]', 'name', 'title', fullTitle)
    setMeta('meta[name="description"]', 'name', 'description', desc)
    if (keywords) setMeta('meta[name="keywords"]', 'name', 'keywords', keywords)

    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    )

    // الروابط الكنسية والبدائل اللغوية
    setLink('canonical', url)
    setLink('alternate', url, 'ar-SA')
    setLink('alternate', `${url}${url.includes('?') ? '&' : '?'}lang=en`, 'en')
    setLink('alternate', url, 'x-default')

    // Open Graph / Twitter — تتحدث مع كل صفحة بدل بطاقة واحدة للموقع كله
    setMeta('meta[property="og:type"]', 'property', 'og:type', type)
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc)
    setMeta('meta[property="og:image"]', 'property', 'og:image', img)
    setMeta('meta[name="twitter:url"]', 'name', 'twitter:url', url)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', img)

    // بيانات مهيكلة خاصة بالصفحة — تُزال عند مغادرتها حتى لا تتراكم
    const PAGE_LD_ID = 'page-jsonld'
    document.getElementById(PAGE_LD_ID)?.remove()
    if (jsonLdKey) {
      const script = document.createElement('script')
      script.id = PAGE_LD_ID
      script.type = 'application/ld+json'
      script.textContent = jsonLdKey
      document.head.appendChild(script)
    }

    return () => {
      document.getElementById(PAGE_LD_ID)?.remove()
    }
  }, [title, description, keywords, path, image, type, jsonLdKey, noindex])
}

/** مسار تنقّل مهيكل (Breadcrumb) لصفحات المستوى الثاني والثالث. */
export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}
