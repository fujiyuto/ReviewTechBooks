import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { errorHandler } from './middleware/errorHandler.js'
import { users } from './routes/users.js'
import 'dotenv/config'

const app = new Hono()

app.use(
  '/api/*',
  cors({
    origin: process.env.APP_FRONTEND_BASE_URL ?? 'http://localhost:5173',
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.route('/api', users)
app.onError(errorHandler)

serve(
  {
    fetch: app.fetch,
    port: 8000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
