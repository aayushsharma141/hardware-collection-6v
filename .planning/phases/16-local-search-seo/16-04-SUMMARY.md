# Plan 16-04: Rich HardwareStore Schema Graph & Release Verification - Summary

**Executed:** 2026-10-09
**Status:** Complete
**Commit:** `45697c1`

---

## 1. What was built

- **Rich `HardwareStore` Schema Graph (`src/app/layout.tsx`)**:
  - Upgraded schema entity from `@type: "LocalBusiness"` to `@type: "HardwareStore"` with `@id: "https://www.hardwarecollection.co/#hardwarestore"`.
  - Added verified geographic coordinates (`22.8028401, 86.2015`).
  - Added opening hours specification covering regular showroom hours (10:00-20:00 Wed-Mon, 10:00-14:00 Tue).
  - Added `hasMap` linking directly to official Google Business Profile map.
  - Linked canonical brand entities (`CANONICAL_BRANDS.map(b => ({ "@type": "Brand", "name": b.name }))`).
  - Guarded NAP consistency: strictly filtered out unverified secondary phone (+91 70336 50739) until GBP confirmation, ensuring only verified primary contact (+91 98351 90738) is emitted.
- **Canonical Sitemap (`src/app/sitemap.ts`)**:
  - Unified base URL strictly to `https://www.hardwarecollection.co`.
  - Added `/catalogues` entry (`priority: 0.8`, `changeFrequency: weekly`).
  - Kept `/` (`priority: 1.0`) and `/collections` (`priority: 0.9`). Excluded `/privacy` and `/terms`.
- **Config & Address Annotations (`src/lib/config.ts`)**:
  - Annotated `SHOWROOM_ADDRESS` with confirmed spelling (`Kashidih`).
  - Annotated `SHOWROOM_SECONDARY_PHONE_*` as pending client/GBP verification before production schema inclusion.
- **CSS Syntax Refinement (`src/app/globals.css`)**:
  - Corrected Tailwind v4 `@theme inline` nesting issue by placing `@supports (animation-timeline: scroll())` rule outside `@theme`.

---

## 2. Verification

- `npx tsc --noEmit`: 0 errors.
- `npm run lint`: 0 errors.
- `npm test`: 222/222 tests passed (22 test files).
- `npm run build`: 16/16 static pages pre-rendered cleanly in Turbopack.
- `npx tsx scripts/release-verification.ts`: Passed all 6 stages (Decision: `[ PROMOTE ]`).
- Evidence Engine (`npx tsx scripts/evidence-engine.ts --validate`): Schema validation passed (16 valid, 0 invalid).
