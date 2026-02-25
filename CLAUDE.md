# CLAUDE.md

## Project Overview

vinciconcorsi.it — Quiz web app for Italian public administration exam preparation (Concorso Istruttore Amministrativo - Servizi Demografici). Single-user MVP focused on practicing multiple-choice questions organized by subject area.

## Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript (strict mode)
- **Database:** SQLite via Drizzle ORM (`better-sqlite3` for local dev)
- **UI:** Tailwind CSS + shadcn/ui
- **Package manager:** npm
- **Node:** 20+

## Project Structure

```
vinciconcorsi.it/
├── CLAUDE.md
├── docs/
│   └── specs.md                 # Functional specs — READ THIS FIRST
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Homepage: subject picker + start quiz
│   │   ├── quiz/
│   │   │   └── page.tsx         # Quiz in progress (client component)
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                  # shadcn/ui primitives
│   │   ├── subject-picker.tsx
│   │   ├── quiz-card.tsx
│   │   ├── quiz-progress.tsx
│   │   └── quiz-results.tsx
│   ├── db/
│   │   ├── index.ts             # DB connection
│   │   ├── schema.ts            # Drizzle schema
│   │   └── seed.ts              # Seed script (run manually)
│   ├── lib/
│   │   ├── actions.ts           # Server actions
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── drizzle/
│   └── migrations/
├── drizzle.config.ts
├── quiz.db                      # SQLite file (gitignored)
└── seed-data/
    └── questions.ts             # Question data array (added manually later)
```

## Coding Conventions

### General
- All code and comments in English. UI text in Italian.
- Use named exports, not default exports (exception: page.tsx and layout.tsx which Next.js requires as default).
- Prefer `const` over `let`. Never use `var`.
- Use early returns to reduce nesting.
- Keep files under 200 lines. Extract logic into separate modules when needed.

### TypeScript
- Strict mode enabled. No `any` types.
- Define shared types in `src/types/index.ts`.
- Use Drizzle's `InferSelectModel` for DB types.
- Prefer interfaces for object shapes, types for unions/utilities.

### React / Next.js
- Default to Server Components. Only add `"use client"` when needed (interactivity).
- Use Server Actions (in `src/lib/actions.ts`) for data fetching — no API routes for this MVP.
- Keep components small and focused. One component per file.
- Use URL search params (via `useSearchParams`) to pass quiz config from homepage to quiz page.
- State management: React `useState` and `useReducer` only. No external state libraries.

### Database
- All schema in `src/db/schema.ts`.
- Use Drizzle query builder, not raw SQL.
- Seed data lives in `seed-data/questions.ts` as a typed array.
- Seed script (`src/db/seed.ts`) is run via `npx tsx src/db/seed.ts`.

### Styling
- Tailwind utility classes only. No custom CSS (except globals.css for base styles).
- Use shadcn/ui components where available. Install them via `npx shadcn@latest add <component>`.
- Responsive: mobile-first. Test at 375px and 1024px widths.
- Support dark mode via Tailwind `dark:` variants and shadcn/ui theme toggle.
- Color palette for subjects defined in specs.md — use these consistently.

### File Naming
- Components: `kebab-case.tsx` (e.g., `quiz-card.tsx`)
- Utilities: `kebab-case.ts`
- Types: `index.ts` in `types/` folder
- DB files: descriptive names (`schema.ts`, `seed.ts`, `index.ts`)

## Development Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Generate Drizzle migration after schema changes
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit migrate

# Open Drizzle Studio (DB GUI)
npx drizzle-kit studio

# Run seed
npx tsx src/db/seed.ts

# Type check
npx tsc --noEmit
```

## Key Dependencies to Install

```bash
# Core
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3 tsx

# UI (after shadcn init)
npx shadcn@latest add button card checkbox badge progress radio-group
```

## Git & GitHub Conventions

- **Never add Claude Code attribution** to commit messages or PR descriptions. Do not include `Co-Authored-By: Claude` lines, "Generated with Claude Code" footers, or any other Claude/Anthropic branding in commits or PRs.

## Important Notes

- **Read `docs/specs.md` before writing any code.** It contains the complete functional specification, DB schema, UI behavior, and component details.
- **No seed data yet.** The `seed-data/questions.ts` file and `src/db/seed.ts` script should be scaffolded with the correct types and a few example questions (3-5), but the full question bank will be added manually later.
- **No authentication.** Single user, no login.
- **No API routes.** Use Server Actions for all data operations.
- **No session persistence.** Quiz state lives entirely in React state on the client. When the user leaves the page, progress is lost. This is intentional for MVP.
- Keep the app simple. When in doubt, choose the simpler approach.
