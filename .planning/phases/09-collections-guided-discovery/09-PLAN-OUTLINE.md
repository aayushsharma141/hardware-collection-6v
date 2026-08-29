---
phase: 09-collections-guided-discovery
type: plan-outline
mode: chunked
plans: 19
waves: 8
created: 2026-08-30
requirements_source: 09-CONTEXT.md decisions D-01…D-27 (no REQUIREMENTS.md exists)
---

# Phase 9 — Plan Outline

> Chunked planning outline. Each row below becomes one `09-NN-PLAN.md` in a subsequent authoring run.
> **No PLAN.md files are written by this run.**

**Ships onto a live production site after Phase 8 launch.** Every wave boundary must leave the site
buildable and link-complete: no dangling homepage hrefs, no half-migrated brand roster, no page left
with neither filters nor discovery layers.

---

## Plan Table

| Plan ID | Objective | Wave | Depends On | Requirements |
|---------|-----------|------|------------|--------------|
| 09-01 | Create the data & content-integrity test scaffolds (brand roster consistency, homepage href resolution, WCAG contrast table) and extend the two existing suites for keyword search and the image fallback chain | 0 | — | — |
| 09-02 | Create the three pure-logic modules this phase's behavior hangs on (slug resolution, featured-chapter cap, cross-type slug uniqueness) each with its Vitest scaffold | 0 | — | — |
| 09-03 | Correct the stale locked rules (brand count, public-routes lock, superseded NAV sections) and obtain blocking owner confirmations on the WhatsApp number, the brand-roster removals, and the unverified showroom claims | 0 | — | D-16, D-17 |
| 09-04 | Reconcile the three disagreeing hardcoded brand rosters into one canonical module and widen the narrow `Product.brand` literal union | 1 | 09-01, 09-03 | D-05, D-06, D-26 |
| 09-05 | Add the `space` document type and the four additive Sanity fields, and enforce cross-type slug uniqueness on both routable types | 1 | 09-02 | D-10, D-11, D-27 |
| 09-06 | Establish the shared conversion primitives every CTA in this phase consumes: WhatsApp link builder with section-specific prefills, and brand/category consultation-drawer context | 1 | 09-03 | D-20, D-21 |
| 09-07 | Add the new GROQ queries (single category, single space, spaces list, slug list, live counts) and wire the space-then-category slug resolver | 2 | 09-02, 09-05 | D-24 |
| 09-08 | Define the canonical six-space vocabulary in code and seed spaces + the reconciled brand roster into Sanity | 2 | 09-04, 09-05 | D-02 |
| 09-13 | Build `BrandDiscovery` — featured editorial tier plus static alphabetical logo wall, both opening the consultation drawer instead of filtering | 2 | 09-04, 09-06 | D-08 |
| 09-09 | Migrate the six category PNGs into Sanity, replace the hardcoded fallback map with the real resolution chain, and extend search matching to `searchKeywords[]` | 3 | 09-01, 09-05, 09-07, 09-08 | D-12, D-14 |
| 09-10 | Build `SpaceIntentRail` (native scroll-snap, Lenis-exempt, reduced-motion safe) and the reusable `CompactCollectionGrid` Tier-2 card | 3 | 09-07, 09-08 | D-22 |
| 09-11 | Build `CollectionIndex` (every published category, numbered, full-row links) and `FeaturedChapters` (alternating Pattern A/B, capped) | 3 | 09-02, 09-07 | D-03, D-04 |
| 09-12 | Build `CollectionsHero` with the live-count stat row and the two named CTAs, plus the filter-free `CollectionSearch` field with grouped inline results | 3 | 09-06, 09-07 | D-09 |
| 09-14 | De-hardcode every remaining site-wide brand surface (trust strip, JSON-LD, showroom experience) and delete the two dead brand components | 3 | 09-04, 09-06, 09-13 | D-07 |
| 09-15 | Ship the `/collections/[slug]` route resolving space-then-category, with `CategoryDetailClient`, `SpaceLandingClient` and the substantive empty-category variant | 4 | 09-06, 09-07, 09-08, 09-09, 09-10 | D-13, D-15 |
| 09-16 | Cut `/collections` over to the guided-discovery composition — new layers in, filter UI out, in a single atomic change | 5 | 09-09, 09-10, 09-11, 09-12, 09-13, 09-15 | D-01, D-18, D-23 |
| 09-17 | Repoint every hardcoded homepage `?category=` / `?brand=` deep link to a real space page or the consultation drawer | 5 | 09-01, 09-08, 09-15 | D-25 |
| 09-18 | Delete the now-unreferenced filter machinery, strip dead filter state from the hook, and audit consultation vocabulary for cart language | 6 | 09-16 | D-19 |
| 09-19 | Run the Stage B performance and accessibility gates on the redesigned routes and close any regression they surface | 7 | 09-14, 09-16, 09-17, 09-18 | — |

