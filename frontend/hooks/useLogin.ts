import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmail, signInWithGoogle } from '@/api/auth'

/** useLogin フックの戻り値 */
export interface UseLoginResult {
  /** ローディング中フラグ */
  isLoading: boolean
  /** エラーメッセージ（正常時は null） */
  error: string | null
  /** メール/パスワードでログインする */
  login: (email: string, password: string) => Promise<void>
  /** Google OAuth でログインする */
  loginWithGoogle: () => Promise<void>
}

/**
 * ユーザーログイン処理を管理するカスタムフック
 * API 呼び出しとローディング・エラー状態の管理に専念する
 */
export function useLogin(): UseLoginResult {
  /** ローディング中フラグ */
  const [isLoading, setIsLoading] = useState(false)
  /** エラーメッセージ */
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  /**
   * メールアドレスとパスワードでログインを行う
   * 成功時に /books へリダイレクトする
   * @param email - ログインするメールアドレス
   * @param password - ログインするパスワード
   */
  const login = async (email: string, password: string) => {
    setError(null)
    setIsLoading(true)
    try {
      await signInWithEmail(email, password)
      navigate('/books')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Google OAuth でログインを行う
   * Supabase が Google 認証ページへリダイレクトし、完了後 /books に戻る
   */
  const loginWithGoogle = async () => {
    setError(null)
    setIsLoading(true)
    try {
      await signInWithGoogle(`${window.location.origin}/books`)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Google ログインに失敗しました',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, login, loginWithGoogle }
}
