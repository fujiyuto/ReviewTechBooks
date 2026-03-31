import { Hono } from 'hono'
import { describe, expect, it, vi } from 'vitest'
import {
  BadRequestError,
  NotFoundError,
  errorHandler,
} from '../middleware/errorHandler.js'
import { users } from './users.js'

const mockRegisterUser = vi.hoisted(() => vi.fn())
const mockGetUserByUsername = vi.hoisted(() => vi.fn())
const mockGetUserReviews = vi.hoisted(() => vi.fn())

vi.mock('../infrastructure/supabaseUserRepository.js', () => ({
  SupabaseUserRepository: vi.fn(),
}))

vi.mock('../services/userService.js', () => ({
  UserService: vi.fn().mockImplementation(function (this: {
    registerUser: typeof mockRegisterUser
    getUserByUsername: typeof mockGetUserByUsername
    getUserReviews: typeof mockGetUserReviews
  }) {
    this.registerUser = mockRegisterUser
    this.getUserByUsername = mockGetUserByUsername
    this.getUserReviews = mockGetUserReviews
  }),
}))

const setupApp = () => {
  const app = new Hono()
  app.route('/api', users)
  app.onError(errorHandler)
  return app
}

const mockUser = {
  id: 1,
  username: 'testuser',
  biography: 'こんにちわ',
  role: 'free',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockReviewsResponse = {
  reviews: [
    {
      id: 1,
      book: { id: 1, title: 'テスト書籍', thumbnailUrl: null },
      title: 'テストレビュー',
      content: 'テスト本文',
      categories: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ],
  total: 1,
  page: 1,
  limit: 10,
  next: false,
  prev: false,
}

describe('POST /api/users', () => {
  describe('正常系', () => {
    it('authIdとusernameのみを含む有効なボディで201を返す', async () => {
      mockRegisterUser.mockResolvedValue(undefined)
      const app = setupApp()

      const res = await app.request('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authId: '550e8400-e29b-41d4-a716-446655440000',
          username: 'testuser',
        }),
      })

      expect(res.status).toBe(201)
    })

    it('オプションフィールド（lastName, firstName）を含むボディで201を返す', async () => {
      mockRegisterUser.mockResolvedValue(undefined)
      const app = setupApp()

      const res = await app.request('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authId: '550e8400-e29b-41d4-a716-446655440000',
          username: 'testuser',
          lastName: '山田',
          firstName: '太郎',
        }),
      })

      expect(res.status).toBe(201)
    })
  })

  describe('異常系', () => {
    it('serviceがBadRequestErrorをthrowしたとき400とエラー形式を返す', async () => {
      mockRegisterUser.mockRejectedValue(new BadRequestError('Invalid input'))
      const app = setupApp()

      const res = await app.request('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authId: 'bad', username: '' }),
      })

      expect(res.status).toBe(400)
      const json = await res.json()
      expect(json).toEqual({
        error: { code: 'BAD_REQUEST', message: 'Invalid input' },
      })
    })

    it('serviceが予期しないエラーをthrowしたとき500を返す', async () => {
      mockRegisterUser.mockRejectedValue(new Error('Unexpected error'))
      const app = setupApp()

      const res = await app.request('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authId: '550e8400-e29b-41d4-a716-446655440000',
          username: 'testuser',
        }),
      })

      expect(res.status).toBe(500)
      const json = await res.json()
      expect(json).toEqual({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: '予期しないエラーが発生しました',
        },
      })
    })
  })
})

describe('GET /api/users/:username', () => {
  describe('正常系', () => {
    it('存在するusernameで200とユーザー情報を返す', async () => {
      mockGetUserByUsername.mockResolvedValue(mockUser)
      const app = setupApp()

      const res = await app.request('/api/users/testuser')

      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json).toEqual(mockUser)
    })
  })

  describe('異常系', () => {
    it('serviceがNotFoundErrorをthrowしたとき404とエラー形式を返す', async () => {
      mockGetUserByUsername.mockRejectedValue(
        new NotFoundError('ユーザーが見つかりません'),
      )
      const app = setupApp()

      const res = await app.request('/api/users/unknownuser')

      expect(res.status).toBe(404)
      const json = await res.json()
      expect(json).toEqual({
        error: { code: 'NOT_FOUND', message: 'ユーザーが見つかりません' },
      })
    })
  })
})

describe('GET /api/users/:username/reviews', () => {
  describe('正常系', () => {
    it('存在するusernameで200とレビュー一覧を返す', async () => {
      mockGetUserReviews.mockResolvedValue(mockReviewsResponse)
      const app = setupApp()

      const res = await app.request('/api/users/testuser/reviews')

      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json).toEqual(mockReviewsResponse)
    })

    it('page・limitクエリパラメータをサービスに渡す', async () => {
      mockGetUserReviews.mockResolvedValue(mockReviewsResponse)
      const app = setupApp()

      await app.request('/api/users/testuser/reviews?page=2&limit=5')

      expect(mockGetUserReviews).toHaveBeenCalledWith('testuser', 2, 5)
    })
  })

  describe('異常系', () => {
    it('serviceがNotFoundErrorをthrowしたとき404とエラー形式を返す', async () => {
      mockGetUserReviews.mockRejectedValue(
        new NotFoundError('ユーザーが見つかりません'),
      )
      const app = setupApp()

      const res = await app.request('/api/users/unknownuser/reviews')

      expect(res.status).toBe(404)
      const json = await res.json()
      expect(json).toEqual({
        error: { code: 'NOT_FOUND', message: 'ユーザーが見つかりません' },
      })
    })
  })
})
