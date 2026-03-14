import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import { LoginForm } from '@/components/features/auth/LoginForm'

const mockLogin = vi.fn()
const mockLoginWithGoogle = vi.fn()

const defaultHookValue = {
  isLoading: false,
  error: null,
  login: mockLogin,
  loginWithGoogle: mockLoginWithGoogle,
}

vi.mock('@/hooks/useLogin', () => ({
  useLogin: vi.fn(),
}))

import { useLogin } from '@/hooks/useLogin'

const mockUseLogin = vi.mocked(useLogin)

/** MemoryRouter でラップしてレンダリングするヘルパー */
function renderForm() {
  return render(
    React.createElement(MemoryRouter, null, React.createElement(LoginForm)),
  )
}

/** フォームに値を入力してサブミットするヘルパー */
async function fillAndSubmit(email: string, password: string) {
  fireEvent.change(screen.getByLabelText('メールアドレス'), {
    target: { value: email },
  })
  fireEvent.change(screen.getByLabelText('パスワード'), {
    target: { value: password },
  })
  fireEvent.submit(screen.getByText('ログインする').closest('form')!)
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseLogin.mockReturnValue(defaultHookValue)
  })

  it('メールアドレスのバリデーションエラー表示', async () => {
    renderForm()
    await fillAndSubmit('invalid-email', 'password123')
    await waitFor(() => {
      expect(
        screen.getByText('有効なメールアドレスを入力してください'),
      ).toBeTruthy()
    })
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('パスワードのバリデーションエラー表示', async () => {
    renderForm()
    await fillAndSubmit('test@example.com', '')
    await waitFor(() => {
      expect(screen.getByText('パスワードを入力してください')).toBeTruthy()
    })
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('メールアドレスとパスワードでのログイン処理', async () => {
    mockLogin.mockResolvedValue(undefined)
    renderForm()
    await fillAndSubmit('test@example.com', 'password123')
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('Google でログインボタン押下時', () => {
    renderForm()
    fireEvent.click(screen.getByText('Google でログイン'))
    expect(mockLoginWithGoogle).toHaveBeenCalledTimes(1)
  })

  it('ログイン処理でエラーが返った時の表示', () => {
    mockUseLogin.mockReturnValue({
      ...defaultHookValue,
      error: 'メールアドレスまたはパスワードが正しくありません',
    })
    renderForm()
    expect(
      screen.getByText('メールアドレスまたはパスワードが正しくありません'),
    ).toBeTruthy()
  })

  it('shows ログイン中... and disables buttons when isLoading=true', () => {
    mockUseLogin.mockReturnValue({ ...defaultHookValue, isLoading: true })
    renderForm()
    expect(screen.getByText('ログイン中...')).toBeTruthy()
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect((btn as HTMLButtonElement).disabled).toBe(true)
    })
  })
})
