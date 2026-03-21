import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Textarea } from '@/components/ui/Textarea'

describe('Textarea', () => {
  it('デフォルトクラスが適用されている', () => {
    const { container } = render(<Textarea />)
    const el = container.querySelector('textarea')!
    expect(el.className).toContain('rounded-md')
    expect(el.className).toContain('border')
    expect(el.className).toContain('resize-none')
  })

  it('className で追加クラスを指定できる', () => {
    const { container } = render(<Textarea className="h-32" />)
    const el = container.querySelector('textarea')!
    expect(el.className).toContain('h-32')
  })

  it('disabled 属性が反映される', () => {
    const { container } = render(<Textarea disabled />)
    const el = container.querySelector('textarea') as HTMLTextAreaElement
    expect(el.disabled).toBe(true)
  })

  it('placeholder が表示される', () => {
    render(<Textarea placeholder="自己紹介文を入力（任意）" />)
    expect(screen.getByPlaceholderText('自己紹介文を入力（任意）')).toBeTruthy()
  })
})
