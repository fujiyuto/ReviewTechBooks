import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BookDetail } from '@/components/features/books/BookDetail'
import type { components } from '@/types/api'

type BookDetailType = components['schemas']['BookDetail']

const baseBook: BookDetailType = {
  id: 1,
  title: 'テスト技術書',
  subtitle: 'サブタイトル',
  author: 'テスト著者',
  publishedBy: 'テスト出版社',
  numberOfPages: 300,
  releaseDate: '2024-01-01',
  includeTaxPrice: 3300,
  description: 'テスト説明文',
  thumbnailUrl: 'https://example.com/thumb.jpg',
}

describe('BookDetail', () => {
  it('タイトルが表示される', () => {
    render(<BookDetail book={baseBook} />)
    screen.getByText('テスト技術書')
  })

  it('サムネイルURLがある場合imgが表示される', () => {
    const { container } = render(<BookDetail book={baseBook} />)
    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img!.src).toBe('https://example.com/thumb.jpg')
  })

  it('サムネイルURLがない場合フォールバックdivが表示される', () => {
    const { container } = render(
      <BookDetail book={{ ...baseBook, thumbnailUrl: undefined }} />,
    )
    expect(container.querySelector('img')).toBeNull()
    const fallback = container.querySelector(
      'div.aspect-\\[3\\/4\\].bg-surface-overlay',
    )
    expect(fallback).not.toBeNull()
  })

  it('著者が表示される', () => {
    render(<BookDetail book={baseBook} />)
    screen.getByText('テスト著者')
  })

  it('出版社が表示される', () => {
    render(<BookDetail book={baseBook} />)
    screen.getByText('テスト出版社')
  })

  it('ページ数が表示される', () => {
    render(<BookDetail book={baseBook} />)
    screen.getByText('300 ページ')
  })

  it('発売日が表示される', () => {
    render(<BookDetail book={baseBook} />)
    screen.getByText('2024-01-01')
  })

  it('税込価格が表示される', () => {
    render(<BookDetail book={baseBook} />)
    screen.getByText('¥3,300')
  })

  it('説明が表示される', () => {
    render(<BookDetail book={baseBook} />)
    screen.getByText('テスト説明文')
  })

  it('著者がない場合は著者欄が表示されない', () => {
    render(<BookDetail book={{ ...baseBook, author: undefined }} />)
    expect(screen.queryByText('著者')).toBeNull()
  })

  it('出版社がない場合は出版社欄が表示されない', () => {
    render(<BookDetail book={{ ...baseBook, publishedBy: undefined }} />)
    expect(screen.queryByText('出版社')).toBeNull()
  })

  it('ページ数がない場合はページ数欄が表示されない', () => {
    render(<BookDetail book={{ ...baseBook, numberOfPages: undefined }} />)
    expect(screen.queryByText('ページ数')).toBeNull()
  })

  it('発売日がない場合は発売日欄が表示されない', () => {
    render(<BookDetail book={{ ...baseBook, releaseDate: undefined }} />)
    expect(screen.queryByText('発売日')).toBeNull()
  })

  it('価格がない場合は価格欄が表示されない', () => {
    render(<BookDetail book={{ ...baseBook, includeTaxPrice: undefined }} />)
    expect(screen.queryByText('税込価格')).toBeNull()
  })

  it('説明がない場合は説明が表示されない', () => {
    render(<BookDetail book={{ ...baseBook, description: undefined }} />)
    expect(screen.queryByText('テスト説明文')).toBeNull()
  })
})
