# CLAUDE.md

このファイルは、リポジトリ内のコードを扱う Claude Code (claude.ai/code) へのガイダンスを提供します。

各サブディレクトリ固有のガイダンスは `backend/CLAUDE.md` と `frontend/CLAUDE.md` を参照してください。

## プロジェクト概要

ReviewTechBooks は技術書レビュープラットフォームです。`backend/` と `frontend/` を持つモノレポ構成で、それぞれ独自の `node_modules` と pnpm ワークスペースを持ちます。

- **Backend**: Hono フレームワーク（Node.js）、`http://localhost:8000` で起動
- **Frontend**: Next.js 16（App Router）+ React 19 + Tailwind CSS v4、`http://localhost:3000` で起動
- **認証**: Supabase Auth（JWT Bearer トークン）

## CI チェック

GitHub Actions CI は `backend/**` または `frontend/**` に変更があるプルリクエストで実行されます。両パイプラインとも `lint` → `format:check` → `typecheck` → `build` の順で実行し、すべて通過する必要があります。

## コードスタイル

Prettier 設定（`backend/.prettierrc` と `frontend/.prettierrc` は同一）:
- セミコロンなし
- シングルクォート
- インデント 2 スペース
- 末尾カンマあり
- 1 行 80 文字

## API 設計

API 仕様: `docs/openapi.yml`。Backend は `/api/` 配下に REST エンドポイントを提供します。

| リソース | エンドポイント |
|---|---|
| ユーザー | `POST /api/users`、`GET/PATCH/DELETE /api/users/:userId` |
| ユーザーのレビュー | `GET /api/users/:userId/reviews` |
| 書籍 | `GET /api/books`、`GET /api/books/:bookId` |
| レビュー | `GET /api/books/:bookId/reviews`、`POST /api/reviews`、`PATCH/DELETE /api/reviews/:reviewId` |
| カテゴリ | `GET /api/categories?feature_name=...` |

ページネーション付きリスト系エンドポイントのレスポンス形式: `{ items, total, page, limit, next, prev }`

レビュー・ユーザーの更新系エンドポイントには `Authorization: Bearer <jwt>`（Supabase JWT）が必要です。

## データモデル

詳細は `docs/ERDiagram.md` を参照。主要エンティティ:

- `users` — `auth_id`（UUID）で Supabase Auth と紐付け。ロールは `free | premium`
- `books` — ISBN で識別
- `reviews` — 1 ユーザー + 1 書籍に紐付き、タイトルと本文を持つ
- `categories` / `category_types` — 階層構造。`review_categories` を介してレビューと紐付く