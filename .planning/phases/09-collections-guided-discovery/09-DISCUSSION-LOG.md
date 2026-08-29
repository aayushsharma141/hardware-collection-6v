# Phase 9: Collections Guided Discovery Redesign - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-08-29
**Phase:** 9-Collections Guided Discovery Redesign
**Areas discussed:** Phase slotting, Nav lock disposition, Discovery layer consolidation,
Brand expansion at 20+, Imagery + CMS CRUD model, Navigation target + SEO, Empty categories,
CTA placement, Mobile tiles, Collection index

---

## Pre-discussion gates

The command was invoked with the full redesign brief in the phase-number argument, so no phase was
identified. Two blockers were resolved before gray-area analysis could start.

### Phase slotting

| Option | Description | Selected |
|--------|-------------|----------|
| New Phase 9, post-launch | Keeps the freeze and the Phase 8 launch gate intact; execution waits until hardwarecollection.co is live | ✓ |
| Insert Phase 7.5, pre-launch | Lifts the freeze and blocks launch until the redesign ships | |
| Reopen Phase 3 (Catalog UX) | Treat as a revision of the existing phase that delivered this page | |
| Discuss only, no roadmap change | Write CONTEXT.md standalone, decide slotting later | |

**User's choice:** New Phase 9, post-launch
**Notes:** ROADMAP.md and STATE.md both marked `Feature development: FROZEN` with Phase 8
(Production Launch) as the only open phase. Phase 9 was appended to ROADMAP.md manually after
`gsd-tools phase add` mis-parsed the roadmap's checkbox format and numbered the phase `1`; that
edit was reverted.

### NAV_AND_COLLECTIONS_PLAN.md lock disposition

| Option | Description | Selected |
|--------|-------------|----------|
| Supersede the locked plan | Brief wins; S3B and S3C marked superseded, no-visible-filters becomes the new lock | ✓ |
| Additive only, keep filters | Layer discovery above the existing rail and command bar; nothing removed | |
| Partial unlock, keep search | Remove rail, brand dropdown and mobile filter sheet; keep search; S3C stays locked | |

**User's choice:** Supersede the locked plan
**Notes:** The plan was marked "Fully locked on 19 Aug 2026" and its S3B/S3C lock the exact filter
command bar and card-span grid the brief removes. S3D (shortlist), S3E (lookbook drawer) and
S4 (motion budget) were explicitly held back from the supersede and remain binding.

---

## Discovery layer consolidation

**Framing raised before the question:** the brief proposes six overlapping entry systems (S4, S6,
S7, S9, S11, plus the index). *Secure your home* / *Entrance* / *A digital lock for my main door* /
*Upgrading home security?* / *I'm upgrading home security* are five UI treatments of one intent -
shipping all six would rebuild the density problem the redesign exists to solve.

| Option | Description | Selected |
|--------|-------------|----------|
| Two - intent tiles + collection index | One visual intent layer, one editorial index; the version that actually makes the page shorter | ✓ |
| Three - add Explore by Space | Adds a second framing, but carries two vocabularies for one intent | |
| Four - add START HERE text paths | Cheap and scannable, but a third restatement of the same six intents | |
| All six as written | Maximum entry coverage; page grows substantially | |

| Option | Description | Selected |
|--------|-------------|----------|
| Space-led - KITCHEN, ENTRANCE, WARDROBE | Matches how homeowners describe the job; maps onto existing SHOWROOM_FAMILIES_NAV | ✓ |
| Action-led - SECURE YOUR HOME | More editorial, but longer labels and reads closer to marketing copy | |
| Hybrid - space title, action subtitle | Keeps both; more copy per tile for editors to maintain | |

| Option | Description | Selected |
|--------|-------------|----------|
| CMS-driven via existing featured flag | category.featured and displayOrder already exist; no code change to re-tier | ✓ |
| Fixed 5 Tier-1 chapters, hardcoded | Predictable rhythm; lineup changes need a deploy | |
| Fixed 3 Tier-1 chapters | Tighter scroll, strongest contrast; may under-serve commercially important categories | |

**User's choice:** Two systems / space-led / CMS-driven tiering
**Notes:** A hard cap of 3-5 featured chapters was added to the CMS-driven option so the page cannot
degrade back into all-large-cards if editors over-flag `featured`.

---

## Brand expansion at 20+

**Mid-discussion correction from the user:** "remember we have 20 + brands" and "all image assets
are now in use its all need to crud function via cms". This invalidated the 6-brand rule locked in
three planning docs and reshaped both this area and the imagery area.

