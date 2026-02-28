type Props = {
  params: Promise<{ userId: string }>
}

export default async function UserEditPage({ params }: Props) {
  const { userId } = await params

  return (
    <main>
      <h1>ユーザー情報編集: {userId}</h1>
    </main>
  )
}
