import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { AuthError } from '@supabase/supabase-js'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithOAuth: vi.fn(),
      getUser: vi.fn(),
      signOut: vi.fn(),
    },
  },
}))

import {
  signUpWithEmail,
  signInWithGoogle,
  updateOnboarding,
  signOut,
} from '@/api/auth'
import { supabase } from '@/lib/supabase'

const mockSignUp = vi.mocked(supabase.auth.signUp)
const mockSignInWithOAuth = vi.mocked(supabase.auth.signInWithOAuth)
const mockGetUser = vi.mocked(supabase.auth.getUser)
const mockSignOut = vi.mocked(supabase.auth.signOut)

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

describe('updateOnboarding', () => {
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('throws error when user is not found', async () => {
    const mockError = makeAuthError('Oauth error')
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: mockError,
    })
    await expect(
      updateOnboarding('テストユーザー', '自己紹介文です'),
    ).rejects.toThrow('ユーザー情報の登録に失敗しました')
  })

  it('sends POST /users with correct body', async () => {
    const mockUser = { id: 'user-123' }
    mockGetUser.mockResolvedValue({
      data: { user: mockUser as never },
      error: null,
    })
    mockFetch.mockResolvedValue({ ok: true })
    await updateOnboarding('テストユーザー', '自己紹介文です')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          authId: 'user-123',
          username: 'テストユーザー',
          biography: '自己紹介文です',
        }),
      }),
    )
  })

  it('throws error when response is not ok', async () => {
    const mockUser = { id: 'user-123' }
    mockGetUser.mockResolvedValue({
      data: { user: mockUser as never },
      error: null,
    })
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'サーバーエラー' }),
    })
    await expect(
      updateOnboarding('テストユーザー', '自己紹介文です'),
    ).rejects.toThrow('サーバーエラー')
  })
})

describe('signOut', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls supabase.auth.signOut', async () => {
    mockSignOut.mockResolvedValue({ error: null })
    await signOut()
    expect(mockSignOut).toHaveBeenCalled()
  })

  it('throws error when supabase returns an error', async () => {
    const mockError = makeAuthError('Sign out failed')
    mockSignOut.mockResolvedValue({ error: mockError })
    await expect(signOut()).rejects.toThrow('Sign out failed')
  })
})
