import { Link } from 'react-router-dom'

/**
 * 全ページ共通のヘッダーコンポーネント
 * サービスロゴ・書籍一覧へのナビリンク・ログインボタンを表示する
 */
export function Header() {
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
            <Link
              to="/books"
              className="text-sm font-medium hover:opacity-80"
            >
              書籍一覧
            </Link>
            <Link
              to="/users/login"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-600"
            >
              ログイン
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
