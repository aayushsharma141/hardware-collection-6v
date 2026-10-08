# AGENTS.md — Hardware Collection

Canonical instructions for AI agents working on this repository.

## Quick Reference

| Task | Command |
|---|---|
| Dev server | `npm run dev` (port 3000) |
| Production build | `npm run build` (runs `prebuild` first) |
| Lint | `npm run lint` |
| Type check | `npx tsc --noEmit` (no npm script) |
| Unit tests | `npm test` (Vitest, `src/**/*.test.{ts,tsx}`) |
| E2E tests | `npm run test:e2e` (Playwright, needs `npx playwright install chromium webkit` first) |
| Full release gate | `npx tsx scripts/release-verification.ts` (6 gates) |
| Dependency audit | `npm audit --audit-level=critical` |

## Architecture Constraints (Locked — Do Not Redesign)

**Two-route architecture only:**
```
/           → homepage
/collections → full showroom catalogue (single page)
```

**Five showroom families are in-page sections, not routes:**
```
/collections
  ├── #handles-knobs
  ├── #door-hardware
  ├── #bathroom
  ├── #kitchen-wardrobes
  └── #furniture-hardware
```

**Never create `/collections/<slug>` as a route.** Any such URL is a legacy redirect (308 → anchor or `/collections`).

**Grouping is driven exclusively by `primaryRail`:**
```
product.categorySlug → category.primaryRail → showroom family
```
Owned by `src/lib/collections/showroom.ts`. To move a category between families, edit its `primaryRail` in Sanity Studio — no code change.

**Frozen decisions:**
| Decision | Reason |
|---|---|
| Two-route architecture | Tested and verified |
| `primaryRail` as sole input | Business taxonomy lives in CMS |
| 13 CMS categories as discovery vocabulary | Sub-categories are filters, not routes |
| Product Detail Drawer | Correct interaction model |
| WhatsApp as selection endpoint | Owner decision |
| `featured` field controls sort order only | No layout branching |
| Empty families hidden | Prevents headings over nothing |
| Density-responsive sections (1/2–4/5+) | Content maturity drives layout |

## Content Ownership Rule

**Sanity is the canonical content source.** `src/content/fallback/` is a resilience mechanism that keeps the site rendering when Sanity is unreachable — **never author content there**.

If you find yourself editing `content/fallback/` to change what the site says, stop. That change belongs in Sanity (edited at `/studio`).

## Repository Layout

```
src/app/        — routes, layouts, API handlers (file-based routing)
src/components/ — React components, one folder per domain (no loose files)
src/content/    — all page content: sanity/ (canonical) + fallback/ (safety net)
src/hooks/      — reusable React state (client-side only)
src/lib/        — non-React logic: collections/, catalog/, integrations/, browser/, motion/, leads/
src/types/      — shared TypeScript types
tests/e2e/      — Playwright browser specs
scripts/        — developer utilities, CMS seed, DB tools
prisma/         — Prisma schema (Lead model only)
docs/           — architecture, strategy, operations, evidence
```

Each of `src/components/`, `src/content/` and `src/lib/` has its own README describing what belongs inside.

**Retired files live in `_quarantine/`** (excluded from lint, type-checking, and search). Raw brand catalogues and photo originals are kept outside the repo at `E:\Hardware-Collection-Archive`.

## Content Flow

```
Route (src/app/<segment>/page.tsx)
  ↓
Page / Server Component
  ↓
Feature Component (src/components/<domain>/)
  ↓
Content Adapter (lib/collections/catalogue.ts: mergeProducts, mergeCategories)
  ↓
Sanity (src/content/sanity/) → fallback only if explicitly required
```

**Known gaps:**
- Content adapter is partly a module; some routes still merge inline differently
- Sanity failures are silent (catch returns `[]`/`null`); no visible outage signal
- `app/page.tsx` hardcodes `fallbackHeroSlides` inline — should move to `content/fallback/` then Sanity

## Request Lifecycle

```
Browser request
  ↓
src/app/layout.tsx          (root shell — Navbar, providers; Footer per page)
  ↓
src/app/<segment>/page.tsx  (Server Component; fetches and merges content)
  ↓
*Client.tsx                 (client boundary where interactivity is needed)
  ↓
src/components/<domain>/    (presentation)
```

