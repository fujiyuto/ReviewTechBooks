import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BookCard } from '@/components/features/books/BookCard'
import type { BookSummary } from '@/api/books'

const baseBook: BookSummary = {
  id: 1,
  title: 'テスト技術書',
  author: 'テスト著者',
  publishedBy: 'テスト出版社',
  thumbnailUrl: 'https://example.com/thumb.jpg',
}

function renderBookCard(book: BookSummary) {
  return render(
    <MemoryRouter>
      <BookCard book={book} />
    </MemoryRouter>,
  )
}

describe('BookCard', () => {
  it('renders book title', () => {
    renderBookCard(baseBook)
    screen.getByText('テスト技術書')
  })

  it('renders author name', () => {
    renderBookCard(baseBook)
    screen.getByText('テスト著者')
  })

  it('renders publisher name', () => {
    renderBookCard(baseBook)
    screen.getByText('テスト出版社')
  })

  it('hides author element when author is empty string', () => {
    renderBookCard({ ...baseBook, author: '' })
    expect(screen.queryByText('テスト著者')).toBeNull()
  })

  it('hides publisher element when publishedBy is empty string', () => {
    renderBookCard({ ...baseBook, publishedBy: '' })
    expect(screen.queryByText('テスト出版社')).toBeNull()
  })

  it('shows thumbnail image when thumbnailUrl is provided', () => {
    const { container } = renderBookCard(baseBook)
    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img!.src).toBe('https://example.com/thumb.jpg')
    expect(img!.alt).toBe('テスト技術書')
  })

  it('shows "No Image" text when thumbnailUrl is undefined', () => {
    renderBookCard({ ...baseBook, thumbnailUrl: undefined })
    screen.getByText('No Image')
  })

  it('links to the correct book detail page', () => {
    const { container } = renderBookCard({ ...baseBook, id: 42 })
    const link = container.querySelector('a')
    expect(link!.getAttribute('href')).toBe('/books/42')
  })

  it('shows "タイトル不明" when title is undefined', () => {
    renderBookCard({ ...baseBook, title: undefined })
    screen.getByText('タイトル不明')
  })

  it('links to /books/0 when id is undefined', () => {
    const { container } = renderBookCard({ ...baseBook, id: undefined })
    const link = container.querySelector('a')
    expect(link!.getAttribute('href')).toBe('/books/0')
  })
})
