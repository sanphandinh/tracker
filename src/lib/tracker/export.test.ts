import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { db } from './db'
import { exportSheetToExcel, exportSheetToCSV } from './export'
import type { TrackingSheet, Attribute, Entity, CellValue } from './types'
import { v4 as uuidv4 } from 'uuid'

describe('Export Functions', () => {
  let sheetId: string
  let booleanAttrId: string
  let numberAttrId: string
  let entity1Id: string
  let entity2Id: string

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

    booleanAttrId = uuidv4()
    const booleanAttr: Attribute = {
      id: booleanAttrId,
      sheetId,
      name: 'Điểm danh',
      type: 'boolean',
      position: 0,
    }
    await db.attributes.add(booleanAttr)

    numberAttrId = uuidv4()
    const numberAttr: Attribute = {
      id: numberAttrId,
      sheetId,
      name: 'Điểm',
      type: 'number',
      position: 1,
    }
    await db.attributes.add(numberAttr)

    entity1Id = uuidv4()
    const entity1: Entity = {
      id: entity1Id,
      sheetId,
      name: 'Sinh viên 1',
      position: 0,
    }
    await db.entities.add(entity1)

    entity2Id = uuidv4()
    const entity2: Entity = {
      id: entity2Id,
      sheetId,
      name: 'Sinh viên 2',
      position: 1,
    }
    await db.entities.add(entity2)

    const cellValues: CellValue[] = [
      { id: uuidv4(), entityId: entity1Id, attributeId: booleanAttrId, value: true },
      { id: uuidv4(), entityId: entity1Id, attributeId: numberAttrId, value: 85 },
      { id: uuidv4(), entityId: entity2Id, attributeId: booleanAttrId, value: false },
      { id: uuidv4(), entityId: entity2Id, attributeId: numberAttrId, value: 92 },
    ]
    await db.cellValues.bulkAdd(cellValues)
  })

  afterEach(async () => {
    await db.sheets.clear()
    await db.attributes.clear()
    await db.entities.clear()
    await db.cellValues.clear()
  })

  it('should export sheet to Excel format', async () => {
    const result = await exportSheetToExcel(sheetId)

    expect(result).toBeDefined()
  })

  it('should export sheet to CSV format', async () => {
    const csv = await exportSheetToCSV(sheetId)

    expect(csv).toBeDefined()
    expect(csv).toContain('Sinh viên 1')
    expect(csv).toContain('Sinh viên 2')
    expect(csv).toContain('Điểm danh')
    expect(csv).toContain('Điểm')
  })

  it('should include all entities in export', async () => {
    const csv = await exportSheetToCSV(sheetId)

    const lines = csv.split('\n')
    // Should have header + 2 entities + empty line
    expect(lines.length).toBeGreaterThanOrEqual(3)
  })

  it('should handle empty sheets in export', async () => {
    const emptySheetId = uuidv4()
    const emptySheet: TrackingSheet = {
      id: emptySheetId,
      name: 'Empty Sheet',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await db.sheets.add(emptySheet)

    const csv = await exportSheetToCSV(emptySheetId)

    expect(csv).toBeDefined()
    // Should at least have the sheet name or be empty
    expect(typeof csv).toBe('string')
  })
})
