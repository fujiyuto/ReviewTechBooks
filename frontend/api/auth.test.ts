import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { AuthError } from '@supabase/supabase-js'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithOAuth: vi.fn(),
    },
  },
}))

import { signUpWithEmail, signInWithGoogle } from '@/api/auth'
import { supabase } from '@/lib/supabase'

const mockSignUp = vi.mocked(supabase.auth.signUp)
const mockSignInWithOAuth = vi.mocked(supabase.auth.signInWithOAuth)

/** テスト用の AuthError を作成するヘルパー */
function makeAuthError(message: string): AuthError {
  return Object.assign(new Error(message), {
    __isAuthError: true,
    code: 'error',
    status: 400,
  }) as unknown as AuthError
}

describe('signUpWithEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls supabase.auth.signUp with email and password', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    })
    await signUpWithEmail('test@example.com', 'password123')
    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('returns data on success', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    })
    const result = await signUpWithEmail('test@example.com', 'password123')
    expect(result).toEqual({ user: null, session: null })
  })

  it('throws error when supabase returns an error', async () => {
    const mockError = makeAuthError('Email already registered')
    mockSignUp.mockResolvedValue({
      data: { user: null, session: null },
      error: mockError,
    })
    await expect(
      signUpWithEmail('test@example.com', 'password123'),
    ).rejects.toThrow('Email already registered')
  })
})

describe('signInWithGoogle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls supabase.auth.signInWithOAuth with google provider and redirectTo', async () => {
    mockSignInWithOAuth.mockResolvedValue({
      data: { provider: 'google' as const, url: 'https://accounts.google.com' },
      error: null,
    })
    await signInWithGoogle('http://localhost:3000/books')
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: { redirectTo: 'http://localhost:3000/books' },
    })
  })

  it('returns data on success', async () => {
    const mockData = {
      provider: 'google' as const,
      url: 'https://accounts.google.com',
    }
    mockSignInWithOAuth.mockResolvedValue({ data: mockData, error: null })
    const result = await signInWithGoogle('http://localhost:3000/books')
    expect(result).toEqual(mockData)
  })

  it('throws error when supabase returns an error', async () => {
    const mockError = makeAuthError('OAuth error')
    mockSignInWithOAuth.mockResolvedValue({
      data: { provider: 'google' as const, url: null },
      error: mockError,
    })
    await expect(
      signInWithGoogle('http://localhost:3000/books'),
    ).rejects.toThrow('OAuth error')
  })
})
