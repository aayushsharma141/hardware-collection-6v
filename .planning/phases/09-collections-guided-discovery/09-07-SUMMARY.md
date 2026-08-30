# Phase 9 Plan 07 Summary — GROQ Queries & Route Resolution

## Overview
Added the read-side data layer for the unified `/collections/[slug]` route family: single-category lookup, single-space lookup, spaces list, slug lists for static param generation, and live published category/brand counts. Added `resolveCollectionSlug` in `src/lib/collectionRouting.ts` to implement D-24 space-then-category precedence.

## Artifacts Created / Modified
- `src/types/catalog.ts` — Exported `Space` interface and extended `Category` with `heroImageUrl`, `heroImageLqip`, `galleryUrls`, `searchKeywords`, `status`, `brandRefs`, `displayOrder`.
- `src/sanity/queries.ts` — Added parameterized `getCategoryBySlugQuery` / `getCategoryBySlug`, `getSpaceBySlugQuery` / `getSpaceBySlug`, `getSpacesQuery` / `getSpaces`, `getCategorySlugsQuery` / `getCategorySlugs`, `getSpaceSlugsQuery` / `getSpaceSlugs`, and `getCollectionCountsQuery` / `getCollectionCounts`.
- `src/lib/collectionRouting.ts` — Exported `CollectionRouteResult` and async `resolveCollectionSlug` implementing D-24 precedence with single-category space bypass.

## Verification
- `npx tsc --noEmit` — 0 errors
- `npx vitest run src/lib/__tests__/collectionRouting.test.ts` — 6/6 passed
- GROQ security check — `$slug` is strictly passed as parameter object, zero template literal interpolation.
