import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

function Smoke() {
  return <div>hello</div>
}

describe('react smoke', () => {
  it('renders without invalid hook error', () => {
    render(<Smoke />)
    expect(screen.getByText('hello')).toBeInTheDocument()
  })
})
