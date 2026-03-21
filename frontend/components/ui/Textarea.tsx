import type { TextareaHTMLAttributes } from 'react'

/**
 * 汎用テキストエリアコンポーネント
 */
export function Textarea({
  className = '',
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full rounded-md border border-surface-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none ${className}`}
      {...props}
    />
  )
}
