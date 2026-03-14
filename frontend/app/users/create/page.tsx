import { RegisterForm } from '@/components/features/auth/RegisterForm'

/** ユーザー登録ページ */
export default function UserCreatePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-raised px-4 py-12">
      <RegisterForm />
    </main>
  )
}
