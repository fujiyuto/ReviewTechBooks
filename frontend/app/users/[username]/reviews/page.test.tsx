import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import UserReviewsPage from '@/app/users/[username]/reviews/page'
import type { UseUserDetailResult } from '@/hooks/useUserDetail'
import type { UseUserReviewsResult } from '@/hooks/useUserReviews'

vi.mock('@/hooks/useUserDetail', () => ({ useUserDetail: vi.fn() }))
vi.mock('@/hooks/useUserReviews', () => ({ useUserReviews: vi.fn() }))

import { useUserDetail } from '@/hooks/useUserDetail'
import { useUserReviews } from '@/hooks/useUserReviews'

const mockUseUserDetail = vi.mocked(useUserDetail)
const mockUseUserReviews = vi.mocked(useUserReviews)

const defaultDetailResult: UseUserDetailResult = {
  user: { id: 1, username: 'testuser' },
  isLoading: false,
  error: null,
}

const defaultReviewsResult: UseUserReviewsResult = {
  reviews: [
    {
      id: 1,
      book: { id: 1, title: 'テスト書籍' },
      title: 'テストレビュー',
      content: 'テストコンテンツ',
      categories: [],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  total: 15,
  hasNext: true,
  hasPrev: false,
  isLoading: false,
  error: null,
}

function renderPage(username = 'testuser', query = '') {
  const path = `/users/${username}/reviews${query}`
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/users/:username/reviews" element={<UserReviewsPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('UserReviewsPage', () => {
  beforeEach(() => {
    mockUseUserDetail.mockReturnValue({ ...defaultDetailResult })
    mockUseUserReviews.mockReturnValue({ ...defaultReviewsResult })
  })

  describe('パスパラメータ検証', () => {
    it('有効なusernameのときレビュー一覧が表示される', () => {
      renderPage('testuser')
      screen.getByText('testuser のレビュー一覧')
    })
  })

  describe('ユーザー名表示', () => {
    it('ユーザー名が取得できたときタイトルに表示される', () => {
      renderPage()
      screen.getByText('testuser のレビュー一覧')
    })

    it('ユーザー名が未設定のとき「名無しユーザー」が表示される', () => {
      mockUseUserDetail.mockReturnValueOnce({
        ...defaultDetailResult,
        user: { id: 1, username: undefined },
      })
      renderPage()
      screen.getByText('名無しユーザー のレビュー一覧')
    })
  })

  describe('レビュー一覧の状態 (useUserReviews)', () => {
    it('reviewsLoading が true のとき3個のスケルトンが表示される', () => {
      mockUseUserReviews.mockReturnValueOnce({
        ...defaultReviewsResult,
        isLoading: true,
        reviews: [],
      })
      const { container } = renderPage()
      expect(container.querySelectorAll('.animate-pulse').length).toBe(3)
    })

    it('reviewsError があるとき赤色エラーボックスにメッセージが表示される', () => {
      mockUseUserReviews.mockReturnValueOnce({
        ...defaultReviewsResult,
        error: 'レビューの取得に失敗しました',
      })
      renderPage()
      screen.getByText('レビューの取得に失敗しました')
    })

    it('レビューが0件のとき「まだレビューがありません」が表示される', () => {
      mockUseUserReviews.mockReturnValueOnce({
        ...defaultReviewsResult,
        reviews: [],
        total: 0,
      })
      renderPage()
      screen.getByText('まだレビューがありません')
    })

    it('レビューが存在するとき各レビューが表示される', () => {
      renderPage()
      screen.getByText('テストレビュー')
    })
  })

  describe('URL パラメータとフック呼び出し', () => {
    it('URL に ?page=3 があるとき useUserReviews が page:3 で呼ばれる', () => {
      renderPage('testuser', '?page=3')
      expect(mockUseUserReviews).toHaveBeenCalledWith('testuser', { page: 3 })
    })

    it('URL に page がないとき useUserReviews が page:1 で呼ばれる', () => {
      renderPage('testuser')
      expect(mockUseUserReviews).toHaveBeenCalledWith('testuser', { page: 1 })
    })
  })

  describe('ページネーション', () => {
    it('レビューが存在するときページネーションが表示される', () => {
      renderPage()
      screen.getByRole('button', { name: '前へ' })
      screen.getByRole('button', { name: '次へ' })
    })

    it('レビューが0件のときページネーションが表示されない', () => {
      mockUseUserReviews.mockReturnValueOnce({
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
      mockUseUserReviews.mockReturnValueOnce({
        ...defaultReviewsResult,
        hasNext: false,
      })
      renderPage()
      const nextBtn = screen.getByRole('button', {
        name: '次へ',
      }) as HTMLButtonElement
      expect(nextBtn.disabled).toBe(true)
    })

    it('「次へ」クリックでURLのpageが2になる', () => {
      renderPage('testuser')
      fireEvent.click(screen.getByRole('button', { name: '次へ' }))
      expect(mockUseUserReviews).toHaveBeenCalledWith('testuser', { page: 2 })
    })
  })

  describe('UI 表示', () => {
    it('ローディング中でないとき総レビュー件数が表示される', () => {
      renderPage()
      screen.getByText('15 件')
    })

    it('ローディング中は総件数が表示されない', () => {
      mockUseUserReviews.mockReturnValueOnce({
        ...defaultReviewsResult,
        isLoading: true,
        reviews: [],
      })
      renderPage()
      expect(screen.queryByText('15 件')).toBeNull()
    })

    it('ユーザー詳細に戻るリンクが正しいパスを持つ', () => {
      renderPage('someuser')
      const link = screen.getByRole('link', { name: '← ユーザー詳細に戻る' })
      expect(link.getAttribute('href')).toBe('/users/someuser')
    })
  })
})
