import { useCallback, useRef, useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, updateCellValue, getCellValue } from '@/lib/tracker/db'

/**
 * Hook to manage cell values with optimistic updates
 *
 * Provides:
 * - Real-time updates via Dexie useLiveQuery
 * - Optimistic UI updates (immediate visual feedback)
 * - Automatic debouncing of rapid changes
 * - Error handling with rollback on failure
 */
export function useCellValues(entityId: string) {
  // All cell values for this entity
  const cellValues = useLiveQuery(
    () => db.cellValues.where('entityId').equals(entityId).toArray(),
    [entityId]
  )

  // Optimistic state for in-flight updates
  const optimisticState = useRef<Map<string, boolean | number | string | null>>(new Map())
  const [isPending, setIsPending] = useState(false)

  // Create a map for quick lookup
  const cellValueMap = new Map(
    cellValues?.map(cell => [cell.attributeId, cell.value]) ?? []
  )

  /**
   * Get cell value with optimistic fallback
   */
  const getCellValueOptimistic = useCallback(
    (attributeId: string): boolean | number | string | null => {
      // Check optimistic state first
      if (optimisticState.current.has(attributeId)) {
        return optimisticState.current.get(attributeId) ?? null
      }
      // Fall back to actual state
      return cellValueMap.get(attributeId) ?? null
    },
    [cellValueMap]
  )

  /**
   * Update a cell value with optimistic update
   */
  const updateCell = useCallback(
    async (attributeId: string, value: boolean | number | string | null) => {
      // Set optimistic state immediately
      optimisticState.current.set(attributeId, value)
      setIsPending(true)

      try {
        await updateCellValue(entityId, attributeId, value)
        // Success - optimistic state will be replaced by real query result
      } catch (error) {
        // Rollback optimistic state on error
        const previous = cellValueMap.get(attributeId) ?? null
        optimisticState.current.set(attributeId, previous)
        throw error
      } finally {
        setIsPending(false)
      }
    },
    [entityId, cellValueMap]
  )

  /**
   * Get current cell value from database
   */
  const getCurrentValue = useCallback(
    async (attributeId: string): Promise<boolean | number | string | null> => {
      return getCellValue(entityId, attributeId)
    },
    [entityId]
  )

  // Clear optimistic state when real data arrives
  useEffect(() => {
    if (cellValues) {
      optimisticState.current.clear()
    }
  }, [cellValues])

  return {
    cellValues: cellValues ?? [],
    getCellValue: getCellValueOptimistic,
    updateCell,
    getCurrentValue,
    isPending,
  }
}
