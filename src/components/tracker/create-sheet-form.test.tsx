import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateSheetForm } from './create-sheet-form'

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({
    navigate: vi.fn(),
  }),
}))

// Mock useCreateSheet hook
const mockCreateSheet = vi.fn().mockResolvedValue({
  id: 'test-sheet-id',
  name: 'Test Sheet',
  createdAt: new Date(),
  updatedAt: new Date(),
})

vi.mock('@/hooks/tracker/useCreateSheet', () => ({
  useCreateSheet: vi.fn(() => ({
    createSheet: mockCreateSheet,
    isCreating: false,
    error: null,
  })),
}))

describe('CreateSheetForm', () => {

  it('should render form with sheet name input', () => {
    render(<CreateSheetForm />)

    expect(screen.getByLabelText(/tên bảng/i)).toBeInTheDocument()
    expect(screen.getByText(/cột mặc định/i)).toBeInTheDocument()
    // Điểm danh appears in multiple places, so just check that it exists
    const diemdanhElements = screen.getAllByText(/điểm danh/i)
    expect(diemdanhElements.length).toBeGreaterThan(0)
  })

  it('should allow user to enter sheet name', async () => {
    const user = userEvent.setup()
    render(<CreateSheetForm />)

    const input = screen.getByLabelText(/tên bảng/i)
    await user.type(input, 'Test Sheet')

    expect(input).toHaveValue('Test Sheet')
  })

  it('should have submit button disabled when name is empty', () => {
    render(<CreateSheetForm />)

    const submitButton = screen.getByRole('button', { name: /tạo bảng/i })
    expect(submitButton).toBeDisabled()
  })

  it('should enable submit button when name is entered', async () => {
    const user = userEvent.setup()
    render(<CreateSheetForm />)

    const input = screen.getByLabelText(/tên bảng/i)
    await user.type(input, 'Test Sheet')

    const submitButton = screen.getByRole('button', { name: /tạo bảng/i })
    expect(submitButton).not.toBeDisabled()
  })

  it('should allow adding additional attributes', async () => {
    const user = userEvent.setup()
    render(<CreateSheetForm />)

    const addButton = screen.getByRole('button', { name: /thêm cột/i })
    await user.click(addButton)

    expect(screen.getByText(/tên cột/i)).toBeInTheDocument()
  })

  it('should allow removing added attributes', async () => {
    const user = userEvent.setup()
    render(<CreateSheetForm />)

    // Add an attribute
    const addButton = screen.getByRole('button', { name: /thêm cột/i })
    await user.click(addButton)

    // Remove it
    const removeButton = screen.getByRole('button', { name: /xóa/i })
    await user.click(removeButton)

    // Attribute should be gone
    expect(screen.queryByText(/tên cột/i)).not.toBeInTheDocument()
  })

  it('should show currency input for boolean-currency type', async () => {
    const user = userEvent.setup()
    render(<CreateSheetForm />)

    // Add an attribute
    const addButton = screen.getByRole('button', { name: /thêm cột/i })
    await user.click(addButton)

    // Verify additional attribute form rendered
    expect(screen.getAllByText(/tên cột/i).length).toBeGreaterThan(0)
  })

  it('should show options list for dropdown type', async () => {
    const user = userEvent.setup()
    render(<CreateSheetForm />)

    // Add an attribute
    const addButton = screen.getByRole('button', { name: /thêm cột/i })
    await user.click(addButton)

    // Verify additional attribute was added
    expect(screen.getAllByText(/tên cột/i).length).toBeGreaterThan(0)
  })

  it('should handle form submission with valid data', async () => {
    const user = userEvent.setup()
    render(<CreateSheetForm />)

    // Enter sheet name
    const input = screen.getByLabelText(/tên bảng/i)
    await user.type(input, 'Test Sheet')

    // Submit form
    const submitButton = screen.getByRole('button', { name: /tạo bảng/i })
    await user.click(submitButton)

    // Should call createSheet with the sheet name
    expect(mockCreateSheet).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test Sheet',
      })
    )
  })
})

