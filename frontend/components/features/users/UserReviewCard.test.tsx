import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserReviewCard } from '@/components/features/users/UserReviewCard'
import type { components } from '@/types/api'

type UserReview = components['schemas']['UserReview']

const baseReview: UserReview = {
  id: 1,
  book: {
    id: 1,
    title: 'テスト書籍',
    thumbnailUrl: 'https://example.com/thumb.jpg',
  },
  title: 'テストレビュータイトル',
  content: 'テストレビュー本文',
  categories: [
    { id: 1, name: '入門', sortOrder: 1 },
    { id: 2, name: '実践', sortOrder: 2 },
  ],
  createdAt: '2024-06-15T12:00:00Z',
}

describe('UserReviewCard', () => {
  it('レビュータイトルが表示される', () => {
    render(<UserReviewCard review={baseReview} />)
    screen.getByText('テストレビュータイトル')
  })

  it('タイトルがない場合「無題」が表示される', () => {
    render(<UserReviewCard review={{ ...baseReview, title: undefined }} />)
    screen.getByText('無題')
  })

  it('書籍タイトルが表示される', () => {
    render(<UserReviewCard review={baseReview} />)
    screen.getByText('テスト書籍')
  })

  it('書籍タイトルがない場合は表示されない', () => {
    render(<UserReviewCard review={{ ...baseReview, book: { id: 1 } }} />)
    expect(screen.queryByText('テスト書籍')).toBeNull()
  })

  it('書籍サムネイルが表示される', () => {
    render(<UserReviewCard review={baseReview} />)
    const img = screen.getByRole('img')
    expect(img).toBeTruthy()
  })

  it('書籍サムネイルがない場合はプレースホルダーが表示される', () => {
    render(
      <UserReviewCard
        review={{ ...baseReview, book: { id: 1, title: 'テスト書籍' } }}
      />,
    )
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('カテゴリがある場合バッジが表示される', () => {
    render(<UserReviewCard review={baseReview} />)
    screen.getByText('入門')
    screen.getByText('実践')
  })

  it('カテゴリがない場合バッジは表示されない', () => {
    render(<UserReviewCard review={{ ...baseReview, categories: [] }} />)
    expect(screen.queryByText('入門')).toBeNull()
  })

  it('本文が表示される', () => {
    render(<UserReviewCard review={baseReview} />)
    screen.getByText('テストレビュー本文')
  })

  it('本文がない場合は表示されない', () => {
    render(<UserReviewCard review={{ ...baseReview, content: undefined }} />)
    expect(screen.queryByText('テストレビュー本文')).toBeNull()
  })

  it('投稿日が日本語フォーマットで表示される', () => {
    render(<UserReviewCard review={baseReview} />)
    const expected = new Date('2024-06-15T12:00:00Z').toLocaleDateString(
      'ja-JP',
    )
    screen.getByText(expected)
  })

  it('投稿日がない場合は表示されない', () => {
    render(<UserReviewCard review={{ ...baseReview, createdAt: undefined }} />)
    const expected = new Date('2024-06-15T12:00:00Z').toLocaleDateString(
      'ja-JP',
    )
    expect(screen.queryByText(expected)).toBeNull()
  })
})
