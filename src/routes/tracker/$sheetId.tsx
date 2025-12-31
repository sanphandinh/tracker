import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SheetView } from '@/components/tracker/sheet-view'
import { AddEntityForm } from '@/components/tracker/add-entity-form'
import { exportSheetToCSV, exportSheetToExcel } from '@/lib/tracker/export'

/**
 * Sheet View Route - Random access marking mode
 *
 * URL: /tracker/:sheetId
 * 
 * Features:
 * - Grid view of all entities and attributes
 * - Direct cell editing without sequential navigation
 * - Add new entities inline
 * - Search/filter entities
 * - Navigation to other modes (sequential, summary, edit)
 */
export const Route = createFileRoute('/tracker/$sheetId')({
  component: SheetViewPage,
})

function SheetViewPage() {
  const { sheetId } = Route.useParams()
  let navigate: ReturnType<typeof Route.useNavigate> | ((opts: any) => void)
  try {
    navigate = Route.useNavigate()
  } catch {
    navigate = () => {}
  }
  const [showAddForm, setShowAddForm] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExport = async (format: 'excel' | 'csv') => {
    try {
      setIsExporting(true)
      if (format === 'excel') {
        const arrayBuffer = await exportSheetToExcel(sheetId)
        const blob = new Blob([arrayBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        downloadBlob(blob, `tracker-${sheetId}.xlsx`)
      } else {
        const csv = await exportSheetToCSV(sheetId)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        downloadBlob(blob, `tracker-${sheetId}.csv`)
      }
    } catch (error) {
      console.error('Export error', error)
      alert('Không thể xuất file. Vui lòng thử lại.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header with navigation */}
      <div className="flex flex-col gap-3 bg-background px-4 py-3 border-b border-border sticky top-0 z-40">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold">Bảng theo dõi</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: `/tracker/${sheetId}/mark` })}
            >
              Đánh dấu tuần tự
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: `/tracker/${sheetId}/summary` })}
            >
              Tổng hợp
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: `/tracker/${sheetId}/edit` })}
            >
              Chỉnh sửa
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isExporting}
              onClick={() => handleExport('csv')}
            >
              Xuất CSV
            </Button>
            <Button
              size="sm"
              disabled={isExporting}
              onClick={() => handleExport('excel')}
            >
              Xuất Excel
            </Button>
          </div>
        </div>

        {/* Add entity button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full"
        >
          {showAddForm ? 'Ẩn form thêm' : '+ Thêm thành viên'}
        </Button>
      </div>

      {/* Add entity form */}
      {showAddForm && (
        <div className="px-4 pt-4 border-b border-border pb-4">
          <AddEntityForm sheetId={sheetId} onAdded={() => setShowAddForm(false)} />
        </div>
      )}

      {/* Sheet grid */}
      <SheetView sheetId={sheetId} />
    </div>
  )
}
