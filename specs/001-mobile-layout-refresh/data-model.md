# Data Model

Although this feature is layout-focused (CSS/HTML-first), define configuration entities to keep navigation, actions, and responsive behavior consistent and testable.

## Entities

### LayoutShell
- **Fields**
  - `safeAreaTop`: CSS length (default `env(safe-area-inset-top, 0px)`).
  - `safeAreaBottom`: CSS length (default `env(safe-area-inset-bottom, 0px)`).
  - `headerHeight`: px (default 56 on mobile, 64 on tablet+).
  - `bottomNavHeight`: px (default 56; min 44 per FR-004).
  - `contentPadding`: { x: px, y: px } (default { x: 12, y: 12 }).
  - `theme`: `light | dark | system`.
- **Relationships**: owns `NavigationZone`, `PrimaryAction`, `ContentRegion`.
- **Validation**: `headerHeight`/`bottomNavHeight` ≥ 44px; `contentPadding.x` ensures no horizontal scroll on ≥320px; apply `safeAreaTop/Bottom` padding to avoid occlusion (FR-007).

### NavigationItem
- **Fields**
  - `id`: string (`home | sheets | settings | custom-*`).
  - `label`: string (localized, supports long Vietnamese text).
  - `route`: pathname (e.g., `/`, `/tracker`, `/settings`).
  - `icon`: icon name or component token.
  - `badgeCount` (optional): number.
  - `isActive`: boolean (derived from router state).
- **Validation**: Label must wrap without truncation at 320px; tap area ≥44px height/width; at least 3 persistent items (FR-001/FR-011).

### NavigationZone
- **Fields**
  - `items`: NavigationItem[3..4].
  - `layout`: `bottom-fixed` (mobile) | `side/sticky` (tablet optional when two-pane active).
  - `alignment`: `space-between` or `centered` for equal thumb reach.
- **Validation**: `items.length` ≥3; height ≥44px; ensures focus/active state visible in light/dark (FR-008).

### PrimaryAction
- **Fields**
  - `label`: string (e.g., "Create").
  - `icon`: icon token.
  - `href` or `onClick`: route/action.
  - `placement`: `floating-bottom` with offset `calc(var(--safe-area-bottom) + 12px)`.
  - `size`: px (min 48x48 hitbox) with outer padding not covering nav.
- **Validation**: Remains visible on all screens; does not overlap nav/content; accessible name via `aria-label`; supports both themes (FR-002/FR-011).

### ContentRegion
- **Fields**
  - `layoutMode`: `single-column` (mobile) | `two-pane` (tablet ≥768px) | `two-column-grid` (cards).
  - `listPaneMin`: px (default 280) with `clamp(260px, 32vw, 360px)`.
  - `detailPaneMin`: px (default 320) flexible remainder.
  - `scrollBehavior`: `auto` with `overflow-y-auto`, no horizontal scroll (FR-005).
- **Validation**: On ≥768px, two-pane or 2-column grid available for eligible screens; on 320–430px no horizontal scroll and typography ≥14px (FR-003/FR-006/SC-003/SC-004).

### ThemeTokens
- **Fields**
  - `palette`: uses existing tracker colors (primary, surface, border, muted, accent) plus wordmark/logo slot.
  - `radius`: border radius scale (4/8/12).
  - `shadow`: small/elevated for FAB and nav.
  - `typography`: base 16px, secondary 14px, line-height 1.5–1.6.
- **Validation**: Contrast meets WCAG AA for nav/header/content in light/dark (FR-008/FR-009); no text clipped at 320px.

## State Transitions
- **NavigationItem `isActive`**: derived from TanStack Router match; updates nav highlighting without layout shift.
- **ContentRegion layout**: switches at 768px breakpoint; preserves scroll position and selection on orientation change (tablet scenario).
- **Theme**: responds to system toggle; retains contrast for nav/primary action.

## Notes
- All layout sizing should rely on CSS variables/Tailwind utilities—no JS layout calculations to honor the performance constraint.
- Touch areas should include focus-visible outlines for keyboard accessibility even though mobile-first.
