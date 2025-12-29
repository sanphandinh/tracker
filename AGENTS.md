# AGENTS.md - Coding Agent Guidelines

This document provides guidelines for AI coding agents working in this TanStack Start boilerplate repository.

## Project Overview

This is a **TanStack Start** full-stack React application using:
- **Bun** as the package manager
- **Vite 7** as the build tool
- **TanStack Router** for file-based routing
- **TanStack Query** for server state
- **tRPC** for type-safe APIs
- **Tailwind CSS v4** for styling
- **Base UI + shadcn/ui** patterns for components
- **Vitest** for testing
- **Storybook** for component development

## Build and Development Commands

```bash
# Install dependencies
bun install

# Development server (port 3000)
bun run dev

# Production build
bun run build

# Preview production build
bun run preview

# Storybook (port 6006)
bun run storybook
bun run build-storybook
```

## Testing Commands

```bash
# Run all tests once
bun run test
bun vitest run

# Run tests in watch mode
bun vitest

# Run a single test file
bun vitest run src/path/to/file.test.ts

# Run tests matching a pattern
bun vitest run --grep "button"
bun vitest run button

# Run with coverage
bun vitest run --coverage
```

**Note:** Test files use `.test.ts` or `.test.tsx` extensions and are co-located with source files.

## Code Style Guidelines

### TypeScript Configuration

- **Strict mode** is enabled with additional checks
- **ES2022** target, bundler module resolution
- Path alias: `@/*` maps to `./src/*`

### Formatting

- **No semicolons** at end of statements
- **Single quotes** for strings
- **2-space indentation**
- **Trailing commas** in multi-line constructs
- **No explicit linter/formatter configured** - follow existing patterns

### Imports

1. **Order imports** in groups:
   - React and framework imports first
   - External library imports
   - Internal imports using `@/` alias
   - Type imports last (use `import type { ... }`)

2. **Use the path alias** `@/` for all internal imports:
```typescript
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { TRPCRouter } from "@/integrations/trpc/router"
```

3. **Separate type imports**:
```typescript
import { createFileRoute } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
```

### Naming Conventions

- **Components**: PascalCase (`ChatPage`, `GuitarRecommendation`)
- **Files**: kebab-case for components (`button.tsx`, `alert-dialog.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAudioRecorder`, `useTTS`)
- **Routes**: kebab-case matching URL segments (`api.tanchat.ts`, `$guitarId.tsx`)
- **Constants**: UPPER_SNAKE_CASE (`SYSTEM_PROMPT`, `MODEL_OPTIONS`)
- **Types/Interfaces**: PascalCase (`MyRouterContext`, `Provider`)

### React Components

1. **Function components** only (no class components)
2. **Props destructuring** in function signature:
```typescript
function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
```

3. **Use `cn()` utility** for className composition:
```typescript
import { cn } from "@/lib/utils"
className={cn(buttonVariants({ variant, size, className }))}
```

4. **Use CVA (class-variance-authority)** for component variants:
```typescript
const buttonVariants = cva("base-classes", {
  variants: { variant: {...}, size: {...} },
  defaultVariants: { variant: "default", size: "default" }
})
```

### Routing (TanStack Router)

- **File-based routing** in `src/routes/`
- Route definition pattern:
```typescript
export const Route = createFileRoute('/path')({
  component: PageComponent,
})
```

- **API routes** use server handlers:
```typescript
export const Route = createFileRoute('/api/endpoint')({
  server: {
    handlers: {
      POST: async ({ request }) => { ... }
    }
  }
})
```

### Error Handling

- Use try/catch with proper error typing
- Log errors to console with context: `console.error('Context:', error)`
- Return proper HTTP status codes for API routes (499 for aborted, 500 for errors)
- Validate inputs with Zod schemas

### State Management

- **TanStack Query** for server state
- **TanStack Store** for client state
- **tRPC** for type-safe API calls with Zod validation:
```typescript
const router = {
  list: publicProcedure.query(() => data),
  add: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => { ... })
} satisfies TRPCRouterRecord
```

### Environment Variables

- Use `@t3-oss/env-core` with Zod validation in `src/env.ts`
- Client variables must have `VITE_` prefix
- Server-only variables are not prefixed

## Project Structure

```
src/
  components/
    storybook/     # Components with Storybook stories
    ui/            # Reusable UI components (shadcn-style)
  data/            # Static data files
  hooks/           # Custom React hooks
  integrations/    # Third-party integrations (tRPC, TanStack Query)
  lib/             # Utility functions and shared logic
  routes/          # TanStack Router file-based routes
    demo/          # Demo routes and API endpoints
  env.ts           # Environment variable schema
  router.tsx       # Router configuration
  styles.css       # Global styles and Tailwind theme
```

## Adding shadcn/ui Components

Use the shadcn CLI to add new components:
```bash
pnpm dlx shadcn@latest add button
```

Components are added to `src/components/ui/` and use Base UI primitives with Tailwind CSS.

## Key Files Reference

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `vite.config.ts` | Vite build configuration |
| `components.json` | shadcn/ui configuration |
| `src/lib/utils.ts` | Utility functions (cn) |
| `src/env.ts` | Environment variable schema |
| `src/router.tsx` | Router setup |
| `src/routes/__root.tsx` | Root layout component |
