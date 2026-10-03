# Hardware Collection — Rewritten Phase Roadmap
**As of 2026-09-26 (evening) · Second rewrite — corrects the first rewrite's stale Phase 11 narrative**

> **Why this file changed again the same day:** the first version of this document (committed
> `7910b1c`, morning of 2026-09-26) described Phase 11 as "95% done, 35 categories seeded,
> just needs photography." That was accurate for the branch state at the time, but three
> open feature branches — `feat/phase-12-route-consolidation` (PR #23),
> `feat/brand-priority-and-copy` (PR #24), and the now-superseded `feat/collections-family-index`
> (PR #18) — did substantial, already-committed work the same afternoon/evening that changes
> the taxonomy architecture outright. This version reads from those branches directly rather
> than from `main`, because `main` has not caught up yet (PRs #23 and #24 are still open).

---

## Executive Summary

Phase 9 is complete and merged. **Phase 12 replaces Phase 11's entire premise**: instead of
giving all ~50 board sub-items their own URL, the taxonomy is now consolidated into 11 routes
(5 families + 6 spaces), with sub-items rendered as sections inside their family's page. Phase
10 (brand plinth cards) is in progress on `feat/brand-priority-and-copy`. Phase 13 is planned
but not started, gated on PR #23 and #24 merging.

**Current branch state (not yet on `main`):**
```
main (7910b1c)
  └─ PR #23  feat/phase-12-route-consolidation   OPEN — Phase 12, route consolidation
       └─ PR #24  feat/brand-priority-and-copy    OPEN — brand data + Phase 10 visual work (this session)
```

PR #18 (`feat/collections-family-index`, "group the collection page by showroom family") is
still open but its intent looks superseded by PR #23 — worth confirming with the owner whether
it should be closed rather than merged.

---

## Completed Phases (0–9)

No change from the previous audit — these are on `main` and unaffected by today's branch work.

| Phase | Name | Status |
|---|---|---|
| 0 | Foundation & Freeze | ✅ COMPLETE |
| 1 | Sanity CMS Architecture | ✅ COMPLETE |
| 2 | Homepage | ✅ COMPLETE |
| 2.5 | Content & QA Corrections | ✅ COMPLETE |
| 3 | Catalog UX + Friction Layer | ✅ COMPLETE |
| 4 | Production Readiness | ✅ COMPLETE |
| 5 | Lead Operations | ✅ COMPLETE |
| 6 | Final QA | ✅ COMPLETE |
| 7 | Mukesh Acceptance | ✅ COMPLETE |
| 8 | Production Launch Verification | ✅ COMPLETE |
| 9 | Collections Guided Discovery Redesign | ✅ COMPLETE (18/18 plans, main @ 75093cf) |

---

## Phase 10 — Brand Showcase & Light Roster Presentation

**Status: IN PROGRESS, on `feat/brand-priority-and-copy` (PR #24)**

### Done this session
- ✅ **10-01** `BrandTrustStrip.tsx` (`/#brands`): logos now sit in optical plinth cards
  (`h-20 md:h-24 w-44 md:w-56`, `bg-white/90`, border `#E7E0D4`, shadow per spec). Logo max
  sizes reduced to fit the fixed card footprint; gaps tightened. Commit `e54d097`.
- ✅ **10-02 (partial)** `BrandDiscovery.tsx` (`/collections`, "Full Manufacturer Directory"
  grid): converted from a flat `aspect-[3/2]` tile grid to the same plinth card, wrapping-flex
  layout instead of fixed `grid-cols`. Same commit.

### Deliberately not touched, and why
- **`/catalogs` (`CatalogLibrary.tsx`)** — already uses the site's light CSS-variable palette
  (`--surface: #fbf5ea`, `--surface-raised: #f7f0e2`) via a global "bright base" default set in
  `globals.css`. It is not dark. Its card design (badge + logo + tagline + CTA) is a different,
  intentional pattern from the plinth wall — a reference-library listing, not a decorative brand
  strip — so it was left alone rather than forced into the plinth shape.
- **`CatalogViewerModal.tsx`** — root is `bg-[#0E0C0C] text-white`, deliberately dark. This is
  cinema/lightbox-mode chrome for reading PDF pages, the same convention as Preview, Lightroom,
  or a video player's theater mode. A light background here would glare against white PDF pages.
  Confirmed this is a design decision (see the component's own top-of-file doc comment), not a
  leftover dark theme — no change made.

### Remaining
- **10-03: Visual & responsive audit** — screenshot both updated surfaces on mobile/tablet/desktop,
  verify WCAG AA contrast, confirm no artificial filters. Not yet done (dev-server Sanity auth in
  this environment blocks a live render check; build/tsc/unit tests all pass clean).

---

## Phase 11 — Showroom Taxonomy Completion: SUPERSEDED

**Original plan (35 missing categories, each with its own URL, gated on 35 hero photos) is no
longer the plan.** Phase 12 (below) replaced it. The `11-CONTEXT.md` file still describes the
old approach and should be treated as historical — do not resume Wave 0–6 as written there.

What actually happened to the 35 categories: they still exist as Sanity documents (content), but
per Phase 12 they no longer get an individual route. They render as sections inside their
family's page instead. The "need 35 distinct hero photos before shipping" blocker is resolved
architecturally — a family page can ship with some sections photographed and others not, rather
than an all-or-nothing gate across 35 separate pages.

---

## Phase 12 — Collections Route Consolidation

**Status: DONE on `feat/phase-12-route-consolidation`, OPEN as PR #23, not yet merged to `main`**

### What it did
Collapsed `/collections/[slug]` from 54 routes to **11**: 5 showroom families
(`handles-knobs`, `door-hardware`, `bathroom-hardware`, `kitchen-wardrobes`, `furniture-hardware`)
and 6 spaces (`kitchen`, `entrance`, `wardrobe`, `bathroom`, `living-interior`, `commercial`). The
48 category documents remain in Sanity as content of these 11 pages — they simply no longer mint
a URL of their own.

Key mechanics (`src/lib/collections/routes.ts`):
- `ROUTABLE_COLLECTION_SLUGS` is the single source of truth for what gets a page.
- `/collections/[slug]/page.tsx` sets `dynamicParams = false` — this was required to actually
  enforce the cut, since `generateStaticParams` alone only controls prerendering; without the
  flag, non-listed slugs still rendered on demand (verified: sampled leaves went 200 → 404 only
  after adding it).
- The 13 pre-expansion categories that were possibly indexed now permanently redirect to their
  family page. The 35 September-seeded categories never resolved in production, so they need no
  redirect.
- `bathroom` is already a space slug and spaces resolve first, so the Bathroom **family** routes
  as `bathroom-hardware` to avoid the collision (documented as decision B-2).
- `sitemap.xml` now lists the 11 routes; the two retired category URLs were dropped.
- New `FamilySections.tsx` component renders "a section per board item" inside each family page.
- `HardwareFamilyIndex.tsx` and the homepage family cards now link through `collectionHref()`,
  which resolves a category to either its own page (if routable) or `#slug` anchor on its
  family's page.

At the time of this change, the CMS held 48 category docs, 1 product, and 0 hero images — so 47
of 48 category pages were rendering the empty state pre-consolidation. This was the real
motivating fact: shipping 47 near-identical empty pages was worse than 5 well-populated family
pages with clearly-labeled unphotographed sections.

### Still open before this can merge to main
- PR #23 review/approval
- Confirm PR #18 (`feat/collections-family-index`) is superseded and can close, not merge —
  needs owner or reviewer confirmation, not assumed here.

---

## Phase 13 — CMS Photography & Scheduled Offers

**Status: PLANNED, not started. Gated on PR #23 and PR #24 merging.**
See `.planning/phases/13-cms-photography-offers/13-CONTEXT.md` for full detail.

### Owner decisions locked 2026-09-26
- **D1:** Sanity manages all photography (not ImageKit or a second vendor) — already connected,
  already resizes/serves WebP/AVIF.
- **D2:** "Rotation" means two things: (a) swap any photo from Studio, live in ~60s, no deploy;
  (b) scheduled offer banners with start/end dates that appear and expire on their own.
- Explicitly **not** wanted: an auto-cycling homepage hero.

### Where things stand today
| | State |
|---|---|
| Sanity image CDN | Wired in, `cdn.sanity.io` allowed as a `next/image` host |
| Image URL builder | **None** — raw asset URLs served full-size; Studio crop/hotspot currently has no effect |
| Hardcoded images | 23 distinct files under `/public/cinema` and `/public/Hardware Collection`, referenced directly from components — no one can change them without a code deploy |
| Offers/highlights content type | Does not exist yet |
| Category photography | 0 of 53 categories have a hero image; cards share 6 renders |

### Planned waves
1. **Image foundation** — add `@sanity/image-url`, one `urlForImage()` helper using width+height
   (required for Studio crop/hotspot to actually take effect), project the full image object
   (not just `asset->url`) in GROQ, swap raw URL usage across category cards/family pages/product cards.
2. **Move 23 hardcoded images into the CMS** — add image fields to existing singletons
   (`homePage`, `siteSettings`); every field keeps today's file as fallback so nothing goes blank
   mid-migration.
3. **Scheduled offers** — new `offer` document type (title, line, hotspot image, optional linked
   category/product/brand, WhatsApp CTA, `startsAt`/`endsAt`, placement). Visibility via GROQ
   `now()` filter; pages already revalidate every 60s so an offer goes live/expires with no
   deploy. No prices or discount numbers — locked rules still apply ("Festival display now open"
   is fine; "20% off" is not without an explicit rule change).
4. **Studio ergonomics** — group image fields by page, add live status (Scheduled/Live/Expired)
   to the offers list view.

### Owner input still needed before Wave 3
- Which placements offers should appear in (homepage only vs. also collections/family pages).
- Whether an offer may ever state a discount (currently barred by locked rules).

---

## What's Actually Left to Ship

```
1. PR #23 (Phase 12) → review, merge to main
2. PR #24 (brand priority/copy + Phase 10 plinth cards) → 10-03 visual audit, review, merge to main
   (rebase onto main after #23 merges)
3. Confirm/close PR #18 as superseded
4. Phase 13 execution (image foundation → CMS photography migration → scheduled offers)
   — not started, owner decisions already locked
5. Launch gate: Sanity env vars into hardware-collection-6v, remove coming-soon banner, deploy
```

Photography is no longer an all-or-nothing 35-image blocker. Phase 12's family-page model means
categories can ship progressively — Phase 13's image pipeline is what makes adding each photo a
Studio-only action instead of a code change.

---

## Locked Rules (Immutable, unchanged)

- **Public routes:** `/`, `/collections`, `/collections/[slug]` (now 11, not 54), `/catalogs`
- **No e-commerce:** no pricing, no cart, no stock, no SKU
- **No fake products**
- **WhatsApp is conversion:** 919835190738 only, never 919431111550 in a `wa.me` link
- **Sanity is source of truth**, fallback is resilience-only
- **Typographic lock:** Cormorant Garamond (display) + DM Sans (body)
- **Visual system:** near-black `#131314` / gold `#e5c487`–`#c8a96e`, with light ivory `#FAF7F2`
  now confirmed for the brand-showcase surfaces (Phase 10)

---

## Evidence Trail

- Phase 12: `git show 54b9180`, PR #23, `.planning/phases/12-*/12-CONTEXT.md`
- Phase 13: `.planning/phases/13-cms-photography-offers/13-CONTEXT.md`, commit `6f111f8`
- Phase 10 (this session): commit `e54d097` on `feat/brand-priority-and-copy`
- Route source of truth: `src/lib/collections/routes.ts`
