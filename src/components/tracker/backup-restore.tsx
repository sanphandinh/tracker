import { useState, useRef } from 'react'
import { restoreBackup, downloadBackupFile } from '@/lib/tracker/backup'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface BackupRestoreProps {
  onRestoreComplete?: () => void
}

export function BackupRestore({ onRestoreComplete }: BackupRestoreProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false)
  const [restoreFile, setRestoreFile] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleBackup = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await downloadBackupFile()
      setSuccess('Sao lưu thành công')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(`Lỗi sao lưu: ${err}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setRestoreFile(content)
      setShowRestoreConfirm(true)
    }
    reader.readAsText(file)
  }

  const handleRestoreConfirm = async () => {
    if (!restoreFile) return

    try {
      setIsLoading(true)
      setError(null)
      await restoreBackup(restoreFile)
      setSuccess('Khôi phục thành công')
      setShowRestoreConfirm(false)
      setRestoreFile(null)
      setTimeout(() => {
        setSuccess(null)
        onRestoreComplete?.()
      }, 1500)
    } catch (err) {
      setError(`Lỗi khôi phục: ${err}`)
      setShowRestoreConfirm(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-3 rounded-lg border p-4">
        <h2 className="font-semibold">Sao lưu và khôi phục</h2>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Tạo bản sao lưu tất cả dữ liệu của bạn để an toàn hoặc chuyển đến thiết bị khác.
          </p>

          {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</div>}

          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={handleBackup} disabled={isLoading} className="flex-1">
            {isLoading ? 'Đang xử lý...' : 'Tạo sao lưu'}
          </Button>

          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex-1"
          >
            Khôi phục từ file
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Các tệp sao lưu được lưu trữ trên thiết bị của bạn với định dạng JSON có thể đọc được.
        </p>
      </div>

      <AlertDialog open={showRestoreConfirm}>
        <AlertDialogContent>
          <AlertDialogTitle>Xác nhận khôi phục</AlertDialogTitle>
          <AlertDialogDescription>
            Khôi phục sẽ ghi đè tất cả dữ liệu hiện tại. Hãy chắc chắn bạn muốn tiếp tục.
          </AlertDialogDescription>
          <div className="flex gap-2">
            <AlertDialogCancel onClick={() => setShowRestoreConfirm(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleRestoreConfirm} disabled={isLoading}>
              Khôi phục
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
