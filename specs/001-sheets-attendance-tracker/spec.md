# Feature Specification: Dynamic Attendance & Marking Tracker

**Feature Branch**: `001-sheets-attendance-tracker`  
**Created**: 2025-12-29  
**Status**: Draft  
**Input**: User description: "Xây dựng ứng dụng đánh dấu và điểm danh kết hợp với Google Sheets. Tạo động các bảng đánh dấu điểm danh và lưu trữ dữ liệu. Local-first, đơn giản, tránh over-engineering."

## Overview

A **local-first**, mobile-optimized web application for attendance tracking and marking. Users can create custom tracking sheets (matrices) where rows represent entities (people, items) and columns represent attributes to track. Data is stored locally in the browser with optional export for backup and sharing.

### Core Concept: The Tracking Matrix

```
                    ┌────────────────────── Attributes (Columns) ──────────────────────┐
                    │  Điểm danh   │  Tiền ăn 150k │  Tiền ăn 200k │  Ghi chú        │
                    │  (boolean)   │  (boolean)    │  (boolean)    │  (text)         │
┌───────────────────┼──────────────┼───────────────┼───────────────┼─────────────────┤
│ Nguyễn Văn A      │      ✓       │       ✓       │               │                 │
│ Trần Thị B        │      ✓       │               │       ✓       │  VIP            │
│ Lê Văn C          │      ✗       │               │               │                 │
│ Phạm Thị D        │      ✓       │       ✓       │               │                 │
└───────────────────┴──────────────┴───────────────┴───────────────┴─────────────────┘
     Entities (Rows)

Summary: Điểm danh: 3/4 (75%) | Tiền ăn 150k: 2 × 150,000 = 300,000đ | Tiền ăn 200k: 1 × 200,000 = 200,000đ
         Tổng thu: 500,000đ
```

### Design Philosophy

- **Local-first**: All data stored locally in browser, no server or cloud authentication required
- **Simple & Practical**: Focus on real-world needs, avoid over-engineering
- **Tap-to-mark**: Prefer boolean attributes over data entry for speed (e.g., "Tiền 150k" instead of entering "150000")
- **Offline-capable**: Works without internet connection
- **Export-friendly**: Can export to spreadsheet format when needed
- **Mobile-optimized**: Quick marking with minimal taps

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create Tracking Sheet with Default Attribute (Priority: P1)

As a user, I want to create a new tracking sheet with at least one attribute column so I can start tracking immediately with a sensible default.

**Why this priority**: This is the foundation - without a sheet with attributes, no tracking can happen.

**Independent Test**: User can create a sheet, it has a default attribute, and they can start adding entities right away.

**Acceptance Scenarios**:

1. **Given** I open the app, **When** I tap "Create New Sheet", **Then** I see a form with sheet name and a default attribute already added
2. **Given** I am creating a sheet, **When** I see the default attribute, **Then** it is pre-configured as "Điểm danh" (boolean type) which I can rename or change
3. **Given** I want more attributes, **When** I tap "Add Attribute", **Then** I can define name and choose type: boolean, boolean-currency, number, text, or dropdown
4. **Given** I choose boolean-currency type, **When** I configure it, **Then** I enter the currency value (e.g., 150000) and the attribute becomes "Tiền ăn 150k" with that value attached
5. **Given** I define a dropdown attribute, **When** I configure it, **Then** I can add multiple options (e.g., "Mức 1", "Mức 2", "Mức 3")
6. **Given** I tap "Create", **When** creation succeeds, **Then** the sheet is saved with my defined structure

---

### User Story 2 - Add Entities (People/Items) to Sheet (Priority: P1)

As a user, I want to add a list of people or items to track so I have rows to mark against.

**Why this priority**: A sheet without entities has nothing to track. This is required before marking.

**Independent Test**: User can add multiple entities to a sheet and see them listed as rows.

**Acceptance Scenarios**:

1. **Given** I have an empty sheet, **When** I tap "Add Entity" (or "Thêm người"), **Then** I can enter a name/identifier
2. **Given** I am adding entities, **When** I want to add many quickly, **Then** I can add multiple names at once (one per line or comma-separated)
3. **Given** I have entities in my sheet, **When** I view the sheet, **Then** I see them as rows with empty attribute cells ready to mark
4. **Given** I need to reorder entities, **When** I drag an entity row, **Then** I can change the order (affects sequential marking)

