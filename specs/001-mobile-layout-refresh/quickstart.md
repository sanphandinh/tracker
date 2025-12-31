# Quickstart

## Goals
- Mobile-first layout shell with bottom navigation (Home, Sheets, Settings) and a floating Create action.
- CSS-first responsiveness: no JS layout calculations; avoid horizontal scroll on ≥320px.
- Tablet two-pane/grid at ≥768px while keeping 44px touch targets and safe-area padding.

## Setup
```bash
bun install
bun run dev
```
- Preview mobile: open http://localhost:3000 on a 375px viewport.
- Preview tablet: set viewport ≥768px and rotate to test orientation.

## Implementation Steps
1. **Layout shell**: update root layout (e.g., `src/routes/__root.tsx`) to include header (back + title on mobile), content region, bottom nav container, and safe-area aware padding using CSS vars (`env(safe-area-inset-*)`).
2. **Bottom navigation**: add 3–4 items (Home, Sheets, Settings) with equal spacing, 44–56px height, icons + labels, focus/active states for light/dark. Use Tailwind utilities and `cn()`.
3. **Primary action**: add floating Create button anchored bottom-right/bottom-center with `calc(var(--safe-area-bottom,0px) + 12px)` offset; ensure 48px+ hitbox and no overlap with nav/content.
4. **Tablet adaptive**: in content wrapper, use CSS grid to switch at 768px to two-pane (`grid-template-columns: minmax(280px, 32vw) 1fr`) or 2-column card grid. Preserve scroll state and avoid covering nav.
5. **Typography & spacing**: set base font-size 16px (min 14px on elements), line-height ≥1.5, spacing scale 8/12/16/20/24 to avoid cramped layouts. Clamp container widths to prevent horizontal scroll.
6. **Safe area**: apply `padding-top: max(12px, env(safe-area-inset-top))` and `padding-bottom: max(12px, env(safe-area-inset-bottom))` on shell, header, and nav.
7. **Palette & logo**: reuse tracker color tokens for header/nav backgrounds; place lightweight wordmark in header without harming contrast.

## Validation
- Run `bun vitest run` for tests; add/adjust render tests for nav/primary action sizing and overflow guards.
- Run `bun run build-storybook` to ensure stories compile; add Storybook states for mobile + tablet variants.
- Manual checks: 375px viewport (≤2 taps to nav + create), ≥768px two-pane, dark/light contrast, no horizontal scroll at ≥320px, touch targets ≥44px.

## Notes
- Prefer Tailwind utilities and CSS custom properties over JS layout logic.
- Keep route chunks under 150KB (constitution); avoid pulling new heavy UI libs.
