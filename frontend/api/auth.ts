import { supabase } from '@/lib/supabase'

/**
 * メールアドレスとパスワードでユーザー登録を行う
 * @param email - メールアドレス
 * @param password - パスワード
 * @returns Supabase auth.signUp のレスポンス
 * @throws 登録に失敗した場合にエラーをスロー
 */
export async function signUpWithEmail(
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })
  if (error) throw error

  return data
}

/**
 * ユーザー登録後のオンボーディング登録
 * @param username - 設定するユーザー名
 * @param biography - 自己紹介文
 * @returns Supabase auth.updateUser のレスポンス
 * @throws 更新に失敗した場合にエラーをスロー
 */
export async function updateOnboarding(
  username: string,
  biography: string
) {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('ユーザー情報の登録に失敗しました')
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      authId: user?.id,
      username,
      biography
    }),
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message ?? 'エラーが発生しました')
  }
}

/**
 * メールアドレスとパスワードでログインを行う
 * @param email - メールアドレス
 * @param password - パスワード
 * @returns Supabase auth.signInWithPassword のレスポンス
 * @throws ログインに失敗した場合にエラーをスロー
 */
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
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
