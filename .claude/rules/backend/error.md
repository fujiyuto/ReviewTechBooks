# エラーハンドリング

## 基本方針

- エラーハンドリングは`middleware/`に定義したグローバルエラーハンドラーで一元管理する
- サービス層・リポジトリ層ではエラーをthrowし、ルート層でキャッチしない
- グローバルエラーハンドラーがすべてのエラーを受け取り、適切なレスポンスを返す

## エラーレスポンス形式

すべてのエラーレスポンスは以下の形式に統一する。

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "書籍が見つかりません"
  }
}
```

## HTTPステータスコード

| ケース | ステータスコード |
|---|---|
| リクエストが不正 | 400 |
| 認証されていない | 401 |
| 権限がない | 403 |
| リソースが存在しない | 404 |
| サーバー内部エラー | 500 |

## カスタムエラークラス

エラーの種類に応じてカスタムエラークラスを定義する。

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message)
  }
}

class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, 'NOT_FOUND', message)
  }
}

class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(401, 'UNAUTHORIZED', message)
  }
}
```

## グローバルエラーハンドラー

```typescript
app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json(
      { error: { code: err.code, message: err.message } },
      err.statusCode,
    )
  }
  return c.json(
    { error: { code: 'INTERNAL_SERVER_ERROR', message: '予期しないエラーが発生しました' } },
    500,
  )
})
```