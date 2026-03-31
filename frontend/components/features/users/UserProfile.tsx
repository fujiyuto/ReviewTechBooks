import type { components } from '@/types/api'

/** UserProfileコンポーネントのprops */
interface UserProfileProps {
  /** ユーザー情報 */
  user: components['schemas']['User']
}

/**
 * ユーザープロフィールコンポーネント
 * ユーザー名・自己紹介・ロールを表示する
 * @param user - ユーザー情報
 */
export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="mb-8 rounded-lg border border-surface-border bg-surface-raised p-6">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-primary">
              {user.username ?? '名無しユーザー'}
            </h1>
            {user.role && (
              <span className="rounded-full border border-surface-border px-2 py-0.5 text-xs text-text-secondary">
                {user.role === 'premium' ? 'プレミアム' : 'フリー'}
              </span>
            )}
          </div>
          {user.biography && (
            <p className="whitespace-pre-line text-sm text-text-secondary">
              {user.biography}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
