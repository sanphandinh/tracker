import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import type { AttributeType } from '@/lib/tracker/types'

const attributeTypeLabels: Record<AttributeType, string> = {
  boolean: 'Có/Không (Boolean)',
  'boolean-currency': 'Có/Không + Tiền (Boolean + Currency)',
  number: 'Số (Number)',
  text: 'Văn bản (Text)',
  dropdown: 'Danh sách chọn (Dropdown)',
}

const attributeTypeDescriptions: Record<AttributeType, string> = {
  boolean: 'Toggle đơn giản: có/không, đúng/sai',
  'boolean-currency': 'Toggle với giá trị tiền khi chọn "Có"',
  number: 'Nhập số (ví dụ: điểm, tuổi)',
  text: 'Nhập văn bản tự do',
  dropdown: 'Chọn một giá trị từ danh sách',
}

export interface AttributeTypeSelectProps {
  value: AttributeType
  onChange: (value: AttributeType) => void
  disabled?: boolean
}

export function AttributeTypeSelect({
  value,
  onChange,
  disabled = false,
}: AttributeTypeSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label>Loại cột</Label>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as AttributeType)}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue>{attributeTypeLabels[value]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="boolean">{attributeTypeLabels.boolean}</SelectItem>
          <SelectItem value="boolean-currency">
            {attributeTypeLabels['boolean-currency']}
          </SelectItem>
          <SelectItem value="number">{attributeTypeLabels.number}</SelectItem>
          <SelectItem value="text">{attributeTypeLabels.text}</SelectItem>
          <SelectItem value="dropdown">
            {attributeTypeLabels.dropdown}
          </SelectItem>
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        {attributeTypeDescriptions[value]}
      </p>
    </div>
  )
}
