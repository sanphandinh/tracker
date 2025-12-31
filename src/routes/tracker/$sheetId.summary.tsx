import { createFileRoute } from '@tanstack/react-router'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/tracker/db'
import { SummaryView } from '@/components/tracker/summary-view'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/tracker/$sheetId/summary')({
  component: SummaryPage,
})

function SummaryPage() {
  const { sheetId } = Route.useParams()
  const sheet = useLiveQuery(() => db.sheets.get(sheetId))
  const navigate = Route.useNavigate()

  if (!sheet) {
    return (
      <div className="space-y-4 p-4">
        <Button variant="outline" onClick={() => navigate({ to: '/tracker' })}>
          ← Quay lại
        </Button>
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Không tìm thấy bảng</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background p-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: `/tracker/${sheetId}` })}>
          ←
        </Button>
        <h1 className="flex-1 text-lg font-semibold">Thống kê</h1>
      </div>
      <SummaryView sheetId={sheetId} sheetName={sheet.name} />
    </div>
  )
}
