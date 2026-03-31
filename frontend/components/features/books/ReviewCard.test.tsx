import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ReviewCard } from '@/components/features/books/ReviewCard'
import type { components } from '@/types/api'

type Review = components['schemas']['Review']

const baseReview: Review = {
  id: 1,
  title: 'テストレビュータイトル',
  content: 'テストレビュー本文',
  user: { id: 10, username: 'testuser' },
  categories: [
    { id: 1, name: '入門', sortOrder: 1 },
    { id: 2, name: '実践', sortOrder: 2 },
  ],
  createdAt: '2024-06-15T12:00:00Z',
}

describe('ReviewCard', () => {
  it('タイトルが表示される', () => {
    render(
      <MemoryRouter>
        <ReviewCard review={baseReview} />
      </MemoryRouter>,
    )
    screen.getByText('テストレビュータイトル')
  })

  it('タイトルがnullの場合「無題」が表示される', () => {
    render(
      <MemoryRouter>
        <ReviewCard review={{ ...baseReview, title: undefined }} />
      </MemoryRouter>,
    )
    screen.getByText('無題')
  })

  it('ユーザー名が表示される', () => {
    render(
      <MemoryRouter>
        <ReviewCard review={baseReview} />
      </MemoryRouter>,
    )
    screen.getByText('testuser')
  })

  it('ユーザー名がない場合は「匿名ユーザー」が表示される', () => {
    render(
      <MemoryRouter>
        <ReviewCard review={{ ...baseReview, user: { id: 10 } }} />
      </MemoryRouter>,
    )
    expect(screen.queryByText('testuser')).toBeNull()
    screen.getByText('匿名ユーザー')
  })

  it('ユーザー名のイニシャルが表示される', () => {
    render(
      <MemoryRouter>
        <ReviewCard review={baseReview} />
      </MemoryRouter>,
    )
    screen.getByText('T')
  })

  it('ユーザー名がユーザー詳細画面へのリンクになっている', () => {
    render(
      <MemoryRouter>
        <ReviewCard review={baseReview} />
      </MemoryRouter>,
    )
    const link = screen.getByRole('link', { name: /testuser/ })
    expect(link.getAttribute('href')).toBe('/users/10')
  })

  it('カテゴリがある場合バッジが表示される', () => {
    render(
      <MemoryRouter>
        <ReviewCard review={baseReview} />
      </MemoryRouter>,
    )
    screen.getByText('入門')
    screen.getByText('実践')
  })

  it('カテゴリがない場合バッジは表示されない', () => {
    render(
      <MemoryRouter>
        <ReviewCard review={{ ...baseReview, categories: [] }} />
      </MemoryRouter>,
    )
    expect(screen.queryByText('入門')).toBeNull()
  })

  it('本文が表示される', () => {
    render(
      <MemoryRouter>
        <ReviewCard review={baseReview} />
      </MemoryRouter>,
    )
    screen.getByText('テストレビュー本文')
  })

  it('投稿日が日本語フォーマットで表示される', () => {
    render(
      <MemoryRouter>
        <ReviewCard review={baseReview} />
      </MemoryRouter>,
    )
    const expected = new Date('2024-06-15T12:00:00Z').toLocaleDateString(
      'ja-JP',
    )
    screen.getByText(expected)
  })

  it('投稿日がない場合は表示されない', () => {
    render(
      <MemoryRouter>
        <ReviewCard review={{ ...baseReview, createdAt: undefined }} />
      </MemoryRouter>,
    )
    const expected = new Date('2024-06-15T12:00:00Z').toLocaleDateString(
      'ja-JP',
    )
    expect(screen.queryByText(expected)).toBeNull()
  })
})
