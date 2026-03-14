import { BadRequestError } from '../middleware/errorHandler.js'
import type { UserRepository } from '../repositories/userRepository.js'
import { userRegistrationSchema } from '../schemas/userSchema.js'

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(data: unknown): Promise<void> {
    const result = userRegistrationSchema.safeParse(data)
    if (!result.success) {
      throw new BadRequestError(result.error.issues[0]?.message ?? 'Invalid input')
    }

    await this.userRepository.create(result.data)
  }
}
