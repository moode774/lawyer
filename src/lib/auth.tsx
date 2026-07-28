import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface AuthUser {
  name: string
  email: string
  role: 'admin' | 'client'
}

interface AuthContextValue {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  loginAsClient: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: async () => {},
  loginAsClient: () => {},
  logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

const KEY = 'lf_demo_session'

/**
 * مصادقة تجريبية للعرض. في الإنتاج: Supabase Auth
 * (email/password + password reset + RLS). انظر README و supabase/schema.sql.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = sessionStorage.getItem(KEY)
      return raw ? (JSON.parse(raw) as AuthUser) : null
    } catch {
      return null
    }
  })

  const persist = (u: AuthUser | null) => {
    setUser(u)
    if (u) sessionStorage.setItem(KEY, JSON.stringify(u))
    else sessionStorage.removeItem(KEY)
  }

  const login = useCallback(async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 500))
    if (!email.includes('@')) throw new Error('بيانات الدخول غير صحيحة')
    persist({ name: 'أ. أحمد المحامي', email, role: 'admin' })
  }, [])

  const loginAsClient = useCallback(() => {
    persist({ name: 'أمل الحارثي', email: 'a.alharthi@example.sa', role: 'client' })
  }, [])

  const logout = useCallback(() => persist(null), [])

  return (
    <AuthContext.Provider value={{ user, login, loginAsClient, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
