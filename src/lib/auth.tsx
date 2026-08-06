import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from './supabase'

interface AuthUser {
  name: string
  email?: string
  phone?: string
  role: 'admin' | 'client'
}

interface AuthContextValue {
  user: AuthUser | null
  /** true حتى تنتهي أول محاولة لاستعادة الجلسة — تمنع الطرد قبل معرفة الحالة. */
  loading: boolean
  requestPhoneOtp: (phone: string) => Promise<void>
  verifyPhoneOtp: (phone: string, token: string) => Promise<void>
  loginAdmin: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  requestPhoneOtp: async () => {},
  verifyPhoneOtp: async () => {},
  loginAdmin: async () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)
const KEY = 'bin-nouh-user-session'

const STAFF_ROLES = ['super_admin', 'lawyer', 'staff', 'marketing']

export function normalizeSaudiPhone(value: string) {
  const digits = value.replace(/\D/g, '')
  if (/^05\d{8}$/.test(digits)) return `+966${digits.slice(1)}`
  if (/^5\d{8}$/.test(digits)) return `+966${digits}`
  if (/^9665\d{8}$/.test(digits)) return `+${digits}`
  throw new Error('أدخل رقم جوال سعودي صحيح، مثال: 05XXXXXXXX')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try { const saved = sessionStorage.getItem(KEY); return saved ? JSON.parse(saved) : null } catch { return null }
  })
  const [loading, setLoading] = useState(true)

  const userRef = useRef<AuthUser | null>(user)

  const persist = useCallback((next: AuthUser | null) => {
    userRef.current = next
    setUser(next)
    if (next) sessionStorage.setItem(KEY, JSON.stringify(next))
    else sessionStorage.removeItem(KEY)
  }, [])

  const loadUser = useCallback(async (): Promise<AuthUser | null> => {
    const { data: { user: authUser }, error } = await supabase.auth.getUser()

    // انقطاع شبكة مؤقت لا يجوز أن يُسقط جلسة قائمة ويطرد المستخدم من اللوحة.
    if (error && userRef.current) return userRef.current

    if (!authUser) { persist(null); return null }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name_ar, role, phone')
      .eq('id', authUser.id)
      .maybeSingle()

    // الافتراض الآمن: أي حساب بلا profile أو بدور غير إداري يُعامل كعميل.
    const next: AuthUser = {
      name: profile?.full_name_ar || authUser.user_metadata?.full_name || 'عميل بن نوح',
      email: authUser.email || undefined,
      phone: profile?.phone || authUser.phone || undefined,
      role: STAFF_ROLES.includes(profile?.role ?? '') ? 'admin' : 'client',
    }
    persist(next)
    return next
  }, [persist])

  useEffect(() => {
    void loadUser().finally(() => setLoading(false))
    const { data } = supabase.auth.onAuthStateChange(() => void loadUser())
    return () => data.subscription.unsubscribe()
  }, [loadUser])

  const requestPhoneOtp = useCallback(async (phone: string) => {
    const normalized = normalizeSaudiPhone(phone)
    const { error } = await supabase.auth.signInWithOtp({ phone: normalized })
    if (error) throw new Error(error.message)
  }, [])

  const verifyPhoneOtp = useCallback(async (phone: string, token: string) => {
    if (!/^\d{6}$/.test(token)) throw new Error('أدخل رمز التحقق المكوّن من 6 أرقام')
    const normalized = normalizeSaudiPhone(phone)
    const { error } = await supabase.auth.verifyOtp({ phone: normalized, token, type: 'sms' })
    if (error) throw new Error('رمز التحقق غير صحيح أو انتهت صلاحيته')
    await loadUser()
  }, [loadUser])

  const loginAdmin = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error('بيانات الدخول غير صحيحة')

    // كلمة المرور صحيحة لا تعني صلاحية إدارية. نتحقق من الدور هنا ونوضّح السبب،
    // بدل السماح بالدخول ثم طرده من اللوحة بلا رسالة.
    const account = await loadUser()
    if (!account || account.role !== 'admin') {
      await supabase.auth.signOut()
      persist(null)
      throw new Error(
        'الحساب صحيح لكن لا يملك صلاحية إدارية. يلزم إضافة صف لهذا المستخدم في جدول profiles بنفس معرّفه (UID) وبدور: super_admin.'
      )
    }
  }, [loadUser, persist])

  const logout = useCallback(() => { void supabase.auth.signOut(); persist(null) }, [persist])

  return (
    <AuthContext.Provider value={{ user, loading, requestPhoneOtp, verifyPhoneOtp, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
