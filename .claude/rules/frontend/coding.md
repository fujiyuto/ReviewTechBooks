---
paths:
  - "frontend/{app,components}/**/*.tsx"
  - "frontend/{hooks,api,utils}/**/*.ts"
---

## コーディング規約

- コンポーネントは関数コンポーネント + TypeScript
- Propsの型定義は必ずインターフェースで行う
- スタイルはTailwind CSSのみを使用し、インラインスタイルは使用しない
- 命名規則: PascalCase（コンポーネント）、camelCase（変数・関数）
- `any` 型は使用しない
- `console.log` をコードに残さない
- named exportを使用する（default exportは `app/` 配下のページコンポーネントのみ）
- 全てのコンポーネント・関数・変数には必ずJSDocコメントを付与する
- 