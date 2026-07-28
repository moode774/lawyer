import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useT } from '../lib/i18n'
import { useAuth } from '../lib/auth'
import { BRAND } from '../config/brand'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useSEO } from '../lib/seo'

export default function LoginPage() {
  const { t } = useT()
  const { login } = useAuth()
  const navigate = useNavigate()
  useSEO({ title: 'تسجيل الدخول | ' + BRAND.nameAr })

  const [role, setRole] = useState<'admin' | 'client'>('admin')
  const [email, setEmail] = useState('lawyer@firm.com')
  const [password, setPassword] = useState('password123')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, role)
    if (role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/portal')
    }
  }

  return (
    <div className="max-w-md mx-auto py-20 px-4 font-tajawal min-h-[80vh] flex items-center">
      <Card className="p-8 sm:p-10 bg-white border border-[#C4D8E5] shadow-2xl rounded-3xl space-y-6 w-full">
        <div className="text-center space-y-2">
          <div className="size-14 rounded-2xl bg-[#1C2B48] text-[#8EB1D1] flex items-center justify-center font-bold text-2xl font-amiri mx-auto shadow-md border border-[#8EB1D1]/30">
            {BRAND.nameAr.charAt(0)}
          </div>
          <h1 className="font-amiri text-3xl font-bold text-[#1C2B48]">{t('تسجيل الدخول للنظام', 'Platform Sign In')}</h1>
          <p className="font-tajawal text-xs text-[#527094]">{t('منصة الإدارة وبوابة العملاء الآمنة', 'Secure Admin & Client Portal')}</p>
        </div>

        {/* Role Toggle Switch */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#E8ECEF]/80 rounded-2xl border border-[#C4D8E5] text-xs font-bold font-reem">
          <button
            type="button"
            onClick={() => {
              setRole('admin')
              setEmail('lawyer@firm.com')
            }}
            className={`py-2.5 rounded-xl transition-all cursor-pointer ${role === 'admin' ? 'bg-[#1C2B48] text-white shadow-md' : 'text-[#527094]'}`}
          >
            {t('دخول المحامي / الفريق', 'Lawyer / Admin')}
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('client')
              setEmail('client@company.com')
            }}
            className={`py-2.5 rounded-xl transition-all cursor-pointer ${role === 'client' ? 'bg-[#1C2B48] text-white shadow-md' : 'text-[#527094]'}`}
          >
            {t('بوابة العميل', 'Client Portal')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-tajawal">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#1C2B48] block">{t('البريد الإلكتروني', 'Email')}</span>
            <Input
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-[#C4D8E5] rounded-xl font-mono"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#1C2B48] block">{t('كلمة المرور', 'Password')}</span>
            <Input
              type="password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-[#C4D8E5] rounded-xl font-mono"
            />
          </div>

          <Button type="submit" variant="accent" size="lg" className="w-full font-bold shadow-md rounded-2xl py-3.5 text-base">
            {t('دخول النظام', 'Sign In')}
          </Button>
        </form>

        <div className="p-3.5 rounded-2xl bg-[#E8ECEF]/60 border border-[#C4D8E5] text-[11px] text-[#527094] text-center space-y-1 font-tajawal">
          <span className="font-bold text-[#1C2B48] block">{t('حساب تجريبي محمل مسبقًا:', 'Pre-loaded Demo Account:')}</span>
          <p dir="ltr" className="font-mono text-[#1C2B48] font-bold">{email}</p>
        </div>
      </Card>
    </div>
  )
}
