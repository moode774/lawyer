import type { LeadSource, Utm } from '../types'

const KEY = 'lf_attribution_v1'

export interface Attribution {
  source: LeadSource
  landingPage?: string
  referrer?: string
  utm?: Utm
}

/** يلتقط UTM من الرابط ويحفظ أول وآخر مصدر (sessionStorage). */
export function captureAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search)
  const utm: Utm = {
    source: params.get('utm_source') ?? undefined,
    medium: params.get('utm_medium') ?? undefined,
    campaign: params.get('utm_campaign') ?? undefined,
    content: params.get('utm_content') ?? undefined,
    term: params.get('utm_term') ?? undefined,
  }
  const hasUtm = Object.values(utm).some(Boolean)
  const referrer = document.referrer || undefined

  let source: LeadSource = 'direct'
  const s = (utm.source ?? '').toLowerCase()
  if (s.includes('google') && (utm.medium ?? '').includes('cpc')) source = 'google_ads'
  else if (s.includes('google')) source = 'google_search'
  else if (s.includes('instagram') || s.includes('ig')) source = 'instagram'
  else if (s === 'x' || s.includes('twitter')) source = 'x'
  else if (s.includes('linkedin')) source = 'linkedin'
  else if (s.includes('whatsapp')) source = 'whatsapp'
  else if (referrer) {
    if (referrer.includes('google.')) source = 'google_search'
    else if (referrer.includes('instagram.')) source = 'instagram'
    else if (referrer.includes('linkedin.')) source = 'linkedin'
    else if (referrer.includes('t.co') || referrer.includes('twitter.') || referrer.includes('x.com')) source = 'x'
    else if (!referrer.includes(window.location.host)) source = 'referral'
  }

  const attribution: Attribution = {
    source,
    landingPage: window.location.pathname,
    referrer,
    utm: hasUtm ? utm : undefined,
  }

  try {
    const existing = sessionStorage.getItem(KEY)
    if (!existing) sessionStorage.setItem(KEY, JSON.stringify(attribution))
    else if (hasUtm) sessionStorage.setItem(KEY, JSON.stringify(attribution)) // last touch
  } catch {
    /* ignore */
  }
  return attribution
}

export function getAttribution(): Attribution {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Attribution
  } catch {
    /* ignore */
  }
  return captureAttribution()
}
