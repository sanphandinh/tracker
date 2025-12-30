import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/tracker/db'
import type { TrackingSheet } from '@/lib/tracker/types'

interface UseSheetsResult {
  sheets: TrackingSheet[]
  isLoading: boolean
  error: string | null
}

/**
 * Hook to fetch all tracking sheets, sorted by last modified date
 *
 * Provides:
 * - Real-time updates via Dexie useLiveQuery
 * - Automatic sorting by updatedAt (newest first)
 * - Loading and error states
 *
 * Use this for the home screen to show all available sheets
 */
export function useSheets(): UseSheetsResult {
  const sheets = useLiveQuery(
    () => db.sheets.orderBy('updatedAt').reverse().toArray(),
    []
  )

  const isLoading = sheets === undefined
  const error = !isLoading && sheets === null ? 'Không thể tải danh sách sheet' : null

  return {
    sheets: sheets ?? [],
    isLoading,
    error,
  }
}

