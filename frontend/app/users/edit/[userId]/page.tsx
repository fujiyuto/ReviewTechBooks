import { useParams } from 'react-router-dom'

export default function UserEditPage() {
  const { userId } = useParams<{ userId: string }>()

  return (
    <main>
      <h1>ユーザー情報編集: {userId}</h1>
    </main>
  )
}
