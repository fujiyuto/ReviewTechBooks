import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signUpWithEmail, signInWithGoogle } from '@/api/auth'

/** useRegister フックの戻り値 */
export interface UseRegisterResult {
  /** ローディング中フラグ */
  isLoading: boolean
  /** エラーメッセージ（正常時は null） */
  error: string | null
  /** メール/パスワードで登録する */
  register: (email: string, password: string) => Promise<void>
  /** Google OAuth で登録する */
  registerWithGoogle: () => Promise<void>
}

/**
 * ユーザー登録処理を管理するカスタムフック
 * API 呼び出しとローディング・エラー状態の管理に専念する
 */
export function useRegister(): UseRegisterResult {
  /** ローディング中フラグ */
  const [isLoading, setIsLoading] = useState(false)
  /** エラーメッセージ */
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  /**
   * メールアドレスとパスワードでユーザー登録を行う
   * 成功時に /books へリダイレクトする
   * @param email - 登録するメールアドレス
   * @param password - 登録するパスワード
   */
  const register = async (email: string, password: string) => {
    setError(null)
    setIsLoading(true)
    try {
      await signUpWithEmail(email, password)
      navigate('/books')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '登録に失敗しました',
      )
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Google OAuth でユーザー登録・ログインを行う
   * Supabase が Google 認証ページへリダイレクトし、完了後 /books に戻る
   */
  const registerWithGoogle = async () => {
    setError(null)
    setIsLoading(true)
    try {
      await signInWithGoogle(`${window.location.origin}/books`)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Google 登録に失敗しました',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, register, registerWithGoogle }
}
