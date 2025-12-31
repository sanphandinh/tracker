import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

type LayoutMode = 'single-column' | 'two-pane' | 'two-column-grid'

interface ContentRegionProps {
  children?: React.ReactNode
  className?: string
  layoutMode?: LayoutMode
  onLayoutChange?: (mode: LayoutMode) => void
  /**
   * Responsive children with separate list and detail panes
   * When in two-pane mode, both are visible side-by-side
   */
  listPane?: React.ReactNode
  detailPane?: React.ReactNode
  /**
   * Grid children for card-based layouts
   */
  cardGridChildren?: React.ReactNode
}

const TABLET_BREAKPOINT = 768

/**
 * ContentRegion: Responsive content container for mobile-first layouts
 *
 * Features:
 * - Single column on mobile (≤767px)
 * - Two-pane grid at tablet and above (≥768px)
 * - No horizontal scroll at ≥320px
 * - Prevents layout shift with clamp widths
 * - Responsive list pane (minmax(280px, 32vw)) + detail pane (flexible)
 * - Preserves scroll position on orientation change
 * - Safe area padding applied
 */
export function ContentRegion({
  children,
  className,
  layoutMode,
  onLayoutChange,
  listPane,
  detailPane,
  cardGridChildren,
}: ContentRegionProps) {
  const [isTablet, setIsTablet] = useState(false)
  const [effectiveLayoutMode, setEffectiveLayoutMode] = useState<LayoutMode>(layoutMode || 'single-column')

  // Detect tablet breakpoint
  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${TABLET_BREAKPOINT}px)`)
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const isTabletNow = e.matches
      setIsTablet(isTabletNow)

      // Auto-switch to two-pane if in tablet mode with list/detail panes
      if (isTabletNow && (listPane || detailPane)) {
        const newMode: LayoutMode = 'two-pane'
        setEffectiveLayoutMode(newMode)
        onLayoutChange?.(newMode)
      } else if (!isTabletNow) {
        // Switch to single column on mobile
        const newMode: LayoutMode = 'single-column'
        setEffectiveLayoutMode(newMode)
        onLayoutChange?.(newMode)
      }
    }

    // Initial check
    handleChange(mediaQuery)

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [listPane, detailPane, onLayoutChange])

  // Allow external layoutMode to override internal state
  useEffect(() => {
    if (layoutMode) {
      setEffectiveLayoutMode(layoutMode)
    }
  }, [layoutMode])

  // Preserve scroll position
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('content-scroll-position', `${e.currentTarget.scrollLeft},${e.currentTarget.scrollTop}`)
    }
  }

  // Restore scroll position on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const scrollData = sessionStorage.getItem('content-scroll-position')
    if (scrollData) {
      const [left, top] = scrollData.split(',').map(Number)
      // Scroll will be applied after layout is rendered
      requestAnimationFrame(() => {
        const container = document.querySelector('[data-content-region]')
        if (container) {
          container.scrollLeft = left
          container.scrollTop = top
        }
      })
    }
  }, [])

  const isSingleColumn = effectiveLayoutMode === 'single-column' || !isTablet
  const isTwoPane = effectiveLayoutMode === 'two-pane' && isTablet && listPane && detailPane

  return (
    <div
      data-content-region
      className={cn(
        'relative w-full flex-1 overflow-y-auto overflow-x-hidden no-horizontal-scroll',
        'flex',
        isTwoPane ? 'flex-row' : 'flex-col',
        className,
      )}
      onScroll={handleScroll}
      role="region"
      aria-label="Content"
    >
      {/* Two-pane layout for tablet+ */}
      {isTwoPane && listPane && detailPane ? (
        <>
          {/* List pane: responsive width with clamp */}
          <aside
            className={cn(
              'flex flex-col border-r border-border overflow-y-auto overflow-x-hidden',
              'flex-shrink-0',
              // Clamp: 280px min, 32vw preferred, 360px max (prevents overflow and maintains touch targets)
              // Using inline style for precise control
            )}
            style={{
              width: 'clamp(280px, 32vw, 360px)',
            }}
            role="region"
            aria-label="List pane"
          >
            {listPane}
          </aside>

          {/* Detail pane: flexible width */}
          <section
            className={cn('flex flex-col flex-1 overflow-y-auto overflow-x-hidden', 'min-w-0')}
            role="region"
            aria-label="Detail pane"
          >
            {detailPane}
          </section>
        </>
      ) : (
        <>
          {/* Single column layout for mobile */}
          <section
            className={cn(
              'flex flex-col w-full',
              'min-h-full',
              // Prevent horizontal scroll and limit max width
              'max-w-full overflow-hidden',
              'px-3 md:px-4 py-3 md:py-4',
            )}
            role="region"
            aria-label="Main content"
          >
            {/* Use single pane children if provided (mobile view of list OR detail) */}
            {children || listPane || detailPane}

            {/* Or use grid children */}
            {cardGridChildren}
          </section>
        </>
      )}
    </div>
  )
}

/**
 * TwoPaneLayout: Helper wrapper for list + detail pane patterns
 * Automatically detects tablet breakpoint and switches layout
 */
export interface TwoPaneLayoutProps {
  listPane: React.ReactNode
  detailPane: React.ReactNode
  onLayoutChange?: (mode: LayoutMode) => void
  className?: string
}

export function TwoPaneLayout({ listPane, detailPane, onLayoutChange, className }: TwoPaneLayoutProps) {
  return (
    <ContentRegion
      listPane={listPane}
      detailPane={detailPane}
      onLayoutChange={onLayoutChange}
      className={className}
    />
  )
}
