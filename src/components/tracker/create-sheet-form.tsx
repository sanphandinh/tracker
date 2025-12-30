import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { AttributeTypeSelect } from './attribute-type-select'
import { AttributeConfig } from './attribute-config'
import { useCreateSheet } from '@/hooks/tracker/useCreateSheet'
import type { AttributeType } from '@/lib/tracker/types'

interface AdditionalAttribute {
  id: string
  name: string
  type: AttributeType
  currencyValue?: number
  options?: string[]
}

export function CreateSheetForm() {
  const [sheetName, setSheetName] = useState('')
  const [additionalAttributes, setAdditionalAttributes] = useState<
    AdditionalAttribute[]
  >([])
  const { createSheet, isCreating, error } = useCreateSheet()

  const handleAddAttribute = () => {
    const newAttr: AdditionalAttribute = {
      id: crypto.randomUUID(),
      name: '',
      type: 'boolean',
    }
    setAdditionalAttributes([...additionalAttributes, newAttr])
  }

  const handleUpdateAttribute = (
    id: string,
    updates: Partial<AdditionalAttribute>
  ) => {
    setAdditionalAttributes((attrs) =>
      attrs.map((attr) => (attr.id === id ? { ...attr, ...updates } : attr))
    )
  }

  const handleRemoveAttribute = (id: string) => {
    setAdditionalAttributes((attrs) => attrs.filter((attr) => attr.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!sheetName.trim()) {
      return
    }

    await createSheet({
      name: sheetName.trim(),
      additionalAttributes: additionalAttributes
        .filter((attr) => attr.name.trim())
        .map((attr) => ({
          name: attr.name.trim(),
          type: attr.type,
          currencyValue: attr.currencyValue,
          options: attr.options,
        })),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
      {/* Sheet Name */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="sheet-name">Tên bảng điểm danh *</Label>
        <Input
          id="sheet-name"
          placeholder="Ví dụ: Điểm danh lớp 10A, Danh sách khách mời"
          value={sheetName}
          onChange={(e) => setSheetName(e.target.value)}
          required
        />
      </div>

      {/* Default Attribute Info */}
      <Card className="p-4 bg-muted/50">
        <p className="text-sm font-medium">Cột mặc định</p>
        <p className="text-sm text-muted-foreground mt-1">
          Bảng sẽ tự động có cột &quot;Điểm danh&quot; (kiểu Có/Không)
        </p>
      </Card>

      {/* Additional Attributes */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">
            Các cột bổ sung (tùy chọn)
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddAttribute}
          >
            + Thêm cột
          </Button>
        </div>

        {additionalAttributes.map((attr) => (
          <Card key={attr.id} className="p-4">
            <div className="flex flex-col gap-4">
              {/* Attribute Name */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor={`attr-name-${attr.id}`}>Tên cột</Label>
                  <Input
                    id={`attr-name-${attr.id}`}
                    placeholder="Ví dụ: Tiền ăn 150k, Ghi chú"
                    value={attr.name}
                    onChange={(e) =>
                      handleUpdateAttribute(attr.id, { name: e.target.value })
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveAttribute(attr.id)}
                  className="mt-6"
                >
                  Xóa
                </Button>
              </div>

              {/* Attribute Type */}
              <AttributeTypeSelect
                value={attr.type}
                onChange={(type) =>
                  handleUpdateAttribute(attr.id, {
                    type,
                    currencyValue: undefined,
                    options: [],
                  })
                }
              />

              {/* Attribute Config (for boolean-currency and dropdown) */}
              <AttributeConfig
                type={attr.type}
                currencyValue={attr.currencyValue}
                options={attr.options}
                onCurrencyValueChange={(currencyValue) =>
                  handleUpdateAttribute(attr.id, { currencyValue })
                }
                onOptionsChange={(options) =>
                  handleUpdateAttribute(attr.id, { options })
                }
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-3">
        <Button type="submit" disabled={isCreating || !sheetName.trim()}>
          {isCreating ? 'Đang tạo...' : 'Tạo bảng'}
        </Button>
        <Button type="button" variant="outline" onClick={() => history.back()}>
          Hủy
        </Button>
      </div>
    </form>
  )
}