---

## Wave Map

| Wave | Plans | Why this wave | Live-site state at wave end |
|------|-------|---------------|-----------------------------|
| 0 | 09-01, 09-02, 09-03 | Test scaffolds + pure logic + doc/owner unblocks. No production code path touched. | Unchanged |
| 1 | 09-04, 09-05, 09-06 | The three independent foundations: canonical data, schema, conversion primitives. | Brand roster consolidated in code; three non-hardware brands drop off the trust strip |
| 2 | 09-07, 09-08, 09-13 | Data layer, Sanity content, and the one new component needing only Wave-1 outputs. | Spaces + brands live in Sanity; new component unwired |
| 3 | 09-09, 09-10, 09-11, 09-12, 09-14 | All remaining new components (unwired) + the additive hook changes + homepage brand surfaces. | Homepage brand surfaces read from the canonical roster |
| 4 | 09-15 | Route must exist before anything links to it. | `/collections/[slug]` live and crawlable |
| 5 | 09-16, 09-17 | The two cutovers, safe only once the route exists. | Guided-discovery landing live; every homepage link resolves |
| 6 | 09-18 | Deletion only — safe once nothing renders the old machinery. | Dead code gone |
| 7 | 09-19 | Measurement gate. | Stage B gates verified |

**Parallelism:** 19 plans in 8 waves; widest wave is 5 concurrent plans (Wave 3).

---

## Sequencing Constraints Honored

1. **Roster before consumers.** 09-04 lands the single canonical roster in Wave 1. Every consumer —
   Sanity seeding (09-08), the collections brand wall (09-13), the homepage strip and JSON-LD (09-14) —
   sits in Wave 2 or later. No wave ends with two files holding different rosters.
2. **Schema before queries before components.** 09-05 (Wave 1) → 09-07 (Wave 2) → components (Wave 3) →
   route (Wave 4). No component queries a field that does not yet exist. The `searchKeywords[]` field is
   added by 09-05 even though the matching behavior it enables is owned by 09-09.
3. **Route before repoint.** 09-15 ships `/collections/[slug]` in Wave 4; the ~60-link homepage repoint
   (09-17) is Wave 5. The live site never briefly links to 404s.
4. **Filters out and discovery in, together.** 09-16 is a single atomic cutover: `CollectionsClient`
   stops rendering the filter rail, search-bar brand dropdown and mobile filter sheet in the same change
   that wires the hero, space rail, index, chapters, Tier-2 grid, brand wall and search. 09-18 only
   deletes files that nothing references any more.
5. **Additive-then-subtractive on the shared hook.** `useCollectionsState.ts` is touched twice: 09-09
   (Wave 3, additive — image chain + keyword matching, filter state left intact so the current page keeps
   building) and 09-18 (Wave 6, subtractive — filter state removed only after nothing consumes it).
6. **Owner confirmations first.** 09-03 sits in Wave 0 because the WhatsApp number gates every CTA
   (09-06 onward) and the brand-roster removals gate the reconciliation (09-04).

---

## Wave 0 Test Files (all six missing files created here)

| File | Created by | Guards | Green when |
|------|-----------|--------|-----------|
| `src/data/__tests__/brands.test.ts` | 09-01 | Canonical roster consistency across `catalog.ts`, `CatalogLibrary.tsx`, `BrandTrustStrip.tsx`, `useCollectionsState.ts` | 09-04 |
| `src/data/__tests__/homeLinks.test.ts` | 09-01 | Every hardcoded homepage href resolves to a real category or space slug | 09-17 |
| `src/lib/__tests__/contrast.test.ts` | 09-01 | Every UI-SPEC text/background pair ≥ 4.5:1; bone-on-brass asserted prohibited | immediately |
| `src/lib/__tests__/collectionRouting.test.ts` | 09-02 | Space-then-category slug precedence, single-vs-multi `linkedCategories` destination | immediately |
| `src/components/collections/__tests__/FeaturedChapters.test.ts` | 09-02 | The 3–5 chapter cap holds regardless of how many categories carry `featured: true` | immediately |
| `src/sanity/__tests__/slugUniqueness.test.ts` | 09-02 | No slug claimed by both a `space` and a `category` document | immediately |
| `src/lib/__tests__/catalogFiltering.test.ts` *(extend)* | 09-01 | `searchKeywords[]` matching | 09-09 |
| `src/hooks/__tests__/useCollectionsState.test.ts` *(extend)* | 09-01 | `product.images[0] → category.image → siteSettings default`; removes the `/public/cinema` PNG-map assertions | 09-09 |

