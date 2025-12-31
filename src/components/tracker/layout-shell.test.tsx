import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LayoutShell } from './layout-shell'

describe('LayoutShell', () => {
  beforeEach(() => {
    // Reset matchMedia mock before each test
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: query.includes('dark') ? false : true,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      }),
    })
  })

  it('renders layout shell with children', () => {
    render(
      <LayoutShell>
        <div data-testid="test-content">Content</div>
      </LayoutShell>,
    )

    const content = screen.getByTestId('test-content')
    expect(content).toBeInTheDocument()
    expect(content).toHaveTextContent('Content')
  })

  it('renders with header when provided', () => {
    render(
      <LayoutShell header={<header data-testid="test-header">Header</header>}>
        <div>Content</div>
      </LayoutShell>,
    )

    const header = screen.getByTestId('test-header')
    expect(header).toBeInTheDocument()
    expect(header.parentElement).toHaveClass('sticky', 'top-0')
  })

  it('renders with navigation when provided', () => {
    render(
      <LayoutShell navigation={<nav data-testid="test-nav">Nav</nav>}>
        <div>Content</div>
      </LayoutShell>,
    )

    const nav = screen.getByTestId('test-nav')
    expect(nav).toBeInTheDocument()
    expect(nav.parentElement).toHaveClass('sticky', 'bottom-0')
  })

  it('renders primary action when provided', () => {
    render(
      <LayoutShell primaryAction={<button data-testid="test-fab">Create</button>}>
        <div>Content</div>
      </LayoutShell>,
    )

    const fab = screen.getByTestId('test-fab')
    expect(fab).toBeInTheDocument()
  })

  it('applies safe area classes when safeAreaTop and safeAreaBottom are true', () => {
    const { container } = render(
      <LayoutShell safeAreaTop={true} safeAreaBottom={true} header={<div>Header</div>}>
        <div>Content</div>
      </LayoutShell>,
    )

    const header = container.querySelector('header')
    expect(header).toHaveClass('safe-pt')
  })

  it('does not apply safe area classes when disabled', () => {
    const { container } = render(
      <LayoutShell safeAreaTop={false} safeAreaBottom={false} header={<div>Header</div>}>
        <div>Content</div>
      </LayoutShell>,
    )

    const header = container.querySelector('header')
    expect(header).not.toHaveClass('safe-pt')
  })

  it('applies theme classes based on theme prop', () => {
    const { container, rerender } = render(
      <LayoutShell theme="light">
        <div>Content</div>
      </LayoutShell>,
    )

    let shell = container.querySelector('div.flex')
    expect(shell).not.toHaveClass('dark')

    rerender(
      <LayoutShell theme="dark">
        <div>Content</div>
      </LayoutShell>,
    )

    shell = container.querySelector('div.flex')
    expect(shell).toHaveClass('dark')
  })

  it('sets correct header height classes', () => {
    const { container, rerender } = render(
      <LayoutShell headerHeight="sm" header={<div>Header</div>}>
        <div>Content</div>
      </LayoutShell>,
    )

    let header = container.querySelector('header')
    expect(header).toHaveClass('h-14')

    rerender(
      <LayoutShell headerHeight="md" header={<div>Header</div>}>
        <div>Content</div>
      </LayoutShell>,
    )

    header = container.querySelector('header')
    expect(header).toHaveClass('h-16')
  })

  it('main content area has correct overflow properties', () => {
    const { container } = render(
      <LayoutShell>
        <div>Content</div>
      </LayoutShell>,
    )

    const main = container.querySelector('main')
    expect(main).toHaveClass('overflow-y-auto', 'overflow-x-hidden')
  })

  it('applies custom className', () => {
    const { container } = render(
      <LayoutShell className="custom-class">
        <div>Content</div>
      </LayoutShell>,
    )

    const shell = container.querySelector('div.flex')
    expect(shell).toHaveClass('custom-class')
  })
})
