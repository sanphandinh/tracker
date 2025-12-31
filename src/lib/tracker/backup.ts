import { db } from './db'
import { BackupDataSchema } from './schemas'

interface BackupData {
  version: number
  timestamp: string
  sheets: unknown[]
  attributes: unknown[]
  entities: unknown[]
  cellValues: unknown[]
}

export async function createBackup(): Promise<string> {
  const data: BackupData = {
    version: 1,
    timestamp: new Date().toISOString(),
    sheets: await db.sheets.toArray(),
    attributes: await db.attributes.toArray(),
    entities: await db.entities.toArray(),
    cellValues: await db.cellValues.toArray(),
  }

  return JSON.stringify(data, null, 2)
}

export async function restoreBackup(jsonString: string): Promise<void> {
  const parsed = JSON.parse(jsonString)

  // Validate backup structure
  if (!parsed.version || !parsed.sheets || !parsed.attributes || !parsed.entities || !parsed.cellValues) {
    throw new Error('Invalid backup format')
  }

  // Try to validate with schema
  try {
    await BackupDataSchema.parseAsync(parsed)
  } catch (error) {
    throw new Error(`Invalid backup data: ${error}`)
  }

  // Restore data in transaction
  await db.transaction('rw', db.sheets, db.attributes, db.entities, db.cellValues, async () => {
    // Clear existing data
    await db.sheets.clear()
    await db.attributes.clear()
    await db.entities.clear()
    await db.cellValues.clear()

    // Restore data
    if (parsed.sheets && parsed.sheets.length > 0) {
      await db.sheets.bulkAdd(parsed.sheets)
    }
    if (parsed.attributes && parsed.attributes.length > 0) {
      await db.attributes.bulkAdd(parsed.attributes)
    }
    if (parsed.entities && parsed.entities.length > 0) {
      await db.entities.bulkAdd(parsed.entities)
    }
    if (parsed.cellValues && parsed.cellValues.length > 0) {
      await db.cellValues.bulkAdd(parsed.cellValues)
    }
  })
}

export async function downloadBackupFile(): Promise<void> {
  const backup = await createBackup()
  const blob = new Blob([backup], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `tracker-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
