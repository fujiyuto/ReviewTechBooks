import { RegisterOnboardingForm } from '@/components/features/auth/RegisterOnboardingForm'

/** Google OAuth 後のユーザー名設定ページ */
export default function UserOnboardingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-raised px-4 py-12">
      <RegisterOnboardingForm />
    </main>
  )
}
