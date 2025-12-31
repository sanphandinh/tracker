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

  it('shows list + detail visible at 768px', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia(true), // Is tablet (≥768px)
    })

    render(
      <TwoPaneLayout
        listPane={<div data-testid="list-pane">List Content</div>}
        detailPane={<div data-testid="detail-pane">Detail Content</div>}
      />,
    )

    // Both panes should be visible simultaneously
    await waitFor(() => {
      const list = screen.getByTestId('list-pane')
      const detail = screen.getByTestId('detail-pane')
      expect(list).toBeInTheDocument()
      expect(detail).toBeInTheDocument()
      expect(list).toBeVisible()
      expect(detail).toBeVisible()
    })
  })

  it('shows single column at 767px', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia(false), // Not tablet (<768px)
    })

    render(
      <TwoPaneLayout
        listPane={<div data-testid="list-pane">List Content</div>}
        detailPane={<div data-testid="detail-pane">Detail Content</div>}
      />,
    )

    // In single column mode, only one pane is visible at a time (rendered but in single-column flow)
    await waitFor(() => {
      const list = screen.getByTestId('list-pane')
      expect(list).toBeInTheDocument()
    })
  })

  it('transitions from single column to two-pane when crossing 768px breakpoint', async () => {
    // Start below tablet breakpoint
    const matchMediaMock = mockMatchMedia(false)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    })

    const onLayoutChange = vi.fn()
    const { rerender } = render(
      <TwoPaneLayout
        listPane={<div data-testid="list-pane">List</div>}
        detailPane={<div data-testid="detail-pane">Detail</div>}
        onLayoutChange={onLayoutChange}
      />,
    )

    // Initially should be single column
    await waitFor(() => {
      expect(onLayoutChange).toHaveBeenCalledWith('single-column')
    })

    // Simulate crossing to tablet breakpoint
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia(true), // Now tablet
    })

    onLayoutChange.mockClear()
    rerender(
      <TwoPaneLayout
        listPane={<div data-testid="list-pane">List</div>}
        detailPane={<div data-testid="detail-pane">Detail</div>}
        onLayoutChange={onLayoutChange}
      />,
    )

    // Should transition to two-pane
    await waitFor(() => {
      expect(onLayoutChange).toHaveBeenCalledWith('two-pane')
    })
  })

  it('maintains state and scroll position across orientation changes', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia(true),
    })

    const { container } = render(
      <TwoPaneLayout
        listPane={
          <div data-testid="list-pane" style={{ height: '1000px' }}>
            Scrollable List
          </div>
        }
        detailPane={<div data-testid="detail-pane">Detail</div>}
      />,
    )

    const region = container.querySelector('[data-content-region]')
    expect(region).toBeInTheDocument()

    // Simulate scroll
    if (region) {
      region.scrollTop = 100
      region.dispatchEvent(new Event('scroll'))
    }

    // Verify scroll position was saved
    await waitFor(() => {
      const saved = sessionStorage.getItem('content-scroll-position')
      expect(saved).toBeTruthy()
    })
  })

  it('prevents horizontal scroll with long Vietnamese text at 320px', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia(false), // Mobile
    })

    const { container } = render(
      <ContentRegion>
        <div data-testid="long-text">
          Đây là một đoạn văn bản tiếng Việt rất dài với nhiều từ dài như trách nhiệm phát triển đặc
          điểm để kiểm tra việc xuống dòng tự động không gây tràn ngang màn hình
        </div>
      </ContentRegion>,
    )

    const region = container.querySelector('[data-content-region]')
    expect(region).toHaveClass('no-horizontal-scroll')
    expect(region).toHaveClass('overflow-x-hidden')
  })

  it('prevents horizontal scroll with wide form content at 320px', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia(false), // Mobile
    })

    const { container } = render(
      <ContentRegion>
        <div data-testid="wide-form" style={{ minWidth: '500px' }}>
          Wide content that would overflow
        </div>
      </ContentRegion>,
    )

    const region = container.querySelector('[data-content-region]')
    expect(region).toHaveClass('overflow-x-hidden')
    expect(region).toHaveClass('no-horizontal-scroll')
  })

  it('handles long URLs without overflow', () => {
    render(
      <ContentRegion>
        <div data-testid="long-url" className="text-wrap-long wrap-break-word">
          https://example.com/very-long-url-path/that/should/wrap/properly/without/causing/horizontal/scroll
        </div>
      </ContentRegion>,
    )

    const text = screen.getByTestId('long-url')
    expect(text).toHaveClass('text-wrap-long')
    expect(text).toHaveClass('break-words')
  })
})
