import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { db } from './db'
import { calculateSummary } from './calculations'
import type { TrackingSheet, Attribute, Entity } from './types'
import { v4 as uuidv4 } from 'uuid'

describe('calculateSummary', () => {
  let sheetId: string
  let booleanAttrId: string
  let booleanCurrencyAttrId: string
  let numberAttrId: string
  let dropdownAttrId: string
  let entity1Id: string
  let entity2Id: string
  let entity3Id: string

  beforeEach(async () => {
    // Clear all tables
    await db.sheets.clear()
    await db.attributes.clear()
    await db.entities.clear()
    await db.cellValues.clear()

    // Create a test sheet
    sheetId = uuidv4()
    const sheet: TrackingSheet = {
      id: sheetId,
      name: 'Test Sheet',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await db.sheets.add(sheet)

    // Create test attributes
    booleanAttrId = uuidv4()
    const booleanAttr: Attribute = {
      id: booleanAttrId,
      sheetId,
      name: 'Điểm danh',
      type: 'boolean',
      position: 0,
    }
    await db.attributes.add(booleanAttr)

    booleanCurrencyAttrId = uuidv4()
    const booleanCurrencyAttr: Attribute = {
      id: booleanCurrencyAttrId,
      sheetId,
      name: 'Tiền ăn 150k',
      type: 'boolean-currency',
      currencyValue: 150000,
      position: 1,
    }
    await db.attributes.add(booleanCurrencyAttr)

    numberAttrId = uuidv4()
    const numberAttr: Attribute = {
      id: numberAttrId,
      sheetId,
      name: 'Điểm số',
      type: 'number',
      position: 2,
    }
    await db.attributes.add(numberAttr)

    dropdownAttrId = uuidv4()
    const dropdownAttr: Attribute = {
      id: dropdownAttrId,
      sheetId,
      name: 'Mức độ',
      type: 'dropdown',
      options: ['Thấp', 'Trung bình', 'Cao'],
      position: 3,
    }
    await db.attributes.add(dropdownAttr)

    // Create test entities
    entity1Id = uuidv4()
    const entity1: Entity = {
      id: entity1Id,
      sheetId,
      name: 'Nguyễn Văn A',
      position: 0,
    }
    await db.entities.add(entity1)

    entity2Id = uuidv4()
    const entity2: Entity = {
      id: entity2Id,
      sheetId,
      name: 'Trần Thị B',
      position: 1,
    }
    await db.entities.add(entity2)

    entity3Id = uuidv4()
    const entity3: Entity = {
      id: entity3Id,
      sheetId,
      name: 'Lê Văn C',
      position: 2,
    }
    await db.entities.add(entity3)

    // Create test cell values
    // Boolean attribute: 2 true, 1 false
    await db.cellValues.add({
      id: uuidv4(),
      entityId: entity1Id,
      attributeId: booleanAttrId,
      value: true,
    })
    await db.cellValues.add({
      id: uuidv4(),
      entityId: entity2Id,
      attributeId: booleanAttrId,
      value: true,
    })
    await db.cellValues.add({
      id: uuidv4(),
      entityId: entity3Id,
      attributeId: booleanAttrId,
      value: false,
    })

    // Boolean-currency attribute: 2 true, 1 null
    await db.cellValues.add({
      id: uuidv4(),
      entityId: entity1Id,
      attributeId: booleanCurrencyAttrId,
      value: true,
    })
    await db.cellValues.add({
      id: uuidv4(),
      entityId: entity2Id,
      attributeId: booleanCurrencyAttrId,
      value: true,
    })

    // Number attribute: 85, 92, 78
    await db.cellValues.add({
      id: uuidv4(),
      entityId: entity1Id,
      attributeId: numberAttrId,
      value: 85,
    })
    await db.cellValues.add({
      id: uuidv4(),
      entityId: entity2Id,
      attributeId: numberAttrId,
      value: 92,
    })
    await db.cellValues.add({
      id: uuidv4(),
      entityId: entity3Id,
      attributeId: numberAttrId,
      value: 78,
    })

    // Dropdown attribute: Cao, Cao, Trung bình
    await db.cellValues.add({
      id: uuidv4(),
      entityId: entity1Id,
      attributeId: dropdownAttrId,
      value: 'Cao',
    })
    await db.cellValues.add({
      id: uuidv4(),
      entityId: entity2Id,
      attributeId: dropdownAttrId,
      value: 'Cao',
    })
    await db.cellValues.add({
      id: uuidv4(),
      entityId: entity3Id,
      attributeId: dropdownAttrId,
      value: 'Trung bình',
    })
  })

  afterEach(async () => {
    await db.sheets.clear()
    await db.attributes.clear()
    await db.entities.clear()
    await db.cellValues.clear()
  })

  it('should calculate boolean summary correctly', async () => {
    const summary = await calculateSummary(sheetId)

    const booleanSummary = summary.attributeSummaries.find(
      (s) => s.attributeId === booleanAttrId
    )

    expect(booleanSummary).toBeDefined()
    expect(booleanSummary).toMatchObject({
      attributeId: booleanAttrId,
      checked: 2,
      total: 3,
      percentage: expect.closeTo(66.67, 2),
    })
  })

  it('should calculate boolean-currency summary with subtotal', async () => {
    const summary = await calculateSummary(sheetId)

    const currencySummary = summary.attributeSummaries.find(
      (s) => s.attributeId === booleanCurrencyAttrId
    )

    expect(currencySummary).toBeDefined()
    expect(currencySummary).toMatchObject({
      attributeId: booleanCurrencyAttrId,
      checked: 2,
      total: 3,
      percentage: expect.closeTo(66.67, 2),
      subtotal: 300000, // 2 × 150000
    })
  })

  it('should calculate number summary with statistics', async () => {
    const summary = await calculateSummary(sheetId)

    const numberSummary = summary.attributeSummaries.find(
      (s) => s.attributeId === numberAttrId
    )

    expect(numberSummary).toBeDefined()
    expect(numberSummary).toMatchObject({
      attributeId: numberAttrId,
      sum: 255, // 85 + 92 + 78
      average: 85, // 255 / 3
      min: 78,
      max: 92,
      count: 3,
    })
  })

  it('should calculate dropdown summary with option counts', async () => {
    const summary = await calculateSummary(sheetId)

    const dropdownSummary = summary.attributeSummaries.find(
      (s) => s.attributeId === dropdownAttrId
    )

    expect(dropdownSummary).toBeDefined()
    expect(dropdownSummary).toMatchObject({
      attributeId: dropdownAttrId,
      counts: {
        Cao: 2,
        'Trung bình': 1,
      },
    })
  })

  it('should calculate grand total from all boolean-currency subtotals', async () => {
    const summary = await calculateSummary(sheetId)

    // Only one boolean-currency attribute with subtotal 300000
    expect(summary.grandTotal).toBe(300000)
  })

  it('should handle empty cell values gracefully', async () => {
    // Clear all cell values
    await db.cellValues.clear()

    const summary = await calculateSummary(sheetId)

    const booleanSummary = summary.attributeSummaries.find(
      (s) => s.attributeId === booleanAttrId
    )

    expect(booleanSummary).toMatchObject({
      attributeId: booleanAttrId,
      checked: 0,
      total: 3,
      percentage: 0,
    })

    const numberSummary = summary.attributeSummaries.find(
      (s) => s.attributeId === numberAttrId
    )

    expect(numberSummary).toMatchObject({
      attributeId: numberAttrId,
      sum: 0,
      average: 0,
      min: Infinity,
      max: -Infinity,
      count: 0,
    })

    expect(summary.grandTotal).toBe(0)
  })

  it('should handle sheet with no entities', async () => {
    // Clear entities
    await db.entities.clear()
    await db.cellValues.clear()

    const summary = await calculateSummary(sheetId)

    const booleanSummary = summary.attributeSummaries.find(
      (s) => s.attributeId === booleanAttrId
    )

    expect(booleanSummary).toMatchObject({
      attributeId: booleanAttrId,
      checked: 0,
      total: 0,
      percentage: 0,
    })
  })

  it('should handle null values in boolean attributes', async () => {
    // Add entity with null boolean value
    const entity4Id = uuidv4()
    await db.entities.add({
      id: entity4Id,
      sheetId,
      name: 'Phạm Thị D',
      position: 3,
    })

    await db.cellValues.add({
      id: uuidv4(),
      entityId: entity4Id,
      attributeId: booleanAttrId,
      value: null,
    })

    const summary = await calculateSummary(sheetId)

    const booleanSummary = summary.attributeSummaries.find(
      (s) => s.attributeId === booleanAttrId
    )

    // Null values should not be counted as checked
    expect(booleanSummary).toMatchObject({
      attributeId: booleanAttrId,
      checked: 2, // Still 2 from before
      total: 4, // Now 4 entities
      percentage: 50,
    })
  })

  it('should handle multiple boolean-currency attributes in grand total', async () => {
    // Add another boolean-currency attribute
    const attr2Id = uuidv4()
    await db.attributes.add({
      id: attr2Id,
      sheetId,
      name: 'Tiền gửi xe 10k',
      type: 'boolean-currency',
      currencyValue: 10000,
      position: 4,
    })

    // Add values: all 3 entities check this
    await db.cellValues.add({
      id: uuidv4(),
      entityId: entity1Id,
      attributeId: attr2Id,
      value: true,
    })
    await db.cellValues.add({
      id: uuidv4(),
      entityId: entity2Id,
      attributeId: attr2Id,
      value: true,
    })
    await db.cellValues.add({
      id: uuidv4(),
      entityId: entity3Id,
      attributeId: attr2Id,
      value: true,
    })

    const summary = await calculateSummary(sheetId)

    // Grand total = 300000 (from first) + 30000 (from second)
    expect(summary.grandTotal).toBe(330000)
  })
})
