import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NavigationZone, useTrackerNavItems } from './navigation-zone'
import type { NavigationItemProps } from './navigation-item'

describe('NavigationZone', () => {
  const mockItems: NavigationItemProps[] = [
    { id: 'home', label: 'Home', route: '/', icon: '🏠' },
    { id: 'sheets', label: 'Sheets', route: '/sheets', icon: '📋' },
    { id: 'settings', label: 'Settings', route: '/settings', icon: '⚙️' },
  ]

  beforeEach(() => {
    // Mock setup if needed
  })

  it('renders 3 navigation items', () => {
    render(<NavigationZone items={mockItems} />)

    const navItems = screen.getAllByRole('button')
    expect(navItems).toHaveLength(3)
  })

  it('renders navigation with correct labels', () => {
    render(<NavigationZone items={mockItems} />)

    expect(screen.getByLabelText(/Home/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Sheets/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Settings/i)).toBeInTheDocument()
  })

  it('renders nav element with proper semantics', () => {
    const { container } = render(<NavigationZone items={mockItems} />)

    const nav = container.querySelector('nav')
    expect(nav).toHaveAttribute('role', 'navigation')
    expect(nav).toHaveAttribute('aria-label', 'Main navigation')
  })

  it('has minimum 44px height touch targets', () => {
    const { container } = render(<NavigationZone items={mockItems} />)

    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('min-h-14') // h-14 = 56px minimum
    expect(nav).toHaveClass('h-14')
  })

  it('applies space-between alignment by default', () => {
    const { container } = render(<NavigationZone items={mockItems} />)

    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('justify-between')
  })

  it('applies centered alignment when specified', () => {
    const { container } = render(
      <NavigationZone items={mockItems} alignment="centered" />,
    )

    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('justify-center')
  })

  it('applies bottom-fixed layout by default', () => {
    const { container } = render(<NavigationZone items={mockItems} />)

    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('fixed', 'bottom-0', 'left-0', 'right-0')
  })

  it('applies side layout when specified', () => {
    const { container } = render(
      <NavigationZone items={mockItems} layout="side" />,
    )

    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('sticky')
  })

  it('prevents horizontal scroll', () => {
    const { container } = render(<NavigationZone items={mockItems} />)

    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('overflow-x-hidden', 'no-horizontal-scroll')
  })

  it('applies safe area padding', () => {
    const { container } = render(<NavigationZone items={mockItems} />)

    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('safe-px', 'safe-pb')
  })

  it('applies custom className', () => {
    const { container } = render(
      <NavigationZone items={mockItems} className="custom-nav-class" />,
    )

    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('custom-nav-class')
  })

  it('calls onItemClick callback when item is clicked', async () => {
    const onItemClick = vi.fn()
    const user = userEvent.setup()

    render(
      <NavigationZone items={mockItems} onItemClick={onItemClick} />,
    )

    const homeButton = screen.getByLabelText(/Home/)
    await user.click(homeButton)

    expect(onItemClick).toHaveBeenCalledWith('home')
  })

  it('warns when fewer than 3 items provided', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <NavigationZone items={[mockItems[0], mockItems[1]]} />,
    )

    expect(warnSpy).toHaveBeenCalledWith(
      'NavigationZone: Minimum 3 items required, got',
      2,
    )

    warnSpy.mockRestore()
  })

  it('warns when more than 4 items provided', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const extraItems = [
      ...mockItems,
      { id: 'extra1', label: 'Extra', route: '/extra', icon: '⭐' },
      { id: 'extra2', label: 'Extra2', route: '/extra2', icon: '⭐' },
    ]

    render(<NavigationZone items={extraItems} />)

    expect(warnSpy).toHaveBeenCalledWith(
      'NavigationZone: Maximum 4 items recommended, got',
      5,
    )

    warnSpy.mockRestore()
  })

  it('limits to 4 items maximum', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const extraItems = [
      ...mockItems,
      { id: 'extra1', label: 'Extra', route: '/extra', icon: '⭐' },
      { id: 'extra2', label: 'Extra2', route: '/extra2', icon: '⭐' },
    ]

    render(<NavigationZone items={extraItems} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)

    warnSpy.mockRestore()
  })

  it('has border-top for visual separation', () => {
    const { container } = render(<NavigationZone items={mockItems} />)

    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('border-t', 'border-border')
  })

  it('supports keyboard navigation with Tab key', async () => {
    const user = userEvent.setup()

    render(<NavigationZone items={mockItems} />)

    const buttons = screen.getAllByRole('button')
    const firstButton = buttons[0]

    // Initial focus outside
    expect(firstButton).not.toHaveFocus()

    // Tab to first item
    await user.tab()
    expect(firstButton).toHaveFocus()

    // Tab to next item
    await user.tab()
    expect(buttons[1]).toHaveFocus()
  })
})

describe('useTrackerNavItems hook', () => {
  it('returns default tracker navigation items', () => {
    const items = useTrackerNavItems()

    expect(items).toHaveLength(3)
    expect(items.map(i => i.id)).toEqual(['home', 'sheets', 'settings'])
  })

  it('includes correct routes', () => {
    const items = useTrackerNavItems()

    const routes = items.map(i => i.route)
    expect(routes).toEqual(['/', '/tracker', '/tracker/settings'])
  })

  it('includes Vietnamese labels', () => {
    const items = useTrackerNavItems()

    const labels = items.map(i => i.label)
    expect(labels).toContain('Bảng')
    expect(labels).toContain('Cài đặt')
  })

  it('all items have aria-label for accessibility', () => {
    const items = useTrackerNavItems()

    items.forEach(item => {
      expect(item['aria-label']).toBeDefined()
      expect(typeof item['aria-label']).toBe('string')
    })
  })
})
