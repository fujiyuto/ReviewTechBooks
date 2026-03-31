# 画面一覧

> [!CAUTION]  
> 使用するAPIについてはopenapi.ymlを参照


### 書籍一覧画面（TOP）
URL: /books

### 書籍詳細画面

#### URL
/books{bookId}  

#### 使用するAPI
- /api/books/{bookId}
- /api/books/{bookId}/reviews

### レビュー投稿画面
URL: /reviews/create

### レビュー編集画面
URL: /reviews/edit/{reviewId}

### ユーザーレビュー一覧画面
URL: /users/{userId}/reviews

### 技術書レビュー一覧画面
URL: /books/{bookId}/reviews

### ユーザー詳細画面
URL: /users/{userId}

### ユーザー登録画面
URL: /users/create

### ユーザー登録画面（メールアドレス）
URL: /users/create/email

### ユーザー登録時情報入力画面（外部認証使用時）
URL: /users/onboarding

### ユーザー情報編集画面
URL: /users/edit/{userId}

### ユーザーログイン画面
URL: /users/login

### パスワードリセットメール送信画面
URL: /users/password/reset/mail/send

### パスワードリセットフォーム画面
URL: /users/password/reset/form

### パスワードリセット完了画面
URL: /users/password/reset/complete

### メールアドレス変更画面
URL: /users/email/reset/form

### メール確認案内画面
URL: /confirm/email