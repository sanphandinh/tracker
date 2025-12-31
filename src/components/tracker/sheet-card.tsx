import { cn } from '@/lib/utils'
import type { TrackingSheet } from '@/lib/tracker/types'

interface SheetCardProps {
  sheet: TrackingSheet
  entityCount?: number
  attributeCount?: number
  onOpen?: (sheetId: string) => void
  onClick?: (sheetId: string) => void
  /** Optional CSS class */
  className?: string
}

/**
 * SheetCard component - Preview card for a tracking sheet
 *
 * Displays:
 * - Sheet name
 * - Entity count
 * - Attribute count
 * - Last modified date
 * - Creation date
 *
 * Used in TrackerHome for browsing and opening sheets
 */
export function SheetCard({
  sheet,
  entityCount = 0,
  attributeCount = 0,
  onOpen,
  onClick,
  className,
}: SheetCardProps) {
  const handleClick = () => {
    onClick?.(sheet.id) || onOpen?.(sheet.id)
  }

  /**
   * Format date for display
   */
  const formatDate = (date: Date): string => {
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const isYesterday = new Date(date.getTime() + 86400000).toDateString() === now.toDateString()

    if (isToday) {
      return `Lúc ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
    }

    if (isYesterday) {
      return 'Hôm qua'
    }

    return date.toLocaleDateString('vi-VN', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }

  const isRecent = Date.now() - sheet.createdAt.getTime() < 86400000 * 3 // Less than 3 days

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'min-h-[120px] min-w-0',
        className
      )}
      data-sheet={sheet.id}
    >
      {/* Title and status */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="truncate text-base font-semibold leading-tight">
          {sheet.name}
        </h3>
        {isRecent && (
          <span
            className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
            title="Newly created sheet"
          >
            Mới
          </span>
        )}
      </div>

      {/* Metadata */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <span>👥</span>
          <span>{entityCount} thành viên</span>
        </div>
        {attributeCount > 0 && (
          <div className="flex items-center gap-1">
            <span>📋</span>
            <span>{attributeCount} cột</span>
          </div>
        )}
      </div>

      {/* Dates */}
      <div className="flex flex-col gap-1 border-t border-border/50 pt-2 text-xs text-muted-foreground">
        <div>
          <span className="font-medium">Cập nhật:</span> {formatDate(sheet.updatedAt)}
        </div>
        {sheet.createdAt !== sheet.updatedAt && (
          <div>
            <span className="font-medium">Tạo:</span> {formatDate(sheet.createdAt)}
          </div>
        )}
      </div>
    </button>
  )
}

