import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/tracker/db'
import type { Attribute } from '@/lib/tracker/types'

export function useAttributes(sheetId: string) {
  const attributes = useLiveQuery(
    () => db.attributes.where('sheetId').equals(sheetId).sortBy('position'),
    [sheetId]
  )

  const addAttribute = async (attribute: Attribute) => {
    await db.attributes.add(attribute)
    // Update sheet's updatedAt
    await db.sheets.update(sheetId, { updatedAt: new Date() })
  }

  const updateAttribute = async (id: string, updates: Partial<Attribute>) => {
    await db.attributes.update(id, updates)
    // Update sheet's updatedAt
    await db.sheets.update(sheetId, { updatedAt: new Date() })
  }

  const deleteAttribute = async (id: string) => {
    await db.attributes.delete(id)
    // Cascade delete cell values
    await db.cellValues.where('attributeId').equals(id).delete()
    // Update sheet's updatedAt
    await db.sheets.update(sheetId, { updatedAt: new Date() })
  }

  const reorderAttributes = async (attributeIds: string[]) => {
    for (let i = 0; i < attributeIds.length; i++) {
      await db.attributes.update(attributeIds[i], { position: i })
    }
    // Update sheet's updatedAt
    await db.sheets.update(sheetId, { updatedAt: new Date() })
  }

  return {
    attributes: attributes ?? [],
    isLoading: attributes === undefined,
    addAttribute,
    updateAttribute,
    deleteAttribute,
    reorderAttributes,
  }
}
