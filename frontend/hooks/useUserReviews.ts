import { useState, useEffect } from 'react'
import { fetchUserReviews, type UserReview } from '@/api/users'

/** useUserReviews フックの戻り値 */
export interface UseUserReviewsResult {
  /** 取得したレビュー一覧 */
  reviews: UserReview[]
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
 * ユーザーのレビュー一覧を取得・管理するカスタムフック
 * @param username - ユーザー名
 * @param queryParams - クエリパラメータ（page: ページ番号、limit: 1ページあたりの表示件数）
 */
export function useUserReviews(
  username: string,
  queryParams?: { page?: number; limit?: number },
): UseUserReviewsResult {
  const page = queryParams?.page ?? 1
  const limit = queryParams?.limit ?? LIMIT

  /** レビュー一覧 */
  const [reviews, setReviews] = useState<UserReview[]>([])
  /** 総件数 */
  const [total, setTotal] = useState(0)
  /** 次ページフラグ */
  const [hasNext, setHasNext] = useState(false)
  /** 前ページフラグ */
  const [hasPrev, setHasPrev] = useState(false)
  /** フェッチ中フラグ */
  const [isLoading, setIsLoading] = useState(true)
  /** エラーメッセージ */
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchUserReviews(username, { page, limit })
        if (!cancelled) {
          setReviews(data.reviews ?? [])
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
  }, [username, page, limit])

  return {
    reviews,
    total,
    hasNext,
    hasPrev,
    isLoading,
    error,
  }
}
