import Dexie from 'dexie'
import { indexedDB, IDBKeyRange } from 'fake-indexeddb'
import { performance } from 'node:perf_hooks'

// Configure Dexie dependencies before loading the db singleton
Dexie.dependencies.indexedDB = indexedDB as unknown as IDBFactory
Dexie.dependencies.IDBKeyRange = IDBKeyRange as unknown as typeof IDBKeyRange

const { db, createSheet, addAttribute, bulkAddEntities, updateCellValue } = await import('../src/lib/tracker/db')

interface PerfResult {
  toggleMs: number
  sheetLoadMs: number
  cellLoadMs: number
  entityCount: number
  attributeCount: number
  cellCount: number
}

async function seedData(): Promise<{ sheetId: string; entityIds: string[]; attributeIds: string[] }> {
  await db.delete()
  await db.open()

  const sheet = await createSheet('Performance Sheet')

  const defaultAttribute = await db.attributes.where('sheetId').equals(sheet.id).first()

  const dropdownOptions = ['Mức 1', 'Mức 2', 'Mức 3']

  const attributes = [
    defaultAttribute,
    await addAttribute(sheet.id, 'Tiền ăn 150k', 'boolean-currency', { currencyValue: 150_000 }),
    await addAttribute(sheet.id, 'Điểm số', 'number'),
    await addAttribute(sheet.id, 'Ghi chú', 'text'),
    await addAttribute(sheet.id, 'Mức hỗ trợ', 'dropdown', { dropdownOptions }),
  ].filter(Boolean)

  const entityNames = Array.from({ length: 500 }, (_, index) => `Học viên ${index + 1}`)
  const entities = await bulkAddEntities(sheet.id, entityNames)

  const [attBool, attCurrency, attNumber, attText, attDropdown] = attributes

  // Pre-fill realistic cell values across all attributes for 500 entities
  for (let index = 0; index < entities.length; index++) {
    const entity = entities[index]

    if (attBool) {
      await updateCellValue(entity.id, attBool.id, index % 2 === 0)
    }

    if (attCurrency) {
      await updateCellValue(entity.id, attCurrency.id, index % 3 === 0)
    }

    if (attNumber) {
      await updateCellValue(entity.id, attNumber.id, index)
    }

    if (attText) {
      await updateCellValue(entity.id, attText.id, `Ghi chú ${index + 1}`)
    }

    if (attDropdown) {
      await updateCellValue(entity.id, attDropdown.id, dropdownOptions[index % dropdownOptions.length])
    }
  }

  return {
    sheetId: sheet.id,
    entityIds: entities.map(entity => entity.id),
    attributeIds: attributes.map(attribute => attribute!.id),
  }
}

async function runAudit(): Promise<PerfResult> {
  const { sheetId, entityIds, attributeIds } = await seedData()

  const toggleStart = performance.now()
  await updateCellValue(entityIds[0], attributeIds[0], false)
  const toggleMs = performance.now() - toggleStart

  const loadStart = performance.now()
  const [sheet, attributes, entities] = await Promise.all([
    db.sheets.get(sheetId),
    db.attributes.where('sheetId').equals(sheetId).sortBy('position'),
    db.entities.where('sheetId').equals(sheetId).sortBy('position'),
  ])
  const sheetLoadMs = performance.now() - loadStart

  if (!sheet) throw new Error('Sheet not found after seed')

  const cellLoadStart = performance.now()
  const cellValues = await db.cellValues
    .where('entityId')
    .anyOf(entityIds)
    .toArray()
  const cellLoadMs = performance.now() - cellLoadStart

  return {
    toggleMs,
    sheetLoadMs,
    cellLoadMs,
    entityCount: entities.length,
    attributeCount: attributes.length,
    cellCount: cellValues.length,
  }
}

runAudit()
  .then(result => {
    console.log(JSON.stringify(result, null, 2))
    return db.delete()
  })
  .catch(error => {
    console.error('Performance audit failed:', error)
    process.exitCode = 1
  })