**Collection-safety constraint for 09-01:** its four test files may import only modules that exist
today (`@/data/catalog`, `@/data/home`, `@/types/catalog`). Expected canonical values are declared as
inline fixtures so the suite *collects* at Wave 0 and merely asserts red until its owning plan lands.
Importing `@/data/brands` or `@/data/spaces` at Wave 0 would break collection, not just assertions.

**09-02 inverts this:** it creates each pure module *and* its test in the same plan, so all three go
green immediately and later plans consume the module rather than re-deriving the logic
(`src/lib/collectionRouting.ts`, `src/lib/collectionTiers.ts`, `src/sanity/lib/slugUniqueness.ts`).

`vitest.config.mjs` includes `src/**/__tests__/**/*.test.ts` — **`.ts` only**. No `.test.tsx` file may
be created; component logic must be extracted to a plain `.ts` module first.

---

## File Ownership (no two same-wave plans share a file)

| Plan | Wave | Files owned | Autonomous | Primary automated verify |
|------|------|-------------|-----------|--------------------------|
| 09-01 | 0 | `src/data/__tests__/brands.test.ts`, `src/data/__tests__/homeLinks.test.ts`, `src/lib/__tests__/contrast.test.ts`, `src/lib/__tests__/catalogFiltering.test.ts`, `src/hooks/__tests__/useCollectionsState.test.ts` | yes | `npx vitest run src/lib/__tests__/contrast.test.ts` |
| 09-02 | 0 | `src/lib/collectionRouting.ts` + test, `src/lib/collectionTiers.ts`, `src/components/collections/__tests__/FeaturedChapters.test.ts`, `src/sanity/lib/slugUniqueness.ts` + test | yes | `npm test` |
| 09-03 | 0 | `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/NAV_AND_COLLECTIONS_PLAN.md`, `.planning/NEVER-BUILD.md` | **no** — `checkpoint:decision` ×3 | grep assertions on the amended rule lines |
| 09-04 | 1 | `src/data/brands.ts` (new), `src/data/catalog.ts`, `src/components/catalog/CatalogLibrary.tsx` | yes | `npx vitest run src/data/__tests__/brands.test.ts` |
| 09-05 | 1 | `src/sanity/schemaTypes/{space,category,product,siteSettings,index}.ts` | yes | `npx vitest run src/sanity/__tests__/slugUniqueness.test.ts` + `npx tsc --noEmit` |
| 09-06 | 1 | `src/lib/whatsapp.ts` (new), `src/components/consultation/ConsultationContext.ts`, `package.json` | yes | `npx tsc --noEmit` + `node scripts/audit-dependencies.cjs` |
| 09-07 | 2 | `src/sanity/queries.ts`, `src/types/catalog.ts`, `src/lib/collectionRouting.ts` (wire) | yes | `npx vitest run src/lib/__tests__/collectionRouting.test.ts` |
| 09-08 | 2 | `src/data/spaces.ts` (new), `scripts/seed-phase9-content.ts` (new) | **no** — `checkpoint:human-action` (run seed against Sanity) | `npx vitest run src/data/__tests__/homeLinks.test.ts` |
| 09-13 | 2 | `src/components/collections/BrandDiscovery.tsx` | yes | `npm run build` + `npx tsc --noEmit` |
| 09-09 | 3 | `src/hooks/useCollectionsState.ts`, `src/types/catalog.ts`, `scripts/migrate-category-images.ts` | **no** — `checkpoint:human-action` (run asset migration) | `npx vitest run src/hooks/__tests__/useCollectionsState.test.ts src/lib/__tests__/catalogFiltering.test.ts` |
| 09-10 | 3 | `src/components/collections/{SpaceIntentRail,CompactCollectionGrid}.tsx`, `src/app/globals.css` | yes | `npm run build` + grep for `data-lenis-prevent` on the rail container |
| 09-11 | 3 | `src/components/collections/{CollectionIndex,FeaturedChapters}.tsx` | yes | `npx vitest run src/components/collections/__tests__/FeaturedChapters.test.ts` |
| 09-12 | 3 | `src/components/collections/{CollectionsHero,CollectionSearch}.tsx` | yes | `npx vitest run src/lib/__tests__/contrast.test.ts` + `npm run build` |
| 09-14 | 3 | `src/components/BrandTrustStrip.tsx`, `src/app/layout.tsx`, `src/components/ShowroomExperience.tsx`, delete `src/components/home/{BrandStrip,InteractiveBrandWall}.tsx` | **no** — `checkpoint:human-verify` (live homepage) | `npx vitest run src/data/__tests__/brands.test.ts` + `npm run build` |
| 09-15 | 4 | `src/app/collections/[slug]/page.tsx`, `src/components/collections/{CategoryDetailClient,SpaceLandingClient}.tsx` | yes | `npx vitest run src/lib/__tests__/collectionRouting.test.ts` + `npm run build` |
| 09-16 | 5 | `src/app/collections/page.tsx`, `src/app/collections/CollectionsClient.tsx` | **no** — `checkpoint:human-verify` (landing, mobile + desktop) | `npm run build` + `npm test` |
| 09-17 | 5 | `src/data/home.ts`, `src/components/home/{CategoryDiscovery,ProductReel}.tsx`, `src/components/Footer.tsx` | **no** — `checkpoint:human-verify` (homepage links) | `npx vitest run src/data/__tests__/homeLinks.test.ts` |
| 09-18 | 6 | `src/hooks/useCollectionsState.ts`, `src/components/collections/{ProductCard,ShortlistPill}.tsx`, delete `{CollectionFilterRail,MobileFilters,CollectionSearchBar}.tsx` | yes | `npm test` + `npm run build` + grep for retired filter identifiers |
| 09-19 | 7 | verification only (may patch a surface if a gate fails) | **no** — manual-only checks | `npm test`, `npm run build`, `npx tsc --noEmit`, `npm run lint`, `npx tsx scripts/release-verification.ts` |

