import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { BookCard } from '@/components/features/books/BookCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useBooks, type BooksFilter } from '@/hooks/useBooks'

/** 書籍一覧ページ */
export default function BookListPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    books,
    total,
    currentPage,
    hasNext,
    hasPrev,
    isLoading,
    error,
    setPage,
    setFilters,
  } = useBooks()

  // URLの page クエリパラメータが変わるたびにフックのページ状態を同期する
  useEffect(() => {
    const raw = Number(searchParams.get('page'))
    const page = Number.isInteger(raw) && raw >= 1 ? raw : 1
    setPage(page)
  }, [])

  /** フォームの下書き状態 */
  const [draft, setDraft] = useState<BooksFilter>({
    title: '',
    author: '',
    publishedBy: '',
  })

  /**
   * 検索フォーム送信ハンドラ
   * フィルタを更新し、ページを 1 にリセットする
   * @param e - フォームイベント
   */
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFilters({
      title: draft.title || undefined,
      author: draft.author || undefined,
      publishedBy: draft.publishedBy || undefined,
    })
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('page')
      return next
    })
  }

  return (
    <>
      {/* ヘッダー */}
      <div className="mb-6 flex items-baseline gap-3">
        <h1 className="text-2xl font-bold text-text-primary">書籍一覧</h1>
        {!isLoading && (
          <span className="text-sm text-text-secondary">{total} 件</span>
        )}
      </div>

      {/* 検索フォーム */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 flex flex-wrap gap-3 rounded-lg border border-surface-border bg-surface-raised p-4"
      >
        <Input
          type="text"
          placeholder="書籍名"
          value={draft.title ?? ''}
          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
        />
        <Input
          type="text"
          placeholder="著者名"
          value={draft.author ?? ''}
          onChange={(e) => setDraft((d) => ({ ...d, author: e.target.value }))}
        />
        <Input
          type="text"
          placeholder="出版社名"
          value={draft.publishedBy ?? ''}
          onChange={(e) =>
            setDraft((d) => ({ ...d, publishedBy: e.target.value }))
          }
        />
        <Button type="submit" variant="primary" className="px-5">
          検索
        </Button>
      </form>

      {/* コンテンツエリア */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] w-full rounded-lg bg-surface-overlay" />
              <div className="mt-2 h-4 w-3/4 rounded bg-surface-overlay" />
              <div className="mt-1 h-3 w-1/2 rounded bg-surface-overlay" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : books.length === 0 ? (
        <div className="rounded-lg border border-surface-border bg-surface-raised p-12 text-center">
          <p className="text-text-secondary">書籍が見つかりませんでした</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}

      {/* ページネーション */}
      {!isLoading && !error && books.length > 0 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {hasPrev ? (
            <Link
              to={{
                pathname: '/books',
                search: `?page=${currentPage - 1}`,
              }}
              reloadDocument
            >
              前ページ
            </Link>
          ) : (
            <span className="opacity-50 cursor-not-allowed">前ページ</span>
          )}
          <span className="px-3 text-sm text-text-secondary">
            {currentPage} ページ
          </span>
          {hasNext ? (
            <Link
              to={{
                pathname: '/books',
                search: `?page=${currentPage + 1}`,
              }}
              reloadDocument
            >
              次ページ
            </Link>
          ) : (
            <span className="opacity-50 cursor-not-allowed">次ページ</span>
          )}
        </div>
      )}
    </>
  )
}
