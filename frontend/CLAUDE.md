# CLAUDE.md (Frontend)

Frontend 固有のガイダンスです。共通事項はリポジトリルートの `CLAUDE.md` を参照してください。

## コマンド

`frontend/` ディレクトリ内で実行してください。

```sh
pnpm dev          # next dev
pnpm build        # next build
pnpm lint         # eslint（eslint-config-next）
pnpm typecheck    # tsc --noEmit
pnpm format:check # prettier チェック
```

## アーキテクチャ

Next.js **App Router**（`app/`）を使用。`babel-plugin-react-compiler` が devDependencies に含まれており、React Compiler による最適化が有効です。
