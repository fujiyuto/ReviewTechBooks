# CLAUDE.md (Backend)

Backend 固有のガイダンスです。共通事項はリポジトリルートの `CLAUDE.md` を参照してください。

## コマンド

`backend/` ディレクトリ内で実行してください。

```sh
pnpm dev          # ホットリロードあり開発サーバー起動（tsx watch）
pnpm build        # TypeScript を dist/ にコンパイル
pnpm start        # コンパイル済み成果物を実行
pnpm lint         # eslint（@typescript-eslint 推奨ルール）
pnpm typecheck    # tsc --noEmit
pnpm format:check # prettier チェック
```

## アーキテクチャ

エントリーポイント: `src/index.ts` — `Hono` アプリインスタンスを作成し、`@hono/node-server` で起動します。

`tsconfig.json` で `jsxImportSource: "hono/jsx"` を設定しており、文字列テンプレートの代替として Hono の JSX レンダラーが使用可能です。

## ディレクトリ構成

```
src/
├── index.ts         
├── routes/           
├── services/        
├── repositories/     
├── infrastructure/   
├── schemas/          
├── types/           
└── middleware/      
```

## 各ディレクトリの役割

| ディレクトリ | 役割 |
|---|---|
| `routes/` | Honoインスタンスの生成・ルーティングの定義 |
| `services/` | ビジネスロジック。`repositories/`のインターフェースに依存する |
| `repositories/` | データアクセスのインターフェース定義 |
| `infrastructure/` | `repositories/`インターフェースの具体的な実装（Supabase等） |
| `schemas/` | zodによるリクエスト・レスポンスのバリデーションスキーマ |
| `types/` | 型定義。openapi-typescriptから抽出した型定義を配置 |
| `middleware/` | 認証・エラーハンドリング等の共通ミドルウェア |

## ルーティングの構成

各リソースごとにファイルを作成し、`index.ts`で登録する。

```
routes/
├── books.ts
├── reviews.ts
└── users.ts
```

`index.ts`での登録例：

```typescript
app.route('/books', books)
app.route('/reviews', reviews)
app.route('/users', users)
```