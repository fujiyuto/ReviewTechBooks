import type { Context } from 'hono'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(400, 'BAD_REQUEST', message)
    this.name = 'BadRequestError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, 'NOT_FOUND', message)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(401, 'UNAUTHORIZED', message)
    this.name = 'UnauthorizedError'
  }
}

export const errorHandler = (err: Error, c: Context) => {
  console.log(err.message)

  if (err instanceof AppError) {
    return c.json(
      { error: { code: err.code, message: err.message } },
      err.statusCode as 400 | 401 | 403 | 404 | 500,
    )
  }
  return c.json(
    {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: '予期しないエラーが発生しました',
      },
    },
    500,
  )
}
