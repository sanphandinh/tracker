import Dexie, { type EntityTable } from 'dexie'
import type {
  TrackingSheet,
  Attribute,
  Entity,
  CellValue,
} from './types'

/**
 * Tracker database with typed tables
 */
export class TrackerDatabase extends Dexie {
  sheets!: EntityTable<TrackingSheet, 'id'>
  attributes!: EntityTable<Attribute, 'id'>
  entities!: EntityTable<Entity, 'id'>
  cellValues!: EntityTable<CellValue, 'id'>

  constructor() {
    super('TrackerDB')

    this.version(1).stores({
      // Primary key and indexed fields
      sheets: 'id, name, updatedAt',
      attributes: 'id, sheetId, position',
      entities: 'id, sheetId, position',
      cellValues: 'id, entityId, attributeId, [entityId+attributeId]',
    })
  }
}

/** Singleton database instance */
export const db = new TrackerDatabase()

/**
 * Create a new tracking sheet with default "Điểm danh" attribute
 */
export async function createSheet(name: string): Promise<TrackingSheet> {
  const now = new Date()
  const sheetId = crypto.randomUUID()

  const sheet: TrackingSheet = {
    id: sheetId,
    name,
    createdAt: now,
    updatedAt: now,
  }

  // Create default boolean attribute
  const defaultAttribute: Attribute = {
    id: crypto.randomUUID(),
    sheetId,
    name: 'Điểm danh',
    type: 'boolean',
    position: 0,
  }

  await db.transaction('rw', db.sheets, db.attributes, async () => {
    await db.sheets.add(sheet)
    await db.attributes.add(defaultAttribute)
  })

  return sheet
}

/**
 * Add a single entity to a sheet
 */
export async function addEntity(
  sheetId: string,
  name: string
): Promise<Entity> {
  const maxPosition = await db.entities
    .where('sheetId')
    .equals(sheetId)
    .count()

  const entity: Entity = {
    id: crypto.randomUUID(),
    sheetId,
    name,
    position: maxPosition,
  }

  await db.entities.add(entity)
  await updateSheetTimestamp(sheetId)

  return entity
}

/**
 * Bulk add entities to a sheet
 */
export async function bulkAddEntities(
  sheetId: string,
  names: string[]
): Promise<Entity[]> {
  const startPosition = await db.entities
    .where('sheetId')
    .equals(sheetId)
    .count()

  const entities: Entity[] = names.map((name, index) => ({
    id: crypto.randomUUID(),
    sheetId,
    name,
    position: startPosition + index,
  }))

  await db.transaction('rw', db.entities, db.sheets, async () => {
    await db.entities.bulkAdd(entities)
    await updateSheetTimestamp(sheetId)
  })

  return entities
}

/**
 * Update an entity's name
 */
export async function updateEntity(
  entityId: string,
  name: string
): Promise<void> {
  const entity = await db.entities.get(entityId)
  if (!entity) throw new Error('Entity not found')

  await db.transaction('rw', db.entities, db.sheets, async () => {
    await db.entities.update(entityId, { name })
    await updateSheetTimestamp(entity.sheetId)
  })
}

/**
 * Delete an entity and its cell values
 */
export async function deleteEntity(entityId: string): Promise<void> {
  const entity = await db.entities.get(entityId)
  if (!entity) throw new Error('Entity not found')

  await db.transaction(
    'rw',
    db.entities,
    db.cellValues,
    db.sheets,
    async () => {
      await db.cellValues.where('entityId').equals(entityId).delete()
      await db.entities.delete(entityId)
      await updateSheetTimestamp(entity.sheetId)
    }
  )
}

/**
 * Reorder entities by updating their positions
 */
export async function reorderEntities(
  sheetId: string,
  entityIds: string[]
): Promise<void> {
  await db.transaction('rw', db.entities, db.sheets, async () => {
    for (let i = 0; i < entityIds.length; i++) {
      await db.entities.update(entityIds[i], { position: i })
    }
    await updateSheetTimestamp(sheetId)
  })
}

/**
 * Update a cell value
 */
export async function updateCellValue(
  entityId: string,
  attributeId: string,
  value: boolean | number | string | null
): Promise<void> {
  const entity = await db.entities.get(entityId)
  if (!entity) throw new Error('Entity not found')

  // Find existing cell value
  const existingCell = await db.cellValues
    .where('[entityId+attributeId]')
    .equals([entityId, attributeId])
    .first()

  await db.transaction('rw', db.cellValues, db.sheets, async () => {
    if (existingCell) {
      await db.cellValues.update(existingCell.id, { value })
    } else {
      const cellValue: CellValue = {
        id: crypto.randomUUID(),
        entityId,
        attributeId,
        value,
      }
      await db.cellValues.add(cellValue)
    }
    await updateSheetTimestamp(entity.sheetId)
  })
}

/**
 * Get a cell value
 */
export async function getCellValue(
  entityId: string,
  attributeId: string
): Promise<boolean | number | string | null> {
  const cell = await db.cellValues
    .where('[entityId+attributeId]')
    .equals([entityId, attributeId])
    .first()

  return cell?.value ?? null
}

/**
 * Get all cell values for an entity
 */
export async function getCellValuesForEntity(
  entityId: string
): Promise<CellValue[]> {
  return db.cellValues.where('entityId').equals(entityId).toArray()
}

/**
 * Add a new attribute to a sheet
 */
export async function addAttribute(
  sheetId: string,
  name: string,
  type: Attribute['type'],
  options?: { currencyValue?: number; dropdownOptions?: string[] }
): Promise<Attribute> {
  const maxPosition = await db.attributes
    .where('sheetId')
    .equals(sheetId)
    .count()

  const attribute: Attribute = {
    id: crypto.randomUUID(),
    sheetId,
    name,
    type,
    currencyValue: options?.currencyValue,
    options: options?.dropdownOptions,
    position: maxPosition,
  }

  await db.transaction('rw', db.attributes, db.sheets, async () => {
    await db.attributes.add(attribute)
    await updateSheetTimestamp(sheetId)
  })

  return attribute
}

/**
 * Update an attribute
 */
export async function updateAttribute(
  attributeId: string,
  updates: Partial<Pick<Attribute, 'name' | 'currencyValue' | 'options'>>
): Promise<void> {
  const attribute = await db.attributes.get(attributeId)
  if (!attribute) throw new Error('Attribute not found')

  await db.transaction('rw', db.attributes, db.sheets, async () => {
    await db.attributes.update(attributeId, updates)
    await updateSheetTimestamp(attribute.sheetId)
  })
}

/**
 * Delete an attribute and its cell values
 */
export async function deleteAttribute(attributeId: string): Promise<void> {
  const attribute = await db.attributes.get(attributeId)
  if (!attribute) throw new Error('Attribute not found')

  await db.transaction(
    'rw',
    db.attributes,
    db.cellValues,
    db.sheets,
    async () => {
      await db.cellValues.where('attributeId').equals(attributeId).delete()
      await db.attributes.delete(attributeId)
      await updateSheetTimestamp(attribute.sheetId)
    }
  )
}

/**
 * Helper function to update sheet's updatedAt timestamp
 */
async function updateSheetTimestamp(sheetId: string): Promise<void> {
  await db.sheets.update(sheetId, { updatedAt: new Date() })
}
