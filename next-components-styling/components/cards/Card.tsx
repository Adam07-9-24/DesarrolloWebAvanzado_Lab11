import type React from 'react'

export interface CardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  image?: string
  footer?: React.ReactNode
  hover?: boolean
  className?: string
}

export default function Card({
  children,
  title,
  subtitle,
  image,
  footer,
  hover = true,
  className = '',
}: CardProps) {
  const cardClasses = [
    'group overflow-hidden rounded-xl bg-white shadow-md',
    'transition-all duration-300 ease-in-out',
    hover ? 'hover:-translate-y-1 hover:shadow-xl' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={cardClasses}>
      {image && (
        <div className="h-48 overflow-hidden">
          <img
            src={image}
            alt={title ?? 'Imagen de la tarjeta'}
            className={`h-full w-full object-cover transition-transform duration-300 ease-in-out ${
              hover ? 'group-hover:scale-105' : ''
            }`}
          />
        </div>
      )}

      <div className="p-6">
        {(title || subtitle) && (
          <header className="mb-4">
            {title && (
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </header>
        )}

        <div className="text-gray-700">{children}</div>
      </div>

      {footer && (
        <footer className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          {footer}
        </footer>
      )}
    </article>
  )
}
