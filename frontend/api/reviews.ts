import type { paths, components } from '@/types/api'

/** レビューの型 */
export type Review = components['schemas']['Review']

/** 書籍レビュー一覧APIのレスポンス型 */
type BookReviewsResponse =
  paths['/api/books/{bookId}/reviews']['get']['responses'][200]['content']['application/json']

/** 書籍レビュー一覧APIのクエリパラメータ型 */
type BookReviewsQuery = NonNullable<
  paths['/api/books/{bookId}/reviews']['get']['parameters']['query']
>

/** 書籍レビュー一覧APIのパスパラメータ型 */
type BookReviewsPath = NonNullable<
  paths['/api/books/{bookId}/reviews']['get']['parameters']['path']
>

/** APIのベースURL */
const API_BASE_URL = import.meta.env.VITE_API_MOCK_URL
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

/**
 * 書籍のレビュー一覧を取得する
 * @param bookId - 書籍ID
 * @param params - クエリパラメータ（ページ・件数）
 * @returns 書籍レビュー一覧レスポンス
 * @throws 取得に失敗した場合にエラーをスロー
 */
export async function fetchBookReviews(
  params: BookReviewsQuery & BookReviewsPath,
) {
  const url = new URL(`api/books/${params.bookId}/reviews`, API_BASE_URL)

  if (params.category_id)
    url.searchParams.set('category_id', String(params.category_id))
  if (params.page) url.searchParams.set('page', String(params.page))
  if (params.limit) url.searchParams.set('limit', String(params.limit))

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`書籍のレビュー一覧の取得に失敗しました: ${res.status}`)
  }

  return res.json() as Promise<BookReviewsResponse>
}
