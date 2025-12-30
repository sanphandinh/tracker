import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AddEntityForm } from './src/components/tracker/add-entity-form'

describe('AddEntityForm smoke (real hook)', () => {
  it('renders', () => {
    render(<AddEntityForm sheetId="sheet-smoke" />)
    expect(screen.getByLabelText(/tên thành viên/i)).toBeInTheDocument()
  })
})
