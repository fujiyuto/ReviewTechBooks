import type { ButtonHTMLAttributes } from 'react'

/** ボタンの見た目バリアント */
type ButtonVariant = 'primary' | 'outline'

/** Buttonコンポーネントのprops */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** ボタンの見た目バリアント */
  variant?: ButtonVariant
}

/**
 * 汎用ボタンコンポーネント
 * @param variant - 見た目バリアント（'primary' | 'outline'）
 */
export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 hover:cursor-pointer'

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    outline:
      'border border-surface-border text-text-primary hover:bg-surface-raised',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
