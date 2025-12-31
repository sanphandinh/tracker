import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { db } from './db'
import type { TrackingSheet, Attribute, Entity } from './types'
import { v4 as uuidv4 } from 'uuid'

describe('Attribute CRUD Operations', () => {
  let sheetId: string

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
  })

  afterEach(async () => {
    await db.sheets.clear()
    await db.attributes.clear()
    await db.entities.clear()
    await db.cellValues.clear()
  })

  it('should add an attribute to a sheet', async () => {
    const attributeId = uuidv4()
    const attribute: Attribute = {
      id: attributeId,
      sheetId,
      name: 'Mới',
      type: 'text',
      position: 0,
    }

    await db.attributes.add(attribute)

    const stored = await db.attributes.get(attributeId)
    expect(stored).toEqual(attribute)
  })

  it('should update an attribute', async () => {
    const attributeId = uuidv4()
    const attribute: Attribute = {
      id: attributeId,
      sheetId,
      name: 'Cũ',
      type: 'text',
      position: 0,
    }

    await db.attributes.add(attribute)

    const updated = {
      name: 'Mới',
      type: 'number' as const,
    }

    await db.attributes.update(attributeId, updated)

    const stored = await db.attributes.get(attributeId)
    expect(stored?.name).toBe('Mới')
    expect(stored?.type).toBe('number')
  })

  it('should delete an attribute', async () => {
    const attributeId = uuidv4()
    const attribute: Attribute = {
      id: attributeId,
      sheetId,
      name: 'Xóa',
      type: 'text',
      position: 0,
    }

    await db.attributes.add(attribute)
    await db.attributes.delete(attributeId)

    const stored = await db.attributes.get(attributeId)
    expect(stored).toBeUndefined()
  })

  it('should get all attributes for a sheet', async () => {
    const attr1: Attribute = {
      id: uuidv4(),
      sheetId,
      name: 'Thuộc tính 1',
      type: 'boolean',
      position: 0,
    }
    const attr2: Attribute = {
      id: uuidv4(),
      sheetId,
      name: 'Thuộc tính 2',
      type: 'number',
      position: 1,
    }

    await db.attributes.bulkAdd([attr1, attr2])

    const attributes = await db.attributes.where('sheetId').equals(sheetId).sortBy('position')
    expect(attributes).toHaveLength(2)
    expect(attributes[0].name).toBe('Thuộc tính 1')
    expect(attributes[1].name).toBe('Thuộc tính 2')
  })

  it('should handle attribute deletion with associated cell values', async () => {
    const attributeId = uuidv4()
    const attribute: Attribute = {
      id: attributeId,
      sheetId,
      name: 'Xóa',
      type: 'text',
      position: 0,
    }

    const entity: Entity = {
      id: uuidv4(),
      sheetId,
      name: 'Sinh viên',
      position: 0,
    }

    await db.attributes.add(attribute)
    await db.entities.add(entity)

    // Add a cell value
    await db.cellValues.add({
      id: uuidv4(),
      entityId: entity.id,
      attributeId,
      value: 'test',
    })

    // Delete the attribute
    await db.attributes.delete(attributeId)

    // Verify attribute is deleted
    const stored = await db.attributes.get(attributeId)
    expect(stored).toBeUndefined()

    // Note: In a real app, you might want to cascade delete cell values
    // For now, we just verify the attribute is deleted
  })
})
