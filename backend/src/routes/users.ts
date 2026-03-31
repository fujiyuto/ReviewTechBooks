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

users.get('/:username', async (c) => {
  const username = c.req.param('username')
  const user = await userService.getUserByUsername(username)
  return c.json(user)
})

users.get('/:username/reviews', async (c) => {
  const username = c.req.param('username')
  const page = Number(c.req.query('page') ?? '1')
  const limit = Number(c.req.query('limit') ?? '10')
  const result = await userService.getUserReviews(username, page, limit)
  return c.json(result)
})

export { users }
