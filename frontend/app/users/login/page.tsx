import { LoginForm } from '@/components/features/auth/LoginForm'

/** ユーザーログインページ */
export default function UserLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-raised px-4 py-12">
      <LoginForm />
    </main>
  )
}
