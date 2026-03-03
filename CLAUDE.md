# CLAUDE.md

このファイルは、リポジトリ内のコードを扱う Claude Code (claude.ai/code) へのガイダンスを提供します。

各サブディレクトリ固有のガイダンスは `backend/CLAUDE.md` と `frontend/CLAUDE.md` を参照してください。

## プロジェクト概要

ReviewTechBooks は技術書レビュープラットフォームです。自分が感じた課題である、「自分に合った技術書を見つける」といった点に焦点を当てたサービスです。  
技術書を読んだことがある、または読んだユーザーは技術書のレビューを投稿し、他のユーザーが自分の目的に沿った技術書の検索を助けます。

`backend/` と `frontend/` を持つモノレポ構成で、それぞれ独自の `node_modules` と pnpm ワークスペースを持ちます。

- **Backend**: Hono フレームワーク（Node.js）、`http://localhost:8000` で起動
- **Frontend**: Next.js 16（App Router）+ React 19 + Tailwind CSS v4、`http://localhost:3000` で起動
- **認証**: Supabase Auth（JWT Bearer トークン）

## ターゲットユーザー

技術書のレビューを行うプラットフォームのため、エンジニアまたはITに興味のあるユーザーを対象としている。

## クイックスタート

各ディレクトリに移動して依存関係をインストールする:

```sh
cd backend && pnpm install
cd ../frontend && pnpm install
```

開発サーバーを起動する（それぞれ別ターミナルで実行）:

```sh
# backend/
pnpm dev   # http://localhost:8000

# frontend/
pnpm dev   # http://localhost:3000
```

## CI チェック

GitHub Actions CI は `backend/**` または `frontend/**` に変更があるプルリクエストで実行されます。両パイプラインとも `lint` → `format:check` → `typecheck` → `build` の順で実行し、すべて通過する必要があります。

## コードスタイル

Prettier 設定（`backend/.prettierrc` と `frontend/.prettierrc` は同一）:
- セミコロンなし
- シングルクォート
- インデント 2 スペース
- 末尾カンマあり
- 1 行 80 文字