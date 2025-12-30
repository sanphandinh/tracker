import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SheetCard } from '@/components/tracker/sheet-card'
import { useSheets } from '@/hooks/tracker/useSheets'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/tracker/db'

/**
 * TrackerHome Route - Browse and manage tracking sheets
 *
 * URL: /tracker/
 * 
 * Features:
 * - List all sheets sorted by last modified
 * - Create new sheet button
 * - Search/filter sheets by name
 * - Sheet preview cards with entity counts
 * - Empty state when no sheets
 */
export const Route = createFileRoute('/tracker/')({
  component: TrackerHome,
})

export function TrackerHome() {
  const navigate = Route.useNavigate()
  const { sheets, isLoading, error } = useSheets()
  const [searchQuery, setSearchQuery] = useState('')

  /**
   * Get entity count for each sheet
   */
  const sheetMetadata = useLiveQuery(
    async () => {
      const metadata = await Promise.all(
        sheets.map(async (sheet) => {
          const entityCount = await db.entities.where('sheetId').equals(sheet.id).count()
          const attributeCount = await db.attributes.where('sheetId').equals(sheet.id).count()
          return {
            sheetId: sheet.id,
            entityCount,
            attributeCount,
          }
        })
      )
      return metadata
    },
    [sheets]
  )

  /**
   * Filter sheets by search query
   */
  const filteredSheets = useMemo(() => {
    if (!searchQuery) return sheets

    return sheets.filter((sheet) =>
      sheet.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [sheets, searchQuery])

  const handleOpenSheet = (sheetId: string) => {
    navigate({ to: `/tracker/${sheetId}` })
  }

  const handleCreateSheet = () => {
    navigate({ to: '/tracker/new' })
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Đang tải dữ liệu...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="font-medium text-destructive">Lỗi: {error}</p>
        <Button onClick={() => window.location.reload()}>
          Tải lại trang
        </Button>
      </div>
    )
  }

  const hasSheets = sheets.length > 0
  const showEmpty = !isLoading && !hasSheets

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-border pb-6">
        <h1 className="text-2xl font-bold">Bảng theo dõi</h1>
        <p className="text-muted-foreground">Quản lý và theo dõi các bảng của bạn</p>
      </div>

      {/* Create button */}
      <Button
        onClick={handleCreateSheet}
        size="lg"
        className="w-full sm:w-auto"
      >
        + Tạo bảng mới
      </Button>

      {/* Search */}
      {hasSheets && (
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Tìm kiếm bảng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-h-10"
          />
          {filteredSheets.length !== sheets.length && (
            <p className="text-xs text-muted-foreground">
              Tìm thấy {filteredSheets.length}/{sheets.length} bảng
            </p>
          )}
        </div>
      )}

      {/* Empty state */}
      {showEmpty ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/30 py-12">
          <div className="text-4xl">📊</div>
          <h2 className="text-lg font-semibold">Chưa có bảng nào</h2>
          <p className="text-center text-muted-foreground">
            Bắt đầu bằng cách tạo một bảng mới để theo dõi dữ liệu
          </p>
          <Button onClick={handleCreateSheet} variant="secondary">
            Tạo bảng đầu tiên
          </Button>
        </div>
      ) : (
        <>
          {/* Sheets grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSheets.map((sheet) => {
              const metadata = sheetMetadata?.find((m) => m.sheetId === sheet.id)

              return (
                <SheetCard
                  key={sheet.id}
                  sheet={sheet}
                  entityCount={metadata?.entityCount ?? 0}
                  attributeCount={metadata?.attributeCount ?? 0}
                  onClick={handleOpenSheet}
                />
              )
            })}
          </div>

          {/* Summary */}
          <div className="text-xs text-muted-foreground">
            {filteredSheets.length === sheets.length
              ? `Có ${sheets.length} bảng`
              : `Hiển thị ${filteredSheets.length} trong ${sheets.length} bảng`}
          </div>
        </>
      )}
    </div>
  )
}

