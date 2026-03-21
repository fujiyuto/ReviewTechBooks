import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import { RegisterOnboardingForm } from '@/components/features/auth/RegisterOnboardingForm'

const mockCompleteOnboarding = vi.fn()

const defaultHookValue = {
  isLoading: false,
  error: null,
  completeOnboarding: mockCompleteOnboarding,
}

vi.mock('@/hooks/useOnboarding', () => ({
  useOnboarding: vi.fn(),
}))

import { useOnboarding } from '@/hooks/useOnboarding'

const mockUseOnboarding = vi.mocked(useOnboarding)

/** MemoryRouter でラップしてレンダリングするヘルパー */
function renderForm() {
  return render(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(RegisterOnboardingForm),
    ),
  )
}

describe('RegisterOAuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseOnboarding.mockReturnValue(defaultHookValue)
  })

  it('ユーザー名のバリデーションエラー表示', async () => {
    renderForm()
    fireEvent.change(screen.getByLabelText('ユーザー名'), {
      target: { value: '' },
    })
    fireEvent.submit(screen.getByText('設定する').closest('form')!)
    await waitFor(() => {
      expect(screen.getByText('ユーザー名を入力してください')).toBeTruthy()
    })
    expect(mockCompleteOnboarding).not.toHaveBeenCalled()
  })

  it('自己紹介文フィールドが表示される', () => {
    renderForm()
    expect(screen.getByLabelText('自己紹介文')).toBeTruthy()
    expect(screen.getByPlaceholderText('自己紹介文を入力（任意）')).toBeTruthy()
  })

  it('正常送信時に completeOnboarding が (userName, bio) で呼ばれる', async () => {
    mockCompleteOnboarding.mockResolvedValue(undefined)
    renderForm()
    fireEvent.change(screen.getByLabelText('ユーザー名'), {
      target: { value: 'テストユーザー' },
    })
    fireEvent.change(screen.getByLabelText('自己紹介文'), {
      target: { value: '自己紹介文です' },
    })
    fireEvent.submit(screen.getByText('設定する').closest('form')!)
    await waitFor(() => {
      expect(mockCompleteOnboarding).toHaveBeenCalledWith(
        'テストユーザー',
        '自己紹介文です',
      )
    })
  })

  it('error 時にエラーメッセージが表示される', () => {
    mockUseOnboarding.mockReturnValue({
      ...defaultHookValue,
      error: 'ユーザー名の設定に失敗しました',
    })
    renderForm()
    expect(screen.getByText('ユーザー名の設定に失敗しました')).toBeTruthy()
  })

  it('isLoading=true 時にボタン無効化と「設定中...」表示', () => {
    mockUseOnboarding.mockReturnValue({ ...defaultHookValue, isLoading: true })
    renderForm()
    expect(screen.getByText('設定中...')).toBeTruthy()
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect((btn as HTMLButtonElement).disabled).toBe(true)
    })
  })
})
