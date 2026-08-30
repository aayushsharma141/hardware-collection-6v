# Phase 9 Plan 14 Summary — Canonical Roster Repointing & Dead Code Removal

## Overview
Repointed `BrandTrustStrip.tsx` to dynamically derive both lanes from `CANONICAL_BRANDS` (`src/data/brands.ts`) and dynamically export `AUTHORIZED_BRAND_COUNT`. Repointed JSON-LD in `src/app/layout.tsx` to emit structured data from the canonical roster. Removed references to non-hardware brands (Jaquar, Asian Paints, Philips) site-wide. Deleted obsolete components `src/components/home/BrandStrip.tsx` and `src/components/home/InteractiveBrandWall.tsx`.

## Artifacts Created / Modified
- `src/components/BrandTrustStrip.tsx` — Repointed to `CANONICAL_BRANDS`, balanced 2-lane split.
- `src/app/layout.tsx` — Emits `HomeGoodsStore` JSON-LD with canonical brand roster.
- `src/components/ShowroomExperience.tsx` — Cleaned hardcoded brand string.
- `src/components/home/BrandStrip.tsx` — Deleted.
- `src/components/home/InteractiveBrandWall.tsx` — Deleted.

## Verification
- `npx vitest run src/data/__tests__/brands.test.ts` — 3/3 passed
- Zero non-hardware brand occurrences in non-test source files
- `npm run build` — exited 0
- `npx tsc --noEmit` — 0 errors
