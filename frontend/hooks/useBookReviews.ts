import { useState, useEffect } from 'react'
import { type Review } from '@/api/books'
import { fetchBookReviews } from '@/api/reviews'

/** useBookReviews フックの戻り値 */
export interface UseBookReviewsResult {
  /** 取得したレビュー一覧 */
  reviews: Review[]
  /** 総件数 */
  total: number
  /** 次ページが存在するか */
  hasNext: boolean
  /** 前ページが存在するか */
  hasPrev: boolean
  /** 現在のページ番号 */
  currentPage: number
  /** フェッチ中フラグ */
  isLoading: boolean
  /** エラーメッセージ（正常時は null） */
  error: string | null
  /** ページを変更する */
  setPage: (page: number) => void
}

/** 1ページあたりの表示件数 */
const LIMIT = 10

/**
 * 書籍のレビュー一覧を取得・管理するカスタムフック
 */
export function useBookReviews(bookId: number): UseBookReviewsResult {
  const [reviews, setReviews] = useState<Review[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPageState] = useState(1)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchBookReviews({ bookId, page, limit: LIMIT })
        if (!cancelled) {
          setReviews(data.reviews ?? [])
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
  }, [bookId, page])

  const setPage = (nextPage: number) => {
    setPageState(nextPage)
  }

  return {
    reviews,
    total,
    currentPage,
    hasNext,
    hasPrev,
    isLoading,
    error,
    setPage,
  }
}
