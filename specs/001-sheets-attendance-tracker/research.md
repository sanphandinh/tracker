# Research: Dynamic Attendance & Marking Tracker

**Feature Branch**: `001-sheets-attendance-tracker`
**Date**: 2025-12-29
**Status**: Complete

## Overview

This document consolidates research findings for all technical decisions in the tracker feature. Each section addresses a "NEEDS CLARIFICATION" or technology choice from the Technical Context.

---

## 1. Local Storage Solution: Dexie.js

### Decision
Use **Dexie.js v4** with `dexie-react-hooks` for local IndexedDB storage.

### Rationale
1. **Reactive queries**: `useLiveQuery` hook automatically re-renders components when data changes
2. **Sync-ready architecture**: Dexie Cloud provides optional sync to cloud storage (future Google Drive integration path)
3. **Performance**: IndexedDB handles 50MB+ data efficiently
4. **Type-safe**: Full TypeScript support with schema definitions
5. **Mature ecosystem**: 15+ years of development, extensive documentation

### Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| localStorage | 5MB limit, no querying, synchronous blocking |
| Raw IndexedDB | Complex API, no reactivity, more boilerplate |
| TanStack Query + localStorage | Not designed for primary storage, still has 5MB limit |
| SQLite (sql.js) | WASM overhead, no React hooks, complex setup |
| RxDB | Heavier, overkill for this use case |

### Implementation Pattern

```typescript
// src/lib/tracker/db.ts
import Dexie, { type EntityTable } from 'dexie'

interface TrackingSheet {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

interface Attribute {
  id: string
  sheetId: string
  name: string
  type: 'boolean' | 'boolean-currency' | 'number' | 'text' | 'dropdown'
  currencyValue?: number
  options?: string[]
  position: number
}

interface Entity {
  id: string
  sheetId: string
  name: string
  position: number
}

interface CellValue {
  id: string
  entityId: string
  attributeId: string
  value: boolean | number | string | null
}

const db = new Dexie('TrackerDB') as Dexie & {
  sheets: EntityTable<TrackingSheet, 'id'>
  attributes: EntityTable<Attribute, 'id'>
  entities: EntityTable<Entity, 'id'>
  cellValues: EntityTable<CellValue, 'id'>
}

db.version(1).stores({
  sheets: 'id, name, updatedAt',
  attributes: 'id, sheetId, position',
  entities: 'id, sheetId, position',
  cellValues: 'id, entityId, attributeId, [entityId+attributeId]'
})

export { db }
```

### React Hook Pattern

```typescript
// src/hooks/tracker/useSheets.ts
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/tracker/db'

export function useSheets() {
  const sheets = useLiveQuery(
    () => db.sheets.orderBy('updatedAt').reverse().toArray()
  )
  
  return {
    sheets: sheets ?? [],
    isLoading: sheets === undefined
  }
}
```

---

## 2. PWA / Offline Capability: vite-plugin-pwa

### Decision
Use **vite-plugin-pwa** for Progressive Web App functionality.

### Rationale
1. **Zero-config**: Works out of the box with Vite
2. **Workbox integration**: Automatic service worker generation
3. **Auto-update**: Supports automatic SW updates
4. **React types**: TypeScript types via `vite-plugin-pwa/react`
5. **Manifest generation**: Automatic web manifest handling

### Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| Manual service worker | More maintenance, error-prone |
| Workbox directly | More configuration needed |
| No PWA | User requirement for offline support |

### Implementation Pattern

```typescript
// vite.config.ts addition
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    // ... existing plugins
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'Attendance Tracker',
        short_name: 'Tracker',
        description: 'Local-first attendance and marking tracker',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ]
})
```

### TypeScript Configuration

```json
// tsconfig.json addition
{
  "compilerOptions": {
    "types": ["vite-plugin-pwa/react"]
  }
}
```

### Update Hook (Optional)

```typescript
// src/hooks/tracker/usePWA.ts
import { useRegisterSW } from 'virtual:pwa-register/react'

export function usePWA() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW registered:', r)
    },
    onRegisterError(error) {
      console.error('SW registration error:', error)
    }
  })

  return { needRefresh, updateServiceWorker }
}
```

---

## 3. TanStack Start with SPA Mode

### Decision
Use TanStack Start in **SPA mode** for the tracker feature.

