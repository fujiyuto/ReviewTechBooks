import { BadRequestError, NotFoundError } from '../middleware/errorHandler.js'
import type {
  UserRepository,
  UserDetail,
  UserReview,
} from '../repositories/userRepository.js'
import { userRegistrationSchema } from '../schemas/userSchema.js'

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(data: unknown): Promise<void> {
    const result = userRegistrationSchema.safeParse(data)
    if (!result.success) {
      throw new BadRequestError(
        result.error.issues[0]?.message ?? 'Invalid input',
      )
    }

    await this.userRepository.create(result.data)
  }

  async getUserByUsername(username: string): Promise<UserDetail> {
    const user = await this.userRepository.findByUsername(username)
    if (!user) {
      throw new NotFoundError('ユーザーが見つかりません')
    }
    return user
  }

  async getUserReviews(
    username: string,
    page: number,
    limit: number,
  ): Promise<{
    reviews: UserReview[]
    total: number
    page: number
    limit: number
    next: boolean
    prev: boolean
  }> {
    const user = await this.userRepository.findByUsername(username)
    if (!user) {
      throw new NotFoundError('ユーザーが見つかりません')
    }

    const { reviews, total } = await this.userRepository.findReviewsByUsername(
      username,
      page,
      limit,
    )

    return {
      reviews,
      total,
      page,
      limit,
      next: page * limit < total,
      prev: page > 1,
    }
  }
}
