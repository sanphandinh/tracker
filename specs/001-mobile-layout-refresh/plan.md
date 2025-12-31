# Implementation Plan: Mobile-first layout refresh

**Branch**: `001-mobile-layout-refresh` | **Date**: 2025-12-31 | **Spec**: `/specs/001-mobile-layout-refresh/spec.md`
**Input**: Feature specification from `/specs/001-mobile-layout-refresh/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. Refer to your project's tooling docs for the execution workflow.

## Summary

Refresh the TanStack Start layout to be mobile-first: persistent bottom navigation exposing Home/Sheets/Settings, a prominent create action that stays reachable without blocking content, and CSS-first responsive shells that adapt to tablet with two-pane or multi-column views while preserving 44px touch targets, safe areas, and tracker color palette/lightweight logo.

## Technical Context

**Language/Version**: TypeScript (strict) + React 18; Bun runtime for tooling  
**Primary Dependencies**: TanStack Start (Vite 7), TanStack Router, TanStack Query, tRPC, Tailwind CSS v4, Base UI + shadcn/ui patterns, `cn` utility  
**Storage**: N/A (layout-only changes; no new persistence)  
**Testing**: Vitest (co-located `*.test.ts(x)`; Storybook stories for UI)  
**Target Platform**: Web SPA/SSR via Vite; responsive for mobile ≥320px and tablet ≥768px  
**Project Type**: Web app (single repo with `src` routes/components)  
**Performance Goals**: No horizontal scroll ≥320px; maintain 44px touch targets; route chunks ≤150KB gzipped (per constitution); prefer CSS/layout solutions over JS for performance  
**Constraints**: Must handle safe areas (notch/home indicator), light/dark contrast, enforce min 14px typography/line-height, keep create action always accessible without overlaying content, use existing tracker palette + lightweight wordmark  
**Scale/Scope**: Layout shell + nav + primary action across core pages (Home, Sheets, Settings) with tablet two-pane support

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Quality gates required: `bun run build`, strict typecheck, `bun vitest run`, `bun run build-storybook` (UI changes), constitution compliance.
- Non-negotiables: strict TypeScript, Tailwind v4 + shadcn patterns, `cn` for class composition, function components only, 44px touch targets, accessibility (labels/ARIA), avoid dead code.
- Testing standard: happy-path + edge tests for UI/logic; Storybook or render tests for new UI states.

## Project Structure

### Documentation (this feature)

```text
specs/001-mobile-layout-refresh/
├── plan.md              # This file (/speckit.plan output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── ui/              # shadcn/base UI primitives
│   └── tracker/         # tracker-specific layout + controls
├── routes/              # TanStack Router file-based routes
├── lib/                 # utilities (`cn`, model helpers)
├── hooks/               # shared hooks
└── styles.css           # Tailwind v4 base/theme

tests/ (co-located)
├── src/components/tracker/*.test.tsx
├── src/routes/**/*.test.tsx
└── storybook stories in src/components/storybook/
```

**Structure Decision**: Single web app using existing `src` routes/components; layout shell/nav/primary action will live alongside tracker components and root layout routes, with responsive styles in Tailwind.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
