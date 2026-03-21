import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import { RegisterButtonList } from '@/components/features/auth/RegisterButtonList'

const mockRegisterWithGoogle = vi.fn()

const defaultHookValue = {
  isLoading: false,
  error: null,
  register: vi.fn(),
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
    React.createElement(
      MemoryRouter,
      null,
      React.createElement(RegisterButtonList),
    ),
  )
}

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseRegister.mockReturnValue(defaultHookValue)
  })

  it('「Google で登録」ボタン押下で registerWithGoogle が呼ばれる', () => {
    renderForm()
    fireEvent.click(screen.getByText('Google で登録'))
    expect(mockRegisterWithGoogle).toHaveBeenCalledTimes(1)
  })

  it('「メールアドレスで登録」ボタンが /users/create/email へのリンクになっている', () => {
    renderForm()
    const link = screen.getByText('メールアドレスで登録').closest('a')
    expect(link).toBeTruthy()
    expect(link?.getAttribute('href')).toBe('/users/create/email')
  })

  it('error があるとエラーメッセージが表示される', () => {
    mockUseRegister.mockReturnValue({
      ...defaultHookValue,
      error: 'Google 登録に失敗しました',
    })
    renderForm()
    expect(screen.getByText('Google 登録に失敗しました')).toBeTruthy()
  })

  it('isLoading=true 時にボタンが無効化される', () => {
    mockUseRegister.mockReturnValue({ ...defaultHookValue, isLoading: true })
    renderForm()
    const buttons = screen.getAllByRole('button')
    buttons.forEach((btn) => {
      expect((btn as HTMLButtonElement).disabled).toBe(true)
    })
  })
})
