import type React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'success' | 'error' | 'warning' | 'info' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  success: 'bg-green-100 text-green-800',
  error: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-800',
}

const sizeClasses: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
}

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  rounded = false,
}: BadgeProps) {
  const className = [
    'inline-flex items-center font-medium',
    variantClasses[variant],
    sizeClasses[size],
    rounded ? 'rounded-full' : 'rounded-md',
  ].join(' ')

  return <span className={className}>{children}</span>
}
