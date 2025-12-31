import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const navigate = Route.useNavigate()

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10">
      <header className="space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          TanStack Tracker
        </p>
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">
          Quản lý điểm danh nhanh, offline, an toàn
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          Tạo bảng, đánh dấu theo lượt hoặc tự do, xem tổng hợp và sao lưu dữ liệu — tất cả ngay trong trình duyệt.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Button size="lg" onClick={() => navigate({ to: '/tracker' })}>
            Mở Tracker
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate({ to: '/tracker/new' })}
          >
            Tạo bảng mới
          </Button>
        </div>
      </header>

      <Separator />

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Đánh dấu siêu nhanh</h3>
          <p className="text-sm text-muted-foreground">
            Hỗ trợ cả chế độ tuần tự và truy cập tự do, tối ưu cho thao tác một chạm trên di động.
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Tổng hợp tức thời</h3>
          <p className="text-sm text-muted-foreground">
            Xem tỷ lệ điểm danh, tổng tiền ăn, thống kê dropdown, và xuất Excel/CSV khi cần.
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold">An toàn & ngoại tuyến</h3>
          <p className="text-sm text-muted-foreground">
            PWA offline, lưu IndexedDB, sao lưu/khôi phục bằng một file JSON dễ chia sẻ.
          </p>
        </Card>
      </section>
    </div>
  )
}