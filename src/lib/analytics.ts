/**
 * Analytics abstraction — طبقة مركزية لأحداث التحليلات.
 * لاحقًا: Google Analytics / Google Ads / Meta Pixel تُربط هنا فقط.
 */
export type AnalyticsEvent =
  | 'page_view'
  | 'cta_click'
  | 'intake_started'
  | 'intake_step'
  | 'intake_completed'
  | 'booking_started'
  | 'booking_completed'
  | 'whatsapp_click'
  | 'phone_click'

export function track(event: AnalyticsEvent, props?: Record<string, string | number>) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug(`[analytics] ${event}`, props ?? {})
  }
  // الإنتاج: window.gtag?.('event', event, props) / window.fbq?.(...)
}

export function trackPageView(path: string) {
  track('page_view', { path })
}