### Rationale
1. **PWA compatibility**: Offline-first apps work best as SPAs
2. **ClientOnly not needed**: All tracker routes are client-rendered
3. **Simpler architecture**: No SSR complexity for local-first data
4. **Existing patterns**: Boilerplate already supports SPA routes

### Implementation Pattern

Tracker routes will be client-only with Dexie.js data fetching:

```typescript
// src/routes/tracker/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/tracker/db'

export const Route = createFileRoute('/tracker/')({
  component: TrackerHome,
})

function TrackerHome() {
  const sheets = useLiveQuery(() => db.sheets.toArray())
  
  if (!sheets) return <div>Loading...</div>
  
  return (
    <div>
      <h1>My Sheets</h1>
      {sheets.map(sheet => (
        <SheetCard key={sheet.id} sheet={sheet} />
      ))}
    </div>
  )
}
```

---

## 4. Component Patterns

### Decision
Follow existing **shadcn/ui + Base UI patterns** with `cva` variants.

### Rationale
1. **Consistency**: Match existing component API
2. **Accessibility**: Base UI provides accessible primitives
3. **Customization**: `cva` enables variant-based styling
4. **Constitution compliance**: Required by project standards

### Cell Input Component Pattern

```typescript
// src/components/tracker/cell-input.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cellInputVariants = cva(
  'flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md transition-colors',
  {
    variants: {
      type: {
        boolean: 'cursor-pointer hover:bg-muted active:bg-muted/80',
        'boolean-currency': 'cursor-pointer hover:bg-muted active:bg-muted/80',
        number: 'bg-muted/50',
        text: 'bg-muted/50',
        dropdown: 'cursor-pointer hover:bg-muted'
      },
      checked: {
        true: 'bg-primary text-primary-foreground',
        false: 'bg-background border'
      }
    },
    defaultVariants: {
      type: 'boolean',
      checked: false
    }
  }
)

interface CellInputProps extends VariantProps<typeof cellInputVariants> {
  attributeType: Attribute['type']
  value: boolean | number | string | null
  onChange: (value: boolean | number | string | null) => void
  className?: string
}

export function CellInput({ 
  attributeType, 
  value, 
  onChange, 
  className 
}: CellInputProps) {
  // Implementation based on type
}
```

---

## 5. Export/Import Strategy

### Decision
Use **SheetJS (xlsx)** for Excel export and native JSON for backup.

### Rationale
1. **Excel compatibility**: SheetJS generates proper .xlsx files
2. **CSV fallback**: SheetJS also handles CSV
3. **JSON backup**: Full database export as single JSON file
4. **Restore validation**: Zod schemas validate imported data

### Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| Papa Parse | CSV only, no Excel |
| Manual CSV | No Excel support |
| Dexie export addon | Not as flexible for custom formats |

### Implementation Pattern

```typescript
// src/lib/tracker/export.ts
import * as XLSX from 'xlsx'
import { db } from './db'

export async function exportSheetToExcel(sheetId: string) {
  const sheet = await db.sheets.get(sheetId)
  const attributes = await db.attributes.where('sheetId').equals(sheetId).toArray()
  const entities = await db.entities.where('sheetId').equals(sheetId).toArray()
  const cellValues = await db.cellValues.toArray()
  
  // Build worksheet data
  const headers = ['Name', ...attributes.map(a => a.name)]
  const rows = entities.map(entity => {
    const row = [entity.name]
    attributes.forEach(attr => {
      const cell = cellValues.find(
        c => c.entityId === entity.id && c.attributeId === attr.id
      )
      row.push(formatCellValue(cell?.value, attr.type))
    })
    return row
  })
  
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheet?.name ?? 'Sheet')
  
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
}

// src/lib/tracker/backup.ts
export async function createBackup() {
  const data = {
    version: 1,
    timestamp: new Date().toISOString(),
    sheets: await db.sheets.toArray(),
    attributes: await db.attributes.toArray(),
    entities: await db.entities.toArray(),
    cellValues: await db.cellValues.toArray()
  }
  
  return JSON.stringify(data, null, 2)
}

export async function restoreBackup(jsonString: string) {
  const data = BackupSchema.parse(JSON.parse(jsonString))
  
  await db.transaction('rw', db.sheets, db.attributes, db.entities, db.cellValues, async () => {
    await db.sheets.bulkPut(data.sheets)
    await db.attributes.bulkPut(data.attributes)
    await db.entities.bulkPut(data.entities)
    await db.cellValues.bulkPut(data.cellValues)
  })
}
```

