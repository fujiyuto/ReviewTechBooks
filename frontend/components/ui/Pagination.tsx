import { Button } from './Button'

/** ページネーションコンポーネントのprops */
interface PaginationProps {
  /** 現在のページ番号 */
  currentPage: number
  /** 次のページが存在するか */
  hasNext: boolean
  /** 前のページが存在するか */
  hasPrev: boolean
  /** ページ変更時のコールバック */
  onPageChange: (page: number) => void
}

/**
 * 汎用ページネーションコンポーネント
 * @param currentPage - 現在のページ番号
 * @param hasNext - 次のページが存在するか
 * @param hasPrev - 前のページが存在するか
 * @param onPageChange - ページ変更時のコールバック
 */
export function Pagination({
  currentPage,
  hasNext,
  hasPrev,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <Button
        variant="outline"
        disabled={!hasPrev}
        onClick={() => onPageChange(currentPage - 1)}
      >
        前へ
      </Button>
      <span className="px-3 text-sm text-text-secondary">
        {currentPage} ページ
      </span>
      <Button
        variant="outline"
        disabled={!hasNext}
        onClick={() => onPageChange(currentPage + 1)}
      >
        次へ
      </Button>
    </div>
  )
}
