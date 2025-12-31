import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PrimaryAction } from './primary-action'

describe('PrimaryAction', () => {
  it('renders button with default label', () => {
    render(<PrimaryAction />)

    const button = screen.getByRole('button', { name: /Create/i })
    expect(button).toBeInTheDocument()
  })

  it('renders with custom label', () => {
    render(<PrimaryAction label="Add Item" />)

    const button = screen.getByRole('button', { name: /Add Item/i })
    expect(button).toBeInTheDocument()
  })

  it('renders with custom aria-label', () => {
    render(<PrimaryAction aria-label="Create new sheet" />)

    const button = screen.getByLabelText(/Create new sheet/i)
    expect(button).toBeInTheDocument()
  })

  it('has minimum 48px hitbox (touch-target-lg class)', () => {
    const { container } = render(<PrimaryAction size="md" />)

    const button = container.querySelector('button')
    expect(button).toHaveClass('touch-target-lg')
  })

  it('renders with md size (56px) by default', () => {
    const { container } = render(<PrimaryAction />)

    const button = container.querySelector('button')
    expect(button).toHaveClass('h-14', 'w-14', 'min-h-14', 'min-w-14')
  })

  it('renders with sm size (48px) when specified', () => {
    const { container } = render(<PrimaryAction size="sm" />)

    const button = container.querySelector('button')
    expect(button).toHaveClass('h-12', 'w-12', 'min-h-12', 'min-w-12')
  })

  it('renders with lg size (64px) when specified', () => {
    const { container } = render(<PrimaryAction size="lg" />)

    const button = container.querySelector('button')
    expect(button).toHaveClass('h-16', 'w-16', 'min-h-16', 'min-w-16')
  })

  it('should render with icon as ReactNode', () => {
    render(<PrimaryAction icon={<span data-testid="icon">✨</span>} />)

    const icon = screen.getByTestId('icon')
    expect(icon).toBeInTheDocument()
  })

  it('renders with floating styling (rounded, shadow)', () => {
    const { container } = render(<PrimaryAction />)

    const button = container.querySelector('button')
    expect(button).toHaveClass('rounded-full', 'shadow-lg')
  })

  it('applies focus-visible styling for keyboard accessibility', () => {
    const { container } = render(<PrimaryAction />)

    const button = container.querySelector('button')
    expect(button).toHaveClass('focus-visible:outline-2', 'focus-visible:outline-ring')
  })

  it('calls onClick handler when clicked', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(<PrimaryAction onClick={onClick} />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(onClick).toHaveBeenCalledOnce()
  })

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(<PrimaryAction onClick={onClick} disabled={true} />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()

    await user.click(button)

    expect(onClick).not.toHaveBeenCalled()
  })

  it('shows disabled state with opacity-50', () => {
    const { container } = render(<PrimaryAction disabled={true} />)

    const button = container.querySelector('button')
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('renders as link when href is provided', () => {
    render(<PrimaryAction href="/tracker/new" />)

    const link = screen.getByRole('button', { name: /Create/i })
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/tracker/new')
  })

  it('renders loading state with aria-busy', () => {
    render(<PrimaryAction loading={true} />)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('does not call onClick when loading', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()

    render(<PrimaryAction onClick={onClick} loading={true} />)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies primary color from design tokens', () => {
    const { container } = render(<PrimaryAction />)

    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('applies hover effects (scale-105, shadow-xl)', () => {
    const { container } = render(<PrimaryAction />)

    const button = container.querySelector('button')
    expect(button).toHaveClass('hover:scale-105', 'hover:shadow-xl')
  })

  it('applies active effects (scale-95)', () => {
    const { container } = render(<PrimaryAction />)

    const button = container.querySelector('button')
    expect(button).toHaveClass('active:scale-95')
  })

  it('supports custom className', () => {
    const { container } = render(<PrimaryAction className="custom-class" />)

    const button = container.querySelector('button')
    expect(button).toHaveClass('custom-class')
  })

  it('dark mode support with dark: prefixed classes', () => {
    const { container } = render(<PrimaryAction />)

    const button = container.querySelector('button')
    expect(button).toHaveClass('dark:bg-primary', 'dark:text-primary-foreground')
  })

  it('shows label only on lg size', () => {
    const { rerender } = render(
      <PrimaryAction label="Create" size="sm" />,
    )

    let text = screen.queryByText('Create')
    expect(text).not.toBeInTheDocument()

    rerender(<PrimaryAction label="Create" size="lg" />)

    text = screen.getByText('Create')
    expect(text).toBeInTheDocument()
  })

  it('renders loading spinner when loading', () => {
    const { container } = render(<PrimaryAction loading={true} />)

    const spinner = container.querySelector('svg')
    expect(spinner).toBeInTheDocument()
    expect(spinner?.parentElement).toHaveClass('animate-spin')
  })

  it('maintains 48px minimum safe-area offset for FAB positioning', () => {
    const { container } = render(<PrimaryAction size="md" />)

    // The component should be 56px (h-14 = 56px)
    // When positioned with safe-area offset, it uses min 48px
    const button = container.querySelector('button')
    expect(button).toHaveClass('touch-target-lg') // min 48px
    expect(button).toHaveClass('h-14') // 56px actual
  })
})
