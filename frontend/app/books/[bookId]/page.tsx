import { useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useBookDetail } from '@/hooks/useBookDetail'
import { useBookReviews } from '@/hooks/useBookReviews'
import { BookDetail } from '@/components/features/books/BookDetail'
import { ReviewCard } from '@/components/features/books/ReviewCard'
import { Pagination } from '@/components/ui/Pagination'

/** 書籍詳細ページ */
export default function BookDetailPage() {
  const { bookId: bookIdStr } = useParams<{ bookId: string }>()
  const bookId = Number(bookIdStr)

  if (!Number.isInteger(bookId) || bookId <= 0) {
    return (
      <main className="px-4 py-8">
        <p className="text-red-600">無効な書籍IDです</p>
      </main>
    )
  }

  return <BookDetailContent bookId={bookId} />
}

function BookDetailContent({ bookId }: { bookId: number }) {
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    book,
    isLoading: bookLoading,
    error: bookError,
  } = useBookDetail(bookId)

  const {
    reviews,
    total,
    currentPage,
    hasNext,
    hasPrev,
    isLoading: reviewsLoading,
    error: reviewsError,
    setPage,
  } = useBookReviews(bookId)

  // URLの page クエリパラメータが変わるたびにフックのページ状態を同期する
  useEffect(() => {
    const raw = Number(searchParams.get('page'))
    const page = Number.isInteger(raw) && raw >= 1 ? raw : 1
    setPage(page)
  }, [searchParams])

  /**
   * ページネーションアクション
   * URLのpageクエリパラメータを変更、ページトップにスクロールする
   * @params page - ページ番号
   */
  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(page))
      return next
    })
  }

  if (bookLoading) {
    return (
      <main className="px-4 py-8">
        <div className="animate-pulse">
          <div className="flex gap-6">
            <div className="aspect-[3/4] w-40 shrink-0 rounded-lg bg-surface-overlay" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-3/4 rounded bg-surface-overlay" />
              <div className="h-4 w-1/2 rounded bg-surface-overlay" />
              <div className="h-4 w-1/3 rounded bg-surface-overlay" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (bookError) {
    return (
      <main className="px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">{bookError}</p>
        </div>
      </main>
    )
  }

  if (!book) return null

  return (
    <main className="px-4 py-8">
      <BookDetail book={book} />

      {/* レビューセクション */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <h2 className="text-xl font-bold text-text-primary">レビュー</h2>
            {!reviewsLoading && (
              <span className="text-sm text-text-secondary">{total} 件</span>
            )}
          </div>
          <Link
            to="/reviews/create"
            className="rounded-md bg-text-primary px-4 py-2 text-sm font-medium text-white hover:opacity-80"
          >
            レビューを投稿
          </Link>
        </div>

        {reviewsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg border border-surface-border p-4"
              >
                <div className="mb-2 h-4 w-1/3 rounded bg-surface-overlay" />
                <div className="h-3 w-full rounded bg-surface-overlay" />
                <div className="mt-1 h-3 w-4/5 rounded bg-surface-overlay" />
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
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {!reviewsLoading && !reviewsError && reviews.length > 0 && (
          <Pagination
            currentPage={currentPage}
            hasNext={hasNext}
            hasPrev={hasPrev}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </main>
  )
}
