# CLAUDE.md (Frontend)

Frontend 固有のガイダンスです。共通事項はリポジトリルートの `CLAUDE.md` を参照してください。

## 技術スタック

- React 19 + React Router v7
- Vite v6
- TailwindCSS v4
- TypeScript 5.x

## ディレクトリ構成

```
frontend/
├── index.html          # Vite エントリ HTML
├── main.tsx            # React エントリポイント
├── App.tsx             # ルーター設定（BrowserRouter + Routes）
├── vite.config.ts      # Vite 設定
├── vite-env.d.ts       # Vite 型参照
├── app/                # ページコンポーネント（Next.js の app/ に相当する命名を維持）
│   ├── globals.css
│   ├── page.tsx        → /
│   ├── books/
│   │   ├── page.tsx        → /books
│   │   └── [bookId]/page.tsx → /books/:bookId
│   └── ...
├── components/         # 共通コンポーネント
├── hooks/              # カスタムフック
├── api/                # API クライアント
└── types/              # 自動生成型定義
```

## ルーティング

React Router v7 (library mode) を使用。ルート定義は `App.tsx` に集約。
パスパラメータは `useParams()` フックで取得。

## 環境変数

Vite の規約に従い `VITE_` プレフィックスを使用。
コード内では `import.meta.env.VITE_XXX` でアクセス。

## コマンド

`frontend/` ディレクトリ内で実行してください。

```sh
pnpm dev          # vite（開発サーバー）
pnpm build        # vite build
pnpm preview      # vite preview
pnpm lint         # eslint
pnpm typecheck    # tsc --noEmit
pnpm format:check # prettier チェック
pnpm test         # vitest実行
pnpm test --watch # vitest ウォッチモード（開発中に便利）
```
