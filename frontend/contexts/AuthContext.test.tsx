import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import React from 'react'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}))

import { AuthContext, AuthProvider } from '@/contexts/AuthContext'
import type { AuthContextValue } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

const mockGetSession = vi.mocked(supabase.auth.getSession)
const mockOnAuthStateChange = vi.mocked(supabase.auth.onAuthStateChange)
const mockUnsubscribe = vi.fn()

/** コンテキスト値を読み取るテスト用コンポーネント */
function ContextReader({
  onValue,
}: {
  onValue: (value: AuthContextValue | null) => void
}) {
  const ctx = React.useContext(AuthContext)
  onValue(ctx)
  return null
}

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    } as unknown as ReturnType<typeof supabase.auth.onAuthStateChange>)
  })

  it('initializes with isLoading=true and isLoggedIn=false', () => {
    mockGetSession.mockReturnValue(new Promise(() => {}))
    let captured: AuthContextValue | null = null
    render(
      <AuthProvider>
        <ContextReader onValue={(v) => (captured = v)} />
      </AuthProvider>,
    )
    expect(captured).not.toBeNull()
    expect(captured!.isLoading).toBe(true)
    expect(captured!.isLoggedIn).toBe(false)
  })

  it('sets isLoggedIn=true and isLoading=false when session exists', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'user-1' } } },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.getSession>>)
    let captured: AuthContextValue | null = null
    render(
      <AuthProvider>
        <ContextReader onValue={(v) => (captured = v)} />
      </AuthProvider>,
    )
    await waitFor(() => expect(captured!.isLoading).toBe(false))
    expect(captured!.isLoggedIn).toBe(true)
  })

  it('sets isLoggedIn=false and isLoading=false when no session', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.getSession>>)
    let captured: AuthContextValue | null = null
    render(
      <AuthProvider>
        <ContextReader onValue={(v) => (captured = v)} />
      </AuthProvider>,
    )
    await waitFor(() => expect(captured!.isLoading).toBe(false))
    expect(captured!.isLoggedIn).toBe(false)
  })

  it('updates isLoggedIn when onAuthStateChange fires', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.getSession>>)
    let authChangeCallback: Parameters<
      typeof supabase.auth.onAuthStateChange
    >[0] = async () => {}
    mockOnAuthStateChange.mockImplementation((cb) => {
      authChangeCallback = cb
      return {
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      } as unknown as ReturnType<typeof supabase.auth.onAuthStateChange>
    })

    let captured: AuthContextValue | null = null
    render(
      <AuthProvider>
        <ContextReader onValue={(v) => (captured = v)} />
      </AuthProvider>,
    )
    await waitFor(() => expect(captured!.isLoading).toBe(false))
    expect(captured!.isLoggedIn).toBe(false)

    authChangeCallback('SIGNED_IN', { user: { id: 'user-1' } } as never)
    await waitFor(() => expect(captured!.isLoggedIn).toBe(true))
  })

  it('unsubscribes on unmount', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: null },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.getSession>>)
    const { unmount } = render(
      <AuthProvider>
        <div />
      </AuthProvider>,
    )
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalled()
  })
})
