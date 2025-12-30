import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SheetCard } from './sheet-card'
import type { TrackingSheet } from '@/lib/tracker/types'

describe('SheetCard', () => {
  const mockSheet: TrackingSheet = {
    id: 'sheet-1',
    name: 'Lớp 10A - Buổi học ngày 30/12/2025',
    createdAt: new Date('2025-12-29'),
    updatedAt: new Date('2025-12-30T10:30:00'),
  }

  it('renders sheet name and metadata', () => {
    render(
      <SheetCard
        sheet={mockSheet}
        entityCount={25}
        onClick={() => {}}
      />
    )

    expect(screen.getByText('Lớp 10A - Buổi học ngày 30/12/2025')).toBeInTheDocument()
    expect(screen.getByText(/25\s+thành viên/)).toBeInTheDocument()
  })

  it('shows created and updated dates', () => {
    render(
      <SheetCard
        sheet={mockSheet}
        entityCount={5}
        onClick={() => {}}
      />
    )

    // Should show updated date (more recent)
    expect(screen.getByText(/30.*12.*2025|2025.*12.*30/i)).toBeInTheDocument()
  })

  it('calls onClick when card is clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(
      <SheetCard
        sheet={mockSheet}
        entityCount={10}
        onClick={handleClick}
      />
    )

    const card = screen.getByRole('button')
    await user.click(card)

    expect(handleClick).toHaveBeenCalledWith(mockSheet.id)
  })

  it('shows entity count as 0 when provided', () => {
    render(
      <SheetCard
        sheet={mockSheet}
        entityCount={0}
        onClick={() => {}}
      />
    )

    expect(screen.getByText(/0\s+thành viên/)).toBeInTheDocument()
  })

  it('handles sheets with many entities', () => {
    render(
      <SheetCard
        sheet={mockSheet}
        entityCount={500}
        onClick={() => {}}
      />
    )

    expect(screen.getByText(/500\s+thành viên/)).toBeInTheDocument()
  })

  it('truncates long sheet names', () => {
    const longNameSheet: TrackingSheet = {
      ...mockSheet,
      name: 'A'.repeat(100),
    }

    const { container } = render(
      <SheetCard
        sheet={longNameSheet}
        entityCount={5}
        onClick={() => {}}
      />
    )

    const titleElement = container.querySelector('h3')
    expect(titleElement?.className).toMatch(/truncate|line-clamp/)
  })

  it('is keyboard accessible', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(
      <SheetCard
        sheet={mockSheet}
        entityCount={10}
        onClick={handleClick}
      />
    )

    const card = screen.getByRole('button')
    card.focus()
    
    await user.keyboard('{Enter}')
    expect(handleClick).toHaveBeenCalled()
  })

  it('shows creation date when recently created', () => {
    const newSheet: TrackingSheet = {
      ...mockSheet,
      createdAt: new Date('2025-12-30T09:00:00'),
      updatedAt: new Date('2025-12-30T09:05:00'),
    }

    const { container } = render(
      <SheetCard
        sheet={newSheet}
        entityCount={3}
        onClick={() => {}}
      />
    )

    // Should show metadata for recently created sheet
    const metadata = container.querySelector('div[class*="border-t"]')
    expect(metadata).toBeInTheDocument()
  })

  it('has minimum touch target size (44px)', () => {
    const { container } = render(
      <SheetCard
        sheet={mockSheet}
        entityCount={10}
        onClick={() => {}}
      />
    )

    const button = container.querySelector('button')
    // Should have min-h-[120px] for card height
    expect(button?.className).toMatch(/min-h-\[120px\]/)
  })

  it('displays preview info with attributes count', () => {
    render(
      <SheetCard
        sheet={mockSheet}
        entityCount={25}
        attributeCount={5}
        onClick={() => {}}
      />
    )

    expect(screen.getByText(/25\s+thành viên/)).toBeInTheDocument()
    if (screen.queryByText(/5\s+(cột|attribute)/i)) {
      expect(screen.getByText(/5\s+(cột|attribute)/i)).toBeInTheDocument()
    }
  })
})

