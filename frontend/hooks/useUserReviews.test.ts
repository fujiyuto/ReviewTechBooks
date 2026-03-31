import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useUserReviews } from './useUserReviews'

vi.mock('@/api/users', () => ({
  fetchUserReviews: vi.fn(),
}))

import { fetchUserReviews } from '@/api/users'

const mockFetchUserReviews = vi.mocked(fetchUserReviews)

const baseResponse1 = {
  reviews: [
    {
      id: 1,
      book: {
        id: 1,
        title: 'データ指向アプリケーションデザイン',
        thumbnailUrl: undefined,
      },
      title: 'DDIAはバックエンドエンジニア必読の一冊',
      content:
        '分散システムの設計原則が体系的にまとめられており、実務でも非常に役立つ内容でした。',
      categories: [{ id: 1, name: 'バックエンド', order: 1 }],
      createdAt: '2026-01-01T10:00:00.000Z',
      updatedAt: '2026-01-02T00:00:00.000Z',
    },
  ],
  total: 4,
  page: 1,
  limit: 10,
  next: true,
  prev: false,
}

const baseResponse2 = {
  reviews: [
    {
      id: 3,
      book: { id: 2, title: 'クリーンアーキテクチャ', thumbnailUrl: undefined },
      title: 'クリーンアーキテクチャを読んで設計の考え方が変わった',
      content: '依存関係の方向性を意識することの重要性を改めて認識しました。',
      categories: [{ id: 2, name: 'アーキテクチャ', order: 1 }],
      createdAt: '2026-01-05T10:00:00.000Z',
      updatedAt: '2026-01-06T00:00:00.000Z',
    },
  ],
  total: 4,
  page: 2,
  limit: 10,
  next: false,
  prev: true,
}

describe('useUserReviewsテスト', () => {
  beforeEach(() => {
    mockFetchUserReviews.mockResolvedValue(baseResponse1)
  })

  it('初期状態', () => {
    const { result } = renderHook(() => useUserReviews('testuser'))

    expect(result.current.reviews).toEqual([])
    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('データ取得成功時', async () => {
    const { result } = renderHook(() => useUserReviews('testuser'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.reviews).toEqual(baseResponse1.reviews)
    expect(result.current.total).toBe(4)
    expect(result.current.hasNext).toBe(true)
    expect(result.current.hasPrev).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('データ取得失敗時（エラー発生時）', async () => {
    mockFetchUserReviews.mockRejectedValueOnce(
      new Error('予期せぬエラーが発生しました'),
    )

    const { result } = renderHook(() => useUserReviews('testuser'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.reviews).toEqual([])
    expect(result.current.error).toBe('予期せぬエラーが発生しました')
  })

  it('pageを渡したとき指定のページでAPIが呼ばれる', async () => {
    const { result } = renderHook(() => useUserReviews('testuser', { page: 2 }))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(mockFetchUserReviews).toHaveBeenCalledWith('testuser', {
      page: 2,
      limit: 10,
    })
  })

  it('limitを渡したとき指定のlimitでAPIが呼ばれる', async () => {
    const { result } = renderHook(() =>
      useUserReviews('testuser', { limit: 5 }),
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(mockFetchUserReviews).toHaveBeenCalledWith('testuser', {
      page: 1,
      limit: 5,
    })
  })

  it('pageが変わるとき再フェッチされる', async () => {
    mockFetchUserReviews
      .mockResolvedValueOnce(baseResponse1)
      .mockResolvedValueOnce(baseResponse2)

    const { result, rerender } = renderHook(
      ({ page }: { page: number }) => useUserReviews('testuser', { page }),
      { initialProps: { page: 1 } },
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.reviews).toEqual(baseResponse1.reviews)

    rerender({ page: 2 })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.reviews).toEqual(baseResponse2.reviews)
    expect(result.current.hasNext).toBe(false)
    expect(result.current.hasPrev).toBe(true)
  })

  it('usernameが変わるとき再フェッチされる', async () => {
    const anotherUserResponse = {
      ...baseResponse1,
      reviews: baseResponse2.reviews,
    }
    mockFetchUserReviews
      .mockResolvedValueOnce(baseResponse1)
      .mockResolvedValueOnce(anotherUserResponse)

    const { result, rerender } = renderHook(
      ({ username }: { username: string }) => useUserReviews(username),
      { initialProps: { username: 'testuser' } },
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    rerender({ username: 'anotheruser' })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.reviews).toEqual(anotherUserResponse.reviews)
  })
})
