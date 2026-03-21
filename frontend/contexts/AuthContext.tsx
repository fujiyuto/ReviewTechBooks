import { createContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

/** AuthContext の値の型 */
export interface AuthContextValue {
  /** ログイン済みかどうか */
  isLoggedIn: boolean
  /** セッション確認中かどうか */
  isLoading: boolean
}

/** 認証状態を管理する Context */
export const AuthContext = createContext<AuthContextValue | null>(null)

/** AuthContext.Provider のプロパティ型 */
interface AuthProviderProps {
  /** 子コンポーネント */
  children: React.ReactNode
}

/**
 * 認証状態を管理する Provider コンポーネント
 * Supabase のセッションを監視し、ログイン状態を提供する
 */
export function AuthProvider({ children }: AuthProviderProps) {
  /** ログイン済みかどうか */
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  /** セッション確認中かどうか */
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return <AuthContext value={{ isLoggedIn, isLoading }}>{children}</AuthContext>
}
