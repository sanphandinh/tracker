import React from 'react'
import { useMatchRoute } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

export interface NavigationItemProps {
  id: string
  label: string
  route: string
  icon?: React.ReactNode
  badgeCount?: number
  className?: string
  onClick?: () => void
  'aria-label'?: string
}

/**
 * NavigationItem: Single navigation item for bottom navigation
 *
 * Features:
 * - ≥44px touch target (min 44px height/width)
 * - Active state detection from TanStack Router
 * - Optional badge for notifications/counts
 * - Icon + label with proper spacing
 * - Light/dark theme support via CSS variables
 * - Keyboard accessible with focus-visible styling
 * - Vietnamese text wrapping support
 */
export function NavigationItem({
  id,
  label,
  route,
  icon,
  badgeCount,
  className,
  onClick,
  'aria-label': ariaLabel,
}: NavigationItemProps) {
  let isActive = false

  // Safely call useMatchRoute - it may fail in test environments without RouterProvider
  try {
    const matchRoute = useMatchRoute()
    isActive = Boolean(matchRoute({ to: route, fuzzy: true }))
  } catch (error) {
    // In test/SSR environments without router context, default to false
    isActive = false
  }

  const handleClick = () => {
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        // Base button styling
        'relative flex flex-col items-center justify-center gap-1',
        // Touch target minimum
        'touch-target',
        // Responsive sizing: 44px min on mobile
        'h-14 min-h-14 px-3 py-2',
        // Colors based on active state
        'transition-colors duration-200',
        isActive
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground',
        // Dark mode support
        'dark:text-muted-foreground dark:hover:text-foreground',
        // Focus visible for keyboard accessibility
        'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring',
        // Prevent text selection on long presses
        'select-none',
        // Active state underline indicator
        isActive && 'border-b-2 border-primary',
        className,
      )}
      aria-label={ariaLabel || label}
      aria-current={isActive ? 'page' : undefined}
      data-nav-item={id}
      data-active={isActive}
    >
      {/* Icon */}
      {icon && (
        <div className="flex items-center justify-center h-6 w-6">
          {typeof icon === 'string' ? (
            // If icon is a string (icon name), render as text placeholder
            <span className="text-sm font-semibold">{icon[0]?.toUpperCase()}</span>
          ) : (
            // If icon is a React element
            icon
          )}
        </div>
      )}

      {/* Label with Vietnamese text wrapping support */}
      <span
        className={cn(
          'text-xs font-medium leading-tight text-wrap-long',
          'line-clamp-2',
          // Prevent label from being too wide
          'max-w-[60px]',
        )}
      >
        {label}
      </span>

      {/* Badge for notifications/counts */}
      {badgeCount !== undefined && badgeCount > 0 && (
        <span
          className={cn(
            'absolute top-1 right-1',
            'flex items-center justify-center',
            'h-5 w-5 min-h-5 min-w-5',
            'rounded-full bg-destructive text-white text-xs font-bold',
            'touch-target-sm',
          )}
          aria-label={`${badgeCount} new items`}
        >
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
    </button>
  )
}
