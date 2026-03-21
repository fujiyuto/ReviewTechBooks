import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'

vi.mock('@/api/auth', () => ({
  signUpWithEmail: vi.fn(),
  signInWithGoogle: vi.fn(),
}))

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

import { useRegister } from '@/hooks/useRegister'
import { signUpWithEmail, signInWithGoogle } from '@/api/auth'
import { useNavigate } from 'react-router-dom'

const mockSignUpWithEmail = vi.mocked(signUpWithEmail)
const mockSignInWithGoogle = vi.mocked(signInWithGoogle)
const mockNavigate = vi.fn()

/** MemoryRouter でラップするラッパー */
function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(MemoryRouter, null, children)
}

describe('useRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
  })

  it('initializes with no error and not loading', () => {
    const { result } = renderHook(() => useRegister(), { wrapper })
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('calls signUpWithEmail with email and password on register', async () => {
    mockSignUpWithEmail.mockResolvedValue({ user: null, session: null })
    const { result } = renderHook(() => useRegister(), { wrapper })
    await act(async () => {
      await result.current.register('test@example.com', 'password123')
    })
    expect(mockSignUpWithEmail).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
    )
  })

  it('navigates to /users/onboarding after successful registration', async () => {
    mockSignUpWithEmail.mockResolvedValue({ user: null, session: null })
    const { result } = renderHook(() => useRegister(), { wrapper })
    await act(async () => {
      await result.current.register('test@example.com', 'password123')
    })
    expect(mockNavigate).toHaveBeenCalledWith('/users/onboarding')
  })

  it('sets isLoading=true during registration', async () => {
    let resolve: () => void = () => {}
    mockSignUpWithEmail.mockReturnValue(
      new Promise<Awaited<ReturnType<typeof signUpWithEmail>>>((r) => {
        resolve = () => r({ user: null, session: null })
      }),
    )
    const { result } = renderHook(() => useRegister(), { wrapper })
    act(() => {
      result.current.register('test@example.com', 'password123')
    })
    await waitFor(() => expect(result.current.isLoading).toBe(true))
    resolve()
    await waitFor(() => expect(result.current.isLoading).toBe(false))
  })

  it('sets error when signUpWithEmail throws', async () => {
    mockSignUpWithEmail.mockRejectedValue(new Error('Email already registered'))
    const { result } = renderHook(() => useRegister(), { wrapper })
    await act(async () => {
      await result.current.register('test@example.com', 'password123')
    })
    expect(result.current.error).toBe('Email already registered')
    expect(result.current.isLoading).toBe(false)
  })

  it('calls signInWithGoogle with origin/books on registerWithGoogle', async () => {
    mockSignInWithGoogle.mockResolvedValue({
      provider: 'google',
      url: 'https://accounts.google.com',
    })
    const { result } = renderHook(() => useRegister(), { wrapper })
    await act(async () => {
      await result.current.registerWithGoogle()
    })
    expect(mockSignInWithGoogle).toHaveBeenCalledWith(
      `${window.location.origin}/users/onboarding`,
    )
  })

  it('sets error when signInWithGoogle throws', async () => {
    mockSignInWithGoogle.mockRejectedValue(new Error('OAuth error'))
    const { result } = renderHook(() => useRegister(), { wrapper })
    await act(async () => {
      await result.current.registerWithGoogle()
    })
    expect(result.current.error).toBe('OAuth error')
  })
})
