import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'

vi.mock('@/api/auth', () => ({
  signInWithEmail: vi.fn(),
  signInWithGoogle: vi.fn(),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

import { useLogin } from '@/hooks/useLogin'
import { signInWithEmail, signInWithGoogle } from '@/api/auth'
import { useNavigate } from 'react-router-dom'

const mockSignInWithEmail = vi.mocked(signInWithEmail)
const mockSignInWithGoogle = vi.mocked(signInWithGoogle)
const mockNavigate = vi.fn()

/** MemoryRouter でラップするラッパー */
function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(MemoryRouter, null, children)
}

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
  })

  it('initializes with no error and not loading', () => {
    const { result } = renderHook(() => useLogin(), { wrapper })
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('calls signInWithEmail with email and password on login', async () => {
    mockSignInWithEmail.mockResolvedValue(
      {} as Awaited<ReturnType<typeof signInWithEmail>>,
    )
    const { result } = renderHook(() => useLogin(), { wrapper })
    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })
    expect(mockSignInWithEmail).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
    )
  })

  it('navigates to /books after successful login', async () => {
    mockSignInWithEmail.mockResolvedValue(
      {} as Awaited<ReturnType<typeof signInWithEmail>>,
    )
    const { result } = renderHook(() => useLogin(), { wrapper })
    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })
    expect(mockNavigate).toHaveBeenCalledWith('/books')
  })

  it('sets isLoading=true during login', async () => {
    let resolve: () => void = () => {}
    mockSignInWithEmail.mockReturnValue(
      new Promise<Awaited<ReturnType<typeof signInWithEmail>>>((r) => {
        resolve = () => r({} as Awaited<ReturnType<typeof signInWithEmail>>)
      }),
    )
    const { result } = renderHook(() => useLogin(), { wrapper })
    act(() => {
      result.current.login('test@example.com', 'password123')
    })
    await waitFor(() => expect(result.current.isLoading).toBe(true))
    resolve()
    await waitFor(() => expect(result.current.isLoading).toBe(false))
  })

  it('sets error when signInWithEmail throws', async () => {
    mockSignInWithEmail.mockRejectedValue(
      new Error('Invalid login credentials'),
    )
    const { result } = renderHook(() => useLogin(), { wrapper })
    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })
    expect(result.current.error).toBe('Invalid login credentials')
    expect(result.current.isLoading).toBe(false)
  })

  it('calls signInWithGoogle with origin/books on loginWithGoogle', async () => {
    mockSignInWithGoogle.mockResolvedValue({
      provider: 'google',
      url: 'https://accounts.google.com',
    })
    const { result } = renderHook(() => useLogin(), { wrapper })
    await act(async () => {
      await result.current.loginWithGoogle()
    })
    expect(mockSignInWithGoogle).toHaveBeenCalledWith(
      `${window.location.origin}/books`,
    )
  })

  it('sets error when signInWithGoogle throws', async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error('OAuth error'))
    const { result } = renderHook(() => useLogin(), { wrapper })
    await act(async () => {
      await result.current.loginWithGoogle()
    })
    expect(result.current.error).toBe('OAuth error')
  })
})
