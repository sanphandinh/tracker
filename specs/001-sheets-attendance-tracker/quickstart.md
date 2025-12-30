# Quickstart: Dynamic Attendance & Marking Tracker

**Feature Branch**: `001-sheets-attendance-tracker`
**Date**: 2025-12-29

## Prerequisites

- **Node.js** 20+ or **Bun** 1.0+
- Modern browser with IndexedDB support (Chrome 88+, Safari 14+, Firefox 78+)
- VS Code with recommended extensions

## Setup

### 1. Switch to feature branch

```bash
git checkout 001-sheets-attendance-tracker
```

### 2. Install dependencies

```bash
# Install new dependencies for this feature
bun add dexie dexie-react-hooks
bun add xlsx
bun add -D vite-plugin-pwa

# Or install all at once
bun install
```

### 3. Configure PWA (one-time setup)

Update `vite.config.ts` to add PWA plugin:

```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    // ... existing plugins
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Attendance Tracker',
        short_name: 'Tracker',
        description: 'Local-first attendance and marking tracker',
        theme_color: '#ffffff',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
```

### 4. Update TypeScript config

Add PWA types to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vite-plugin-pwa/react"]
  }
}
```

### 5. Start development server

```bash
bun run dev
```

App will be available at `http://localhost:3000`

## Development Workflow

### Run tests

```bash
# All tests
bun vitest run

# Watch mode
bun vitest

# Specific file
bun vitest run src/lib/tracker/db.test.ts

# Coverage
bun vitest run --coverage
```

### Run Storybook

```bash
bun run storybook
```

Component stories at `http://localhost:6006`

### Build for production

```bash
bun run build
bun run preview
```

## Feature Routes

| Route | Description |
|-------|-------------|
| `/tracker` | Home - list of sheets |
| `/tracker/new` | Create new sheet |
| `/tracker/[id]` | View sheet (random access) |
| `/tracker/[id]/mark` | Sequential marking mode |
| `/tracker/[id]/summary` | View summary statistics |
| `/tracker/[id]/edit` | Edit sheet structure |
| `/tracker/settings` | App settings |
| `/tracker/backup` | Backup/restore data |

## Key Files

### Data Layer

| File | Purpose |
|------|---------|
| `src/lib/tracker/db.ts` | Dexie database definition |
| `src/lib/tracker/types.ts` | TypeScript interfaces |
| `src/lib/tracker/schemas.ts` | Zod validation schemas |
| `src/lib/tracker/calculations.ts` | Summary calculations |
| `src/lib/tracker/export.ts` | Excel/CSV export |
| `src/lib/tracker/backup.ts` | Backup/restore logic |

### Hooks

| File | Purpose |
|------|---------|
| `src/hooks/tracker/useSheets.ts` | List all sheets |
| `src/hooks/tracker/useSheet.ts` | Single sheet with entities |
| `src/hooks/tracker/useEntities.ts` | Entity CRUD |
| `src/hooks/tracker/useCellValues.ts` | Cell value operations |
| `src/hooks/tracker/useSummary.ts` | Computed summaries |

### Components

| File | Purpose |
|------|---------|
| `src/components/tracker/sheet-card.tsx` | Sheet preview card |
| `src/components/tracker/entity-row.tsx` | Entity row in sheet |
| `src/components/tracker/cell-input.tsx` | Type-aware cell input |
| `src/components/tracker/attribute-header.tsx` | Column header |
| `src/components/tracker/summary-card.tsx` | Summary statistic |
| `src/components/tracker/marking-mode.tsx` | Sequential marking UI |

## Testing the Feature

### Manual Testing Checklist

1. **Create sheet**
   - [ ] Create sheet with default attribute
   - [ ] Add custom attributes (all 5 types)
   - [ ] Sheet appears on home screen

2. **Add entities**
   - [ ] Add single entity
   - [ ] Bulk add (multiple names)
   - [ ] Reorder via drag-and-drop

3. **Mark cells**
   - [ ] Toggle boolean with single tap
   - [ ] Toggle boolean-currency with single tap
   - [ ] Enter number value
   - [ ] Enter text value
   - [ ] Select dropdown option

4. **Sequential mode**
   - [ ] Auto-advances after marking
   - [ ] Can go back to previous
   - [ ] Shows completion at end

5. **Summary**
   - [ ] Boolean: count + percentage
   - [ ] Boolean-currency: count × value = subtotal
   - [ ] Grand total correct
   - [ ] Drill-down to entities

6. **Export/Backup**
   - [ ] Export single sheet to Excel
   - [ ] Export single sheet to CSV
   - [ ] Full backup downloads
   - [ ] Restore from backup works

7. **Offline**
   - [ ] Works after going offline
   - [ ] Data persists after browser restart
   - [ ] PWA installs on mobile

## Debugging

### Inspect IndexedDB

1. Open Chrome DevTools (F12)
2. Go to Application > Storage > IndexedDB
3. Find `TrackerDB` database
4. Browse tables: sheets, attributes, entities, cellValues

### Clear local data

```javascript
// In browser console
indexedDB.deleteDatabase('TrackerDB')
```

### Check PWA status

1. Chrome DevTools > Application > Service Workers
2. Verify SW is registered and active
3. Check Manifest for correct icons

## Common Issues

| Issue | Solution |
|-------|----------|
| "Dexie not found" | Run `bun install` |
| PWA not installing | Check manifest.json has valid icons |
| Data not persisting | Check IndexedDB quota in DevTools |
| Tests failing | Ensure vitest.config.ts has jsdom environment |
