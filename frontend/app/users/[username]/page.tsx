import { useParams, Link } from 'react-router-dom'
import { useUserDetail } from '@/hooks/useUserDetail'
import { useUserReviews } from '@/hooks/useUserReviews'
import { UserProfile } from '@/components/features/users/UserProfile'
import { UserReviewCard } from '@/components/features/users/UserReviewCard'

/** ユーザー詳細ページ */
export default function UserDetailPage() {
  const { username } = useParams<{ username: string }>()

  if (!username) {
    return (
      <main className="px-4 py-8">
        <p className="text-red-600">無効なユーザー名です</p>
      </main>
    )
  }

  return <UserDetailContent username={username} />
}

/** ユーザー詳細コンテンツコンポーネントのprops */
interface UserDetailContentProps {
  /** ユーザー名 */
  username: string
}

/**
 * ユーザー詳細コンテンツコンポーネント
 * @param username - ユーザー名
 */
function UserDetailContent({ username }: UserDetailContentProps) {
  const {
    user,
    isLoading: userLoading,
    error: userError,
  } = useUserDetail(username)

  const {
    reviews,
    total,
    hasNext,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useUserReviews(username, { limit: 5 })

  if (userLoading) {
    return (
      <main className="px-4 py-8">
        <div className="animate-pulse">
          <div className="mb-8 rounded-lg border border-surface-border p-6">
            <div className="h-8 w-1/3 rounded bg-surface-overlay" />
            <div className="mt-2 h-4 w-2/3 rounded bg-surface-overlay" />
          </div>
        </div>
      </main>
    )
  }

  if (userError) {
    return (
      <main className="px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">{userError}</p>
        </div>
      </main>
    )
  }

  if (!user) return null

  return (
    <main className="px-4 py-8">
      <UserProfile user={user} />

      {/* レビューセクション */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <h2 className="text-xl font-bold text-text-primary">
              投稿したレビュー
            </h2>
            {!reviewsLoading && (
              <span className="text-sm text-text-secondary">{total} 件</span>
            )}
          </div>
          {!reviewsLoading && hasNext && (
            <Link
              to={`/users/${username}/reviews`}
              className="text-sm text-blue-600 hover:underline"
            >
              すべて見る
            </Link>
          )}
        </div>

        {reviewsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border border-surface-border p-4"
              >
                <div className="flex gap-4">
                  <div className="h-16 w-12 rounded bg-surface-overlay" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/4 rounded bg-surface-overlay" />
                    <div className="h-4 w-1/2 rounded bg-surface-overlay" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviewsError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-600">{reviewsError}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-lg border border-surface-border bg-surface-raised p-12 text-center">
            <p className="text-text-secondary">まだレビューがありません</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <UserReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
