import { useState, useEffect } from 'react'
import { fetchUserDetail, type User } from '@/api/users'

/** useUserDetail フックの戻り値 */
export interface UseUserDetailResult {
  /** 取得したユーザー詳細 */
  user: User | null
  /** フェッチ中フラグ */
  isLoading: boolean
  /** エラーメッセージ（正常時は null） */
  error: string | null
}

/**
 * ユーザー詳細を取得・管理するカスタムフック
 * @param username - ユーザー名
 */
export function useUserDetail(username: string): UseUserDetailResult {
  /** ユーザー詳細 */
  const [user, setUser] = useState<User | null>(null)
  /** フェッチ中フラグ */
  const [isLoading, setIsLoading] = useState(true)
  /** エラーメッセージ */
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    /** ユーザー詳細をフェッチする */
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchUserDetail(username)
        if (!cancelled) {
          setUser(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : '予期しないエラーが発生しました',
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [username])

  return { user, isLoading, error }
}