---

### User Story 3 - Sequential Marking Mode (Attendance) (Priority: P1)

As a user doing attendance, I want to quickly mark each person in order from top to bottom so I can process a line of people efficiently.

**Why this priority**: This is the primary use case for attendance - calling names in order and marking presence.

**Independent Test**: User can start sequential mode and mark each entity with a single tap, automatically advancing to the next.

**Acceptance Scenarios**:

1. **Given** I open a sheet in sequential mode, **When** I view the interface, **Then** the first unmarked entity is highlighted/focused
2. **Given** I am on an entity, **When** I tap "Present" (✓) or "Absent" (✗), **Then** it marks the boolean attribute and auto-advances to next entity
3. **Given** I am marking sequentially, **When** I reach the last entity, **Then** I see a completion summary
4. **Given** I made a mistake, **When** I tap on a previous entity, **Then** I can correct it and continue from there
5. **Given** the attribute is not boolean (e.g., currency), **When** I enter a value, **Then** it saves and advances to next entity

---

### User Story 4 - Random Access Marking Mode (Priority: P1)

As a user, I want to jump directly to any entity and mark it so I can handle out-of-order situations (e.g., person arrives late, payment comes in randomly).

**Why this priority**: Real-world marking often happens out of order. Users need flexibility.

**Independent Test**: User can tap any row in the list and mark it immediately without affecting position.

**Acceptance Scenarios**:

1. **Given** I open a sheet in list view, **When** I see all entities, **Then** I can scroll and tap any entity directly
2. **Given** I tap on entity #10, **When** I mark it, **Then** it saves without affecting my view position
3. **Given** I have many entities, **When** I use search/filter, **Then** I can find and mark a specific entity quickly
4. **Given** I mark entity #10 then entity #3, **When** I view the sheet, **Then** both are correctly marked regardless of order

---

### User Story 5 - Quick Cell Editing by Type (Priority: P1)

As a user, I want each cell to have an appropriate input method based on its attribute type so marking is fast and error-free.

**Why this priority**: The right input method dramatically improves speed and reduces errors. Boolean-based marking is the fastest.

**Independent Test**: Each attribute type shows appropriate input: single-tap toggle for boolean types, picker for dropdown.

**Acceptance Scenarios**:

1. **Given** I tap a boolean cell, **When** I interact with it, **Then** it toggles immediately with a single tap (no modal)
2. **Given** I tap a boolean-currency cell (e.g., "Tiền ăn 150k"), **When** I tap it, **Then** it toggles with single tap just like regular boolean
3. **Given** I tap a dropdown cell, **When** the picker opens, **Then** I see all options and can select with one tap
4. **Given** I tap a text cell, **When** input opens, **Then** I see a text keyboard
5. **Given** I tap a number cell, **When** input opens, **Then** I see a numeric keypad

---

### User Story 6 - Browse and Open Existing Sheets (Priority: P2)

As a user, I want to see my sheets on the home screen so I can quickly access any sheet.

**Why this priority**: After creating sheets, users need to navigate back to them.

**Independent Test**: User sees a list of sheets on home screen sorted by last modified.

**Acceptance Scenarios**:

1. **Given** I open the app, **When** I view home screen, **Then** I see my sheets sorted by last modified
2. **Given** I tap on a sheet, **When** it opens, **Then** I see all entities and their current values
3. **Given** I have many sheets, **When** I search, **Then** I can find sheets by name

---

### User Story 7 - View Summary and Totals (Priority: P2)

As a user, I want to see summaries of my tracking data so I can understand overall status at a glance.

**Why this priority**: Summaries provide actionable insights from tracked data.

**Independent Test**: User opens summary and sees calculated totals appropriate to each attribute type.

**Acceptance Scenarios**:

1. **Given** I have a sheet with boolean attributes, **When** I view summary, **Then** I see count of checked vs unchecked (e.g., "15/20 có mặt - 75%")
2. **Given** I have boolean-currency attributes, **When** I view summary, **Then** I see count × value = total (e.g., "Tiền ăn 150k: 10 × 150,000 = 1,500,000đ")
3. **Given** I have multiple boolean-currency attributes, **When** I view summary, **Then** I see grand total of all currency (e.g., "Tổng thu: 2,500,000đ")
4. **Given** I have dropdown attributes, **When** I view summary, **Then** I see count per option (e.g., "Mức 1: 10, Mức 2: 5, Mức 3: 3")
5. **Given** I want details, **When** I tap on a summary stat, **Then** I see the list of entities contributing to that stat

