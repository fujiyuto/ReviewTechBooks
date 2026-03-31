import { describe, expect, it, vi } from 'vitest'
import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js'
import type { UserRepository } from '../repositories/userRepository.js'
import { UserService } from './userService.js'

const mockUserRepository: UserRepository = {
  create: vi.fn().mockResolvedValue(undefined),
  findByUsername: vi.fn(),
  findReviewsByUsername: vi.fn(),
}

const userService = new UserService(mockUserRepository)

const mockUser = {
  id: 1,
  username: 'testuser',
  biography: 'こんにちわ',
  role: 'free' as const,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockReviews = [
  {
    id: 1,
    book: { id: 1, title: 'テスト書籍', thumbnailUrl: null },
    title: 'テストレビュー',
    content: 'テスト本文',
    categories: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

describe('UserService', () => {
  describe('registerUser', () => {
    it('calls repository and completes without error for valid input', async () => {
      await expect(
        userService.registerUser({
          authId: '550e8400-e29b-41d4-a716-446655440000',
          username: 'testuser',
          biography: 'こんにちわ',
        }),
      ).resolves.toBeUndefined()

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        authId: '550e8400-e29b-41d4-a716-446655440000',
        username: 'testuser',
        biography: 'こんにちわ',
      })
    })

    it('throws BadRequestError when authId is not a valid UUID', async () => {
      await expect(
        userService.registerUser({
          authId: 'not-a-uuid',
          username: 'testuser',
        }),
      ).rejects.toBeInstanceOf(BadRequestError)
    })

    it('throws BadRequestError when username is empty', async () => {
      await expect(
        userService.registerUser({
          authId: '550e8400-e29b-41d4-a716-446655440000',
          username: '',
        }),
      ).rejects.toBeInstanceOf(BadRequestError)
    })

    it('throws BadRequestError when username exceeds 20 characters', async () => {
      await expect(
        userService.registerUser({
          authId: '550e8400-e29b-41d4-a716-446655440000',
          username: 'a'.repeat(21),
        }),
      ).rejects.toBeInstanceOf(BadRequestError)
    })
  })

  describe('getUserByUsername', () => {
    it('returns user when user exists', async () => {
      vi.mocked(mockUserRepository.findByUsername).mockResolvedValueOnce(
        mockUser,
      )
      const result = await userService.getUserByUsername('testuser')
      expect(result).toEqual(mockUser)
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith('testuser')
    })

    it('throws NotFoundError when user does not exist', async () => {
      vi.mocked(mockUserRepository.findByUsername).mockResolvedValueOnce(null)
      await expect(
        userService.getUserByUsername('unknownuser'),
      ).rejects.toBeInstanceOf(NotFoundError)
    })
  })

  describe('getUserReviews', () => {
    it('returns reviews when user exists', async () => {
      vi.mocked(mockUserRepository.findByUsername).mockResolvedValueOnce(
        mockUser,
      )
      vi.mocked(mockUserRepository.findReviewsByUsername).mockResolvedValueOnce(
        {
          reviews: mockReviews,
          total: 1,
        },
      )

      const result = await userService.getUserReviews('testuser', 1, 10)

      expect(result.reviews).toEqual(mockReviews)
      expect(result.total).toBe(1)
      expect(result.page).toBe(1)
      expect(result.limit).toBe(10)
      expect(result.next).toBe(false)
      expect(result.prev).toBe(false)
      expect(mockUserRepository.findReviewsByUsername).toHaveBeenCalledWith(
        'testuser',
        1,
        10,
      )
    })

    it('calculates next correctly when more pages exist', async () => {
      vi.mocked(mockUserRepository.findByUsername).mockResolvedValueOnce(
        mockUser,
      )
      vi.mocked(mockUserRepository.findReviewsByUsername).mockResolvedValueOnce(
        {
          reviews: mockReviews,
          total: 15,
        },
      )

      const result = await userService.getUserReviews('testuser', 1, 10)
      expect(result.next).toBe(true)
      expect(result.prev).toBe(false)
    })

    it('calculates prev correctly when on page 2', async () => {
      vi.mocked(mockUserRepository.findByUsername).mockResolvedValueOnce(
        mockUser,
      )
      vi.mocked(mockUserRepository.findReviewsByUsername).mockResolvedValueOnce(
        {
          reviews: mockReviews,
          total: 15,
        },
      )

      const result = await userService.getUserReviews('testuser', 2, 10)
      expect(result.next).toBe(false)
      expect(result.prev).toBe(true)
    })

    it('throws NotFoundError when user does not exist', async () => {
      vi.mocked(mockUserRepository.findByUsername).mockResolvedValueOnce(null)
      await expect(
        userService.getUserReviews('unknownuser', 1, 10),
      ).rejects.toBeInstanceOf(NotFoundError)
    })
  })
})
