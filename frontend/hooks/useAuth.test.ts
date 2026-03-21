import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import React from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import { useAuth } from '@/hooks/useAuth'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}))

describe('useAuth', () => {
  it('returns isLoggedIn and isLoading from AuthContext', () => {
    const value = { isLoggedIn: true, isLoading: false }
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(AuthContext.Provider, { value }, children)
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.isLoggedIn).toBe(true)
    expect(result.current.isLoading).toBe(false)
  })

  it('throws error when called outside AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within AuthProvider',
    )
  })
})
