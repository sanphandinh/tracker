import type { Meta, StoryObj } from '@storybook/react'
import { NavigationItem } from '../tracker/navigation-item'

const meta: Meta<typeof NavigationItem> = {
  title: 'Components/NavigationItem',
  component: NavigationItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'Unique identifier for the navigation item',
    },
    label: {
      control: 'text',
      description: 'Display label for the navigation item',
    },
    route: {
      control: 'text',
      description: 'Route path this navigation item links to',
    },
    icon: {
      control: false,
      description: 'Icon element or string to display',
    },
    badgeCount: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Optional badge count for notifications',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback when navigation item is clicked',
    },
  },
}

export default meta

type Story = StoryObj<typeof NavigationItem>

/**
 * Default inactive navigation item
 */
export const Default: Story = {
  args: {
    id: 'home',
    label: 'Home',
    route: '/',
    icon: '🏠',
  },
}

/**
 * Active navigation item with primary color and bottom border
 */
export const Active: Story = {
  args: {
    id: 'sheets',
    label: 'Bảng',
    route: '/tracker',
    icon: '📋',
  },
  parameters: {
    pseudo: { active: true },
  },
}

/**
 * Navigation item with badge for unread count
 */
export const WithBadge: Story = {
  args: {
    id: 'notifications',
    label: 'Thông báo',
    route: '/notifications',
    icon: '🔔',
    badgeCount: 5,
  },
}

/**
 * Navigation item with high badge count (shows as 99+)
 */
export const WithHighBadgeCount: Story = {
  args: {
    id: 'messages',
    label: 'Tin nhắn',
    route: '/messages',
    icon: '💬',
    badgeCount: 150,
  },
}

/**
 * Settings navigation item - inactive state
 */
export const Settings: Story = {
  args: {
    id: 'settings',
    label: 'Cài đặt',
    route: '/settings',
    icon: '⚙️',
  },
}

/**
 * Navigation item with long Vietnamese text
 * Demonstrates text wrapping behavior
 */
export const LongLabel: Story = {
  args: {
    id: 'attendance',
    label: 'Điểm danh',
    route: '/tracker',
    icon: '✓',
  },
}

/**
 * Navigation item with focus state
 * Demonstrates keyboard accessibility
 */
export const Focused: Story = {
  args: {
    id: 'home',
    label: 'Home',
    route: '/',
    icon: '🏠',
  },
  parameters: {
    pseudo: { focusVisible: true },
  },
}

/**
 * Navigation item with hover state
 */
export const Hovered: Story = {
  args: {
    id: 'sheets',
    label: 'Bảng',
    route: '/tracker',
    icon: '📋',
  },
  parameters: {
    pseudo: { hover: true },
  },
}

/**
 * Multiple navigation items in a row (mobile nav context)
 */
export const MultipleItems: Story = {
  render: () => (
    <div className="flex h-14 gap-0 border border-border">
      <NavigationItem
        id="home"
        label="Home"
        route="/"
        icon="🏠"
      />
      <NavigationItem
        id="sheets"
        label="Bảng"
        route="/tracker"
        icon="📋"
      />
      <NavigationItem
        id="settings"
        label="Cài đặt"
        route="/settings"
        icon="⚙️"
      />
    </div>
  ),
}

/**
 * Navigation items with React icons (simulate lucide-react)
 */
export const WithIconComponent: Story = {
  args: {
    id: 'home',
    label: 'Home',
    route: '/',
    icon: <span className="text-lg">🏠</span>,
  },
}

/**
 * Dark theme variant
 */
export const DarkTheme: Story = {
  args: {
    id: 'sheets',
    label: 'Bảng',
    route: '/tracker',
    icon: '📋',
  },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-4 rounded">
        <Story />
      </div>
    ),
  ],
}
