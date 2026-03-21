import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useOnboarding } from '@/hooks/useOnboarding'

/** フォームのバリデーションスキーマ */
const schema = z.object({
  userName: z.string().min(1, 'ユーザー名を入力してください'),
  bio: z.string(),
})

/** フォームの入力値の型 */
type RegisterOnboardingFormValues = z.infer<typeof schema>

/**
 * Google OAuth 登録後のユーザー名入力フォームコンポーネント
 * ユーザー名を設定してオンボーディングを完了する
 */
export function RegisterOnboardingForm() {
  const { isLoading, error, completeOnboarding } = useOnboarding()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterOnboardingFormValues>({
    resolver: zodResolver(schema),
  })

  /**
   * フォーム送信ハンドラ
   * @param data - バリデーション済みフォーム入力値
   */
  const onSubmit = async (data: RegisterOnboardingFormValues) => {
    await completeOnboarding(data.userName, data.bio)
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-surface-border bg-surface-base p-8 shadow-sm">
      <h1 className="mb-2 text-2xl font-bold text-text-primary">
        ユーザー名を設定
      </h1>
      <p className="mb-6 text-sm text-text-secondary">
        サービス内で表示されるユーザー名を入力してください
      </p>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="userName"
            className="text-sm font-medium text-text-secondary"
          >
            ユーザー名
          </label>
          <Input
            id="userName"
            type="text"
            placeholder="ユーザー名を入力"
            disabled={isLoading}
            {...register('userName')}
          />
          {errors.userName && (
            <p className="text-sm text-red-600">{errors.userName.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="bio"
            className="text-sm font-medium text-text-secondary"
          >
            自己紹介文
          </label>
          <Textarea
            id="bio"
            placeholder="自己紹介文を入力（任意）"
            disabled={isLoading}
            {...register('bio')}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? '設定中...' : '設定する'}
        </Button>
      </form>
    </div>
  )
}
