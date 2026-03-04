import { useParams } from 'react-router-dom'

export default function ReviewEditPage() {
  const { reviewId } = useParams<{ reviewId: string }>()

  return (
    <main>
      <h1>レビュー編集: {reviewId}</h1>
    </main>
  )
}
