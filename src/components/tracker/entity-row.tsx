import { useEffect, useState } from 'react'
import type { DragEvent, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Entity } from '@/lib/tracker/types'

interface EntityRowProps {
  entity: Entity
  onRename?: (entityId: string, name: string) => void
  onDelete?: (entityId: string) => void
  onReorder?: (sourceId: string, targetId: string) => void
}

export function EntityRow({ entity, onRename, onDelete, onReorder }: EntityRowProps) {
  const [name, setName] = useState(entity.name)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    setName(entity.name)
  }, [entity.name])

  const handleBlur = () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setName(entity.name)
      return
    }

    if (trimmed !== entity.name) {
      onRename?.(entity.id, trimmed)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleBlur()
    }
  }

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    setIsDragging(true)
    event.dataTransfer.setData('text/plain', entity.id)
    event.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const sourceId = event.dataTransfer.getData('text/plain')
    if (sourceId && sourceId !== entity.id) {
      onReorder?.(sourceId, entity.id)
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md border bg-card px-3 py-2 shadow-xs transition-colors',
        isDragging ? 'bg-muted/70 border-border/70' : 'border-border'
      )}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      aria-grabbed={isDragging}
      role="listitem"
    >
      <span className="cursor-grab select-none text-lg" aria-hidden>
        ⋮⋮
      </span>
      <Input
        value={name}
        onChange={(event) => setName(event.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="flex-1 min-h-[44px]"
        aria-label="Tên thành viên"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="min-h-[44px] min-w-[44px]"
        onClick={() => onDelete?.(entity.id)}
        aria-label={`Xóa ${entity.name}`}
      >
        ×
      </Button>
    </div>
  )
}
