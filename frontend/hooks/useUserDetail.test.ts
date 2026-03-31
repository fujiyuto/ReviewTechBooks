import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useUserDetail } from '@/hooks/useUserDetail'
import { type User } from '@/api/users'

vi.mock('@/api/users', () => ({
  fetchUserDetail: vi.fn(),
}))

import { fetchUserDetail } from '@/api/users'

const mockFetchUserDetail = vi.mocked(fetchUserDetail)

const baseResponse1: User = {
  id: 1,
  username: 'testuser',
  biography: 'こんにちわ',
  role: 'free',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
}

const baseResponse2: User = {
  id: 2,
  username: 'anotheruser',
  biography: 'はじめまして',
  role: 'premium',
  createdAt: '2024-02-01T00:00:00Z',
  updatedAt: '2024-02-01T00:00:00Z',
}

describe('useUserDetailテスト', () => {
  beforeEach(() => {
    mockFetchUserDetail.mockResolvedValue(baseResponse1)
  })

  it('初期状態', () => {
    const { result } = renderHook(() => useUserDetail('testuser'))

    expect(result.current.user).toBeNull()
    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBe(null)
  })

  it('データ取得成功時', async () => {
    const { result } = renderHook(() => useUserDetail('testuser'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.user).toEqual(baseResponse1)
    expect(result.current.error).toBe(null)
  })

  it('データ取得失敗時（エラー発生時）', async () => {
    mockFetchUserDetail.mockRejectedValueOnce(
      new Error('ネットワークエラーが発生しました'),
    )

    const { result } = renderHook(() => useUserDetail('testuser'))

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.user).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('ネットワークエラーが発生しました')
  })

  it('引数変更時', async () => {
    mockFetchUserDetail
      .mockResolvedValueOnce(baseResponse1)
      .mockResolvedValueOnce(baseResponse2)

    const { result, rerender } = renderHook(
      ({ username }: { username: string }) => useUserDetail(username),
      { initialProps: { username: 'testuser' } },
    )

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    rerender({ username: 'anotheruser' })

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.user).toEqual(baseResponse2)
  })
})
