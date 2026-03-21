import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'

vi.mock('@/api/auth', () => ({
  signOut: vi.fn(),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

import { useLogout } from '@/hooks/useLogout'
import { signOut } from '@/api/auth'
import { useNavigate } from 'react-router-dom'

const mockSignOut = vi.mocked(signOut)
const mockNavigate = vi.fn()

/** MemoryRouter でラップするラッパー */
function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(MemoryRouter, null, children)
}

describe('useLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
  })

  it('initializes with no error and not loading', () => {
    const { result } = renderHook(() => useLogout(), { wrapper })
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('calls signOut and navigates to /users/login on success', async () => {
    mockSignOut.mockResolvedValue(undefined)
    const { result } = renderHook(() => useLogout(), { wrapper })
    await act(async () => {
      await result.current.logout()
    })
    expect(mockSignOut).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/users/login')
  })

  it('sets isLoading=true during logout', async () => {
    let resolve: () => void = () => {}
    mockSignOut.mockReturnValue(new Promise<void>((r) => (resolve = r)))
    const { result } = renderHook(() => useLogout(), { wrapper })
    act(() => {
      result.current.logout()
    })
    await waitFor(() => expect(result.current.isLoading).toBe(true))
    resolve()
    await waitFor(() => expect(result.current.isLoading).toBe(false))
  })

  it('sets error when signOut throws', async () => {
    mockSignOut.mockRejectedValue(new Error('ログアウトエラー'))
    const { result } = renderHook(() => useLogout(), { wrapper })
    await act(async () => {
      await result.current.logout()
    })
    expect(result.current.error).toBe('ログアウトエラー')
    expect(result.current.isLoading).toBe(false)
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