Lead capture: consultation form → `app/api/leads/` → `lib/leads/` (validate, persist via Prisma, notify via Telegram/email).

## Environment Variables

**Fail at startup/import:**
- `NEXT_PUBLIC_SANITY_PROJECT_ID` (throws if not `test`)
- `NEXT_PUBLIC_SANITY_DATASET` (throws if not `test`)

**Fail when feature runs:**
- `DATABASE_URL` — `/api/leads` fails
- `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` — lead saves, telegram_status: "failed"
- `RESEND_API_KEY` / `STAFF_EMAIL` — lead saves, email notification: "failed"
- `SANITY_REVALIDATE_SECRET` — webhook rejected
- `EVIDENCE_PRIVATE_KEY` — CI evidence engine throws if `CI` set

**Degrade gracefully:**
- `SANITY_API_TOKEN` missing → renders from `content/fallback/`
- `UPSTASH_REDIS_REST_*` missing → `/api/leads` runs without rate limiting (5 req/min/IP when both set)
- `prebuild` skips catalog index if Sanity not configured (logs and continues)

**Minimal local `.env.local`:**
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=
SANITY_REVALIDATE_SECRET=
DATABASE_URL=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
# Optional
RESEND_API_KEY=
STAFF_EMAIL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_SHOWROOM_MAP_URL=
```

## Testing

| Tier | Framework | Location | Command | Needs server |
|---|---|---|---|---|
| Unit | Vitest 4 | `src/**/*.test.{ts,tsx}` | `npm test` | No |
| E2E | Playwright 1.50 | `tests/e2e/*.spec.ts` | `npm run test:e2e` | Yes (starts dev server) |

**Unit test conventions:**
- Colocate with code: `__tests__/` folder next to subject (e.g., `src/lib/collections/__tests__/`)
- Import `describe`, `it`, `expect` from `"vitest"` explicitly (no globals)
- No shared helpers or setup files — each test builds its own inputs
- Environment: `node` (no jsdom/happy-dom); stub browser globals if needed

**Architectural guard tests (scan source, fail CI on class of bug):**
- `routeInventory.test.ts` — fails if any file links to `/collections/<slug>`
- `schemaQueryParity.test.ts` — every GROQ field must exist on Sanity schema type

**E2E tests do not run in CI.** Run locally before merging UI changes.

## CI Pipeline (`.github/workflows/ci.yml`)

Three jobs on every push:
1. **Lint & Type Check** — `npm run lint` + `npx tsc --noEmit`
2. **Quality Gates** — `npm test` + `npm audit --audit-level=critical` + `no-console-log` check + migration audit
3. **Build** — only on `main` and PRs to `main`; uses hardcoded Sanity project ID, no token (falls back to `content/fallback/`)

**Security workflows** run on PRs to `main`: `security.yml` + `secret-scan.yml` (Gitleaks).

## Release Pipeline (`scripts/release-verification.ts`)

Six critical gates (all must pass):
1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm test`
4. `npm run build`
5. `npm audit --audit-level=critical`
6. Evidence schema validation (`npx tsx scripts/evidence-engine.ts --validate`)

Failure aborts pipeline and records a `HOLD` decision. Evidence bundles in `docs/evidence/` are Ed25519-signed.

## Branch & PR Conventions

- Default branch: `main` (push to `main` deploys to production automatically via Vercel)
- Branch pattern: `<type>/<short-description>` (e.g., `feat/collections-family-index`, `refactor/structure-legibility`)
- Commit style: Conventional Commits with optional scope (`feat(collections): …`, `fix(redirects): …`, `chore: …`)
- **Make changes on a branch**, not directly on `main`
- Before PR: run `npm run lint`, `npx tsc --noEmit`, `npm test` locally; if layout/navigation/motion changed, also `npm run test:e2e`
- No PR template or CONTRIBUTING.md exists

## Multi-Agent System (`.agents/`)

```
.agents/
├── AGENTS.md              # workspace scoping & boundaries
├── registry.yaml          # agent & workflow registry
├── agents/
│   ├── planner.md         # sprint & task roadmap
│   ├── architect.md       # system architecture, schema, ADRs
│   └── reviewer.md        # quality audit, security, refactoring
└── workflows/             # 13 workflow agents (accessibility, analytics, architecture, audit, browser, dependency, engineering, graphify, performance, product, production, security, testing)
```

Orchestrators handle intake → mission-planner → decision-engine → planner → execution-planner → scheduler → reviewer → release-manager → rollback-manager.

## Key Scripts (`scripts/`)

| Script | Purpose |
|---|---|
| `sync-pdfjs-assets.mjs` | Copies pdf.js runtime assets to `public/` (runs in `postinstall` and `prebuild --check`) |
| `build-catalog-index.mjs` | Builds per-catalogue search indexes for catalogue viewer |
| `evidence-engine.ts` | Evidence platform validation (signs/validates bundles) |
| `release-verification.ts` | Full release quality gate (6 gates) |
| `audit-dependencies.cjs` | Legacy design-token / button.tsx import audit (NOT a CVE scanner) |
| `checks/no-console-log.js` | Fails on `console.log` in `src/` (`warn`/`error` allowed) |
| `cms/seed.mjs` | Seeds Sanity from fallback content |
| `seed-truth.ts` | Seeds site settings, home page, brand data |

## Technology Stack

- **Framework**: Next.js 16 / React 19 (App Router)
- **CMS**: Sanity CMS — embedded Studio at `/studio` (`next-sanity`, `@sanity/vision`)
- **Database**: PostgreSQL via Prisma (`@prisma/client`, `pg`) — Lead model only
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **Language**: TypeScript 5 (strict, `@/*` path alias)
- **Deployment**: Vercel (auto-deploy on push to `main`)
- **Icons**: `lucide-react`
- **Motion**: `gsap`, `motion`, `lenis`, `@gsap/react`

## Code Style

- **ESLint 9** (flat config `eslint.config.mjs`): extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`. Ignores `scripts/**`, `public/**`, `_quarantine/**`, `.claude/**`, build output.
- **TypeScript strict mode** — check with `npx tsc --noEmit`
- **No `console.log` in `src/`** — enforced by `scripts/checks/no-console-log.js` in CI (known issue: `src/lib/logger.ts` currently calls `console.log`)
- **No formatter enforced** (no Prettier/Biome/.editorconfig) — match style of file you're editing
- **Tailwind v4** — VS Code CSS validator disabled in `.vscode/settings.json` (doesn't recognize `@theme`)

## Git Hooks

`.husky/pre-commit` runs `npm run typecheck` (no such script) then `npx lint-staged`. Husky/lint-staged not in `package.json`; hook fails if active. **Run `npm run lint` and `npx tsc --noEmit` yourself before committing.**

## Common Gotchas

1. **`npx tsc --noEmit` has no npm script** — run directly
2. **E2E tests need browser binaries** — run `npx playwright install chromium webkit` once
3. **`scripts/audit-dependencies.cjs` is NOT a CVE scanner** — it scans for legacy `ui/primitives/button` imports and `var(--site-*)` tokens
4. **No `engines` field or `.nvmrc`** — CI uses Node 20.x; match locally
5. **`tsx` not a declared dependency** — `npx tsx` fetches on demand (needs network first run)
6. **Sanity Vision tool** only loads when `NODE_ENV === "development"`
7. **`/api/seed` disabled in production** (returns 403 when `NODE_ENV=production`)
8. **`src/lib/config.ts` has hardcoded showroom constants** (phone, WhatsApp, address, hours, trust stats)

## Reference Documents

- `docs/ARCHITECTURE.md` — request lifecycle, folder rules, content flow
- `docs/DEVELOPMENT.md` — local setup, build commands, code style, branch/PR process
- `docs/TESTING.md` — test conventions, running single files, CI integration
- `docs/CONFIGURATION.md` — full env var table, config files, per-environment behavior
- `docs/DEPLOYMENT.md` — deploy flow, Vercel, evidence bundles
- `CLAUDE.md` — agent roles, quality rules, script references, evidence platform
- `.agents/AGENTS.md` + `.agents/registry.yaml` — multi-agent registry and workspace boundaries