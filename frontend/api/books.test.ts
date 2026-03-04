import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// vi.hoisted は静的インポートの評価より前に実行されるため、
// import.meta.env.VITE_API_MOCK_URL を事前に設定できる
vi.hoisted(() => {
  import.meta.env.VITE_API_MOCK_URL = 'http://api.example.com'
})

import { fetchBooks } from '@/api/books'

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

const successResponse = {
  books: [{ id: 1, title: 'テスト書籍' }],
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

describe('fetchBooks', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue(makeFetchResponse(successResponse))
  })

  afterEach(() => {
    mockFetch.mockReset()
  })

  it('calls fetch once', async () => {
    await fetchBooks()
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('calls the correct endpoint path', async () => {
    await fetchBooks()
    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain('/api/books')
  })

  it('appends title query param when provided', async () => {
    await fetchBooks({ title: 'React入門' })
    const url = mockFetch.mock.calls[0][0] as string
    const params = new URL(url).searchParams
    expect(params.get('title')).toBe('React入門')
  })

  it('appends author query param when provided', async () => {
    await fetchBooks({ author: '山田太郎' })
    const url = mockFetch.mock.calls[0][0] as string
    const params = new URL(url).searchParams
    expect(params.get('author')).toBe('山田太郎')
  })

  it('appends publishedBy query param when provided', async () => {
    await fetchBooks({ publishedBy: 'テスト出版社' })
    const url = mockFetch.mock.calls[0][0] as string
    const params = new URL(url).searchParams
    expect(params.get('publishedBy')).toBe('テスト出版社')
  })

  it('appends page and limit query params when provided', async () => {
    await fetchBooks({ page: 3, limit: 20 })
    const url = mockFetch.mock.calls[0][0] as string
    const params = new URL(url).searchParams
    expect(params.get('page')).toBe('3')
    expect(params.get('limit')).toBe('20')
  })

  it('does not append params when they are undefined', async () => {
    await fetchBooks({ title: undefined, author: undefined })
    const url = mockFetch.mock.calls[0][0] as string
    const params = new URL(url).searchParams
    expect(params.get('title')).toBeNull()
    expect(params.get('author')).toBeNull()
  })

  it('returns the parsed JSON response', async () => {
    const result = await fetchBooks()
    expect(result).toEqual(successResponse)
  })

  it('throws an error when response status is not ok', async () => {
    mockFetch.mockResolvedValueOnce(makeFetchResponse({}, false, 500))
    await expect(fetchBooks()).rejects.toThrow(
      '書籍一覧の取得に失敗しました: 500',
    )
  })

  it('throws an error with the correct status code in the message', async () => {
    mockFetch.mockResolvedValueOnce(makeFetchResponse({}, false, 404))
    await expect(fetchBooks()).rejects.toThrow('404')
  })
})
