import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useBooks } from '@/hooks/useBooks'

vi.mock('@/api/books', () => ({
  fetchBooks: vi.fn(),
}))

import { fetchBooks } from '@/api/books'

const mockFetchBooks = vi.mocked(fetchBooks)

const baseResponse = {
  books: [
    { id: 1, title: 'テスト書籍1', author: '著者A', publishedBy: '出版社A' },
    { id: 2, title: 'テスト書籍2', author: '著者B', publishedBy: '出版社B' },
  ],
  total: 2,
  currentPage: 1,
  next: false,
  prev: false,
}

describe('useBooks', () => {
  beforeEach(() => {
    mockFetchBooks.mockResolvedValue(baseResponse)
  })

  it('starts with isLoading=true', () => {
    const { result } = renderHook(() => useBooks())
    expect(result.current.isLoading).toBe(true)
  })

  it('fetches books on mount and sets isLoading=false after completion', async () => {
    const { result } = renderHook(() => useBooks())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(mockFetchBooks).toHaveBeenCalledTimes(1)
  })

  it('sets books and total from the response', async () => {
    const { result } = renderHook(() => useBooks())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.books).toEqual(baseResponse.books)
    expect(result.current.total).toBe(2)
  })

  it('sets currentPage from the response', async () => {
    mockFetchBooks.mockResolvedValueOnce({ ...baseResponse, currentPage: 3 })
    const { result } = renderHook(() => useBooks())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.currentPage).toBe(3)
  })

  it('sets hasNext and hasPrev from the response', async () => {
    mockFetchBooks.mockResolvedValueOnce({
      ...baseResponse,
      next: true,
      prev: true,
    })
    const { result } = renderHook(() => useBooks())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.hasNext).toBe(true)
    expect(result.current.hasPrev).toBe(true)
  })

  it('sets error message when fetchBooks throws', async () => {
    mockFetchBooks.mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useBooks())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.error).toBe('Network error')
    expect(result.current.books).toEqual([])
  })

  it('sets a generic error message for non-Error rejections', async () => {
    mockFetchBooks.mockRejectedValueOnce('unknown error')
    const { result } = renderHook(() => useBooks())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.error).toBe('予期しないエラーが発生しました')
  })

  it('refetches when setPage is called', async () => {
    const page2Response = { ...baseResponse, currentPage: 2, prev: true }
    mockFetchBooks
      .mockResolvedValueOnce(baseResponse)
      .mockResolvedValueOnce(page2Response)

    const { result } = renderHook(() => useBooks())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.setPage(2)
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(mockFetchBooks).toHaveBeenCalledTimes(2)
    expect(result.current.currentPage).toBe(2)
    expect(result.current.hasPrev).toBe(true)
  })

  it('passes page to fetchBooks', async () => {
    const { result } = renderHook(() => useBooks())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.setPage(5)
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    const lastCall =
      mockFetchBooks.mock.calls[mockFetchBooks.mock.calls.length - 1][0]
    expect(lastCall?.page).toBe(5)
  })

  it('resets page to 1 when setFilters is called', async () => {
    const { result } = renderHook(() => useBooks())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // ページ 2 に移動
    act(() => {
      result.current.setPage(2)
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    // フィルタ変更 → ページは 1 に戻る
    act(() => {
      result.current.setFilters({ title: 'React' })
    })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const lastCall =
      mockFetchBooks.mock.calls[mockFetchBooks.mock.calls.length - 1][0]
    expect(lastCall?.page).toBe(1)
  })

  it('passes filters to fetchBooks', async () => {
    const { result } = renderHook(() => useBooks())
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    act(() => {
      result.current.setFilters({ title: 'React入門', author: '山田太郎' })
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    const lastCall =
      mockFetchBooks.mock.calls[mockFetchBooks.mock.calls.length - 1][0]
    expect(lastCall).toMatchObject({ title: 'React入門', author: '山田太郎' })
  })
})
