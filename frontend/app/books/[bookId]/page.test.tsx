import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import BookDetailPage from '@/app/books/[bookId]/page'
import type { UseBookDetailResult } from '@/hooks/useBookDetail'
import type { UseBookReviewsResult } from '@/hooks/useBookReviews'

vi.mock('@/hooks/useBookDetail', () => ({ useBookDetail: vi.fn() }))
vi.mock('@/hooks/useBookReviews', () => ({ useBookReviews: vi.fn() }))

import { useBookDetail } from '@/hooks/useBookDetail'
import { useBookReviews } from '@/hooks/useBookReviews'

const mockUseBookDetail = vi.mocked(useBookDetail)
const mockUseBookReviews = vi.mocked(useBookReviews)

const defaultDetailResult: UseBookDetailResult = {
  book: {
    id: 42,
    title: 'テスト書籍',
    author: '著者A',
    publishedBy: '出版社A',
    description: 'テスト書籍の説明文',
  },
  isLoading: false,
  error: null,
}

const defaultReviewsResult: UseBookReviewsResult = {
  reviews: [
    {
      id: 1,
      title: 'レビュー1',
      content: '良い書籍です',
      user: { id: 1, username: 'user1' },
    },
  ],
  total: 5,
  currentPage: 1,
  hasNext: true,
  hasPrev: false,
  isLoading: false,
  error: null,
  setPage: vi.fn(),
}

