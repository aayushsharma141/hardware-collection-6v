<!-- generated-by: gsd-doc-writer -->
# Production Readiness & Release Review Workflow

**Trigger:** `/workflow production_readiness`

## Purpose

Decide whether the current commit can be released to production. The automated part is
`scripts/release-verification.ts`; this workflow wraps it with the manual checks the
script cannot make.

## When to run

Before merging to `main`. `.github/workflows/deploy.yml` deploys to Vercel production on
every push to `main`, so this review must happen before the merge, not after.

## Inputs

- A clean working tree on the release branch.
- `.env.local` with the variables listed in `docs/CONFIGURATION.md`.
- Latest reports in `docs/reviews/` from `security_review`, `performance_review`,
  `testing_review` and `product_governance_review`, if they have been run.

## Steps

1. **Release pipeline.** Run `npx tsx scripts/release-verification.ts` (`npx` fetches `tsx` on first use; it is not a declared dependency). Its six gates are
   all critical:

   | Gate | Check |
   |---|---|
   | GATE-01 | `npm run lint` |
   | GATE-02 | `npx tsc --noEmit` |
   | GATE-03 | `npm test` |
   | GATE-04 | `npm run build` |
   | GATE-05 | `npm audit --audit-level=critical` |
   | GATE-06 | evidence schema validation |

   It writes a bundle to `docs/evidence/` and updates `docs/evidence/latest-release.json`
   with `releaseDecision` `PROMOTE` or `HOLD`. Any failure aborts with `HOLD`.
2. **Evidence.** Run `npx tsx scripts/evidence-engine.ts --validate` (same on-demand `tsx`). Signing and
   verification are described in `docs/evidence/SIGNING.md`. A bundle may only record what
   the pipeline actually measured.
3. **CI parity.** Confirm the branch is green in `.github/workflows/ci.yml` (lint, type
   check, unit tests, `npm audit`, `scripts/checks/no-console-log.js`,
   `scripts/audit-dependencies.cjs`, build) and `.github/workflows/secret-scan.yml` (Gitleaks).
4. **End-to-end.** Run `npm run test:e2e`. Playwright is not part of the release pipeline
   or CI, so this run is the only browser-level check before release.
5. **Manual gates.** Confirm from the latest reviews, or check directly:
   - Performance: `PRODUCT.md` gates (LCP ≤ 2.5s, CLS ≤ 0.10, INP ≤ 200ms) — see `performance_review`.
   - Accessibility: keyboard operability with visible focus; reduced-motion path works.
   - Product: locked scope and content integrity — see `product_governance_review`.
   - Security: no MUST FIX items open — see `security_review`.
6. **Environment.** Confirm the production variables in `docs/CONFIGURATION.md` are set in
   the Vercel project. <!-- VERIFY: Vercel project environment variables are set for production -->
7. **Docs.** If behaviour changed, update the affected file in `docs/` (ARCHITECTURE,
   DEVELOPMENT, TESTING, CONFIGURATION, API, DEPLOYMENT) and, for scope or claims, `PRODUCT.md`.

## Pass/fail criteria

- **APPROVED FOR DEPLOYMENT:** `releaseDecision` is `PROMOTE`, evidence validates, CI is
  green, e2e passes, and no MUST FIX item is open in any review.
- **DEPLOYMENT BLOCKED:** any gate fails, `releaseDecision` is `HOLD`, or a MUST FIX item is open.

## Output

`docs/reviews/production-readiness-YYYY-MM-DD.md` (create `docs/reviews/` on first run)
with the commit SHA, the evidence ID from `docs/evidence/latest-release.json`, the result
of each step, and the verdict.
