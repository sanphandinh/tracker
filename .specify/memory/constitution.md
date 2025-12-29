<!--
Sync Impact Report
- Version change: unversioned → 1.0.0
- Modified principles: N/A (template placeholders replaced)
- Added sections: "Quality Gates"; "Development Workflow & Review"
- Removed sections: Placeholder Principle 5 section
- Templates requiring updates:
	✅ .specify/templates/plan-template.md (removed stale commands reference)
	✅ .specify/templates/tasks-template.md (tests now mandatory per constitution)
	✅ .specify/templates/spec-template.md (reviewed; no changes required)
	⚠  .specify/templates/commands/ (not present in repo; no action)
- Follow-up TODOs: TODO(RATIFICATION_DATE) — set original adoption date when known
-->

# TanStack Start Boilerplate Constitution

## Core Principles

### I. Code Quality Discipline (NON-NEGOTIABLE)

The codebase MUST adhere to strict, consistent standards to maximize readability,
maintainability, and correctness:

- TypeScript strict mode MUST remain enabled with no relaxed flags.
- Formatting conventions MUST match project patterns: no semicolons, single quotes,
	2-space indentation, and trailing commas in multi-line constructs.
- Import order MUST follow: framework/React → external libs → internal `@/` imports →
	type-only imports last.
- Internal imports MUST use the `@/` alias.
- React components MUST be function components, destructure props, use `cn()` for
	class composition, and `cva` for variants where applicable.
- Naming conventions MUST follow repository guidance (components PascalCase, files
	kebab-case, hooks `useX`, route files match URL segments).
- Error handling MUST use try/catch with typed errors; log with context using
	`console.error('Context:', error)`; validate external inputs with Zod.
- Dead code, unused exports, and accidental global styles are prohibited.

Rationale: Enforcing a uniform style reduces cognitive load, prevents subtle
runtime issues, and keeps PRs focused on meaningful changes.

### II. Testing Standards (NON-NEGOTIABLE)

Testing is required alongside implementation and acts as a quality gate:

- Use Vitest. Tests MUST be co-located and named `*.test.ts(x)`.
- For every module or component with logic or UI behavior, include at least:
	- One happy-path test.
	- One edge/boundary or error-handling test.
- API routes and server handlers MUST include an integration test for their primary
	success path; complex validation paths SHOULD include at least one failure case.
- New UI components MUST also include either a minimal render test or a Storybook
	story to exercise core states; where feasible, provide both.
- PRs MUST keep tests passing (`bun vitest run` or equivalent in CI). Regressions are
	not permitted on main.

Rationale: Tests document intent, prevent regressions, and enable safe refactors.

### III. User Experience Consistency

Deliver a coherent experience across routes and components:

- Use Tailwind CSS v4 and the Base UI + shadcn/ui patterns in `src/components/ui/`.
- Compose classes with `cn()`; define variants with `cva` to ensure consistent API
	across components.
- Ensure accessibility: proper labels, focus states, keyboard navigation, and ARIA
	semantics for interactive controls. Inputs MUST be paired with labels.
- Follow TanStack Router conventions for file-based routes and the `createFileRoute`
	pattern; keep route components minimal and delegate logic to hooks/libs.
- Respect repository naming, folder structure, and import aliasing for predictable
	discoverability.

Rationale: Consistency reduces bugs, speeds development, and improves user trust
and accessibility.

### IV. Performance & Efficiency

Maintain responsive UI and efficient network usage with measurable budgets:

- Route-level code splitting is REQUIRED; individual route chunks SHOULD be ≤ 150 KB
	gzipped (excluding shared vendor bundles) unless justified in PR.
- Avoid unnecessary re-renders (memoize expensive computations, stable callbacks,
	appropriate dependency arrays); prefer data-fetching via TanStack Query with
	sensible `staleTime` and cache usage to limit network churn.
- Images and assets MUST be optimized (responsive sizes, modern formats where
	possible). Avoid blocking the main thread with long synchronous work.
- API server handlers SHOULD complete primary work within 500 ms p95 in typical
	development conditions; long-running tasks MUST be offloaded or streamed.
- Use SSR/SPA modes intentionally; measure with Lighthouse where appropriate and
	file a follow-up if budgets are exceeded.

Rationale: Reasonable budgets preserve UX quality and keep the boilerplate fast
by default.

## Quality Gates

The following gates MUST pass before merge to main:

- Build: `bun run build` succeeds with no type errors.
- Typecheck: repository compiles under strict TypeScript settings.
- Tests: `bun vitest run` passes; new features meet the Testing Standards section.
- Storybook (if UI changes): `bun run build-storybook` must succeed without errors.
- Constitution Check: reviewers confirm adherence to principles above or a
	documented justification exists in the PR description.

## Development Workflow & Review

- Branches SHOULD follow `[###-feature-name]` where `###` is an issue/PR number
	when available.
- Each PR MUST include: a brief description, scope of change, testing evidence
	(test output or screenshots), and any performance/UX considerations.
- Keep PRs small and focused. Large changes MUST be split when feasible.
- When violating a principle, include a "Complexity Tracking" note explaining why
	and alternatives considered (see plan template).

## Governance

- This Constitution supersedes other style preferences when in conflict.
- Amendments occur via PR and MUST include:
	- Updated version according to semantic rules (see below),
	- Sync Impact Report at the top of this file,
	- Any template updates required by the change.
- Versioning of this Constitution:
	- MAJOR: Backward-incompatible changes to principles or governance.
	- MINOR: New principle/section or materially expanded guidance.
	- PATCH: Clarifications and non-semantic wording fixes.
- Compliance is enforced during code review. Reviewers MUST block merges that
	violate non-negotiable principles without justification.
- Runtime developer guidance is captured in `AGENTS.md`; this Constitution
	references and complements that document.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2025-12-29
