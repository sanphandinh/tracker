import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import 'fake-indexeddb/auto'
import {
  db,
  createSheet,
  addEntity,
  bulkAddEntities,
  reorderEntities,
  updateCellValue,
  getCellValue,
  getCellValuesForEntity,
  addAttribute,
} from './db'

/**
 * Setup function to clear database before each test
 */
export async function setupTestDb() {
  await db.delete()
  await db.open()
}

/**
 * Teardown function to clean up after tests
 */
export async function teardownTestDb() {
  await db.delete()
}

describe('TrackerDatabase', () => {
  beforeEach(async () => {
    await setupTestDb()
  })

  afterEach(async () => {
    await teardownTestDb()
  })

  describe('createSheet', () => {
    it('should create a sheet with default attribute', async () => {
      const sheet = await createSheet('Test Sheet')

      expect(sheet.name).toBe('Test Sheet')
      expect(sheet.id).toBeDefined()
      expect(sheet.createdAt).toBeInstanceOf(Date)

      // Verify sheet is in database
      const savedSheet = await db.sheets.get(sheet.id)
      expect(savedSheet).toBeDefined()
      expect(savedSheet?.name).toBe('Test Sheet')

      // Verify default attribute exists
      const attributes = await db.attributes
        .where('sheetId')
        .equals(sheet.id)
        .toArray()
      expect(attributes).toHaveLength(1)
      expect(attributes[0].name).toBe('Điểm danh')
      expect(attributes[0].type).toBe('boolean')
    })
  })

  describe('addEntity', () => {
    it('should add entity to sheet', async () => {
      const sheet = await createSheet('Test Sheet')
      const entity = await addEntity(sheet.id, 'John Doe')

      expect(entity.name).toBe('John Doe')
      expect(entity.sheetId).toBe(sheet.id)
      expect(entity.position).toBe(0)

      const savedEntity = await db.entities.get(entity.id)
      expect(savedEntity).toBeDefined()
    })

    it('should increment position for multiple entities', async () => {
      const sheet = await createSheet('Test Sheet')
      const entity1 = await addEntity(sheet.id, 'John Doe')
      const entity2 = await addEntity(sheet.id, 'Jane Smith')

      expect(entity1.position).toBe(0)
      expect(entity2.position).toBe(1)
    })
  })

  describe('bulkAddEntities', () => {
    it('should add multiple entities at once', async () => {
      const sheet = await createSheet('Test Sheet')
      const names = ['John', 'Jane', 'Bob']
      const entities = await bulkAddEntities(sheet.id, names)

      expect(entities).toHaveLength(3)
      expect(entities[0].name).toBe('John')
      expect(entities[1].name).toBe('Jane')
      expect(entities[2].name).toBe('Bob')

      expect(entities[0].position).toBe(0)
      expect(entities[1].position).toBe(1)
      expect(entities[2].position).toBe(2)
    })

    it('should append entities after existing ones', async () => {
      const sheet = await createSheet('Test Sheet')
      await bulkAddEntities(sheet.id, ['A', 'B'])

      const more = await bulkAddEntities(sheet.id, ['C', 'D'])

      expect(more[0].position).toBe(2)
      expect(more[1].position).toBe(3)
    })
  })

  describe('reorderEntities', () => {
    it('should update positions based on provided order', async () => {
      const sheet = await createSheet('Test Sheet')
      const entities = await bulkAddEntities(sheet.id, ['A', 'B', 'C'])

      await reorderEntities(sheet.id, [entities[2].id, entities[0].id, entities[1].id])

      const ordered = await db.entities
        .where('sheetId')
        .equals(sheet.id)
        .sortBy('position')

      expect(ordered[0].id).toBe(entities[2].id)
      expect(ordered[0].position).toBe(0)
      expect(ordered[1].id).toBe(entities[0].id)
      expect(ordered[1].position).toBe(1)
      expect(ordered[2].id).toBe(entities[1].id)
      expect(ordered[2].position).toBe(2)
    })
  })

  describe('updateCellValue', () => {
    it('should create a new cell value when none exists', async () => {
      const sheet = await createSheet('Test Sheet')
      const entity = await addEntity(sheet.id, 'John')
      const attributes = await db.attributes.where('sheetId').equals(sheet.id).toArray()
      const attributeId = attributes[0].id

      await updateCellValue(entity.id, attributeId, true)

      const cell = await db.cellValues
        .where('[entityId+attributeId]')
        .equals([entity.id, attributeId])
        .first()

      expect(cell).toBeDefined()
      expect(cell?.value).toBe(true)
    })

    it('should update existing cell value', async () => {
      const sheet = await createSheet('Test Sheet')
      const entity = await addEntity(sheet.id, 'John')
      const attributes = await db.attributes.where('sheetId').equals(sheet.id).toArray()
      const attributeId = attributes[0].id

      await updateCellValue(entity.id, attributeId, true)
      await updateCellValue(entity.id, attributeId, false)

      const cell = await db.cellValues
        .where('[entityId+attributeId]')
        .equals([entity.id, attributeId])
        .first()

      expect(cell?.value).toBe(false)
    })

    it('should handle different value types', async () => {
      const sheet = await createSheet('Test Sheet')
      const entity = await addEntity(sheet.id, 'John')

      // Add attributes of different types
      const boolAttr = await db.attributes.where('sheetId').equals(sheet.id).first()
      const numAttr = await addAttribute(sheet.id, 'Count', 'number')
      const textAttr = await addAttribute(sheet.id, 'Notes', 'text')

      // Test boolean
      await updateCellValue(entity.id, boolAttr!.id, true)
      let cell = await getCellValue(entity.id, boolAttr!.id)
      expect(cell).toBe(true)

      // Test number
      await updateCellValue(entity.id, numAttr.id, 42)
      cell = await getCellValue(entity.id, numAttr.id)
      expect(cell).toBe(42)

      // Test text
      await updateCellValue(entity.id, textAttr.id, 'test note')
      cell = await getCellValue(entity.id, textAttr.id)
      expect(cell).toBe('test note')

      // Test null
      await updateCellValue(entity.id, boolAttr!.id, null)
      cell = await getCellValue(entity.id, boolAttr!.id)
      expect(cell).toBeNull()
    })

    it('should throw error for non-existent entity', async () => {
      const fakeEntityId = crypto.randomUUID()
      const fakeAttributeId = crypto.randomUUID()

      await expect(updateCellValue(fakeEntityId, fakeAttributeId, true)).rejects.toThrow('Entity not found')
    })
  })

  describe('getCellValue', () => {
    it('should return null for non-existent cell', async () => {
      const sheet = await createSheet('Test Sheet')
      const entity = await addEntity(sheet.id, 'John')
      const attributes = await db.attributes.where('sheetId').equals(sheet.id).toArray()
      const attributeId = attributes[0].id

      const value = await getCellValue(entity.id, attributeId)

      expect(value).toBeNull()
    })

    it('should return correct value for existing cell', async () => {
      const sheet = await createSheet('Test Sheet')
      const entity = await addEntity(sheet.id, 'John')
      const attributes = await db.attributes.where('sheetId').equals(sheet.id).toArray()
      const attributeId = attributes[0].id

      await updateCellValue(entity.id, attributeId, true)
      const value = await getCellValue(entity.id, attributeId)

      expect(value).toBe(true)
    })
  })

  describe('getCellValuesForEntity', () => {
    it('should return all cell values for an entity', async () => {
      const sheet = await createSheet('Test Sheet')
      const entity = await addEntity(sheet.id, 'John')

      const attr1 = await db.attributes.where('sheetId').equals(sheet.id).first()
      const attr2 = await addAttribute(sheet.id, 'Count', 'number')
      const attr3 = await addAttribute(sheet.id, 'Notes', 'text')

      await updateCellValue(entity.id, attr1!.id, true)
      await updateCellValue(entity.id, attr2.id, 42)
      await updateCellValue(entity.id, attr3.id, 'test')

      const cells = await getCellValuesForEntity(entity.id)

      expect(cells).toHaveLength(3)
      expect(cells.some(c => c.value === true)).toBe(true)
      expect(cells.some(c => c.value === 42)).toBe(true)
      expect(cells.some(c => c.value === 'test')).toBe(true)
    })

    it('should return empty array for entity with no values', async () => {
      const sheet = await createSheet('Test Sheet')
      const entity = await addEntity(sheet.id, 'John')

      const cells = await getCellValuesForEntity(entity.id)

      expect(cells).toHaveLength(0)
    })
  })
})