---

### User Story 8 - Manage Attributes (Add/Edit/Remove) (Priority: P2)

As a user, I want to add new attributes or modify existing ones so I can evolve my tracking sheet over time.

**Why this priority**: Requirements change - users need to adapt sheets without recreating them.

**Independent Test**: User can add a new attribute column to existing sheet with data.

**Acceptance Scenarios**:

1. **Given** I have a sheet with data, **When** I tap "Add Attribute", **Then** a new column is added with empty values for all entities
2. **Given** I want to rename an attribute, **When** I edit it, **Then** the name changes but data is preserved
3. **Given** I want to remove an attribute, **When** I delete it, **Then** I am warned and the column with its data is removed
4. **Given** I add a dropdown attribute, **When** I later need more options, **Then** I can edit the dropdown to add/remove options

---

### User Story 9 - Export Data (Priority: P3)

As a user, I want to export my sheet to a spreadsheet format for sharing or backup.

**Why this priority**: Export enables data portability.

**Independent Test**: User exports a sheet and the file opens correctly in Excel/Google Sheets.

**Acceptance Scenarios**:

1. **Given** I have a sheet with data, **When** I tap "Export", **Then** I can choose format (CSV, Excel)
2. **Given** I export, **When** download completes, **Then** the file contains all entities and attributes correctly formatted
3. **Given** I open in Excel/Sheets, **When** I view data, **Then** columns match my attributes and rows match my entities

---

### User Story 10 - Backup and Restore All Data (Priority: P3)

As a user, I want to backup all my sheets and restore them if I lose data.

**Why this priority**: Protects against data loss from browser clearing or device change.

**Independent Test**: User can backup, clear browser data, restore, and see all sheets intact.

**Acceptance Scenarios**:

1. **Given** I have multiple sheets, **When** I tap "Backup All", **Then** a single backup file downloads
2. **Given** I have a backup file, **When** I restore, **Then** all sheets and data are recovered
3. **Given** I restore, **When** complete, **Then** data integrity is 100% (same entities, attributes, values)

---

### Edge Cases

- What happens when browser storage is full? → Show error with option to export and delete old sheets
- What happens when user clears browser data? → Data is lost; show backup reminder prominently
- What happens when restoring corrupted backup? → Validate file, show error, don't overwrite existing data
- What happens with 1000+ entities in a sheet? → Use virtualization for smooth scrolling
- What happens when adding attribute to sheet with 500 entities? → Show progress indicator, complete within 2 seconds

## Requirements *(mandatory)*

### Functional Requirements

#### Sheet & Structure Management
- **FR-001**: System MUST allow creating sheets with a name and at least one attribute
- **FR-002**: System MUST provide a default attribute (boolean type, named "Điểm danh") when creating new sheets
- **FR-003**: System MUST support attribute types: 
  - **boolean**: simple true/false toggle (e.g., "Điểm danh", "Đã nộp")
  - **boolean-currency**: boolean with attached currency value for quick tap-to-mark payments (e.g., "Tiền ăn 150k" = tap to mark 150,000đ)
  - **number**: numeric input
  - **text**: free-form text
  - **dropdown**: single-select from predefined options
- **FR-004**: System MUST allow adding, renaming, and removing attributes from existing sheets
- **FR-005**: System MUST allow defining dropdown options when creating/editing dropdown attributes
- **FR-006**: System MUST allow setting currency value when creating boolean-currency attributes

#### Entity (Row) Management
- **FR-007**: System MUST allow adding entities (people/items) with a name/identifier
- **FR-008**: System MUST allow bulk adding entities (multiple names at once)
- **FR-009**: System MUST allow reordering entities via drag-and-drop
- **FR-010**: System MUST allow editing and deleting existing entities

#### Marking & Data Entry
- **FR-011**: System MUST support sequential marking mode (auto-advance to next entity after marking)
- **FR-012**: System MUST support random access marking (tap any entity to mark directly)
- **FR-013**: System MUST provide type-appropriate input for each attribute:
  - Boolean: single-tap toggle (no modal)
  - Boolean-currency: single-tap toggle (no modal) - same UX as boolean
  - Number: numeric keypad
  - Text: text keyboard
  - Dropdown: option picker with single-tap selection
