import { createFileRoute } from '@tanstack/react-router'
import { BackupRestore } from '@/components/tracker/backup-restore'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/tracker/backup')({
  component: BackupPage,
})

function BackupPage() {
  const navigate = Route.useNavigate()

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background p-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/tracker' })}>
          ←
        </Button>
        <h1 className="flex-1 text-lg font-semibold">Sao lưu & Khôi phục</h1>
      </div>

      <BackupRestore onRestoreComplete={() => navigate({ to: '/tracker' })} />
    </div>
  )
}
