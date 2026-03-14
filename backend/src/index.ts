import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { errorHandler } from './middleware/errorHandler.js'
import { users } from './routes/users.js'

const app = new Hono()

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
