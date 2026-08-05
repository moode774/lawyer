import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, KeyRound, Phone, ShieldCheck } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { BRAND } from '../config/brand'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useSEO } from '../lib/seo'

export default function LoginPage() {
  const { requestPhoneOtp, verifyPhoneOtp } = useAuth()
  const navigate = useNavigate()
  useSEO({ title: `دخول بوابة العميل | ${BRAND.nameAr}` })
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError(''); setLoading(true)
    try {
      if (step === 'phone') { await requestPhoneOtp(phone); setStep('code') }
      else { await verifyPhoneOtp(phone, code); navigate('/portal', { replace: true }) }
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'تعذر إكمال الطلب، حاول مرة أخرى') }
    finally { setLoading(false) }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#f4f7fa] px-4 py-8 font-tajawal sm:py-14">
      <div className="mx-auto max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#527094] hover:text-[#102541]">
          <ArrowRight className="size-4" /> العودة إلى الموقع
        </Link>
        <section className="overflow-hidden rounded-[2rem] border border-[#cbd9e5] bg-white shadow-[0_24px_70px_rgba(16,37,65,.12)]">
          <div className="h-1.5 bg-[#102541]" />
          <div className="p-7 sm:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center overflow-hidden rounded-2xl border border-[#d7e1ea] bg-[#102541] shadow-lg">
                <img src="/icons.webp" alt="شعار بن نوح" className="h-full w-full object-cover" />
              </div>
              <p className="mb-2 text-xs font-bold text-[#8a6b36]">بوابة العملاء</p>
              <h1 className="font-amiri text-3xl font-bold text-[#102541]">دخول آمن وسريع</h1>
              <p className="mt-2 text-sm leading-7 text-[#66778b]">أدخل رقم جوالك المسجل لمتابعة طلباتك ومواعيدك ومستنداتك.</p>
            </div>

            {error && <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
            <form onSubmit={submit} className="space-y-5">
              {step === 'phone' ? (
                <label className="block space-y-2">
                  <span className="flex items-center gap-2 text-sm font-bold text-[#102541]"><Phone className="size-4 text-[#7599ba]" /> رقم الجوال</span>
                  <Input autoFocus inputMode="tel" dir="ltr" autoComplete="tel" placeholder="05XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-14 rounded-xl border-[#bfd1df] text-center font-mono text-lg tracking-wider" required />
                </label>
              ) : (
                <label className="block space-y-2">
                  <span className="flex items-center gap-2 text-sm font-bold text-[#102541]"><KeyRound className="size-4 text-[#7599ba]" /> رمز التحقق</span>
                  <Input autoFocus inputMode="numeric" dir="ltr" autoComplete="one-time-code" maxLength={6} placeholder="• • • • • •" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} className="h-14 rounded-xl border-[#bfd1df] text-center font-mono text-xl tracking-[.45em]" required />
                  <p className="text-center text-xs text-[#66778b]">أرسلنا رمزًا مؤقتًا إلى {phone}</p>
                </label>
              )}
              <Button type="submit" disabled={loading} className="h-14 w-full rounded-xl bg-[#102541] text-base font-bold text-white hover:bg-[#183758]">
                {loading ? 'جاري التحقق...' : step === 'phone' ? 'إرسال رمز التحقق' : 'دخول بوابة العميل'}
              </Button>
              {step === 'code' && <button type="button" onClick={() => { setStep('phone'); setCode(''); setError('') }} className="w-full text-sm font-bold text-[#527094] hover:text-[#102541]">تغيير رقم الجوال</button>}
            </form>
            <div className="mt-7 flex items-start gap-3 rounded-2xl bg-[#f3f6f9] p-4 text-xs leading-6 text-[#66778b]">
              <ShieldCheck className="mt-1 size-5 shrink-0 text-[#4d789c]" />
              <p>لا تحتاج إلى بريد إلكتروني أو كلمة مرور. عند أول دخول يُنشأ لك حساب عميل تلقائيًا.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
