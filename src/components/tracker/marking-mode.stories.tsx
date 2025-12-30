import type { Meta, StoryObj } from '@storybook/react'
import { MarkingMode } from './marking-mode'
import type { Entity, Attribute } from '@/lib/tracker/types'

const meta = {
  title: 'Tracker/MarkingMode',
  component: MarkingMode,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MarkingMode>

export default meta
type Story = StoryObj<typeof meta>

const mockEntities: Entity[] = [
  {
    id: 'entity-1',
    sheetId: 'sheet-1',
    name: 'Nguyễn Văn A',
    position: 0,
  },
  {
    id: 'entity-2',
    sheetId: 'sheet-1',
    name: 'Trần Thị B',
    position: 1,
  },
  {
    id: 'entity-3',
    sheetId: 'sheet-1',
    name: 'Lê Văn C',
    position: 2,
  },
  {
    id: 'entity-4',
    sheetId: 'sheet-1',
    name: 'Phạm Thị D',
    position: 3,
  },
  {
    id: 'entity-5',
    sheetId: 'sheet-1',
    name: 'Hoàng Văn E',
    position: 4,
  },
]

const booleanAttribute: Attribute = {
  id: 'attr-1',
  sheetId: 'sheet-1',
  name: 'Điểm danh',
  type: 'boolean',
  position: 0,
}

const currencyAttribute: Attribute = {
  id: 'attr-2',
  sheetId: 'sheet-1',
  name: 'Tiền ăn 150k',
  type: 'boolean-currency',
  currencyValue: 150000,
  position: 1,
}

const dropdownAttribute: Attribute = {
  id: 'attr-3',
  sheetId: 'sheet-1',
  name: 'Mức độ',
  type: 'dropdown',
  options: ['Mức 1', 'Mức 2', 'Mức 3'],
  position: 2,
}

const numberAttribute: Attribute = {
  id: 'attr-4',
  sheetId: 'sheet-1',
  name: 'Điểm số',
  type: 'number',
  position: 3,
}

const textAttribute: Attribute = {
  id: 'attr-5',
  sheetId: 'sheet-1',
  name: 'Ghi chú',
  type: 'text',
  position: 4,
}

/**
 * Default sequential marking mode with boolean attribute (attendance)
 */
export const BooleanMarking: Story = {
  args: {
    entities: mockEntities,
    primaryAttribute: booleanAttribute,
  },
}

/**
 * Sequential marking with currency collection
 */
export const CurrencyMarking: Story = {
  args: {
    entities: mockEntities,
    primaryAttribute: currencyAttribute,
  },
}

/**
 * Sequential marking with dropdown selection
 */
export const DropdownMarking: Story = {
  args: {
    entities: mockEntities,
    primaryAttribute: dropdownAttribute,
  },
}

/**
 * Sequential marking with number input
 */
export const NumberMarking: Story = {
  args: {
    entities: mockEntities,
    primaryAttribute: numberAttribute,
  },
}

/**
 * Sequential marking with text input
 */
export const TextMarking: Story = {
  args: {
    entities: mockEntities,
    primaryAttribute: textAttribute,
  },
}

/**
 * Sequential marking with only 2 entities
 */
export const FewEntities: Story = {
  args: {
    entities: mockEntities.slice(0, 2),
    primaryAttribute: booleanAttribute,
  },
}

/**
 * Sequential marking with many entities (10 students)
 */
export const ManyEntities: Story = {
  args: {
    entities: [
      ...mockEntities,
      {
        id: 'entity-6',
        sheetId: 'sheet-1',
        name: 'Đặng Thị F',
        position: 5,
      },
      {
        id: 'entity-7',
        sheetId: 'sheet-1',
        name: 'Vũ Văn G',
        position: 6,
      },
      {
        id: 'entity-8',
        sheetId: 'sheet-1',
        name: 'Bùi Thị H',
        position: 7,
      },
      {
        id: 'entity-9',
        sheetId: 'sheet-1',
        name: 'Ngô Văn I',
        position: 8,
      },
      {
        id: 'entity-10',
        sheetId: 'sheet-1',
        name: 'Trương Thị K',
        position: 9,
      },
    ],
    primaryAttribute: booleanAttribute,
  },
}

/**
 * Sequential marking with completion callback
 */
export const WithCompletionCallback: Story = {
  args: {
    entities: mockEntities.slice(0, 3),
    primaryAttribute: booleanAttribute,
    onComplete: () => {
      alert('Marking complete! Returning to sheet view...')
    },
  },
}

/**
 * Empty state - no entities
 */
export const NoEntities: Story = {
  args: {
    entities: [],
    primaryAttribute: booleanAttribute,
  },
}

/**
 * With custom className
 */
export const WithCustomClass: Story = {
  args: {
    entities: mockEntities,
    primaryAttribute: booleanAttribute,
    className: 'bg-muted/30',
  },
}
