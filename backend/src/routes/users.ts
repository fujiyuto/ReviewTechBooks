import { Hono } from 'hono'
import { SupabaseUserRepository } from '../infrastructure/supabaseUserRepository.js'
import { UserService } from '../services/userService.js'

const userRepository = new SupabaseUserRepository()
const userService = new UserService(userRepository)

const users = new Hono().basePath('/users')

users.post('/', async (c) => {
  const body = await c.req.json()
  await userService.registerUser(body)
  return c.body(null, 201)
})

export { users }
