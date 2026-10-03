---
description: Comprehensive Website Engineering & Infrastructure Audit
---
<!-- generated-by: gsd-doc-writer -->

# Audit Workflow

**Purpose:** Run a full-repository audit by combining the automated release gate with the focused review workflows, and record measured results only.

---

## When to run

- Before a production release, or after a large merge to `main`.
- When asked for a whole-site health check.

## Inputs

- The current branch, with `npm ci` (or `npm install`) already run.
- `docs/ARCHITECTURE.md`, `docs/TESTING.md`, `docs/API.md`, `docs/CONFIGURATION.md`, `docs/DEPLOYMENT.md`.
- `.github/workflows/` (`ci.yml`, `deploy.yml`, `security.yml`, `secret-scan.yml`, `key-rotation-reminder.yml`).

## Steps

1. **Automated gate.** Run `npx tsx scripts/release-verification.ts` (`tsx` is not a declared dependency; `npx` downloads it on first use). It runs six critical gates in order: `npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`, `npm audit --audit-level=critical`, and evidence schema validation (`scripts/evidence-engine.ts`). Record each gate's pass/fail. A single failure means the release decision is `HOLD`.
2. **CI-only checks.** Run the two checks CI adds on top: `node scripts/checks/no-console-log.js` and `node scripts/audit-dependencies.cjs`. The second is a legacy design-token and import audit, not a CVE scan.
3. **Browser tier.** Run `npm run test:e2e`. Playwright runs `tests/e2e/` on desktop Chrome, Pixel 7 and iPhone 14.
4. **Focused reviews.** Run these workflows and link their reports:
   - `architecture_review` for structure and content ownership
   - `engineering_governance_review` for type safety and code quality
   - `dependency_review` for packages and CVEs
   - `accessibility_review` for WCAG checks
   - `analytics_review` for dataLayer events and privacy
   - `browser_pov_audit` for the visitor's view of each route
5. **Backend.** Read `docs/API.md` and check that each API route (under `src/app/api/`) validates its input, and that `POST /api/leads` keeps its Upstash rate limit and Zod validation (`src/lib/leads/schema.ts`). Lead persistence uses the single Prisma `Lead` model in `prisma/schema.prisma`.
6. **SEO.** Each public route exports `metadata` or `generateMetadata`. `src/app/sitemap.ts` and `src/app/robots.ts` list the right routes, `/studio` is not indexed, and JSON-LD stays valid in `src/app/layout.tsx`, `src/app/collections/page.tsx` and `src/components/home/FaqSection.tsx`.
7. **Security.** Confirm `secret-scan.yml` and `security.yml` are green on the latest `main` run (`gh run list`). No secrets in source; environment variables are documented in `docs/CONFIGURATION.md`.

## Pass/fail criteria

- **Fail (`HOLD`):** any release-verification gate fails, any e2e spec fails, or any focused review reports a MUST FIX item.
- **Pass (`GO`):** all gates and specs pass and no MUST FIX items remain. SHOULD FIX items are listed but don't block.

Report only what a command or check actually observed. Never record a result for a step that wasn't run. Evidence bundles in `docs/evidence/` are signed and must reflect real pipeline output only.

## Output

Write `docs/reviews/audit-YYYY-MM-DD.md`. The `docs/reviews/` folder doesn't exist yet; create it on the first run. Include the gate results table, links to each focused review report, the `GO` or `HOLD` decision, and a short list of follow-ups ranked by impact.
