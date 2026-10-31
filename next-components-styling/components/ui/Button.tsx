'use client'

import type { MouseEventHandler, ReactNode } from 'react'

import styles from './Button.module.css'

export interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
}: ButtonProps) {
  const isDisabled = disabled || loading

  const className = [
    styles.button,
    styles[variant],
    sizeClasses[size],
    'inline-flex items-center justify-center rounded-lg font-semibold',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600',
    fullWidth ? 'w-full' : '',
    loading ? styles.loading : '',
    isDisabled ? styles.disabled : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={className}
      disabled={isDisabled}
      aria-busy={loading}
      onClick={onClick}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={styles.content}>{children}</span>
    </button>
  )
}
