import { useParams } from 'react-router-dom'

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>()

  return (
    <main>
      <h1>ユーザー詳細: {userId}</h1>
    </main>
  )
}
