import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.hoisted(() => {
  import.meta.env.VITE_API_MOCK_URL = 'http://api.example.com'
})

import { fetchUserDetail, fetchUserReviews } from '@/api/users'

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

function makeFetchResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  }
}

const mockUser = {
  id: 1,
  username: 'testuser',
  biography: 'こんにちわ',
  role: 'free',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const mockReviewsResponse = {
  reviews: [{ id: 1, title: 'テストレビュー' }],
  total: 1,
  page: 1,
  limit: 10,
  next: false,
  prev: false,
}

describe('fetchUserDetail', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue(makeFetchResponse(mockUser))
  })

  afterEach(() => {
    mockFetch.mockReset()
  })

  it('calls fetch once', async () => {
    await fetchUserDetail('testuser')
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('calls the correct endpoint path', async () => {
    await fetchUserDetail('testuser')
    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain('/api/users/testuser')
  })

  it('returns the parsed JSON response', async () => {
    const result = await fetchUserDetail('testuser')
    expect(result).toEqual(mockUser)
  })

  it('throws an error when response status is not ok', async () => {
    mockFetch.mockResolvedValueOnce(makeFetchResponse({}, false, 404))
    await expect(fetchUserDetail('unknownuser')).rejects.toThrow(
      'ユーザー詳細の取得に失敗しました: 404',
    )
  })

  it('throws an error with the correct status code in the message', async () => {
    mockFetch.mockResolvedValueOnce(makeFetchResponse({}, false, 500))
    await expect(fetchUserDetail('testuser')).rejects.toThrow('500')
  })
})

describe('fetchUserReviews', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue(makeFetchResponse(mockReviewsResponse))
  })

  afterEach(() => {
    mockFetch.mockReset()
  })

  it('calls fetch once', async () => {
    await fetchUserReviews('testuser')
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })

  it('calls the correct endpoint path', async () => {
    await fetchUserReviews('testuser')
    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain('/api/users/testuser/reviews')
  })

  it('appends page query param when provided', async () => {
    await fetchUserReviews('testuser', { page: 2 })
    const url = mockFetch.mock.calls[0][0] as string
    const params = new URL(url).searchParams
    expect(params.get('page')).toBe('2')
  })

  it('appends limit query param when provided', async () => {
    await fetchUserReviews('testuser', { limit: 5 })
    const url = mockFetch.mock.calls[0][0] as string
    const params = new URL(url).searchParams
    expect(params.get('limit')).toBe('5')
  })

  it('does not append params when they are undefined', async () => {
    await fetchUserReviews('testuser')
    const url = mockFetch.mock.calls[0][0] as string
    const params = new URL(url).searchParams
    expect(params.get('page')).toBeNull()
    expect(params.get('limit')).toBeNull()
  })

  it('returns the parsed JSON response', async () => {
    const result = await fetchUserReviews('testuser')
    expect(result).toEqual(mockReviewsResponse)
  })

  it('throws an error when response status is not ok', async () => {
    mockFetch.mockResolvedValueOnce(makeFetchResponse({}, false, 404))
    await expect(fetchUserReviews('unknownuser')).rejects.toThrow(
      'ユーザーのレビュー一覧の取得に失敗しました: 404',
    )
  })
})
