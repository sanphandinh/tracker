import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { AttributeType } from '@/lib/tracker/types'

export interface AttributeConfigProps {
  type: AttributeType
  currencyValue?: number
  options?: string[]
  onCurrencyValueChange?: (value: number | undefined) => void
  onOptionsChange?: (options: string[]) => void
}

export function AttributeConfig({
  type,
  currencyValue,
  options = [],
  onCurrencyValueChange,
  onOptionsChange,
}: AttributeConfigProps) {
  if (type === 'boolean-currency') {
    return (
      <div className="flex flex-col gap-2">
        <Label htmlFor="currency-value">Giá trị tiền (VND)</Label>
        <Input
          id="currency-value"
          type="number"
          min="0"
          step="1000"
          placeholder="Ví dụ: 150000"
          value={currencyValue ?? ''}
          onChange={(e) => {
            const value = e.target.value
            onCurrencyValueChange?.(value ? Number(value) : undefined)
          }}
        />
        <p className="text-sm text-muted-foreground">
          Số tiền được cộng khi chọn &quot;Có&quot;
        </p>
      </div>
    )
  }

  if (type === 'dropdown') {
    const handleAddOption = () => {
      onOptionsChange?.([...options, ''])
    }

    const handleUpdateOption = (index: number, value: string) => {
      const newOptions = [...options]
      newOptions[index] = value
      onOptionsChange?.(newOptions)
    }

    const handleRemoveOption = (index: number) => {
      const newOptions = options.filter((_, i) => i !== index)
      onOptionsChange?.(newOptions)
    }

    return (
      <div className="flex flex-col gap-3">
        <Label>Các lựa chọn</Label>
        <div className="flex flex-col gap-2">
          {options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Lựa chọn ${index + 1}`}
                value={option}
                onChange={(e) => handleUpdateOption(index, e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleRemoveOption(index)}
              >
                Xóa
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddOption}
          className="self-start"
        >
          + Thêm lựa chọn
        </Button>
        {options.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nhấn &quot;Thêm lựa chọn&quot; để tạo danh sách
          </p>
        )}
      </div>
    )
  }

  return null
}
