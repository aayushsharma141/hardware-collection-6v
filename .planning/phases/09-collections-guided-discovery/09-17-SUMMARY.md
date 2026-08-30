# Phase 9 Plan 17 Summary — Homepage & Footer Links Repointing

## Overview
Repointed ~60 hardcoded homepage and footer deep links away from the retired `?category=` and `?brand=` query parameters to the new unified route family (`/collections/[slug]`). Consolidated link target data into `src/data/home.ts` as the single source of truth, eliminating duplicate arrays in `src/components/home/CategoryDiscovery.tsx` and `src/components/home/ProductReel.tsx`. Updated `src/components/Footer.tsx` collection links to `/collections/[slug]` and converted footer brand links to consultation drawer triggers.

## Artifacts Modified
- `src/data/home.ts` — Established as single source of truth; repointed all `CATEGORY_FAMILIES` and `SIGNATURE_PIECES` hrefs to canonical space and category slugs.
- `src/components/home/CategoryDiscovery.tsx` — Removed local array, imported `CATEGORY_FAMILIES` from `@/data/home`.
- `src/components/home/ProductReel.tsx` — Removed local array, imported `SIGNATURE_PIECES` from `@/data/home`.
- `src/components/Footer.tsx` — Repointed `SPECIMEN_CATEGORIES` to `/collections/[slug]`, converted brand links to consultation drawer triggers.
- `src/components/consultation/ConsultationContext.ts` — Added `"footer"` to `ConsultationContext.source` union.

## Verification
- `npx vitest run src/data/__tests__/homeLinks.test.ts` — Turned **GREEN** (2/2 passed).
- Entire test suite: **64/64 tests passing** across 11 test files (100% pass rate).
- Site-wide grep across `src/`: **0** occurrences of `?category=` or `?brand=`.
- `npm run build` — 36 static pages SSG pre-rendered in 1.50s with zero errors.
- Live HTTP verification: All 11 distinct link targets returned HTTP 200 OK.
