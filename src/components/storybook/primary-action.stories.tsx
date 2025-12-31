import type { Meta, StoryObj } from '@storybook/react'
import { PrimaryAction } from '../tracker/primary-action'

const meta: Meta<typeof PrimaryAction> = {
  title: 'Components/PrimaryAction',
  component: PrimaryAction,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the action (visible on lg size)',
    },
    icon: {
      control: false,
      description: 'Icon element to display',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback when button is clicked',
    },
    href: {
      control: 'text',
      description: 'If provided, renders as a link instead of button',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the floating action button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    loading: {
      control: 'boolean',
      description: 'Show loading spinner',
    },
  },
}

export default meta

type Story = StoryObj<typeof PrimaryAction>

/**
 * Default primary action button (Create) - medium size
 * Ideal for bottom-right floating position
 */
export const Default: Story = {
  args: {
    label: 'Create',
    size: 'md',
  },
}

/**
 * Small floating action button
 * Use for confined spaces or secondary actions
 */
export const Small: Story = {
  args: {
    label: 'Add',
    size: 'sm',
  },
}

/**
 * Large floating action button with visible label
 * Use for primary important actions
 */
export const Large: Story = {
  args: {
    label: 'Create',
    size: 'lg',
  },
}

/**
 * Primary action with icon only (icon emoji)
 */
export const IconOnly: Story = {
  args: {
    icon: '➕',
    size: 'md',
    'aria-label': 'Create new item',
  },
}

/**
 * Primary action with icon and label
 */
export const WithIcon: Story = {
  args: {
    icon: '➕',
    label: 'Create',
    size: 'lg',
  },
}

/**
 * Loading state - shows spinner animation
 */
export const Loading: Story = {
  args: {
    label: 'Create',
    loading: true,
    size: 'md',
  },
}

/**
 * Disabled state - cannot be clicked
 */
export const Disabled: Story = {
  args: {
    label: 'Create',
    disabled: true,
    size: 'md',
  },
}

/**
 * As a link (href provided)
 * Renders as <a> instead of <button>
 */
export const AsLink: Story = {
  args: {
    label: 'Create New',
    href: '/tracker/new',
    size: 'md',
  },
}

/**
 * Hover state - shows scale and shadow elevation
 */
export const Hovered: Story = {
  args: {
    label: 'Create',
    size: 'md',
  },
  parameters: {
    pseudo: { hover: true },
  },
}

/**
 * Active/pressed state - shows scale-down effect
 */
export const Active: Story = {
  args: {
    label: 'Create',
    size: 'md',
  },
  parameters: {
    pseudo: { active: true },
  },
}

/**
 * Focused state - shows outline for keyboard accessibility
 */
export const Focused: Story = {
  args: {
    label: 'Create',
    size: 'md',
  },
  parameters: {
    pseudo: { focusVisible: true },
  },
}

/**
 * Dark theme variant
 * Shows proper contrast in dark mode
 */
export const DarkTheme: Story = {
  args: {
    label: 'Create',
    icon: '➕',
    size: 'lg',
  },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-8 rounded min-h-48 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
}

/**
 * Light theme variant
 * Shows contrast in light mode
 */
export const LightTheme: Story = {
  args: {
    label: 'Create',
    icon: '➕',
    size: 'lg',
  },
  decorators: [
    (Story) => (
      <div className="bg-background p-8 rounded min-h-48 flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
}

/**
 * Floating position example
 * Simulates typical FAB placement in bottom-right with safe area
 */
export const FloatingPositionExample: Story = {
  args: {
    label: 'Create',
    icon: '➕',
    size: 'md',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full h-screen bg-muted flex items-center justify-center">
        <div className="text-center text-muted-foreground mb-20">
          <p>Click the FAB in the bottom-right corner</p>
        </div>
        <div className="fixed bottom-4 right-4">
          <Story />
        </div>
      </div>
    ),
  ],
}

/**
 * With safe area padding (mobile notch/home indicator)
 */
export const WithSafeArea: Story = {
  args: {
    label: 'Create',
    icon: '➕',
    size: 'md',
  },
  decorators: [
    (Story) => (
      <div
        className="relative w-full h-screen bg-muted flex items-center justify-center"
        style={{
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        }}
      >
        <div className="fixed bottom-0 right-0">
          <div
            style={{
              paddingBottom: 'calc(var(--safe-area-bottom, 12px) + 12px)',
              paddingRight: 'var(--safe-area-right, 12px)',
            }}
          >
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
}

/**
 * Multiple sizes comparison
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-8 items-center justify-center p-8">
      <div className="flex flex-col items-center gap-2">
        <PrimaryAction size="sm" icon="➕" aria-label="Add small" />
        <p className="text-xs text-muted-foreground">Small (48px)</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PrimaryAction size="md" icon="➕" label="Create" aria-label="Add medium" />
        <p className="text-xs text-muted-foreground">Medium (56px)</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PrimaryAction size="lg" icon="➕" label="Create" aria-label="Add large" />
        <p className="text-xs text-muted-foreground">Large (64px)</p>
      </div>
    </div>
  ),
}

/**
 * Vietnamese context example
 */
export const VietnameseText: Story = {
  args: {
    label: 'Tạo',
    icon: '➕',
    size: 'lg',
  },
  decorators: [
    (Story) => (
      <div className="p-8 rounded border border-border">
        <Story />
      </div>
    ),
  ],
}
