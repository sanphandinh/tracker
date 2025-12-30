# Tasks: Dynamic Attendance & Marking Tracker

**Input**: Design documents from `/specs/001-sheets-attendance-tracker/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, quickstart.md ✓

**Tests**: Tests are MANDATORY per Constitution. Each user story includes happy-path and edge case tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure - single project extending TanStack Start boilerplate:
- Data layer: `src/lib/tracker/`
- Hooks: `src/hooks/tracker/`
- Components: `src/components/tracker/`
- Routes: `src/routes/tracker/`

---

## Phase 1: Setup

**Purpose**: Project initialization, dependencies, and infrastructure

- [X] T001 Install dependencies: `bun add dexie dexie-react-hooks xlsx && bun add -D vite-plugin-pwa`
- [X] T002 [P] Create tracker directory structure: `src/lib/tracker/`, `src/hooks/tracker/`, `src/components/tracker/`, `src/routes/tracker/`
- [X] T003 [P] Add PWA types to tsconfig.json: add `"vite-plugin-pwa/react"` to compilerOptions.types
- [X] T004 [P] Create PWA icons placeholder in `public/icons/` (icon-192.png, icon-512.png)
- [X] T005 Configure vite-plugin-pwa in `vite.config.ts` with manifest and workbox settings per research.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data layer that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Create TypeScript interfaces in `src/lib/tracker/types.ts` per data-model.md
- [X] T007 Create Zod validation schemas in `src/lib/tracker/schemas.ts` per data-model.md
- [X] T008 Create Dexie database definition in `src/lib/tracker/db.ts` with TrackerDatabase class
- [X] T009 [P] Create base test utilities in `src/lib/tracker/db.test.ts` (setup/teardown helpers for IndexedDB)
- [X] T010 [P] Create shared layout container in `src/routes/__root.tsx` (mobile-optimized) instead of separate `/tracker` route

**Checkpoint**: Foundation ready - Dexie database works, types defined, user story implementation can begin

---

## Phase 3: User Story 1 - Create Tracking Sheet with Default Attribute (Priority: P1) 🎯 MVP

**Goal**: User can create a new tracking sheet with at least one attribute column

**Independent Test**: Create sheet → has default "Điểm danh" attribute → saved to IndexedDB

### Tests for User Story 1 ⚠️

- [X] T011 [P] [US1] Unit test for sheet creation in `src/lib/tracker/db.test.ts` - test createSheet adds default attribute
- [X] T012 [P] [US1] Component test for CreateSheetForm in `src/components/tracker/create-sheet-form.test.tsx`

### Implementation for User Story 1

- [X] T013 [US1] Implement createSheet function in `src/lib/tracker/db.ts` with default "Điểm danh" boolean attribute
- [X] T014 [US1] Implement useCreateSheet hook in `src/hooks/tracker/useCreateSheet.ts`
- [X] T015 [P] [US1] Create AttributeTypeSelect component in `src/components/tracker/attribute-type-select.tsx`
- [X] T016 [P] [US1] Create AttributeConfig component in `src/components/tracker/attribute-config.tsx` for currency value and dropdown options
- [X] T017 [US1] Create CreateSheetForm component in `src/components/tracker/create-sheet-form.tsx`
- [X] T018 [US1] Create new sheet route in `src/routes/tracker/new.tsx`
- [X] T019 [P] [US1] Create Storybook story for CreateSheetForm in `src/components/tracker/create-sheet-form.stories.tsx`

**Checkpoint**: User can create sheets with custom attributes - foundation for all other stories

---

## Phase 4: User Story 2 - Add Entities to Sheet (Priority: P1) 🎯 MVP

**Goal**: User can add people/items as rows to track

**Independent Test**: Add entity → appears in sheet → persists in IndexedDB

### Tests for User Story 2 ⚠️

- [X] T020 [P] [US2] Unit test for entity CRUD in `src/lib/tracker/db.test.ts` - test addEntity, bulkAddEntities, reorderEntities
- [X] T021 [P] [US2] Component test for AddEntityForm in `src/components/tracker/add-entity-form.test.tsx`

### Implementation for User Story 2

- [X] T022 [US2] Implement entity CRUD functions in `src/lib/tracker/db.ts` (addEntity, bulkAddEntities, updateEntity, deleteEntity, reorderEntities)
- [X] T023 [US2] Implement useEntities hook in `src/hooks/tracker/useEntities.ts` with useLiveQuery
- [X] T024 [P] [US2] Create AddEntityForm component in `src/components/tracker/add-entity-form.tsx` with bulk add support
- [X] T025 [P] [US2] Create EntityRow component in `src/components/tracker/entity-row.tsx` with drag handle for reordering
- [X] T026 [US2] Implement drag-and-drop reordering in EntityRow using @dnd-kit or native drag
- [X] T027 [P] [US2] Create Storybook story for EntityRow in `src/components/tracker/entity-row.stories.tsx`

**Checkpoint**: User can populate sheets with entities - ready for marking

---

## Phase 5: User Story 5 - Quick Cell Editing by Type (Priority: P1) 🎯 MVP

**Goal**: Each cell has type-appropriate input (single-tap toggle for boolean, picker for dropdown, etc.)

**Independent Test**: Tap boolean cell → toggles immediately → saves to IndexedDB

**Note**: This is implemented before US3/US4 because marking modes depend on cell input component

### Tests for User Story 5 ⚠️

- [X] T028 [P] [US5] Unit test for cell value operations in `src/lib/tracker/db.test.ts` - test updateCellValue, getCellValue
- [X] T029 [P] [US5] Component test for CellInput in `src/components/tracker/cell-input.test.tsx` - test all 5 attribute types

### Implementation for User Story 5

- [X] T030 [US5] Implement cell value functions in `src/lib/tracker/db.ts` (updateCellValue, getCellValue, getCellValuesForEntity)
- [X] T031 [US5] Implement useCellValues hook in `src/hooks/tracker/useCellValues.ts` with optimistic updates
- [X] T032 [US5] Create CellInput component in `src/components/tracker/cell-input.tsx` with cva variants per research.md
- [X] T033 [US5] Implement boolean toggle behavior in CellInput (single-tap, no modal, null→true→false cycle)
- [X] T034 [US5] Implement boolean-currency toggle behavior in CellInput (same as boolean)
- [X] T035 [US5] Implement dropdown picker in CellInput with accessible select
- [X] T036 [US5] Implement number input in CellInput with numeric keyboard pattern
- [X] T037 [US5] Implement text input in CellInput with inline editing
- [X] T038 [P] [US5] Create Storybook stories for CellInput variants in `src/components/tracker/cell-input.stories.tsx`

**Checkpoint**: All cell types work with appropriate input methods - core marking infrastructure complete

---

## Phase 6: User Story 3 - Sequential Marking Mode (Priority: P1) 🎯 MVP

**Goal**: User can mark entities in order with auto-advance to next

**Independent Test**: Start sequential mode → mark Present → auto-advances to next entity

### Tests for User Story 3 ⚠️

- [ ] T039 [P] [US3] Component test for MarkingMode in `src/components/tracker/marking-mode.test.tsx` - test auto-advance behavior

### Implementation for User Story 3

- [ ] T040 [US3] Create MarkingMode component in `src/components/tracker/marking-mode.tsx` with focused entity display
- [ ] T041 [US3] Implement auto-advance logic in MarkingMode (advance to next unmarked after marking)
- [ ] T042 [US3] Add completion summary in MarkingMode when all entities marked
- [ ] T043 [US3] Add "go back" navigation to correct previous marks
- [ ] T044 [US3] Create sequential marking route in `src/routes/tracker/$sheetId.mark.tsx`
- [ ] T045 [P] [US3] Create Storybook story for MarkingMode in `src/components/tracker/marking-mode.stories.tsx`

**Checkpoint**: Sequential attendance marking works - primary use case complete

---

## Phase 7: User Story 4 - Random Access Marking Mode (Priority: P1) 🎯 MVP

**Goal**: User can tap any entity in list view and mark it directly

**Independent Test**: Scroll to entity #10 → tap cell → value saved → view position unchanged

### Tests for User Story 4 ⚠️

- [ ] T046 [P] [US4] Component test for SheetView in `src/components/tracker/sheet-view.test.tsx` - test direct cell editing

### Implementation for User Story 4

- [ ] T047 [US4] Implement useSheet hook in `src/hooks/tracker/useSheet.ts` with entities, attributes, and cell values
- [ ] T048 [US4] Create AttributeHeader component in `src/components/tracker/attribute-header.tsx` with type indicator
- [ ] T049 [US4] Create SheetView component in `src/components/tracker/sheet-view.tsx` with scrollable grid layout
- [ ] T050 [US4] Implement search/filter in SheetView for finding entities quickly
- [ ] T051 [US4] Create sheet view route in `src/routes/tracker/$sheetId.tsx`
- [ ] T052 [P] [US4] Create Storybook story for SheetView in `src/components/tracker/sheet-view.stories.tsx`

**Checkpoint**: Both marking modes (sequential and random) work - all P1 user stories complete

---

## Phase 8: User Story 6 - Browse and Open Existing Sheets (Priority: P2)

**Goal**: User sees sheets on home screen sorted by last modified

**Independent Test**: Open app → see list of sheets → tap to open → view sheet contents

### Tests for User Story 6 ⚠️

- [ ] T053 [P] [US6] Component test for SheetCard in `src/components/tracker/sheet-card.test.tsx`
- [ ] T054 [P] [US6] Component test for TrackerHome in `src/routes/tracker/index.test.tsx`

### Implementation for User Story 6

- [ ] T055 [US6] Implement useSheets hook in `src/hooks/tracker/useSheets.ts` with useLiveQuery sorted by updatedAt
- [ ] T056 [US6] Create SheetCard component in `src/components/tracker/sheet-card.tsx` with preview info
- [ ] T057 [US6] Create TrackerHome page in `src/routes/tracker/index.tsx` with sheet list and "Create New" button
- [ ] T058 [US6] Add search functionality to TrackerHome for finding sheets by name
- [ ] T059 [P] [US6] Create Storybook story for SheetCard in `src/components/tracker/sheet-card.stories.tsx`

**Checkpoint**: Navigation between sheets works - app is usable for multi-sheet scenarios

---

## Phase 9: User Story 7 - View Summary and Totals (Priority: P2)

**Goal**: User sees calculated summaries appropriate to each attribute type

**Independent Test**: Open summary → see boolean count/percentage → see currency subtotals → see grand total

### Tests for User Story 7 ⚠️

- [ ] T060 [P] [US7] Unit test for calculateSummary in `src/lib/tracker/calculations.test.ts`
- [ ] T061 [P] [US7] Component test for SummaryCard in `src/components/tracker/summary-card.test.tsx`

### Implementation for User Story 7

- [ ] T062 [US7] Create calculations utility in `src/lib/tracker/calculations.ts` per research.md
- [ ] T063 [US7] Implement useSummary hook in `src/hooks/tracker/useSummary.ts` using calculateSummary
- [ ] T064 [US7] Create SummaryCard component in `src/components/tracker/summary-card.tsx` for each attribute type
- [ ] T065 [US7] Create SummaryView component in `src/components/tracker/summary-view.tsx` with grand total
- [ ] T066 [US7] Add drill-down to SummaryCard showing contributing entities
- [ ] T067 [US7] Create summary route in `src/routes/tracker/$sheetId.summary.tsx`
- [ ] T068 [P] [US7] Create Storybook story for SummaryCard in `src/components/tracker/summary-card.stories.tsx`

**Checkpoint**: Summary calculations work - users get actionable insights

---

## Phase 10: User Story 8 - Manage Attributes (Priority: P2)

**Goal**: User can add, rename, and remove attributes from existing sheets

**Independent Test**: Edit sheet → add new attribute → column appears with empty values for all entities

### Tests for User Story 8 ⚠️

- [ ] T069 [P] [US8] Unit test for attribute CRUD in `src/lib/tracker/db.test.ts` - test addAttribute, updateAttribute, deleteAttribute
- [ ] T070 [P] [US8] Component test for EditSheet in `src/components/tracker/edit-sheet.test.tsx`

### Implementation for User Story 8

- [ ] T071 [US8] Implement attribute CRUD functions in `src/lib/tracker/db.ts` (addAttribute, updateAttribute, deleteAttribute)
- [ ] T072 [US8] Implement useAttributes hook in `src/hooks/tracker/useAttributes.ts`
- [ ] T073 [US8] Create EditSheet component in `src/components/tracker/edit-sheet.tsx` with attribute management
- [ ] T074 [US8] Add delete confirmation dialog for attribute deletion with data warning
- [ ] T075 [US8] Create edit sheet route in `src/routes/tracker/$sheetId.edit.tsx`

**Checkpoint**: All P2 user stories complete - app supports sheet evolution

---

## Phase 11: User Story 9 - Export Data (Priority: P3)

**Goal**: User can export sheet to CSV or Excel format

**Independent Test**: Export sheet → download file → opens correctly in Excel/Google Sheets

### Tests for User Story 9 ⚠️

- [ ] T076 [P] [US9] Unit test for export functions in `src/lib/tracker/export.test.ts`

### Implementation for User Story 9

- [ ] T077 [US9] Create export utility in `src/lib/tracker/export.ts` with exportSheetToExcel, exportSheetToCSV per research.md
- [ ] T078 [US9] Add export button to SheetView with format selector (CSV/Excel)
- [ ] T079 [US9] Implement file download trigger for export

**Checkpoint**: Single sheet export works - data portability achieved

---

## Phase 12: User Story 10 - Backup and Restore (Priority: P3)

**Goal**: User can backup all sheets and restore from backup file

**Independent Test**: Backup all → clear IndexedDB → restore → all sheets intact

### Tests for User Story 10 ⚠️

- [ ] T080 [P] [US10] Unit test for backup/restore in `src/lib/tracker/backup.test.ts` - test createBackup, restoreBackup, data integrity

### Implementation for User Story 10

- [ ] T081 [US10] Create backup utility in `src/lib/tracker/backup.ts` with createBackup, restoreBackup per research.md
- [ ] T082 [US10] Create BackupRestore component in `src/components/tracker/backup-restore.tsx`
- [ ] T083 [US10] Add file picker for restore with validation
- [ ] T084 [US10] Add restore confirmation with data integrity check
- [ ] T085 [US10] Create backup route in `src/routes/tracker/backup.tsx`

**Checkpoint**: All P3 user stories complete - data safety achieved

---

## Phase 13: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements across all user stories

- [ ] T086 [P] Add link to tracker from main app in `src/routes/index.tsx`
- [ ] T087 [P] Create Settings page in `src/routes/tracker/settings.tsx` with backup reminder toggle
- [ ] T088 [P] Add empty state illustrations for home screen (no sheets) and sheet view (no entities)
- [ ] T089 Implement list virtualization for sheets with 500+ entities using @tanstack/react-virtual
- [ ] T090 Add loading states and skeleton loaders for async operations
- [ ] T091 [P] Run quickstart.md validation - verify all manual testing checklist items pass
- [ ] T092 Performance audit: verify cell toggle <100ms, sheet load <2s for 500 entities
- [ ] T093 [P] Update public/manifest.json with tracker app details
- [ ] T094 Final accessibility audit: verify 44px touch targets, ARIA labels, keyboard navigation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all user stories
- **Phases 3-12 (User Stories)**: All depend on Phase 2 completion
- **Phase 13 (Polish)**: Depends on all desired user stories being complete

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|-----------|-------------------|
| US1 (Create Sheet) | Phase 2 only | US2, but US2 needs sheets to exist |
| US2 (Add Entities) | US1 (needs sheet) | - |
| US5 (Cell Editing) | US2 (needs entities) | - |
| US3 (Sequential Marking) | US5 (needs cell input) | US4 |
| US4 (Random Marking) | US5 (needs cell input) | US3 |
| US6 (Browse Sheets) | US1 (needs sheets) | US7, US8 |
| US7 (Summary) | US5 (needs cell values) | US6, US8 |
| US8 (Manage Attributes) | US1 (needs sheets) | US6, US7 |
| US9 (Export) | US5 (needs data) | US10 |
| US10 (Backup) | Phase 2 only | US9 |

### Recommended MVP Path (User Stories 1-6)

1. Complete Phase 1 (Setup) + Phase 2 (Foundational)
2. Complete US1 → US2 → US5 → US3 + US4 → US6
3. **STOP**: MVP complete - users can create sheets, add entities, mark attendance, browse sheets
4. Continue with US7, US8, US9, US10 as time permits

### Parallel Opportunities per Phase

```text
Phase 1: T002, T003, T004 can run in parallel
Phase 2: T009, T010 can run in parallel
Phase 3: T011, T012, T015, T016, T019 can run in parallel
Phase 4: T020, T021, T024, T025, T027 can run in parallel
Phase 5: T028, T029, T038 can run in parallel
Phase 6: T039, T045 can run in parallel
Phase 7: T046, T052 can run in parallel
Phase 8: T053, T054, T059 can run in parallel
Phase 9: T060, T061, T068 can run in parallel
Phase 10: T069, T070 can run in parallel
Phase 11: T076 runs first (test)
Phase 12: T080 runs first (test)
Phase 13: T086, T087, T088, T091, T093, T094 can run in parallel
```

---

## Implementation Strategy

### MVP First (P1 User Stories Only)

1. Complete Phase 1: Setup (~30 min)
2. Complete Phase 2: Foundational (~1-2 hours)
3. Complete Phases 3-7: User Stories 1-6 (P1 + US6 for navigation)
4. **STOP and VALIDATE**: Run quickstart.md manual testing checklist
5. Deploy/demo MVP

**MVP Scope**: Create sheets, add entities, mark attendance (sequential + random), browse sheets

### Incremental Delivery After MVP

6. Add Phase 8: US7 (Summary) - adds insights
7. Add Phase 9: US8 (Manage Attributes) - adds flexibility
8. Add Phase 10-11: US9-10 (Export/Backup) - adds data safety
9. Complete Phase 13: Polish

### Single Developer Execution Order

```text
T001 → T002-T004 (parallel) → T005
→ T006 → T007 → T008 → T009-T010 (parallel)
→ T011-T012 (test first) → T013-T019
→ T020-T021 (test first) → T022-T027
→ T028-T029 (test first) → T030-T038
→ T039 (test first) → T040-T045
→ T046 (test first) → T047-T052
→ T053-T054 (test first) → T055-T059
→ [MVP CHECKPOINT]
→ Continue with P2/P3 stories...
```

---

## Task Summary

| Phase | User Story | Tasks | Parallel |
|-------|-----------|-------|----------|
| 1 | Setup | 5 | 3 |
| 2 | Foundational | 5 | 2 |
| 3 | US1 - Create Sheet | 9 | 5 |
| 4 | US2 - Add Entities | 8 | 4 |
| 5 | US5 - Cell Editing | 11 | 3 |
| 6 | US3 - Sequential Marking | 7 | 2 |
| 7 | US4 - Random Marking | 7 | 2 |
| 8 | US6 - Browse Sheets | 7 | 4 |
| 9 | US7 - Summary | 9 | 3 |
| 10 | US8 - Manage Attributes | 7 | 2 |
| 11 | US9 - Export | 4 | 1 |
| 12 | US10 - Backup | 6 | 1 |
| 13 | Polish | 9 | 6 |
| **Total** | | **94** | **38** |

### Per-Story Task Counts

| Story | Priority | Test Tasks | Implementation Tasks | Total |
|-------|----------|------------|---------------------|-------|
| US1 | P1 | 2 | 7 | 9 |
| US2 | P1 | 2 | 6 | 8 |
| US3 | P1 | 1 | 6 | 7 |
| US4 | P1 | 1 | 6 | 7 |
| US5 | P1 | 2 | 9 | 11 |
| US6 | P2 | 2 | 5 | 7 |
| US7 | P2 | 2 | 7 | 9 |
| US8 | P2 | 2 | 5 | 7 |
| US9 | P3 | 1 | 3 | 4 |
| US10 | P3 | 1 | 5 | 6 |

### MVP Scope Summary

**MVP (P1 stories + US6)**: 49 tasks → Complete, testable attendance tracker
**Full Feature**: 94 tasks → All user stories including export/backup

---

## Notes

- [P] = parallelizable (different files, no dependencies)
- [USn] = belongs to User Story n for traceability
- Tests are written FIRST and must FAIL before implementation
- Each user story is independently testable after completion
- Commit after each task or logical group
- All tasks include exact file paths per plan.md structure
