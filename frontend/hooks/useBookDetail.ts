import { useState, useEffect } from 'react'
import { fetchBookDetail, type BookDetail } from '@/api/books'

/** useBookDetail フックの戻り値 */
export interface UseBookDetailResult {
  /** 取得した書籍詳細 */
  book: BookDetail | null
  /** フェッチ中フラグ */
  isLoading: boolean
  /** エラーメッセージ（正常時は null） */
  error: string | null
}

/**
 * 書籍詳細を取得・管理するカスタムフック
 */
export function useBookDetail(bookId: number): UseBookDetailResult {
  /** 書籍詳細 */
  const [book, setBook] = useState<BookDetail | null>(null)
  /** フェッチ中フラグ */
  const [isLoading, setIsLoading] = useState(true)
  /** エラーメッセージ */
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    /* 書籍詳細をフェッチする */
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchBookDetail(bookId)
        if (!cancelled) {
          setBook(data)
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
  }, [bookId])

  return { book, isLoading, error }
}
