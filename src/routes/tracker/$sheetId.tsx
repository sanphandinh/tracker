import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tracker/$sheetId')({
  component: SheetViewPage,
})

function SheetViewPage() {
  const { sheetId } = Route.useParams()

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold">Sheet View</h1>
      <p className="text-muted-foreground mt-1">Sheet ID: {sheetId}</p>
      <p className="mt-4">This page will display the sheet with entities and cell editing.</p>
    </div>
  )
}
