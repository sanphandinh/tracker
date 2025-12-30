import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CellInput } from './cell-input'
import type { Attribute } from '@/lib/tracker/types'

describe('CellInput', () => {
  describe('boolean type', () => {
    it('should render as a toggleable button', () => {
      const handleChange = vi.fn()
      render(
        <CellInput
          value={null}
          onChange={handleChange}
          attribute={createMockAttribute('boolean')}
        />
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should cycle through null → true → false → null', () => {
      const handleChange = vi.fn()
      const { rerender } = render(
        <CellInput
          value={null}
          onChange={handleChange}
          attribute={createMockAttribute('boolean')}
        />
      )

      const button = screen.getByRole('button')

      // null → true
      fireEvent.click(button)
      expect(handleChange).toHaveBeenCalledWith(true)

      rerender(
        <CellInput
          value={true}
          onChange={handleChange}
          attribute={createMockAttribute('boolean')}
        />
      )

      // true → false
      fireEvent.click(button)
      expect(handleChange).toHaveBeenCalledWith(false)

      rerender(
        <CellInput
          value={false}
          onChange={handleChange}
          attribute={createMockAttribute('boolean')}
        />
      )

      // false → null
      fireEvent.click(button)
      expect(handleChange).toHaveBeenCalledWith(null)
    })

    it('should show visual indicator for true state', () => {
      const { container } = render(
        <CellInput
          value={true}
          onChange={() => {}}
          attribute={createMockAttribute('boolean')}
        />
      )

      const element = container.querySelector('[data-state="checked"]')
      expect(element).toBeInTheDocument()
    })

    it('should show visual indicator for false state', () => {
      const { container } = render(
        <CellInput
          value={false}
          onChange={() => {}}
          attribute={createMockAttribute('boolean')}
        />
      )

      const element = container.querySelector('[data-state="unchecked"]')
      expect(element).toBeInTheDocument()
    })
  })

  describe('boolean-currency type', () => {
    it('should behave like boolean but with currency value', () => {
      const handleChange = vi.fn()
      const attr = createMockAttribute('boolean-currency', { currencyValue: 150000 })
      const { rerender } = render(
        <CellInput
          value={null}
          onChange={handleChange}
          attribute={attr}
        />
      )

      const button = screen.getByRole('button')

      // null → true
      fireEvent.click(button)
      expect(handleChange).toHaveBeenCalledWith(true)

      rerender(
        <CellInput
          value={true}
          onChange={handleChange}
          attribute={attr}
        />
      )

      // true → false
      fireEvent.click(button)
      expect(handleChange).toHaveBeenCalledWith(false)
    })

    it('should display currency value in the button', () => {
      const attr = createMockAttribute('boolean-currency', { currencyValue: 150000 })
      render(
        <CellInput
          value={true}
          onChange={() => {}}
          attribute={attr}
        />
      )

      expect(screen.getByText(/150k/)).toBeInTheDocument()
    })
  })

  describe('number type', () => {
    it('should render a numeric input', () => {
      render(
        <CellInput
          value={null}
          onChange={() => {}}
          attribute={createMockAttribute('number')}
        />
      )

      const input = screen.getByRole('spinbutton')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'number')
    })

    it('should update value on input change', () => {
      const handleChange = vi.fn()
      render(
        <CellInput
          value={42}
          onChange={handleChange}
          attribute={createMockAttribute('number')}
        />
      )

      const input = screen.getByRole('spinbutton') as HTMLInputElement
      fireEvent.change(input, { target: { value: '100' } })

      expect(handleChange).toHaveBeenCalledWith(100)
    })

    it('should handle empty input as null', () => {
      const handleChange = vi.fn()
      render(
        <CellInput
          value={42}
          onChange={handleChange}
          attribute={createMockAttribute('number')}
        />
      )

      const input = screen.getByRole('spinbutton') as HTMLInputElement
      fireEvent.change(input, { target: { value: '' } })

      expect(handleChange).toHaveBeenCalledWith(null)
    })
  })

  describe('text type', () => {
    it('should render a text input', () => {
      render(
        <CellInput
          value={null}
          onChange={() => {}}
          attribute={createMockAttribute('text')}
        />
      )

      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    it('should update value on input change', () => {
      const handleChange = vi.fn()
      render(
        <CellInput
          value="test"
          onChange={handleChange}
          attribute={createMockAttribute('text')}
        />
      )

      const input = screen.getByRole('textbox') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'new value' } })

      expect(handleChange).toHaveBeenCalledWith('new value')
    })

    it('should handle empty input as null', () => {
      const handleChange = vi.fn()
      render(
        <CellInput
          value="test"
          onChange={handleChange}
          attribute={createMockAttribute('text')}
        />
      )

      const input = screen.getByRole('textbox') as HTMLInputElement
      fireEvent.change(input, { target: { value: '' } })

      expect(handleChange).toHaveBeenCalledWith(null)
    })
  })

  describe('dropdown type', () => {
    it('should render a select element', () => {
      const attr = createMockAttribute('dropdown', {
        options: ['Option 1', 'Option 2', 'Option 3'],
      })
      render(
        <CellInput
          value={null}
          onChange={() => {}}
          attribute={attr}
        />
      )

      const combobox = screen.getByRole('combobox')
      expect(combobox).toBeInTheDocument()
    })

    it('should display all available options', () => {
      const attr = createMockAttribute('dropdown', {
        options: ['Option 1', 'Option 2', 'Option 3'],
      })
      render(
        <CellInput
          value={null}
          onChange={() => {}}
          attribute={attr}
        />
      )

      const combobox = screen.getByRole('combobox') as HTMLSelectElement
      const options = combobox.querySelectorAll('option')
      expect(options).toHaveLength(4) // 3 options + empty default
    })

    it('should update value when option selected', () => {
      const handleChange = vi.fn()
      const attr = createMockAttribute('dropdown', {
        options: ['Option 1', 'Option 2', 'Option 3'],
      })
      render(
        <CellInput
          value={null}
          onChange={handleChange}
          attribute={attr}
        />
      )

      const combobox = screen.getByRole('combobox') as HTMLSelectElement
      fireEvent.change(combobox, { target: { value: 'Option 2' } })

      expect(handleChange).toHaveBeenCalledWith('Option 2')
    })

    it('should allow deselecting an option', () => {
      const handleChange = vi.fn()
      const attr = createMockAttribute('dropdown', {
        options: ['Option 1', 'Option 2', 'Option 3'],
      })
      render(
        <CellInput
          value="Option 1"
          onChange={handleChange}
          attribute={attr}
        />
      )

      const combobox = screen.getByRole('combobox') as HTMLSelectElement
      fireEvent.change(combobox, { target: { value: '' } })

      expect(handleChange).toHaveBeenCalledWith(null)
    })
  })

  describe('accessibility', () => {
    it('should be keyboard accessible for boolean', () => {
      const handleChange = vi.fn()
      render(
        <CellInput
          value={null}
          onChange={handleChange}
          attribute={createMockAttribute('boolean')}
        />
      )

      const button = screen.getByRole('button')
      fireEvent.keyDown(button, { key: 'Enter' })

      expect(handleChange).toHaveBeenCalled()
    })

    it('should have minimum touch target size (44px)', () => {
      const { container } = render(
        <CellInput
          value={null}
          onChange={() => {}}
          attribute={createMockAttribute('boolean')}
        />
      )

      const button = container.querySelector('button')
      expect(button).toHaveClass('min-h-11', 'min-w-11')
    })
  })
})

// Helper to create mock attribute
function createMockAttribute(
  type: Attribute['type'],
  options?: { currencyValue?: number; options?: string[] }
): Attribute {
  return {
    id: crypto.randomUUID(),
    sheetId: crypto.randomUUID(),
    name: 'Test Attribute',
    type,
    currencyValue: options?.currencyValue,
    options: options?.options,
    position: 0,
  }
}
