---
phase: 09-collections-guided-discovery
plan: 02
subsystem: lib
tags: [vitest, typescript, sanity, routing, tiering, slug-validation, pure-functions]

# Dependency graph
requires: []
provides:
  - "resolveCollectionRoute() — D-24 space-then-category slug precedence resolver"
  - "selectFeaturedChapters() + FEATURED_CHAPTER_CAP — D-03 featured-chapter hard cap"
  - "findSlugCollisions() / isSlugAvailable() / isReservedSlug() / RESERVED_SLUGS — D-27 + Pitfall 5 cross-type slug uniqueness"
affects: [09-05, 09-07, 09-11, 09-15]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pure, framework-free logic modules with co-located Vitest tests, exported for later wave consumption (no premature production wiring)"
    - "Discriminated union return types for multi-outcome resolvers (CollectionRouteResult)"

key-files:
  created:
    - src/lib/collectionRouting.ts
    - src/lib/__tests__/collectionRouting.test.ts
    - src/lib/collectionTiers.ts
    - src/components/collections/__tests__/FeaturedChapters.test.ts
    - src/sanity/lib/slugUniqueness.ts
    - src/sanity/__tests__/slugUniqueness.test.ts
  modified: []

key-decisions:
  - "D-03's 3-5 range is enforced as an upper bound only (5); no minimum-padding branch was added since there is no sane way to synthesize a missing 3rd featured chapter"
  - "findSlugCollisions() is deliberately not scoped by document type, since D-27 requires uniqueness across both space and category types sharing one URL namespace"

patterns-established:
  - "Wave 0 inverted TDD: module and test are authored together and land green immediately, rather than red-then-green across separate plans"

requirements-completed: []

# Metrics
duration: 25min
completed: 2026-08-30
---

# Phase 9 Plan 02: Collection Routing, Tiering & Slug Uniqueness Modules Summary

**Three framework-free logic modules (route resolution, featured-chapter capping, cross-type slug uniqueness) each landed with a co-located Vitest suite, all green on first run.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-08-30T05:15:00Z (approx)
- **Completed:** 2026-08-30T05:39:34Z
- **Tasks:** 3 completed
- **Files modified:** 6 created

## Accomplishments
- `resolveCollectionRoute()` encodes D-24's space-then-category precedence, including the single-vs-multi `linkedCategories` branch, in a fully typed discriminated union
- `selectFeaturedChapters()` enforces D-03's hard cap of 5 featured chapters without ever padding toward a minimum
- `findSlugCollisions()` / `isSlugAvailable()` / `isReservedSlug()` implement D-27's cross-type uniqueness requirement plus RESEARCH.md's Pitfall 5 reserved-slug guard for `"spaces"`

## Task Commits

Each task was committed atomically:

1. **Task 1: collectionRouting.ts — space-then-category slug resolver** - `571a43e` (feat)
2. **Task 2: collectionTiers.ts — featured-chapter hard cap** - `b8cf6d2` (feat)
3. **Task 3: slugUniqueness.ts — cross-type collision detection + reserved-slug guard** - `483c14a` (feat)

_All three tasks were pure module+test pairs authored together (Wave 0 inverted TDD) — no separate RED commit, since the test only ever existed alongside a passing implementation._

## Files Created/Modified
- `src/lib/collectionRouting.ts` - `resolveCollectionRoute()`, `SpaceRef`, `CategoryRef`, `CollectionRouteResult` — D-24 route precedence
- `src/lib/__tests__/collectionRouting.test.ts` - six cases covering all `CollectionRouteResult` branches and precedence
- `src/lib/collectionTiers.ts` - `selectFeaturedChapters()`, `FEATURED_CHAPTER_CAP`, `FeaturableItem` — D-03 hard cap
- `src/components/collections/__tests__/FeaturedChapters.test.ts` - five cases: over-flag cap, exclusion, under-flag no-pad, empty, missing-displayOrder sort
- `src/sanity/lib/slugUniqueness.ts` - `findSlugCollisions()`, `isSlugAvailable()`, `isReservedSlug()`, `RESERVED_SLUGS`, `SlugDoc` — D-27 + Pitfall 5
- `src/sanity/__tests__/slugUniqueness.test.ts` - five cases: pairwise collision, no-collision, 3+ way collision, self-edit exemption, reserved-slug guard

