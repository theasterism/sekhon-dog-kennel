# AGENTS.md

This file provides guidelines for agents operating in this repository.

## Build, Lint, and Test Commands

### Development
```bash
bun run dev                    # Start dev server
bun run preview               # Preview production build
```

### Building
```bash
bun run build:dev             # Build for dev environment
bun run build:prod            # Build for production
```

### Type Checking
```bash
tsc --noEmit                  # Run TypeScript type check
bun run typegen               # Generate wrangler types
```

### Formatting & Linting
```bash
bun run format                # Format code with Biome
bun run lint                  # Lint code with Biome
bun run fix                   # Fix linting issues automatically
```

### Database
```bash
bun run db:generate           # Generate Drizzle migrations
bun run db:migrate:dev        # Apply dev migrations to remote DB
bun run db:migrate:local      # Apply dev migrations to local DB
bun run db:migrate:prod       # Apply production migrations
bun run db:studio             # Open Drizzle Studio
```

### Deployment
```bash
bun run deploy:dev            # Build and deploy to dev
bun run deploy:prod           # Build and deploy to production
```

---

## Code Style Guidelines

### Project Structure

**Directory Organization:**
- `src/routes/` - TanStack Router file-based routes (kebab-case)
- `src/components/` - React components
  - `components/ui/` - shadcn/ui components
  - `components/marketing/` - Marketing page components
- `src/lib/` - Library code, integrations
- `src/utils/` - Utility functions (camelCase)
- `src/server/` - Backend logic
  - `server/api/` - tRPC routers and procedures
  - `server/db/` - Database schema and client
  - `server/storage/` - Cloudflare R2 storage
  - `server/auth/` - Authentication
  - `server/email/` - Email sending

### Imports

**Order (each group alphabetically sorted):**
1. React and React Router hooks
2. TanStack Query hooks
3. TanStack Router imports
4. Lucide icons
5. React hooks and core
6. Toast/notification libraries
7. Zod
8. UI components (`@/components/ui/*`)
9. Server types and utilities (`@/server/*`, `@/lib/*`)
10. Utils (`@/utils/*`)
11. Type imports (`type`, `interface`)

```typescript
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeftIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as z from "zod";
import { Button, Card } from "@/components/ui/button";
import { api } from "@/lib/trpc";
import { getAge } from "@/utils/age";
import type { Dog } from "@/types";
```

**Alias usage:**
- Use `@/` for all imports from `src/`
- Never use relative paths (`../` or `./`) except within same file group

### Naming Conventions

**Components (PascalCase):**
- File: `Button.tsx`, `AvailableDogsSection.tsx`
- Component: `function Button() {}`
- Props interface: `ButtonProps`

**Other files (camelCase):**
- Utilities: `cn.ts`, `age.ts`
- Routes: `dogs/$dogId.edit.tsx`, `_dashboard/index.tsx`

**Constants and Config (UPPER_SNAKE_CASE):**
```typescript
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
```

**Booleans (is/has/should prefix):**
```typescript
isLoading, hasError, shouldRedirect
```

**Database Enums (lowercase string literals):**
```typescript
status: z.enum(["available", "reserved", "sold"])
```

**tRPC Procedures:**
- Use descriptive names: `listAdmin`, `createDog`, `submitApplication`
- Always use input validation with Zod

### Component Patterns

**UI Components (shadcn/ui style):**
- Use Base UI primitives (`@base-ui/react/button`)
- Use class-variance-authority (cva) for variants
- Use `cn()` utility for class merging
- Export component + variants constant

```typescript
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/utils/cn"

const buttonVariants = cva("...", {
  variants: {
    variant: { default: "...", outline: "...", ... },
    size: { default: "...", sm: "...", lg: "...", ... },
  },
  defaultVariants: { variant: "default", size: "default" },
})

function Button({ className, variant, size, ...props }) {
  return <ButtonPrimitive className={cn(buttonVariants({ variant, size, className }))} {...props} />
}
```

**Route Files (TanStack Router):**
```typescript
export const Route = createFileRoute("/admin/_dashboard/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ ... }),
  loader: async ({ context, deps }) => { ... },
  component: RouteComponent,
})

function RouteComponent() { ... }
```

### TypeScript Patterns

**Use inferred types from tRPC when possible:**
```typescript
type Dog = RouterOutputs["dogs"]["admin"]["list"]["items"][number];
```

**Define explicit types for props:**
```typescript
function StatusBadge({ status, published }: { status: string | null; published: boolean }) { ... }
```

**Avoid `any` - use `unknown` with type guards or explicit types:**

### Error Handling

**Backend (tRPC):**
```typescript
const result = await Result.tryCatchAsync(
  async () => { /* db operation */ },
  (e) => ({ code: "DB_ERROR" as const, message: "Failed to list dogs", cause: e }),
)

if (result.isErr()) throw result.error;
return result.value;
```

**Frontend (React Query + Toast):**
```typescript
const mutation = useMutation({
  ...api.dogs.admin.delete.mutationOptions(),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: api.dogs.admin.list.queryKey() });
    toast.success("Dog deleted successfully");
  },
  onError: (error) => {
    toast.error("Failed to delete dog", { description: error.message });
  },
});
```

### Database Patterns

**Use Drizzle ORM with schema definitions:**
```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const DogTable = sqliteTable("dogs", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status", { enum: ["available", "reserved", "sold"] }),
  // ...
});
```

**Use `Result` utility for error handling:**
- Wraps operations in Result type
- Provides consistent error structure
- See `@/utils/result.ts`

### Form Handling

**Use TanStack Form with Zod validation:**
```typescript
const form = useForm({
  defaultValues: { name: "", breed: "" },
  validators: {
    onChange: formSchema,
  },
  onSubmit: async ({ value }) => { ... }
});
```

### CSS and Styling

**Use Tailwind CSS v4 with CSS variables:**
- Never use arbitrary values (e.g., `bg-[#123456]`)
- Use semantic tokens: `bg-primary`, `text-muted-foreground`
- See `src/styles.css` for theme variables

**Class merging with `cn()`:**
```typescript
className={cn("base-classes", condition && "conditional-classes", className)}
```

### Additional Conventions

- **No comments** unless required for understanding complex logic
- **No console.log** - use server logger (`@/server/logger.ts`)
- **No inline styles** - use Tailwind classes
- **No magic numbers** - extract to constants
- **Single responsibility** - one component/route per file
- **Use functional components** - no class components
- **Use hooks** for all state and effects
- **No default exports** - named exports preferred

---

## Testing

This project does not have a test suite. When adding tests:
- Use Vitest for unit tests
- Place tests alongside source files with `.test.ts` or `.spec.ts` suffix
- Run single test: `vitest run --reporter=verbose path/to/test.test.ts`

---

## Key Dependencies

- **Framework**: TanStack Start (React Router v7 compatible)
- **Database**: Drizzle ORM with SQLite (Cloudflare D1)
- **API**: tRPC
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui with Base UI
- **Icons**: Lucide React
- **Validation**: Zod
- **Forms**: TanStack Form
- **Tables**: TanStack Table
- **Cloud**: Cloudflare Workers + R2
