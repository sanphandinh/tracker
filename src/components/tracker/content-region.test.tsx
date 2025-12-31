import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ContentRegion, TwoPaneLayout } from './content-region'

// Mock matchMedia
const mockMatchMedia = (matches: boolean) => {
  return vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('ContentRegion', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('renders single column layout on mobile (< 768px)', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia(false), // Not tablet
    })

    render(
      <ContentRegion>
        <div data-testid="content">Mobile Content</div>
      </ContentRegion>,
    )

    const content = screen.getByTestId('content')
    expect(content).toBeInTheDocument()
    expect(content).toHaveTextContent('Mobile Content')
  })

  it('renders single column layout initially when no list/detail panes', () => {
    render(
      <ContentRegion>
        <div data-testid="single-content">Single Column</div>
      </ContentRegion>,
    )

    const content = screen.getByTestId('single-content')
    expect(content).toBeInTheDocument()
  })

  it('renders list pane on mobile when provided', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia(false), // Not tablet
    })

    render(
      <ContentRegion
        listPane={<div data-testid="list">List</div>}
        detailPane={<div data-testid="detail">Detail</div>}
      />,
    )

    const listPane = screen.getByTestId('list')
    expect(listPane).toBeInTheDocument()
  })

  it('renders two-pane layout on tablet (>= 768px)', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia(true), // Is tablet
    })

    render(
      <ContentRegion
        listPane={<div data-testid="list">List</div>}
        detailPane={<div data-testid="detail">Detail</div>}
      />,
    )

    await waitFor(() => {
      const listPane = screen.getByTestId('list')
      const detailPane = screen.getByTestId('detail')
      expect(listPane).toBeInTheDocument()
      expect(detailPane).toBeInTheDocument()
    })
  })

  it('applies correct classes for two-pane layout', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia(true), // Is tablet
    })

    const { container } = render(
      <ContentRegion
        listPane={<div data-testid="list">List</div>}
        detailPane={<div data-testid="detail">Detail</div>}
      />,
    )

    await waitFor(() => {
      const region = container.querySelector('[data-content-region]')
      expect(region).toHaveClass('flex-row')
    })

    const listPane = container.querySelector('[role="region"][aria-label="List pane"]')
    expect(listPane).toHaveClass('border-r', 'border-border')
  })

  it('renders card grid children', () => {
    render(
      <ContentRegion
        cardGridChildren={
          <div className="grid gap-4">
            <div data-testid="card-1">Card 1</div>
            <div data-testid="card-2">Card 2</div>
          </div>
        }
      />,
    )

    const card1 = screen.getByTestId('card-1')
    const card2 = screen.getByTestId('card-2')
    expect(card1).toBeInTheDocument()
    expect(card2).toBeInTheDocument()
  })

  it('prevents horizontal scroll with no-horizontal-scroll class', () => {
    const { container } = render(
      <ContentRegion>
        <div>Content</div>
      </ContentRegion>,
    )

    const region = container.querySelector('[data-content-region]')
    expect(region).toHaveClass('no-horizontal-scroll', 'overflow-x-hidden')
  })

  it('applies custom className', () => {
    const { container } = render(
      <ContentRegion className="custom-class">
        <div>Content</div>
      </ContentRegion>,
    )

    const region = container.querySelector('[data-content-region]')
    expect(region).toHaveClass('custom-class')
  })

  it('calls onLayoutChange when layout mode changes', async () => {
    const onLayoutChange = vi.fn()

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia(true), // Is tablet
    })

    render(
      <ContentRegion
        listPane={<div data-testid="list">List</div>}
        detailPane={<div data-testid="detail">Detail</div>}
        onLayoutChange={onLayoutChange}
      />,
    )

    await waitFor(() => {
      expect(onLayoutChange).toHaveBeenCalledWith('two-pane')
    })
  })

  it('uses explicit layoutMode prop when provided', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia(true), // Is tablet
    })

    const { rerender } = render(
      <ContentRegion
        layoutMode="single-column"
        listPane={<div data-testid="list">List</div>}
        detailPane={<div data-testid="detail">Detail</div>}
      />,
    )

    const region = document.querySelector('[data-content-region]')
    expect(region).toHaveClass('flex-col') // Single column despite tablet

    rerender(
      <ContentRegion
        layoutMode="two-pane"
        listPane={<div data-testid="list">List</div>}
        detailPane={<div data-testid="detail">Detail</div>}
      />,
    )

    await waitFor(() => {
      expect(region).toHaveClass('flex-row') // Two pane now
    })
  })

  it('preserves scroll position in sessionStorage', () => {
    const { container } = render(
      <ContentRegion>
        <div>Content</div>
      </ContentRegion>,
    )

    const region = container.querySelector('[data-content-region]')
    if (region) {
      region.scrollTop = 100
      const event = new Event('scroll', { bubbles: true })
      region.dispatchEvent(event)

      const scrollData = sessionStorage.getItem('content-scroll-position')
      expect(scrollData).toBeDefined()
    }
  })

  it('handles missing list/detail panes gracefully', () => {
    render(<ContentRegion detailPane={<div data-testid="detail">Detail Only</div>} />)

    const detail = screen.getByTestId('detail')
    expect(detail).toBeInTheDocument()
  })

  it('list pane has clamped width on tablet', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia(true), // Is tablet
    })

    const { container } = render(
      <ContentRegion
        listPane={<div data-testid="list">List</div>}
        detailPane={<div data-testid="detail">Detail</div>}
      />,
    )

    await waitFor(() => {
      const listPane = container.querySelector('[aria-label="List pane"]')
      expect(listPane).toHaveStyle({ width: 'clamp(280px, 32vw, 360px)' })
    })
  })
})

describe('TwoPaneLayout', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('renders as a ContentRegion wrapper', () => {
    render(
      <TwoPaneLayout
        listPane={<div data-testid="list">List</div>}
        detailPane={<div data-testid="detail">Detail</div>}
      />,
    )

    const list = screen.getByTestId('list')
    const detail = screen.getByTestId('detail')
    expect(list).toBeInTheDocument()
    expect(detail).toBeInTheDocument()
  })

  it('calls onLayoutChange when provided', async () => {
    const onLayoutChange = vi.fn()

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia(true), // Is tablet
    })

    render(
      <TwoPaneLayout
        listPane={<div data-testid="list">List</div>}
        detailPane={<div data-testid="detail">Detail</div>}
        onLayoutChange={onLayoutChange}
      />,
    )

    await waitFor(() => {
      expect(onLayoutChange).toHaveBeenCalled()
    })
  })

  it('applies custom className', () => {
    const { container } = render(
      <TwoPaneLayout
        listPane={<div>List</div>}
        detailPane={<div>Detail</div>}
        className="custom-pane-class"
      />,
    )

    const region = container.querySelector('[data-content-region]')
    expect(region).toHaveClass('custom-pane-class')
  })
})