function renderPage(bookId = '42', query = '') {
  const path = `/books/${bookId}${query}`
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/books/:bookId" element={<BookDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('BookDetailPage', () => {
  beforeEach(() => {
    mockUseBookDetail.mockReturnValue({
      ...defaultDetailResult,
    })
    mockUseBookReviews.mockReturnValue({
      ...defaultReviewsResult,
      setPage: vi.fn(),
    })
  })

  describe('パスパラメータ検証', () => {
    it('有効な数値IDのとき書籍詳細が表示される', () => {
      renderPage('42')
      screen.getByText('テスト書籍')
    })

    it('文字列ID (abc) のとき「無効な書籍IDです」が表示される', () => {
      renderPage('abc')
      screen.getByText('無効な書籍IDです')
    })

    it('0 のとき「無効な書籍IDです」が表示される', () => {
      renderPage('0')
      screen.getByText('無効な書籍IDです')
    })
  })

  describe('書籍詳細の状態 (useBookDetail)', () => {
    it('bookLoading が true のとき書籍スケルトンが表示される', () => {
      mockUseBookDetail.mockReturnValueOnce({
        ...defaultDetailResult,
        isLoading: true,
      })
      const { container } = renderPage()
      expect(
        container.querySelectorAll('.animate-pulse').length,
      ).toBeGreaterThan(0)
    })

    it('bookError があるとき赤色エラーボックスにメッセージが表示される', () => {
      mockUseBookDetail.mockReturnValueOnce({
        ...defaultDetailResult,
        error: '書籍詳細の取得に失敗しました',
      })
      renderPage()
      screen.getByText('書籍詳細の取得に失敗しました')
    })

    it('書籍データが存在するとき書籍タイトルが表示される', () => {
      renderPage()
      screen.getByText('テスト書籍')
    })
  })

  describe('レビュー一覧の状態 (useBookReviews)', () => {
    it('reviewsLoading が true のとき3個のレビュースケルトンが表示される', () => {
      mockUseBookReviews.mockReturnValueOnce({
        ...defaultReviewsResult,
        isLoading: true,
        reviews: [],
      })
      const { container } = renderPage()
      // レビューセクションのスケルトンは3個
      expect(container.querySelectorAll('.animate-pulse').length).toBe(3)
    })

    it('reviewsError があるとき赤色エラーボックスにメッセージが表示される', () => {
      mockUseBookReviews.mockReturnValueOnce({
        ...defaultReviewsResult,
        error: 'レビューの取得に失敗しました',
      })
      renderPage()
      screen.getByText('レビューの取得に失敗しました')
    })

    it('レビューが0件のとき「まだレビューがありません」が表示される', () => {
      mockUseBookReviews.mockReturnValueOnce({
        ...defaultReviewsResult,
        reviews: [],
        total: 0,
      })
      renderPage()
      screen.getByText('まだレビューがありません')
    })

    it('レビューが存在するとき各レビューが表示される', () => {
      renderPage()
      screen.getByText('レビュー1')
    })
  })

  describe('ページネーション', () => {
    it('レビューが存在するときページネーションが表示される', () => {
      renderPage()
      screen.getByRole('button', { name: '前へ' })
      screen.getByRole('button', { name: '次へ' })
    })

    it('レビューが0件のときページネーションが表示されない', () => {
      mockUseBookReviews.mockReturnValueOnce({
        ...defaultReviewsResult,
        reviews: [],
        total: 0,
      })
      renderPage()
      expect(screen.queryByRole('button', { name: '前へ' })).toBeNull()
      expect(screen.queryByRole('button', { name: '次へ' })).toBeNull()
    })

    it('hasPrev が false のとき「前へ」ボタンが disabled', () => {
      renderPage()
      const prevBtn = screen.getByRole('button', {
        name: '前へ',
      }) as HTMLButtonElement
      expect(prevBtn.disabled).toBe(true)
    })

    it('hasNext が false のとき「次へ」ボタンが disabled', () => {
      mockUseBookReviews.mockReturnValue({
        ...defaultReviewsResult,
        hasNext: false,
        setPage: vi.fn(),
      })
      renderPage()
      const nextBtn = screen.getByRole('button', {
        name: '次へ',
      }) as HTMLButtonElement
      expect(nextBtn.disabled).toBe(true)
    })
  })

  describe('URL パラメータ同期', () => {
    it('マウント時に URL の ?page=N が setPage(N) に反映される', async () => {
      const setPage = vi.fn()
      mockUseBookReviews.mockReturnValue({ ...defaultReviewsResult, setPage })
      renderPage('42', '?page=3')

      await waitFor(() => {
        expect(setPage).toHaveBeenCalledWith(3)
      })
    })

    it('URL に page がないとき setPage(1) が呼ばれる', async () => {
      const setPage = vi.fn()
      mockUseBookReviews.mockReturnValue({ ...defaultReviewsResult, setPage })
      renderPage('42')

      await waitFor(() => {
        expect(setPage).toHaveBeenCalledWith(1)
      })
    })

    it('無効な page 値 (abc) のとき setPage(1) が呼ばれる', async () => {
      const setPage = vi.fn()
      mockUseBookReviews.mockReturnValue({ ...defaultReviewsResult, setPage })
      renderPage('42', '?page=abc')

      await waitFor(() => {
        expect(setPage).toHaveBeenCalledWith(1)
      })
    })
  })

  describe('ページ変更インタラクション', () => {
    it('「次へ」クリックで setPage(currentPage + 1) が呼ばれる', async () => {
      const setPage = vi.fn()
      mockUseBookReviews.mockReturnValue({
        ...defaultReviewsResult,
        currentPage: 1,
        setPage,
      })
      renderPage()

      fireEvent.click(screen.getByRole('button', { name: '次へ' }))

      await waitFor(() => {
        expect(setPage).toHaveBeenCalledWith(2)
      })
    })

    it('「前へ」クリックで setPage(currentPage - 1) が呼ばれる', async () => {
      const setPage = vi.fn()
      mockUseBookReviews.mockReturnValue({
        ...defaultReviewsResult,
        currentPage: 3,
        hasPrev: true,
        setPage,
      })
      renderPage()

      fireEvent.click(screen.getByRole('button', { name: '前へ' }))

      await waitFor(() => {
        expect(setPage).toHaveBeenCalledWith(2)
      })
    })
  })

  describe('UI 表示', () => {
    it('ローディング中でないとき総レビュー件数が表示される', () => {
      renderPage()
      screen.getByText('5 件')
    })

    it('ローディング中は総件数が表示されない', () => {
      mockUseBookReviews.mockReturnValueOnce({
        ...defaultReviewsResult,
        isLoading: true,
        reviews: [],
      })
      renderPage()
      expect(screen.queryByText('5 件')).toBeNull()
    })
  })
})
