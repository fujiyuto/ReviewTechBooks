import { Link } from 'react-router-dom'
import type { BookSummary } from '@/api/books'

/** BookCardコンポーネントのprops */
interface BookCardProps {
  /** 表示する書籍データ */
  book: BookSummary
}

/**
 * 書籍一覧で使用するカードコンポーネント
 * サムネイル・タイトル・著者・出版社を表示し、書籍詳細ページへのリンクを提供する
 */
export function BookCard({ book }: BookCardProps) {
  const {
    id = 0,
    title = 'タイトル不明',
    author = '',
    publishedBy = '',
    thumbnailUrl,
  } = book

  return (
    <Link
      to={`/books/${id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-surface-border bg-surface-base shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-overlay">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">
            <span className="text-sm">No Image</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 text-sm font-semibold text-text-primary leading-snug">
          {title}
        </p>
        {author && (
          <p className="text-xs text-text-secondary line-clamp-1">{author}</p>
        )}
        {publishedBy && (
          <p className="mt-auto text-xs text-text-muted">{publishedBy}</p>
        )}
      </div>
    </Link>
  )
}
