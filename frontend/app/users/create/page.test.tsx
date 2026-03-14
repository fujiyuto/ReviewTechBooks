import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'

vi.mock('@/components/features/auth/RegisterForm', () => ({
  RegisterForm: () =>
    React.createElement(
      'div',
      { 'data-testid': 'register-form' },
      'RegisterForm',
    ),
}))

import UserCreatePage from '@/app/users/create/page'

describe('UserCreatePage', () => {
  it('renders RegisterForm', () => {
    render(
      React.createElement(
        MemoryRouter,
        null,
        React.createElement(UserCreatePage),
      ),
    )
    expect(screen.getByTestId('register-form')).toBeTruthy()
  })
})