## Exported Signatures (for later plans)

```ts
// src/lib/collectionRouting.ts
export interface CategoryRef { slug: string }
export interface SpaceRef { slug: string; linkedCategories: CategoryRef[] }
export type CollectionRouteResult =
  | { kind: "category"; categorySlug: string }
  | { kind: "space"; spaceSlug: string }
  | { kind: "not-found" };
export function resolveCollectionRoute(
  requestedSlug: string, spaces: SpaceRef[], categorySlugs: string[]
): CollectionRouteResult;

// src/lib/collectionTiers.ts
export interface FeaturableItem { slug: string; featured?: boolean; displayOrder?: number }
export const FEATURED_CHAPTER_CAP = 5;
export function selectFeaturedChapters<T extends FeaturableItem>(items: T[]): T[];

// src/sanity/lib/slugUniqueness.ts
export interface SlugDoc { id: string; type: string; slug: string }
export const RESERVED_SLUGS = ["spaces"];
export function isReservedSlug(slug: string): boolean;
export function findSlugCollisions(docs: SlugDoc[]): SlugDoc[][];
export function isSlugAvailable(slug: string, currentId: string, existingDocs: SlugDoc[]): boolean;
```

## Deviations from Plan

### Auto-fixed Issues

None affecting shipped code. During initial verification one of my own test assertions in
`FeaturedChapters.test.ts` (Task 2) asserted the wrong expected ascending order for the "caps at 5"
case — this was a test-authoring error, not an implementation bug (the implementation's ascending
sort was correct). Fixed the assertion inline before the task's commit; no separate commit was
needed since this was caught pre-commit during verification.

## Known Stubs

None. All three modules are complete, fully typed implementations — no placeholder logic, no empty
data flows. Per this plan's explicit scope, no production consumer wires to them yet (that is Wave
1+ work for 09-05, 09-07, 09-11).

## Threat Flags

None. Confirmed against the plan's `<threat_model>`: all three modules remain pure functions over
already-fetched, already-parameterized in-memory data, with no GROQ query construction, no
`client.fetch()` call, and no I/O introduced.

## Verification Results

- `npx vitest run src/lib/__tests__/collectionRouting.test.ts src/components/collections/__tests__/FeaturedChapters.test.ts src/sanity/__tests__/slugUniqueness.test.ts` — 3 files, 16 tests, all passed.
- `npx tsc --noEmit` — exits 0, no errors.
- `npm run lint` — no new violations in files this plan created; 1 pre-existing error and 22 pre-existing warnings in unrelated files, out of scope per the plan's scope boundary.
- `npm test` (full suite) — 9 of 11 test files passed (62 of 64 tests). The two expected failures,
  `src/data/__tests__/brands.test.ts` and `src/data/__tests__/homeLinks.test.ts`, are the
  deliberately-red scaffolds from plan 09-01 awaiting later-wave implementation (09-04, 09-17) — not
  regressed, not touched by this plan.

## Self-Check: PASSED

- FOUND: src/lib/collectionRouting.ts
- FOUND: src/lib/__tests__/collectionRouting.test.ts
- FOUND: src/lib/collectionTiers.ts
- FOUND: src/components/collections/__tests__/FeaturedChapters.test.ts
- FOUND: src/sanity/lib/slugUniqueness.ts
- FOUND: src/sanity/__tests__/slugUniqueness.test.ts
- FOUND: 571a43e (git log)
- FOUND: b8cf6d2 (git log)
- FOUND: 483c14a (git log)
