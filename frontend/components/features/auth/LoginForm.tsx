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
        Google でログイン
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
