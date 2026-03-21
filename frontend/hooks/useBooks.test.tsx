import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
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
    const { result } = renderHook(() => useBooks({}))
    expect(result.current.isLoading).toBe(true)
  })

  it('fetches books on mount and sets isLoading=false after completion', async () => {
    const { result } = renderHook(() => useBooks({}))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(mockFetchBooks).toHaveBeenCalledTimes(1)
  })

  it('sets books and total from the response', async () => {
    const { result } = renderHook(() => useBooks({}))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.books).toEqual(baseResponse.books)
    expect(result.current.total).toBe(2)
  })

  it('sets hasNext and hasPrev from the response', async () => {
    mockFetchBooks.mockResolvedValueOnce({
      ...baseResponse,
      next: true,
      prev: true,
    })
    const { result } = renderHook(() => useBooks({}))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.hasNext).toBe(true)
    expect(result.current.hasPrev).toBe(true)
  })

  it('sets error message when fetchBooks throws', async () => {
    mockFetchBooks.mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useBooks({}))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.error).toBe('Network error')
    expect(result.current.books).toEqual([])
  })

  it('sets a generic error message for non-Error rejections', async () => {
    mockFetchBooks.mockRejectedValueOnce('unknown error')
    const { result } = renderHook(() => useBooks({}))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.error).toBe('予期しないエラーが発生しました')
  })

  it('refetches when page changes', async () => {
    const page2Response = { ...baseResponse, prev: true }
    mockFetchBooks
      .mockResolvedValueOnce(baseResponse)
      .mockResolvedValueOnce(page2Response)

    const { result, rerender } = renderHook(
      ({ page }: { page: number }) => useBooks({ page }),
      { initialProps: { page: 1 } },
    )
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    rerender({ page: 2 })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(mockFetchBooks).toHaveBeenCalledTimes(2)
    expect(result.current.hasPrev).toBe(true)
  })

  it('passes page to fetchBooks', async () => {
    const { rerender } = renderHook(
      ({ page }: { page: number }) => useBooks({ page }),
      { initialProps: { page: 1 } },
    )
    await waitFor(() => expect(mockFetchBooks).toHaveBeenCalledTimes(1))

    rerender({ page: 5 })
    await waitFor(() => expect(mockFetchBooks).toHaveBeenCalledTimes(2))
    const lastCall =
      mockFetchBooks.mock.calls[mockFetchBooks.mock.calls.length - 1][0]
    expect(lastCall?.page).toBe(5)
  })

  it('passes page 1 when filters change with page reset', async () => {
    const { rerender } = renderHook(
      ({ title, page }: { title?: string; page: number }) =>
        useBooks({ title, page }),
      { initialProps: { title: undefined, page: 2 } },
    )
    await waitFor(() => expect(mockFetchBooks).toHaveBeenCalledTimes(1))

    rerender({ title: 'React', page: 1 })
    await waitFor(() => expect(mockFetchBooks).toHaveBeenCalledTimes(2))
    const lastCall =
      mockFetchBooks.mock.calls[mockFetchBooks.mock.calls.length - 1][0]
    expect(lastCall?.page).toBe(1)
  })

  it('passes filters to fetchBooks', async () => {
    const { rerender } = renderHook(
      ({ title, author }: { title?: string; author?: string }) =>
        useBooks({ title, author }),
      { initialProps: { title: undefined, author: undefined } },
    )
    await waitFor(() => expect(mockFetchBooks).toHaveBeenCalledTimes(1))

    rerender({ title: 'React入門', author: '山田太郎' })
    await waitFor(() => expect(mockFetchBooks).toHaveBeenCalledTimes(2))
    const lastCall =
      mockFetchBooks.mock.calls[mockFetchBooks.mock.calls.length - 1][0]
    expect(lastCall).toMatchObject({ title: 'React入門', author: '山田太郎' })
  })
})