- **FR-014**: System MUST auto-save all changes immediately (within 100ms)
- **FR-015**: System MUST show subtle visual feedback when changes are saved

#### Summary & Reporting
- **FR-016**: System MUST calculate summaries appropriate to attribute type:
  - Boolean: count checked, count unchecked, percentage
  - Boolean-currency: count checked × currency value = subtotal
  - Number: sum, average, min, max
  - Dropdown: count per option
- **FR-017**: System MUST show grand total of all boolean-currency attributes
- **FR-018**: System MUST allow drilling down from summary to see contributing entities

#### Data Storage & Portability
- **FR-019**: System MUST store all data locally in browser (no server required)
- **FR-020**: System MUST persist data reliably across browser sessions
- **FR-021**: System MUST allow exporting single sheet to CSV or Excel format
- **FR-022**: System MUST allow full backup (all sheets) to downloadable file
- **FR-023**: System MUST allow restoring from backup file

#### User Interface
- **FR-024**: System MUST provide mobile-optimized touch interface (minimum 44px touch targets)
- **FR-025**: System MUST support tablet layouts with optimized screen space usage
- **FR-026**: System MUST work fully offline after initial page load

### Non-Functional Requirements

- **NFR-001**: Local storage MUST support structured data with efficient querying
- **NFR-002**: Local storage MUST handle at least 50MB of data reliably
- **NFR-003**: Storage operations MUST complete within 100ms for typical actions
- **NFR-004**: Sheet with 500 entities MUST load in under 2 seconds
- **NFR-005**: Summary calculations MUST complete in under 1 second for 500 entities

### Key Entities

- **Tracking Sheet**: A named matrix containing entities (rows) and attributes (columns). Has metadata: id, name, created date, last modified date.

- **Attribute (Column)**: Defines what to track. Properties:
  - `id`: unique identifier
  - `name`: display name (e.g., "Điểm danh", "Tiền ăn 150k")
  - `type`: boolean | boolean-currency | number | text | dropdown
  - `currencyValue`: number (only for boolean-currency type, e.g., 150000)
  - `options`: array of strings (only for dropdown type)
  - `position`: order in the sheet

- **Entity (Row)**: A person or item being tracked. Properties:
  - `id`: unique identifier
  - `name`: display name/identifier
  - `position`: order in the sheet (for sequential marking)

- **Cell Value**: The intersection of an entity and attribute. Properties:
  - `entityId`: reference to entity
  - `attributeId`: reference to attribute
  - `value`: the actual value (boolean for boolean/boolean-currency, number for number, string for text/dropdown)

- **Summary**: Calculated aggregations per attribute across all entities. For boolean-currency, includes: count × currencyValue = subtotal.

- **Backup**: Complete export of all sheets, attributes, entities, and values.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a new sheet with default attribute in under 30 seconds
- **SC-002**: Users can add 10 entities in under 1 minute (bulk add)
- **SC-003**: In sequential mode, users can mark one entity in under 1 second (single tap + auto-advance)
- **SC-004**: In random access mode, users can find and mark any entity in under 5 seconds
- **SC-005**: Boolean cells toggle with single tap (no modal, no extra confirmation)
- **SC-006**: All changes save within 100ms of user action
- **SC-007**: Sheet with 100 entities loads in under 2 seconds
- **SC-008**: Summary calculations display within 1 second for 500 entities
- **SC-009**: App works fully offline after initial page load
- **SC-010**: Touch targets meet minimum 44px accessibility guidelines
- **SC-011**: Export produces valid CSV/Excel files that open correctly
- **SC-012**: Backup and restore maintains 100% data integrity

## Assumptions

- Users access the app primarily from mobile browsers (Chrome, Safari)
- Browser supports modern storage APIs (IndexedDB)
- Users are willing to manage their own backups for data safety
- Typical usage: under 50 sheets, under 500 entities per sheet
- Single-user per device (no sharing within the app)
- Most common attribute type is boolean (attendance/checkbox)
- Sequential marking is the primary use case for attendance scenarios

## Out of Scope

- Cloud synchronization or server-side storage
- User authentication/accounts
- Multi-user collaboration
- Complex formulas or calculated columns
- Date-range filtering for summaries (simplified to show all data)
- Desktop-optimized layouts (mobile and tablet only)
- Import from external files (only export and restore from own backup)
- Data encryption at rest (relies on browser protections)
