import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import 'fake-indexeddb/auto'
import {
  db,
  createSheet,
  addEntity,
  bulkAddEntities,
  reorderEntities,
} from './db'
import type { TrackingSheet, Entity } from './types'

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
})
