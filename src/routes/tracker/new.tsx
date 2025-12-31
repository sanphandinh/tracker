import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CreateSheetForm } from '@/components/tracker/create-sheet-form'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/tracker/new')({
  component: NewSheetPage,
})

function NewSheetPage() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tạo bảng mới</h1>
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/tracker' })}
        >
          Hủy
        </Button>
      </div>
      <CreateSheetForm />
    </div>
  )
}
