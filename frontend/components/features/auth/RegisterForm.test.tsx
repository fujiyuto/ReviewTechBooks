import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import { RegisterForm } from '@/components/features/auth/RegisterForm'

const mockRegister = vi.fn()
const mockRegisterWithGoogle = vi.fn()

const defaultHookValue = {
  isLoading: false,
  error: null,
  register: mockRegister,
  registerWithGoogle: mockRegisterWithGoogle,
}

vi.mock('@/hooks/useRegister', () => ({
  useRegister: vi.fn(),
}))

import { useRegister } from '@/hooks/useRegister'

const mockUseRegister = vi.mocked(useRegister)

/** MemoryRouter でラップしてレンダリングするヘルパー */
function renderForm() {
  return render(
    React.createElement(MemoryRouter, null, React.createElement(RegisterForm)),
  )
}

/** フォームに値を入力してサブミットするヘルパー */
async function fillAndSubmit(
  email: string,
  password: string,
  confirmPassword: string,
) {
  fireEvent.change(screen.getByLabelText('メールアドレス'), {
    target: { value: email },
  })
  fireEvent.change(screen.getByLabelText('パスワード'), {
    target: { value: password },
  })
  fireEvent.change(screen.getByLabelText('パスワード（確認）'), {
    target: { value: confirmPassword },
  })
  fireEvent.submit(screen.getByText('登録する').closest('form')!)
}

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseRegister.mockReturnValue(defaultHookValue)
  })

  it('メールアドレスのバリデーションエラー表示', async () => {
    renderForm()
    await fillAndSubmit('invalid-email', 'password123', 'password123')
    await waitFor(() => {
      expect(
        screen.getByText('有効なメールアドレスを入力してください'),
      ).toBeTruthy()
    })
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('パスワードのバリデーションエラー表示', async () => {
    renderForm()
    await fillAndSubmit('test@example.com', 'short', 'short')
    await waitFor(() => {
      expect(
        screen.getByText('パスワードは8文字以上で入力してください'),
      ).toBeTruthy()
    })
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('パスワードが確認用と一致しない時のバリデーションエラー表示', async () => {
    renderForm()
    await fillAndSubmit('test@example.com', 'password123', 'different')
    await waitFor(() => {
      expect(screen.getByText('パスワードが一致しません')).toBeTruthy()
    })
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('メールアドレスとパスワードでの登録処理', async () => {
    mockRegister.mockResolvedValue(undefined)
    renderForm()
    await fillAndSubmit('test@example.com', 'password123', 'password123')
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      )
    })
  })

  it('Googleで登録ボタン押下時', () => {
    renderForm()
    fireEvent.click(screen.getByText('Google で登録'))
    expect(mockRegisterWithGoogle).toHaveBeenCalledTimes(1)
  })

  it('登録処理でエラーが返った時の表示', () => {
    mockUseRegister.mockReturnValue({
      ...defaultHookValue,
      error: 'メールアドレスは既に使用されています',
    })
    renderForm()
    expect(
      screen.getByText('メールアドレスは既に使用されています'),
    ).toBeTruthy()
  })

  it('shows 登録中... and disables buttons when isLoading=true', () => {
    mockUseRegister.mockReturnValue({ ...defaultHookValue, isLoading: true })
    renderForm()
    expect(screen.getByText('登録中...')).toBeTruthy()
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect((btn as HTMLButtonElement).disabled).toBe(true)
    })
  })
})
