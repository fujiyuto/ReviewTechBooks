/** ユーザー詳細の型 */
export interface UserDetail {
  id: number
  username: string
  biography: string | null
  role: 'free' | 'premium'
  createdAt: string
  updatedAt: string
}

/** ユーザーのレビュー型 */
export interface UserReview {
  id: number
  book: {
    id: number
    title: string
    thumbnailUrl: string | null
  }
  title: string
  content: string
  categories: Array<{
    id: number
    name: string
    order: number
  }>
  createdAt: string
  updatedAt: string
}

export interface UserRepository {
  create(data: {
    authId: string
    username: string
    lastName?: string
    firstName?: string
  }): Promise<void>
  findByUsername(username: string): Promise<UserDetail | null>
  findReviewsByUsername(
    username: string,
    page: number,
    limit: number,
  ): Promise<{ reviews: UserReview[]; total: number }>
}
