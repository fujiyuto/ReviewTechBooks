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
  currentPage: 1,
  hasNext: true,
  hasPrev: false,
  isLoading: false,
  error: null,
  filters: {},
  setPage: vi.fn(),
  setFilters: vi.fn(),
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
    mockUseBooks.mockReturnValue({
      ...defaultHookResult,
      setPage: vi.fn(),
      setFilters: vi.fn(),
    })
  })

  it('renders the page heading', () => {
    renderPage()
    screen.getByText('書籍一覧')
  })

  it('renders total count when not loading', () => {
    renderPage()
    screen.getByText('20 件')
  })

  it('renders book cards for each book', () => {
    renderPage()
    screen.getByText('テスト書籍1')
    screen.getByText('テスト書籍2')
  })

  it('shows loading skeleton when isLoading is true', () => {
    mockUseBooks.mockReturnValueOnce({ ...defaultHookResult, isLoading: true })
    const { container } = renderPage()
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(
      0,
    )
  })

  it('does not render total count while loading', () => {
    mockUseBooks.mockReturnValueOnce({ ...defaultHookResult, isLoading: true })
    renderPage()
    expect(screen.queryByText('20 件')).toBeNull()
  })

  it('shows error message when error occurs', () => {
    mockUseBooks.mockReturnValueOnce({
      ...defaultHookResult,
      error: 'サーバーエラーが発生しました',
    })
    renderPage()
    screen.getByText('サーバーエラーが発生しました')
  })

  it('shows empty state message when books list is empty', () => {
    mockUseBooks.mockReturnValueOnce({
      ...defaultHookResult,
      books: [],
      total: 0,
    })
    renderPage()
    screen.getByText('書籍が見つかりませんでした')
  })

  it('shows prev page navigation as disabled span when hasPrev is false', () => {
    renderPage()
    // hasPrev=false のとき、前ページは <span> でレンダリングされる
    const prevEl = screen.getByText('前ページ')
    expect(prevEl.tagName.toLowerCase()).toBe('span')
  })

  it('shows prev page navigation as link when hasPrev is true', () => {
    mockUseBooks.mockReturnValue({
      ...defaultHookResult,
      currentPage: 2,
      hasPrev: true,
    })
    renderPage()
    // hasPrev=true のとき、前ページは <a> (Link) でレンダリングされる
    const prevEl = screen.getByText('前ページ')
    expect(prevEl.tagName.toLowerCase()).toBe('a')
  })

  it('shows next page navigation as link when hasNext is true', () => {
    renderPage()
    // hasNext=true のとき、次ページは <a> (Link) でレンダリングされる
    const nextEl = screen.getByText('次ページ')
    expect(nextEl.tagName.toLowerCase()).toBe('a')
  })

  it('shows next page navigation as disabled span when hasNext is false', () => {
    mockUseBooks.mockReturnValue({ ...defaultHookResult, hasNext: false })
    renderPage()
    // hasNext=false のとき、次ページは <span> でレンダリングされる
    const nextEl = screen.getByText('次ページ')
    expect(nextEl.tagName.toLowerCase()).toBe('span')
  })

  it('hides pagination when books list is empty', () => {
    mockUseBooks.mockReturnValueOnce({
      ...defaultHookResult,
      books: [],
      total: 0,
    })
    renderPage()
    expect(screen.queryByText('前ページ')).toBeNull()
    expect(screen.queryByText('次ページ')).toBeNull()
  })

  it('calls setFilters with form values on submission', () => {
    const setFilters = vi.fn()
    mockUseBooks.mockReturnValue({ ...defaultHookResult, setFilters })
    renderPage()

    fireEvent.change(screen.getByPlaceholderText('書籍名'), {
      target: { value: 'React' },
    })
    fireEvent.change(screen.getByPlaceholderText('著者名'), {
      target: { value: '山田太郎' },
    })
    fireEvent.submit(screen.getByPlaceholderText('書籍名').closest('form')!)

    expect(setFilters).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'React', author: '山田太郎' }),
    )
  })

  it('calls setFilters with undefined for empty search fields', () => {
    const setFilters = vi.fn()
    mockUseBooks.mockReturnValue({ ...defaultHookResult, setFilters })
    renderPage()

    fireEvent.submit(screen.getByPlaceholderText('書籍名').closest('form')!)

    expect(setFilters).toHaveBeenCalledWith({
      title: undefined,
      author: undefined,
      publishedBy: undefined,
    })
  })

  it('calls setPage with page number from URL on mount', async () => {
    const setPage = vi.fn()
    mockUseBooks.mockReturnValue({ ...defaultHookResult, setPage })
    renderPage('/books?page=3')

    await waitFor(() => {
      expect(setPage).toHaveBeenCalledWith(3)
    })
  })

  it('calls setPage(1) when URL has no page param', async () => {
    const setPage = vi.fn()
    mockUseBooks.mockReturnValue({ ...defaultHookResult, setPage })
    renderPage('/books')

    await waitFor(() => {
      expect(setPage).toHaveBeenCalledWith(1)
    })
  })

  it('calls setPage(1) when URL has an invalid page param', async () => {
    const setPage = vi.fn()
    mockUseBooks.mockReturnValue({ ...defaultHookResult, setPage })
    renderPage('/books?page=abc')

    await waitFor(() => {
      expect(setPage).toHaveBeenCalledWith(1)
    })
  })

  it('next page link points to currentPage + 1', () => {
    // currentPage=1, hasNext=true → 次ページリンクは /books?page=2
    renderPage()
    const nextEl = screen.getByText('次ページ')
    expect(nextEl.getAttribute('href')).toBe('/books?page=2')
  })

  it('prev page link points to currentPage - 1', () => {
    // currentPage=3, hasPrev=true → 前ページリンクは /books?page=2
    mockUseBooks.mockReturnValue({
      ...defaultHookResult,
      currentPage: 3,
      hasPrev: true,
    })
    renderPage()
    const prevEl = screen.getByText('前ページ')
    expect(prevEl.getAttribute('href')).toBe('/books?page=2')
  })
})
