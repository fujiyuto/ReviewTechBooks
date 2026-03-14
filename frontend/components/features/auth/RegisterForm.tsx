import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useRegister } from '@/hooks/useRegister'

/** フォームのバリデーションスキーマ */
const schema = z
  .object({
    email: z.email('有効なメールアドレスを入力してください'),
    password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  })

/** フォームの入力値の型 */
type RegisterFormValues = z.infer<typeof schema>

/**
 * ユーザー登録フォームコンポーネント
 * メール/パスワード登録と Google OAuth 登録をサポートする
 */
export function RegisterForm() {
  const {
    isLoading,
    error,
    register: registerUser,
    registerWithGoogle,
  } = useRegister()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
  })

  /**
   * フォーム送信ハンドラ
   * @param data - バリデーション済みフォーム入力値
   */
  const onSubmit = async (data: RegisterFormValues) => {
    await registerUser(data.email, data.password)
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-surface-border bg-surface-base p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-text-primary">
        ユーザー登録
      </h1>

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
            placeholder="8文字以上"
            disabled={isLoading}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-text-secondary"
          >
            パスワード（確認）
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="パスワードを再入力"
            disabled={isLoading}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? '登録中...' : '登録する'}
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
        onClick={registerWithGoogle}
      >
        Google で登録
      </Button>

      <p className="mt-6 text-center text-sm text-text-secondary">
        すでにアカウントをお持ちの方は{' '}
        <Link
          to="/users/login"
          className="text-primary-600 hover:text-primary-700 hover:underline"
        >
          ログイン
        </Link>
      </p>
    </div>
  )
}
