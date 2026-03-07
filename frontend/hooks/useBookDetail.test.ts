import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBookDetail } from '@/hooks/useBookDetail'
import { type BookDetail } from '@/api/books'

vi.mock('@/api/books', () => ({
  fetchBookDetail: vi.fn(),
}))

import { fetchBookDetail } from '@/api/books'

const mockFetchBookDetail = vi.mocked(fetchBookDetail)

const baseResponse1: BookDetail = {
  id: 1,
  isbn: '9784873119038',
  title: 'データ指向アプリケーションデザイン',
  subtitle: '信頼性、拡張性、保守性の高い分散システム設計の原理',
  author: 'Martin Kleppmann',
  publishedBy: 'オライリー・ジャパン',
  numberOfPages: 592,
  regularPrice: 5400,
  includeTaxPrice: 5940,
  releaseDate: '2019-07-04',
  description: 'データシステムの設計・構築・保守における課題を解説した書籍。',
  thumbnailUrl: 'https://picsum.photos/200/300',
}

const baseResponse2: BookDetail = {
  id: 2,
  isbn: '9784873117539',
  title: 'クリーンアーキテクチャ',
  subtitle: '達人に学ぶソフトウェアの構造と設計',
  author: 'Robert C. Martin',
  publishedBy: 'アスキードワンゴ',
  numberOfPages: 352,
  regularPrice: 3200,
  includeTaxPrice: 3520,
  releaseDate: '2018-07-27',
  description:
    'ソフトウェアアーキテクチャの原則と設計指針を体系的に解説した書籍。',
  thumbnailUrl: 'https://picsum.photos/200/300',
}

describe('useBookDetailテスト', () => {
  // テスト前にfetch関数をモック
  beforeEach(() => {
    mockFetchBookDetail.mockResolvedValue(baseResponse1)
  })

  /**
   * 初期状態のテスト
   * 期待値
   * - book = null
   * - isLoading = true
   * - error = null
   */
  it('初期状態', () => {
    // カスタムフックをレンダリング
    const { result } = renderHook(() => useBookDetail(1))

    // 初期状態の検証
    expect(result.current.book).toBeNull()
    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBe(null)
  })

  /**
   * データ取得成功時のテスト
   * 期待値
   * - book = 取得した詳細データ
   * - isLoading = false
   * - error = null
   */
  it('データ取得成功時', async () => {
    // カスタムフックをレンダリング
    const { result } = renderHook(() => useBookDetail(1))

    // ローディングがfalseになるまで待機
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.book).toEqual(baseResponse1)
    expect(result.current.error).toBe(null)
  })

  /**
   * データ取得失敗時のテスト（エラー発生時）
   * 期待値
   * - book = null
   * - isLoading = false
   * - error = エラーメッセージ
   */
  it('データ取得失敗時（エラー発生時）', async () => {
    // fetch関数をエラーを投げるようにモック
    mockFetchBookDetail.mockRejectedValueOnce(
      new Error('ネットワークエラーが発生しました'),
    )

    // カスタムフックをレンダリング
    const { result } = renderHook(() => useBookDetail(1))

    // ローディングがfalseになるまで待機
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.book).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('ネットワークエラーが発生しました')
  })

  /**
   * 引数変更時のテスト
   * 期待値
   * - useBookDetailの引数(bookId)変更時、再度データが取得されること
   */
  it('引数変更時', async () => {
    // bookIdが1,2の時のレスポンスデータを設定
    mockFetchBookDetail
      .mockResolvedValueOnce(baseResponse1)
      .mockResolvedValueOnce(baseResponse2)

    const { result, rerender } = renderHook(
      ({ bookId }: { bookId: number }) => useBookDetail(bookId),
      { initialProps: { bookId: 1 } },
    )

    // 初回データの取得まで待機
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // bookIdを2に変更して再レンダリング
    rerender({ bookId: 2 })

    // 2回目のデータ取得まで待機
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // bookIdが2のデータが取得できてること確認
    expect(result.current.book).toEqual(baseResponse2)
  })
})
