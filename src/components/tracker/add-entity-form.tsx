import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { useEntities } from '@/hooks/tracker/useEntities'

interface AddEntityFormProps {
  sheetId: string
  onAdded?: () => void
}

export function AddEntityForm({ sheetId, onAdded }: AddEntityFormProps) {
  const [name, setName] = useState('')
  const [bulkNames, setBulkNames] = useState('')
  const { addEntity, bulkAddEntities, isMutating, error } = useEntities(sheetId)

  const handleAddSingle = async (event: FormEvent) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    await addEntity(trimmed)
    setName('')
    onAdded?.()
  }

  const handleBulkAdd = async (event: FormEvent) => {
    event.preventDefault()
    const names = bulkNames
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    if (names.length === 0) return

    await bulkAddEntities(names)
    setBulkNames('')
    onAdded?.()
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4">
        <form onSubmit={handleAddSingle} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="entity-name">Tên thành viên / học sinh</Label>
            <Input
              id="entity-name"
              placeholder="Ví dụ: Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isMutating}
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={isMutating || !name.trim()}>
              Thêm
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setName('')}
              disabled={isMutating || !name.trim()}
            >
              Xóa nhập
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-4">
        <form onSubmit={handleBulkAdd} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="bulk-names">Thêm nhiều (mỗi dòng 1 tên)</Label>
            <Textarea
              id="bulk-names"
              placeholder={'Ví dụ:\nNguyễn Văn A\nTrần Thị B\nLê Văn C'}
              value={bulkNames}
              onChange={(e) => setBulkNames(e.target.value)}
              disabled={isMutating}
              rows={4}
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" variant="secondary" disabled={isMutating}>
              Thêm hàng loạt
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setBulkNames('')}
              disabled={isMutating || bulkNames.trim() === ''}
            >
              Xóa danh sách
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
