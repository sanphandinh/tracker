import React from 'react'
import { cn } from '@/lib/utils'

export interface PrimaryActionProps {
  label?: string
  icon?: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
  'aria-label'?: string
  disabled?: boolean
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
}

/**
 * PrimaryAction: Floating action button (FAB) for primary user action
 *
 * Features:
 * - ≥48px touch target (min 48px x 48px hitbox)
 * - Floating bottom placement with safe-area offset
 * - Shadow for elevation and prominence
 * - Light/dark theme support
 * - Keyboard accessible with focus-visible styling
 * - Loading state support
 * - Disabled state support
 * - Does not overlap content or navigation
 * - Uses Tailwind CSS for responsive sizing
 */
export function PrimaryAction({
  label = 'Create',
  icon,
  onClick,
  href,
  className,
  'aria-label': ariaLabel,
  disabled = false,
  loading = false,
  size = 'md',
}: PrimaryActionProps) {
  const sizeClasses = {
    sm: 'h-12 w-12 min-h-12 min-w-12',
    md: 'h-14 w-14 min-h-14 min-w-14',
    lg: 'h-16 w-16 min-h-16 min-w-16',
  }

  const baseClasses = cn(
    // Touch target minimum
    'touch-target-lg',
    sizeClasses[size],
    // Flexbox centering for icon + label
    'flex items-center justify-center gap-2',
    // Styling
    'rounded-full',
    'bg-primary text-primary-foreground',
    'shadow-lg',
    // Hover and active states
    'transition-all duration-200',
    'hover:shadow-xl hover:scale-105',
    'active:scale-95',
    // Focus visible for keyboard accessibility
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
    // Disabled state
    disabled && 'opacity-50 cursor-not-allowed hover:shadow-lg hover:scale-100',
    // Dark mode support
    'dark:shadow-xl dark:bg-primary dark:text-primary-foreground',
    className,
  )

  const handleClick = () => {
    if (!disabled && !loading) {
      onClick?.()
    }
  }

  // Determine if this should be a link or button
  const Component = href ? 'a' : 'button'

  const linkProps = href ? { href, role: 'button' as const } : {}
  const buttonProps = !href ? { type: 'button' as const, onClick: handleClick } : {}

  return (
    <Component
      className={baseClasses}
      disabled={disabled && !href}
      aria-label={ariaLabel || label}
      aria-busy={loading}
      {...(linkProps as any)}
      {...(buttonProps as any)}
    >
      {/* Icon */}
      {icon && (
        <span
          className={cn(
            'flex items-center justify-center',
            size === 'sm' && 'h-5 w-5',
            size === 'md' && 'h-6 w-6',
            size === 'lg' && 'h-7 w-7',
          )}
        >
          {typeof icon === 'string' ? <span>{icon}</span> : icon}
        </span>
      )}

      {/* Label (hidden on smaller sizes, visible on large) */}
      {label && size === 'lg' && (
        <span className="text-sm font-semibold text-wrap-long">{label}</span>
      )}

      {/* Loading spinner */}
      {loading && (
        <span
          className={cn(
            'absolute',
            'inline-block animate-spin',
            size === 'sm' && 'h-4 w-4',
            size === 'md' && 'h-5 w-5',
            size === 'lg' && 'h-6 w-6',
          )}
          aria-hidden="true"
        >
          <svg
            className="h-full w-full"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" opacity="0.25" />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="currentColor"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}
    </Component>
  )
}
