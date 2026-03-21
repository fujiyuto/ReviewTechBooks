import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '@/components/layouts/Header'

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

vi.mock('@/hooks/useLogout', () => ({
  useLogout: vi.fn(),
}))

import { useAuth } from '@/hooks/useAuth'
import { useLogout } from '@/hooks/useLogout'

const mockLogout = vi.fn()

/** MemoryRouter でラップしてヘッダーをレンダリングするヘルパー */
function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  )
}

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useLogout).mockReturnValue({
      isLoading: false,
      error: null,
      logout: mockLogout,
    })
  })

  describe('未ログイン時', () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue({
        isLoggedIn: false,
        isLoading: false,
      })
    })

    it('renders the site logo linked to /', () => {
      const { container } = renderHeader()
      const logoLink = Array.from(container.querySelectorAll('a')).find(
        (a) => a.getAttribute('href') === '/',
      )
      expect(logoLink).not.toBeUndefined()
      expect(logoLink!.textContent).toBe('ReviewTechBooks')
    })

    it('renders a navigation link to /books', () => {
      const { container } = renderHeader()
      const booksLink = Array.from(container.querySelectorAll('a')).find(
        (a) => a.getAttribute('href') === '/books',
      )
      expect(booksLink).not.toBeUndefined()
      expect(booksLink!.textContent).toBe('書籍一覧')
    })

    it('renders a login link to /users/login', () => {
      const { container } = renderHeader()
      const loginLink = Array.from(container.querySelectorAll('a')).find(
        (a) => a.getAttribute('href') === '/users/login',
      )
      expect(loginLink).not.toBeUndefined()
      expect(loginLink!.textContent).toBe('ログイン')
    })

    it('renders a sign-up link to /users/create', () => {
      const { container } = renderHeader()
      const createLink = Array.from(container.querySelectorAll('a')).find(
        (a) => a.getAttribute('href') === '/users/create',
      )
      expect(createLink).not.toBeUndefined()
      expect(createLink!.textContent).toBe('新規登録')
    })

    it('does not render a logout button', () => {
      const { queryByText } = renderHeader()
      expect(queryByText('ログアウト')).toBeNull()
    })

    it('renders a header element', () => {
      const { container } = renderHeader()
      expect(container.querySelector('header')).not.toBeNull()
    })
  })

  describe('ログイン時', () => {
    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue({ isLoggedIn: true, isLoading: false })
    })

    it('renders a logout button', () => {
      const { getByText } = renderHeader()
      expect(getByText('ログアウト')).not.toBeNull()
    })

    it('does not render login link', () => {
      const { queryByText } = renderHeader()
      expect(queryByText('ログイン')).toBeNull()
    })

    it('does not render sign-up link', () => {
      const { queryByText } = renderHeader()
      expect(queryByText('新規登録')).toBeNull()
    })

    it('calls logout when logout button is clicked', () => {
      const { getByText } = renderHeader()
      fireEvent.click(getByText('ログアウト'))
      expect(mockLogout).toHaveBeenCalled()
    })
  })
})