Scout finding presented: Sanity's `brand` schema is already generic CRUD with no cap, but the code
hardcodes 6 brands across 14 files - including a TypeScript union type at `src/data/catalog.ts:7`
that a 7th brand cannot type-check against, and a `standardBrands` whitelist at
`src/hooks/useCollectionsState.ts:218`.

| Option | Description | Selected |
|--------|-------------|----------|
| Phase 9 owns full site-wide de-hardcode | One brand source; no split-brain between collections and homepage | ✓ |
| Split - shared type + /collections now | Smaller blast radius; live site visibly inconsistent between deploys | |
| Prerequisite phase before Phase 9 | Cleanest sequencing; adds a phase boundary and delays the redesign | |

| Option | Description | Selected |
|--------|-------------|----------|
| Featured brands with copy + full logo wall | brand.featured and displayOrder already exist; scales to any number | ✓ |
| Flat logo wall, all brands equal | Simplest and most honest; loses the brand storytelling | |
| Text index only | Lightest footprint; drops the brand-logo trust signal | |

| Option | Description | Selected |
|--------|-------------|----------|
| Mixed - distinguish authorized from stocked | Protects the business-truth standard Phase 7 established | |
| All 20+ are authorized dealer brands | No distinction needed in the UI; eyebrow applies uniformly | ✓ |
| Mixed, but don't surface it | Simpler UI; risks implying authorization not held | |

| Option | Description | Selected |
|--------|-------------|----------|
| Live counts, drop the years claim | Counts never overstate; years dropped as unverified | |
| Live counts, keep years if Mukesh confirms | Same live counts; years held as a launch-gate item | ✓ |
| Drop the stat row entirely | Least claim risk; loses the orientation cue | |

**User's choice:** Full site-wide de-hardcode / featured + logo wall / all authorized / live counts
with years pending confirmation
**Notes:** The "6 AUTHORIZED BRANDS" hero stat was factually wrong as specced. STATE.md, ROADMAP.md
and NAV_AND_COLLECTIONS_PLAN.md S1 were deliberately **not** rewritten - locked rules should not be
silently edited, so the staleness is recorded as flag F-02 instead.

---

## Imagery + CMS CRUD model

| Option | Description | Selected |
|--------|-------------|----------|
| Add heroImage + gallery[], keep image as thumbnail | Purely additive; no migration, no editor rework | ✓ |
| Restructure into thumbnail + heroImage + gallery[] | Matches S23 exactly; costs a content migration | |
| Reuse the single image field everywhere | No schema change; one image cannot serve thumbnail and wide banner | |

| Option | Description | Selected |
|--------|-------------|----------|
| Migrate PNGs into Sanity, chain product to category to default | Hardcoded map deleted; everything becomes CRUD-able | ✓ |
| Keep /public/cinema as build-time defaults | Most resilient to an empty dataset; stays developer-managed | |
| No fallback - typographic placeholder card | Most honest; page looks unfinished until content is populated | |

| Option | Description | Selected |
|--------|-------------|----------|
| New space document type in Sanity | Matches S23 Space spec; add/reorder/retire from Studio with no deploy | ✓ |
| Derive spaces from existing categories | Zero new schema; forced mapping since ENTRANCE spans several categories | |
| Space config in code, imagery from CMS | Fast and type-safe; changing a space needs a deploy | |

| Option | Description | Selected |
|--------|-------------|----------|
| Out - defer to a later phase | Needs coordinate authoring, a11y equivalent, non-hover mobile interaction | ✓ |
| In, on Tier-1 chapters only | Limits authoring burden to a handful of images | |
| In, everywhere with CMS coordinates | Highest impact; largest scope and accessibility surface | |

**User's choice:** Additive schema / CMS-managed fallback chain / new space type / hotspots deferred
**Notes:** Driven directly by the user's "all need to crud function via cms" correction - the
hardcoded `getProductDisplayImage()` slug-matching map was the specific thing that had to go.

---

## Navigation target + SEO

**Raised before the question:** the route lock is already broken - `src/app/catalogs/page.tsx`
shipped in commit `51472d2` despite STATE.md restricting public routes to `/` and `/collections`.

| Option | Description | Selected |
|--------|-------------|----------|
| Category routes /collections/[slug] | Only option delivering the SEO addressability S17 requires; makes progressive disclosure genuine | ✓ |
| Anchor scroll on one long page | Touches no locked rule; page does not actually get shorter, one URL for all collections | |
| Query params - /collections?space=kitchen | Respects the lock's letter; query-param views index weakly | |

