import { describe, expect, it, vi } from 'vitest'
import { BadRequestError } from '../middleware/errorHandler.js'
import type { UserRepository } from '../repositories/userRepository.js'
import { UserService } from './userService.js'

const mockUserRepository: UserRepository = {
  create: vi.fn().mockResolvedValue(undefined),
}

const userService = new UserService(mockUserRepository)

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
})
