# Hardware Collection

Next.js 16 (App Router) web application for Hardware Collection Sakchi — an authorized architectural hardware showroom in Jamshedpur. Integrates Sanity CMS for catalog management and Prisma/PostgreSQL for lead capture.

## Development

```bash
npm run dev        # dev server at http://localhost:3000
npm run build      # production build
npm run lint       # ESLint 9
npx tsc --noEmit   # TypeScript check
npm test           # Vitest unit tests
npm run test:e2e   # Playwright browser tests (starts its own server)
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

**New to this codebase? Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).** It
explains how a request becomes a page, which folder new code belongs in, and
the content ownership rule below.

## Content ownership

**Sanity is the canonical content source.** The static tables in
`src/content/fallback/` are a resilience mechanism that keeps the site
rendering when Sanity is unreachable — not a second place to author content.
See [src/content/README.md](src/content/README.md).

## Repository Layout

```
src/app/        — routes, layouts and API handlers (a folder here is a URL)
src/components/ — React components, one folder per domain
src/content/    — all page content: sanity/ (canonical) + fallback/ (safety net)
src/hooks/      — reusable React state
src/lib/        — non-React logic: collections/, integrations/, browser/, motion/, leads/
src/types/      — TypeScript types shared across folders
tests/e2e/      — Playwright browser specs
scripts/        — developer utilities, CMS seed, DB tools
prisma/         — Prisma schema (Lead model)
docs/           — architecture notes, strategy, operations, evidence
```

Each of `src/components/`, `src/content/` and `src/lib/` carries its own
README describing what belongs inside it.

See [WORKSPACE_MAP.md](WORKSPACE_MAP.md) for the wider workspace.

## Agent & Workflow Guidance

See [CLAUDE.md](CLAUDE.md) for agent roles, quality rules, and script references.
