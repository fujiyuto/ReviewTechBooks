# 命名規則

## ファイル名

| 対象 | 規則 | 例 |
|---|---|---|
| ルート | キャメルケース | `books.ts` |
| サービス | キャメルケース | `bookService.ts` |
| リポジトリ（インターフェース） | キャメルケース | `bookRepository.ts` |
| インフラ（実装） | キャメルケース | `supabaseBookRepository.ts` |
| スキーマ | キャメルケース | `bookSchema.ts` |
| ミドルウェア | キャメルケース | `authMiddleware.ts` |
| テスト | 対象ファイルと同名で`.test.ts`を付与 | `bookService.test.ts` |

## 変数・関数名

- 変数・関数はキャメルケースを使用する
- 定数は大文字スネークケースを使用する
- 真偽値を返す変数・関数には`is`・`has`・`can`などのプレフィックスを付ける

## クラス・インターフェース名

- クラス・インターフェースはパスカルケースを使用する
- インターフェースにはプレフィックス`I`は付けない

```typescript
// Good
interface BookRepository {}
class SupabaseBookRepository implements BookRepository {}

// Bad
interface IBookRepository {}
```

## サービス・リポジトリの命名

- サービスクラスには`Service`サフィックスを付ける
- リポジトリインターフェースには`Repository`サフィックスを付ける
- インフラの実装クラスには使用するサービス名をプレフィックスとして付ける

```typescript
class BookService {}
interface BookRepository {}
class SupabaseBookRepository implements BookRepository {}
```