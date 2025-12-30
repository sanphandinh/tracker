import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/tracker/db'
import { MarkingMode } from '@/components/tracker/marking-mode'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/tracker/$sheetId/mark')({
  component: SequentialMarkingPage,
})

function SequentialMarkingPage() {
  const { sheetId } = Route.useParams()
  const navigate = useNavigate()

  // Load sheet data
  const sheet = useLiveQuery(() => db.sheets.get(sheetId), [sheetId])

  // Load entities sorted by position
  const entities = useLiveQuery(
    () => db.entities.where('sheetId').equals(sheetId).sortBy('position'),
    [sheetId]
  )

  // Load attributes sorted by position
  const attributes = useLiveQuery(
    () => db.attributes.where('sheetId').equals(sheetId).sortBy('position'),
    [sheetId]
  )

  const handleComplete = () => {
    navigate({ to: '/tracker/$sheetId', params: { sheetId } })
  }

  const handleCancel = () => {
    navigate({ to: '/tracker/$sheetId', params: { sheetId } })
  }

  // Loading state
  if (!sheet || !entities || !attributes) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    )
  }

  // No entities
  if (entities.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">
          Chưa có thực thể nào trong bảng này
        </p>
        <Button onClick={handleCancel} variant="outline">
          Quay lại
        </Button>
      </div>
    )
  }

  // No attributes
  if (attributes.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <p className="text-muted-foreground">
          Chưa có thuộc tính nào trong bảng này
        </p>
        <Button onClick={handleCancel} variant="outline">
          Quay lại
        </Button>
      </div>
    )
  }

  // Get primary attribute (first one)
  const primaryAttribute = attributes[0]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold">{sheet.name}</h1>
            <p className="text-sm text-muted-foreground">
              Đánh dấu tuần tự - {primaryAttribute.name}
            </p>
          </div>
          <Button variant="ghost" onClick={handleCancel}>
            Hủy
          </Button>
        </div>
      </div>

      {/* Marking mode */}
      <MarkingMode
        entities={entities}
        primaryAttribute={primaryAttribute}
        onComplete={handleComplete}
        className="mx-auto max-w-2xl"
      />
    </div>
  )
}
