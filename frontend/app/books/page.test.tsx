import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BookListPage from '@/app/books/page'
import type { UseBooksResult } from '@/hooks/useBooks'

vi.mock('@/hooks/useBooks', () => ({
  useBooks: vi.fn(),
}))

import { useBooks } from '@/hooks/useBooks'

const mockUseBooks = vi.mocked(useBooks)

const defaultHookResult: UseBooksResult = {
  books: [
    { id: 1, title: 'テスト書籍1', author: '著者A', publishedBy: '出版社A' },
    { id: 2, title: 'テスト書籍2', author: '著者B', publishedBy: '出版社B' },
  ],
  total: 20,
  hasNext: true,
  hasPrev: false,
  isLoading: false,
  error: null,
}

function renderPage(initialEntry = '/books') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <BookListPage />
    </MemoryRouter>,
  )
}

describe('BookListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseBooks.mockReturnValue(defaultHookResult)
  })

  it('ページ見出しが表示される', () => {
    renderPage()
    screen.getByText('書籍一覧')
  })

  it('ローディング中でないとき総件数が表示される', () => {
    renderPage()
    screen.getByText('20 件')
  })

  it('各書籍のカードが表示される', () => {
    renderPage()
    screen.getByText('テスト書籍1')
    screen.getByText('テスト書籍2')
  })

  it('isLoading が true のときローディングスケルトンが表示される', () => {
    mockUseBooks.mockReturnValueOnce({ ...defaultHookResult, isLoading: true })
    const { container } = renderPage()
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(
      0,
    )
  })

  it('isLoading が true のとき総件数が表示されない', () => {
    mockUseBooks.mockReturnValueOnce({ ...defaultHookResult, isLoading: true })
    renderPage()
    expect(screen.queryByText('20 件')).toBeNull()
  })

  it('エラー発生時にエラーメッセージが表示される', () => {
    mockUseBooks.mockReturnValueOnce({
      ...defaultHookResult,
      error: 'サーバーエラーが発生しました',
    })
    renderPage()
    screen.getByText('サーバーエラーが発生しました')
  })

  it('書籍が0件のとき空状態メッセージが表示される', () => {
    mockUseBooks.mockReturnValueOnce({
      ...defaultHookResult,
      books: [],
      total: 0,
    })
    renderPage()
    screen.getByText('書籍が見つかりませんでした')
  })

  it('hasPrev が false のとき前へボタンが disabled になる', () => {
    renderPage()
    const prevBtn = screen.getByRole('button', {
      name: '前へ',
    }) as HTMLButtonElement
    expect(prevBtn.disabled).toBe(true)
  })

  it('hasPrev が true のとき前へボタンが disabled でない', () => {
    mockUseBooks.mockReturnValue({
      ...defaultHookResult,
      hasPrev: true,
    })
    renderPage()
    const prevBtn = screen.getByRole('button', {
      name: '前へ',
    }) as HTMLButtonElement
    expect(prevBtn.disabled).toBe(false)
  })

  it('hasNext が true のとき次へボタンが disabled でない', () => {
    renderPage()
    const nextBtn = screen.getByRole('button', {
      name: '次へ',
    }) as HTMLButtonElement
    expect(nextBtn.disabled).toBe(false)
  })

  it('hasNext が false のとき次へボタンが disabled になる', () => {
    mockUseBooks.mockReturnValue({ ...defaultHookResult, hasNext: false })
    renderPage()
    const nextBtn = screen.getByRole('button', {
      name: '次へ',
    }) as HTMLButtonElement
    expect(nextBtn.disabled).toBe(true)
  })

  it('書籍が0件のときページネーションが表示されない', () => {
    mockUseBooks.mockReturnValueOnce({
      ...defaultHookResult,
      books: [],
      total: 0,
    })
    renderPage()
    expect(screen.queryByRole('button', { name: '前へ' })).toBeNull()
    expect(screen.queryByRole('button', { name: '次へ' })).toBeNull()
  })

  it('フォーム送信時に入力値で useBooks が呼ばれる', () => {
    renderPage()
    fireEvent.change(screen.getByPlaceholderText('書籍名'), {
      target: { value: 'React' },
    })
    fireEvent.change(screen.getByPlaceholderText('著者名'), {
      target: { value: '山田太郎' },
    })
    fireEvent.submit(screen.getByPlaceholderText('書籍名').closest('form')!)

    expect(mockUseBooks).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'React', author: '山田太郎' }),
    )
  })

  it('検索フィールドが空のとき useBooks にフィルタなしで呼ばれる', () => {
    renderPage()
    fireEvent.submit(screen.getByPlaceholderText('書籍名').closest('form')!)

    const lastCall =
      mockUseBooks.mock.calls[mockUseBooks.mock.calls.length - 1][0]
    expect(lastCall).not.toHaveProperty('title')
    expect(lastCall).not.toHaveProperty('author')
    expect(lastCall).not.toHaveProperty('publishedBy')
  })

  it('URL の page パラメータが useBooks に渡される', () => {
    renderPage('/books?page=3')
    expect(mockUseBooks).toHaveBeenCalledWith(
      expect.objectContaining({ page: 3 }),
    )
  })

  it('URL に page パラメータがないとき useBooks に page:1 が渡される', () => {
    renderPage('/books')
    expect(mockUseBooks).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1 }),
    )
  })

  it('URL の page パラメータが無効な値のとき useBooks に page:1 が渡される', () => {
    renderPage('/books?page=abc')
    expect(mockUseBooks).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1 }),
    )
  })

  it('次へボタンをクリックすると useBooks に page+1 が渡される', async () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: '次へ' }))
    await waitFor(() => {
      expect(mockUseBooks).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 }),
      )
    })
  })

  it('前へボタンをクリックすると useBooks に page-1 が渡される', async () => {
    mockUseBooks.mockReturnValue({ ...defaultHookResult, hasPrev: true })
    renderPage('/books?page=3')
    fireEvent.click(screen.getByRole('button', { name: '前へ' }))
    await waitFor(() => {
      expect(mockUseBooks).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 }),
      )
    })
  })
})
