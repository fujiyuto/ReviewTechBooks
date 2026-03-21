import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from '@/api/auth'

/** useLogout フックの戻り値 */
export interface UseLogoutResult {
  /** ログアウト処理中フラグ */
  isLoading: boolean
  /** エラーメッセージ（正常時は null） */
  error: string | null
  /** ログアウトを実行する */
  logout: () => Promise<void>
}

/**
 * ログアウト処理を管理するカスタムフック
 * ログアウト成功後 /users/login へリダイレクトする
 */
export function useLogout(): UseLogoutResult {
  /** ログアウト処理中フラグ */
  const [isLoading, setIsLoading] = useState(false)
  /** エラーメッセージ */
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  /**
   * ログアウトを実行し、/users/login へリダイレクトする
   */
  const logout = async () => {
    setError(null)
    setIsLoading(true)
    try {
      await signOut()
      navigate('/users/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログアウトに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, logout }
}
