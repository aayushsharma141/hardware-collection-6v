# Phase 9: Collections Guided Discovery Redesign - Research

**Researched:** 2026-08-29
**Domain:** Next.js 16 App Router dynamic routing + Sanity CMS schema evolution + site-wide data de-hardcoding, on a live, launch-adjacent Next.js/Sanity marketing site
**Confidence:** MEDIUM-HIGH (route/caching mechanics verified against official Next.js 16.3.3 docs; brand blast-radius verified by direct codebase grep; several claims below are corrections to CONTEXT.md's own blast-radius estimate, evidenced from code, not assumed)

## Summary

This phase is technically two separable efforts wearing one name: (1) a UI/routing change to `/collections` and a new `/collections/[slug]`, and (2) a data-model change that widens the brand system from a 6-item hardcoded set to 20+ CMS-managed brands, site-wide. The UI/routing effort is well-served by Next.js 16's existing (non-experimental) "Previous Model" ISR caching — `export const revalidate = N` — exactly as `/collections/page.tsx` already uses today; no new caching primitive, no Cache Components opt-in, and no `generateStaticParams` are strictly required, though `generateStaticParams` is cheap to add here (only ~13 categories) and improves first-crawl SEO. The data-model effort is the actual risk center of this phase: it is not one 6→20 change, it is **three independent, mutually-inconsistent hardcoded brand rosters** living in three different files (`src/data/catalog.ts`, `src/components/catalog/CatalogLibrary.tsx`, `src/components/BrandTrustStrip.tsx` — the last one already mid-edit in the working tree per `git status`), plus **at least 55 hardcoded `/collections?category=X&brand=Y` query-param deep links spread across 7 homepage files**, only one of which (`CategoryDiscovery.tsx`) is named in CONTEXT.md's flag F-05. All of them silently degrade (not 404, just land on the generic `/collections` page ignoring the intended target) the moment D-18 removes the filter state that currently reads those query params.

A `09-UI-SPEC.md` already exists in this phase directory (Revision 1, checker sign-off pending) and resolves nearly all visual/interaction ambiguity — spacing, color/contrast (independently re-verified below, numbers match), typography, motion timing, component inventory, and the empty-category/search/CTA copy. It also already surfaces one route-lock gap of its own: a `/collections/spaces/[slug]` route is required for any space whose `linkedCategories[]` has more than one entry, and this route is **not** named in D-15/D-16's amended public-routes lock. This research treats that UI-SPEC finding as a confirmed, must-resolve planning item, not a maybe.

**Primary recommendation:** Sequence the work as (1) reconcile the three brand rosters into one canonical list and seed it into Sanity, (2) widen the two narrow TypeScript surfaces (both are smaller than CONTEXT.md's blast-radius estimate — see below), (3) add the four additive Sanity schema fields + the new `space` type, (4) build `/collections/[slug]` reusing the already-parametrized `getProductsByCategoryQuery`, (5) rebuild `/collections` per 09-UI-SPEC.md, (6) do a dedicated, codebase-wide sweep of every `/collections?` hardcoded link (list below) — do not rely on CONTEXT.md's file list alone, it undercounts this by at least 6 files.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Category/space/brand content authoring | Database/Storage (Sanity) | — | Sanity is the single source of truth per locked architecture; all new fields (`heroImage`, `gallery[]`, `searchKeywords[]`, `space` type) live here |
| `/collections` + `/collections/[slug]` data fetch | Frontend Server (SSR, Next.js Server Components) | Database/Storage | GROQ queries run server-side in `page.tsx`; no client-side data fetching introduced |
| Discovery UI (space tiles, chapters, index, brand wall) | Browser/Client | Frontend Server | Rendered server-side (RSC-friendly, no client fetch), interactivity (hover, shortlist, drawer) is client-side via existing `"use client"` components |
| Search (`searchKeywords[]` matching) | Browser/Client | Database/Storage | Per D-14, stays a client-side substring match over an enriched field fetched at page load — no server search endpoint, no search engine |
| Consultation / shortlist / WhatsApp CTA state | Browser/Client | — | Existing `useCollectionsState` (React state) + `useConsultationStore` (Zustand) patterns; no backend persistence, links are constructed client-side |
| Lead capture (unrelated to this phase but shares the DB) | API/Backend (Prisma + Postgres) | — | `Lead` model, untouched by this phase; mentioned only so the planner doesn't conflate it with Sanity |
| Static asset delivery (brand logos, category PNGs → Sanity assets) | CDN/Static (Sanity CDN via `cdn.sanity.io`, proxied through `next/image`) | Browser/Client | Confirmed in `next.config.ts` `images.remotePatterns` — already wired, no config change needed |

## Project Constraints (from CLAUDE.md)

- Stack is locked: Next.js 16 (App Router), React 19, Sanity CMS (`next-sanity`, embedded Studio at `/studio`), PostgreSQL/Prisma (`Lead` model only — not touched by this phase), Tailwind CSS v4, `lucide-react`, TypeScript 5, Vercel.
- Required verification commands before considering work complete: `npm run build`, `npm run lint`, `npx tsc --noEmit`, `npm test`, `node scripts/audit-dependencies.cjs`.
- `.agents/rules/` as documented in CLAUDE.md (`architecture.md`, `coding.md`, `git.md`, `security.md`, `testing.md`) **do not actually exist at those paths** in the current tree — the only files under `.agents/rules/` are `audit_rules.md`, `graphify.md`, `ui_math_formulas.md`. This is stale documentation inside CLAUDE.md itself, not a phase-9 concern, but the planner should not assume those rule files exist to consult.
- Executable policy files that DO exist and DO apply (`.agents/policies/*.yml`): `accessibility.yml` (WCAG 2.1 AA, 4.5:1 min text contrast, blocker severity), `performance.yml` (LCP ≤2500ms, CLS ≤0.1, INP ≤200ms as blockers; 500KB initial JS bundle as a warning). These match `.planning/QA_AND_ASSET_PROTOCOL.md` Stage B and should be treated as binding gates for this phase's new routes.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Ship **two** entry systems only: (a) space-led visual intent layer, (b) editorial collection index. The brief's other four proposed systems (S4/S7/S9/S11) are consciously cut.
- **D-02:** Tile vocabulary is space-led: `KITCHEN`, `ENTRANCE`, `WARDROBE`, `BATHROOM`, `LIVING / INTERIOR`, `COMMERCIAL`.
- **D-03:** Tier-1/Tier-2 hierarchy is CMS-driven off existing `category.featured` + `category.displayOrder`. Hard cap of 3-5 featured chapters enforced in code.
- **D-04:** Collection index lists every published category, ordered by `displayOrder`, numbered `01 -` upward. No curation, no grouping, no "view all".
- **D-05:** 20+ brands, not 6. Supersedes the "6 authorized brands" rule in STATE.md/ROADMAP.md/NAV_AND_COLLECTIONS_PLAN.md S1.
- **D-06:** All 20+ brands are authorized dealer brands. No authorized-vs-stocked tier distinction in the UI.
- **D-07:** Phase 9 owns the full **site-wide** brand de-hardcode, not a collections-only subset.
- **D-08:** Brand discovery = featured brands with editorial copy + full alphabetical logo wall, driven by `brand.featured`/`brand.displayOrder`.
- **D-09:** Hero stat row renders live counts from Sanity (published categories, published brands). "20+ years" line ships only with explicit Mukesh confirmation — launch-gate item, not shipped copy by default.
- **D-10:** Category schema changes are purely additive: `heroImage`, `gallery[]`. Existing `image` field keeps serving as thumbnail. No migration, no editor rework.
- **D-11:** New `space` document type: `name`, `slug`, `image`, `description`, `linkedCategories[]`, `displayOrder`.
- **D-12:** Hardcoded `/public/cinema/categories/*.png` fallback map in `getProductDisplayImage()` is deleted. Six PNGs uploaded into Sanity as category assets. Resolution chain becomes `product.images[0] → category.image → siteSettings default`.
- **D-13:** Empty categories (zero published products) are indexed, not hidden or noindexed. Built from existing `overview`/`keyFeatures`/`suitableFor`/`brands` + new `heroImage` + enquiry CTA.
- **D-14:** Search synonyms live in `searchKeywords[]` on `category` and `product` in Sanity, not a code constant. Doubles as source brief's S23 `seoKeywords`. Search remains substring match — no search engine dependency, no faceted-search UI.
- **D-15:** Discovery targets are real routes: `/collections/[slug]` — not anchor scroll, not query params.
- **D-16:** Public-routes lock formally amended from `/` + `/collections` only, to `/` + `/collections` + `/collections/[slug]`.
- **D-17:** NAV_AND_COLLECTIONS_PLAN.md S3B (Floating Command Bar) and S3C (12-column card spans) are SUPERSEDED. No-visible-filters rule replaces them. S3D and S3E remain binding as amended. S4 remains binding unchanged.
- **D-18:** No visible filter UI anywhere. Removes `CollectionFilterRail`, brand dropdown in `CollectionSearchBar`, `MobileFilters` in current form.
- **D-19:** Consultation shortlist survives, re-framed — "Items for consultation," never cart language. Max 5 items, numbered WhatsApp prefill.
- **D-20:** "ASK A HARDWARE EXPERT" and "SEND PROJECT REQUIREMENT" appear once each on `/collections` landing. Category pages carry a contextual CTA driven by `category.whatsappMessage`.
- **D-21:** Every WhatsApp CTA uses the approved number with section-specific pre-filled message. Approved number needs confirmation (see flags — two different numbers in canonical docs).
- **D-22:** Space tiles use native CSS scroll-snap horizontal rail, not a JS carousel. Must degrade under `prefers-reduced-motion`.
- **D-23:** Mobile is its own flow. Target: any major collection reachable in 1-2 interactions without scrolling the full page.

### Claude's Discretion

Not discussed - planner and researcher decide within the constraints above:
- Chapter copy tone and per-collection editorial descriptions
- Exact motion timings (bounded by NAV plan S4: 150/180/200/220-250ms) and reveal choreography
- GROQ query shape, data-fetching strategy, and ISR/caching approach for the new routes
- Component file layout and decomposition
- How much technical metadata survives on the editorial product card
- Whether the scroll progress/active-chapter indicator (S11) ships at all
- Whether category pages reuse the existing lookbook drawer or navigate to a product view

### Deferred Ideas (OUT OF SCOPE)

- Product hotspots on lifestyle imagery (source brief S12D) — own phase.
- The four unshipped entry systems (S4, S7, S9, S11) — cut by D-01.
- `/catalogs` route disposition — see F-03, Phase 8 launch review.
- Homepage redesign beyond brand de-hardcoding.
- Scroll progress / active-chapter indicator (S11) — Claude's Discretion; becomes a deferred idea if not judged worth it.

### Flagged Conflicts (require owner decision, not resolved by this phase)

- **F-01:** Two different WhatsApp numbers in canonical docs — `QA_AND_ASSET_PROTOCOL.md` S4.3 says `919431111550`; `STATE.md`/all shipped code (`src/lib/config.ts`, `Footer.tsx`, `useCollectionsState.ts`) use `919835190738`. **Verified in this research:** the shipped code number (`919835190738`) is the one actually live in three independent code locations; the QA doc number appears to be the stale/wrong one. Recommend treating `919835190738` as canonical pending explicit Mukesh confirmation.
- **F-02:** Stale locked rules (brand count) in STATE.md/ROADMAP.md/NAV_AND_COLLECTIONS_PLAN.md S1.
- **F-03:** Route lock already breached by `/catalogs` (commit `51472d2`). Out of scope for Phase 9.
- **F-04:** Unverified "7,500 sq ft" showroom claim; related to D-09's "20+ years" question.
- **F-05:** Homepage deep links break under D-15. **This research found the actual scope is far larger than the single file CONTEXT.md names** — see Common Pitfalls, "The Real Size of F-05" below.
</user_constraints>

## Standard Stack

No new libraries are required for this phase. Everything needed is already installed and at or near current. Confirmed versions:

### Core (already installed — confirmed via `package.json` + `npm view <pkg> version`)

| Library | Installed | Latest (npm, checked this session) | Purpose | Note |
|---------|-----------|-------------------------------------|---------|------|
| `next` | 16.3.3 | 16.3.3 | App Router, routing, ISR | Exactly current |
| `react` / `react-dom` | 19.2.4 | — | UI runtime | — |
| `next-sanity` | 13.3.1 | 13.3.3 | Sanity client + Next.js glue | Trivial patch behind, no action needed |
| `sanity` | 6.9.1 | 6.11.0 | Studio + schema definition (`defineType`/`defineField`) | Minor behind; `defineType`/`defineField` API unchanged across this range |
| `motion` (motion/react) | 13.1.0 | 13.1.1 | `AnimatePresence`, `MotionConfig`, card/drawer transitions | Trivial patch behind |
| `gsap` + `@gsap/react` | 3.15.0 / 2.1.2 | — | Cinematic desktop sequences (`useGSAP`, `ScrollTrigger`) — not needed for D-22's rail (native CSS), used elsewhere on the page | — |
| `@react-three/fiber` / `@react-three/drei` / `three` | 9.7.0 / 10.7.8 / 0.185.1 | — | Desktop-only R3F moment, unrelated to this phase's scope | — |
| `lucide-react` | 1.14.0 | — | Icons (`Compass`, `MessageCircle`, `Search`, `ArrowRight`, etc.) | Already sitewide standard, confirmed by `09-UI-SPEC.md` |
| `tailwindcss` / `@tailwindcss/postcss` | 4 | — | Styling | No token abstraction layer in use — inline hex, per 09-UI-SPEC.md decision |
| `vitest` | 4.1.11 | — | Unit test runner | Config at `vitest.config.mjs` |
| `zod` | 4.4.3 | — | Lead schema validation, unrelated to this phase | — |

### Supporting — no additions needed

| Library | Purpose | Why not adding anything new |
|---------|---------|------------------------------|
| `@sanity/image-url` (transitively present via `sanity`/`next-sanity`, not a direct dependency) | Sanity image URL builder with transform params | **Do not add as a direct dependency for this phase.** Existing GROQ queries already project `"imageUrl": image.asset->url` (raw CDN URL) and hand it to `next/image` with `fill`/`sizes`, which already handles resizing/format negotiation via Next's own image optimizer (confirmed `images.remotePatterns` in `next.config.ts` includes `cdn.sanity.io`). Introducing a second image-URL abstraction now would be inconsistent with every other image field in the schema. |
| `zustand` | Powers `useConsultationStore` (`src/components/consultation/store.ts`) | **Flagged, not a recommendation to add more usage.** See Common Pitfalls — `zustand` is used directly in source but is **not a direct dependency in `package.json`**; it currently resolves only because `@react-three/drei` depends on it transitively. |

### Alternatives Considered

| Instead of | Could use | Tradeoff / why not this phase |
|------------|-----------|--------------------------------|
| Client-side substring search over `searchKeywords[]` (D-14, locked) | Algolia / Typesense / Sanity's GROQ full-text `match` operator | D-14 explicitly locks out a search-engine dependency and faceted UI. Not evaluated further — this is a locked decision, not an open research question. |
| Native CSS scroll-snap rail (D-22, locked) | Embla Carousel / Swiper / Keen Slider | D-22 explicitly locks this to native CSS. Also: the codebase already has a working precedent for exactly this pattern (`ProductReel.tsx` comment: *"Horizontal reel on desktop (GSAP), CSS snap on mobile"*) — no new library needed, reuse the existing mobile-CSS-snap half of that component's approach. |
| Zustand for new Phase-9 discovery/filter-adjacent state | Extend the existing `useCollectionsState`-style plain-React-state hook pattern | The codebase's dominant, better-supported pattern is a single hook co-locating state + derived data (commit `cd42afc` deliberately established this). Given the `zustand` phantom-dependency issue above, prefer extending the hook pattern over introducing more Zustand usage in this phase. |

**Installation:** none required.

## Package Legitimacy Audit

**No new external packages are introduced by this phase.** The Package Legitimacy Gate protocol (slopcheck, registry verification, postinstall script check) was not run because there is nothing new to check — this section exists to record that explicitly rather than leave it silently blank.

One **pre-existing** dependency-hygiene issue was found and is relevant to this phase because Phase 9 touches the same file:

| Package | Registry | Status | Disposition |
|---------|----------|--------|-------------|
| `zustand` | npm | Used directly (`import { create } from "zustand"`) in `src/components/consultation/store.ts`, but **absent from `package.json` dependencies**. Resolves today only because `@react-three/drei` depends on it transitively (confirmed via `npm ls zustand`, which shows only `4.5.7`/`5.0.14` under `@react-three/drei`/`tunnel-rat`). | Not a slopsquat risk (zustand is a well-known, legitimate package) — this is a **phantom/transitive dependency risk**: a future bump or removal of `@react-three/drei` could silently break the consultation drawer with no direct signal in `package.json`. Recommend `npm install zustand` to pin it as a direct dependency **before** any Phase-9 code adds further `zustand` usage (see Common Pitfalls). |

## Architecture Patterns

### System Architecture Diagram

```
Sanity Studio (/studio)
  editors author: category (+ heroImage/gallery/searchKeywords),
                  brand, product (+ searchKeywords), space (new), siteSettings
        │
        ▼  GROQ queries (src/sanity/queries.ts) — server-only, via next-sanity client
        │
┌───────────────────────────────────────────────────────────────────┐
│  Next.js Server Components (RSC)                                   │
│                                                                      │
│  /collections/page.tsx  ──fetch──▶ getCategories, getBrands,        │
│                                    getSiteSettings, getSpaces (new)  │
│                                                                      │
│  /collections/[slug]/page.tsx (new) ──fetch──▶ getCategoryBySlug    │
│         │                                       (new, single doc)   │
│         │                                     getProductsByCategory │
│         │                                       (EXISTING, reuse)   │
│         │                                                            │
│  /collections/spaces/[slug]/page.tsx (new, flagged — see risks)      │
│         └──fetch──▶ getSpaceBySlug (new) + resolves linkedCategories │
└───────────────────────────────────────────────────────────────────┘
        │  props (categories, products, brands, settings, spaces)
        ▼
┌───────────────────────────────────────────────────────────────────┐
│  Client Components ("use client")                                   │
│                                                                      │
│  CollectionsClient.tsx  ──uses──▶ useCollectionsState (hook)         │
│     ├─ CollectionsHero (new)         ├─ SpaceIntentRail (new)        │
│     ├─ CollectionIndex (new, from CollectionFilterRail)              │
│     ├─ FeaturedChapters / CompactCollectionGrid (new)                │
│     ├─ BrandDiscovery (new)          ├─ CollectionSearch (new)       │
│     ├─ ProductCard (retained)        ├─ ShortlistPill (retained)     │
│     └─ ProductDetailDrawer (retained, ?product=<slug> deep link)     │
│                                                                      │
│  CategoryDetailClient.tsx (new) — same ProductCard/Drawer, scoped    │
│  to one category's product set only                                 │
│                                                                      │
│  useConsultationStore (Zustand) ──opens──▶ ConsultationDrawer        │
│  (brand tiles, category CTAs, hero CTAs all route through this)      │
└───────────────────────────────────────────────────────────────────┘
        │
        ▼  wa.me/<number>?text=<prefilled>
   WhatsApp (primary conversion mechanism, unchanged)
```

### Recommended Project Structure (additions only)

```
src/app/collections/
├── page.tsx                        # existing — rebuild per 09-UI-SPEC.md, keep server component
├── CollectionsClient.tsx           # existing — recompose with new components below
├── [slug]/
│   └── page.tsx                    # NEW — category detail route (D-15)
├── spaces/
│   └── [slug]/
│       └── page.tsx                # NEW — only if a space has >1 linkedCategories (see 09-UI-SPEC.md §2; flagged for D-16 amendment)
src/components/collections/
├── CollectionsHero.tsx              # NEW (09-UI-SPEC.md §1)
├── SpaceIntentRail.tsx              # NEW (§2)
├── CollectionIndex.tsx              # NEW, rebuilt from CollectionFilterRail.tsx (§3)
├── FeaturedChapters.tsx             # NEW (§4)
├── CompactCollectionGrid.tsx        # NEW (§5) — also reused by the space-landing route
├── BrandDiscovery.tsx               # NEW, reuses InteractiveBrandWall.tsx + BrandTrustStrip.tsx patterns (§6)
├── CategoryDetailClient.tsx         # NEW (§7)
├── CollectionSearch.tsx             # NEW, rebuilt from CollectionSearchBar.tsx, filter half removed (§8)
├── ProductCard.tsx                  # RETAINED unchanged interface
├── ShortlistPill.tsx                # RETAINED unchanged
├── ProductDetailDrawer.tsx          # RETAINED unchanged (NAV plan S3E)
├── CollectionFilterRail.tsx         # REMOVE (D-18)
└── MobileFilters.tsx                # REMOVE (D-18)
src/sanity/schemaTypes/
├── space.ts                         # NEW
├── category.ts                      # ADD heroImage, gallery[], searchKeywords[]
├── product.ts                       # ADD searchKeywords[]
├── siteSettings.ts                  # ADD defaultCategoryImage (fallback)
└── index.ts                         # register spaceType
src/sanity/queries.ts
├── getCategoryBySlugQuery / getCategoryBySlug()     # NEW
├── getSpacesQuery / getSpaces()                     # NEW
├── getSpaceBySlugQuery / getSpaceBySlug()           # NEW (only if spaces route ships)
└── getProductsByCategoryQuery                       # EXISTING — reuse verbatim, already parametrized by $categorySlug
```

### Pattern 1: Dynamic category route with `async params` (Next.js 16)

**What:** In Next.js 16, `params` on a Page/Layout/Route Handler is a `Promise` and must be awaited (or unwrapped with React's `use()` in a Client Component). This is a hard requirement in 16, not a soft deprecation — the synchronous-access fallback that existed transitionally in Next.js 15 is gone.
**When to use:** Every new file under `[slug]` in this phase.
**Example:**
```tsx
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes (v16.3.3 docs, fetched this session)
// app/collections/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getCategoryBySlug, getProductsByCategory, getSiteSettings, getBrands } from "@/sanity/queries";

export const revalidate = 60; // same convention already used by /collections/page.tsx

export async function generateStaticParams() {
  const categories = await getCategorySlugs(); // new, minimal GROQ: *[_type=="category"]{ "slug": slug.current }
  return categories.map((c) => ({ slug: c.slug }));
  // dynamicParams defaults to true — a category slug NOT in this list still
  // renders on-demand at request time and is cached thereafter. New categories
  // added in Studio need no redeploy.
}

export default async function CategoryPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, brands, settings] = await Promise.all([
    getProductsByCategory(slug), // EXISTING query — do not call getAllProducts() here
    getBrands(),
    getSiteSettings(),
  ]);

  return <CategoryDetailClient category={category} products={products} brands={brands} settings={settings} />;
}
```

### Pattern 2: Reuse the already-parametrized product query — avoid the full-dataset refetch

**What:** `src/sanity/queries.ts` already exports `getProductsByCategoryQuery` (`*[_type == "product" && category->slug.current == $categorySlug]`). It is currently unused by any page — `/collections/page.tsx` instead calls `getAllProducts()` and filters client-side. The new `/collections/[slug]/page.tsx` should call this existing, parametrized query directly.
**When to use:** Every category detail page fetch. This directly answers the research-focus question "how to avoid refetching the entire dataset per category page" — the query already exists, it is simply unused today.
**Example:** see Pattern 1 above (`getProductsByCategory(slug)`).

### Pattern 3: Time-based ISR is sufficient — no Cache Components, no tag-based revalidation infra needed

**What:** Next.js 16 shipped a new opt-in "Cache Components" model (`cacheComponents`/`dynamicIO` flag) where caching becomes fully explicit (`"use cache"` directive) and fetches are dynamic by default. **This project does not enable that flag** (confirmed by reading `next.config.ts` — no `experimental.cacheComponents`). Under the "Previous Model" (the default, and what this project already runs), `export const revalidate = N` on a page still works exactly as it does today on `/collections/page.tsx`: a page with no `cookies()`/`headers()`/dynamic `searchParams` access is eligible for the Full Route Cache and revalidates every `N` seconds.
**When to use:** Set `export const revalidate = 60` (matching the existing `/collections/page.tsx` convention) on both new routes. Do not introduce `revalidateTag`/webhook-based on-demand revalidation — there is no `/api/revalidate` route in this codebase today, and building one is out of scope for this phase (would need a Sanity webhook + secret, not mentioned anywhere in CONTEXT.md).
**Source:** [Next.js docs — Caching and Revalidating (Previous Model)](https://nextjs.org/docs/app/guides/caching-without-cache-components), version 16.3.3, fetched this session, `lastUpdated: 2026-08-25`.

### Pattern 4: `defineType`/`defineField` for the new `space` document type

**What:** Match the exact structure already used by the sibling `subcategory.ts` and `curatedCollection.ts` types (both are simple `document` types with `name`/`slug`/`description`/`image`/`displayOrder` — `space` is one field larger: `linkedCategories[]`).
**Example:**
```ts
// Source: pattern extrapolated directly from src/sanity/schemaTypes/curatedCollection.ts (verified in this codebase)
import { defineField, defineType } from "sanity";

export const spaceType = defineType({
  name: "space",
  title: "Space",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Space Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) =>
        rule.required().custom((value) =>
          value?.current === "spaces" ? 'Slug cannot be "spaces" — reserved by the /collections/spaces/[slug] route.' : true
        ),
    }),
    defineField({ name: "image", title: "Space Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "linkedCategories",
      title: "Linked Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({ name: "displayOrder", title: "Display Order", type: "number", initialValue: 0 }),
  ],
  preview: { select: { title: "name", subtitle: "description", media: "image" } },
});
```
Then register in `src/sanity/schemaTypes/index.ts`: add `import { spaceType } from "./space";` and append `spaceType` to the `types` array.

Note the `slug` validation above — see Common Pitfalls, "The `spaces` slug collision," for why this is not optional.

### Anti-Patterns to Avoid

- **Adding a fetch-level `{ next: { tags } }` cache-tag system without a revalidation webhook to invalidate it.** Sanity's own recommended pattern (`client.fetch(query, params, { next: { revalidate, tags } })`) is real and well-documented, but tags without a `revalidateTag()` caller are strictly worse than the existing time-based approach — the cache would live indefinitely with no way to bust it. Only adopt tags if a `/api/revalidate` webhook route is also built; that is new infrastructure this phase does not need.
- **Introducing `generateStaticParams` and then treating a category not in the list as an error.** `dynamicParams` defaults to `true` — a category created in Studio after the last deploy will render on first request and then be cached. Do not set `dynamicParams = false`; doing so would 404 every category added between deploys, directly contradicting D-13's "empty categories are indexed" spirit (a category that exists but wasn't in the build-time list should still resolve).
- **Reintroducing `?category=`/`?brand=` query-param handling anywhere as a "quick fix" for the broken homepage links (see Common Pitfalls).** This would silently violate D-15/D-18 by restoring exactly the mechanism those decisions retire.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Brand name → canonical key normalization (dedupe "Häfele"/"Hafele"/"hafele-india" etc.) | A new ad-hoc string-matching utility for the brand wall | `normalizeBrandKey()` + `BRAND_ALIASES` pattern already in `src/components/catalog/CatalogLibrary.tsx` | It already solves exactly this problem for 22 brands with full-string-equality alias matching (explicitly avoids substring-match collisions, e.g. "kich" vs "kich-pro") — copy the pattern into the new `BrandDiscovery.tsx`, don't reinvent it |
| Image resolution fallback chain (`product.images[0] → category.image → siteSettings default`) | A new resolver module | Extend the existing `getProductDisplayImage()` in `useCollectionsState.ts` — replace its hardcoded PNG map with the new chain, keep the function shape/call sites | The hook is already the single call site every product card uses; changing its internals is lower-risk than adding a parallel resolver |
| Horizontal scroll-snap rail (D-22) | A new carousel abstraction, or a GSAP horizontal scroll setup | Plain CSS `overflow-x-auto snap-x snap-mandatory` + `snap-center` tiles | `ProductReel.tsx`'s own code comment states this exact pattern ("CSS snap on mobile") is already established sitewide — this is not a new technique for this codebase |
| Sanity image transforms (resize/format) | `@sanity/image-url` builder wired into every new image field | Raw `asset->url` GROQ projection + `next/image` `fill`/`sizes` | Confirmed as the pattern every existing image field already uses; `next/image`'s own optimizer (already configured for `cdn.sanity.io`) covers resize/format |
| Category-page contextual CTA wiring | A new CTA-context system | Existing `ConsultationContext` (`source`, `intent`, `category`, `brand`, `product` fields already defined in `src/components/consultation/ConsultationContext.ts`) + `useConsultationStore.openDrawer(context)` | The shape already supports `category: { slug, name }` and `brand: { slug, name }` — just needs a new `source` value added to the union (e.g. `"category_page"`) |
| Live category/brand counts for the hero stat row (D-09) | A new aggregation endpoint | `count(*[_type == "category" && status == "published"])` / equivalent GROQ `count()` directly in the existing `/collections/page.tsx` server fetch | GROQ's `count()` function computes this server-side in the same query round-trip; no separate endpoint needed |

**Key insight:** almost everything this phase needs already exists somewhere in this codebase in a slightly different shape (a richer brand registry here, a working scroll-snap pattern there, a CTA-context system a third place). The dominant risk is *not* missing capability — it's **three-to-seven near-duplicate implementations of the same concept** (brand rosters, category-family link tables) drifting out of sync, which is exactly what produced the F-05 blast radius below. Consolidate before extending.

## Common Pitfalls

### Pitfall 1: The brand roster has already drifted into three inconsistent hardcoded copies

**What goes wrong:** There is no single "the 20+ brands" list in this codebase today. Three different files each hardcode a brand roster, and they disagree:

| Source | Count | Notable inclusions/exclusions |
|---|---|---|
| `src/data/catalog.ts` `BRANDS` | 20 | **Missing Hettich and Kich** — two of the original "6 authorized brands." Used as the fallback when `sanityBrands.length === 0` in `/collections/page.tsx` and `/catalogs/page.tsx`. |
| `src/components/catalog/CatalogLibrary.tsx` `BRAND_REGISTRY` | 22 | Includes Hettich, Kich, plus a full alias table. The most complete and best-engineered of the three. |
| `src/components/BrandTrustStrip.tsx` `LANE_1_BRANDS`/`LANE_2_BRANDS` (already mid-edit, uncommitted per `git status`) | 23 | Includes Hettich, Kich, **plus Jaquar, Asian Paints, and Philips** — none of which appear in the other two lists, and none of which are architectural-hardware brands (bath fittings, paints, lighting/electronics respectively). |

**Why it happens:** each component was built independently over time, each with its own "current best guess" at the roster, and none of them reads from Sanity as the sole source when Sanity is empty (per `STATE.md`, production Sanity is currently "pending image population from CMS editors" — meaning the fallback arrays may be what's actually rendering in production right now).
**How to avoid:** Before writing any Phase-9 UI, reconcile these three lists into one canonical roster (recommend using `CatalogLibrary.tsx`'s `BRAND_REGISTRY` + alias table as the base, since it's the most complete for genuine hardware brands), seed it into Sanity as the 20+ `brand` documents, and either delete the two lesser fallback arrays or update them to match exactly. Flag the Jaquar/Asian Paints/Philips question explicitly to the business owner — it directly touches D-06 ("all 20+ brands are authorized dealer brands," no tier distinction) and needs the same kind of confirmation as F-04.
**Warning signs:** any PR that adds a brand name to only one of these three files.

### Pitfall 2: The real size of F-05 — homepage query-param deep links (verified by full-codebase grep, not the CONTEXT.md file list)

**What goes wrong:** CONTEXT.md's F-05 names only `CategoryDiscovery.tsx`. A full grep for `/collections?` across `src/` found **~55 hardcoded matches across 8 files**:

| File | Link pattern | Rendered on homepage today? |
|---|---|---|
| `src/data/home.ts` (`CATEGORY_FAMILIES`, `SIGNATURE_PIECES`) | `?category=X` / `?category=X&brand=Y` | Consumed by `MobileCategoryDiscovery.tsx` + `MobileProductReel.tsx` — **yes, mobile homepage** |
| `src/components/home/CategoryDiscovery.tsx` | `?category=X` (own **locally duplicated** array, not imported from `data/home.ts` despite that file's own code comment claiming otherwise) | Yes, desktop homepage |
| `src/components/home/ProductReel.tsx` | `?category=X&brand=Y` (own locally duplicated array) | Yes, desktop homepage |
| `src/components/BrandTrustStrip.tsx` | `?brand=X` (23 links) | Yes, homepage (mounted in `app/page.tsx`) |
| `src/components/Footer.tsx` | `` `/collections?category=${cat.slug}` `` and `` `/collections?brand=${brandSlug}` `` | Yes — Footer renders on `/`, `/collections`, and `/catalogs` |
| `src/components/home/BrandStrip.tsx` | `?brand=X` | **No** — not imported by `app/page.tsx`; appears to be dead/superseded code |
| `src/components/home/InteractiveBrandWall.tsx` | `?brand=X` | **No** — not imported by `app/page.tsx`; dead/superseded, but its *visual pattern* is explicitly reused by `09-UI-SPEC.md` §6 |

**Why it happens:** `useCollectionsState.ts` currently seeds `activeCategory`/`activeBrand` from `searchParams.get("category")`/`.get("brand")` on mount — every one of the links above works today for exactly that reason. D-18 removes the filter state those params drive; the links themselves are untouched by D-18 and will simply land visitors on the generic `/collections` page, silently ignoring their intent.
**How to avoid:** Treat this as its own explicit task, not a byproduct of touching `CollectionsClient.tsx`. Two sub-problems, both needing a decision (see Open Questions below): (a) `?category=X` links map cleanly to `/collections/[slug]` **only when X is already an individual category slug** — most of these links use *family*-level slugs (`kitchen-wardrobes`, `door-hardware`) that span 2-6 individual categories, so there is no 1:1 target; (b) `?brand=X` links have no dedicated route to point to at all (09-UI-SPEC.md §6 resolves this for the *new* brand-wall UI by opening the consultation drawer instead of navigating — the same resolution should be applied to these homepage links).
**Also fix while touching this:** `data/home.ts`'s own doc comment claims it is the shared source of truth for both viewports ("One source keeps the two viewports describing the same showroom") but `CategoryDiscovery.tsx` and `ProductReel.tsx` demonstrably do not import from it — they hold byte-for-byte-similar but independently maintained copies. Consolidating onto the one real shared source while fixing the hrefs prevents this exact class of drift from recurring.

### Pitfall 3: The `brand` TypeScript union is narrower in scope than CONTEXT.md's blast-radius estimate — verify before treating it as high-risk

**What goes wrong (or rather, doesn't):** CONTEXT.md states `src/data/catalog.ts:7` types `Product.brand` as a union of exactly 6 literals and calls it "blocking for D-05/D-07." Verified in this session: that union **is real**, but it only constrains the local `Product` interface used by the static 7-item `PRODUCTS` reference array in that one file (consumed only by `src/app/api/seed/route.ts` and merged as a fallback in `/collections/page.tsx`/`/catalogs/page.tsx`). The **actual runtime `Product` type** used everywhere else — `src/types/catalog.ts`, imported by `useCollectionsState.ts`, `CollectionsClient.tsx`, `ProductCard.tsx`, `ProductDetailDrawer.tsx`, and the test in `catalogFiltering.test.ts` — already types `brand?: string` (loose). Widening the literal union in `data/catalog.ts` to `string` is a backward-compatible TypeScript change (widening a literal union to `string` never breaks existing literal assignments) and touches exactly one file.
**Why it matters:** don't over-plan a multi-file "brand type migration" task — the actual TS surface area here is one line in one file. Reserve planning effort for Pitfall 1 (data reconciliation) and Pitfall 2 (link repointing) instead, which are the genuinely large parts of D-07.
**How to verify before executing:** `grep -rn '"Hafele" | "Dorset"' src/` (or equivalent) to confirm no other file duplicates this exact literal union before widening.

### Pitfall 4: Lenis global smooth-scroll can fight the D-22 horizontal scroll-snap rail on desktop

**What goes wrong:** `SmoothScrollProvider.tsx` initializes a single Lenis instance on the whole document (`orientation: "vertical", gestureOrientation: "vertical"`), which intercepts wheel events document-wide to animate the page's own scroll. Lenis's own documentation and a tracked upstream issue confirm that elements with their own independent scroll (nested scroll containers, including horizontal ones) do not reliably receive wheel/scroll events unless explicitly excluded.
**Why it happens:** Lenis hijacks the wheel listener at the document level by design; a nested `overflow-x-auto` rail is exactly the kind of element that needs explicit opt-out.
**How to avoid:** Add `data-lenis-prevent` (and CSS `overscroll-behavior: contain`) to the `SpaceIntentRail`'s scrollable container. `gestureOrientation: "vertical"` already limits Lenis's *touch*-gesture hijacking, which is why mobile swipe on the rail is lower-risk than desktop mouse-wheel-over-the-rail — test both explicitly.
**Warning signs:** on desktop, hovering the mouse over the space-tile rail and scrolling the wheel either does nothing, scrolls the whole page instead of the rail, or feels "sticky"/inertial in a way that fights the native snap points.
**Source:** [darkroomengineering/lenis README](https://github.com/darkroomengineering/lenis/blob/main/README.md) (`data-lenis-prevent` documented), [Issue #257](https://github.com/darkroomengineering/lenis/issues/257) (nested horizontal-instance scroll conflicts) — WebSearch-sourced, cross-referenced against the project's own `SmoothScrollProvider.tsx` config.

### Pitfall 5: The `spaces` slug would collide with the `/collections/spaces/[slug]` route

**What goes wrong:** Next.js App Router resolves static path segments before dynamic ones at the same level. If `/collections/spaces/[slug]/page.tsx` exists (per 09-UI-SPEC.md §2's flagged requirement) alongside `/collections/[slug]/page.tsx`, then a Sanity `category` document with the literal slug `spaces` becomes permanently unreachable at its own URL — the request `/collections/spaces` always resolves into the `spaces/` static folder tree, never into `[slug]="spaces"`.
**Why it happens:** standard Next.js file-based routing precedence (static segments win over dynamic segments at the same path depth) — not version-specific, applies to any App Router version.
**How to avoid:** Add a `slug` validation rule on the `category` schema (or at minimum a Studio-side warning) rejecting the literal value `spaces`. The `space` document type's own `slug` field should get the same guard as a defensive measure if spaces ever become independently routable in a future phase.
**Warning signs:** a 404 or wrong-content render at `/collections/spaces` if an editor ever names a category "Spaces".

### Pitfall 6: Six category fallback PNGs are large and unoptimized — don't upload them as-is

**What goes wrong:** `/public/cinema/categories/*.png` (the six files D-12 migrates into Sanity) are each 600-750KB. Uploading them to Sanity unchanged and serving them as `category.image`/`siteSettings` fallbacks would work functionally but would be a step backward for the LCP ≤2.5s gate this phase must not regress (per `QA_AND_ASSET_PROTOCOL.md` Stage B / `.agents/policies/performance.yml`).
**How to avoid:** Compress/convert to WebP (or let `next/image`'s own format negotiation handle it — it will, since the images are proxied through `cdn.sanity.io` → Next's optimizer regardless of source format) before or during the upload script. At minimum, verify actual rendered file size after upload rather than assuming Sanity's asset pipeline auto-optimizes source files.

### Pitfall 7: Contrast passes on flat color pairs — verify separately for text-over-imagery

**What goes wrong (already correctly handled by 09-UI-SPEC.md, restated here for the planner's benefit):** every flat color pair in the palette passes WCAG AA with wide margin — **independently re-computed in this research session** using the standard WCAG relative-luminance formula against the exact hex values in `globals.css`, and the numbers match `09-UI-SPEC.md`'s own table exactly (bone-on-black 15.57:1, gold-on-black 8.87:1, muted-grey-on-black 8.05:1). The one documented failure is bone/white text directly on a brass `#c8a96e` fill (1.76:1) — 09-UI-SPEC.md §Color already flags this and mandates `#090909` text on every filled brass surface.
**What still needs verification during build, not assumed from the flat-color numbers above:** this phase is heavily text-over-photograph (70% environment imagery per the visual-weighting target) — space tiles, chapter overlays, category hero. Flat-pair contrast math does not extend automatically to text sitting on a variable-content photograph. 09-UI-SPEC.md already specifies a scrim gradient (`linear-gradient(to top, rgba(9,9,9,0.92), rgba(9,9,9,0) 55%)`) under every such text block specifically to make legibility independent of the underlying photo — implement this scrim as specified, and don't skip it "because the photo looks dark enough" for any individual image, since that judgment will not hold across every future editor-uploaded photo.

### Pitfall 8: Duplicated Footer/Sanity fetches will become 4x once `/collections/[slug]` ships

**What goes wrong:** `<Footer>` is currently rendered independently in `app/page.tsx`, `CollectionsClient.tsx`, and `CatalogsClient.tsx` — each page independently fetches `settings`/`brands` and passes them down. `Footer` already contains a `pathname.startsWith("/studio")` self-suppression check, meaning it is already safe to mount globally.
**How to avoid (optional improvement, not required):** consider lifting `<Footer>` into `RootLayout` (`src/app/layout.tsx`) now, before a 4th page (`/collections/[slug]`) needs the same duplicated fetch-and-render. This is a genuine architecture improvement opportunity surfaced by this phase, not a blocking requirement — flag it to the planner as optional scope.

## Code Examples

### GROQ: single category by slug (new query needed)

```groq
// Source: pattern extrapolated from existing getProductsByCategoryQuery in src/sanity/queries.ts
*[_type == "category" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  eyebrow,
  description,
  overview,
  "heroImageUrl": heroImage.asset->url,
  "heroImageLqip": heroImage.asset->metadata.lqip,
  "galleryUrls": gallery[].asset->url,
  keyFeatures,
  suitableFor,
  "brands": brands[]->{ name, "slug": slug.current, "logoUrl": logo.asset->url },
  whatsappMessage,
  searchKeywords,
  status,
  featured
}
```

### GROQ: live counts for the hero stat row (D-09)

```groq
// Source: standard GROQ count() usage, verifiable in Sanity's own GROQ docs
{
  "categoryCount": count(*[_type == "category" && status == "published"]),
  "brandCount": count(*[_type == "brand"])
}
```

### CSS: native scroll-snap rail with Lenis opt-out (D-22 + Pitfall 4)

```css
/* Source: pattern established by ProductReel.tsx's mobile CSS-snap approach + Lenis's own
   documented data-lenis-prevent escape hatch (github.com/darkroomengineering/lenis) */
.space-intent-rail {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain; /* prevents rail-edge scroll from bleeding into page scroll */
  scroll-behavior: smooth;
}
@media (prefers-reduced-motion: reduce) {
  .space-intent-rail { scroll-behavior: auto; } /* positioning stays; animation doesn't */
}
.space-intent-tile {
  scroll-snap-align: center;
  flex: 0 0 80vw; /* 78-85vw per 09-UI-SPEC.md */
  aspect-ratio: 3 / 4;
}
```
```tsx
<div className="space-intent-rail" data-lenis-prevent role="list" aria-label="Explore by space">
  {spaces.map((s) => <SpaceTile key={s.slug} space={s} />)}
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact on this phase |
|--------------|------------------|---------------|------------------------|
| `params` as a synchronous prop on Page components | `params: Promise<{ slug: string }>`, must `await` or `use()` | Started Next.js 15, **fully required (no sync fallback) in Next.js 16** | Every new `[slug]` page in this phase must be written with the async signature from the start — there is no working synchronous shortcut on this installed version |
| Implicit "cache everything by default" fetch behavior (pre-15) | Fetches default to uncached; explicit opt-in via `fetch(url, { cache: 'force-cache' })`, route-segment `revalidate` config, or (opt-in, not used here) the new Cache Components `"use cache"` directive | Next.js 15 (fetch default flip), further formalized as an explicit opt-in model in Next.js 16's Cache Components feature | This project does **not** opt into Cache Components — the existing `export const revalidate = 60` route-segment pattern continues to work exactly as today and should be reused for the new routes, not replaced |

**Not deprecated, still current:** `generateStaticParams` + `dynamicParams` (default `true`) is unchanged in shape between Next 15 and 16 and is the correct tool if the planner wants build-time pre-rendering of the ~13 known category slugs while still allowing new ones to resolve on-demand.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|----------------|
| A1 | `919835190738` (not the QA doc's `919431111550`) is the correct/intended WhatsApp number, on the grounds that it's the one repeated in three independent shipped-code locations. | User Constraints (F-01) | If wrong, every WhatsApp CTA on the redesigned page routes to the wrong number — conversion-critical, must be confirmed by Mukesh before launch regardless of this research's lean |
| A2 | Recommending `CatalogLibrary.tsx`'s `BRAND_REGISTRY` (22 brands) as the reconciliation base, over `BrandTrustStrip.tsx`'s 23 (which adds Jaquar/Asian Paints/Philips) | Common Pitfalls #1 | If Jaquar/Asian Paints/Philips are in fact legitimate authorized-dealer brands the showroom carries, excluding them under-serves D-05/D-06; this is presented as a recommendation requiring owner confirmation, not a locked decision |
| A3 | Homepage `?category=X` links at the *family* level (5-6 groupings) have no clean 1:1 target under the new *category*-level (13 items) route, and therefore need an explicit mapping decision rather than a mechanical find-replace | Common Pitfalls #2 | If wrong (i.e., if a clean 1:1 mapping does exist that this research missed), the recommended "flag as Open Question" approach adds unnecessary planning overhead; verify against the actual `SHOWROOM_FAMILIES` → category slug table in `src/data/catalog.ts` before treating this as unresolvable |
| A4 | Time-based ISR (`revalidate = 60`) is sufficient for this phase and tag-based/webhook revalidation is out of scope | Architecture Patterns, Pattern 3 | If Mukesh needs near-instant reflect-on-save from Studio for the new routes, 60s-stale windows may be unacceptable and a revalidation webhook becomes in-scope after all — this is a product decision, not purely technical |

## Open Questions

1. **What does a homepage `?category=<family-slug>` link point to once D-18 ships?**
   - What we know: ~50 of the ~55 hardcoded links use family-level slugs (`kitchen-wardrobes`, `door-hardware`, `handles-knobs`, `bathroom`, `furniture-hardware`) that each span 2-6 individual `category` documents; only `/collections/[slug]` (one category) is in scope per D-15/D-16.
   - What's unclear: whether the intended resolution is (a) pick one "primary" category per family and accept the loss of specificity, (b) route through the new `space` concept instead (though D-02's 6 spaces don't map 1:1 onto the 5 legacy families either), or (c) drop the deep-link specificity entirely and point everything to `/collections`.
   - Recommendation: raise explicitly during planning/discussion rather than let an implementer decide ad hoc per file — this affects visible homepage behavior on a live production site.

2. **Where do `?brand=X` homepage links go?**
   - What we know: 09-UI-SPEC.md §6 already resolves this for the *new* brand-wall UI (opens the consultation drawer with brand context, no navigation). No `/collections/brand/[slug]` route exists or is proposed.
   - What's unclear: whether the ~28 existing homepage `?brand=X` links (BrandTrustStrip, Footer, dead-code BrandStrip/InteractiveBrandWall if ever revived) should adopt the same drawer-based resolution, or simply link to `/collections#brands`-style anchor (which is technically a scroll, arguably against D-15's spirit but D-15's rule is scoped to "discovery targets," not every link on the site).
   - Recommendation: apply the same drawer-opening pattern 09-UI-SPEC.md already chose for consistency — one interaction model for "click a brand," not two.

3. **Is `/collections/spaces/[slug]` folded into the D-16 route-lock amendment, or re-flagged to the owner?**
   - What we know: 09-UI-SPEC.md §2 states this route is structurally required (any space with >1 `linkedCategories`) and explicitly flags that it is not named in D-15/D-16.
   - What's unclear: whether the planner has authority to fold it in during planning (treating it as a necessary consequence of already-locked D-01/D-02/D-11), or whether it needs to go back through the same owner-approval channel as F-01 through F-05.
   - Recommendation: treat as confirmed-necessary (09-UI-SPEC.md already reasoned through the alternatives and rejected them as filter-UI-in-disguise, which would violate D-18) and fold into the route lock, flagging it explicitly in the plan's summary for visibility rather than treating it as silently already-decided.

4. **Jaquar / Asian Paints / Philips — authorized dealer brands, or a business-truth error in `BrandTrustStrip.tsx`?**
   - What we know: these three appear only in the already-mid-edit `BrandTrustStrip.tsx`, not in `CatalogLibrary.tsx`'s more carefully-aliased 22-brand registry, and are not architectural hardware brands.
   - What's unclear: whether this is a deliberate, business-approved expansion (a hardware showroom co-selling paints/lighting) or drift/error.
   - Recommendation: confirm with Mukesh in the same pass as F-04's "7,500 sq ft" and D-09's "20+ years" claims — same category of unverified business-truth claim.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Sanity Studio / project (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`) | All schema changes, all new GROQ queries, PNG-asset migration script | Not verifiable from this sandbox (env vars not inspected for secrecy reasons) — per `STATE.md`, production credentials were confirmed working as of the Phase 8 P0-blocker resolution | — | None — this phase cannot ship without a working Sanity connection; verify credentials are still valid before starting schema work |
| `node`/`npm` | Local dev, `npm run build`/`lint`/`test` | ✓ (confirmed — `npm view` calls succeeded this session) | — | — |
| Vercel deployment target | Final rollout | Assumed available per `.planning/STATE.md` launch-gate sequence (Phase 8) | — | — |

No other external dependencies are introduced by this phase (no new SaaS, no new CLI tools, no new build steps).

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.11 |
| Config file | `vitest.config.mjs` — `include: ["src/**/__tests__/**/*.test.ts"]`, `environment: "node"`, `@/*` alias resolved to `./src/*` |
| Quick run command | `npx vitest run src/hooks/__tests__/useCollectionsState.test.ts` (or the specific new test file) |
| Full suite command | `npm test` (= `vitest run`) |

Existing test files (all under `src/**/__tests__/`): `useCollectionsState.test.ts`, `catalogFiltering.test.ts`, `scrollLock.test.ts`, `catalog.test.ts` (types), `schema.test.ts` (leads). Config only picks up `.ts` files, not `.tsx` — component-level tests are not currently exercised by this suite; this phase's new logic (link-target resolution, search-keyword matching, brand-roster reconciliation) is naturally unit-testable in `.ts` and fits the existing pattern.

### Phase Requirements → Test Map

Since this phase has no `REQUIREMENTS.md` (requirements are carried by CONTEXT.md's D-01…D-23), this maps each locked decision with testable logic to a concrete test target:

| Decision | Behavior | Test Type | Automated Command | File Exists? |
|----------|----------|-----------|---------------------|-------------|
| D-14 | Search matches against `searchKeywords[]` in addition to name/description/model | unit | `npx vitest run src/lib/__tests__/catalogFiltering.test.ts` (extend existing `filterProducts` test, or add `filterProductsByKeywords`) | ✅ file exists, extend it |
| D-12 | Image resolution chain `product.images[0] → category.image → siteSettings default` returns correct fallback at each tier | unit | `npx vitest run src/hooks/__tests__/useCollectionsState.test.ts` (extend — test `getProductDisplayImage` directly, replacing the removed PNG-map assertions if any exist) | ✅ file exists, extend it |
| D-03 | Featured-chapter cap enforces 3-5 regardless of how many categories have `featured: true` | unit | `npx vitest run src/components/collections/__tests__/FeaturedChapters.test.ts` | ❌ Wave 0 — new file, new directory |
| D-04 | Collection index renders every published category ordered by `displayOrder`, no de-duplication/grouping bugs | unit | same new test file above, or a shared `__tests__` for collection-index logic | ❌ Wave 0 |
| D-07 (brand roster reconciliation) | The canonical brand list used across homepage/collections/catalogs is single-sourced and internally consistent (no file diverges) | unit | a new `src/data/__tests__/brands.test.ts` asserting `BRANDS.length` and membership match the reconciled canonical list | ❌ Wave 0 — this is the single highest-value new test given Pitfall 1 |
| F-05 remediation | Every hardcoded homepage link matches an existing category/space slug (no dangling `?category=ghost-slug`) | unit (data-shape assertion, not a live Sanity fetch) | a new `src/data/__tests__/homeLinks.test.ts` cross-checking `CATEGORY_FAMILIES`/`SIGNATURE_PIECES` hrefs against `CATEGORIES` slugs in `data/catalog.ts` | ❌ Wave 0 |
| D-22 | `prefers-reduced-motion` disables `scroll-behavior: smooth` on the rail without disabling snap positioning | manual-only | Chrome DevTools "Emulate CSS prefers-reduced-motion" + manual scroll test | — (CSS behavior, not unit-testable in Node environment) |
| Contrast (accessibility policy) | Every new text/background pair meets 4.5:1 | unit | a new `src/lib/__tests__/contrast.test.ts` using the same relative-luminance formula already independently verified in this research, asserting each pair in `09-UI-SPEC.md`'s color table | ❌ Wave 0 — cheap to add, catches regressions if hex values ever drift |

### Sampling Rate

- **Per task commit:** `npx vitest run <specific new/changed test file>`
- **Per wave merge:** `npm test` (full suite)
- **Phase gate:** full suite green + `npm run build` + `npx tsc --noEmit` + `npm run lint` before `/gsd:verify-work`, per CLAUDE.md's documented command list

### Wave 0 Gaps

- [ ] `src/components/collections/__tests__/FeaturedChapters.test.ts` — covers D-03 cap enforcement
- [ ] `src/data/__tests__/brands.test.ts` — covers D-05/D-07 roster consistency (highest-value new test, directly targets Pitfall 1)
- [ ] `src/data/__tests__/homeLinks.test.ts` — covers F-05 remediation (directly targets Pitfall 2)
- [ ] `src/lib/__tests__/contrast.test.ts` — covers accessibility policy regression protection
- [ ] Extend `src/lib/__tests__/catalogFiltering.test.ts` — D-14 `searchKeywords[]` matching
- [ ] Extend `src/hooks/__tests__/useCollectionsState.test.ts` — D-12 image fallback chain, and update/remove the hardcoded-PNG-map assertions this file may currently make once `getProductDisplayImage()` changes

## Security Domain

`security_enforcement` is not set in `.planning/config.json`, so per protocol it is treated as enabled. This is a public marketing/catalog site with no authentication, no user accounts, and no payment surface — most ASVS categories are not applicable, but the ones that are matter for this specific phase's new inputs.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | No | No user accounts anywhere on the public site; Studio auth is Sanity's own, unchanged by this phase |
| V3 Session Management | No | No sessions on the public routes |
| V4 Access Control | No | No per-user resources; Sanity Studio access control is unchanged, out of this phase's scope |
| V5 Input Validation | **Yes** | The search input (D-14) and the `$slug`/`$categorySlug` GROQ parameters are the only new user-influenced inputs this phase adds. Both are already handled correctly by the existing pattern: GROQ queries use `$param` placeholders (parameterized, not string-concatenated — confirmed in `getProductsByCategoryQuery`), which is the standard GROQ-injection mitigation. The search field itself only ever reaches client-side `Array.filter`/`.includes()` against already-fetched data — no query is built from raw search text, so there is no injection surface there at all. |
| V6 Cryptography | No | No new crypto surface introduced |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|------------------------|
| GROQ injection via unparameterized slug interpolation | Tampering | Always pass the slug via the query's `$slug` parameter object (`client.fetch(query, { slug })`), never via template-string interpolation into the GROQ string itself — the existing `getProductsByCategoryQuery` already does this correctly; the new `getCategoryBySlugQuery` must follow the same pattern (shown in Code Examples above) |
| Open redirect via WhatsApp deep-link construction | Tampering / Spoofing | All `wa.me` links in this phase are built from `settings.whatsappNumber` (Sanity-controlled, editor-only) or the hardcoded fallback constant — never from unsanitized user input — so there is no attacker-controlled redirect surface here; keep it that way when wiring the new per-category contextual CTA |
| Stored XSS via editor-authored rich text (`category.overview`, `product.overview` block content) | Tampering | Out of scope for this phase specifically (pre-existing field), but worth noting: `product.overview` is a Portable Text `array of block` field — if this phase's category-page render (§7, overview panel) ever renders raw HTML instead of using a Portable Text renderer (e.g. `@portabletext/react`, not currently a dependency), that would be a new XSS surface. Category's own `overview` field is currently a plain `text` (not Portable Text), so this specific risk does not apply to `category.overview` as it stands — confirm the render path uses plain-text escaping (React's default JSX text interpolation, which auto-escapes) and does not introduce `dangerouslySetInnerHTML` anywhere new |

## Sources

### Primary (HIGH confidence)
- [Next.js docs — Dynamic Route Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) — fetched this session, version banner confirms `16.3.3` (matches installed version exactly), `lastUpdated: 2026-06-09`. Confirms `params` is a `Promise`, `generateStaticParams`/`dynamicParams` behavior, `PageProps<'/route'>` typed-params helper.
- [Next.js docs — Caching and Revalidating (Previous Model)](https://nextjs.org/docs/app/guides/caching-without-cache-components) — fetched this session, version banner `16.3.3`, `lastUpdated: 2026-08-25` (4 days before this research). Confirms route-segment `revalidate` config still functions without opting into Cache Components, and that this project (no `cacheComponents` flag in `next.config.ts`) is on this model.
- Direct codebase reads (all cited inline above): `src/data/catalog.ts`, `src/types/catalog.ts`, `src/hooks/useCollectionsState.ts`, `src/app/collections/page.tsx`, `src/app/collections/CollectionsClient.tsx`, `src/sanity/schemaTypes/{category,brand,product,siteSettings,subcategory,curatedCollection,index}.ts`, `src/sanity/queries.ts`, `src/sanity/client.ts`, `src/sanity/env.ts`, `src/components/{BrandTrustStrip,Footer,ShowroomExperience}.tsx`, `src/components/catalog/CatalogLibrary.tsx`, `src/components/home/{CategoryDiscovery,ProductReel,BrandStrip,InteractiveBrandWall,HeroStage,FloatingCTA}.tsx`, `src/data/home.ts`, `src/app/api/seed/route.ts`, `src/lib/config.ts`, `src/lib/motionTokens.ts`, `src/components/providers/{MotionProvider,SmoothScrollProvider}.tsx`, `src/components/consultation/{store,ConsultationContext}.ts`, `next.config.ts`, `tsconfig.json`, `vitest.config.mjs`, `package.json`, `.planning/config.json`, `.agents/policies/{accessibility,performance}.yml`.
- `npm view <pkg> version` for `next`, `next-sanity`, `sanity`, `motion` — direct registry check, this session.
- `npm ls zustand` — direct dependency-tree check confirming the phantom transitive dependency, this session.
- Independent WCAG contrast computation (Node.js relative-luminance formula) run directly against this project's actual hex values — cross-validated against `09-UI-SPEC.md`'s own independently-stated numbers; both agree exactly.

### Secondary (MEDIUM confidence)
- [Sanity docs — Caching and revalidation in Next.js](https://www.sanity.io/docs/nextjs/caching-and-revalidation-in-nextjs) and related WebSearch results — confirms the `client.fetch(query, params, { next: { revalidate, tags } })` pattern as Sanity's documented recommendation; not currently used anywhere in this codebase, presented as an available-but-not-required option.
- [darkroomengineering/lenis GitHub repo](https://github.com/darkroomengineering/lenis) and [Issue #257](https://github.com/darkroomengineering/lenis/issues/257) — `data-lenis-prevent` and nested-horizontal-scroll conflict pattern, cross-referenced against this project's own `SmoothScrollProvider.tsx` configuration.

### Tertiary (LOW confidence)
- None — every claim above was either verified directly against this codebase/registry, verified against official/primary documentation, or explicitly logged in the Assumptions table.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages, all versions confirmed via direct `npm view` + `package.json` reads
- Architecture / routing / caching: HIGH — verified against official Next.js 16.3.3 docs matching the exact installed version, fetched same-session
- Brand/link blast radius (Common Pitfalls #1, #2): HIGH — derived from direct, exhaustive `grep` across `src/`, not estimated
- Sanity schema patterns: HIGH — extrapolated directly from working sibling schema types already in this exact codebase (`subcategory.ts`, `curatedCollection.ts`)
- Business-truth items (WhatsApp number, brand roster inclusion, "20+ years"/"7,500 sq ft" claims): LOW by nature — these require Mukesh's confirmation regardless of any code-level research and are logged as Open Questions / Assumptions, not asserted as fact

**Research date:** 2026-08-29
**Valid until:** ~2026-09-28 (30 days) for the architecture/routing findings (Next.js 16 caching model is new and actively documented — re-verify if more than a few weeks pass before implementation); the codebase blast-radius findings (brand rosters, hardcoded links) are valid until the next commit touches any of the named files — re-grep before executing if significant time has passed.
