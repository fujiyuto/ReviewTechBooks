import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '@/components/ui/Pagination'

describe('Pagination', () => {
  it('現在のページ番号が表示される', () => {
    render(
      <Pagination
        currentPage={3}
        hasNext={true}
        hasPrev={true}
        onPageChange={vi.fn()}
      />,
    )
    screen.getByText('3 ページ')
  })

  it('hasPrevがfalseのとき、前へボタンが非活性で表示される', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        hasNext={true}
        hasPrev={false}
        onPageChange={vi.fn()}
      />,
    )
    const buttons = container.querySelectorAll('button')
    const prevButton = Array.from(buttons).find(
      (button) => button.textContent === '前へ',
    )
    expect(prevButton).toBeDefined()
    expect(prevButton!.disabled).toBe(true)
  })

  it('hasNextがfalseのとき、次へボタンが非活性で表示される', () => {
    const { container } = render(
      <Pagination
        currentPage={5}
        hasNext={false}
        hasPrev={true}
        onPageChange={vi.fn()}
      />,
    )
    const buttons = container.querySelectorAll('button')
    const nextButton = Array.from(buttons).find(
      (button) => button.textContent === '次へ',
    )
    expect(nextButton).toBeDefined()
    expect(nextButton!.disabled).toBe(true)
  })

  it('前へボタンクリックでonPageChange(currentPage - 1)が呼ばれる', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        currentPage={3}
        hasNext={true}
        hasPrev={true}
        onPageChange={onPageChange}
      />,
    )
    fireEvent.click(screen.getByText('前へ'))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('次へボタンクリックでonPageChange(currentPage + 1)が呼ばれる', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        currentPage={3}
        hasNext={true}
        hasPrev={true}
        onPageChange={onPageChange}
      />,
    )
    fireEvent.click(screen.getByText('次へ'))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })
})
