import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { CellInput } from './cell-input'
import { AttributeHeader } from './attribute-header'
import { useSheet } from '@/hooks/tracker/useSheet'
import { useCellValues } from '@/hooks/tracker/useCellValues'
import type { Entity } from '@/lib/tracker/types'

interface SheetViewProps {
  sheetId: string
  /** Optional CSS class */
  className?: string
}

/**
 * SheetView component - Grid layout for viewing and editing all entities and attributes
 *
 * Features:
 * - Scrollable grid layout with sticky headers
 * - Direct cell editing (random access marking mode)
 * - Search/filter functionality for finding entities quickly
 * - Responsive for mobile and tablet
 * - Maintains scroll position during cell updates
 * - All 5 attribute types supported
 *
 * Layout:
 * - First column: entity names (sticky on scroll)
 * - Remaining columns: cell inputs for each attribute
 * - Headers: attribute names with type indicators
 */
export function SheetView({ sheetId, className }: SheetViewProps) {
  const { sheet: _sheet, entities, attributes, isLoading, error } = useSheet(sheetId)
  const [searchQuery, setSearchQuery] = useState('')

  /**
   * Filter entities by search query
   */
  const filteredEntities = useMemo(() => {
    if (!searchQuery) return entities
    return entities.filter((entity) =>
      entity.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [entities, searchQuery])

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <p className="text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-4 p-8', className)}>
        <p className="font-medium text-destructive">Lỗi: {error}</p>
        <p className="text-sm text-muted-foreground">Vui lòng thử lại sau</p>
      </div>
    )
  }

  if (entities.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-4 p-8', className)}>
        <p className="text-lg font-medium">Chưa có thành viên</p>
        <p className="text-sm text-muted-foreground">Thêm thành viên để bắt đầu đánh dấu</p>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
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
            <EntitySheetRow
              key={entity.id}
              entity={entity}
              attributeIds={attributes.map((a) => a.id)}
              attributes={attributes}
            />
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
 * EntitySheetRow - Single row in the sheet grid
 */
function EntitySheetRow({
  entity,
  attributeIds: _attributeIds,
  attributes,
}: {
  entity: Entity
  attributeIds: string[]
  attributes: any[]
}) {
  const { getCellValue, updateCell, isPending } = useCellValues(entity.id)

  return (
    <div className="flex gap-2 border-b border-border py-2 last:border-b-0" data-entity={entity.id}>
      {/* Entity name column (sticky) */}
      <div className="sticky left-0 z-10 flex min-w-48 items-center bg-background px-3 py-2">
        <span className="truncate text-sm font-medium">{entity.name}</span>
      </div>

      {/* Cell inputs */}
      {attributes.map((attribute) => {
        const cellValue = getCellValue(attribute.id)

        return (
          <div
            key={attribute.id}
            className="flex min-w-max items-center justify-center px-2 py-2"
          >
            <CellInput
              attribute={attribute}
              value={cellValue}
              onChange={(newValue) => updateCell(attribute.id, newValue)}
              disabled={isPending}
              className="min-h-11 min-w-14"
            />
          </div>
        )
      })}
    </div>
  )
}

