import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateOnboarding } from '@/api/auth'

/** useOnboarding フックの戻り値 */
export interface UseOnboardingResult {
  /** ローディング中フラグ */
  isLoading: boolean
  /** エラーメッセージ（正常時は null） */
  error: string | null
  /** ユーザー名と自己紹介文を設定してオンボーディングを完了する */
  completeOnboarding: (username: string, bio: string) => Promise<void>
}

/**
 * Google OAuth 後のオンボーディング処理を管理するカスタムフック
 * ユーザー名の設定と /books へのリダイレクトを担う
 */
export function useOnboarding(): UseOnboardingResult {
  /** ローディング中フラグ */
  const [isLoading, setIsLoading] = useState(false)
  /** エラーメッセージ */
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  /**
   * ユーザー登録APIを送信し、成功時 /books へリダイレクトする
   * @param username - 設定するユーザー名
   * @param bio - 自己紹介文
   */
  const completeOnboarding = async (username: string, bio: string) => {
    setError(null)
    setIsLoading(true)
    try {
      await updateOnboarding(username, bio)
      navigate('/books')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'ユーザー情報の登録に失敗しました',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, completeOnboarding }
}
