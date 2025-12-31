import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/tracker/db'
import { calculateSummary, type SheetSummary } from '@/lib/tracker/calculations'

export function useSummary(sheetId: string) {
  const sheets = useLiveQuery(() => db.sheets.where('id').equals(sheetId).toArray())
  const [data, setData] = useState<SheetSummary | null | undefined>(undefined)

  useEffect(() => {
    let mounted = true

    async function loadSummary() {
      if (!sheets || sheets.length === 0) {
        if (mounted) setData(null)
        return
      }
      const result = await calculateSummary(sheetId)
      if (mounted) setData(result)
    }

    loadSummary()
    return () => {
      mounted = false
    }
  }, [sheetId, sheets])

  return {
    summary: data,
    isLoading: data === undefined,
  }
}
