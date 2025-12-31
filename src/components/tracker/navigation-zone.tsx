import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { NavigationItem, type NavigationItemProps } from './navigation-item'

export interface NavigationZoneProps {
  items: NavigationItemProps[]
  layout?: 'bottom-fixed' | 'side'
  alignment?: 'space-between' | 'centered'
  className?: string
  onItemClick?: (itemId: string) => void
}

/**
 * NavigationZone: Container for persistent bottom navigation
 *
 * Features:
 * - 3-4 navigation items (Home, Sheets, Settings minimum)
 * - ≥44px height for touch targets
 * - Space-between alignment for optimal thumb reach
 * - Bottom-fixed positioning on mobile
 * - Active state highlighting with border-bottom
 * - Light/dark theme support
 * - Keyboard navigation support
 * - Accessibility: ARIA labels, semantic nav element
 * - No horizontal scroll overflow
 */
export function NavigationZone({
  items,
  layout = 'bottom-fixed',
  alignment = 'space-between',
  className,
  onItemClick,
}: NavigationZoneProps) {
  // Validate items (must have 3-4)
  const validItems = useMemo(() => {
    if (items.length < 3) {
      console.warn('NavigationZone: Minimum 3 items required, got', items.length)
      return items
    }
    if (items.length > 4) {
      console.warn('NavigationZone: Maximum 4 items recommended, got', items.length)
      return items.slice(0, 4)
    }
    return items
  }, [items])

  const alignmentClass = {
    'space-between': 'justify-between',
    centered: 'justify-center gap-4',
  }

  const layoutClass = {
    'bottom-fixed': 'fixed bottom-0 left-0 right-0',
    side: 'sticky',
  }

  return (
    <nav
      className={cn(
        // Layout positioning
        layoutClass[layout],
        // Base styling
        'z-40 w-full',
        'border-t border-border bg-card',
        // Height minimum 44px, typically 56px
        'h-14 min-h-14',
        // Flex layout for items
        'flex',
        alignmentClass[alignment],
        'items-center',
        // Padding and overflow
        'px-3 md:px-4',
        'overflow-x-hidden overflow-y-hidden',
        // Safe area for notch/home indicator
        'safe-px safe-pb',
        // Prevent horizontal scroll
        'no-horizontal-scroll',
        // Light/dark theme support via CSS vars
        'bg-card text-foreground dark:bg-card dark:text-foreground',
        className,
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Navigation items */}
      <div
        className={cn(
          'flex',
          alignmentClass[alignment],
          'w-full h-full items-center',
          // Ensure items don't exceed container
          'overflow-hidden',
        )}
      >
        {validItems.map((item) => (
          <NavigationItem
            key={item.id}
            {...item}
            onClick={() => {
              item.onClick?.()
              onItemClick?.(item.id)
            }}
            className={cn(
              // Item flex sizing
              'flex-1 sm:flex-none',
              // Touch target
              'min-h-14 min-w-[60px]',
              // Even distribution
              alignment === 'space-between' && 'flex-1',
            )}
          />
        ))}
      </div>
    </nav>
  )
}

/**
 * Helper hook to create standard navigation items for tracker app
 */
export function useTrackerNavItems(): NavigationItemProps[] {
  return [
    {
      id: 'home',
      label: 'Home',
      route: '/',
      icon: '🏠',
      'aria-label': 'Home - Back to main page',
    },
    {
      id: 'sheets',
      label: 'Bảng',
      route: '/tracker',
      icon: '📋',
      'aria-label': 'Sheets - Manage tracking sheets',
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      route: '/tracker/settings',
      icon: '⚙️',
      'aria-label': 'Settings - App configuration',
    },
  ]
}
