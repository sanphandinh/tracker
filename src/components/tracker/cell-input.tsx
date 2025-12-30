import { useCallback, useMemo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { Attribute } from '@/lib/tracker/types'

const cellInputVariants = cva(
  'flex items-center justify-center rounded-md transition-colors cursor-pointer',
  {
    variants: {
      type: {
        boolean: 'hover:bg-muted active:bg-muted/80',
        'boolean-currency': 'hover:bg-muted active:bg-muted/80',
        number: 'bg-muted/50',
        text: 'bg-muted/50',
        dropdown: 'hover:bg-muted',
      },
      state: {
        checked: 'bg-primary text-primary-foreground',
        unchecked: 'bg-background border border-muted-foreground/20',
        null: 'bg-muted/30 border border-dashed border-muted-foreground/30',
      },
    },
    defaultVariants: {
      type: 'boolean',
      state: 'null',
    },
  }
)

export interface CellInputProps extends VariantProps<typeof cellInputVariants> {
  /** The attribute this cell belongs to */
  attribute: Attribute
  /** Current cell value */
  value: boolean | number | string | null
  /** Callback when value changes */
  onChange: (value: boolean | number | string | null) => void
  /** Optional CSS class */
  className?: string
  /** Optional disable state */
  disabled?: boolean
}

/**
 * CellInput component - type-appropriate input for each attribute type
 *
 * Supports 5 attribute types with optimized UX for each:
 * - boolean: Single-tap toggle with null→true→false→null cycle
 * - boolean-currency: Same as boolean but displays currency value
 * - number: Numeric input with keyboard pattern
 * - text: Text input with inline editing
 * - dropdown: Select from predefined options
 *
 * All inputs meet 44px minimum touch target size requirement
 */
export function CellInput({
  attribute,
  value,
  onChange,
  className,
  disabled = false,
}: CellInputProps) {
  const attributeType = attribute.type

  /**
   * Determine visual state for styling
   */
  const visualState = useMemo(() => {
    if (attributeType === 'boolean' || attributeType === 'boolean-currency') {
      if (value === true) return 'checked'
      if (value === false) return 'unchecked'
      return 'null'
    }
    return 'null' as const
  }, [value, attributeType])

  /**
   * Handle boolean cycle: null → true → false → null
   */
  const handleBooleanToggle = useCallback(() => {
    if (disabled) return

    switch (value) {
      case null:
        onChange(true)
        break
      case true:
        onChange(false)
        break
      case false:
        onChange(null)
        break
    }
  }, [value, onChange, disabled])

  /**
   * Handle keyboard input for boolean
   */
  const handleBooleanKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleBooleanToggle()
      }
    },
    [handleBooleanToggle]
  )

  /**
   * Format currency value for display
   */
  const formatCurrency = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(0) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'k'
    }
    return num.toString()
  }

  // ========== RENDER BASED ON TYPE ==========

  // Boolean toggle
  if (attributeType === 'boolean') {
    return (
      <button
        onClick={handleBooleanToggle}
        onKeyDown={handleBooleanKeyDown}
        disabled={disabled}
        data-state={visualState}
        className={cn(
          cellInputVariants({ type: 'boolean', state: visualState }),
          'min-h-11 min-w-11 font-medium',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {value === true && <span className="text-sm">✓</span>}
        {value === false && <span className="text-sm">✗</span>}
        {value === null && <span className="text-xs opacity-60">—</span>}
      </button>
    )
  }

  // Boolean-currency toggle
  if (attributeType === 'boolean-currency') {
    const currencyValue = attribute.currencyValue ?? 0
    return (
      <button
        onClick={handleBooleanToggle}
        onKeyDown={handleBooleanKeyDown}
        disabled={disabled}
        data-state={visualState}
        className={cn(
          cellInputVariants({ type: 'boolean-currency', state: visualState }),
          'min-h-11 min-w-11 font-medium text-xs px-2 py-1',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {value === true && (
          <span className="whitespace-nowrap">{formatCurrency(currencyValue)}</span>
        )}
        {value === false && <span>—</span>}
        {value === null && <span className="opacity-60">○</span>}
      </button>
    )
  }

  // Number input
  if (attributeType === 'number') {
    const numValue = typeof value === 'number' ? value : ''

    return (
      <input
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        value={numValue}
        onChange={(e) => {
          const newValue = e.target.value === '' ? null : Number(e.target.value)
          onChange(newValue)
        }}
        disabled={disabled}
        className={cn(
          cellInputVariants({ type: 'number' }),
          'min-h-11 min-w-11 px-2 py-1 text-center font-mono text-sm',
          'border border-input rounded-md',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        placeholder="0"
      />
    )
  }

  // Text input
  if (attributeType === 'text') {
    const textValue = typeof value === 'string' ? value : ''

    return (
      <input
        type="text"
        value={textValue}
        onChange={(e) => {
          const newValue = e.target.value === '' ? null : e.target.value
          onChange(newValue)
        }}
        disabled={disabled}
        className={cn(
          cellInputVariants({ type: 'text' }),
          'min-h-11 min-w-11 px-2 py-1 text-sm',
          'border border-input rounded-md',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        placeholder="Type here"
      />
    )
  }

  // Dropdown select
  if (attributeType === 'dropdown') {
    const options = attribute.options ?? []
    const selectValue = typeof value === 'string' ? value : ''

    return (
      <select
        value={selectValue}
        onChange={(e) => {
          const newValue = e.target.value === '' ? null : e.target.value
          onChange(newValue)
        }}
        disabled={disabled}
        className={cn(
          cellInputVariants({ type: 'dropdown' }),
          'min-h-11 min-w-11 px-2 py-1 text-sm',
          'border border-input rounded-md bg-background',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <option value="">—</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    )
  }

  // Fallback for unknown type
  return <div className="min-h-11 min-w-11">?</div>
}
