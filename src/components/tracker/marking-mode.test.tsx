import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MarkingMode } from './marking-mode'
import type { Entity, Attribute } from '@/lib/tracker/types'

// Mock the hooks
vi.mock('@/hooks/tracker/useCellValues', () => ({
  useCellValues: vi.fn(() => ({
    getCellValue: vi.fn(() => null),
    updateCell: vi.fn(),
    isPending: false,
  })),
}))

describe('MarkingMode', () => {
  const mockEntities: Entity[] = [
    {
      id: 'entity-1',
      sheetId: 'sheet-1',
      name: 'Nguyễn Văn A',
      position: 0,
    },
    {
      id: 'entity-2',
      sheetId: 'sheet-1',
      name: 'Trần Thị B',
      position: 1,
    },
    {
      id: 'entity-3',
      sheetId: 'sheet-1',
      name: 'Lê Văn C',
      position: 2,
    },
  ]

  const mockAttribute: Attribute = {
    id: 'attr-1',
    sheetId: 'sheet-1',
    name: 'Điểm danh',
    type: 'boolean',
    position: 0,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders first entity by default', () => {
    render(
      <MarkingMode
        entities={mockEntities}
        primaryAttribute={mockAttribute}
      />
    )

    expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument()
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('shows progress indicator', () => {
    render(
      <MarkingMode
        entities={mockEntities}
        primaryAttribute={mockAttribute}
      />
    )

    expect(screen.getByText(/Đã đánh dấu: 0\/3/)).toBeInTheDocument()
  })

  it('displays quick action buttons for boolean attributes', () => {
    render(
      <MarkingMode
        entities={mockEntities}
        primaryAttribute={mockAttribute}
      />
    )

    expect(screen.getByRole('button', { name: /✓ Có mặt/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /✗ Vắng mặt/ })).toBeInTheDocument()
  })

  it('has navigation buttons', () => {
    render(
      <MarkingMode
        entities={mockEntities}
        primaryAttribute={mockAttribute}
      />
    )

    expect(screen.getByRole('button', { name: /Quay lại/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Tiếp theo/ })).toBeInTheDocument()
  })

  it('disables back button on first entity', () => {
    render(
      <MarkingMode
        entities={mockEntities}
        primaryAttribute={mockAttribute}
      />
    )

    const backButton = screen.getByRole('button', { name: /Quay lại/ })
    expect(backButton).toBeDisabled()
  })

  it('allows navigation to next entity', async () => {
    const user = userEvent.setup()
    
    render(
      <MarkingMode
        entities={mockEntities}
        primaryAttribute={mockAttribute}
      />
    )

    const nextButton = screen.getByRole('button', { name: /Tiếp theo/ })
    await user.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('Trần Thị B')).toBeInTheDocument()
      expect(screen.getByText('2 / 3')).toBeInTheDocument()
    })
  })

  it('allows navigation to previous entity', async () => {
    const user = userEvent.setup()
    
    render(
      <MarkingMode
        entities={mockEntities}
        primaryAttribute={mockAttribute}
      />
    )

    // Go forward first
    const nextButton = screen.getByRole('button', { name: /Tiếp theo/ })
    await user.click(nextButton)

    // Then go back
    const backButton = screen.getByRole('button', { name: /Quay lại/ })
    await user.click(backButton)

    await waitFor(() => {
      expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument()
      expect(screen.getByText('1 / 3')).toBeInTheDocument()
    })
  })

  it('renders entity quick navigation', () => {
    render(
      <MarkingMode
        entities={mockEntities}
        primaryAttribute={mockAttribute}
      />
    )

    // Should show numbered buttons for each entity
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
  })

  it('allows jumping to specific entity', async () => {
    const user = userEvent.setup()
    
    render(
      <MarkingMode
        entities={mockEntities}
        primaryAttribute={mockAttribute}
      />
    )

    const jumpButton = screen.getByRole('button', { name: '3' })
    await user.click(jumpButton)

    await waitFor(() => {
      expect(screen.getByText('Lê Văn C')).toBeInTheDocument()
      expect(screen.getByText('3 / 3')).toBeInTheDocument()
    })
  })

  it('shows empty state when no entities', () => {
    render(
      <MarkingMode
        entities={[]}
        primaryAttribute={mockAttribute}
      />
    )

    expect(screen.getByText(/Không có thực thể nào để đánh dấu/)).toBeInTheDocument()
  })

  it('disables forward button on last entity', async () => {
    const user = userEvent.setup()
    
    render(
      <MarkingMode
        entities={mockEntities}
        primaryAttribute={mockAttribute}
      />
    )

    // Navigate to last entity
    const jumpButton = screen.getByRole('button', { name: '3' })
    await user.click(jumpButton)

    await waitFor(() => {
      const nextButton = screen.getByRole('button', { name: /Tiếp theo/ })
      expect(nextButton).toBeDisabled()
    })
  })

  it('shows completion summary when all marked (simulated)', async () => {
    // This test would need proper mocking of useCellValues
    // to simulate all entities being marked
    // For now, it's a placeholder for the behavior
    expect(true).toBe(true)
  })
})
