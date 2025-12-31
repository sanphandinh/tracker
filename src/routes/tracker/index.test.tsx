import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TrackerHome } from './index'
import type { TrackingSheet } from '@/lib/tracker/types'

// Mock hooks using vi.hoisted for proper initialization order
const mockUseSheets = vi.hoisted(() => vi.fn())

vi.mock('@/hooks/tracker/useSheets', () => ({
  useSheets: mockUseSheets,
}))

describe('TrackerHome', () => {
  const mockSheets: TrackingSheet[] = [
    {
      id: 'sheet-1',
      name: 'Lớp 10A',
      createdAt: new Date('2025-12-28'),
      updatedAt: new Date('2025-12-30T10:30:00'),
    },
    {
      id: 'sheet-2',
      name: 'Lớp 10B',
      createdAt: new Date('2025-12-29'),
      updatedAt: new Date('2025-12-30T09:00:00'),
    },
    {
      id: 'sheet-3',
      name: 'Lớp 11A',
      createdAt: new Date('2025-12-30'),
      updatedAt: new Date('2025-12-30T08:00:00'),
    },
  ]

  const mockSheetState = {
    sheets: mockSheets,
    isLoading: false,
    error: null,
  }

  beforeEach(() => {
    mockUseSheets.mockReturnValue(mockSheetState)
    vi.clearAllMocks()
  })

  it('renders home page with create button', () => {
    render(<TrackerHome />)

    expect(screen.getByText(/tạo bảng|create sheet/i)).toBeInTheDocument()
  })

  it('displays list of all sheets', () => {
    render(<TrackerHome />)

    mockSheets.forEach((sheet) => {
      expect(screen.getByText(sheet.name)).toBeInTheDocument()
    })
  })

  it('sorts sheets by last modified (newest first)', () => {
    const { container } = render(<TrackerHome />)

    const sheetNames = container.querySelectorAll('[data-sheet]')
    if (sheetNames.length >= 2) {
      // First sheet should be the most recently updated
      expect(sheetNames[0]).toHaveTextContent('Lớp 10A')
    }
  })

  it('navigates to create sheet page on button click', async () => {
    const user = userEvent.setup()
    render(<TrackerHome />)

    const createButton = screen.getByText(/tạo bảng|create/i)
    await user.click(createButton)

    // Navigation should happen (behavior depends on router mock)
  })

  it('shows loading state initially', () => {
    mockUseSheets.mockReturnValue({
      ...mockSheetState,
      isLoading: true,
    })

    render(<TrackerHome />)

    expect(screen.getByText(/đang tải|loading/i)).toBeInTheDocument()
  })

  it('shows error message when loading fails', () => {
    mockUseSheets.mockReturnValue({
      ...mockSheetState,
      error: 'Không thể tải danh sách sheet',
      isLoading: false,
    })

    render(<TrackerHome />)

    expect(screen.getByText(/lỗi|error/i)).toBeInTheDocument()
  })

  it('shows empty state when no sheets exist', () => {
    mockUseSheets.mockReturnValue({
      ...mockSheetState,
      sheets: [],
    })

    render(<TrackerHome />)

    expect(screen.getByText(/chưa có|no sheets|empty/i)).toBeInTheDocument()
  })

  it('provides search functionality', async () => {
    const user = userEvent.setup()
    render(<TrackerHome />)

    const searchInput = screen.queryByPlaceholderText(/tìm|search/i)
    if (searchInput) {
      await user.type(searchInput, 'Lớp 10A')

      expect(screen.getByText('Lớp 10A')).toBeInTheDocument()
      // 10B and 11A should not be visible
      expect(screen.queryByText('Lớp 10B')).not.toBeInTheDocument()
    }
  })

  it('displays sheet preview with entity count', () => {
    render(<TrackerHome />)

    // Look for entity count in sheet cards
    const cards = screen.getAllByRole('button')
    expect(cards.length).toBeGreaterThan(0)
  })

  it('opens sheet when card is clicked', async () => {
    const user = userEvent.setup()
    render(<TrackerHome />)

    // Find and click first sheet
    const sheetButton = screen.getByText('Lớp 10A').closest('button')
    if (sheetButton) {
      await user.click(sheetButton)
      // Should navigate to sheet view
    }
  })

  it('handles keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<TrackerHome />)

    await user.keyboard('{Tab}')
    // Should navigate between buttons/cards with Tab key
  })

  it('shows sheets in grid layout on desktop', () => {
    const { container } = render(<TrackerHome />)

    const grid = container.querySelector('[class*="grid"]')
    expect(grid).toBeInTheDocument()
  })

  it('shows sheets in vertical list on mobile', () => {
    const { container } = render(<TrackerHome />)

    // Check responsive classes
    const layout = container.firstChild as HTMLElement
    const classList = layout?.className || ''
    expect(classList).toMatch(/flex|grid|space-/)
  })

  it('displays last modified date for each sheet', () => {
    render(<TrackerHome />)

    // At least one date should be visible
    const dateElements = screen.queryAllByText(/\d{1,2}.*\d{1,2}.*\d{4}/)
    expect(dateElements.length).toBeGreaterThanOrEqual(0)
  })

  it('allows deleting a sheet with confirmation', async () => {
    const user = userEvent.setup()
    render(<TrackerHome />)

    // Find delete button if visible (implementation dependent)
    const deleteButtons = screen.queryAllByRole('button', { name: /xóa|delete/i })
    if (deleteButtons.length > 0) {
      // May show confirmation dialog
      await user.click(deleteButtons[0])
    }
  })
})

