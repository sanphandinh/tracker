import { useMemo, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { UsersRound, SearchX } from 'lucide-react'
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
  const parentRef = useRef<HTMLDivElement>(null)

  const columnTemplate = useMemo(() => {
    const cols = ['minmax(168px, 1.1fr)']
    attributes.forEach(() => cols.push('minmax(96px, 0.95fr)'))
    return cols.join(' ')
  }, [attributes])

  /**
   * Filter entities by search query
   */
  const filteredEntities = useMemo(() => {
    if (!searchQuery) return entities
    return entities.filter((entity) =>
      entity.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [entities, searchQuery])

  const rowVirtualizer = useVirtualizer({
    count: filteredEntities.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    overscan: 8,
  })
  const virtualRows = rowVirtualizer.getVirtualItems()
  const rowsToRender = virtualRows.length
    ? virtualRows
    : filteredEntities.map((_, index) => ({ index, key: `fallback-${index}`, start: index * 64 }))

  if (isLoading) {
    return (
      <div className={cn('space-y-3 p-4', className)}>
        <p className="sr-only">Đang tải dữ liệu...</p>
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="space-y-2 rounded-lg border p-4">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-10 w-full animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-2 rounded-lg border p-4">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-16 w-full animate-pulse rounded bg-muted" />
        </div>
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
      <div className={cn('flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center', className)}>
        <UsersRound className="h-10 w-10 text-muted-foreground" aria-hidden />
        <p className="text-lg font-semibold">Chưa có thành viên</p>
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

      {filteredEntities.length === 0 && (
        <div className="mx-4 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/40 p-8 text-center">
          <SearchX className="h-10 w-10 text-muted-foreground" aria-hidden />
          <p className="text-base font-semibold">Không tìm thấy thành viên</p>
          <p className="text-sm text-muted-foreground">Thử tìm bằng từ khóa khác hoặc thêm thành viên mới.</p>
        </div>
      )}

      {/* Grid container */}
      <div className="px-4 pb-4">
        <div
          ref={parentRef}
          className="max-h-[70vh] overflow-auto rounded-lg border border-border bg-background shadow-sm"
        >
          <div className="min-w-full">
            {/* Header row */}
            <div
              className="sticky top-0 z-20 grid items-center gap-2 border-b border-border bg-muted/80 px-3 py-2 text-xs font-medium backdrop-blur"
              style={{ gridTemplateColumns: columnTemplate }}
            >
              <div className="sticky left-0 z-30 flex items-center gap-2 bg-muted/90 pr-3 text-left">
                Tên thành viên
              </div>

              {attributes.map((attr) => (
                <div key={attr.id} className="flex items-center justify-center px-1">
                  <AttributeHeader attribute={attr} className="text-center text-xs" />
                </div>
              ))}
            </div>

            <div
              className="relative"
              style={{
                height: `${virtualRows.length ? rowVirtualizer.getTotalSize() : filteredEntities.length * 64}px`,
              }}
            >
              {rowsToRender.map((virtualRow) => {
                const entity = filteredEntities[virtualRow.index]
                if (!entity) return null

                return (
                  <div
                    key={entity.id ?? virtualRow.key}
                    className="absolute left-0 top-0 w-full"
                    style={{ transform: `translateY(${virtualRow.start}px)` }}
                  >
                    <EntitySheetRow
                      entity={entity}
                      attributeIds={attributes.map((a) => a.id)}
                      attributes={attributes}
                      columnTemplate={columnTemplate}
                    />
                  </div>
                )
              })}
            </div>
          </div>
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
  columnTemplate,
}: {
  entity: Entity
  attributeIds: string[]
  attributes: any[]
  columnTemplate: string
}) {
  const { getCellValue, updateCell, isPending } = useCellValues(entity.id)

  return (
    <div
      className="grid items-stretch border-b border-border px-1 py-2 last:border-b-0"
      style={{ gridTemplateColumns: columnTemplate }}
      data-entity={entity.id}
    >
      {/* Entity name column (sticky) */}
      <div className="sticky left-0 z-10 flex items-center gap-2 bg-background px-3 text-sm font-medium shadow-[4px_0_6px_-4px_rgba(0,0,0,0.12)]">
        <span className="line-clamp-2 leading-snug">{entity.name}</span>
      </div>

      {/* Cell inputs */}
      {attributes.map((attribute) => {
        const cellValue = getCellValue(attribute.id)

        return (
          <div key={attribute.id} className="flex items-center justify-center px-1">
            <CellInput
              attribute={attribute}
              value={cellValue}
              onChange={(newValue) => updateCell(attribute.id, newValue)}
              disabled={isPending}
              className="min-h-11 w-full max-w-[108px]"
            />
          </div>
        )
      })}
    </div>
  )
}

