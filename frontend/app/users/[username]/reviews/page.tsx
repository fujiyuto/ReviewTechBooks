import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useUserDetail } from '@/hooks/useUserDetail'
import { useUserReviews } from '@/hooks/useUserReviews'
import { UserReviewCard } from '@/components/features/users/UserReviewCard'
import { Pagination } from '@/components/ui/Pagination'

/** ユーザーレビュー一覧ページ */
export default function UserReviewsPage() {
  const { username } = useParams<{ username: string }>()

  if (!username) {
    return (
      <main className="px-4 py-8">
        <p className="text-red-600">無効なユーザー名です</p>
      </main>
    )
  }

  return <UserReviewsContent username={username} />
}

/** UserReviewsContentコンポーネントのprops */
interface UserReviewsContentProps {
  /** ユーザー名 */
  username: string
}

/**
 * ユーザーレビュー一覧コンテンツコンポーネント
 * @param username - ユーザー名
 */
function UserReviewsContent({ username }: UserReviewsContentProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1

  const { user } = useUserDetail(username)

  const {
    reviews,
    total,
    hasNext,
    hasPrev,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useUserReviews(username, { page })

  /**
   * ページネーションアクション
   * URLのpageクエリパラメータを変更、ページトップにスクロールする
   * @param page - ページ番号
   */
  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(page))
      return next
    })
  }

  return (
    <main className="px-4 py-8">
      <Link
        to={`/users/${username}`}
        className="mb-6 inline-block text-sm text-blue-600 hover:underline"
      >
        ← ユーザー詳細に戻る
      </Link>

      <div className="mb-6 flex items-baseline gap-2">
        <h1 className="text-2xl font-bold text-text-primary">
          {user?.username ?? '名無しユーザー'} のレビュー一覧
        </h1>
        {!reviewsLoading && (
          <span className="text-sm text-text-secondary">{total} 件</span>
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

      {!reviewsLoading && !reviewsError && reviews.length > 0 && (
        <Pagination
          currentPage={page}
          hasNext={hasNext}
          hasPrev={hasPrev}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  )
}
