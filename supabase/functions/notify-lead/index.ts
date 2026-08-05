/**
 * notify-lead — إشعار المكتب فور وصول استفسار أو طلب حجز من الموقع.
 *
 * القناة الأساسية: البريد عبر Resend.
 * القناة الثانية (اختيارية): واتساب عبر WhatsApp Business Cloud API.
 *
 * الأسرار المطلوبة (تُضبط مرة واحدة، ولا تُوضع في الواجهة أبدًا):
 *   supabase secrets set EMAIL_API_KEY=re_xxx
 *   supabase secrets set NOTIFY_TO=info@binnouh.com
 *   supabase secrets set NOTIFY_FROM="مكتب ابن نوح <no-reply@binnouh.com>"
 *   # اختياري للواتساب:
 *   supabase secrets set WHATSAPP_ACCESS_TOKEN=EAAG...
 *   supabase secrets set WHATSAPP_PHONE_NUMBER_ID=...
 *   supabase secrets set WHATSAPP_TO=966500424282
 *
 * النشر:  supabase functions deploy notify-lead
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface NotifyPayload {
  kind: 'contact' | 'booking' | 'intake'
  reference: string
  name: string
  phone: string
  email?: string | null
  message?: string | null
  service?: string | null
  preferredAt?: string | null
}

const KIND_LABEL: Record<NotifyPayload['kind'], string> = {
  contact: 'استفسار جديد من نموذج التواصل',
  booking: 'طلب حجز استشارة جديد',
  intake: 'طلب استقبال قضية جديد',
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildEmailHtml(p: NotifyPayload) {
  const rows: [string, string | null | undefined][] = [
    ['الرقم المرجعي', p.reference],
    ['الاسم', p.name],
    ['الجوال', p.phone],
    ['البريد', p.email],
    ['الخدمة', p.service],
    ['الموعد المفضل', p.preferredAt],
  ]

  const body = rows
    .filter(([, v]) => v)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 0;color:#64748B;font-size:13px;width:140px">${label}</td>` +
        `<td style="padding:8px 0;color:#0F172A;font-size:14px;font-weight:700">${escapeHtml(String(value))}</td></tr>`
    )
    .join('')

  const messageBlock = p.message
    ? `<div style="margin-top:16px;padding:16px;background:#FAF8F3;border-inline-start:3px solid #C5A880;border-radius:8px;color:#334155;font-size:14px;line-height:2">${escapeHtml(
        p.message
      )}</div>`
    : ''

  return `<!doctype html><html dir="rtl" lang="ar"><body style="margin:0;background:#FAF9F5;padding:24px;font-family:Tahoma,Arial,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #EADFCF;border-radius:12px;overflow:hidden">
      <div style="background:#0B132B;padding:20px 24px">
        <div style="color:#C5A880;font-size:11px;letter-spacing:2px">BIN NOUH LAW FIRM</div>
        <div style="color:#fff;font-size:18px;font-weight:700;margin-top:6px">${KIND_LABEL[p.kind]}</div>
      </div>
      <div style="padding:24px">
        <table style="width:100%;border-collapse:collapse">${body}</table>
        ${messageBlock}
      </div>
    </div>
  </body></html>`
}

async function sendEmail(p: NotifyPayload) {
  const apiKey = Deno.env.get('EMAIL_API_KEY')
  const to = Deno.env.get('NOTIFY_TO')
  const from = Deno.env.get('NOTIFY_FROM') || 'onboarding@resend.dev'
  if (!apiKey || !to) return { channel: 'email', sent: false, reason: 'missing EMAIL_API_KEY or NOTIFY_TO' }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: to.split(',').map((entry) => entry.trim()),
      reply_to: p.email || undefined,
      subject: `${KIND_LABEL[p.kind]} — ${p.name} (${p.reference})`,
      html: buildEmailHtml(p),
    }),
  })

  return { channel: 'email', sent: response.ok, status: response.status }
}

async function sendWhatsApp(p: NotifyPayload) {
  const token = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
  const phoneId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')
  const to = Deno.env.get('WHATSAPP_TO')
  if (!token || !phoneId || !to) return { channel: 'whatsapp', sent: false, reason: 'not configured' }

  const text =
    `${KIND_LABEL[p.kind]}\n` +
    `المرجع: ${p.reference}\n` +
    `الاسم: ${p.name}\n` +
    `الجوال: ${p.phone}` +
    (p.service ? `\nالخدمة: ${p.service}` : '') +
    (p.message ? `\n\n${p.message.slice(0, 500)}` : '')

  const response = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, type: 'text', text: { body: text } }),
  })

  return { channel: 'whatsapp', sent: response.ok, status: response.status }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { ...CORS, 'Content-Type': 'application/json' } })
  }

  try {
    const payload = (await req.json()) as NotifyPayload
    if (!payload?.name || !payload?.phone || !payload?.kind) {
      return new Response(JSON.stringify({ error: 'بيانات ناقصة' }), { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } })
    }

    const results = await Promise.allSettled([sendEmail(payload), sendWhatsApp(payload)])
    const channels = results.map((r) => (r.status === 'fulfilled' ? r.value : { sent: false, reason: String(r.reason) }))

    return new Response(JSON.stringify({ ok: true, channels }), { headers: { ...CORS, 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'unexpected' }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
