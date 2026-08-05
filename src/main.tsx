import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { captureAttribution } from './lib/attribution'
import { initAnalytics } from './lib/analytics'

// التقاط مصدر الزائر (UTM / referrer) عند أول تحميل
captureAttribution()

// تفعيل GA4 / Meta Pixel إن ضُبطت المتغيرات في .env
initAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
