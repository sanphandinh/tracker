import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateSheetForm } from './create-sheet-form'

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({
    navigate: vi.fn(),
  }),
}))

// Mock IndexedDB operations
vi.mock('@/lib/tracker/db', () => ({
  createSheet: vi.fn().mockResolvedValue({
    id: 'test-sheet-id',
    name: 'Test Sheet',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  addAttribute: vi.fn().mockResolvedValue({}),
}))

describe('CreateSheetForm', () => {

  it('should render form with sheet name input', () => {
    render(<CreateSheetForm />)

    expect(screen.getByLabelText(/tên bảng/i)).toBeInTheDocument()
    expect(screen.getByText(/cột mặc định/i)).toBeInTheDocument()
    expect(screen.getByText(/điểm danh/i)).toBeInTheDocument()
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

    // Select boolean-currency type
    const typeSelect = screen.getByLabelText(/loại cột/i)
    await user.selectOptions(typeSelect, 'boolean-currency')

    // Currency input should appear
    expect(screen.getByLabelText(/giá trị tiền/i)).toBeInTheDocument()
  })

  it('should show options list for dropdown type', async () => {
    const user = userEvent.setup()
    render(<CreateSheetForm />)

    // Add an attribute
    const addButton = screen.getByRole('button', { name: /thêm cột/i })
    await user.click(addButton)

    // Select dropdown type
    const typeSelect = screen.getByLabelText(/loại cột/i)
    await user.selectOptions(typeSelect, 'dropdown')

    // Options section should appear
    expect(screen.getByText(/các lựa chọn/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /thêm lựa chọn/i })).toBeInTheDocument()
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

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText(/đang tạo/i)).toBeInTheDocument()
    })
  })
})
