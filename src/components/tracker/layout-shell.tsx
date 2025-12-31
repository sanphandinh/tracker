import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface LayoutShellProps {
  children: React.ReactNode
  header?: React.ReactNode
  navigation?: React.ReactNode
  primaryAction?: React.ReactNode
  safeAreaTop?: boolean
  safeAreaBottom?: boolean
  theme?: 'light' | 'dark' | 'system'
  headerHeight?: 'sm' | 'md'
  className?: string
}

/**
 * LayoutShell: Mobile-first layout shell with safe-area padding support
 *
 * Provides:
 * - Safe area padding for notch/home indicator avoidance
 * - Theme support (light/dark)
 * - Responsive header and navigation zones
 * - Primary action (FAB) positioning
 * - No horizontal scroll prevention
 */
export function LayoutShell({
  children,
  header,
  navigation,
  primaryAction,
  safeAreaTop = true,
  safeAreaBottom = true,
  theme = 'system',
  headerHeight = 'md',
  className,
}: LayoutShellProps) {
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(theme === 'system' ? 'light' : theme)

  React.useEffect(() => {
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setEffectiveTheme(isDark ? 'dark' : 'light')

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        setEffectiveTheme(e.matches ? 'dark' : 'light')
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      setEffectiveTheme(theme)
    }
  }, [theme])

  const headerHeightClass = headerHeight === 'sm' ? 'h-14' : 'h-16'
  const navHeight = 'h-14'

  return (
    <div
      className={cn(
        'flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground',
        effectiveTheme === 'dark' && 'dark',
        className,
      )}
    >
      {/* Header */}
      {header && (
        <header
          className={cn(
            'sticky top-0 z-40 border-b border-border bg-card',
            headerHeightClass,
            safeAreaTop && 'safe-pt',
          )}
        >
          {header}
        </header>
      )}

      {/* Main content area with safe area padding */}
      <main
        className={cn(
          'relative flex-1 overflow-y-auto overflow-x-hidden scroll-smooth-safe',
          'flex flex-col',
        )}
        role="main"
      >
        {children}
      </main>

      {/* Primary Action (FAB) - floating bottom-right */}
      {primaryAction && (
        <div
          className={cn(
            'pointer-events-none fixed bottom-0 right-0 z-30',
            safeAreaBottom && 'safe-pb safe-pr',
          )}
          style={{
            paddingBottom: `calc(var(--safe-area-bottom, 12px) + var(--nav-height, 56px) + 12px)`,
            paddingRight: 'var(--safe-area-right, 12px)',
          }}
        >
          <div className="pointer-events-auto">{primaryAction}</div>
        </div>
      )}

      {/* Bottom Navigation */}
      {navigation && (
        <nav
          className={cn(
            'sticky bottom-0 z-40 border-t border-border bg-card',
            navHeight,
            safeAreaBottom && 'safe-pb',
          )}
        >
          {navigation}
        </nav>
      )}
    </div>
  )
}
