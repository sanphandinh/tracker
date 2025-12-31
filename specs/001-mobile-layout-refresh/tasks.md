# Tasks: Mobile-first layout refresh

**Input**: Design documents from `/specs/001-mobile-layout-refresh/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/layout.openapi.yaml, quickstart.md

**Tests**: Tests are MANDATORY per constitution for UI components with behavior. Each user story includes Storybook stories for visual states and Vitest tests for interaction/accessibility.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initial project configuration and CSS foundation

- [ ] T001 Add CSS custom properties for safe areas, breakpoints, and spacing tokens in src/styles.css
- [ ] T002 [P] Define Tailwind v4 theme extensions for tracker palette, typography scale (16px base, 14px min), and shadows in src/styles.css
- [ ] T003 [P] Add viewport meta tag with safe-area-inset support in root HTML template

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core layout shell and shared components that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Create LayoutShell component with safe-area padding and theme support in src/components/tracker/layout-shell.tsx
- [ ] T005 [P] Add layout shell Vitest test (render, safe-area props, theme toggle) in src/components/tracker/layout-shell.test.tsx
- [ ] T006 Update root route to use LayoutShell wrapper in src/routes/__root.tsx
- [ ] T007 [P] Create responsive ContentRegion component with single-column/two-pane modes in src/components/tracker/content-region.tsx
- [ ] T008 [P] Add content region Vitest test (breakpoint switching at 768px, no horizontal scroll at 320px) in src/components/tracker/content-region.test.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Mobile-first navigation access (Priority: P1) 🎯 MVP

**Goal**: Persistent bottom navigation with Home/Sheets/Settings and floating Create action, all within thumb reach, ≤2 taps to any destination.

**Independent Test**: On 375px viewport, verify 3 nav items + Create action are tappable with ≥44px hit targets; navigate between Home/Sheets/Settings without scrolling.

### Tests for User Story 1 (MANDATORY for UI components)

- [ ] T009 [P] [US1] Create NavigationItem Storybook story with active/inactive/badge states in src/components/storybook/navigation-item.stories.ts
- [ ] T010 [P] [US1] Create PrimaryAction Storybook story with light/dark/placement variants in src/components/storybook/primary-action.stories.ts
- [ ] T011 [P] [US1] Add NavigationZone Vitest test (3 items rendered, ≥44px height, active highlighting, keyboard nav) in src/components/tracker/navigation-zone.test.tsx
- [ ] T012 [P] [US1] Add PrimaryAction Vitest test (≥48px hitbox, safe-area offset, no content overlap) in src/components/tracker/primary-action.test.tsx

### Implementation for User Story 1

- [ ] T013 [P] [US1] Create NavigationItem component with icon, label, route, badge support in src/components/tracker/navigation-item.tsx
- [ ] T014 [P] [US1] Create PrimaryAction component with floating-bottom placement and safe-area offset in src/components/tracker/primary-action.tsx
- [ ] T015 [US1] Create NavigationZone component with 3 persistent items (Home, Sheets, Settings) and bottom-fixed layout in src/components/tracker/navigation-zone.tsx
- [ ] T016 [US1] Integrate NavigationZone into LayoutShell with 56px height and space-between alignment in src/components/tracker/layout-shell.tsx
- [ ] T017 [US1] Integrate PrimaryAction (Create) into LayoutShell with bottom-right anchor in src/components/tracker/layout-shell.tsx
- [ ] T018 [US1] Wire NavigationItem active state from TanStack Router useMatchRoute hook in src/components/tracker/navigation-item.tsx
- [ ] T019 [US1] Add ARIA labels and focus-visible styles to NavigationItem and PrimaryAction for accessibility in src/components/tracker/navigation-item.tsx and primary-action.tsx

**Checkpoint**: User Story 1 complete - mobile nav with 3 destinations + Create action, all thumb-reachable, independently testable

---

## Phase 4: User Story 2 - Tablet-friendly adaptive layout (Priority: P2)

**Goal**: Two-pane or grid layout at ≥768px showing list + detail side-by-side without forced back navigation; adapts to orientation changes.

**Independent Test**: On ≥768px viewport, verify list and detail panes visible simultaneously; rotating portrait↔landscape maintains state and adjusts columns.

### Tests for User Story 2 (MANDATORY for UI layout behavior)

- [ ] T020 [P] [US2] Add ContentRegion Storybook story with mobile/tablet/landscape variants in src/components/storybook/content-region.stories.ts
- [ ] T021 [P] [US2] Add two-pane integration test (list + detail visible at 768px, single column at 767px) in src/components/tracker/content-region.test.tsx

### Implementation for User Story 2

- [ ] T022 [P] [US2] Extend ContentRegion with CSS grid two-pane layout using `grid-template-columns: minmax(280px, 32vw) 1fr` at ≥768px in src/components/tracker/content-region.tsx
- [ ] T023 [P] [US2] Add TwoPaneLayout wrapper component for list + detail children in src/components/tracker/two-pane-layout.tsx
- [ ] T024 [US2] Update tracker sheets route to use TwoPaneLayout with list pane (sheet cards) and detail pane (selected sheet content) in src/routes/tracker/index.tsx
- [ ] T025 [US2] Preserve scroll position and selection state on orientation change using CSS scroll-behavior and React state in src/components/tracker/two-pane-layout.tsx
- [ ] T026 [US2] Add tablet-specific navigation placement option (side sticky nav for landscape if helpful) in src/components/tracker/navigation-zone.tsx

**Checkpoint**: User Stories 1 AND 2 both work independently - mobile nav functional, tablet shows two-pane views

---

## Phase 5: User Story 3 - Content readability and controls (Priority: P2)

**Goal**: No horizontal scroll at ≥320px; readable typography (≥14px, line-height ≥1.5); form inputs and long content don't overflow or clip.

**Independent Test**: On 375px viewport, open forms/long content; verify no horizontal scroll, text wraps without truncation, buttons ≥44px height, spacing prevents cramped feel.

### Tests for User Story 3 (MANDATORY for layout constraints)

- [ ] T027 [P] [US3] Add typography Storybook story with mobile/tablet font sizes and line heights in src/components/storybook/typography.stories.ts
- [ ] T028 [P] [US3] Add overflow guard test (render long Vietnamese text, wide form, verify no horizontal scroll at 320px) in src/components/tracker/content-region.test.tsx

### Implementation for User Story 3

- [ ] T029 [P] [US3] Set base typography tokens: 16px body, 14px secondary, line-height 1.5–1.6 in src/styles.css
- [ ] T030 [P] [US3] Add spacing scale (8/12/16/20/24px) and apply to container padding/margins in src/styles.css
- [ ] T031 [US3] Clamp container max-width and add horizontal padding to prevent overflow in src/components/tracker/content-region.tsx
- [ ] T032 [US3] Update form components (if any) to ensure min 44px input/button height and adequate spacing in src/components/tracker/*.tsx
- [ ] T033 [US3] Add text-wrap utilities and word-break for long labels/Vietnamese text in src/styles.css
- [ ] T034 [US3] Test edge cases: ≤320px viewport, long text, large images scaled with max-w-full in src/components/tracker/content-region.test.tsx

**Checkpoint**: All user stories independently functional - mobile nav, tablet two-pane, readable content with no overflow

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Refinements affecting multiple user stories and final validation

- [ ] T035 [P] Apply tracker color palette to header/nav backgrounds and ensure WCAG AA contrast in light/dark themes in src/styles.css
- [ ] T036 [P] Add lightweight app logo/wordmark to header without harming contrast in src/components/tracker/layout-shell.tsx
- [ ] T037 [P] Add mobile header back button + title pattern (replace breadcrumbs on mobile) in src/components/tracker/mobile-header.tsx
- [ ] T038 Create MobileHeader component with back navigation and integrate into LayoutShell in src/components/tracker/mobile-header.tsx and layout-shell.tsx
- [ ] T039 [P] Add safe-area CSS for notch/home indicator handling across all layout components in src/styles.css
- [ ] T040 [P] Performance audit: verify route chunks ≤150KB gzipped, no JS layout recalcs via Chrome DevTools
- [ ] T041 [P] Accessibility audit: verify focus-visible outlines, ARIA labels, keyboard nav across all interactive elements
- [ ] T042 Run quickstart.md validation: 375px (≤2 taps), 768px (two-pane), no horizontal scroll ≥320px, touch targets ≥44px
- [ ] T043 [P] Update AGENTS.md with layout component patterns and mobile-first conventions
- [ ] T044 Run full build and test suite: `bun run build && bun vitest run && bun run build-storybook`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3/P2)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational - Integrates with ContentRegion but independently testable
- **User Story 3 (P2)**: Can start after Foundational - May adjust ContentRegion but independently testable

### Within Each User Story

- Tests (Storybook + Vitest) SHOULD be written first to verify behaviors
- Component creation before integration
- Basic implementation before accessibility/polish
- Story complete and tested before moving to next priority

### Parallel Opportunities

- T001-T003 (Setup) can all run in parallel
- T004-T008 (Foundational) T005/T007/T008 can run in parallel after T004/T006
- T009-T012 (US1 tests) can all run in parallel
- T013-T014 (US1 components) can run in parallel
- T020-T021 (US2 tests) can run in parallel
- T022-T023 (US2 components) can run in parallel
- T027-T028 (US3 tests) can run in parallel
- T029-T030 (US3 CSS tokens) can run in parallel
- T035-T041 (Polish) most can run in parallel
- Once Foundational complete, all three user stories can be developed in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "NavigationItem Storybook story" (T009)
Task: "PrimaryAction Storybook story" (T010)
Task: "NavigationZone Vitest test" (T011)
Task: "PrimaryAction Vitest test" (T012)

# Launch core components for User Story 1 together:
Task: "NavigationItem component" (T013)
Task: "PrimaryAction component" (T014)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (CSS tokens, safe-area)
2. Complete Phase 2: Foundational (LayoutShell, ContentRegion) - CRITICAL
3. Complete Phase 3: User Story 1 (bottom nav + Create FAB)
4. **STOP and VALIDATE**: Test on 375px viewport - verify ≤2 taps to all destinations
5. Deploy/demo if ready - **This is the MVP!**

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (**MVP: mobile nav working**)
3. Add User Story 2 → Test independently → Deploy/Demo (tablet two-pane added)
4. Add User Story 3 → Test independently → Deploy/Demo (readability polished)
5. Polish phase → Final validation and launch

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (bottom nav + FAB)
   - Developer B: User Story 2 (tablet two-pane)
   - Developer C: User Story 3 (typography/overflow guards)
3. Stories complete and integrate independently, then merge

---

## Notes

- **CSS-first**: All layout uses Tailwind utilities and CSS custom properties; no JS layout calculations
- **Touch targets**: Enforce ≥44px (mobile nav items) and ≥48px (primary action) throughout
- **Safe areas**: Apply `env(safe-area-inset-*)` padding on shell/header/nav to avoid notch/home indicator overlap
- **Accessibility**: Include ARIA labels, focus-visible outlines, keyboard navigation
- **Performance**: Keep route chunks ≤150KB gzipped per constitution; avoid heavy component libraries
- **Testing**: Storybook stories for visual states; Vitest tests for interactions, sizing, overflow guards
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
