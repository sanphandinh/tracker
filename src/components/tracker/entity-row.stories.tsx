import type { Meta, StoryObj } from '@storybook/react'
import { EntityRow } from './entity-row'
import type { Entity } from '@/lib/tracker/types'

const sampleEntity: Entity = {
  id: 'entity-1',
  sheetId: 'sheet-1',
  name: 'Nguyễn Văn A',
  position: 0,
}

const meta = {
  title: 'Tracker/EntityRow',
  component: EntityRow,
  parameters: {
    layout: 'padded',
  },
  args: {
    entity: sampleEntity,
  },
} satisfies Meta<typeof EntityRow>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithCallbacks: Story = {
  args: {
    onRename: (id, name) => console.log('Rename', id, name),
    onDelete: (id) => console.log('Delete', id),
    onReorder: (source, target) => console.log('Reorder', source, 'to', target),
  },
}
