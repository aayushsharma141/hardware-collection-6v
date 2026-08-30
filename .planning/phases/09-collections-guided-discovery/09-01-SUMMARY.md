---
phase: 09-collections-guided-discovery
plan: 01
subsystem: testing
tags: [vitest, wcag-contrast, test-scaffold, regression-guard]

# Dependency graph
requires: []
provides:
  - "src/data/__tests__/brands.test.ts — canonical brand roster consistency guard (D-05/D-07/D-26), red today (Hettich/Kich missing from BRANDS), owned green by 09-04"
  - "src/data/__tests__/homeLinks.test.ts — homepage href route-format guard (D-25/F-05), red today (all hrefs are ?category= query strings), owned green by 09-17"
  - "src/lib/__tests__/contrast.test.ts — self-contained WCAG relative-luminance contrast calculator, green today, proves the UI-SPEC color table"
  - "filterProductsWithKeywords in catalogFiltering.test.ts — searchKeywords[]-aware matcher reference for 09-09 (D-14)"
  - "resolveProductDisplayImage in useCollectionsState.test.ts — image resolution chain reference for 09-09 (D-12)"
affects: [09-04-brand-roster, 09-09-collections-state-hook, 09-17-homepage-link-repoint]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pure-function-in-test-file convention: reference implementations for future production logic (filterProductsWithKeywords, resolveProductDisplayImage, contrast math) live directly in the .test.ts file, exported for reuse, with zero production imports beyond static data modules."
    - "Inline literal fixtures for anticipated-but-not-yet-coded data (ANTICIPATED_SPACE_SLUGS) rather than importing a not-yet-existing module — keeps Vitest collection safe."

key-files:
  created:
    - src/data/__tests__/brands.test.ts
    - src/data/__tests__/homeLinks.test.ts
    - src/lib/__tests__/contrast.test.ts
  modified:
    - src/lib/__tests__/catalogFiltering.test.ts
    - src/hooks/__tests__/useCollectionsState.test.ts

key-decisions:
  - "Left the three new tests intentionally red where the plan specifies (brands.test.ts, homeLinks.test.ts one case) — did not weaken assertions to force green, per the plan's explicit prohibition."
  - "Reworded an inline comment referencing '/cinema/categories/*.png' to avoid a false-positive on the plan's own grep-based regression check for reintroduced hardcoded PNG paths."

patterns-established:
  - "Pattern 1: New content-integrity test files import only @/data/catalog, @/data/home, @/types/catalog — never a not-yet-created module — to keep Vitest collection from erroring out across the whole suite."
  - "Pattern 2: Reference pure functions for future hook logic (D-12, D-14) are written and tested in isolation inside the existing test file before being wired into production code by a later plan."

requirements-completed: []

# Metrics
duration: 12min
completed: 2026-08-30
---

# Phase 9 Plan 01: Wave 0 Test Scaffolds Summary

**Three new content-integrity Vitest suites (brand roster, homepage link routes, WCAG contrast) plus two extended suites with D-14/D-12 pure-function references — zero production code touched.**

## Performance

- **Duration:** 12 min
- **Started:** 2026-08-30T05:24:00Z
- **Completed:** 2026-08-30T05:36:00Z
- **Tasks:** 2
- **Files modified:** 5 (3 created, 2 extended)

## Accomplishments
- `contrast.test.ts` implements WCAG 2.x relative-luminance contrast math from scratch and proves all 8 UI-SPEC color pairs clear AA, plus proves the documented bone-on-brass failure (1.76:1) is caught as a failure — all 9 assertions green immediately.
- `brands.test.ts` and `homeLinks.test.ts` encode the correct end state for the brand roster (D-05/D-07/D-26) and homepage routing (D-25/F-05) and fail today for exactly the documented, expected reasons.
- `filterProductsWithKeywords` and `resolveProductDisplayImage` give 09-09 tested, ready-to-wire reference implementations for D-14 (search keywords) and D-12 (image fallback chain).

## Task Commits

Each task was committed atomically:

1. **Task 1: Create brand-roster, home-link and contrast test scaffolds** - `0502728` (test)
2. **Task 2: Extend catalogFiltering and useCollectionsState suites with D-14/D-12 pure references** - `fdb1a3b` (test)

**Plan metadata:** (not yet committed — orchestrator owns STATE.md/ROADMAP.md updates per plan instructions)

## Files Created/Modified
- `src/data/__tests__/brands.test.ts` - Asserts every brand referenced in `CATEGORIES.brands`/`PRODUCTS.brand` exists in `BRANDS`; asserts non-hardware brands (Jaquar/Asian Paints/Philips) are absent; asserts a 20+ brand floor.
- `src/data/__tests__/homeLinks.test.ts` - Asserts every `CATEGORY_FAMILIES`/`SIGNATURE_PIECES` href is a real `/collections/[slug]` route (not a query string), and that any such route's slug resolves to a known category or anticipated space slug.
- `src/lib/__tests__/contrast.test.ts` - Self-contained `hexToRgb`/`channelToLinear`/`relativeLuminance`/`contrastRatio` implementation; asserts all 8 UI-SPEC pairs meet AA and match measured ratios; asserts the bone-on-brass prohibited pair fails at 1.76:1.
- `src/lib/__tests__/catalogFiltering.test.ts` - Added `filterProductsWithKeywords` (extends the existing substring matcher with a `searchKeywords[]` OR clause) and a `describe("Search keyword matching (D-14)")` block with 3 new passing tests; the original 6 tests are untouched.
- `src/hooks/__tests__/useCollectionsState.test.ts` - Added `resolveProductDisplayImage` (the `product.imageUrl -> category.imageUrl -> settings.defaultCategoryImageUrl -> ""` chain) and a `describe("Product display image resolution chain (D-12)")` block with 4 new passing tests; the original 2 tests are untouched.

## Decisions Made
- Kept `brands.test.ts`/`homeLinks.test.ts` failing exactly where the plan specifies — no test weakening, no `.skip`/`.todo`, no softened expectations.
- Renamed a comment string from `/cinema/categories/*.png` to a generic "hardcoded PNG fallback map" to satisfy the plan's `grep -c "cinema/categories"` acceptance check (which is meant to catch a reintroduced hardcoded asset path, not prose referencing the pattern by name).

## Deviations from Plan

None — plan executed exactly as written. The one edit beyond the plan's literal text (the comment rewording above) is a same-task correction to meet the plan's own stated acceptance criterion, not new scope.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- 09-04 has a concrete, provable red bar for the brand roster reconciliation (missing Hettich/Kich; must also avoid reintroducing Jaquar/Asian Paints/Philips).
- 09-17 has a concrete, provable red bar for homepage link repointing to real `/collections/[slug]` routes.
- 09-09 has two tested pure-function references (`filterProductsWithKeywords`, `resolveProductDisplayImage`) ready to fold into the real `useCollectionsState.ts`.
- No blockers.

---
*Phase: 09-collections-guided-discovery*
*Completed: 2026-08-30*

## Self-Check: PASSED

All 5 modified/created files confirmed present on disk; both task commits (`0502728`, `fdb1a3b`) confirmed present in git log.
