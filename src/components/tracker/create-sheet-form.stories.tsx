import type { Meta, StoryObj } from '@storybook/react'
import { CreateSheetForm } from './create-sheet-form'

const meta = {
  title: 'Tracker/CreateSheetForm',
  component: CreateSheetForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CreateSheetForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDescription: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Form to create a new tracking sheet with custom attributes. The sheet automatically includes a default "Điểm danh" (attendance) boolean attribute.',
      },
    },
  },
}
