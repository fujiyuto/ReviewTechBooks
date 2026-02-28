type Props = {
  params: Promise<{ reviewId: string }>
}

export default async function ReviewEditPage({ params }: Props) {
  const { reviewId } = await params

  return (
    <main>
      <h1>レビュー編集: {reviewId}</h1>
    </main>
  )
}
