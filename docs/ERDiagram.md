# ER diagram

```mermaid

---
title: "Review tech books entities"
---
erDiagram
    users {
        bigint       id              PK "ID"
        uuid         auth_id         UK "Supabase Auth ID"
        varchar(20)  username           "ユーザー名"
        varchar(50)  last_name          "名前（姓）"
        varchar(50)  first_name         "名前（名）"
        text         biography          "自己紹介"
        enum         role               "ロール"
        datetime     created_at         "作成日時"
        datetime     updated_at         "更新日時"
    }

    books {
        bigint        id              PK "ID"
        varchar(13)   isbn            UK "ISBN"
        varchar(255)  title              "タイトル"
        varchar(255)  subtitle           "サブタイトル"
        varchar(255)  author             "著者"
        varchar(255)  published_by       "出版社"
        int           number_of_pages    "ページ数"
        int           regular_price      "定価（税抜）"
        int           include_tax_price  "定価（税込）"
        date          release_date       "発売日"
        text          description        "説明"
        varchar(2048) thumbnail_url      "サムネイル画像"
        datetime      created_at         "作成日時"
        datetime      updated_at         "更新日時"
    }

    reviews {
        bigint       id              PK "ID"
        bigint       book_id         FK "書籍ID"
        bigint       user_id         FK "ユーザーID"
        varchar(100) title              "タイトル"
        text         content            "内容"
        datetime     created_at         "作成日時"
        datetime     updated_at         "更新日時"
    }

    category_types {
        int          id              PK "ID"
        varchar(50)  feature_name       "機能名"
        varchar(50)  name               "カテゴリ種別名"
        datetime     created_at         "作成日時"
        datetime     updated_at         "更新日時"
    }

    categories {
        int          id              PK "ID"
        int          category_type_id FK "カテゴリ種別ID"
        varchar(50)  name               "カテゴリ名"
        int          order              "並び順"
        datetime     created_at         "作成日時"
        datetime     updated_at         "更新日時"
    }

    review_categories {
        bigint       id              PK "ID"
        bigint       review_id       FK "レビューID"
        int          category_id     FK "カテゴリID"
    }

    users ||--o{ reviews : "作成"
    books ||--o{ reviews : "持つ"
    reviews ||--o{ review_categories : "持つ"
    categories ||--o{ review_categories : "持つ"
    category_types ||--o{ categories : "持つ"