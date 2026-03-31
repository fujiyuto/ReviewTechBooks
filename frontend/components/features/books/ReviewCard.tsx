import { Link } from 'react-router-dom'
import type { components } from '@/types/api'

/** ReviewCardコンポーネントのprops */
interface ReviewCardProps {
  /** レビュー情報 */
  review: components['schemas']['Review']
}

/**
 * レビューカードコンポーネント
 * 投稿者・タイトル・カテゴリバッジ・本文・投稿日を表示する
 * @param review - レビュー情報
 */
export function ReviewCard({ review }: ReviewCardProps) {
  const initial = review.user?.username?.[0]?.toUpperCase()

  return (
    <div className="rounded-lg border border-surface-border bg-surface-raised p-4">
      {/* 投稿者情報 */}
      <div className="mb-3 flex items-center justify-between">
        {review.user?.id && review.user?.username ? (
          <Link
            to={`/users/${review.user.id}`}
            className="flex items-center gap-2 hover:opacity-80"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-overlay text-xs font-semibold text-text-primary">
              {initial}
            </span>
            <span className="text-sm font-medium text-text-primary">
              {review.user.username}
            </span>
          </Link>
        ) : (
          <span className="text-sm text-text-secondary">匿名ユーザー</span>
        )}
        {review.createdAt && (
          <span className="text-xs text-text-secondary">
            {new Date(review.createdAt).toLocaleDateString('ja-JP')}
          </span>
        )}
      </div>

      {/* レビュー内容 */}
      <p className="mb-2 font-semibold text-text-primary">
        {review.title ?? '無題'}
      </p>
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
    </div>
  )
}
