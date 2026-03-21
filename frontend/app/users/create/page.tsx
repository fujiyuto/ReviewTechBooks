import { RegisterButtonList } from '@/components/features/auth/RegisterButtonList'

/** ユーザー登録ページ */
export default function UserCreatePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-raised px-4 py-12">
      <RegisterButtonList />
    </main>
  )
}
