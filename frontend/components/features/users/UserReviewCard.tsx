import type { components } from '@/types/api'

/** UserReviewCardコンポーネントのprops */
interface UserReviewCardProps {
  /** レビュー情報 */
  review: components['schemas']['UserReview']
}

/**
 * ユーザーレビューカードコンポーネント
 * 書籍サムネイル・レビュータイトル・カテゴリバッジ・本文・投稿日を表示する
 * @param review - レビュー情報
 */
export function UserReviewCard({ review }: UserReviewCardProps) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-raised p-4">
      <div className="flex gap-4">
        {review.book?.thumbnailUrl ? (
          <img
            src={review.book.thumbnailUrl}
            alt={review.book.title ?? '書籍'}
            className="h-16 w-12 shrink-0 rounded object-cover"
          />
        ) : (
          <div className="h-16 w-12 shrink-0 rounded bg-surface-overlay" />
        )}
        <div className="min-w-0 flex-1">
          {review.book?.title && (
            <p className="mb-1 truncate text-xs text-text-secondary">
              {review.book.title}
            </p>
          )}
          <p className="font-semibold text-text-primary">
            {review.title ?? '無題'}
          </p>
          {review.categories && review.categories.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {review.categories.map((cat) => (
                <span
                  key={cat.id}
                  className="rounded-full border border-surface-border px-2 py-0.5 text-xs text-text-secondary"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {review.content && (
        <p className="mt-3 whitespace-pre-line text-sm text-text-secondary">
          {review.content}
        </p>
      )}
      {review.createdAt && (
        <p className="mt-2 text-xs text-text-secondary">
          {new Date(review.createdAt).toLocaleDateString('ja-JP')}
        </p>
      )}
    </div>
  )
}
