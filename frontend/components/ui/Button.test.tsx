import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>テスト</Button>)
    screen.getByText('テスト')
  })

  it('applies primary variant classes by default', () => {
    const { container } = render(<Button>ボタン</Button>)
    const btn = container.querySelector('button')!
    expect(btn.className).toContain('bg-primary-600')
  })

  it('applies outline variant classes', () => {
    const { container } = render(<Button variant="outline">ボタン</Button>)
    const btn = container.querySelector('button')!
    expect(btn.className).toContain('border-surface-border')
  })

  it('merges custom className', () => {
    const { container } = render(<Button className="px-10">ボタン</Button>)
    const btn = container.querySelector('button')!
    expect(btn.className).toContain('px-10')
  })

  it('calls onClick handler when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>クリック</Button>)
    fireEvent.click(screen.getByText('クリック'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const onClick = vi.fn()
    const { container } = render(
      <Button disabled onClick={onClick}>
        ボタン
      </Button>,
    )
    const btn = container.querySelector('button')!
    expect(btn.disabled).toBe(true)
  })

  it('renders as submit button when type="submit"', () => {
    const { container } = render(<Button type="submit">送信</Button>)
    const btn = container.querySelector('button')!
    expect(btn.type).toBe('submit')
  })
})
