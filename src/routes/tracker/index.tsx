import { useEffect, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useLiveQuery } from 'dexie-react-hooks'
import { BellRing, ClipboardList, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { TwoPaneLayout } from '@/components/tracker/content-region'
import { useSheets } from '@/hooks/tracker/useSheets'
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
  let navigate: ReturnType<typeof Route.useNavigate> | ((opts: any) => void)
  try {
    navigate = Route.useNavigate()
  } catch (error) {
    // Fallback for tests that render without RouterProvider
    navigate = () => {}
  }

  const safeNavigate = (options: any) => {
    try {
      navigate?.(options)
    } catch (err) {
      console.warn('Navigation skipped (no router context)', err)
    }
  }
  const { sheets, isLoading, error } = useSheets()
  const [searchQuery, setSearchQuery] = useState('')
  const [showBackupReminder, setShowBackupReminder] = useState(false)
  const [reminderInterval, setReminderInterval] = useState(7)
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const enabled = localStorage.getItem('tracker.backupReminder.enabled')
    const interval = localStorage.getItem('tracker.backupReminder.days')

    if (enabled === 'true') setShowBackupReminder(true)
    if (interval) {
      const parsed = Number(interval)
      if (!Number.isNaN(parsed) && parsed > 0) setReminderInterval(parsed)
    }
  }, [])

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
    // On tablet+, show in detail pane; on mobile, navigate
    if (window.matchMedia('(min-width: 768px)').matches) {
      setSelectedSheetId(sheetId)
    } else {
      safeNavigate({ to: `/tracker/${sheetId}` })
    }
  }

  const handleCreateSheet = () => {
    safeNavigate({ to: '/tracker/new' })
  }

  // Get selected sheet data for detail pane
  const selectedSheet = useMemo(() => {
    return sheets.find((s) => s.id === selectedSheetId)
  }, [sheets, selectedSheetId])

  const selectedSheetMetadata = useMemo(() => {
    if (!selectedSheetId) return null
    return sheetMetadata?.find((m) => m.sheetId === selectedSheetId)
  }, [sheetMetadata, selectedSheetId])

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <p className="sr-only">Đang tải dữ liệu...</p>
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="space-y-3 rounded-lg border p-4">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-6 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
        ))}
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

  // List pane content (sheet cards)
  const listPaneContent = (
    <div className="flex flex-col gap-4 p-4">
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
          <ClipboardList className="h-12 w-12 text-muted-foreground" aria-hidden />
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
          {/* Sheets list */}
          <div className="flex flex-col gap-2">
            {filteredSheets.map((sheet) => {
              const metadata = sheetMetadata?.find((m) => m.sheetId === sheet.id)
              const isSelected = sheet.id === selectedSheetId

              return (
                <div
                  key={sheet.id}
                  onClick={() => handleOpenSheet(sheet.id)}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors hover:bg-accent ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <h3 className="font-semibold">{sheet.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metadata?.entityCount ?? 0} mục • {metadata?.attributeCount ?? 0} thuộc tính
                  </p>
                </div>
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

  // Detail pane content (selected sheet preview)
  const detailPaneContent = selectedSheet ? (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{selectedSheet.name}</h2>
        <p className="text-sm text-muted-foreground">
          {selectedSheetMetadata?.entityCount ?? 0} mục • {selectedSheetMetadata?.attributeCount ?? 0} thuộc tính
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => safeNavigate({ to: `/tracker/${selectedSheet.id}` })}
          size="lg"
        >
          Mở bảng
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => safeNavigate({ to: `/tracker/${selectedSheet.id}/edit` })}
        >
          Chỉnh sửa
        </Button>
      </div>

      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground">
          Chi tiết bảng sẽ hiển thị ở đây. Trên tablet, bạn có thể xem danh sách và chi tiết cùng lúc.
        </p>
      </Card>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
      <ClipboardList className="h-16 w-16 text-muted-foreground/50" aria-hidden />
      <div className="text-center">
        <h3 className="font-semibold text-lg mb-2">Chọn một bảng</h3>
        <p className="text-sm text-muted-foreground">
          Chọn bảng từ danh sách bên trái để xem chi tiết
        </p>
      </div>
    </div>
  )

  return (
    <TwoPaneLayout
      listPane={
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex flex-col gap-3 border-b border-border p-4 shrink-0">
            <h1 className="text-xl font-bold">Bảng theo dõi</h1>
            <Button onClick={handleCreateSheet} size="sm" className="w-full">
              + Tạo bảng mới
            </Button>
          </div>

          {showBackupReminder && (
            <Card className="m-4 flex flex-col gap-3 border-dashed border-primary/40 bg-primary/5 p-3">
              <div className="flex items-start gap-3">
                <BellRing className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
                <div>
                  <div className="font-semibold text-sm">Đừng quên sao lưu</div>
                  <p className="text-xs text-muted-foreground">
                    Nhắc mỗi {reminderInterval} ngày
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => safeNavigate({ to: '/tracker/backup' })}>
                  <Download className="mr-2 h-4 w-4" aria-hidden /> Sao lưu
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowBackupReminder(false)
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('tracker.backupReminder.enabled', 'false')
                    }
                  }}
                >
                  Ẩn
                </Button>
              </div>
            </Card>
          )}

          {/* List content (scrollable) */}
          <div className="flex-1 overflow-y-auto">{listPaneContent}</div>
        </div>
      }
      detailPane={detailPaneContent}
    />
  )
}

