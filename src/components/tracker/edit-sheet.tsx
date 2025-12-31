import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/tracker/db'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { v4 as uuidv4 } from 'uuid'
import type { Attribute } from '@/lib/tracker/types'

interface AttributeEdit extends Attribute {
  isNew?: boolean
  isDeleted?: boolean
}

interface EditSheetProps {
  sheetId: string
}

export function EditSheet({ sheetId }: EditSheetProps) {
  const attributes = useLiveQuery(() =>
    db.attributes.where('sheetId').equals(sheetId).sortBy('position')
  )

  const [editingAttributes, setEditingAttributes] = useState<AttributeEdit[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    if (attributes) {
      setEditingAttributes(attributes)
    }
  }, [attributes])

  const handleAddAttribute = () => {
    const newAttribute: AttributeEdit = {
      id: uuidv4(),
      sheetId,
      name: '',
      type: 'text',
      position: editingAttributes.length,
      isNew: true,
    }
    setEditingAttributes([...editingAttributes, newAttribute])
  }

  const handleUpdateAttribute = (id: string, field: keyof Attribute, value: unknown) => {
    setEditingAttributes(
      editingAttributes.map((attr) =>
        attr.id === id ? { ...attr, [field]: value } : attr
      )
    )
  }

  const handleDeleteAttribute = async (id: string) => {
    const attr = editingAttributes.find((a) => a.id === id)
    if (!attr) return

    setDeleteConfirm(id)
  }

  const confirmDelete = async (id: string) => {
    await db.attributes.delete(id)

    // Optionally cascade delete cell values
    await db.cellValues.where('attributeId').equals(id).delete()

    setDeleteConfirm(null)
    setEditingAttributes(editingAttributes.filter((a) => a.id !== id))
  }

  const handleSave = async () => {
    for (const attr of editingAttributes) {
      if (attr.isNew) {
        const { isNew, ...attrData } = attr
        await db.attributes.add(attrData)
      } else if (!attr.isDeleted) {
        const { isNew, isDeleted, ...attrData } = attr
        await db.attributes.put(attrData)
      }
    }

    // Update sheet's updatedAt
    await db.sheets.update(sheetId, { updatedAt: new Date() })
  }

  if (!attributes) {
    return <div className="p-4">Đang tải...</div>
  }

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Quản lý thuộc tính</h2>

        {editingAttributes.length === 0 ? (
          <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground">
            Chưa có thuộc tính nào
          </div>
        ) : (
          <div className="space-y-2">
            {editingAttributes.map((attr) => (
              <div key={attr.id} className="flex gap-2 rounded-lg border p-3">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={attr.name}
                    onChange={(e) => handleUpdateAttribute(attr.id, 'name', e.target.value)}
                    placeholder="Tên thuộc tính"
                    className="w-full rounded border px-2 py-1 text-sm"
                  />
                  <select
                    value={attr.type}
                    onChange={(e) => handleUpdateAttribute(attr.id, 'type', e.target.value as Attribute['type'])}
                    className="w-full rounded border px-2 py-1 text-sm"
                  >
                    <option value="boolean">Boolean</option>
                    <option value="boolean-currency">Boolean (Tiền)</option>
                    <option value="number">Số</option>
                    <option value="text">Văn bản</option>
                    <option value="dropdown">Dropdown</option>
                  </select>

                  {attr.type === 'boolean-currency' && (
                    <input
                      type="number"
                      value={attr.currencyValue ?? 0}
                      onChange={(e) =>
                        handleUpdateAttribute(attr.id, 'currencyValue', Number(e.target.value))
                      }
                      placeholder="Giá trị tiền"
                      className="w-full rounded border px-2 py-1 text-sm"
                    />
                  )}

                  {attr.type === 'dropdown' && (
                    <input
                      type="text"
                      value={(attr.options ?? []).join(', ')}
                      onChange={(e) =>
                        handleUpdateAttribute(
                          attr.id,
                          'options',
                          e.target.value.split(',').map((s) => s.trim())
                        )
                      }
                      placeholder="Tùy chọn (cách nhau bằng dấu phẩy)"
                      className="w-full rounded border px-2 py-1 text-sm"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteAttribute(attr.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button onClick={handleAddAttribute} variant="outline" className="w-full">
          Thêm thuộc tính
        </Button>
      </div>

      <div className="flex gap-2 border-t pt-4">
        <Button onClick={handleSave} className="flex-1">
          Lưu thay đổi
        </Button>
      </div>

      <AlertDialog open={deleteConfirm != null}>
        <AlertDialogContent>
          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn chắc chắn muốn xóa thuộc tính này? Tất cả dữ liệu liên quan sẽ bị xóa.
          </AlertDialogDescription>
          <div className="flex gap-2">
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDelete(deleteConfirm!)} className="bg-destructive">
              Xóa
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
