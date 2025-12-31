import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { SummaryCard } from './summary-card'
import { db } from '@/lib/tracker/db'
import { calculateSummary } from '@/lib/tracker/calculations'
import type { TrackingSheet, Attribute, Entity, CellValue } from '@/lib/tracker/types'
import { v4 as uuidv4 } from 'uuid'

describe('SummaryCard', () => {
  let sheetId: string
  let booleanAttrId: string
  let currencyAttrId: string

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

    currencyAttrId = uuidv4()
    const currencyAttr: Attribute = {
      id: currencyAttrId,
      sheetId,
      name: 'Tiền ăn',
      type: 'boolean-currency',
      currencyValue: 150000,
      position: 1,
    }
    await db.attributes.add(currencyAttr)

    // Add entities
    const entity1: Entity = {
      id: uuidv4(),
      sheetId,
      name: 'Sinh viên 1',
      position: 0,
    }
    const entity2: Entity = {
      id: uuidv4(),
      sheetId,
      name: 'Sinh viên 2',
      position: 1,
    }
    const entity3: Entity = {
      id: uuidv4(),
      sheetId,
      name: 'Sinh viên 3',
      position: 2,
    }
    await db.entities.bulkAdd([entity1, entity2, entity3])

    // Add cell values
    const cellValues: CellValue[] = [
      { id: uuidv4(), entityId: entity1.id, attributeId: booleanAttrId, value: true },
      { id: uuidv4(), entityId: entity2.id, attributeId: booleanAttrId, value: true },
      { id: uuidv4(), entityId: entity3.id, attributeId: booleanAttrId, value: false },
      { id: uuidv4(), entityId: entity1.id, attributeId: currencyAttrId, value: true },
      { id: uuidv4(), entityId: entity2.id, attributeId: currencyAttrId, value: false },
      { id: uuidv4(), entityId: entity3.id, attributeId: currencyAttrId, value: true },
    ]
    await db.cellValues.bulkAdd(cellValues)
  })

  afterEach(async () => {
    await db.sheets.clear()
    await db.attributes.clear()
    await db.entities.clear()
    await db.cellValues.clear()
  })

  it('should render boolean summary card', async () => {
    const summary = await calculateSummary(sheetId)
    const booleanSummary = summary.attributeSummaries.find(
      (s) => s.attributeId === booleanAttrId
    )!

    render(<SummaryCard summary={booleanSummary} />)

    await waitFor(() => {
      expect(screen.getByText('Điểm danh')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  it('should render currency summary card', async () => {
    const summary = await calculateSummary(sheetId)
    const currencySummary = summary.attributeSummaries.find(
      (s) => s.attributeId === currencyAttrId
    )!

    render(<SummaryCard summary={currencySummary} />)

    await waitFor(() => {
      expect(screen.getByText('Tiền ăn')).toBeInTheDocument()
      expect(screen.getByText(/300.000|300,000/)).toBeInTheDocument()
    })
  })

  it('should display percentage for boolean attributes', async () => {
    const summary = await calculateSummary(sheetId)
    const booleanSummary = summary.attributeSummaries.find(
      (s) => s.attributeId === booleanAttrId
    )!

    render(<SummaryCard summary={booleanSummary} />)

    await waitFor(() => {
      expect(screen.getByText(/66/)).toBeInTheDocument()
    })
  })

  it('should handle onClick callback', async () => {
    const summary = await calculateSummary(sheetId)
    const booleanSummary = summary.attributeSummaries.find(
      (s) => s.attributeId === booleanAttrId
    )!
    const onClick = vi.fn()

    const { container } = render(<SummaryCard summary={booleanSummary} onClick={onClick} />)

    const card = container.querySelector('[role="button"]')
    if (card) {
      card.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    }

    await waitFor(() => {
      expect(onClick).toHaveBeenCalled()
    })
  })
})
