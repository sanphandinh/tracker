import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { db } from './db'
import { createBackup, restoreBackup } from './backup'
import type { TrackingSheet, Attribute, Entity, CellValue } from './types'
import { v4 as uuidv4 } from 'uuid'

describe('Backup and Restore', () => {
  let sheetId: string
  let attributeId: string
  let entityId: string

  beforeEach(async () => {
    await db.sheets.clear()
    await db.attributes.clear()
    await db.entities.clear()
    await db.cellValues.clear()

    sheetId = uuidv4()
    const sheet: TrackingSheet = {
      id: sheetId,
      name: 'Test Sheet',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await db.sheets.add(sheet)

    attributeId = uuidv4()
    const attribute: Attribute = {
      id: attributeId,
      sheetId,
      name: 'Điểm danh',
      type: 'boolean',
      position: 0,
    }
    await db.attributes.add(attribute)

    entityId = uuidv4()
    const entity: Entity = {
      id: entityId,
      sheetId,
      name: 'Sinh viên',
      position: 0,
    }
    await db.entities.add(entity)

    const cellValue: CellValue = {
      id: uuidv4(),
      entityId,
      attributeId,
      value: true,
    }
    await db.cellValues.add(cellValue)
  })

  afterEach(async () => {
    await db.sheets.clear()
    await db.attributes.clear()
    await db.entities.clear()
    await db.cellValues.clear()
  })

  it('should create a valid backup', async () => {
    const backup = await createBackup()

    expect(backup).toBeDefined()
    expect(typeof backup).toBe('string')

    const parsed = JSON.parse(backup)
    expect(parsed).toHaveProperty('version')
    expect(parsed).toHaveProperty('timestamp')
    expect(parsed).toHaveProperty('sheets')
    expect(parsed).toHaveProperty('attributes')
    expect(parsed).toHaveProperty('entities')
    expect(parsed).toHaveProperty('cellValues')
  })

  it('should include all data in backup', async () => {
    const backup = await createBackup()
    const parsed = JSON.parse(backup)

    expect(parsed.sheets).toHaveLength(1)
    expect(parsed.sheets[0].id).toBe(sheetId)

    expect(parsed.attributes).toHaveLength(1)
    expect(parsed.attributes[0].id).toBe(attributeId)

    expect(parsed.entities).toHaveLength(1)
    expect(parsed.entities[0].id).toBe(entityId)

    expect(parsed.cellValues).toHaveLength(1)
  })

  it('should restore backup to empty database', async () => {
    const backup = await createBackup()

    // Clear database
    await db.sheets.clear()
    await db.attributes.clear()
    await db.entities.clear()
    await db.cellValues.clear()

    // Restore
    await restoreBackup(backup)

    // Verify data is restored
    const sheets = await db.sheets.toArray()
    expect(sheets).toHaveLength(1)
    expect(sheets[0].id).toBe(sheetId)

    const attributes = await db.attributes.toArray()
    expect(attributes).toHaveLength(1)
    expect(attributes[0].id).toBe(attributeId)

    const entities = await db.entities.toArray()
    expect(entities).toHaveLength(1)
    expect(entities[0].id).toBe(entityId)

    const cellValues = await db.cellValues.toArray()
    expect(cellValues).toHaveLength(1)
  })

  it('should preserve data integrity on restore', async () => {
    const backup = await createBackup()

    await db.sheets.clear()
    await db.attributes.clear()
    await db.entities.clear()
    await db.cellValues.clear()

    await restoreBackup(backup)

    const restoredSheet = await db.sheets.get(sheetId)
    expect(restoredSheet?.name).toBe('Test Sheet')

    const restoredAttr = await db.attributes.get(attributeId)
    expect(restoredAttr?.name).toBe('Điểm danh')
    expect(restoredAttr?.type).toBe('boolean')

    const restoredEntity = await db.entities.get(entityId)
    expect(restoredEntity?.name).toBe('Sinh viên')

    const restoredCell = await db.cellValues.where('entityId').equals(entityId).first()
    expect(restoredCell?.value).toBe(true)
  })

  it('should handle invalid backup format', async () => {
    const invalidBackup = '{"invalid": "data"}'

    await expect(async () => {
      await restoreBackup(invalidBackup)
    }).rejects.toThrow()
  })
})
