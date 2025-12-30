# Data Model: Dynamic Attendance & Marking Tracker

**Feature Branch**: `001-sheets-attendance-tracker`
**Date**: 2025-12-29
**Status**: Complete

## Overview

This document defines the data model for the attendance tracker feature. All data is stored locally in IndexedDB via Dexie.js.

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│   TrackingSheet     │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ createdAt           │
│ updatedAt           │
└─────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐      ┌─────────────────────┐
│     Attribute       │      │       Entity        │
├─────────────────────┤      ├─────────────────────┤
│ id (PK)             │      │ id (PK)             │
│ sheetId (FK)        │      │ sheetId (FK)        │
│ name                │      │ name                │
│ type                │      │ position            │
│ currencyValue?      │      └─────────────────────┘
│ options?            │               │
│ position            │               │
└─────────────────────┘               │
         │                            │
         │                            │
         └──────────┬─────────────────┘
                    │ N:N (via CellValue)
                    ▼
           ┌─────────────────────┐
           │     CellValue       │
           ├─────────────────────┤
           │ id (PK)             │
           │ entityId (FK)       │
           │ attributeId (FK)    │
           │ value               │
           └─────────────────────┘
```

---

## TypeScript Interfaces

```typescript
// src/lib/tracker/types.ts

/**
 * Attribute types supported by the tracker
 */
export type AttributeType = 
  | 'boolean'         // Simple true/false toggle
  | 'boolean-currency' // Boolean with attached currency value
  | 'number'          // Numeric input
  | 'text'            // Free-form text
  | 'dropdown'        // Single-select from options

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
```

---

## Dexie Schema Definition

```typescript
// src/lib/tracker/db.ts
import Dexie, { type EntityTable } from 'dexie'
import type { TrackingSheet, Attribute, Entity, CellValue } from './types'

/**
 * Tracker database with typed tables
 */
export class TrackerDatabase extends Dexie {
  sheets!: EntityTable<TrackingSheet, 'id'>
  attributes!: EntityTable<Attribute, 'id'>
  entities!: EntityTable<Entity, 'id'>
  cellValues!: EntityTable<CellValue, 'id'>

  constructor() {
    super('TrackerDB')
    
    this.version(1).stores({
      // Primary key and indexed fields
      sheets: 'id, name, updatedAt',
      attributes: 'id, sheetId, position',
      entities: 'id, sheetId, position',
      cellValues: 'id, entityId, attributeId, [entityId+attributeId]'
    })
  }
}

/** Singleton database instance */
export const db = new TrackerDatabase()
```

### Index Explanation

| Table | Index | Purpose |
|-------|-------|---------|
| sheets | `id` | Primary key lookup |
| sheets | `name` | Search by name |
| sheets | `updatedAt` | Sort by recent |
| attributes | `id` | Primary key lookup |
| attributes | `sheetId` | Get all attributes for a sheet |
| attributes | `position` | Sort by display order |
| entities | `id` | Primary key lookup |
| entities | `sheetId` | Get all entities for a sheet |
| entities | `position` | Sort by display order |
| cellValues | `id` | Primary key lookup |
| cellValues | `entityId` | Get all values for an entity |
| cellValues | `attributeId` | Get all values for an attribute |
| cellValues | `[entityId+attributeId]` | Compound: unique cell lookup |

---

## Validation Schemas (Zod)

```typescript
// src/lib/tracker/schemas.ts
import { z } from 'zod'

export const AttributeTypeSchema = z.enum([
  'boolean',
  'boolean-currency',
  'number',
  'text',
  'dropdown'
])

export const TrackingSheetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date()
})

export const AttributeSchema = z.object({
  id: z.string().uuid(),
  sheetId: z.string().uuid(),
  name: z.string().min(1).max(50),
  type: AttributeTypeSchema,
  currencyValue: z.number().positive().optional(),
  options: z.array(z.string().min(1)).optional(),
  position: z.number().int().min(0)
}).refine(
  data => {
    // currencyValue required for boolean-currency
    if (data.type === 'boolean-currency' && data.currencyValue === undefined) {
      return false
    }
    // options required for dropdown
    if (data.type === 'dropdown' && (!data.options || data.options.length === 0)) {
      return false
    }
    return true
  },
  { message: 'Invalid attribute configuration' }
)

export const EntitySchema = z.object({
  id: z.string().uuid(),
  sheetId: z.string().uuid(),
  name: z.string().min(1).max(100),
  position: z.number().int().min(0)
})

export const CellValueSchema = z.object({
  id: z.string().uuid(),
  entityId: z.string().uuid(),
  attributeId: z.string().uuid(),
  value: z.union([z.boolean(), z.number(), z.string(), z.null()])
})

export const BackupDataSchema = z.object({
  version: z.number().int().positive(),
  timestamp: z.string().datetime(),
  sheets: z.array(TrackingSheetSchema),
  attributes: z.array(AttributeSchema),
  entities: z.array(EntitySchema),
  cellValues: z.array(CellValueSchema)
})

// Input schemas for creating new records
export const CreateSheetInputSchema = z.object({
  name: z.string().min(1).max(100)
})

export const CreateAttributeInputSchema = z.object({
  sheetId: z.string().uuid(),
  name: z.string().min(1).max(50),
  type: AttributeTypeSchema,
  currencyValue: z.number().positive().optional(),
  options: z.array(z.string().min(1)).optional()
})

export const CreateEntityInputSchema = z.object({
  sheetId: z.string().uuid(),
  name: z.string().min(1).max(100)
})

export const BulkCreateEntitiesInputSchema = z.object({
  sheetId: z.string().uuid(),
  names: z.array(z.string().min(1).max(100)).min(1)
})

export const UpdateCellValueInputSchema = z.object({
  entityId: z.string().uuid(),
  attributeId: z.string().uuid(),
  value: z.union([z.boolean(), z.number(), z.string(), z.null()])
})
```

---

## State Transitions

### CellValue State Machine (for boolean types)

```
┌─────────┐   tap    ┌─────────┐   tap    ┌─────────┐
│  null   │ ───────► │  true   │ ───────► │  false  │
│(empty)  │          │ (✓)     │          │  (✗)    │
└─────────┘          └─────────┘          └─────────┘
     ▲                                         │
     │                    tap                  │
     └─────────────────────────────────────────┘
```

For **boolean-currency**, the same state machine applies. The currency value is stored on the Attribute, not the CellValue.

### Sheet Lifecycle

```
Created ──► Active ──► Archived (future)
                │
                └──► Deleted
```

---

## Storage Estimates

| Data Type | Size per Record | Max Records | Total |
|-----------|-----------------|-------------|-------|
| Sheet | ~200 bytes | 50 | 10 KB |
| Attribute | ~150 bytes | 500 (10/sheet) | 75 KB |
| Entity | ~120 bytes | 25,000 (500/sheet) | 3 MB |
| CellValue | ~100 bytes | 250,000 (10 attrs × 500 entities × 50 sheets) | 25 MB |
| **Total** | | | **~30 MB** |

Well within the 50MB target. IndexedDB typically allows 50-100MB per origin.

---

## Migration Strategy

### Version 1 (Initial)
- All tables as defined above

### Future Versions
```typescript
// Example migration from v1 to v2
db.version(2).stores({
  sheets: 'id, name, updatedAt, archived' // Add archived index
}).upgrade(tx => {
  return tx.sheets.toCollection().modify(sheet => {
    sheet.archived = false
  })
})
```
