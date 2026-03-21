import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useLogout } from '@/hooks/useLogout'

/**
 * 全ページ共通のヘッダーコンポーネント
 * サービスロゴ・書籍一覧へのナビリンクを表示する
 * ログイン状態に応じてログアウトボタンまたはログイン・新規登録リンクを表示する
 */
export function Header() {
  const { isLoggedIn } = useAuth()
  const { logout } = useLogout()

  return (
    <header className="bg-primary-900 text-text-inverse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight hover:opacity-80"
          >
            ReviewTechBooks
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/books" className="text-sm font-medium hover:opacity-80">
              書籍一覧
            </Link>
            {isLoggedIn ? (
              <button
                onClick={logout}
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-600"
              >
                ログアウト
              </button>
            ) : (
              <>
                <Link
                  to="/users/login"
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-600"
                >
                  ログイン
                </Link>
                <Link
                  to="/users/create"
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-600"
                >
                  新規登録
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
