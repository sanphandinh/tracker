import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddEntityForm } from './add-entity-form'

const addEntityMock = vi.fn()
const bulkAddEntitiesMock = vi.fn()

const mockUseEntities = vi.hoisted(() => vi.fn())

vi.mock('@/hooks/tracker/useEntities', () => ({
  useEntities: mockUseEntities,
}))

const baseHookState = () => ({
  entities: [],
  isLoading: false,
  isMutating: false,
  error: null as string | null,
  addEntity: addEntityMock,
  bulkAddEntities: bulkAddEntitiesMock,
  updateEntity: vi.fn(),
  deleteEntity: vi.fn(),
  reorderEntities: vi.fn(),
})

describe('AddEntityForm', () => {
  beforeEach(() => {
    mockUseEntities.mockReturnValue(baseHookState())
    vi.clearAllMocks()
  })

  it('renders single and bulk inputs', () => {
    render(<AddEntityForm sheetId="sheet-1" />)

    expect(screen.getByLabelText(/tên (thực thể|đối tượng|học sinh|thành viên)/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/thêm nhiều/i)).toBeInTheDocument()
  })

  it('adds a single entity when submitting', async () => {
    const user = userEvent.setup()
    render(<AddEntityForm sheetId="sheet-1" />)

    const nameInput = screen.getByLabelText(/tên (thực thể|đối tượng|học sinh|thành viên)/i)
    await user.type(nameInput, '  John Doe  ')

    const addButton = screen.getByRole('button', { name: /^thêm$/i })
    await user.click(addButton)

    expect(addEntityMock).toHaveBeenCalledWith('John Doe')
  })

  it('adds multiple entities from bulk textarea', async () => {
    const user = userEvent.setup()
    render(<AddEntityForm sheetId="sheet-1" />)

    const bulkTextarea = screen.getByLabelText(/thêm nhiều/i)
    await user.type(bulkTextarea, 'Alice\n\nBob  \n  Charlie')

    const bulkButton = screen.getByRole('button', { name: /thêm hàng loạt/i })
    await user.click(bulkButton)

    expect(bulkAddEntitiesMock).toHaveBeenCalledWith([
      'Alice',
      'Bob',
      'Charlie',
    ])
  })

  it('shows error message from hook', () => {
    mockUseEntities.mockReturnValue({
      ...baseHookState(),
      error: 'Something went wrong',
    })

    render(<AddEntityForm sheetId="sheet-1" />)

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('disables actions while mutating', () => {
    mockUseEntities.mockReturnValue({
      ...baseHookState(),
      isMutating: true,
    })

    render(<AddEntityForm sheetId="sheet-1" />)

    expect(screen.getByRole('button', { name: /^thêm$/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /thêm hàng loạt/i })).toBeDisabled()
  })
})
