import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'

vi.mock('@/api/auth', () => ({
  updateOnboarding: vi.fn(),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

import { useOnboarding } from '@/hooks/useOnboarding'
import { updateOnboarding } from '@/api/auth'
import { useNavigate } from 'react-router-dom'

const mockUpdateOnboarding = vi.mocked(updateOnboarding)
const mockNavigate = vi.fn()

/** MemoryRouter でラップするラッパー */
function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(MemoryRouter, null, children)
}

describe('useOnboarding', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
  })

  it('初期状態でエラーなし・ローディングなし', () => {
    const { result } = renderHook(() => useOnboarding(), { wrapper })
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('completeOnboarding が updateOnboarding を userName と bio 付きで呼ぶ', async () => {
    mockUpdateOnboarding.mockResolvedValue(undefined)
    const { result } = renderHook(() => useOnboarding(), { wrapper })
    await act(async () => {
      await result.current.completeOnboarding(
        'テストユーザー',
        '自己紹介文です',
      )
    })
    expect(mockUpdateOnboarding).toHaveBeenCalledWith(
      'テストユーザー',
      '自己紹介文です',
    )
  })

  it('成功後に /books へナビゲートする', async () => {
    mockUpdateOnboarding.mockResolvedValue(undefined)
    const { result } = renderHook(() => useOnboarding(), { wrapper })
    await act(async () => {
      await result.current.completeOnboarding(
        'テストユーザー',
        '自己紹介文です',
      )
    })
    expect(mockNavigate).toHaveBeenCalledWith('/books')
  })

  it('実行中に isLoading=true になる', async () => {
    let resolve: () => void = () => {}
    mockUpdateOnboarding.mockReturnValue(
      new Promise<Awaited<ReturnType<typeof updateOnboarding>>>((r) => {
        resolve = () => r(undefined)
      }),
    )
    const { result } = renderHook(() => useOnboarding(), { wrapper })
    act(() => {
      result.current.completeOnboarding('テストユーザー', '自己紹介文です')
    })
    await waitFor(() => expect(result.current.isLoading).toBe(true))
    resolve()
    await waitFor(() => expect(result.current.isLoading).toBe(false))
  })

  it('updateOnboarding がエラーをスローした場合に error がセットされる', async () => {
    mockUpdateOnboarding.mockRejectedValue(
      new Error('ユーザー名の設定に失敗しました'),
    )
    const { result } = renderHook(() => useOnboarding(), { wrapper })
    await act(async () => {
      await result.current.completeOnboarding(
        'テストユーザー',
        '自己紹介文です',
      )
    })
    expect(result.current.error).toBe('ユーザー名の設定に失敗しました')
    expect(result.current.isLoading).toBe(false)
  })
})
