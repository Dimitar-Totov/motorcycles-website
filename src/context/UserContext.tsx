'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import {
  login as authLogin,
  logout as authLogout,
  register as authRegister,
} from '@/services/auth/user'

interface UserContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string) => Promise<{ needsConfirmation: boolean }>
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextType | null>(null)

/**
 * Client-side auth context, **seeded with the server-resolved user** so there's
 * no auth flash. It keeps the client in sync via `onAuthStateChange` and calls
 * `router.refresh()` on every change so Server Components re-render with the new
 * session. Route protection itself lives in middleware, not here.
 */
export function UserProvider({
  children,
  initialUser,
}: {
  children: ReactNode
  initialUser: User | null
}) {
  const [user, setUser] = useState<User | null>(initialUser)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      // INITIAL_SESSION fires on every page hydration — the server already
      // seeded the user via initialUser, so refreshing here just causes a
      // redundant GET to the current URL (and a flood on 404 pages).
      if (event !== 'INITIAL_SESSION') {
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  async function login(email: string, password: string) {
    const data = await authLogin(email, password)
    setUser(data.user)
  }

  async function register(email: string, password: string, fullName: string) {
    const data = await authRegister(email, password, fullName)
    if (data.session) {
      setUser(data.user)
    }
    return { needsConfirmation: !data.session }
  }

  async function logout() {
    await authLogout()
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
