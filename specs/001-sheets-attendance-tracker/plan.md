# Implementation Plan: Dynamic Attendance & Marking Tracker

**Branch**: `001-sheets-attendance-tracker` | **Date**: 2025-12-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-sheets-attendance-tracker/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. Refer to your project's tooling docs for the execution workflow.

## Summary

Build a **local-first, mobile-optimized attendance tracking and marking web application** using TanStack Start. Users create dynamic tracking sheets (matrices) with entities as rows and attributes as columns. Data is stored locally using Dexie.js (IndexedDB) with future sync capability to Google Drive. The app works offline as a PWA using vite-plugin-pwa.

**Primary requirement**: Enable quick attendance marking with single-tap boolean cells and automatic summary calculations.

**Technical approach**: Dexie.js for reactive local storage with `useLiveQuery` hooks, vite-plugin-pwa for offline capability, existing shadcn/ui component patterns for consistent UI.

## Technical Context

**Language/Version**: TypeScript 5.5+ (ES2022 target, strict mode)  
**Primary Dependencies**:
- TanStack Start (React 19.2) - Full-stack React framework
- TanStack Router v1.132.0 - File-based routing
- TanStack Query v5.66.5 - Server state (limited use for local-first)
- TanStack Store v0.8.0 - Client state
- Dexie.js v4 + dexie-react-hooks - IndexedDB wrapper with reactive queries
- vite-plugin-pwa - PWA/offline capability with service worker
- Base UI + shadcn/ui patterns - Component library
- cva (class-variance-authority) - Component variants
- Tailwind CSS v4 - Styling

**Storage**: Dexie.js (IndexedDB) - Local browser storage with reactive queries, sync-ready architecture  
**Testing**: Vitest 3.0.5 + @testing-library/react - Co-located `*.test.ts(x)` files  
**Target Platform**: Mobile browsers (Chrome, Safari) with PWA offline support; tablet layouts supported  
**Project Type**: Web application (single project - extends existing boilerplate)  
**Performance Goals**: 
- Cell toggle: <100ms save to IndexedDB
- Sheet load (500 entities): <2 seconds
- Summary calculation (500 entities): <1 second
- Touch targets: minimum 44px

**Constraints**:
- Offline-capable after initial page load
- Local storage: handle at least 50MB reliably
- No server required for core functionality
- Mobile-first design with tablet support

**Scale/Scope**: 
- Up to 50 sheets per user
- Up to 500 entities per sheet
- ~8 screens: Home, Create Sheet, Sheet View, Sequential Mode, Summary, Settings, Export, Backup/Restore

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Code Quality Discipline ✅

| Principle | Compliance | Notes |
|-----------|------------|-------|
| TypeScript strict mode | ✅ Compliant | Using existing tsconfig.json with strict mode |
| Formatting conventions | ✅ Compliant | Following: no semicolons, single quotes, 2-space indentation |
| Import order | ✅ Compliant | Framework → external → `@/` → types |
| Internal imports use `@/` | ✅ Compliant | All new code will use `@/` alias |
| Function components | ✅ Compliant | React 19 function components only |
| `cn()` for class composition | ✅ Compliant | Using existing `@/lib/utils` |
| `cva` for variants | ✅ Compliant | Following existing component patterns |
| Error handling with Zod | ✅ Compliant | Input validation with Zod schemas |
| No dead code | ✅ Compliant | Clean implementation |

### II. Testing Standards ✅

| Requirement | Plan |
|-------------|------|
| Vitest co-located tests | ✅ `*.test.tsx` files alongside components |
| Happy-path tests | ✅ Core flows: create sheet, add entity, toggle cell |
| Edge/error tests | ✅ Invalid input, empty states, storage limits |
| API route integration tests | ⚠️ N/A - Local-first with no API routes |
| UI components: render test or Storybook | ✅ Storybook stories for new components |

### III. User Experience Consistency ✅

| Principle | Compliance | Notes |
|-----------|------------|-------|
| Tailwind CSS v4 | ✅ Compliant | Using existing setup |
| Base UI + shadcn/ui patterns | ✅ Compliant | Extending `src/components/ui/` |
| `cn()` and `cva` usage | ✅ Compliant | For all new components |
| Accessibility | ✅ Compliant | Labels, focus states, ARIA, 44px touch targets |
| TanStack Router conventions | ✅ Compliant | File-based routes in `src/routes/tracker/` |
| Naming conventions | ✅ Compliant | Components PascalCase, files kebab-case |

### IV. Performance & Efficiency ✅

