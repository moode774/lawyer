/**
 * طبقة التحليلات المركزية.
 *
 * تُفعّل تلقائيًا عند ضبط المتغيرات في ملف .env (وتبقى صامتة تمامًا بدونها):
 *   VITE_GA_MEASUREMENT_ID = G-XXXXXXXXXX   (Google Analytics 4 / Google Ads)
 *   VITE_META_PIXEL_ID     = 000000000000   (Meta Pixel — اختياري)
 *
 * ملاحظة خصوصية (PDPL): لا تُرسل أي بيانات شخصية (اسم/هاتف/بريد) ضمن الأحداث،
 * تُرسل أحداث سلوكية مجهّلة فقط.
 */
export type AnalyticsEvent =
  | 'page_view'
  | 'cta_click'
  | 'intake_started'
  | 'intake_step'
  | 'intake_completed'
  | 'booking_started'
  | 'booking_completed'
  | 'contact_submitted'
  | 'whatsapp_click'
  | 'phone_click'

type Props = Record<string, string | number>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined

let initialized = false

function injectScript(src: string) {
  const script = document.createElement('script')
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

/** تُستدعى مرة واحدة عند إقلاع التطبيق. */
export function initAnalytics() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  if (GA_ID) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    }
    window.gtag('js', new Date())
    // إرسال مشاهدات الصفحات يدويًا لأن التطبيق أحادي الصفحة (SPA)
    window.gtag('config', GA_ID, { send_page_view: false, anonymize_ip: true })
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`)
  }

  if (META_PIXEL_ID) {
    /* eslint-disable */
    ;(function (f: any, b: Document, e: string, v: string) {
      if (f.fbq) return
      const n: any = (f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      })
      if (!f._fbq) f._fbq = n
      n.push = n
      n.loaded = true
      n.version = '2.0'
      n.queue = []
      const t = b.createElement(e) as HTMLScriptElement
      t.async = true
      t.src = v
      b.head.appendChild(t)
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
    /* eslint-enable */
    window.fbq?.('init', META_PIXEL_ID)
  }
}

export function track(event: AnalyticsEvent, props?: Props) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug(`[analytics] ${event}`, props ?? {})
  }
  window.gtag?.('event', event, props ?? {})
  window.fbq?.('trackCustom', event, props ?? {})
}

export function trackPageView(path: string) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[analytics] page_view', path)
  }
  window.gtag?.('event', 'page_view', { page_path: path, page_location: window.location.href })
  window.fbq?.('track', 'PageView')
}
