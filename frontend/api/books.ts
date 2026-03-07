import type { paths, components } from '@/types/api'

/** 書籍サマリーの型 */
export type BookSummary = components['schemas']['BookSummary']

/** 書籍詳細の型 */
export type BookDetail = components['schemas']['BookDetail']

/** レビューの型 */
export type Review = components['schemas']['Review']

/** 書籍一覧APIのクエリパラメータ型 */
type BooksQuery = NonNullable<paths['/api/books']['get']['parameters']['query']>

/** 書籍詳細APIのレスポンス型 */
type BookDetailResponse =
  paths['/api/books/{bookId}']['get']['responses'][200]['content']['application/json']

/** 書籍一覧APIのレスポンス型 */
type BooksResponse =
  paths['/api/books']['get']['responses'][200]['content']['application/json']

/** APIのベースURL */
const API_BASE_URL = import.meta.env.VITE_API_MOCK_URL
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

/**
 * 書籍一覧を取得する
 * @param params - 検索クエリパラメータ（タイトル・著者・出版社・ページ・件数）
 * @returns 書籍一覧レスポンス
 * @throws 取得に失敗した場合にエラーをスロー
 */
export async function fetchBooks(params?: BooksQuery): Promise<BooksResponse> {
  const url = new URL('api/books', API_BASE_URL)
  if (params?.title) url.searchParams.set('title', params.title)
  if (params?.author) url.searchParams.set('author', params.author)
  if (params?.publishedBy)
    url.searchParams.set('publishedBy', params.publishedBy)
  if (params?.page != null) url.searchParams.set('page', String(params.page))
  if (params?.limit != null) url.searchParams.set('limit', String(params.limit))

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`書籍一覧の取得に失敗しました: ${res.status}`)
  }
  return res.json() as Promise<BooksResponse>
}

/**
 * 書籍詳細を取得する
 * @param bookId - 書籍ID
 * @returns 書籍詳細レスポンス
 * @throws 取得に失敗した場合にエラーをスロー
 */
export async function fetchBookDetail(
  bookId: number,
): Promise<BookDetailResponse> {
  const url = new URL(`api/books/${bookId}`, API_BASE_URL)
  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`書籍詳細の取得に失敗しました: ${res.status}`)
  }
  return res.json() as Promise<BookDetailResponse>
}
