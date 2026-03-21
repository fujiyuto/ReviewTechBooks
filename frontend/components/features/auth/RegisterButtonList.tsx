import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useRegister } from '@/hooks/useRegister'

/**
 * 登録方法選択コンポーネント
 * Google OAuth 登録とメールアドレス登録の選択画面を提供する
 */
export function RegisterButtonList() {
  const { isLoading, error, registerWithGoogle } = useRegister()

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-surface-border bg-surface-base p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-text-primary">
        ユーザー登録
      </h1>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className='flex flex-col gap-4'>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isLoading}
          onClick={registerWithGoogle}
        >
          <div className='flex justify-center items-center gap-2'>
            <div>
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className='w-5 h-5'>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <div>
              <span>Google で登録</span>
            </div>
          </div>
        </Button>

        <Link to="/users/create/email" className="block w-full">
          <Button
            type="button"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            メールアドレスで登録
          </Button>
        </Link>
      </div>


      <p className="mt-6 text-center text-sm text-text-secondary">
        すでにアカウントをお持ちの方は{' '}
        <Link
          to="/users/login"
          className="text-primary-600 hover:text-primary-700 hover:underline"
        >
          ログイン
        </Link>
      </p>
    </div>
  )
}
