import type { components } from '@/types/api'

/** ReviewCardコンポーネントのprops */
interface ReviewCardProps {
  /** レビュー情報 */
  review: components['schemas']['Review']
}

/**
 * レビューカードコンポーネント
 * タイトル・ユーザー名・カテゴリバッジ・本文・投稿日を表示する
 * @param review - レビュー情報
 */
export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="rounded-lg border border-surface-border bg-surface-raised p-4">
      <div className="mb-1 flex items-center justify-between">
        <p className="font-semibold text-text-primary">
          {review.title ?? '無題'}
        </p>
        {review.user?.username && (
          <span className="text-xs text-text-secondary">
            {review.user.username}
          </span>
        )}
      </div>
      {review.categories && review.categories.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
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
      {review.content && (
        <p className="whitespace-pre-line text-sm text-text-secondary">
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
