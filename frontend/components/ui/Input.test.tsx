import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Input } from '@/components/ui/Input'

describe('Input', () => {
  it('renders an input element', () => {
    const { container } = render(<Input />)
    expect(container.querySelector('input')).not.toBeNull()
  })

  it('renders with placeholder', () => {
    const { container } = render(<Input placeholder="書籍名を入力" />)
    const input = container.querySelector('input')!
    expect(input.placeholder).toBe('書籍名を入力')
  })

  it('reflects value prop', () => {
    const { container } = render(<Input value="テスト" onChange={() => {}} />)
    const input = container.querySelector('input')!
    expect(input.value).toBe('テスト')
  })

  it('calls onChange when value changes', () => {
    const onChange = vi.fn()
    const { container } = render(<Input onChange={onChange} />)
    const input = container.querySelector('input')!
    fireEvent.change(input, { target: { value: '新しい値' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('merges custom className with base classes', () => {
    const { container } = render(<Input className="w-full" />)
    const input = container.querySelector('input')!
    expect(input.className).toContain('w-full')
    expect(input.className).toContain('rounded-md')
  })

  it('passes through type attribute', () => {
    const { container } = render(<Input type="email" />)
    const input = container.querySelector('input')!
    expect(input.type).toBe('email')
  })
})
