import type { paths, components } from '@/types/api'

/** ユーザーの型 */
export type User = components['schemas']['User']

/** ユーザーレビューの型 */
export type UserReview = components['schemas']['UserReview']

/** ユーザー詳細APIのレスポンス型 */
type UserDetailResponse =
  paths['/api/users/{username}']['get']['responses'][200]['content']['application/json']

/** ユーザーレビュー一覧APIのレスポンス型 */
type UserReviewsResponse =
  paths['/api/users/{username}/reviews']['get']['responses'][200]['content']['application/json']

/** ユーザーレビュー一覧APIのクエリパラメータ型 */
type UserReviewsQuery = NonNullable<
  paths['/api/users/{username}/reviews']['get']['parameters']['query']
>

/** APIのベースURL */
const API_BASE_URL = import.meta.env.VITE_API_MOCK_URL
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

/**
 * ユーザー詳細を取得する
 * @param username - ユーザー名
 * @returns ユーザー詳細レスポンス
 * @throws 取得に失敗した場合にエラーをスロー
 */
export async function fetchUserDetail(
  username: string,
): Promise<UserDetailResponse> {
  const url = new URL(`api/users/${username}`, API_BASE_URL)
  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`ユーザー詳細の取得に失敗しました: ${res.status}`)
  }
  return res.json() as Promise<UserDetailResponse>
}

/**
 * ユーザーのレビュー一覧を取得する
 * @param username - ユーザー名
 * @param params - クエリパラメータ（ページ・件数）
 * @returns ユーザーレビュー一覧レスポンス
 * @throws 取得に失敗した場合にエラーをスロー
 */
export async function fetchUserReviews(
  username: string,
  params?: UserReviewsQuery,
): Promise<UserReviewsResponse> {
  const url = new URL(`api/users/${username}/reviews`, API_BASE_URL)
  if (params?.page != null) url.searchParams.set('page', String(params.page))
  if (params?.limit != null) url.searchParams.set('limit', String(params.limit))

  const res = await fetch(url.toString())
  if (!res.ok) {
    throw new Error(`ユーザーのレビュー一覧の取得に失敗しました: ${res.status}`)
  }
  return res.json() as Promise<UserReviewsResponse>
}
