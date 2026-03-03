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
  /** 現在のページ番号 */
  currentPage: number
  /** 現在のフィルタ条件 */
  filters: BooksFilter
  /** ページを変更する */
  setPage: (page: number) => void
  /** フィルタを変更する（ページは 1 にリセットされる） */
  setFilters: (filters: BooksFilter) => void
}

/** 1ページあたりの表示件数 */
const LIMIT = 10

/**
 * 書籍一覧を取得・管理するカスタムフック
 * ページネーションとフィルタ検索をサポートする
 */
export function useBooks(): UseBooksResult {
  /** 取得した書籍一覧 */
  const [books, setBooks] = useState<BookSummary[]>([])
  /** 総件数 */
  const [total, setTotal] = useState(0)
  /** 現在のページ番号 */
  const [currentPage, setCurrentPage] = useState(1)
  /** 次ページの有無 */
  const [hasNext, setHasNext] = useState(false)
  /** 前ページの有無 */
  const [hasPrev, setHasPrev] = useState(false)

  /** フェッチ中フラグ */
  const [isLoading, setIsLoading] = useState(true)
  /** エラーメッセージ */
  const [error, setError] = useState<string | null>(null)

  /** リクエストするページ番号 */
  const [page, setPageState] = useState(1)
  /** リクエストするフィルタ条件 */
  const [filters, setFiltersState] = useState<BooksFilter>({})

  useEffect(() => {
    let cancelled = false

    /** 書籍一覧をフェッチする */
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchBooks({
          ...filters,
          page,
          limit: LIMIT,
        })
        if (!cancelled) {
          setBooks(data.books ?? [])
          setTotal(data.total ?? 0)
          setCurrentPage(data.currentPage ?? 1)
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
  }, [page, filters])

  /**
   * ページを変更する
   * @param nextPage - 移動先のページ番号
   */
  const setPage = (nextPage: number) => {
    setPageState(nextPage)
  }

  /**
   * フィルタ条件を変更する（ページは 1 にリセットされる）
   * @param nextFilters - 新しいフィルタ条件
   */
  const setFilters = (nextFilters: BooksFilter) => {
    setFiltersState(nextFilters)
    setPageState(1)
  }

  return {
    books,
    total,
    currentPage,
    hasNext,
    hasPrev,
    isLoading,
    error,
    filters,
    setPage,
    setFilters,
  }
}
