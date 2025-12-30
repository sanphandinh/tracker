import type { Meta, StoryObj } from '@storybook/react'
import { CellInput } from './cell-input'
import type { Attribute } from '@/lib/tracker/types'

const meta = {
  title: 'Tracker/CellInput',
  component: CellInput,
  parameters: {
    layout: 'centered',
  },
  args: {
    onChange: () => {},
    disabled: false,
  },
} satisfies Meta<typeof CellInput>

export default meta
type Story = StoryObj<typeof meta>

// Helper to create mock attribute
function createAttribute(type: Attribute['type'], overrides?: Partial<Attribute>): Attribute {
  return {
    id: crypto.randomUUID(),
    sheetId: crypto.randomUUID(),
    name: `${type} Attribute`,
    type,
    position: 0,
    ...overrides,
  }
}

// ========== BOOLEAN STORIES ==========

export const BooleanNull: Story = {
  args: {
    attribute: createAttribute('boolean'),
    value: null,
  },
}

export const BooleanTrue: Story = {
  args: {
    attribute: createAttribute('boolean'),
    value: true,
  },
}

export const BooleanFalse: Story = {
  args: {
    attribute: createAttribute('boolean'),
    value: false,
  },
}

export const BooleanDisabled: Story = {
  args: {
    attribute: createAttribute('boolean'),
    value: true,
    disabled: true,
  },
}

// ========== BOOLEAN-CURRENCY STORIES ==========

export const BooleanCurrencyNull: Story = {
  args: {
    attribute: createAttribute('boolean-currency', { currencyValue: 150000 }),
    value: null,
  },
}

export const BooleanCurrencyTrue: Story = {
  args: {
    attribute: createAttribute('boolean-currency', { currencyValue: 150000 }),
    value: true,
  },
}

export const BooleanCurrencyFalse: Story = {
  args: {
    attribute: createAttribute('boolean-currency', { currencyValue: 150000 }),
    value: false,
  },
}

export const BooleanCurrencyLarge: Story = {
  args: {
    attribute: createAttribute('boolean-currency', { currencyValue: 5000000 }),
    value: true,
  },
}

export const BooleanCurrencySmall: Story = {
  args: {
    attribute: createAttribute('boolean-currency', { currencyValue: 50 }),
    value: true,
  },
}

// ========== NUMBER STORIES ==========

export const NumberNull: Story = {
  args: {
    attribute: createAttribute('number'),
    value: null,
  },
}

export const NumberZero: Story = {
  args: {
    attribute: createAttribute('number'),
    value: 0,
  },
}

export const NumberPositive: Story = {
  args: {
    attribute: createAttribute('number'),
    value: 42,
  },
}

export const NumberLarge: Story = {
  args: {
    attribute: createAttribute('number'),
    value: 999999,
  },
}

export const NumberDisabled: Story = {
  args: {
    attribute: createAttribute('number'),
    value: 42,
    disabled: true,
  },
}

// ========== TEXT STORIES ==========

export const TextEmpty: Story = {
  args: {
    attribute: createAttribute('text'),
    value: null,
  },
}

export const TextShort: Story = {
  args: {
    attribute: createAttribute('text'),
    value: 'Hello',
  },
}

export const TextLong: Story = {
  args: {
    attribute: createAttribute('text'),
    value: 'This is a longer text input with more content',
  },
}

export const TextDisabled: Story = {
  args: {
    attribute: createAttribute('text'),
    value: 'Disabled text',
    disabled: true,
  },
}

// ========== DROPDOWN STORIES ==========

export const DropdownNull: Story = {
  args: {
    attribute: createAttribute('dropdown', {
      options: ['Mức 1', 'Mức 2', 'Mức 3', 'Mức 4'],
    }),
    value: null,
  },
}

export const DropdownSelected: Story = {
  args: {
    attribute: createAttribute('dropdown', {
      options: ['Mức 1', 'Mức 2', 'Mức 3', 'Mức 4'],
    }),
    value: 'Mức 2',
  },
}