| Budget | Plan | Status |
|--------|------|--------|
| Route chunks ≤ 150KB gzip | ✅ Lazy load tracker routes | Monitor with build |
| Avoid unnecessary re-renders | ✅ Dexie `useLiveQuery` handles reactivity efficiently | Built-in optimization |
| TanStack Query for data | ⚠️ Limited use | Local data via Dexie, not network requests |
| Optimized images/assets | ✅ N/A | Minimal assets, icon-based UI |
| API handlers <500ms p95 | ⚠️ N/A | No server-side handlers needed |
| SSR/SPA modes intentional | ✅ SPA mode | PWA requires client-side rendering |

### Quality Gates ✅

- [x] Build: `bun run build` - Will verify
- [x] Typecheck: Strict TypeScript
- [x] Tests: Vitest with new feature tests
- [x] Storybook: New components will have stories
- [x] Constitution Check: This section

## Project Structure

### Documentation (this feature)

```text
specs/001-sheets-attendance-tracker/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output - N/A (no API routes for local-first)
│   └── README.md        # Explains why no contracts needed
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Extends existing TanStack Start boilerplate structure
src/
├── components/
│   ├── ui/                        # Existing shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   └── tracker/                   # NEW: Tracker feature components
│       ├── sheet-card.tsx         # Sheet preview card for home screen
│       ├── entity-row.tsx         # Single entity row in sheet view
│       ├── cell-input.tsx         # Type-aware cell input component
│       ├── attribute-header.tsx   # Column header with type indicator
│       ├── summary-card.tsx       # Summary statistic card
│       ├── marking-mode.tsx       # Sequential marking interface
│       └── *.stories.tsx          # Storybook stories for each
│
├── hooks/
│   ├── useAudioRecorder.ts        # Existing
│   └── tracker/                   # NEW: Tracker hooks
│       ├── useSheets.ts           # CRUD operations for sheets
│       ├── useSheet.ts            # Single sheet with entities
│       ├── useEntities.ts         # Entity management
│       ├── useCellValues.ts       # Cell value operations
│       └── useSummary.ts          # Calculated summaries
│
├── lib/
│   ├── utils.ts                   # Existing cn() utility
│   └── tracker/                   # NEW: Tracker utilities
│       ├── db.ts                  # Dexie database definition
│       ├── types.ts               # TypeScript interfaces
│       ├── export.ts              # CSV/Excel export logic
│       ├── backup.ts              # Backup/restore logic
│       └── calculations.ts        # Summary calculation functions
│
├── routes/
│   ├── __root.tsx                 # Existing root layout
│   ├── index.tsx                  # Existing (may add tracker link)
│   └── tracker/                   # NEW: Tracker routes
│       ├── index.tsx              # Home: list of sheets
│       ├── new.tsx                # Create new sheet
│       ├── $sheetId.tsx           # Sheet view (random access mode)
│       ├── $sheetId.mark.tsx      # Sequential marking mode
│       ├── $sheetId.summary.tsx   # Summary view
│       ├── $sheetId.edit.tsx      # Edit sheet structure
│       ├── settings.tsx           # App settings
│       └── backup.tsx             # Backup/restore page
│
└── styles.css                     # Existing global styles

# Root level additions
public/
├── manifest.json                  # UPDATE: PWA manifest for tracker app
└── icons/                         # NEW: PWA icons (192x192, 512x512)
```

**Structure Decision**: Single project extending existing boilerplate. All tracker code is namespaced under `tracker/` subdirectories within existing folders (`components/tracker/`, `hooks/tracker/`, `lib/tracker/`, `routes/tracker/`). This keeps the feature isolated while reusing shared UI components and utilities.

## Complexity Tracking

> **No constitution violations detected.** All principles are satisfied.

| Consideration | Decision | Rationale |
|---------------|----------|-----------|
| TanStack Query limited use | Acceptable | Local-first architecture uses Dexie.js `useLiveQuery` for reactivity instead of TanStack Query. Query may be used for future sync features. |
| No API routes | Acceptable | Core feature is local-first with no server requirement. Export/import is file-based, not API-based. |
| SPA mode for PWA | Acceptable | PWA requires client-side rendering and service worker. SSR not applicable for offline-first app. |
| New dependency: Dexie.js | Justified | Best-in-class IndexedDB wrapper with React hooks, future sync capability (Dexie Cloud), and 50MB+ storage support. Alternatives (localStorage, raw IndexedDB) lack features. |
| New dependency: vite-plugin-pwa | Justified | Zero-config PWA with service worker generation. Required for offline capability. No simpler alternative. |