| Option | Description | Selected |
|--------|-------------|----------|
| Keep it, re-framed as a consultation list | Keeps working conversion machinery; only the shopping vocabulary goes | ✓ |
| Keep exactly as specced in S3D | Zero rework; keeps the e-commerce flavour S21 objects to | |
| Remove it per S21 | Calmest interface; loses multi-product enquiry | |

| Option | Description | Selected |
|--------|-------------|----------|
| searchKeywords[] on category and product in Sanity | Consistent with everything-CRUD-via-CMS; doubles as seoKeywords | ✓ |
| Synonym map as a code constant | Version-controlled and testable; every new phrasing needs a deploy | |
| No synonyms - rely on discovery layers | Least work; "smart lock" returns nothing, the exact failure S20 bars | |

| Option | Description | Selected |
|--------|-------------|----------|
| Out of scope - flag for Phase 8 launch review | A live-site correctness question, not post-launch redesign scope | ✓ |
| Amend the lock to permit /catalogs | Makes docs match reality in one move | |
| Fold /catalogs into /collections in Phase 9 | Restores two-route architecture; adds scope and needs redirects | |

**User's choice:** Category routes with the lock amended / shortlist re-framed / CMS searchKeywords /
`/catalogs` flagged not fixed
**Notes:** This resolved a direct contradiction inside the brief itself - S21 demanded removal of the
"marketplace-style shortlist mentality" while NAV plan S3D locked the shortlist pill and it was
already built and wired to WhatsApp. Resolution keeps the mechanic, drops the vocabulary.

---

## Second round - consequences of the route decision

| Option | Description | Selected |
|--------|-------------|----------|
| Index them - the category copy is the content | overview, keyFeatures, suitableFor and brands already exist; not a thin page | ✓ |
| noindex, but keep them reachable | Zero SEO risk; forfeits ranking on local category terms | |
| Omit until they have products | Cleanest SEO; hides ranges the showroom actually stocks | |

| Option | Description | Selected |
|--------|-------------|----------|
| Both once on landing, contextual CTA per category page | Uses the existing category.whatsappMessage field, per S19 | ✓ |
| Expert CTA on both, project pathway on landing only | More safety net, more repetition | |
| Both on every page | Maximum conversion surface; reintroduces the repeated-block feel | |

| Option | Description | Selected |
|--------|-------------|----------|
| Native scroll-snap rail | Swipe feel from S16 without carousel JS; keyboard and screen-reader safe | ✓ |
| 2-up compact grid | Nothing hidden off-screen; weaker cinematic effect | |
| Stacked full-width cards | Most immersive; ~6 screens of scrolling before the index | |

| Option | Description | Selected |
|--------|-------------|----------|
| Every published category, CMS displayOrder, numbered | The complete-access mechanism; curating it defeats its purpose | ✓ |
| Grouped by space, then category | Reinforces one mental model; harder flat scan for returning visitors | |
| Curated subset with a view-all | Visually compact; adds an interaction before direct access | |

**User's choice:** Index empty categories / landing-page CTAs with contextual per-category /
scroll-snap rail / full numbered index
**Notes:** The thin-page question only became live because of the route decision - on a single page,
`isDraftCategory` was a harmless placeholder; as its own URL it becomes indexable.

---

## Claude's Discretion

Deferred to planner and researcher within the locked constraints:
- Chapter copy tone and per-collection editorial descriptions
- Exact motion timings within the NAV plan S4 budget, and reveal choreography
- GROQ query shape, data-fetching strategy, ISR/caching for the new routes
- Component file layout and decomposition
- How much technical metadata survives on the editorial product card
- Whether the scroll progress / active-chapter indicator (S11) ships at all
- Whether category pages reuse the lookbook drawer or navigate to a product view

## Deferred Ideas

- Product hotspots on lifestyle imagery (S12D) - own phase
- The four unshipped entry systems: action-led tiles (S4), "I'm Looking For..." (S7), scenario cards
  (S9), "START HERE" (S11) - cut as redundant with space tiles
- `/catalogs` route disposition - Phase 8 launch review
- Homepage redesign beyond brand de-hardcoding
- Scroll progress / active-chapter indicator (S11)

## Conflicts Recorded, Not Resolved

Five conflicts were surfaced during discussion and written to CONTEXT.md as F-01 through F-05:
two different WhatsApp numbers across canonical docs; stale 6-brand locked rules in three files;
the pre-existing `/catalogs` route lock breach; the unverified "7,500 sq ft" showroom claim;
and homepage deep links that break under the new route structure.
