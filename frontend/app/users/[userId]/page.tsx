type Props = {
  params: Promise<{ userId: string }>
}

export default async function UserDetailPage({ params }: Props) {
  const { userId } = await params

  return (
    <main>
      <h1>ユーザー詳細: {userId}</h1>
    </main>
  )
}
