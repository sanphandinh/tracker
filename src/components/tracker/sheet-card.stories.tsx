import type { Meta, StoryObj } from '@storybook/react'
import { SheetCard } from './sheet-card'
import type { TrackingSheet } from '@/lib/tracker/types'

const meta = {
  title: 'Tracker/SheetCard',
  component: SheetCard,
  parameters: {
    layout: 'padded',
  },
  args: {
    onClick: (id) => console.log('Clicked sheet:', id),
  },
} satisfies Meta<typeof SheetCard>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Helper to create mock sheet
 */
function createSheet(overrides?: Partial<TrackingSheet>): TrackingSheet {
  return {
    id: crypto.randomUUID(),
    name: 'Lớp 10A - Buổi học ngày 30/12/2025',
    createdAt: new Date('2025-12-28T09:00:00'),
    updatedAt: new Date('2025-12-30T10:30:00'),
    ...overrides,
  }
}

/**
 * Basic sheet card
 */
export const Default: Story = {
  args: {
    sheet: createSheet(),
    entityCount: 25,
    attributeCount: 3,
  },
}

/**
 * Sheet with no entities yet
 */
export const Empty: Story = {
  args: {
    sheet: createSheet({ name: 'Bảng mới (chưa có dữ liệu)' }),
    entityCount: 0,
    attributeCount: 1,
  },
}

/**
 * Sheet with many entities
 */
export const ManyEntities: Story = {
  args: {
    sheet: createSheet({ name: 'Lớp 12A - Cuối kỳ' }),
    entityCount: 500,
    attributeCount: 8,
  },
}

/**
 * Recently created sheet (shows "Mới" badge)
 */
export const RecentlyCreated: Story = {
  args: {
    sheet: createSheet({
      name: 'Dự án mới',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    entityCount: 5,
    attributeCount: 2,
  },
}

/**
 * Sheet with long name
 */
export const LongName: Story = {
  args: {
    sheet: createSheet({
      name: 'Theo dõi điểm danh, tiền ăn, và các hoạt động khác cho lớp học trong năm học 2025-2026 với rất nhiều thông tin',
    }),
    entityCount: 35,
    attributeCount: 5,
  },
}

/**
 * Old sheet (not recently modified)
 */
export const OldSheet: Story = {
  args: {
    sheet: createSheet({
      name: 'Lớp 10A - Học kỳ 1 (2024)',
      createdAt: new Date('2024-09-01'),
      updatedAt: new Date('2024-12-20'),
    }),
    entityCount: 28,
    attributeCount: 4,
  },
}

/**
 * Sheet with all 5 attribute types
 */
export const AllAttributeTypes: Story = {
  args: {
    sheet: createSheet({
      name: 'Lớp 10A - Đầy đủ dữ liệu',
    }),
    entityCount: 30,
    attributeCount: 5,
  },
}

/**
 * Group of different sheets
 */
export const CardGrid: Story = {
  args: {
    sheet: createSheet({ name: 'Lớp 10A' }),
    entityCount: 30,
    attributeCount: 5,
  },
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[
        createSheet({ name: 'Lớp 10A' }),
        createSheet({
          name: 'Lớp 10B (mới)',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        createSheet({
          name: 'Lớp 11A',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-12-01'),
        }),
      ].map((sheet, index) => (
        <SheetCard
          key={sheet.id}
          sheet={sheet}
          entityCount={20 + index * 5}
          attributeCount={3 + index}
          onClick={(id) => console.log('Clicked:', id)}
        />
      ))}
    </div>
  ),
}

/**
 * Interactive - try clicking
 */
export const Interactive: Story = {
  args: {
    sheet: createSheet(),
    entityCount: 42,
    attributeCount: 4,
  },
  parameters: {
    docs: {
      description: {
        story: 'Click the card to open the sheet. Hover to see interactive states.',
      },
    },
  },
}

/**
 * Mobile layout
 */
export const MobileLayout: Story = {
  args: {
    sheet: createSheet(),
    entityCount: 25,
    attributeCount: 3,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/**
 * Accessibility focus state
 */
export const FocusState: Story = {
  args: {
    sheet: createSheet(),
    entityCount: 15,
    attributeCount: 2,
  },
  parameters: {
    docs: {
      description: {
        story: 'The card is keyboard accessible. Press Tab to focus.',
      },
    },
  },
}

/**
 * Minimal information
 */
export const Minimal: Story = {
  args: {
    sheet: createSheet({
      name: 'Quick List',
    }),
    entityCount: 10,
  },
}

