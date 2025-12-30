import type { Meta, StoryObj } from '@storybook/react'
import { SheetView as OriginalSheetView } from './sheet-view'
import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { CellInput } from './cell-input'
import { AttributeHeader } from './attribute-header'
import type { Entity, Attribute } from '@/lib/tracker/types'

const meta = {
  title: 'Tracker/SheetView',
  component: OriginalSheetView,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof OriginalSheetView>

export default meta

type Story = StoryObj

/**
 * Mock data for stories
 */
const mockEntities: Entity[] = [
  { id: 'e1', sheetId: 'sheet-1', name: 'Nguyễn Văn A', position: 0 },
  { id: 'e2', sheetId: 'sheet-1', name: 'Trần Thị B', position: 1 },
  { id: 'e3', sheetId: 'sheet-1', name: 'Lê Văn C', position: 2 },
  { id: 'e4', sheetId: 'sheet-1', name: 'Phạm Minh D', position: 3 },
  { id: 'e5', sheetId: 'sheet-1', name: 'Hoàng Hương E', position: 4 },
]

const mockAttributes: Attribute[] = [
  {
    id: 'a1',
    sheetId: 'sheet-1',
    name: 'Điểm danh',
    type: 'boolean',
    position: 0,
  },
  {
    id: 'a2',
    sheetId: 'sheet-1',
    name: 'Tiền ăn 150k',
    type: 'boolean-currency',
    currencyValue: 150000,
    position: 1,
  },
  {
    id: 'a3',
    sheetId: 'sheet-1',
    name: 'Số lượng',
    type: 'number',
    position: 2,
  },
  {
    id: 'a4',
    sheetId: 'sheet-1',
    name: 'Ghi chú',
    type: 'text',
    position: 3,
  },
  {
    id: 'a5',
    sheetId: 'sheet-1',
    name: 'Xếp hạng',
    type: 'dropdown',
    options: ['Tốt', 'Bình thường', 'Cần cải thiện'],
    position: 4,
  },
]

// Mock cell values data
const mockCellValues: Record<string, Record<string, boolean | number | string | null>> = {
  e1: {
    a1: true,
    a2: true,
    a3: 5,
    a4: 'Tốt',
    a5: 'Tốt',
  },
  e2: {
    a1: true,
    a2: false,
    a3: 3,
    a4: 'Cần cải thiện',
    a5: 'Bình thường',
  },
  e3: {
    a1: false,
    a2: null,
    a3: null,
    a4: null,
    a5: null,
  },
  e4: {
    a1: true,
    a2: true,
    a3: 10,
    a4: 'Xuất sắc',
    a5: 'Tốt',
  },
  e5: {
    a1: true,
    a2: true,
    a3: 7,
    a4: 'Tốt',
    a5: 'Tốt',
  },
}

/**
 * SheetViewStory - Mock version of SheetView for Storybook
 * This component recreates the SheetView UI but uses mock data instead of fetching from DB
 */
function SheetViewStory({
  entities = mockEntities,
  attributes = mockAttributes,
  cellValues = mockCellValues,
  isLoading = false,
  error = null,
  className = '',
}: {
  entities?: Entity[]
  attributes?: Attribute[]
  cellValues?: Record<string, Record<string, boolean | number | string | null>>
  isLoading?: boolean
  error?: string | null
  className?: string
}) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEntities = useMemo(() => {
    if (!searchQuery) return entities
    return entities.filter((entity) =>
      entity.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [entities, searchQuery])

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <p className="text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center gap-4 p-8 ${className}`}>
        <p className="font-medium text-destructive">Lỗi: {error}</p>
        <p className="text-sm text-muted-foreground">Vui lòng thử lại sau</p>
      </div>
    )
  }

  if (entities.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center gap-4 p-8 ${className}`}>
        <p className="text-lg font-medium">Chưa có thành viên</p>
        <p className="text-sm text-muted-foreground">Thêm thành viên để bắt đầu đánh dấu</p>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Search bar */}
      <div className="px-4 pt-4">
        <Input
          placeholder="Tìm kiếm thành viên..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="min-h-10"
        />
        {filteredEntities.length !== entities.length && (
          <p className="mt-2 text-xs text-muted-foreground">
            Tìm thấy {filteredEntities.length}/{entities.length} thành viên
          </p>
        )}
      </div>

      {/* Grid container */}
      <div className="overflow-x-auto px-4 pb-4">
        <div className="min-w-max">
          {/* Header row */}
          <div className="mb-2 flex gap-2 bg-muted/50 rounded-t-lg">
            {/* Entity name column header */}
            <div className="sticky left-0 z-20 flex min-w-48 items-center gap-2 rounded-tl-lg bg-muted/70 px-3 py-2 font-medium">
              Tên thành viên
            </div>

            {/* Attribute column headers */}
            {attributes.map((attr) => (
              <div
                key={attr.id}
                className="flex min-w-max items-center justify-center gap-1 px-2 py-2"
              >
                <AttributeHeader attribute={attr} className="w-20 text-center text-xs" />
              </div>
            ))}
          </div>

          {/* Entity rows */}
          {filteredEntities.map((entity) => (
            <div
              key={entity.id}
              className="flex gap-2 border-b border-border py-2 last:border-b-0"
              data-entity={entity.id}
            >
              {/* Entity name column (sticky) */}
              <div className="sticky left-0 z-10 flex min-w-48 items-center bg-background px-3 py-2">
                <span className="truncate text-sm font-medium">{entity.name}</span>
              </div>

              {/* Cell inputs */}
              {attributes.map((attribute) => {
                const cellValue = cellValues[entity.id]?.[attribute.id] ?? null

                return (
                  <div
                    key={attribute.id}
                    className="flex min-w-max items-center justify-center px-2 py-2"
                  >
                    <CellInput
                      attribute={attribute}
                      value={cellValue}
                      onChange={() => {}}
                      disabled={false}
                      className="min-h-11 min-w-14"
                    />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      {filteredEntities.length > 0 && (
        <div className="px-4 pb-4 text-xs text-muted-foreground">
          {filteredEntities.length} thành viên × {attributes.length} cột = {filteredEntities.length * attributes.length} ô
        </div>
      )}
    </div>
  )
}


/**
 * Default - Sheet with all data
 */
export const Default: Story = {
  render: () => <SheetViewStory />,
}

/**
 * Loading state
 */
export const Loading: Story = {
  render: () => <SheetViewStory isLoading={true} entities={[]} attributes={[]} />,
}

/**
 * Empty sheet (no entities)
 */
export const EmptySheet: Story = {
  render: () => <SheetViewStory entities={[]} />,
}

/**
 * Error state (sheet not found)
 */
export const ErrorState: Story = {
  render: () => (
    <SheetViewStory entities={[]} attributes={[]} error="Không tìm thấy sheet" />
  ),
}

/**
 * Many entities (20+)
 */
export const ManyEntities: Story = {
  render: () => {
    const manyEntities = Array.from({ length: 20 }, (_, i) => ({
      id: `e${i}`,
      sheetId: 'sheet-many',
      name: `Thành viên ${i + 1}`,
      position: i,
    }))
    return <SheetViewStory entities={manyEntities} />
  },
}

/**
 * Mobile layout
 */
export const MobileLayout: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <SheetViewStory
      entities={mockEntities.slice(0, 3)}
      attributes={mockAttributes.slice(0, 3)}
    />
  ),
}

/**
 * All attribute types
 */
export const AllAttributeTypes: Story = {
  render: () => (
    <div className="w-full">
      <p className="mb-4 text-sm text-muted-foreground">
        Đang hiển thị tất cả 5 loại thuộc tính
      </p>
      <SheetViewStory />
    </div>
  ),
}

/**
 * Partially filled sheet
 */
export const PartiallyFilled: Story = {
  render: () => (
    <SheetViewStory
      cellValues={{
        e1: mockCellValues.e1,
        e2: mockCellValues.e2,
        e3: {},
        e4: {},
        e5: {},
      }}
    />
  ),
}

/**
 * Long entity names
 */
export const LongEntityNames: Story = {
  render: () => {
    const longNameEntities: Entity[] = [
      {
        id: 'e1',
        sheetId: 'sheet-long',
        name: 'Nguyễn Văn An với tên rất dài và khó nhớ',
        position: 0,
      },
      {
        id: 'e2',
        sheetId: 'sheet-long',
        name: 'Trần Thị B',
        position: 1,
      },
      {
        id: 'e3',
        sheetId: 'sheet-long',
        name: 'Lê Văn C Tiểu học',
        position: 2,
      },
    ]
    return <SheetViewStory entities={longNameEntities} />
  },
}

/**
 * Interactive demo
 */
export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Hãy thử sử dụng ô tìm kiếm để lọc thành viên. Kích vào các ô để chỉnh sửa giá trị.',
      },
    },
  },
  render: () => (
    <div className="w-full">
      <p className="mb-4 text-sm text-muted-foreground">
        Thử nhập liệu để thấy các điều chỉnh. Hãy kích vào các ô để chỉnh sửa giá trị.
      </p>
      <SheetViewStory />
    </div>
  ),
}

