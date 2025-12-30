/**
 * Attribute types supported by the tracker
 */
export type AttributeType =
  | 'boolean' // Simple true/false toggle
  | 'boolean-currency' // Boolean with attached currency value
  | 'number' // Numeric input
  | 'text' // Free-form text
  | 'dropdown' // Single-select from options

/**
 * A tracking sheet (matrix) containing entities and attributes
 */
export interface TrackingSheet {
  /** Unique identifier (UUID v4) */
  id: string

  /** Display name of the sheet */
  name: string

  /** When the sheet was created */
  createdAt: Date

  /** When the sheet was last modified (any change to sheet, entities, or values) */
  updatedAt: Date
}

/**
 * An attribute (column) defining what to track
 */
export interface Attribute {
  /** Unique identifier (UUID v4) */
  id: string

  /** Reference to parent sheet */
  sheetId: string

  /** Display name (e.g., "Điểm danh", "Tiền ăn 150k") */
  name: string

  /** Type of input/value for this attribute */
  type: AttributeType

  /**
   * Currency value in VND (only for boolean-currency type)
   * Example: 150000 for "Tiền ăn 150k"
   */
  currencyValue?: number

  /**
   * Available options (only for dropdown type)
   * Example: ["Mức 1", "Mức 2", "Mức 3"]
   */
  options?: string[]

  /** Display order (0-indexed) */
  position: number
}

/**
 * An entity (row) representing a person or item to track
 */
export interface Entity {
  /** Unique identifier (UUID v4) */
  id: string

  /** Reference to parent sheet */
  sheetId: string

  /** Display name/identifier (e.g., "Nguyễn Văn A") */
  name: string

  /** Display order (0-indexed, used for sequential marking) */
  position: number
}

/**
 * A cell value at the intersection of an entity and attribute
 */
export interface CellValue {
  /** Unique identifier (UUID v4) */
  id: string

  /** Reference to entity (row) */
  entityId: string

  /** Reference to attribute (column) */
  attributeId: string

  /**
   * The actual value, type depends on attribute type:
   * - boolean: true | false | null
   * - boolean-currency: true | false | null (value stored in attribute)
   * - number: number | null
   * - text: string | null
   * - dropdown: string (one of attribute.options) | null
   */
  value: boolean | number | string | null
}

/**
 * Summary for a boolean or boolean-currency attribute
 */
export interface BooleanSummary {
  attributeId: string
  checked: number
  total: number
  percentage: number
  /** Only for boolean-currency: checked × currencyValue */
  subtotal?: number
}

/**
 * Summary for a number attribute
 */
export interface NumberSummary {
  attributeId: string
  sum: number
  average: number
  min: number
  max: number
  count: number
}

/**
 * Summary for a dropdown attribute
 */
export interface DropdownSummary {
  attributeId: string
  /** Count per option value */
  counts: Record<string, number>
}

/**
 * Complete summary for a sheet
 */
export interface SheetSummary {
  sheetId: string
  attributeSummaries: (BooleanSummary | NumberSummary | DropdownSummary)[]
  /** Grand total of all boolean-currency subtotals */
  grandTotal: number
}

/**
 * Backup file structure
 */
export interface BackupData {
  /** Schema version for future migrations */
  version: number

  /** When backup was created */
  timestamp: string

  /** All sheets */
  sheets: TrackingSheet[]

  /** All attributes across all sheets */
  attributes: Attribute[]

  /** All entities across all sheets */
  entities: Entity[]

  /** All cell values */
  cellValues: CellValue[]
}
