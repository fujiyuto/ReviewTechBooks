import type { InputHTMLAttributes } from 'react'

/**
 * 汎用テキスト入力コンポーネント
 */
export function Input({
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`min-w-0 flex-1 rounded-md border border-surface-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${className}`}
      {...props}
    />
  )
}
