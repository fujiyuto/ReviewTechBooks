import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// vi.hoisted は静的インポートの評価より前に実行されるため、
// import.meta.env.VITE_API_MOCK_URL を事前に設定できる
vi.hoisted(() => {
  import.meta.env.VITE_API_MOCK_URL = 'http://api.example.com'
})

import { fetchBookReviews } from '@/api/reviews'

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

const successResponse = {
  reviews: [
    {
      id: 1,
      bookId: 42,
      rating: 5,
      comment: '非常に良い書籍です',
    },
  ],
  total: 1,
  currentPage: 1,
  next: false,
  prev: false,
}

function makeFetchResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  }
}

describe('fetchBookReviews', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue(makeFetchResponse(successResponse))
  })

  afterEach(() => {
    mockFetch.mockReset()
  })

  it('calls fetch once', async () => {
    await fetchBookReviews({ bookId: 42 })
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('calls the correct endpoint path including bookId', async () => {
    await fetchBookReviews({ bookId: 42 })
    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain('/api/books/42/reviews')
  })

  it('appends category_id query param when provided', async () => {
    await fetchBookReviews({ bookId: 42, category_id: 3 })
    const url = mockFetch.mock.calls[0][0] as string
    const params = new URL(url).searchParams
    expect(params.get('category_id')).toBe('3')
  })

  it('appends page query param when provided', async () => {
    await fetchBookReviews({ bookId: 42, page: 2 })
    const url = mockFetch.mock.calls[0][0] as string
    const params = new URL(url).searchParams
    expect(params.get('page')).toBe('2')
  })

  it('appends limit query param when provided', async () => {
    await fetchBookReviews({ bookId: 42, limit: 20 })
    const url = mockFetch.mock.calls[0][0] as string
    const params = new URL(url).searchParams
    expect(params.get('limit')).toBe('20')
  })

  it('appends page and limit together when both provided', async () => {
    await fetchBookReviews({ bookId: 42, page: 3, limit: 10 })
    const url = mockFetch.mock.calls[0][0] as string
    const params = new URL(url).searchParams
    expect(params.get('page')).toBe('3')
    expect(params.get('limit')).toBe('10')
  })

  it('does not append optional params when they are undefined', async () => {
    await fetchBookReviews({ bookId: 42 })
    const url = mockFetch.mock.calls[0][0] as string
    const params = new URL(url).searchParams
    expect(params.get('category_id')).toBeNull()
    expect(params.get('page')).toBeNull()
    expect(params.get('limit')).toBeNull()
  })

  it('returns the parsed JSON response', async () => {
    const result = await fetchBookReviews({ bookId: 42 })
    expect(result).toEqual(successResponse)
  })

  it('throws an error when response status is not ok', async () => {
    mockFetch.mockResolvedValueOnce(makeFetchResponse({}, false, 500))
    await expect(fetchBookReviews({ bookId: 42 })).rejects.toThrow(
      '書籍のレビュー一覧の取得に失敗しました: 500',
    )
  })

  it('throws an error with the correct status code in the message', async () => {
    mockFetch.mockResolvedValueOnce(makeFetchResponse({}, false, 404))
    await expect(fetchBookReviews({ bookId: 42 })).rejects.toThrow('404')
  })
})
