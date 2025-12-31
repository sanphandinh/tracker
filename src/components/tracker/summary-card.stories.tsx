import type { Meta, StoryObj } from '@storybook/react'
import { SummaryCard } from './summary-card'
import type { BooleanSummary, NumberSummary, DropdownSummary, TextSummary } from '@/lib/tracker/calculations'

const meta = {
  title: 'Tracker/SummaryCard',
  component: SummaryCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SummaryCard>

export default meta
type Story = StoryObj<typeof meta>

const booleanSummary: BooleanSummary = {
  attributeId: '1',
  attributeName: 'Điểm danh',
  attributeType: 'boolean',
  checked: 25,
  total: 30,
  percentage: 83.33,
}

const currencySummary: BooleanSummary = {
  attributeId: '2',
  attributeName: 'Tiền ăn 150k',
  attributeType: 'boolean-currency',
  currencyValue: 150000,
  checked: 20,
  total: 30,
  percentage: 66.67,
  subtotal: 3000000,
}

const numberSummary: NumberSummary = {
  attributeId: '3',
  attributeName: 'Điểm',
  attributeType: 'number',
  sum: 2500,
  average: 83.33,
  min: 65,
  max: 95,
  count: 30,
}

const dropdownSummary: DropdownSummary = {
  attributeId: '4',
  attributeName: 'Xếp loại',
  attributeType: 'dropdown',
  counts: {
    'Xuất sắc': 5,
    'Giỏi': 15,
    'Khá': 8,
    'Trung bình': 2,
  },
  total: 30,
}

const textSummary: TextSummary = {
  attributeId: '5',
  attributeName: 'Ghi chú',
  attributeType: 'text',
  filled: 18,
  empty: 12,
  total: 30,
}

export const Boolean: Story = {
  args: {
    summary: booleanSummary,
  },
}

export const BooleanCurrency: Story = {
  args: {
    summary: currencySummary,
  },
}

export const Number: Story = {
  args: {
    summary: numberSummary,
  },
}

export const Dropdown: Story = {
  args: {
    summary: dropdownSummary,
  },
}

export const Text: Story = {
  args: {
    summary: textSummary,
  },
}

export const WithClickHandler: Story = {
  args: {
    summary: booleanSummary,
    onClick: () => alert('Card clicked!'),
  },
}

export const EmptyDropdown: Story = {
  args: {
    summary: {
      ...dropdownSummary,
      counts: {},
      total: 0,
    } as DropdownSummary,
  },
}
