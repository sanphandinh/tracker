import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MobileHeaderProps {
  /**
   * Title text to display
   */
  title: string
  /**
   * Back button handler (typically for navigation)
   */
  onBack?: () => void
  /**
   * Whether to show the back button
   * @default true on mobile, false on tablet+
   */
  showBack?: boolean
  /**
   * Additional actions to show on the right side
   */
  actions?: React.ReactNode
  /**
   * Optional subtitle or breadcrumb
   */
  subtitle?: string
  /**
   * Custom className
   */
  className?: string
}

/**
 * MobileHeader: Mobile-optimized header with back button and title
 *
 * Features:
 * - Back button with ≥44px touch target
 * - Title with truncation support
 * - Optional subtitle/breadcrumb
 * - Right-side action slot
 * - Safe-area padding for notched devices
 * - Replaces breadcrumbs on mobile
 * - Keyboard accessible
 */
export function MobileHeader({
  title,
  onBack,
  showBack = true,
  actions,
  subtitle,
  className,
}: MobileHeaderProps) {
  return (
    <header
      className={cn(
        'flex items-center gap-2 w-full',
        'h-14 min-h-14',
        'px-3 py-2',
        'safe-pt', // Safe area padding top
        'border-b border-border',
        'bg-background',
        className,
      )}
      role="banner"
    >
      {/* Back button */}
      {showBack && onBack && (
        <button
          onClick={onBack}
          className={cn(
            'flex items-center justify-center',
            'h-10 w-10 min-h-10 min-w-10', // ≥44px touch target
            'rounded-full',
            'hover:bg-accent',
            'focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring',
            'transition-colors',
            'touch-target',
          )}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </button>
      )}

      {/* Title and subtitle */}
      <div className="flex flex-col flex-1 min-w-0">
        <h1
          className={cn(
            'text-base font-semibold truncate',
            subtitle && 'leading-tight',
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate leading-tight">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right-side actions */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </header>
  )
}

