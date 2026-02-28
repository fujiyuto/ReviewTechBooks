type Props = {
  params: Promise<{ bookId: string }>
}

export default async function BookDetailPage({ params }: Props) {
  const { bookId } = await params

  return (
    <main>
      <h1>書籍詳細: {bookId}</h1>
    </main>
  )
}
