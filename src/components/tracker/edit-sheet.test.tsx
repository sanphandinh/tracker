import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { EditSheet } from './edit-sheet'
import { db } from '@/lib/tracker/db'
import type { TrackingSheet, Attribute } from '@/lib/tracker/types'
import { v4 as uuidv4 } from 'uuid'

describe('EditSheet', () => {
  let sheetId: string
  let attributeId1: string
  let attributeId2: string

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

    attributeId1 = uuidv4()
    const attr1: Attribute = {
      id: attributeId1,
      sheetId,
      name: 'Điểm danh',
      type: 'boolean',
      position: 0,
    }
    await db.attributes.add(attr1)

    attributeId2 = uuidv4()
    const attr2: Attribute = {
      id: attributeId2,
      sheetId,
      name: 'Ghi chú',
      type: 'text',
      position: 1,
    }
    await db.attributes.add(attr2)
  })

  afterEach(async () => {
    await db.sheets.clear()
    await db.attributes.clear()
    await db.entities.clear()
    await db.cellValues.clear()
  })

  it('should render edit sheet form with existing attributes', async () => {
    render(<EditSheet sheetId={sheetId} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Điểm danh')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Ghi chú')).toBeInTheDocument()
    })
  })

  it('should display all attribute types in dropdown', async () => {
    render(<EditSheet sheetId={sheetId} />)

    await waitFor(() => {
      const selects = screen.getAllByRole('combobox')
      expect(selects.length).toBeGreaterThan(0)
    })
  })

  it('should have save button', async () => {
    render(<EditSheet sheetId={sheetId} />)

    await waitFor(() => {
      expect(screen.getByText(/Lưu|Save/)).toBeInTheDocument()
    })
  })

  it('should have add attribute button', async () => {
    render(<EditSheet sheetId={sheetId} />)

    await waitFor(() => {
      expect(screen.getByText(/Thêm|Add/)).toBeInTheDocument()
    })
  })
})
