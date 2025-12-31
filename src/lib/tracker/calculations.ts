import { db } from './db'
import type { Attribute } from './types'

export interface AttributeSummary {
  attributeId: string
  attributeName: string
  attributeType: Attribute['type']
  currencyValue?: number
}

export interface BooleanSummary extends AttributeSummary {
  attributeType: 'boolean' | 'boolean-currency'
  checked: number
  total: number
  percentage: number
  subtotal?: number
}

export interface NumberSummary extends AttributeSummary {
  attributeType: 'number'
  sum: number
  average: number
  min: number
  max: number
  count: number
}

export interface DropdownSummary extends AttributeSummary {
  attributeType: 'dropdown'
  counts: Record<string, number>
  total: number
}

export interface TextSummary extends AttributeSummary {
  attributeType: 'text'
  filled: number
  empty: number
  total: number
}

export type SummaryItem = BooleanSummary | NumberSummary | DropdownSummary | TextSummary

export interface SheetSummary {
  attributeSummaries: SummaryItem[]
  grandTotal: number
  totalEntities: number
}

export async function calculateSummary(sheetId: string): Promise<SheetSummary> {
  const attributes = await db.attributes.where('sheetId').equals(sheetId).toArray()
  const entities = await db.entities.where('sheetId').equals(sheetId).toArray()
  const entityIds = entities.map((e) => e.id)

  const cellValues = await (entityIds.length > 0
    ? db.cellValues.where('entityId').anyOf(entityIds).toArray()
    : Promise.resolve([]))

  const summaries: SummaryItem[] = attributes.map((attr) => {
    const cells = cellValues.filter((c) => c.attributeId === attr.id)

    switch (attr.type) {
      case 'boolean': {
        const checked = cells.filter((c) => c.value === true).length
        const total = entities.length
        const percentage = total > 0 ? (checked / total) * 100 : 0

        return {
          attributeId: attr.id,
          attributeName: attr.name,
          attributeType: 'boolean',
          checked,
          total,
          percentage
        }
      }

      case 'boolean-currency': {
        const checked = cells.filter((c) => c.value === true).length
        const total = entities.length
        const percentage = total > 0 ? (checked / total) * 100 : 0
        const subtotal = checked * (attr.currencyValue ?? 0)

        return {
          attributeId: attr.id,
          attributeName: attr.name,
          attributeType: 'boolean-currency',
          checked,
          total,
          percentage,
          subtotal,
          currencyValue: attr.currencyValue
        }
      }

      case 'number': {
        const values = cells
          .map((c) => {
            const num = Number(c.value)
            return isNaN(num) ? null : num
          })
          .filter((v): v is number => v != null)

        const sum = values.reduce((a, b) => a + b, 0)
        const average = values.length > 0 ? sum / values.length : 0
        const min = values.length > 0 ? Math.min(...values) : Infinity
        const max = values.length > 0 ? Math.max(...values) : -Infinity

        return {
          attributeId: attr.id,
          attributeName: attr.name,
          attributeType: 'number',
          sum,
          average,
          min,
          max,
          count: values.length
        }
      }

      case 'dropdown': {
        const counts: Record<string, number> = {}
        cells.forEach((c) => {
          if (c.value != null) {
            const val = String(c.value)
            counts[val] = (counts[val] ?? 0) + 1
          }
        })

        return {
          attributeId: attr.id,
          attributeName: attr.name,
          attributeType: 'dropdown',
          counts,
          total: cells.filter((c) => c.value != null).length
        }
      }

      case 'text': {
        const filled = cells.filter((c) => c.value != null && String(c.value).trim() !== '').length
        const empty = cells.filter((c) => c.value == null || String(c.value).trim() === '').length
        const total = entities.length

        return {
          attributeId: attr.id,
          attributeName: attr.name,
          attributeType: 'text',
          filled,
          empty,
          total
        }
      }

      default:
        // For unknown attribute types, return a text summary with zero counts
        return {
          attributeId: attr.id,
          attributeName: attr.name,
          attributeType: 'text',
          filled: 0,
          empty: 0,
          total: 0,
        } as TextSummary
    }
  })

  // Calculate grand total for all boolean-currency
  const grandTotal = summaries
    .filter((s): s is BooleanSummary => s.attributeType === 'boolean-currency' && 'subtotal' in s)
    .reduce((sum, s) => sum + (s.subtotal ?? 0), 0)

  return {
    attributeSummaries: summaries,
    grandTotal,
    totalEntities: entities.length
  }
}

export async function getSummaryForAttribute(
  sheetId: string,
  attributeId: string
): Promise<SummaryItem | null> {
  const summary = await calculateSummary(sheetId)
  return summary.attributeSummaries.find((s) => s.attributeId === attributeId) ?? null
}

export async function getEntitiesContributingToSummary(
  sheetId: string,
  attributeId: string,
  value?: string | number | boolean
): Promise<string[]> {
  const entities = await db.entities.where('sheetId').equals(sheetId).toArray()
  const entityIds = entities.map((e) => e.id)

  if (entityIds.length === 0) return []

  const cellValues = await db.cellValues.where('entityId').anyOf(entityIds).toArray()

  const filtered = cellValues.filter((c) => {
    if (c.attributeId !== attributeId) return false
    if (value !== undefined) {
      return c.value === value
    }
    return c.value != null
  })

  return filtered.map((c) => c.entityId)
}
