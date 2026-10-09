---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: unknown
last_updated: "2026-08-29T15:44:34.502Z"
progress:
  total_phases: 1
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# Current Operational State

**Active Project:** Hardware Collection
**Last Updated:** 2026-10-10
**Active Phase:** Phase 17 — Animation Opportunities & Motion System Integration (Complete)
**Feature Development:** FROZEN

## Status Summary

```
Phase 0  ✅  Complete
Phase 1  ✅  Complete
Phase 2  ✅  Complete
Phase 2.5 ✅ Complete
Phase 3  ✅  Architecture complete | ⚠️ Official PDF catalogs pending (owner dependency)
Phase 4  ✅  Complete (Production Readiness and Audit)
Phase 5  ✅  Complete (Lead operations - Webhook and WhatsApp Integration)
Phase 6  ✅  Complete (Final QA)
Phase 7  ✅  Complete (Mukesh acceptance)
Phase 8  ✅  Complete (Production Launch Verification)
Phase 9  ✅  Complete (Collections Guided Discovery & Architecture Overhaul)
Phase 10 📋  Ready (Brand Showcase & Light Roster Presentation)
Phase 11 🔄  In Progress (Wave 0.5 Staging Assets Executed | Wave 0 Photography Pending)
Phase 12 ✅  Complete (UI Polish & Visual Animations)
Phase 13 📋  Planned (CMS Photography & Scheduled Offers)
Phase 14 ✅  Complete (UI/UX Refinement & Anti-UI-Slop Standardization)
Phase 15 ✅  Complete (Animation Polish & GPU Acceleration / Content Updates)
Phase 16 ✅  Complete (Local Search Entity & Technical SEO Foundation)
Phase 17 ✅  Complete (Animation Opportunities & Motion System Integration)
```

## Known P0 Blocker

