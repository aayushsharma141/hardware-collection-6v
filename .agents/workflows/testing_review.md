<!-- generated-by: gsd-doc-writer -->
# Testing & Quality Assurance Review Workflow

**Trigger:** `/workflow testing_review`

## Purpose

Confirm both test tiers pass, that new or changed logic has tests, and that no test was
weakened to get a green run. Full details of the setup are in `docs/TESTING.md`.

## When to run

- Before every production release (feeds `production_readiness`).
- After any bug fix, and after changes to `src/lib/`, `src/content/` or `src/hooks/`.

## Inputs

- `vitest.config.mjs` — unit tests matching `src/**/*.test.{ts,tsx}`, Node environment,
  `@` aliased to `src/`.
- `playwright.config.ts` — specs in `tests/e2e/`, projects `chromium`, `mobile-pixel`,
  `mobile-iphone`; starts `npm run dev` on `http://localhost:3000`.
- The diff under review.

## Steps

1. **Unit tests.** Run `npm test`. All must pass. Unit tests sit in `__tests__/` folders
   next to the code they cover (for example `src/lib/leads/__tests__/schema.test.ts`).
2. **Architectural tests.** Confirm these still exist and pass, since they guard rules that
   lint and the type checker cannot see:
   - `src/lib/collections/__tests__/routeInventory.test.ts` — no links to `/collections/<slug>`.
   - `src/content/sanity/__tests__/schemaQueryParity.test.ts` and `slugUniqueness.test.ts`.
   - `src/content/fallback/__tests__/showroomTaxonomy.test.ts`.
3. **End-to-end.** Run `npm run test:e2e`. Specs: `mobile-journeys.spec.ts`,
   `motion-protocol.spec.ts`, `phase12-ui-polish.spec.ts`. Playwright does not run in CI,
   so this local run is the only check.
4. **Coverage of the change.** For each changed module in `src/lib/`, `src/content/` or
   `src/hooks/`, check that a matching test was added or updated. Bug fixes need a
   regression assertion. No coverage threshold is configured, so judge this from the diff.
5. **Weakened tests.** Look in the diff for deleted assertions, `.skip`, `.only`, loosened
   matchers, or a narrowed `include` in `vitest.config.mjs`. Any of these needs a stated reason.
6. **Fallback fixtures.** `src/content/fallback/` must stay shaped like the Sanity data it
   replaces; the parity and taxonomy tests in step 2 are the check.
7. **Static gates.** Run `npm run lint` and `npx tsc --noEmit`.

## Pass/fail criteria

- **MUST FIX:** any failing unit or e2e test; an assertion removed or skipped to hide a failure.
- **SHOULD FIX:** changed logic in `src/lib/` or `src/content/` with no test; a bug fix with
  no regression test.
- **COULD FIX:** extra e2e coverage for `/catalogues`.
- **IGNORED:** e2e failures caused only by Sanity being unreachable, provided the fallback
  content rendered.
- **Pass:** steps 1, 3 and 7 green and no MUST FIX items.

## Output

`docs/reviews/testing-YYYY-MM-DD.md` (create `docs/reviews/` on first run) with test
counts per tier, failing tests with file paths, and coverage gaps found in step 4.
