# Research

## Decision: Mobile nav pattern & touch targets
- **Rationale:** Bottom navigation with 3 persistent items (Home, Sheets, Settings) keeps primary destinations within thumb reach; 44–56px height ensures tapability on 320–430px widths.
- **Alternatives considered:** Top tabs (harder thumb reach, conflicts with header back/title); hamburger (fails FR-001 by hiding items); side drawer (tablet-friendly but not mobile-first).

## Decision: Primary action placement (Create)
- **Rationale:** Floating action button anchored bottom-right/bottom-center with `calc(var(--safe-area-bottom,0px) + 12px)` offset stays reachable and avoids covering content; maintains separate slot from nav for scalability (FR-002/FR-011).
- **Alternatives considered:** Placing in nav bar (reduces space for 3 persistent items); header button (harder reach, conflicts with back/title pattern).

## Decision: Safe area handling
- **Rationale:** Use CSS `padding-bottom: max(12px, env(safe-area-inset-bottom))` and `padding-top: max(12px, env(safe-area-inset-top))` on shell/header/nav to avoid notch/home indicator overlap (FR-007). Works without JS.
- **Alternatives considered:** JS viewport detection (unnecessary complexity/perf cost); platform-specific insets (less portable).

## Decision: Tablet adaptive layout
- **Rationale:** CSS grid with `grid-template-columns: minmax(280px, 32vw) 1fr` at ≥768px to keep list + detail visible (FR-003/SC-004); fallback to single column on mobile. Avoids JS layout toggles.
- **Alternatives considered:** Separate routes for list/detail (forces back navigation, violates P2 goal); iframe/split panes via JS (heavier, less accessible).

## Decision: Typography & spacing tokens
- **Rationale:** Set base font-size 16px mobile, minimum 14px for secondary text, line-height ≥1.5, spacing scale (8/12/16/20/24) to prevent cramped content and horizontal overflow (FR-005/FR-006/SC-003).
- **Alternatives considered:** Smaller base sizes (hurts readability); per-component ad-hoc spacing (inconsistent).

## Decision: CSS-first performance
- **Rationale:** Prefer Tailwind utility classes and CSS custom properties for colors/spacing; avoid JS-driven layout recalculations. Use `position: sticky` headers, `overflow-y-auto` scroll regions, and clamp widths to prevent horizontal scroll. Aligns with user ask for HTML/CSS focus and constitution performance guidance.
- **Alternatives considered:** JS layout managers or resize observers (unneeded for current scope); heavy component libraries (adds bundle weight, risks 150KB chunk budget).
