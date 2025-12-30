import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CellInput } from './cell-input'
import { useCellValues } from '@/hooks/tracker/useCellValues'
import type { Entity, Attribute } from '@/lib/tracker/types'

export interface MarkingModeProps {
  /** All entities in order (by position) */
  entities: Entity[]
  /** Primary attribute for sequential marking (usually first attribute) */
  primaryAttribute: Attribute
  /** Optional CSS class */
  className?: string
  /** Callback when marking is complete */
  onComplete?: () => void
}

/**
 * MarkingMode component - Sequential marking interface with auto-advance
 *
 * Primary use case: Attendance marking where user calls names in order
 * and marks each entity with a single tap, automatically advancing to next.
 *
 * Features:
 * - Focused entity display (one at a time)
 * - Auto-advance to next unmarked entity after marking
 * - Go back navigation to correct previous marks
 * - Completion summary when all entities marked
 * - Large touch targets for mobile use
 */
export function MarkingMode({
  entities,
  primaryAttribute,
  className,
  onComplete,
}: MarkingModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [markedCount, setMarkedCount] = useState(0)

  const currentEntity = entities[currentIndex]
  const isLastEntity = currentIndex === entities.length - 1
  const isComplete = markedCount === entities.length

  const { getCellValue, updateCell } = useCellValues(currentEntity?.id || '')

  /**
   * Get cell value for primary attribute
   */
  const currentValue = currentEntity
    ? getCellValue(primaryAttribute.id)
    : null

  /**
   * Note: Marked count is updated via handleMark callback
   * When component mounts or entities change, reset count to 0
   */
  useEffect(() => {
    setMarkedCount(0)
  }, [entities])

  /**
   * Auto-advance to next unmarked entity after marking
   * Note: We track marked entities locally since we can't call hooks in loops
   */
  const handleMark = useCallback(
    async (value: boolean | number | string | null) => {
      if (!currentEntity) return

      await updateCell(primaryAttribute.id, value)

      // Update marked count if value is not null
      if (value !== null) {
        setMarkedCount((prev) => Math.min(prev + 1, entities.length))
      }

      // Auto-advance to next entity (sequential marking)
      if (!isLastEntity) {
        setCurrentIndex(currentIndex + 1)
      } else {
        // Last entity - marking complete
        if (onComplete) {
          onComplete()
        }
      }
    },
    [
      currentEntity,
      currentIndex,
      entities,
      isLastEntity,
      onComplete,
      primaryAttribute.id,
      updateCell,
    ]
  )

  /**
   * Handle boolean quick actions (Present/Absent)
   */
  const handleBooleanAction = useCallback(
    (value: boolean) => {
      handleMark(value)
    },
    [handleMark]
  )

  /**
   * Go back to previous entity
   */
  const handleGoBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }, [currentIndex])

  /**
   * Go forward to next entity
   */
  const handleGoForward = useCallback(() => {
    if (currentIndex < entities.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }, [currentIndex, entities.length])

  /**
   * Skip to specific entity
   */
  const handleSkipTo = useCallback((index: number) => {
    if (index >= 0 && index < entities.length) {
      setCurrentIndex(index)
    }
  }, [entities.length])

  if (!currentEntity) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <p className="text-muted-foreground">Không có thực thể nào để đánh dấu</p>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-6 p-8', className)}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary">✓ Hoàn thành!</h2>
          <p className="mt-2 text-muted-foreground">
            Đã đánh dấu {markedCount}/{entities.length} thực thể
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(0)}
          >
            Xem lại từ đầu
          </Button>
          {onComplete && (
            <Button onClick={onComplete}>
              Hoàn tất
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-6 p-4', className)}>
      {/* Progress indicator */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {currentIndex + 1} / {entities.length}
        </p>
        <p className="text-sm font-medium">
          Đã đánh dấu: {markedCount}/{entities.length}
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(markedCount / entities.length) * 100}%` }}
        />
      </div>

      {/* Current entity display */}
      <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-6">
        <h3 className="text-2xl font-bold">{currentEntity.name}</h3>

        {/* Current value indicator */}
        {currentValue !== null && (
          <p className="text-sm text-muted-foreground">
            Hiện tại:{' '}
            {typeof currentValue === 'boolean'
              ? currentValue
                ? '✓ Có mặt'
                : '✗ Vắng mặt'
              : String(currentValue)}
          </p>
        )}

        {/* Quick actions for boolean/boolean-currency */}
        {(primaryAttribute.type === 'boolean' ||
          primaryAttribute.type === 'boolean-currency') && (
          <div className="flex gap-3">
            <Button
              size="lg"
              variant="default"
              className="min-h-11 min-w-30"
              onClick={() => handleBooleanAction(true)}
            >
              ✓ Có mặt
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-h-11 min-w-30"
              onClick={() => handleBooleanAction(false)}
            >
              ✗ Vắng mặt
            </Button>
          </div>
        )}

        {/* Cell input for other types */}
        {primaryAttribute.type !== 'boolean' &&
          primaryAttribute.type !== 'boolean-currency' && (
          <div className="w-full max-w-xs">
            <CellInput
              attribute={primaryAttribute}
              value={currentValue}
              onChange={handleMark}
              className="min-h-11"
            />
          </div>
        )}
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={handleGoBack}
          disabled={currentIndex === 0}
          className="min-h-11 flex-1"
        >
          ← Quay lại
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleGoForward}
          disabled={isLastEntity}
          className="min-h-11 flex-1"
        >
          Tiếp theo →
        </Button>
      </div>

      {/* Entity quick navigation */}
      <div className="flex flex-wrap gap-2">
        {entities.map((entity, idx) => {
          // Marked status is tracked by whether cell has a value
          // We can't call hooks here, so we'll show all entities
          const isCurrent = idx === currentIndex

          return (
            <button
              key={entity.id}
              onClick={() => handleSkipTo(idx)}
              className={cn(
                'flex h-10 min-w-10 items-center justify-center rounded-md border text-sm font-medium transition-colors',
                isCurrent && 'border-primary bg-primary text-primary-foreground',
                !isCurrent && 'border-muted-foreground/20 bg-background hover:bg-muted'
              )}
              title={entity.name}
            >
              {idx + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
}
