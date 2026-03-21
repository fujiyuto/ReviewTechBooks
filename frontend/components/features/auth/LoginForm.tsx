import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useLogin } from '@/hooks/useLogin'

/** フォームのバリデーションスキーマ */
const schema = z.object({
  email: z.email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
})

/** フォームの入力値の型 */
type LoginFormValues = z.infer<typeof schema>

/**
 * ユーザーログインフォームコンポーネント
 * メール/パスワードログインと Google OAuth ログインをサポートする
 */
export function LoginForm() {
  const { isLoading, error, login, loginWithGoogle } = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
  })

  /**
   * フォーム送信ハンドラ
   * @param data - バリデーション済みフォーム入力値
   */
  const onSubmit = async (data: LoginFormValues) => {
    await login(data.email, data.password)
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-surface-border bg-surface-base p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-text-primary">ログイン</h1>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-sm font-medium text-text-secondary"
          >
            メールアドレス
          </label>
          <Input
            id="email"
            type="email"
            placeholder="example@example.com"
            disabled={isLoading}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-text-secondary"
          >
            パスワード
          </label>
          <Input
            id="password"
            type="password"
            placeholder="パスワードを入力"
            disabled={isLoading}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'ログイン中...' : 'ログインする'}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-surface-border" />
        <span className="text-xs text-text-muted">OR</span>
        <div className="h-px flex-1 bg-surface-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isLoading}
        onClick={loginWithGoogle}
      >
        <div className="flex justify-center items-center gap-2">
          <div>
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-5 h-5"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              ></path>
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              ></path>
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              ></path>
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              ></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          </div>
          <div>
            <span>Google で登録</span>
          </div>
        </div>
      </Button>

      <p className="mt-6 text-center text-sm text-text-secondary">
        アカウントをお持ちでない方は{' '}
        <Link
          to="/users/create"
          className="text-primary-600 hover:text-primary-700 hover:underline"
        >
          新規登録
        </Link>
      </p>
    </div>
  )
}
