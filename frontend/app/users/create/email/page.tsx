import { RegisterEmailForm } from '@/components/features/auth/RegisterEmailForm'

/** メールアドレスでのユーザー登録ページ */
export default function UserCreateEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-raised px-4 py-12">
      <RegisterEmailForm />
    </main>
  )
}
