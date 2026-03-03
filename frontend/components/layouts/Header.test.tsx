import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '@/components/layouts/Header'

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  )
}

describe('Header', () => {
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

  it('renders a header element', () => {
    const { container } = renderHeader()
    expect(container.querySelector('header')).not.toBeNull()
  })
})