---

## Decision Coverage Audit (D-01…D-27)

| Decision | Plan | How it lands |
|----------|------|--------------|
| D-01 two entry systems only | 09-16 | Landing composition renders exactly the space layer + editorial index; the four cut systems appear nowhere |
| D-02 space-led tile vocabulary | 09-08 | `src/data/spaces.ts` + seeded `space` documents for the six named spaces |
| D-03 CMS-driven tiering, 3–5 cap in code | 09-11 | `FeaturedChapters` consumes `collectionTiers.ts` cap (module + test from 09-02) |
| D-04 index lists every published category | 09-11 | `CollectionIndex`, ordered by `displayOrder`, zero-padded numbering, no expander |
| D-05 20+ brands | 09-04 | Canonical roster module supersedes the 6-brand assumption |
| D-06 all authorized, no tier split | 09-04 | Roster carries no authorized-vs-stocked distinction; uniform eyebrow |
| D-07 site-wide de-hardcode | 09-14 | Trust strip, JSON-LD and showroom experience read the canonical roster |
| D-08 featured + alphabetical wall | 09-13 | `BrandDiscovery` two-tier component |
| D-09 live counts in hero | 09-12 | Stat row from `getCollectionCounts`, zero-count segments omitted |
| D-10 additive category fields | 09-05 | `heroImage`, `gallery[]`, `searchKeywords[]` added; `image` untouched |
| D-11 `space` document type | 09-05 | New schema type registered in `schemaTypes/index.ts` |
| D-12 image resolution chain | 09-09 | PNGs migrated into Sanity; hardcoded map deleted; chain implemented |
| D-13 empty categories indexed | 09-15 | Empty-category variant renders sections 1–6 and 8 in full |
| D-14 `searchKeywords[]` matching | 09-09 | Client-side substring match extended over the enriched field |
| D-15 real `/collections/[slug]` routes | 09-15 | Dynamic segment with `generateStaticParams`, `dynamicParams` left true |
| D-16 public-routes lock amendment | 09-03 | Lock amended to `/` + `/collections` + `/collections/[slug]` |
| D-17 NAV S3B/S3C superseded | 09-03 | NAV plan annotated; S3D/S3E/S4 confirmed still binding |
| D-18 no visible filter UI | 09-16 | Filter rail, brand dropdown and mobile filter sheet stop rendering in the cutover |
| D-19 shortlist reframed | 09-18 | Vocabulary audit across shortlist, card and drawer copy |
| D-20 two named landing CTAs + contextual category CTA | 09-06 | CTA contract and message builders; consumed by 09-12 and 09-15 |
| D-21 approved number + section prefills | 09-06 | `src/lib/whatsapp.ts` single construction point, number confirmed in 09-03 |
| D-22 native scroll-snap rail | 09-10 | CSS snap rail, `data-lenis-prevent`, reduced-motion degrade |
| D-23 mobile as its own flow | 09-16 | Mobile section order delivers any major collection in 1–2 interactions |
| D-24 one route family, space-then-category | 09-07 | `getSpaceBySlug` → `getCategoryBySlug` precedence in the resolver |
| D-25 homepage family links → space pages | 09-17 | ~60 hardcoded deep links repointed |
| D-26 hardware-only canonical roster | 09-04 | Jaquar, Asian Paints, Philips removed; Hettich and Kich added |
| D-27 cross-type slug uniqueness | 09-05 | Async validator on both `space` and `category` slug fields |

