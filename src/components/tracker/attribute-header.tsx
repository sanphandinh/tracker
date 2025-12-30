import { cn } from '@/lib/utils'
import type { Attribute } from '@/lib/tracker/types'

interface AttributeHeaderProps {
  attribute: Attribute
  /** Optional CSS class */
  className?: string
}

/**
 * AttributeHeader component - Column header showing attribute name and type
 *
 * Features:
 * - Displays attribute name
 * - Shows type indicator icon for quick visual recognition
 * - Responsive layout for mobile/tablet
 */
export function AttributeHeader({ attribute, className }: AttributeHeaderProps) {
  /**
   * Get visual indicator for attribute type
   */
  const getTypeIndicator = (type: Attribute['type']): string => {
    switch (type) {
      case 'boolean':
        return '☑'
      case 'boolean-currency':
        return '💰'
      case 'number':
        return '123'
      case 'text':
        return '✏'
      case 'dropdown':
        return '▼'
      default:
        return '?'
    }
  }

  /**
   * Get tooltip description for attribute type
   */
  const getTypeDescription = (type: Attribute['type']): string => {
    switch (type) {
      case 'boolean':
        return 'Boolean (toggle)'
      case 'boolean-currency':
        return `Currency (toggle) - ${attribute.currencyValue ?? 0}`
      case 'number':
        return 'Number input'
      case 'text':
        return 'Text input'
      case 'dropdown':
        return `Select from: ${(attribute.options ?? []).join(', ')}`
      default:
        return 'Unknown type'
    }
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1 text-sm font-medium',
        className
      )}
      title={getTypeDescription(attribute.type)}
    >
      <span className="flex-1 truncate">{attribute.name}</span>
      <span className="text-xs opacity-70" aria-label={`Type: ${attribute.type}`}>
        {getTypeIndicator(attribute.type)}
      </span>
    </div>
  )
}