✅ **Resolved:** Sanity production credentials injected. Token authentication established. Dataset is fetching successfully, with 13 categories, 6 spaces, 21 canonical hardware brands (fallback roster `src/content/fallback/brands.ts`; Kich removed in PR #24), and real catalog products.

## Launch Gate Sequence

```
Connect real Sanity credentials
        ↓
Verify /collections returns real data
        ↓
WhatsApp CTA click-test (all CTAs)
        ↓
NAP / Maps verification
        ↓
Keyboard + accessibility audit
        ↓
Production console audit (npm run build)
        ↓
Mukesh business-truth acceptance
        ↓
Vercel deployment → hardwarecollection.co (set SITE_INDEXABLE=true)
        ↓
Search Console + GBP + Analytics
```

## Locked Rules (Do Not Override)

- Public routes: / and /collections (plus /catalogues, /privacy, /terms). `/collections/[slug]` pages no longer exist — categories and families are sections on `/collections`, and retired `/collections/<slug>` URLs permanently redirect via `next.config.ts` (architecture locked in commit ac1e889). (Originally amended 2026-08-30 per Phase 9 D-16 — see 09-CONTEXT.md)
- No fake/mock/placeholder products ever
- No pricing, no e-commerce, no cart
- No public source PDFs as catalog substitutes
- 20+ authorized dealer brands, architectural hardware only (amended 2026-08-30 per Phase 9 D-05/D-26 — see 09-CONTEXT.md; canonical roster reconciled in Phase 9 plan 09-04)
- WhatsApp is the primary conversion mechanism
- Cormorant Garamond (display) + DM Sans (body)
- Light ivory (`--surface` #fbf5ea) / accent (`--accent` #8b1a42) / brass (#c8a96e) visual system (tokens in `src/app/globals.css`)

---

## Last Session

**Stopped at:** Phase 16 ALL 4 PLANS EXECUTED (01-04 completed, 6/6 release quality gates passed with PROMOTE decision).
**Date:** 2026-10-09

Wave 0: 3 of 3 plans done.
- 09-01 ✅ test scaffolds
- 09-02 ✅ pure-logic modules
- 09-03 ✅ locked-rule corrections + business-truth confirmations

Wave 1: 3 of 3 plans done.
- 09-04 ✅ canonical brand roster reconciliation (now `src/content/fallback/brands.ts`, `src/content/fallback/catalog.ts`, `CatalogLibrary.tsx`)
- 09-05 ✅ space document type + cross-type slug uniqueness validator + additive fields (`space.ts`, `category.ts`, `product.ts`, `siteSettings.ts`, `index.ts`)
- 09-06 ✅ WhatsApp link builder + conversion primitives + zustand direct dependency (now `src/lib/integrations/whatsapp.ts`, `ConsultationContext.ts`, `package.json`)

Wave 2: 3 of 3 plans done.
- 09-07 ✅ GROQ queries & route resolver (now `src/content/sanity/queries.ts`, `src/types/catalog.ts`; `src/lib/collectionRouting.ts` since removed)
- 09-08 ✅ canonical space vocabulary & Sanity content seeding (now `src/content/fallback/spaces.ts`, `scripts/seed-phase9-content.ts` — 13 categories, 6 spaces with 100% linked category resolution, 22 brands seeded)
- 09-13 ✅ BrandDiscovery component (`src/components/collections/BrandDiscovery.tsx`)

Wave 3: 5 of 5 plans done.
- 09-09 ✅ additive hook changes (D-12 image chain, D-14 keyword search) & category image asset migration (`src/hooks/useCollectionsState.ts`, `scripts/migrate-category-images.ts` — 6/6 assets, 22 categories patched)
- 09-10 ✅ SpaceIntentRail & CompactCollectionGrid (`SpaceIntentRail.tsx`, `CompactCollectionGrid.tsx` — both since removed)
- 09-11 ✅ CollectionIndex & FeaturedChapters (`CollectionIndex.tsx`, `FeaturedChapters.tsx`, `collectionTiers.ts` — all since removed)
- 09-12 ✅ CollectionsHero & CollectionSearch (`src/components/collections/CollectionsHero.tsx`, `src/components/collections/CollectionSearch.tsx`, now `src/lib/integrations/whatsapp.ts`)
- 09-14 ✅ brand roster repointing & dead code cleanup (now `src/components/brand/BrandTrustStrip.tsx`, `src/app/layout.tsx`, deleted `BrandStrip.tsx` & `InteractiveBrandWall.tsx`)

Wave 4: 2 of 2 plans done.
- 09-15 ✅ dynamic route `/collections/[slug]` + `CategoryDetailClient` (with D-13 empty variant) + `SpaceLandingClient` (`src/app/collections/[slug]/page.tsx`, `CategoryDetailClient.tsx`, `SpaceLandingClient.tsx` — all since removed; the `[slug]` route was retired in favour of sections on `/collections`, with redirects in `next.config.ts`)
- 09-16 ✅ atomic guided-discovery landing cutover (`src/app/collections/page.tsx`, `src/app/collections/CollectionsClient.tsx`, `globals.css`)

Wave 5: 1 of 1 plan done.
- 09-17 ✅ homepage & footer deep-link repointing to `/collections/[slug]` single-segment routes (now `src/content/fallback/home.ts`, `CategoryDiscovery.tsx`, `ProductReel.tsx`, `Footer.tsx`, `ConsultationContext.ts`)

Wave 6: 1 of 1 plan done.
- 09-18 ✅ dead filter UI & state subtractive cleanup (deleted `CollectionFilterRail.tsx`, `MobileFilters.tsx`, `CollectionSearchBar.tsx`, stripped filter state from `useCollectionsState.ts`, audited vocabulary)

Wave 7: 1 of 1 plan executed.
- 09-19 ⚠️ Stage B performance + accessibility gate (SUMMARY status `complete_with_failures`)

**Suite baseline: see `npm test` for current suite and test counts; 0 build errors, 36 SSG pages pre-rendered in <1.5s.**

## Phase 9 Business-Truth Confirmations

Owner-confirmed 2026-08-30. See `.planning/phases/09-collections-guided-discovery/09-CONTEXT.md`
for full decision/flag text.

- **WhatsApp number: confirmed as 919835190738 on 2026-08-30** — see 09-CONTEXT.md F-01,
  resolved 09-03. `919835190738` is the single WhatsApp number site-wide and doubles as a
  calling number; all 7 shipped code locations already used it correctly. **`919431111550`
  is an ADDITIONAL CALLING-ONLY number and must NEVER appear in a `wa.me` link** — it
  currently appears nowhere in `src/`. `QA_AND_ASSET_PROTOCOL.md` (now retired to `_quarantine/stale-docs/.planning/`) S4.3 was the sole
  wrong reference and has already been corrected.
- **Brand roster (Jaquar/Asian Paints/Philips): removed per D-26** — confirmed 2026-08-30,
  see 09-CONTEXT.md F-06. The canonical roster is architectural hardware brands only. Hettich
  and Kich, then missing from `catalog.ts` BRANDS, were added in Phase 9 plan 09-04; Kich was
  later removed from the roster in PR #24.
- **Showroom claims (sq ft / 20+ years): "20+ years" CONFIRMED and may ship; the specific
  "7,500 sq ft" figure is NOT correct and must NEVER be shown on any Phase 9 surface** —
  confirmed 2026-08-30, see 09-CONTEXT.md F-04/D-09. The "113 sq ft shop in 2002" origin
  sentence was dropped entirely per the owner. The false "7,500 sq ft" figure has already
  been removed from source in commit `a0c61f9` (was live via `ShowroomCinematic.tsx`).
  `NAV_AND_COLLECTIONS_PLAN.md` (now retired to `_quarantine/stale-docs/.planning/`)'s existing "no unverified sq ft claims" amendment is
  therefore satisfied in source as of commit `a0c61f9`.

## Pending Corrections (raised 2026-08-29, not yet applied)

None remaining — brand count and public routes resolved above in Locked Rules; WhatsApp
number resolved above in Phase 9 Business-Truth Confirmations.

## Phase 16 Business-Truth Confirmations

Owner-decided 2026-10-09:
- **Title Strategy (Option 3):** Confirmed titles keeping local search keywords under 60 characters to prevent SERP truncation:
  - Homepage: `Hardware Showroom Sakchi, Jamshedpur | Hardware Collection` (58 chars)
  - Collections: `Hardware Collections | Door, Kitchen, Wardrobe | Jamshedpur` (58 chars)
  - Catalogues: `Brands & Catalogues | Authorized Hardware in Jamshedpur` (54 chars)
- **Canonical Host:** Confirmed `https://www.hardwarecollection.co` as the authoritative canonical origin. Bare domain redirects to `www`.
- **Showroom Address Spelling:** Owner-chosen 'Kashidih' (with 'h'): `1/18, Kashidih, Near Durga Puja Maidan, Sakchi, Jamshedpur, Jharkhand 831001`. (Google Business Profile check pending).
- **Geographic Coordinates & Hours:** Confirmed repository defaults (`22.8028401, 86.2015` from Google Maps embed; hours from Sanity Studio `showroomHours` with config fallback).

## Phase 16 Post-Execution Audit & Verification (2026-10-09)

Audit-Fix executed (`/gsd-audit-fix`):
- **Release Gate Evidence:** Archived release bundle `EV-70e2c93-2026-10-09T1111-v1.0.json` bound to clean commit `70e2c93` with `workingTreeDirty: false` (passed all 6 quality gates with `PROMOTE` decision).
- **Static HTML Pre-rendering (SSG Bailout Fix):** Replaced top-level `useSearchParams()` with client-side query synchronization in `useCollectionsState` and `CatalogsClient`. Removed outer `<Suspense>` bailouts, ensuring complete pre-rendering of all 7 showroom families in `<details>/<summary>`, single `<h1>`, and crawlable cross-link bridges directly into static server HTML.
- **Verification Suite:** Added automated suite `src/lib/collections/__tests__/phase16Verification.test.ts` (10 tests) and runner `scripts/verify-phase16-e2e.ts` passing all 24/24 synthetic and static checks.
- **Catalog Explorer Backlog Item:** Logged that `CollectionExplorer` renders taxonomy and categories without product cards (behavior inherited from pre-Phase-16 code where `ShowcaseCard` was unreferenced). Product card integration remains queued for upcoming catalogue refinement.

## Phase 17 Execution (2026-10-10)

Executed on branch `docs/animation-plan`:
- **Plan 17-01 (`c118572`):** Hero carousel controls tactile press feedback (`active:scale-[0.97]`) & FAQ accordion CSS Grid smooth expansion (`grid-template-rows-[1fr]` with `min-h-0 overflow-hidden`), zero `transition: all`.
- **Plan 17-02 (`556fb82`):** Lead consultation form submission `<AnimatePresence mode="wait">` state cross-fade (`duration: 0.35 / 0.25`, `--ease-out`) with `useReducedMotion()` instantaneous fallback.
- **Plan 17-03 (`b59c0de`):** SSR-safe `useIsDesktop()` hook (`useSyncExternalStore` at 768px), `SheetDrawerWrapper` outer motion boundary (isolates touch drag `<aside>` inline height and locks mount-time entrance vector), `SheetDialogWrapper` for `PageJump`, and `<AnimatePresence>` integration in `CatalogViewerModal.tsx`.
- **Quality Verification:** 24/24 test suites passed (237/237 tests green), `npx tsc --noEmit` clean, ESLint clean (0 errors), browser subagent verified.
