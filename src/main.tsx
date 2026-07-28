import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { captureAttribution } from './lib/attribution'

// التقاط مصدر الزائر (UTM / referrer) عند أول تحميل
captureAttribution()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