---

## 6. Summary Calculations

### Decision
Compute summaries **on-demand** using Dexie queries, memoized per sheet.

### Rationale
1. **Simplicity**: No need for precomputed aggregates
2. **Accuracy**: Always up-to-date with latest data
3. **Performance**: Dexie queries are fast for <500 entities

### Implementation Pattern

```typescript
// src/lib/tracker/calculations.ts
import { db } from './db'
import type { Attribute, CellValue } from './types'

export async function calculateSummary(sheetId: string) {
  const attributes = await db.attributes.where('sheetId').equals(sheetId).toArray()
  const entities = await db.entities.where('sheetId').equals(sheetId).toArray()
  const entityIds = entities.map(e => e.id)
  
  const cellValues = await db.cellValues
    .where('entityId')
    .anyOf(entityIds)
    .toArray()
  
  const summaries = attributes.map(attr => {
    const cells = cellValues.filter(c => c.attributeId === attr.id)
    
    switch (attr.type) {
      case 'boolean':
      case 'boolean-currency':
        const checked = cells.filter(c => c.value === true).length
        const total = entities.length
        const subtotal = attr.type === 'boolean-currency' 
          ? checked * (attr.currencyValue ?? 0) 
          : null
        return { attributeId: attr.id, checked, total, subtotal }
      
      case 'number':
        const values = cells.map(c => c.value as number).filter(v => v != null)
        return {
          attributeId: attr.id,
          sum: values.reduce((a, b) => a + b, 0),
          avg: values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0,
          min: Math.min(...values),
          max: Math.max(...values)
        }
      
      case 'dropdown':
        const counts: Record<string, number> = {}
        cells.forEach(c => {
          const val = c.value as string
          counts[val] = (counts[val] ?? 0) + 1
        })
        return { attributeId: attr.id, counts }
      
      default:
        return { attributeId: attr.id }
    }
  })
  
  // Grand total for all boolean-currency
  const grandTotal = summaries
    .filter(s => 'subtotal' in s && s.subtotal != null)
    .reduce((sum, s) => sum + (s.subtotal ?? 0), 0)
  
  return { summaries, grandTotal }
}
```

---

## 7. Routing Structure

### Decision
Use nested routes under `/tracker/` with dynamic segments.

### Rationale
1. **Isolation**: Tracker feature is self-contained
2. **TanStack Router patterns**: Follows existing boilerplate conventions
3. **Deep linking**: Each view has a unique URL

### Route Map

| Route | Component | Purpose |
|-------|-----------|---------|
| `/tracker/` | TrackerHome | List all sheets |
| `/tracker/new` | NewSheet | Create sheet wizard |
| `/tracker/$sheetId` | SheetView | Random access view |
| `/tracker/$sheetId/mark` | MarkingMode | Sequential marking |
| `/tracker/$sheetId/summary` | SummaryView | Aggregated stats |
| `/tracker/$sheetId/edit` | EditSheet | Manage attributes |
| `/tracker/settings` | Settings | App preferences |
| `/tracker/backup` | BackupRestore | Backup/restore |

---

## 8. Touch Target Sizing

### Decision
Minimum **44px × 44px** touch targets for all interactive elements.

### Rationale
1. **Apple HIG**: Recommended minimum touch target
2. **Accessibility**: WCAG 2.5.5 requirement
3. **User requirement**: Mobile-optimized interface

### Implementation

```css
/* Tailwind utility class */
.touch-target {
  @apply min-h-[44px] min-w-[44px];
}
```

---

## Dependencies to Install

```bash
bun add dexie dexie-react-hooks
bun add -D vite-plugin-pwa
bun add xlsx  # for export functionality
```

---

## Open Questions Resolved

| Question | Resolution |
|----------|------------|
| How to handle storage quota exceeded? | Show error dialog, prompt to export and delete old sheets |
| How to handle browser data cleared? | Prominent backup reminder in settings, auto-backup option |
| Future sync with Google Drive? | Dexie Cloud provides sync infrastructure; can migrate later |
| Sequential mode UX? | Full-screen focus on current entity, large tap targets, auto-advance |
