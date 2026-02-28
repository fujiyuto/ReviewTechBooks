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
