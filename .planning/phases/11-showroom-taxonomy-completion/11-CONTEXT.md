# Phase 11 — Showroom Taxonomy Completion

**Status:** DRAFT — awaiting the photography dependency (Wave 0)
**Created:** 2026-09-05
**Gated on:** Phase 8 launch, Phase 10 light-theme conversion (shares category card surfaces)

---

## 1. Why this phase exists

The physical showroom board in Sakchi lists **5 families and ~50 sub-items**. The site
renders all 5 families correctly, and every one of the ~50 sub-item names already exists
in `src/content/fallback/catalog.ts` as a `subcategories[]` string.

But only **13** of them are browsable — the rest are display text with no page, no URL and
no products. A visitor who reads "Italian Collection" on the board and searches the site
for it finds nothing.

This phase closes that gap.

### Measured coverage at phase open (2026-09-05)

| Board family | Board items | Browsable | Missing |
|---|---:|---:|---:|
| Handles & Knobs | 11 | 0 | **11** |
| Door Hardware | 10 | 6 | 4 |
| Bathroom | 9 | 1 | **8** |
| Kitchen & Wardrobes | 9 | 6 | 3 |
| Furniture Hardware | 11 | 2 | **9** |
| **Total** | **50** | **15** | **35** |

Handles & Knobs is the sharpest gap: it is the showroom's headline family, and **not one**
of its eleven style collections has a page. The site's only two handle categories
(`main-door-handles`, `cabinet-wardrobe-handles`) are *placements*, not the *styles*
customers actually choose between.

---

## 2. What was already fixed before this phase (2026-09-05)

Done outside the phase because it was deterministic cleanup, not new content:

- **Sanity/fallback divergence closed.** Sanity carried 22 category documents against the
  fallback's 13. Nine were legacy or duplicated: `architectural`, `bath`, `kitchen`,
  `smart`, `wardrobe`, `cabinet-and-drawer-hardware`, and `doors` **three times over**
  (published, draft, and a second published copy). `kitchen` and `wardrobe` collided
  head-on with `space` documents of the same slug, making `/collections/kitchen`
  ambiguous — a live D-27 violation. Retired by `scripts/cms/reconcile-categories.ts`.
- **The single orphaned product repointed.** "Hafele Mortise Lock" hung off the legacy
  `doors` category; moved to `mortise-door-locks`.
- **`families[]` populated.** Every category document had an empty `families` array, so
  family grouping silently degraded to `primaryRail` alone. Now mirrors the authoritative
  `SHOWROOM_FAMILIES[].collectionSlugs` map.
- **Retired brand assets deleted** — `public/brands/{Jaquar.svg,asian_paint.svg,philips.png,philips.webp}`.
  D-26 stands: Philips and Jaquar are out. (Confirmed with the owner 2026-09-05. The board's
  LIGHTS and BATHROOM items are stocked from other partners, not from those two.)
- **Address confirmed.** "1/18, Kashidih, Near Durga Puja Maidan, Sakchi, Jamshedpur,
  Jharkhand 831001" is canonical. Already correct in `siteSettings`, `layout.tsx:75`,
  `Footer.tsx:106`, `privacy`, `terms` and `scripts/seed-truth.ts`. No NAP drift remains
  in the repo or the dataset; if a stale "Baradwari" variant appears on the deployed site
  it is a cache, not a source.

---

## 3. The hard dependency: content, not code

This phase is **~90% content production and ~10% engineering**. The route
(`/collections/[slug]`), the card grid, the empty state (D-13) and the schema all exist
and work. Nothing needs to be built to make a 14th category render.

What each new category needs, per `src/content/sanity/schemaTypes/category.ts`:

| Field | Required | Can an agent produce it? |
|---|---|---|
| `name`, `slug` | yes | yes — from the board |
| `description` | **yes** | draftable, needs owner sign-off |
| `heroImage` | **yes** | **no — needs photography** |
| `image` | no | **no — needs photography** |
| `primaryRail`, `families` | no | yes — deterministic |
| `overview`, `keyFeatures`, `searchKeywords` | no | draftable |
| `brands[]` | no | **no — owner must confirm who supplies what** |
| products | — | **no — locked rule: no fake/mock/placeholder products, ever** |

