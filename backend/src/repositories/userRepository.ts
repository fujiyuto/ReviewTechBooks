export interface UserRepository {
  create(data: {
    authId: string
    username: string
    lastName?: string
    firstName?: string
  }): Promise<void>
}
