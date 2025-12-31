import { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const REMINDER_KEY = 'tracker.backupReminder.enabled'
const REMINDER_INTERVAL_KEY = 'tracker.backupReminder.days'

export const Route = createFileRoute('/tracker/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const navigate = Route.useNavigate()
  const [backupReminder, setBackupReminder] = useState(false)
  const [intervalDays, setIntervalDays] = useState(7)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedEnabled = localStorage.getItem(REMINDER_KEY)
    const storedInterval = localStorage.getItem(REMINDER_INTERVAL_KEY)
    if (storedEnabled) {
      setBackupReminder(storedEnabled === 'true')
    }
    if (storedInterval) {
      const parsed = Number(storedInterval)
      if (!Number.isNaN(parsed) && parsed > 0) setIntervalDays(parsed)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(REMINDER_KEY, String(backupReminder))
    localStorage.setItem(REMINDER_INTERVAL_KEY, String(intervalDays))
  }, [backupReminder, intervalDays])

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background p-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/tracker' })}>
          ←
        </Button>
        <h1 className="flex-1 text-lg font-semibold">Cài đặt</h1>
      </div>

      <div className="space-y-4 p-4">
        <Card className="space-y-3 p-4">
          <div className="space-y-1">
            <h2 className="text-base font-semibold">Nhắc sao lưu</h2>
            <p className="text-sm text-muted-foreground">
              Bật nhắc nhở định kỳ để tải file sao lưu và lưu trữ an toàn.
            </p>
          </div>

          <label className="flex items-center gap-3 rounded-lg border p-3">
            <input
              type="checkbox"
              checked={backupReminder}
              onChange={(e) => setBackupReminder(e.target.checked)}
              className="h-4 w-4"
            />
            <div className="flex-1">
              <div className="text-sm font-medium">Bật nhắc sao lưu</div>
              <div className="text-xs text-muted-foreground">Hiển thị banner nhắc sao lưu trong trang chủ.</div>
            </div>
          </label>

          <div className="grid gap-2">
            <Label htmlFor="interval">Khoảng ngày giữa các lần nhắc</Label>
            <Input
              id="interval"
              type="number"
              min={1}
              value={intervalDays}
              onChange={(e) => setIntervalDays(Math.max(1, Number(e.target.value)))}
              className="w-24"
            />
            <p className="text-xs text-muted-foreground">Mặc định 7 ngày. Lưu ý lưu trữ file ở nơi an toàn.</p>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button onClick={() => navigate({ to: '/tracker/backup' })}>
              Sao lưu ngay
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/tracker' })}>
              Về trang chủ tracker
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
