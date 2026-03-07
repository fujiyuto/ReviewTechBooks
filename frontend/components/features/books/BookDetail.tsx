import type { components } from '@/types/api'

/** BookDetailコンポーネントのprops */
interface BookDetailProps {
  /** 書籍詳細情報 */
  book: components['schemas']['BookDetail']
}

/**
 * 書籍詳細情報コンポーネント
 * サムネイル画像とメタデータ（著者・出版社・ページ数・発売日・価格・説明）を表示する
 * @param book - 書籍詳細情報
 */
export function BookDetail({ book }: BookDetailProps) {
  return (
    <section className="mb-10 flex flex-col gap-6 sm:flex-row">
      {book.thumbnailUrl ? (
        <img
          src={book.thumbnailUrl}
          alt={book.title ?? '書籍サムネイル'}
          className="aspect-[3/4] w-40 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="aspect-[3/4] w-40 shrink-0 rounded-lg bg-surface-overlay" />
      )}

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-text-primary">
          {book.title ?? '—'}
        </h1>
        {book.subtitle && (
          <p className="text-base text-text-secondary">{book.subtitle}</p>
        )}
        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          {book.author && (
            <>
              <dt className="text-text-secondary">著者</dt>
              <dd className="text-text-primary">{book.author}</dd>
            </>
          )}
          {book.publishedBy && (
            <>
              <dt className="text-text-secondary">出版社</dt>
              <dd className="text-text-primary">{book.publishedBy}</dd>
            </>
          )}
          {book.numberOfPages != null && (
            <>
              <dt className="text-text-secondary">ページ数</dt>
              <dd className="text-text-primary">{book.numberOfPages} ページ</dd>
            </>
          )}
          {book.releaseDate && (
            <>
              <dt className="text-text-secondary">発売日</dt>
              <dd className="text-text-primary">{book.releaseDate}</dd>
            </>
          )}
          {book.includeTaxPrice != null && (
            <>
              <dt className="text-text-secondary">税込価格</dt>
              <dd className="text-text-primary">
                ¥{book.includeTaxPrice.toLocaleString()}
              </dd>
            </>
          )}
        </dl>
        {book.description && (
          <p className="mt-3 whitespace-pre-line text-sm text-text-secondary">
            {book.description}
          </p>
        )}
      </div>
    </section>
  )
}
