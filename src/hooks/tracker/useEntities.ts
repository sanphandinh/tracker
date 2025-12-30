import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  addEntity as addEntityDb,
  bulkAddEntities as bulkAddEntitiesDb,
  updateEntity as updateEntityDb,
  deleteEntity as deleteEntityDb,
  reorderEntities as reorderEntitiesDb,
  db,
} from '@/lib/tracker/db'
import type { Entity } from '@/lib/tracker/types'

interface UseEntitiesResult {
  entities: Entity[]
  isLoading: boolean
  isMutating: boolean
  error: string | null
  addEntity: (name: string) => Promise<Entity | void>
  bulkAddEntities: (names: string[]) => Promise<Entity[] | void>
  updateEntity: (entityId: string, name: string) => Promise<void>
  deleteEntity: (entityId: string) => Promise<void>
  reorderEntities: (entityIds: string[]) => Promise<void>
}

export function useEntities(sheetId: string): UseEntitiesResult {
  const [isMutating, setIsMutating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const entities = useLiveQuery(
    () => db.entities.where('sheetId').equals(sheetId).sortBy('position'),
    [sheetId]
  )

  const handleMutation = async <T>(fn: () => Promise<T>) => {
    setIsMutating(true)
    setError(null)
    try {
      return await fn()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đã xảy ra lỗi'
      setError(message)
      throw err
    } finally {
      setIsMutating(false)
    }
  }

  const handleAddEntity = (name: string) =>
    handleMutation(() => addEntityDb(sheetId, name.trim()))

  const handleBulkAddEntities = (names: string[]) =>
    handleMutation(() => bulkAddEntitiesDb(sheetId, names))

  const handleUpdateEntity = (entityId: string, name: string) =>
    handleMutation(() => updateEntityDb(entityId, name.trim()))

  const handleDeleteEntity = (entityId: string) =>
    handleMutation(() => deleteEntityDb(entityId))

  const handleReorderEntities = (entityIds: string[]) =>
    handleMutation(() => reorderEntitiesDb(sheetId, entityIds))

  return {
    entities: entities ?? [],
    isLoading: entities === undefined,
    isMutating,
    error,
    addEntity: handleAddEntity,
    bulkAddEntities: handleBulkAddEntities,
    updateEntity: handleUpdateEntity,
    deleteEntity: handleDeleteEntity,
    reorderEntities: handleReorderEntities,
  }
}