**The blocker is photography.** Sanity holds exactly **6 image assets** today
(`HC-03-{BATHROOM,DOORS,GLASS,KITCHEN,SECURITY,WARDROBE}.png`), shared across all
categories. There is not one photograph of a handle, a knob, a channel or a mirror
cabinet in the repo or the dataset. Eleven Handles & Knobs style collections cannot be
told apart without eleven distinct images — that is the entire point of a *style*
collection. Shipping eleven pages that share one generic render would be worse than
shipping none.

So: **Wave 1 cannot start until the showroom is photographed.** That is a business task,
not an engineering one, and it should be scheduled first.

---

## 4. Scope

### In scope
- Sequenced creation of the 35 missing categories in Sanity, family by family.
- A repeatable seeding script so each family is one reviewed commit, not 35 hand edits.
- A regression test asserting every `SHOWROOM_FAMILIES[].subcategories` string resolves to
  a routable category — the guard that stops this gap reopening.

### Out of scope
- Products. Categories can ship empty (D-13 renders a consultation-oriented empty state).
  Product entry is its own phase, gated on catalogue photography.
- Any new UI. If a category needs new UI to look right, that is a Phase 10 concern.
- Pricing, stock, SKUs — permanently out, per the locked rules.

---

## 5. Proposed waves

Each wave is one family: seed, review in Studio, verify routes, commit.

- **Wave 0 — Photography & copy.** Owner + photographer. 35 hero images at the
  1376x768 ratio the existing assets use. Owner confirms which brands supply each
  collection. *Blocking; no code.*
- **Wave 1 — Handles & Knobs (11).** Kids, Modern, Classical, Long Bar, Flush, Leather,
  Luxury, Wooden, Italian, Ceramic, Profile.
  Highest value; does the most to make the site match the board.
- **Wave 2 — Furniture Hardware (9).** Invisible Locks, Furniture Profiles, Furniture
  Locks, Carvings, Bed Fittings, Wheels & Legs, Office Fittings, Table Extension,
  Furniture Fittings.
- **Wave 3 — Bathroom (8).** Bathroom Shelf, Shaving Mirrors, SS Mirror Cabinets,
  Signages, Hooks, Mail Box, Ladders, Dustbins.
- **Wave 4 — Door Hardware (4).** Hotel Locks, Door Knobs, Door Sliding, Window Hardware.
- **Wave 5 — Kitchen & Wardrobes (3).** Kitchen Appliances, Lights, Kitchen Handles.
- **Wave 6 — Coverage gate.** The regression test above, plus a sitemap and internal-link
  pass so 35 new URLs are actually reachable and indexed.

Waves 1–5 are independent of each other and can reorder freely to follow whatever gets
photographed first.

---

## 6. Decisions (Resolved 2026-09-05)

- **D1 — Are the 11 Handles & Knobs items categories or filters?**
  *Decision:* **Categories.** They are *styles*, not hardware types. The board treats them as browsable, `primaryRail` already has a `handles-knobs` value, and D-18 forbids exposing them as filter UI.
- **D2 — "Kitchen Handles (Sale)".**
  *Decision:* **Ship as "Kitchen Handles", drop "(Sale)".** Pricing and promo language are barred by the locked rules.
- **D3 — Pluralisation.**
  *Decision:* **Match the board: "Bathroom Shelf" and "Mail Box".** The site should not disagree with the physical showroom wall.
- **D4 — Empty categories.**
  *Decision:* **Yes, categories may ship with zero products.** The site is a lead engine, not a catalogue, and D-13's empty state routes to a WhatsApp consultation, which is the actual conversion.

---

## 7. Verification

- `SHOWROOM_FAMILIES.flatMap(f => f.subcategories)` — every entry resolves to a category
  slug present in Sanity **and** in the fallback. This is the phase's definition of done.
- No `category` slug collides with a `space` slug (D-27).
- `/collections` hero count matches the real category count.
- Every new category has a distinct `heroImage` asset — no two categories share one.
- `npx tsx scripts/release-verification.ts` passes all six gates.
