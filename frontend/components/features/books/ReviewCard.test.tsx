import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReviewCard } from '@/components/features/books/ReviewCard'
import type { components } from '@/types/api'

type Review = components['schemas']['Review']

const baseReview: Review = {
  id: 1,
  title: 'テストレビュータイトル',
  content: 'テストレビュー本文',
  user: { id: 10, username: 'testuser' },
  categories: [
    { id: 1, name: '入門', order: 1 },
    { id: 2, name: '実践', order: 2 },
  ],
  createdAt: '2024-06-15T12:00:00Z',
}

describe('ReviewCard', () => {
  it('タイトルが表示される', () => {
    render(<ReviewCard review={baseReview} />)
    screen.getByText('テストレビュータイトル')
  })

  it('タイトルがnullの場合「無題」が表示される', () => {
    render(<ReviewCard review={{ ...baseReview, title: undefined }} />)
    screen.getByText('無題')
  })

  it('ユーザー名が表示される', () => {
    render(<ReviewCard review={baseReview} />)
    screen.getByText('testuser')
  })

  it('ユーザー名がない場合は表示されない', () => {
    render(<ReviewCard review={{ ...baseReview, user: { id: 10 } }} />)
    expect(screen.queryByText('testuser')).toBeNull()
  })

  it('カテゴリがある場合バッジが表示される', () => {
    render(<ReviewCard review={baseReview} />)
    screen.getByText('入門')
    screen.getByText('実践')
  })

  it('カテゴリがない場合バッジは表示されない', () => {
    render(<ReviewCard review={{ ...baseReview, categories: [] }} />)
    expect(screen.queryByText('入門')).toBeNull()
  })

  it('本文が表示される', () => {
    render(<ReviewCard review={baseReview} />)
    screen.getByText('テストレビュー本文')
  })

  it('投稿日が日本語フォーマットで表示される', () => {
    render(<ReviewCard review={baseReview} />)
    const expected = new Date('2024-06-15T12:00:00Z').toLocaleDateString(
      'ja-JP',
    )
    screen.getByText(expected)
  })

  it('投稿日がない場合は表示されない', () => {
    render(<ReviewCard review={{ ...baseReview, createdAt: undefined }} />)
    const expected = new Date('2024-06-15T12:00:00Z').toLocaleDateString(
      'ja-JP',
    )
    expect(screen.queryByText(expected)).toBeNull()
  })
})
