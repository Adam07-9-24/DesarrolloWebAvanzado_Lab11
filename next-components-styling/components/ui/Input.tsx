'use client'

import { useId } from 'react'
import type React from 'react'

import styles from './Input.module.css'

export interface InputProps {
  label?: string
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
  required?: boolean
  helperText?: string
  icon?: React.ReactNode
}

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  helperText,
  icon,
}: InputProps) {
  const inputId = useId()
  const messageId = `${inputId}-message`
  const hasMessage = Boolean(error || helperText)

  const wrapperClassName = [
    styles.inputWrapper,
    error ? styles.error : '',
  ]
    .filter(Boolean)
    .join(' ')

  const inputClassName = [
    styles.input,
    'w-full rounded-lg border bg-white py-3 text-gray-900',
    'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500',
    label
      ? 'placeholder-transparent focus:placeholder-gray-400'
      : 'placeholder-gray-400',
    icon ? 'pr-4 pl-10' : 'px-4',
    error ? 'border-red-500' : 'border-gray-300',
  ].join(' ')

  const labelClassName = [
    styles.floatingLabel,
    value ? styles.active : '',
    icon ? 'left-10' : 'left-4',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="w-full">
      <div className={wrapperClassName}>
        {icon && (
          <span
            className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-gray-500"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={hasMessage ? messageId : undefined}
          className={inputClassName}
        />

        {label && (
          <label htmlFor={inputId} className={labelClassName}>
            {label}
            {required && (
              <span className="ml-0.5 text-red-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
      </div>

      {error ? (
        <p id={messageId} className={`${styles.errorMessage} mt-1.5 text-sm`}>
          {error}
        </p>
      ) : (
        helperText && (
          <p id={messageId} className="mt-1.5 text-sm text-gray-500">
            {helperText}
          </p>
        )
      )}
    </div>
  )
}
