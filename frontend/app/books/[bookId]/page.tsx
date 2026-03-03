import { useParams } from 'react-router-dom'

/** 書籍詳細ページ */
export default function BookDetailPage() {
  const { bookId } = useParams<{ bookId: string }>()

  return (
    <main>
      <h1>書籍詳細: {bookId}</h1>
    </main>
  )
}
