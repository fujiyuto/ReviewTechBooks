import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBookReviews } from './useBookReviews'

vi.mock('@/api/reviews', () => ({
  fetchBookReviews: vi.fn(),
}))

import { fetchBookReviews } from '@/api/reviews'

const mockFetchBookReviews = vi.mocked(fetchBookReviews)

const baseResponse1 = {
  reviews: [
    {
      id: 1,
      user: { id: 1, username: 'yuto' },
      title: 'DDIAはバックエンドエンジニア必読の一冊',
      content:
        '分散システムの設計原則が体系的にまとめられており、実務でも非常に役立つ内容でした。',
      categories: [
        { id: 1, name: 'バックエンド', order: 1 },
        { id: 2, name: '分散システム', order: 2 },
      ],
      createdAt: '2026-01-01T10:00:00.000Z',
      updatedAt: '2026-01-02',
    },
    {
      id: 2,
      user: { id: 2, username: 'taro' },
      title: 'クリーンアーキテクチャを読んで設計の考え方が変わった',
      content: '依存関係の方向性を意識することの重要性を改めて認識しました。',
      categories: [
        { id: 1, name: 'バックエンド', order: 1 },
        { id: 3, name: 'アーキテクチャ', order: 2 },
      ],
      createdAt: '2026-01-03T10:00:00.000Z',
      updatedAt: '2026-01-04',
    },
  ],
  total: 4,
  currentPage: 1,
  limit: 2,
  next: true,
  prev: false,
}

const baseResponse2 = {
  reviews: [
    {
      id: 3,
      user: { id: 3, username: 'hanako' },
      title: 'リーダブルコードは新人エンジニアにも読んでほしい',
      content:
        'コードの読みやすさについて具体的なテクニックが豊富で、すぐに実践できる内容でした。',
      categories: [{ id: 4, name: 'プログラミング', order: 1 }],
      createdAt: '2026-01-05T10:00:00.000Z',
      updatedAt: '2026-01-06',
    },
    {
      id: 4,
      user: { id: 4, username: 'kenji' },
      title: 'プログラマのためのSQL入門は実践的でよかった',
      content:
        'SQLの基礎から応用まで丁寧に解説されており、業務で使えるクエリが身につきました。',
      categories: [{ id: 5, name: 'データベース', order: 1 }],
      createdAt: '2026-01-07T10:00:00.000Z',
      updatedAt: '2026-01-08',
    },
  ],
  total: 4,
  currentPage: 2,
  limit: 2,
  next: false,
  prev: true,
}

describe('useBookReviewsテスト', () => {
  // テスト前にfetch関数をモック
  beforeEach(() => {
    mockFetchBookReviews.mockResolvedValue(baseResponse1)
  })

  /**
   * 初期状態のテスト
   * 期待値
   * - reviews = null
   * - isLoading = true
   * - error = null
   */
  it('初期状態', () => {
    // カスタムフックレンダリング
    const { result } = renderHook(() => useBookReviews(1))

    // 初期状態の検証
    expect(result.current.reviews).toEqual([])
    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBeNull()
  })

  /**
   * データ取得成功時のテスト
   * 期待値
   * - review = 取得したレビュー一覧データ
   * - total = 2
   * - currentPage = 1
   * - hasNext = true
   * - hasPrev = false
   * - isLoading = false
   * - error = null
   */
  it('データ取得成功時', async () => {
    const { result } = renderHook(() => useBookReviews(1))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.reviews).toEqual(baseResponse1.reviews)
    expect(result.current.total).toBe(4)
    expect(result.current.currentPage).toBe(1)
    expect(result.current.hasNext).toBe(true)
    expect(result.current.hasPrev).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  /**
   * データ取得失敗時のテスト（エラー発生時）
   * 期待値
   * - review = null
   * - isLoading = false
   * - error = エラーメッセージ
   */
  it('データ取得失敗時（エラー発生時）', async () => {
    mockFetchBookReviews.mockRejectedValueOnce(
      new Error('予期せぬエラーが発生しました'),
    )

    // カスタムフックをレンダリング
    const { result } = renderHook(() => useBookReviews(1))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.reviews).toEqual([])
    expect(result.current.error).toBe('予期せぬエラーが発生しました')
  })

  /**
   * 引数変更時のテスト
   * 期待値
   * - useBookReviewsの引数(bookId)変更時、再度データが取得されること
   */
  it('引数変更時', async () => {
    // bookIdが1,2の時のレスポンスデータを設定
    const bookId2Response = {
      ...baseResponse2,
      currentPage: 1,
      next: true,
      prev: false,
    }
    mockFetchBookReviews
      .mockResolvedValueOnce(baseResponse1)
      .mockResolvedValueOnce(bookId2Response)

    const { result, rerender } = renderHook(
      ({ bookId }: { bookId: number }) => useBookReviews(bookId),
      { initialProps: { bookId: 1 } },
    )

    // 初回データの取得まで待機
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // bookIdを2にして再レンダリング
    rerender({ bookId: 2 })

    // 2回目のデータ取得まで待機
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.reviews).toEqual(bookId2Response.reviews)
    expect(result.current.total).toBe(4)
    expect(result.current.currentPage).toBe(1)
    expect(result.current.hasNext).toBe(true)
    expect(result.current.hasPrev).toBe(false)
  })
})

/**
 * ページ更新時のテスト
 * 期待値
 * - ページ更新時に2ページ目のデータが取得されること
 */
it('ページ更新時', async () => {
  // レスポンスデータ設定
  mockFetchBookReviews
    .mockResolvedValueOnce(baseResponse1)
    .mockResolvedValueOnce(baseResponse2)

  // カスタムフックをレンダリング
  const { result } = renderHook(() => useBookReviews(1))

  // 1ページ目のデータ取得まで待機
  await waitFor(() => expect(result.current.isLoading).toBe(false))

  // 1ページ目の検証
  expect(result.current.reviews).toEqual(baseResponse1.reviews)
  expect(result.current.total).toBe(4)
  expect(result.current.currentPage).toBe(1)
  expect(result.current.hasNext).toBe(true)
  expect(result.current.hasPrev).toBe(false)

  // 1ページ → 2ページ目に更新
  result.current.setPage(result.current.currentPage + 1)

  // 2ページ目のデータ取得まで待機
  await waitFor(() => expect(result.current.isLoading).toBe(false))

  // 2ページ目の検証
  expect(result.current.reviews).toEqual(baseResponse2.reviews)
  expect(result.current.total).toBe(4)
  expect(result.current.currentPage).toBe(2)
  expect(result.current.hasNext).toBe(false)
  expect(result.current.hasPrev).toBe(true)
})
