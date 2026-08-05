import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const allowedSizes = new Set(['1024x1024', '1024x1536', '1536x1024'])
const allowedQualities = new Set(['medium', 'high'])

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return json({ success: false, error: 'Method not allowed' }, 405)

  const apiKey = Deno.env.get('OPENAI_API_KEY')
  if (!apiKey) {
    return json({ success: false, error: 'لم يتم ضبط سر OPENAI_API_KEY في Supabase.' }, 500)
  }

  try {
    const body = await request.json()
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, 4000) : ''
    const size = allowedSizes.has(body.size) ? body.size : '1024x1024'
    const quality = allowedQualities.has(body.quality) ? body.quality : 'high'

    if (prompt.length < 3) return json({ success: false, error: 'وصف الصورة قصير جدًا.' }, 400)

    const context = [
      body.serviceName ? `الخدمة القانونية: ${String(body.serviceName).slice(0, 200)}.` : '',
      body.brandInstructions ? `هوية العلامة: ${String(body.brandInstructions).slice(0, 600)}.` : '',
    ].filter(Boolean).join(' ')

    // Keep the user's art direction intact. Brand context is supporting context,
    // not a hard-coded visual template.
    const finalPrompt = `${prompt}${context ? `\n\n${context}` : ''}\n\nأنشئ صورة تسويقية احترافية، متقنة التكوين، طبيعية التفاصيل، ومن دون إضافة نصوص أو شعارات غير مطلوبة.`

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-2',
        prompt: finalPrompt,
        size,
        quality,
        output_format: 'png',
        n: 1,
      }),
    })

    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      const message = result?.error?.message || `OpenAI request failed (${response.status})`
      return json({ success: false, error: message }, response.status)
    }

    const image = result?.data?.[0]?.b64_json
    if (!image) return json({ success: false, error: 'استجابة OpenAI لم تتضمن بيانات صورة.' }, 502)

    return json({
      success: true,
      image,
      mimeType: 'image/png',
      prompt: finalPrompt,
      model: 'OpenAI GPT Image 2',
    })
  } catch (error) {
    return json({ success: false, error: error instanceof Error ? error.message : 'خطأ غير متوقع.' }, 500)
  }
})
