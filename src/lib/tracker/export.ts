import * as XLSX from 'xlsx'
import { db } from './db'

function formatCellValue(value: any): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean') return value ? 'Có' : 'Không'
  if (typeof value === 'number') return String(value)
  return String(value)
}

export async function exportSheetToExcel(sheetId: string): Promise<Uint8Array> {
  const sheet = await db.sheets.get(sheetId)
  if (!sheet) throw new Error('Sheet not found')

  const attributes = await db.attributes.where('sheetId').equals(sheetId).sortBy('position')
  const entities = await db.entities.where('sheetId').equals(sheetId).sortBy('position')
  const cellValues = await db.cellValues.toArray()

  // Build worksheet data
  const headers = ['Tên', ...attributes.map((a) => a.name)]
  const rows = entities.map((entity) => {
    const row = [entity.name]
    attributes.forEach((attr) => {
      const cell = cellValues.find((c) => c.entityId === entity.id && c.attributeId === attr.id)
      row.push(formatCellValue(cell?.value))
    })
    return row
  })

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheet.name)

  return XLSX.write(wb, { type: 'array', bookType: 'xlsx' })
}

export async function exportSheetToCSV(sheetId: string): Promise<string> {
  const sheet = await db.sheets.get(sheetId)
  if (!sheet) throw new Error('Sheet not found')

  const attributes = await db.attributes.where('sheetId').equals(sheetId).sortBy('position')
  const entities = await db.entities.where('sheetId').equals(sheetId).sortBy('position')
  const cellValues = await db.cellValues.toArray()

  // Build CSV data
  const headers = ['Tên', ...attributes.map((a) => a.name)]
  const rows = entities.map((entity) => {
    const row = [entity.name]
    attributes.forEach((attr) => {
      const cell = cellValues.find((c) => c.entityId === entity.id && c.attributeId === attr.id)
      row.push(formatCellValue(cell?.value))
    })
    return row
  })

  const allRows = [headers, ...rows]
  return allRows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
}
