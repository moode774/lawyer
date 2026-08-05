import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function localImageApi(apiKey: string): Plugin {
  return {
    name: 'local-openai-image-api',
    configureServer(server) {
      server.middlewares.use('/api/generate-image', async (req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ success: false, error: 'Method not allowed' }))
          return
        }

        if (!apiKey) {
          res.statusCode = 500
          res.end(JSON.stringify({ success: false, error: 'مفتاح OpenAI غير موجود في ملف .env.' }))
          return
        }

        try {
          let raw = ''
          for await (const chunk of req) {
            raw += chunk
            if (raw.length > 20_000) throw new Error('الطلب أكبر من الحد المسموح.')
          }

          const body = JSON.parse(raw || '{}')
          const prompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, 4000) : ''
          const size = ['1024x1024', '1024x1536', '1536x1024'].includes(body.size) ? body.size : '1024x1024'
          const quality = ['medium', 'high'].includes(body.quality) ? body.quality : 'high'

          if (prompt.length < 3) {
            res.statusCode = 400
            res.end(JSON.stringify({ success: false, error: 'اكتب وصفًا أوضح للصورة.' }))
            return
          }

          const context = [
            body.serviceName ? `الخدمة القانونية: ${String(body.serviceName).slice(0, 200)}.` : '',
            body.brandInstructions ? `هوية العلامة: ${String(body.brandInstructions).slice(0, 600)}.` : '',
          ].filter(Boolean).join(' ')
          const finalPrompt = `${prompt}${context ? `\n\n${context}` : ''}\n\nأنشئ صورة تسويقية احترافية، متقنة التكوين، طبيعية التفاصيل، ومن دون إضافة نصوص أو شعارات غير مطلوبة.`

          const openAiResponse = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'gpt-image-2',
              prompt: finalPrompt,
              size,
              quality,
              output_format: 'png',
              n: 1,
            }),
          })
          const result = await openAiResponse.json().catch(() => ({})) as any

          if (!openAiResponse.ok) {
            res.statusCode = openAiResponse.status
            res.end(JSON.stringify({ success: false, error: result?.error?.message || `OpenAI error (${openAiResponse.status})` }))
            return
          }

          const image = result?.data?.[0]?.b64_json
          if (!image) {
            res.statusCode = 502
            res.end(JSON.stringify({ success: false, error: 'لم تُرجع OpenAI بيانات الصورة.' }))
            return
          }

          res.end(JSON.stringify({ success: true, image, mimeType: 'image/png', prompt: finalPrompt, model: 'OpenAI GPT Image 2' }))
        } catch (error) {
          res.statusCode = 500
          res.end(JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'خطأ غير متوقع.' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const serverOpenAiKey = env.OPENAI_API_KEY || env.AI_API_KEY || env.VITE_OPENAI_API_KEY || ''

  return {
  plugins: [react(), localImageApi(serverOpenAiKey)],
  build: {
    // فصل المكتبات الثقيلة حتى لا تُحمَّل أدوات لوحة الإدارة على زوار الموقع العام
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined
          if (/[\\/]node_modules[\\/](recharts|d3-|victory-)/.test(id)) return 'vendor-charts'
          if (/[\\/]node_modules[\\/]framer-motion/.test(id)) return 'vendor-motion'
          if (/[\\/]node_modules[\\/](@supabase|@tanstack)/.test(id)) return 'vendor-data'
          if (/[\\/]node_modules[\\/](react-hook-form|@hookform|zod)/.test(id)) return 'vendor-forms'
          if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return 'vendor-react'
          return undefined
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  server: {
    proxy: {
      '/api/openai': {
        target: 'https://api.openai.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openai/, ''),
      },
      '/api/openrouter': {
        target: 'https://openrouter.ai/api/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openrouter/, ''),
      },
    },
  },
  }
})
