import { supabase } from '@/lib/supabase'

/**
 * メールアドレスとパスワードでユーザー登録を行う
 * @param email - メールアドレス
 * @param password - パスワード
 * @returns Supabase auth.signUp のレスポンス
 * @throws 登録に失敗した場合にエラーをスロー
 */
export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

/**
 * Google OAuth でユーザー登録・ログインを行う
 * @param redirectTo - 認証後のリダイレクト先 URL
 * @returns Supabase auth.signInWithOAuth のレスポンス
 * @throws 認証開始に失敗した場合にエラーをスロー
 */
export async function signInWithGoogle(redirectTo: string) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  })
  if (error) throw error
  return data
}
