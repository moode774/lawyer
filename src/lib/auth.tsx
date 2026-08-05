import { createContext, useCallback, useContext, useEffect, useState } from 'react'
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
  requestPhoneOtp: (phone: string) => Promise<void>
  verifyPhoneOtp: (phone: string, token: string) => Promise<void>
  loginAdmin: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  requestPhoneOtp: async () => {},
  verifyPhoneOtp: async () => {},
  loginAdmin: async () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)
const KEY = 'bin-nouh-user-session'

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

  const persist = useCallback((next: AuthUser | null) => {
    setUser(next)
    if (next) sessionStorage.setItem(KEY, JSON.stringify(next))
    else sessionStorage.removeItem(KEY)
  }, [])

  const STAFF_ROLES = ['super_admin', 'lawyer', 'staff', 'marketing']

  const loadUser = useCallback(async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) { persist(null); return }
    const { data: profile } = await supabase.from('profiles').select('full_name_ar, role, phone').eq('id', authUser.id).maybeSingle()
    // الافتراض الآمن: أي حساب بلا profile أو بدور غير إداري يُعامل كعميل.
    persist({
      name: profile?.full_name_ar || authUser.user_metadata?.full_name || 'عميل بن نوح',
      email: authUser.email || undefined,
      phone: profile?.phone || authUser.phone || undefined,
      role: STAFF_ROLES.includes(profile?.role ?? '') ? 'admin' : 'client',
    })
  }, [persist])

  useEffect(() => {
    void loadUser()
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
    await loadUser()
  }, [loadUser])

  const logout = useCallback(() => { void supabase.auth.signOut(); persist(null) }, [persist])
  return <AuthContext.Provider value={{ user, requestPhoneOtp, verifyPhoneOtp, loginAdmin, logout }}>{children}</AuthContext.Provider>
}
