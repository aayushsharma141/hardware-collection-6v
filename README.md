# Hardware Collection

Next.js 16 (App Router) web application for Hardware Collection Sakchi — an authorized architectural hardware showroom in Jamshedpur. Integrates Sanity CMS for catalog management and Prisma/PostgreSQL for lead capture.

## Development

```bash
npm run dev        # dev server at http://localhost:3000
npm run build      # production build
npm run lint       # ESLint 9
npx tsc --noEmit   # TypeScript check
npm test           # Vitest unit tests
```

## Architecture

| Layer | Technology |
|---|---|
| Framework | Next.js 16 / React 19 (App Router) |
| CMS | Sanity CMS — embedded Studio at `/studio` |
| Database | PostgreSQL via Prisma (lead capture) |
| Styling | Tailwind CSS v4 |
| Language | TypeScript 5 |
| Deployment | Vercel |

## Repository Layout

See [WORKSPACE_MAP.md](WORKSPACE_MAP.md) for the full directory structure.

Key directories:

```
src/app/           — Next.js App Router pages and API routes
src/components/    — Shared UI components
src/hooks/         — Custom React hooks (useCollectionsState, useScrollLock, …)
src/lib/           — Server utilities (leads, sanity client, scroll lock)
src/content/sanity/ — Sanity schema definitions and config (canonical source)
src/types/         — Shared TypeScript types (catalog, etc.)
scripts/           — Developer utilities, CMS seed, DB tools
prisma/            — Prisma schema (Lead model)
```

## Agent & Workflow Guidance

See [CLAUDE.md](CLAUDE.md) for agent roles, quality rules, and script references.
