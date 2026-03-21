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
    password: z
      .string()
      .min(
        8,
        '8~64文字で大文字、小文字、数字、特殊文字（!@#等）を1文字以上含めてください',
      )
      .max(
        64,
        '8~64文字で大文字、小文字、数字、特殊文字（!@#等）を1文字以上含めてください',
      )
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':",.<>?/]).+$/,
        '8~64文字で大文字、小文字、数字、特殊文字（!@#等）を1文字以上含めてください',
      ),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  })

/** フォームの入力値の型 */
type RegisterEmailFormValues = z.infer<typeof schema>

/**
 * メールアドレスでのユーザー登録フォームコンポーネント
 * ユーザー名・メール・パスワードを入力して登録する
 */
export function RegisterEmailForm() {
  const { isLoading, error, register: registerUser } = useRegister()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterEmailFormValues>({
    resolver: zodResolver(schema),
  })

  /**
   * フォーム送信ハンドラ
   * @param data - バリデーション済みフォーム入力値
   */
  const onSubmit = async (data: RegisterEmailFormValues) => {
    await registerUser(data.email, data.password)
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-surface-border bg-surface-base p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-text-primary">
        メールアドレスで登録
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

      <p className="mt-6 text-center text-sm text-text-secondary">
        <Link
          to="/users/create"
          className="text-primary-600 hover:text-primary-700 hover:underline"
        >
          他の方法で登録
        </Link>
      </p>
    </div>
  )
}
