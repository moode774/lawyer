/**
 * AI services used by the marketing studio.
 * Image generation is intentionally executed by a Supabase Edge Function so
 * the OpenAI API key never reaches the browser bundle.
 */
import { supabase } from '../supabase'

export interface RealAiGenerateInput {
  providerId: 'openai' | 'openrouter' | 'free' | string
  prompt: string
  serviceName?: string
  systemInstruction?: string
  apiKey?: string
  modelName?: string
}

export interface RealAiGenerateResponse {
  success: boolean
  content: string
  providerName: string
  modelUsed: string
  tokensUsed?: number
  error?: string
}

export type ImageSize = '1024x1024' | '1024x1536' | '1536x1024'
export type ImageQuality = 'medium' | 'high'

export interface ImageGenerateOptions {
  size?: ImageSize
  quality?: ImageQuality
  serviceName?: string
  brandInstructions?: string
}

function getBrowserKey(provider: 'openai' | 'openrouter', customKey?: string): string {
  const value = customKey?.trim() || ''
  if (!value) return ''
  if (provider === 'openai' && !value.startsWith('sk-')) return ''
  if (provider === 'openrouter' && !value.startsWith('sk-or-')) return ''
  return value
}

async function callChatApi(
  endpoint: string,
  apiKey: string,
  model: string,
  prompt: string,
  systemInstruction?: string,
): Promise<RealAiGenerateResponse> {
  if (!apiKey) {
    return {
      success: false,
      content: '',
      providerName: 'AI provider',
      modelUsed: model,
      error: 'أدخل مفتاح المزود للنصوص. لا توجد مفاتيح سرية مضمّنة في الواجهة بعد الآن.',
    }
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: systemInstruction || 'أنت مساعد تسويقي محترف لمكتب محاماة سعودي. أجب بالعربية الفصحى الواضحة.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      return {
        success: false,
        content: '',
        providerName: endpoint.includes('openrouter') ? 'OpenRouter' : 'OpenAI',
        modelUsed: model,
        error: data?.error?.message || `فشل طلب النص (${response.status}).`,
      }
    }

    const content = data.choices?.[0]?.message?.content?.trim() || ''
    return {
      success: Boolean(content),
      content,
      providerName: endpoint.includes('openrouter') ? 'OpenRouter' : 'OpenAI',
      modelUsed: data.model || model,
      tokensUsed: data.usage?.total_tokens,
      error: content ? undefined : 'أعاد المزود استجابة فارغة.',
    }
  } catch (error) {
    return {
      success: false,
      content: '',
      providerName: endpoint.includes('openrouter') ? 'OpenRouter' : 'OpenAI',
      modelUsed: model,
      error: error instanceof Error ? error.message : 'تعذر الاتصال بمزود الذكاء الاصطناعي.',
    }
  }
}

export async function generateRealImageWithAI(
  _customApiKey: string | undefined,
  prompt: string,
  preferredEngine: 'openai' | 'openrouter' | 'free' = 'openai',
  options: ImageGenerateOptions = {},
): Promise<{ success: boolean; url?: string; promptText?: string; providerName?: string; error?: string }> {
  if (preferredEngine !== 'openai') {
    return {
      success: false,
      error: 'توليد الصور الاحترافي متاح عبر OpenAI فقط. اختر OpenAI من قائمة المزود.',
    }
  }

  const cleanPrompt = prompt.trim()
  if (cleanPrompt.length < 3) {
    return { success: false, error: 'اكتب وصفًا أوضح للصورة المطلوبة.' }
  }

  const requestBody = {
    prompt: cleanPrompt,
    size: options.size || '1024x1024',
    quality: options.quality || 'high',
    serviceName: options.serviceName || '',
    brandInstructions: options.brandInstructions || '',
  }

  let data: any
  let error: { message?: string } | null = null

  if (import.meta.env.DEV) {
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })
      data = await response.json().catch(() => ({}))
      if (!response.ok) error = { message: data?.error || `فشل التوليد (${response.status}).` }
    } catch (requestError) {
      error = { message: requestError instanceof Error ? requestError.message : 'تعذر الاتصال بالخادم المحلي.' }
    }
  } else {
    const result = await supabase.functions.invoke('generate-marketing-image', { body: requestBody })
    data = result.data
    error = result.error
  }

  if (error) {
    return {
      success: false,
      error: error.message || 'تعذر الاتصال بخدمة توليد الصور الآمنة.',
    }
  }

  if (!data?.success || !data?.image) {
    return {
      success: false,
      error: data?.error || 'لم ترجع OpenAI صورة. راجع رصيد الحساب وصلاحية المفتاح.',
    }
  }

  return {
    success: true,
    url: `data:${data.mimeType || 'image/png'};base64,${data.image}`,
    promptText: data.prompt || cleanPrompt,
    providerName: data.model || 'OpenAI GPT Image',
  }
}

export async function generateRealTextWithAI(input: RealAiGenerateInput): Promise<RealAiGenerateResponse> {
  if (input.providerId === 'openrouter') {
    return callChatApi(
      '/api/openrouter/chat/completions',
      getBrowserKey('openrouter', input.apiKey),
      input.modelName || 'openai/gpt-4o-mini',
      input.prompt,
      input.systemInstruction,
    )
  }

  return callChatApi(
    '/api/openai/chat/completions',
    getBrowserKey('openai', input.apiKey),
    input.modelName || 'gpt-4o',
    input.prompt,
    input.systemInstruction,
  )
}