All 27 decisions covered, each by exactly one plan. Plans 09-01, 09-02 and 09-19 carry no decision
ownership by design — they are the validation scaffold and the closing measurement gate.

---

## Research-Derived Items Also Covered (not CONTEXT decisions)

| Item | Source | Plan |
|------|--------|------|
| `zustand` used in source but absent from `package.json` — pin as a direct dependency before this phase adds more usage | RESEARCH Package Legitimacy Audit | 09-06 |
| Six category PNGs are 600–750KB — compress/convert before upload or the LCP gate regresses | RESEARCH Pitfall 6 | 09-09 |
| Lenis intercepts wheel events document-wide; the rail needs `data-lenis-prevent` + `overscroll-behavior: contain` (first application in this codebase) | RESEARCH Pitfall 4 | 09-10 |
| `data/home.ts` claims to be the shared source but `CategoryDiscovery` and `ProductReel` hold independent copies — consolidate while repointing | RESEARCH Pitfall 2 | 09-17 |
| GROQ `$slug` must be a fetch parameter, never interpolated into the template literal (threat T-9-02) | RESEARCH Security V5 | 09-07 |
| Search text never reaches a GROQ string; client-side `Array.filter` only (threat T-9-01) | RESEARCH Security V5 | 09-09 |
| Reserve the literal slug `spaces` on both routable types as a defensive guard | RESEARCH Pitfall 5 | 09-05 |
| Text-over-photograph legibility depends on the mandated scrim, never on the individual image | RESEARCH Pitfall 7 / UI-SPEC §2 | 09-10, 09-15 |
| `getProductsByCategoryQuery` already exists and is unused — the new route must call it, never `getAllProducts()` | RESEARCH Pattern 2 | 09-15 |
| Lifting `<Footer>` into `RootLayout` to avoid a fourth duplicated fetch | RESEARCH Pitfall 8 | **not planned** — explicitly optional, out of scope; record in `NEVER-BUILD.md` deferral list via 09-03 |

**Open questions closed by decisions, no plan needed:** family-link targets (D-25), brand-link targets
(drawer, UI-SPEC §6 — implemented in 09-14 and 09-17), `/collections/spaces/[slug]` as a second route
family (D-24 removes it).

---

## Notes for the Per-Plan Authoring Runs

- **Threat model:** `security_enforcement` is unset in `.planning/config.json`, so it is enabled. Every
  plan needs a `<threat_model>` block. The two live threats are T-9-01 (search input) and T-9-02 (GROQ
  slug parameterization); T-9-SC is inert this phase — the only package-manager action is pinning the
  already-present `zustand`, and RESEARCH records that no new external packages are introduced.
- **No `.test.tsx` files.** `vitest.config.mjs` silently skips them.
- **Motion budget is binding:** 150ms buttons, 180ms card hover, 220–250ms reveals, with the named
  `.architecture-rule` 220ms exception. Do not fork a second underline timing.
- **Never set `text-white` on `.brass-plate`** — that is the documented 1.76:1 contrast failure.
- **Phase gate before `/gsd:verify-work`:** `npm test`, `npm run build`, `npx tsc --noEmit`,
  `npm run lint`, `node scripts/audit-dependencies.cjs`.