export const DropdownManyOptions: Story = {
  args: {
    attribute: createAttribute('dropdown', {
      options: Array.from({ length: 20 }, (_, i) => `Option ${i + 1}`),
    }),
    value: null,
  },
}

export const DropdownDisabled: Story = {
  args: {
    attribute: createAttribute('dropdown', {
      options: ['Option 1', 'Option 2', 'Option 3'],
    }),
    value: 'Option 1',
    disabled: true,
  },
}

// ========== COMPARISON STORIES ==========

export const AllTypesNull: Story = {
  args: {
    onChange: () => {},
    disabled: false,
  } as any,
  render: (args) => {
    const types: Array<Attribute['type']> = ['boolean', 'number', 'text', 'dropdown', 'boolean-currency']

    return (
      <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3">
        {types.map((type) => {
          const attribute = createAttribute(type, {
            currencyValue: type === 'boolean-currency' ? 150000 : undefined,
            options: type === 'dropdown' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
          })

          return (
            <div key={type} className="space-y-2">
              <p className="text-sm font-medium">{type}</p>
              <CellInput {...args} attribute={attribute} value={null} />
            </div>
          )
        })}
      </div>
    )
  },
}

export const AllTypesWithValues: Story = {
  args: {
    onChange: () => {},
    disabled: false,
  } as any,
  render: (args) => {
    const configs: Array<{ type: Attribute['type']; value: boolean | number | string | null }> = [
      { type: 'boolean', value: true },
      { type: 'number', value: 42 },
      { type: 'text', value: 'Sample' },
      { type: 'dropdown', value: 'Option 2' },
      { type: 'boolean-currency', value: true },
    ]

    return (
      <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3">
        {configs.map(({ type, value }) => {
          const attribute = createAttribute(type, {
            currencyValue: type === 'boolean-currency' ? 150000 : undefined,
            options: type === 'dropdown' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
          })

          return (
            <div key={type} className="space-y-2">
              <p className="text-sm font-medium">{type}</p>
              <CellInput {...args} attribute={attribute} value={value} />
            </div>
          )
        })}
      </div>
    )
  },
}

// ========== INTERACTION STORIES ==========

export const InteractiveBooleanCycle: Story = {
  args: {
    attribute: createAttribute('boolean'),
    value: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Click to cycle through: null (—) → true (✓) → false (✗) → null (—)',
      },
    },
  },
}

export const InteractiveNumberInput: Story = {
  args: {
    attribute: createAttribute('number'),
    value: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'Type a number or use the spinner buttons to change the value',
      },
    },
  },
}

export const InteractiveDropdown: Story = {
  args: {
    attribute: createAttribute('dropdown', {
      options: ['Low', 'Medium', 'High', 'Critical'],
    }),
    value: 'Medium',
  },
  parameters: {
    docs: {
      description: {
        story: 'Select an option from the dropdown, or choose the empty option to clear',
      },
    },
  },
}

// ========== ACCESSIBILITY STORIES ==========

export const AccessibilityBooleanKeyboard: Story = {
  args: {
    attribute: createAttribute('boolean'),
    value: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Boolean inputs can be toggled with Enter or Space key when focused',
      },
    },
  },
}

export const AccessibilityTouchTargets: Story = {
  args: {
    onChange: () => {},
    disabled: false,
  } as any,
  render: (args) => (
    <div className="space-y-4 p-4">
      <p className="text-sm text-muted-foreground">All inputs have minimum 44×44px touch targets</p>
      <div className="grid gap-4">
        <CellInput
          {...args}
          attribute={createAttribute('boolean')}
          value={null}
        />
        <CellInput
          {...args}
          attribute={createAttribute('number')}
          value={42}
        />
        <CellInput
          {...args}
          attribute={createAttribute('dropdown', {
            options: ['Option 1', 'Option 2'],
          })}
          value={null}
        />
      </div>
    </div>
  ),
}
