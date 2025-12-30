import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/tracker/db'
import type { TrackingSheet, Entity, Attribute } from '@/lib/tracker/types'

interface UseSheetResult {
  sheet: TrackingSheet | undefined
  entities: Entity[]
  attributes: Attribute[]
  isLoading: boolean
  error: string | null
}

/**
 * Hook to fetch a complete sheet with all entities and attributes
 *
 * Provides:
 * - Real-time updates via Dexie useLiveQuery
 * - Sorted entities by position
 * - Sorted attributes by position
 * - Loading and error states
 */
export function useSheet(sheetId: string): UseSheetResult {
  const sheet = useLiveQuery(
    () => db.sheets.get(sheetId),
    [sheetId]
  )

  const entities = useLiveQuery(
    () => db.entities.where('sheetId').equals(sheetId).sortBy('position'),
    [sheetId]
  )

  const attributes = useLiveQuery(
    () => db.attributes.where('sheetId').equals(sheetId).sortBy('position'),
    [sheetId]
  )

  const isLoading = sheet === undefined || entities === undefined || attributes === undefined

  // For now, we don't have a way to distinguish between "loading" and "not found"
  // Once loaded, if sheet is null, it means it doesn't exist (error condition)
  const error = !isLoading && sheet === null ? 'Không tìm thấy sheet' : null

  return {
    sheet,
    entities: entities ?? [],
    attributes: attributes ?? [],
    isLoading,
    error,
  }
}

