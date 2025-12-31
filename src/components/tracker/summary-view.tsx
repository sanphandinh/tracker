import { useState } from 'react'
import { useSummary } from '@/hooks/tracker/useSummary'
import { SummaryCard } from '@/components/tracker/summary-card'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SummaryViewProps {
  sheetId: string
  sheetName: string
}

interface DrilldownState {
  attributeId: string | null
  attributeName: string | null
}

export function SummaryView({ sheetId, sheetName }: SummaryViewProps) {
  const { summary, isLoading } = useSummary(sheetId)
  const [drilldown, setDrilldown] = useState<DrilldownState>({ attributeId: null, attributeName: null })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Đang tải...</div>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Không có dữ liệu</div>
      </div>
    )
  }

  if (drilldown.attributeId) {
    return (
      <div className="space-y-4 p-4">
        <Button variant="outline" onClick={() => setDrilldown({ attributeId: null, attributeName: null })}>
          ← Quay lại
        </Button>
        <Card className="p-4">
          <h2 className="mb-4 text-lg font-semibold">{drilldown.attributeName}</h2>
          <p className="text-sm text-muted-foreground">Chi tiết cho thuộc tính này</p>
        </Card>
      </div>
    )
  }

  const currencySummaries = summary.attributeSummaries.filter(
    (s) => s.attributeType === 'boolean-currency'
  )

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="mb-1 text-2xl font-bold">{sheetName}</h1>
        <p className="text-sm text-muted-foreground">
          {summary.totalEntities} {summary.totalEntities === 1 ? 'người' : 'người'}
        </p>
      </div>

      {currencySummaries.length > 0 && (
        <Card className="space-y-4 p-4">
          <h2 className="font-semibold">Tổng cộng</h2>
          <div className="text-3xl font-bold">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              minimumFractionDigits: 0,
            }).format(summary.grandTotal)}
          </div>
          <p className="text-sm text-muted-foreground">
            {currencySummaries.length} danh mục tiền tệ
          </p>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {summary.attributeSummaries.map((summary) => (
          <SummaryCard
            key={summary.attributeId}
            summary={summary}
            onClick={() =>
              setDrilldown({
                attributeId: summary.attributeId,
                attributeName: summary.attributeName,
              })
            }
          />
        ))}
      </div>

      {summary.attributeSummaries.length === 0 && (
        <div className="flex items-center justify-center rounded-lg border border-dashed p-8">
          <div className="text-muted-foreground">Chưa có thuộc tính nào</div>
        </div>
      )}
    </div>
  )
}
