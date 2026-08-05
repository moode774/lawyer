import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'

export default function AdminLoginPage() {
  const { loginAdmin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError(''); setLoading(true)
    try { await loginAdmin(email, password); navigate('/admin', { replace: true }) }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'تعذر تسجيل الدخول') }
    finally { setLoading(false) }
  }
  return <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#f4f7fa] p-4 font-tajawal">
    <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-3xl border border-[#cbd9e5] bg-white p-8 shadow-xl">
      <div className="text-center"><h1 className="font-amiri text-3xl font-bold text-[#102541]">دخول الإدارة</h1><p className="mt-2 text-xs text-[#66778b]">مخصص لفريق المكتب المخوّل فقط</p></div>
      {error && <div className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}
      <Input type="email" dir="ltr" placeholder="البريد الإداري" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input type="password" dir="ltr" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <Button disabled={loading} className="w-full bg-[#102541] text-white">{loading ? 'جاري الدخول...' : 'دخول الإدارة'}</Button>
    </form>
  </main>
}
