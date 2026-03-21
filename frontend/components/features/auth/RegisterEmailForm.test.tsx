import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import { RegisterEmailForm } from '@/components/features/auth/RegisterEmailForm'

const mockRegister = vi.fn()

const defaultHookValue = {
  isLoading: false,
  error: null,
  register: mockRegister,
  registerWithGoogle: vi.fn(),
}

vi.mock('@/hooks/useRegister', () => ({
  useRegister: vi.fn(),
}))

import { useRegister } from '@/hooks/useRegister'

const mockUseRegister = vi.mocked(useRegister)

/** MemoryRouter でラップしてレンダリングするヘルパー */
function renderForm() {
  return render(
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(RegisterEmailForm),
    ),
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

describe('RegisterEmailForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseRegister.mockReturnValue(defaultHookValue)
  })

  it('メールアドレスのバリデーションエラー表示', async () => {
    renderForm()
    await fillAndSubmit('invalid-email', 'Password1!', 'Password1!')
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
        screen.getByText(
          '8~64文字で大文字、小文字、数字、特殊文字（!@#等）を1文字以上含めてください',
        ),
      ).toBeTruthy()
    })
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('パスワード不一致のバリデーションエラー表示', async () => {
    renderForm()
    await fillAndSubmit('test@example.com', 'Password1!', 'Different1!')
    await waitFor(() => {
      expect(screen.getByText('パスワードが一致しません')).toBeTruthy()
    })
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('正常送信時に register が (email, password) で呼ばれる', async () => {
    mockRegister.mockResolvedValue(undefined)
    renderForm()
    await fillAndSubmit('test@example.com', 'Password1!', 'Password1!')
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        'test@example.com',
        'Password1!',
      )
    })
  })

  it('error 時にエラーメッセージが表示される', () => {
    mockUseRegister.mockReturnValue({
      ...defaultHookValue,
      error: 'メールアドレスは既に使用されています',
    })
    renderForm()
    expect(
      screen.getByText('メールアドレスは既に使用されています'),
    ).toBeTruthy()
  })

  it('isLoading=true 時にボタン無効化と「登録中...」表示', () => {
    mockUseRegister.mockReturnValue({ ...defaultHookValue, isLoading: true })
    renderForm()
    expect(screen.getByText('登録中...')).toBeTruthy()
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect((btn as HTMLButtonElement).disabled).toBe(true)
    })
  })
})
