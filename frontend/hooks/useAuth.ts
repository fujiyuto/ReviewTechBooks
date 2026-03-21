import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import type { AuthContextValue } from '@/contexts/AuthContext'

/**
 * 認証状態を取得するカスタムフック
 * AuthProvider 内でのみ使用可能
 * @returns 認証状態（isLoggedIn, isLoading）
 * @throws AuthProvider 外で呼び出した場合にエラーをスロー
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
