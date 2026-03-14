import { Hono } from 'hono'
import { describe, expect, it, vi } from 'vitest'
import { BadRequestError, errorHandler } from '../middleware/errorHandler.js'
import { users } from './users.js'

const mockRegisterUser = vi.hoisted(() => vi.fn())

vi.mock('../infrastructure/supabaseUserRepository.js', () => ({
  SupabaseUserRepository: vi.fn(),
}))

vi.mock('../services/userService.js', () => ({
  UserService: vi.fn().mockImplementation(function (
    this: { registerUser: typeof mockRegisterUser },
  ) {
    this.registerUser = mockRegisterUser
  }),
}))

const setupApp = () => {
  const app = new Hono()
  app.route('/api', users)
  app.onError(errorHandler)
  return app
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
