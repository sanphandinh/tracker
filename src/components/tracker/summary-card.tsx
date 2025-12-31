import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type {
  SummaryItem,
  BooleanSummary,
  NumberSummary,
  DropdownSummary,
  TextSummary,
} from '@/lib/tracker/calculations'

interface SummaryCardProps {
  summary: SummaryItem
  onClick?: () => void
  className?: string
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(value)
}

function BooleanSummaryContent({ summary }: { summary: BooleanSummary }) {
  const isCurrency = summary.attributeType === 'boolean-currency'

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-muted-foreground">Danh sách</span>
        <span className="text-2xl font-bold">{summary.checked}</span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-muted-foreground">Tổng</span>
        <span className="text-lg">{summary.total}</span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-muted-foreground">Tỷ lệ</span>
        <span className="text-lg font-semibold">{summary.percentage.toFixed(1)}%</span>
      </div>
      {isCurrency && summary.subtotal != null && (
        <div className="flex items-baseline justify-between border-t pt-3">
          <span className="text-sm font-medium text-muted-foreground">Tổng tiền</span>
          <span className="text-lg font-semibold">{formatCurrency(summary.subtotal)}</span>
        </div>
      )}
    </div>
  )
}

function NumberSummaryContent({ summary }: { summary: NumberSummary }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <div className="text-xs text-muted-foreground">Tổng</div>
        <div className="text-xl font-bold">{summary.sum}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Trung bình</div>
        <div className="text-xl font-bold">{summary.average.toFixed(2)}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Min</div>
        <div className="text-xl font-bold">{summary.min === Infinity ? '—' : summary.min}</div>
      </div>
      <div>
        <div className="text-xs text-muted-foreground">Max</div>
        <div className="text-xl font-bold">{summary.max === -Infinity ? '—' : summary.max}</div>
      </div>
    </div>
  )
}

function DropdownSummaryContent({ summary }: { summary: DropdownSummary }) {
  const entries = Object.entries(summary.counts).sort(([, a], [, b]) => b - a)

  return (
    <div className="space-y-2">
      {entries.map(([option, count]) => (
        <div key={option} className="flex items-center justify-between">
          <span className="text-sm">{option}</span>
          <Badge variant="secondary">{count}</Badge>
        </div>
      ))}
      {entries.length === 0 && (
        <div className="text-sm text-muted-foreground">Không có dữ liệu</div>
      )}
    </div>
  )
}

function TextSummaryContent({ summary }: { summary: TextSummary }) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-muted-foreground">Có dữ liệu</span>
        <span className="text-2xl font-bold">{summary.filled}</span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-muted-foreground">Trống</span>
        <span className="text-lg text-muted-foreground">{summary.empty}</span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-muted-foreground">Tỷ lệ</span>
        <span className="text-lg font-semibold">
          {summary.total > 0 ? ((summary.filled / summary.total) * 100).toFixed(1) : 0}%
        </span>
      </div>
    </div>
  )
}

export function SummaryCard({ summary, onClick, className }: SummaryCardProps) {
  const isClickable = onClick != null

  return (
    <Card
      className={cn(
        'p-4',
        isClickable && 'cursor-pointer transition-colors hover:bg-muted/50 active:bg-muted',
        className
      )}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onClick()
              }
            }
          : undefined
      }
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">{summary.attributeName}</h3>
        <Badge variant="outline" className="text-xs">
          {summary.attributeType}
        </Badge>
      </div>

      {summary.attributeType === 'boolean' && <BooleanSummaryContent summary={summary} />}
      {summary.attributeType === 'boolean-currency' && <BooleanSummaryContent summary={summary} />}
      {summary.attributeType === 'number' && <NumberSummaryContent summary={summary} />}
      {summary.attributeType === 'dropdown' && <DropdownSummaryContent summary={summary} />}
      {summary.attributeType === 'text' && <TextSummaryContent summary={summary} />}
    </Card>
  )
}
