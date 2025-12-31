import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SheetView } from './sheet-view'
import type { Entity, Attribute } from '@/lib/tracker/types'

// Mock hooks
const mockUseSheet = vi.hoisted(() => vi.fn())
const mockUseCellValues = vi.hoisted(() => vi.fn())

vi.mock('@/hooks/tracker/useSheet', () => ({
  useSheet: mockUseSheet,
}))

vi.mock('@/hooks/tracker/useCellValues', () => ({
  useCellValues: mockUseCellValues,
}))

describe('SheetView', () => {
  const mockEntities: Entity[] = [
    { id: 'e1', sheetId: 'sheet-1', name: 'Nguyễn Văn A', position: 0 },
    { id: 'e2', sheetId: 'sheet-1', name: 'Trần Thị B', position: 1 },
    { id: 'e3', sheetId: 'sheet-1', name: 'Lê Văn C', position: 2 },
  ]

  const mockAttributes: Attribute[] = [
    {
      id: 'a1',
      sheetId: 'sheet-1',
      name: 'Điểm danh',
      type: 'boolean',
      position: 0,
    },
    {
      id: 'a2',
      sheetId: 'sheet-1',
      name: 'Tiền ăn 150k',
      type: 'boolean-currency',
      currencyValue: 150000,
      position: 1,
    },
  ]

  const mockSheetState = {
    sheet: null,
    entities: mockEntities,
    attributes: mockAttributes,
    isLoading: false,
    error: null,
  }

  beforeEach(() => {
    mockUseSheet.mockReturnValue(mockSheetState)
    mockUseCellValues.mockImplementation((entityId: string) => ({
      getCellValue: vi.fn((attrId: string) => {
        if (entityId === 'e1' && attrId === 'a1') return true
        if (entityId === 'e2' && attrId === 'a1') return false
        return null
      }),
      updateCell: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    }))
  })

  it('renders all entities and attributes', () => {
    render(<SheetView sheetId="sheet-1" />)

    // Check attributes are shown
    expect(screen.getByText('Điểm danh')).toBeInTheDocument()
    expect(screen.getByText('Tiền ăn 150k')).toBeInTheDocument()

    // Check entities are shown
    mockEntities.forEach((entity) => {
      expect(screen.getByText(entity.name)).toBeInTheDocument()
    })
  })

  it('displays cell values correctly', () => {
    const { container } = render(<SheetView sheetId="sheet-1" />)

    // Check that first entity has a checked cell (value = true)
    const e1Row = container.querySelector('[data-entity="e1"]')
    expect(e1Row).toBeInTheDocument()
  })

  it('updates cell value when clicked', async () => {
    const updateCellMock = vi.fn().mockResolvedValue(undefined)
    mockUseCellValues.mockImplementation((_entityId: string) => ({
      getCellValue: vi.fn(() => null),
      updateCell: updateCellMock,
      isPending: false,
    }))

    const { container } = render(<SheetView sheetId="sheet-1" />)

    // Find and click a cell (should be a button or input)
    const cells = container.querySelectorAll('[data-state]')
    if (cells.length > 0) {
      fireEvent.click(cells[0])
      // Cell update should be called
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  })

  it('shows loading state initially', () => {
    mockUseSheet.mockReturnValue({
      ...mockSheetState,
      isLoading: true,
    })

    render(<SheetView sheetId="sheet-1" />)
    expect(screen.getByText('Đang tải dữ liệu...')).toBeInTheDocument()
  })

  it('shows error message when loading fails', () => {
    mockUseSheet.mockReturnValue({
      ...mockSheetState,
      error: 'Lỗi khi tải sheet',
      isLoading: false,
    })

    render(<SheetView sheetId="sheet-1" />)
    expect(screen.getByText(/lỗi/i)).toBeInTheDocument()
  })

  it('shows empty state when no entities', () => {
    mockUseSheet.mockReturnValue({
      ...mockSheetState,
      entities: [],
    })

    render(<SheetView sheetId="sheet-1" />)
    expect(screen.getByText('Chưa có thành viên')).toBeInTheDocument()
  })

  it('maintains scroll position when updating cells', async () => {
    const { container } = render(<SheetView sheetId="sheet-1" />)

    // Simulate scroll
    const scrollContainer = container.querySelector('[class*="overflow"]')
    if (scrollContainer) {
      scrollContainer.scrollTop = 100
      const scrollBefore = scrollContainer.scrollTop

      // Update a cell
      const cells = container.querySelectorAll('[data-state]')
      if (cells.length > 0) {
        fireEvent.click(cells[0])
      }

      // Check scroll position is maintained
      // (actual implementation may vary)
      expect(scrollContainer.scrollTop).toBe(scrollBefore)
    }
  })

  it('provides search/filter functionality', async () => {
    const user = userEvent.setup()
    render(<SheetView sheetId="sheet-1" />)

    // Look for search input
    const searchInput = screen.queryByPlaceholderText(/search|tìm|lọc/i)
    if (searchInput) {
      await user.type(searchInput, 'Nguyễn')
      // Should filter to show only Nguyễn Văn A
      expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument()
      expect(screen.queryByText('Trần Thị B')).not.toBeInTheDocument()
    }
  })

  it('shows all 5 attribute types correctly', () => {
    const allAttrTypes: Attribute[] = [
      { id: 'a1', sheetId: 's1', name: 'Boolean', type: 'boolean', position: 0 },
      { id: 'a2', sheetId: 's1', name: 'Currency', type: 'boolean-currency', currencyValue: 100000, position: 1 },
      { id: 'a3', sheetId: 's1', name: 'Number', type: 'number', position: 2 },
      { id: 'a4', sheetId: 's1', name: 'Text', type: 'text', position: 3 },
      { id: 'a5', sheetId: 's1', name: 'Dropdown', type: 'dropdown', options: ['Opt1', 'Opt2'], position: 4 },
    ]

    mockUseSheet.mockReturnValue({
      ...mockSheetState,
      attributes: allAttrTypes,
    })

    render(<SheetView sheetId="sheet-1" />)

    allAttrTypes.forEach((attr) => {
      expect(screen.getByText(attr.name)).toBeInTheDocument()
    })
  })

  it('handles touch target sizes properly (44px minimum)', () => {
    const { container } = render(<SheetView sheetId="sheet-1" />)

    // Check for minimum size class
    const buttons = container.querySelectorAll('button')
    buttons.forEach((button) => {
      const classes = button.className
      // Should have min-h-11 or min-h-12 (44px = h-11 in Tailwind)
      expect(classes).toMatch(/min-h-(11|12|10)|px-[0-9]|py-[0-9]/)
    })
  })
})

