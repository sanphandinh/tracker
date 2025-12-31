import { useEffect, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useLiveQuery } from 'dexie-react-hooks'
import { BellRing, ClipboardList, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { SheetCard } from '@/components/tracker/sheet-card'
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
    safeNavigate({ to: `/tracker/${sheetId}` })
  }

  const handleCreateSheet = () => {
    safeNavigate({ to: '/tracker/new' })
  }

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

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-border pb-6">
        <h1 className="text-2xl font-bold">Bảng theo dõi</h1>
        <p className="text-muted-foreground">Quản lý và theo dõi các bảng của bạn</p>
      </div>

      {showBackupReminder && (
        <Card className="flex flex-col gap-3 border-dashed border-primary/40 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <BellRing className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
            <div>
              <div className="font-semibold">Đừng quên sao lưu</div>
              <p className="text-sm text-muted-foreground">Nhắc mỗi {reminderInterval} ngày để tải file backup và lưu an toàn.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => safeNavigate({ to: '/tracker/backup' })}>
              <Download className="mr-2 h-4 w-4" aria-hidden /> Sao lưu ngay
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
              Ẩn nhắc nhở
            </Button>
          </div>
        </Card>
      )}

      {/* Create button */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button
          onClick={handleCreateSheet}
          size="lg"
          className="w-full sm:w-auto"
        >
          + Tạo bảng mới
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => safeNavigate({ to: '/tracker/settings' })}
          className="w-full sm:w-auto"
        >
          Cài đặt
        </Button>
      </div>

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

