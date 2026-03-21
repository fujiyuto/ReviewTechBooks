import { useState, useEffect } from 'react'
import { fetchBooks, type BookSummary } from '@/api/books'

/** 書籍一覧のフィルタ条件 */
export interface BooksFilter {
  /** 書籍名（部分一致） */
  title?: string
  /** 著者名（部分一致） */
  author?: string
  /** 出版社名（部分一致） */
  publishedBy?: string
}

/** useBooks フックの戻り値 */
export interface UseBooksResult {
  /** 取得した書籍一覧 */
  books: BookSummary[]
  /** 総件数 */
  total: number
  /** 次ページが存在するか */
  hasNext: boolean
  /** 前ページが存在するか */
  hasPrev: boolean
  /** フェッチ中フラグ */
  isLoading: boolean
  /** エラーメッセージ（正常時は null） */
  error: string | null
}

/** 1ページあたりの表示件数 */
const LIMIT = 10

/**
 * 書籍一覧を取得・管理するカスタムフック
 * ページネーションとフィルタ検索をサポートする
 */
export function useBooks(queryParams: {
  title?: string
  author?: string
  publishedBy?: string
  page?: number
}): UseBooksResult {
  /** 取得した書籍一覧 */
  const [books, setBooks] = useState<BookSummary[]>([])
  /** 総件数 */
  const [total, setTotal] = useState(0)
  /** 次ページの有無 */
  const [hasNext, setHasNext] = useState(false)
  /** 前ページの有無 */
  const [hasPrev, setHasPrev] = useState(false)

  /** フェッチ中フラグ */
  const [isLoading, setIsLoading] = useState(true)
  /** エラーメッセージ */
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    /** 書籍一覧をフェッチする */
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchBooks({
          ...queryParams,
          limit: LIMIT,
        })
        if (!cancelled) {
          setBooks(data.books ?? [])
          setTotal(data.total ?? 0)
          setHasNext(data.next ?? false)
          setHasPrev(data.prev ?? false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : '予期しないエラーが発生しました',
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [
    queryParams.title,
    queryParams.author,
    queryParams.publishedBy,
    queryParams.page,
  ])

  return {
    books,
    total,
    hasNext,
    hasPrev,
    isLoading,
    error,
  }
}
