import React from 'react'
import { Plus } from 'lucide-react'
import { LayoutShell } from './layout-shell'
import { NavigationZone, useTrackerNavItems } from './navigation-zone'
import { PrimaryAction } from './primary-action'

/**
 * TrackerLayout: Complete mobile-first layout shell for tracker app
 *
 * Demonstrates:
 * - LayoutShell with header, main content, navigation, and primary action
 * - NavigationZone with standard tracker items (Home, Sheets, Settings)
 * - PrimaryAction (Create) floating in bottom-right with safe-area offset
 * - Safe area padding for notch/home indicator
 * - 44px+ touch targets for all interactive elements
 * - ≤2 taps to reach any primary destination
 *
 * Usage:
 * ```tsx
 * <TrackerLayout
 *   header={<h1>Tracker</h1>}
 *   children={<YourContent />}
 * />
 * ```
 */
export function TrackerLayout({
  header,
  children,
  onCreateClick,
  theme = 'system',
}: {
  header?: React.ReactNode
  children: React.ReactNode
  onCreateClick?: () => void
  theme?: 'light' | 'dark' | 'system'
}) {
  const navItems = useTrackerNavItems()

  return (
    <LayoutShell
      header={
        header ? (
          <div className="flex items-center justify-between h-full px-4 py-3">
            {header}
          </div>
        ) : undefined
      }
      navigation={<NavigationZone items={navItems} />}
      primaryAction={
        <PrimaryAction
          icon={<Plus className="h-6 w-6" />}
          label="Tạo"
          size="md"
          onClick={onCreateClick}
          aria-label="Tạo bảng mới"
        />
      }
      theme={theme}
    >
      {children}
    </LayoutShell>
  )
}
