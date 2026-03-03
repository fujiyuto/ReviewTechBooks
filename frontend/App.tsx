import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layouts/Header'
import HomePage from '@/app/page'
import BookListPage from '@/app/books/page'
import BookDetailPage from '@/app/books/[bookId]/page'
import ReviewCreatePage from '@/app/reviews/create/page'
import ReviewEditPage from '@/app/reviews/edit/[reviewId]/page'
import UserCreatePage from '@/app/users/create/page'
import UserLoginPage from '@/app/users/login/page'
import UserDetailPage from '@/app/users/[userId]/page'
import UserEditPage from '@/app/users/edit/[userId]/page'
import PasswordResetMailSendPage from '@/app/users/password/reset/mail/send/page'
import PasswordResetFormPage from '@/app/users/password/reset/form/page'
import PasswordResetCompletePage from '@/app/users/password/reset/complete/page'
import EmailResetFormPage from '@/app/users/email/reset/form/page'
import EmailConfirmPage from '@/app/confirm/email/page'

export function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BookListPage />} />
          <Route path="/books/:bookId" element={<BookDetailPage />} />
          <Route path="/reviews/create" element={<ReviewCreatePage />} />
          <Route path="/reviews/edit/:reviewId" element={<ReviewEditPage />} />
          <Route path="/users/create" element={<UserCreatePage />} />
          <Route path="/users/login" element={<UserLoginPage />} />
          <Route
            path="/users/password/reset/mail/send"
            element={<PasswordResetMailSendPage />}
          />
          <Route
            path="/users/password/reset/form"
            element={<PasswordResetFormPage />}
          />
          <Route
            path="/users/password/reset/complete"
            element={<PasswordResetCompletePage />}
          />
          <Route
            path="/users/email/reset/form"
            element={<EmailResetFormPage />}
          />
          <Route path="/confirm/email" element={<EmailConfirmPage />} />
          <Route path="/users/:userId" element={<UserDetailPage />} />
          <Route path="/users/edit/:userId" element={<UserEditPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
