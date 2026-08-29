# Phase 9: Collections Guided Discovery Redesign - Context

**Gathered:** 2026-08-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the filter-driven catalogue UX on `/collections` with a progressive-disclosure showroom
discovery experience, and expand the brand system from 6 hardcoded brands to 20+ CMS-managed brands
site-wide.

**In scope:**
- `/collections` landing redesign: hero, space-led intent tiles, editorial collection index,
  featured-collection chapters, brand discovery, expert/project enquiry paths
- New `/collections/[slug]` category routes (progressive disclosure + SEO addressability)
- Site-wide brand de-hardcoding (TypeScript union type, whitelist, JSON-LD, homepage surfaces)
- Sanity schema additions: `space` document type; `heroImage`, `gallery[]`, `searchKeywords[]`
  on `category`; `searchKeywords[]` on `product`
- Migration of `/public/cinema/categories/*.png` into Sanity as editable category assets
- Search upgrade from substring-only to keyword-enriched matching

**Out of scope:**
- Product hotspots on lifestyle imagery (deferred - see `<deferred>`)
- `/catalogs` route disposition (flagged for Phase 8 launch review, not modified here)
- Homepage redesign beyond what brand de-hardcoding requires
- Any pricing, cart, checkout, or e-commerce mechanic

**Gate:** Phase 8 (Production Launch) must complete first. The `Feature development: FROZEN` rule
lifts for this phase only.

</domain>

<decisions>
## Implementation Decisions

### Discovery Architecture

- **D-01:** Ship **two** entry systems, not the six proposed in the source brief. The brief's
  "Find What You Need" (S4), "Explore by Space" (S6), "I'm Looking For..." (S7), "Scenario Cards"
  (S9) and "START HERE" (S11) are five UI treatments of one intent vocabulary; shipping all of them
  would reproduce the density problem the redesign exists to solve. The two that ship are:
  **(a)** a space-led visual intent layer, **(b)** an editorial collection index.
- **D-02:** Tile vocabulary is **space-led** - `KITCHEN`, `ENTRANCE`, `WARDROBE`, `BATHROOM`,
  `LIVING / INTERIOR`, `COMMERCIAL`. Not action-led ("Secure your home"). Rationale: matches how
  homeowners describe the job, shorter labels survive mobile, and it maps onto the existing
  `SHOWROOM_FAMILIES_NAV` groupings.
- **D-03:** Collection hierarchy (Tier-1 cinematic chapters vs Tier-2 compact grid) is
  **CMS-driven** off the existing `category.featured` + `category.displayOrder` fields. No new
  fields needed for tiering. **Enforce a hard cap of 3-5 featured chapters in code** so the page
  cannot degrade back into all-large-cards if editors over-flag `featured`.
- **D-04:** The collection index lists **every published category**, ordered by
  `category.displayOrder`, numbered `01 -` upward. Not curated, not grouped, no "view all"
  expander - the index is the complete-access mechanism for visitors who already know the taxonomy,
  and curating it defeats that purpose.

### Brand System (20+ brands)

- **D-05:** The showroom now carries **20+ brands, not 6**. This supersedes the "6 authorized
  brands" rule in `.planning/STATE.md`, `.planning/ROADMAP.md` and
  `.planning/NAV_AND_COLLECTIONS_PLAN.md` S1. See `<flags>` - those three files need correcting.
- **D-06:** **All 20+ brands are authorized dealer brands.** No authorized-vs-stocked tier
  distinction is surfaced in the UI. The `AUTHORIZED DIGITAL SHOWROOM` eyebrow applies uniformly.
- **D-07:** Phase 9 owns the **full site-wide brand de-hardcode**, not a collections-only subset.
  A split would leave `/collections` showing 20+ while the homepage still shows 6.
- **D-08:** Brand discovery becomes **featured brands with editorial copy + a full alphabetical
  logo wall**. Driven by the existing `brand.featured` and `brand.displayOrder` fields. The source
  brief's six-card treatment (S14) does not scale to 20+.
- **D-09:** Hero stat row renders **live counts from Sanity** (published categories, published
  brands) so the numbers can never go stale or overstate. The "20+ YEARS OF SHOWROOM EXPERTISE"
  line is retained **only if Mukesh explicitly confirms it** - recorded as a launch-gate item, not
  as shipped copy.

### Content & CMS Model

- **D-10:** Category schema changes are **purely additive**: add `heroImage` (cinematic scene) and
  `gallery[]`; keep the existing `image` field serving as thumbnail. No migration, no editor rework,
  existing category documents keep rendering.
- **D-11:** New **`space` document type** in Sanity: `name`, `slug`, `image`, `description`,
  `linkedCategories[]`, `displayOrder`. Spaces are content, not code - Mukesh can add, reorder,
  re-photograph or retire a space from Studio with no deploy.
- **D-12:** The hardcoded `/public/cinema/categories/*.png` fallback map in
  `getProductDisplayImage()` is **deleted**. The six PNGs are uploaded into Sanity as category
  assets so they become editable. Resolution chain becomes
  `product.images[0]` -> `category.image` -> a `siteSettings` default.
- **D-13:** Empty categories (zero published products) are **indexed, not hidden or noindexed**.
  `category.overview`, `keyFeatures`, `suitableFor` and `brands` already exist in the schema; a
  category page built from those plus `heroImage` and an enquiry CTA is substantive content, not a
  thin page. This is also honest - the showroom stocks the range whether or not products are entered.
- **D-14:** Search synonyms live in **`searchKeywords[]` on `category` and `product` in Sanity**,
  not in a code constant. Mukesh adds the terms customers actually walk in saying, with no deploy.
  The field doubles as the source brief's S23 `seoKeywords`. Search remains a substring match over
  an enriched field - **no search engine dependency, no faceted-search UI.**

### Navigation & SEO

- **D-15:** Discovery targets are **real routes: `/collections/[slug]`** - not anchor scroll, not
  query params. This is the only option delivering the SEO addressability the source brief's S17
  requires, and it is what makes progressive disclosure genuine: the landing page stays short and
  cinematic, product depth loads only after the visitor expresses intent.
- **D-16:** **The public-routes lock is formally amended** from `/` + `/collections` only to
  `/` + `/collections` + `/collections/[slug]`. See `<flags>`.
- **D-17:** `.planning/NAV_AND_COLLECTIONS_PLAN.md` **S3B (Floating Command Bar) and S3C
  (12-column card spans) are SUPERSEDED** by this phase. The no-visible-filters rule replaces them.
  S3D and S3E remain binding as amended below. S4 (motion/accessibility budget) remains binding
  unchanged.
- **D-18:** **No visible filter UI anywhere.** No filter sidebar, no checkbox filters, no dropdown
  filter panels, no brand filter bar, no e-commerce-style category chips, no faceted search. This
  removes `CollectionFilterRail`, the brand dropdown in `CollectionSearchBar`, and `MobileFilters`
  in their current form.

### Conversion & CTAs

- **D-19:** The consultation shortlist **survives, re-framed**. NAV plan S3D stays functional (max 5
  items, numbered WhatsApp prefill) but all shopping vocabulary is removed - it reads as
  "Items for consultation", never as a cart. This satisfies the source brief's S21 objection to
  "marketplace-style shortlist mentality" without discarding working conversion machinery.
- **D-20:** `ASK A HARDWARE EXPERT` (S15) and `SEND PROJECT REQUIREMENT` (S16) appear **once each on
  the `/collections` landing page**. Category pages instead carry a **contextual** CTA driven by the
  existing `category.whatsappMessage` field - "Discuss your kitchen", not a generic contact button.
- **D-21:** Every WhatsApp CTA uses the approved number with a section-specific pre-filled message.
  **The approved number needs confirmation** - see `<flags>`, there are two different numbers in the
  canonical docs.

### Mobile

- **D-22:** Space tiles use a **native CSS scroll-snap horizontal rail**, not a JS carousel. This
  delivers the swipe feel the source brief's S16 asks for while staying keyboard-reachable and
  screen-reader-navigable, with no hidden-content traps. Must degrade under `prefers-reduced-motion`.
- **D-23:** Mobile is designed as its own flow, not a stacked desktop layout. Target: any major
  collection reachable in **1-2 interactions** without scrolling the full page.

### Claude's Discretion

Not discussed - planner and researcher decide within the constraints above:
- Chapter copy tone and per-collection editorial descriptions
- Exact motion timings (bounded by NAV plan S4: 150/180/200/220-250ms) and reveal choreography
- GROQ query shape, data-fetching strategy, and ISR/caching approach for the new routes
- Component file layout and decomposition
- How much technical metadata survives on the editorial product card
- Whether the scroll progress/active-chapter indicator (S11) ships at all
- Whether category pages reuse the existing lookbook drawer or navigate to a product view

</decisions>

<flags>
## Conflicts Requiring Owner Decision

These were surfaced during discussion and are **not** resolved by this phase. They need explicit
decisions before or during Phase 8 launch.

- **F-01 - Two different WhatsApp numbers in canonical docs.**
  `.planning/QA_AND_ASSET_PROTOCOL.md` S4.3 specifies `wa.me/919431111550`.
  `.planning/STATE.md` and all shipped code use `919835190738`.
  Conversion-critical. Must be reconciled before launch.

- **F-02 - Stale locked rules.** `.planning/STATE.md`, `.planning/ROADMAP.md` and
  `.planning/NAV_AND_COLLECTIONS_PLAN.md` S1 all lock "6 authorized brands". Per D-05 this is now
  20+. These files were NOT rewritten during discussion - locked rules should not be silently
  edited. They need an explicit correction pass.

- **F-03 - Route lock already breached.** `src/app/catalogs/page.tsx` shipped in commit `51472d2`
  despite the `/` + `/collections` only rule. Out of scope for Phase 9 (D-16 amends the lock for
  `/collections/[slug]` only). Flagged for Phase 8 launch review.

- **F-04 - Unverified showroom claim.** `.planning/QA_AND_ASSET_PROTOCOL.md` S5.2 references a
  "7,500 sq ft Sakchi showroom", while `.planning/NAV_AND_COLLECTIONS_PLAN.md` states there are to
  be no unverified sq ft claims. Related to D-09's "20+ years" question. Needs Mukesh confirmation.

- **F-05 - Homepage deep links break under D-15.**
  `.planning/QA_AND_ASSET_PROTOCOL.md` S4.2 specifies "Category Discovery: Card tap -> Filtered
  category in `/collections`". Those homepage links currently deep-link to filtered query params and
  must be repointed to `/collections/[slug]`. In scope for Phase 9 per D-07.

</flags>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase-governing specs
- `.planning/NAV_AND_COLLECTIONS_PLAN.md` - Locked 19 Aug 2026. **S3B and S3C SUPERSEDED by this
  phase (D-17).** S3D (shortlist pill) binding as re-framed by D-19. S3E (lookbook drawer:
  `?product=<slug>` deep-link, focus trap, ESC close, body scroll lock) binding unchanged.
  S4 (animation + accessibility budget: 150/180/200/220-250ms, full `prefers-reduced-motion` and
  keyboard compliance) binding unchanged. S1 brand count superseded by D-05.
- `.planning/QA_AND_ASSET_PROTOCOL.md` - Motion engine stack (`motion/react` + GSAP + R3F), the
  "one dominant motion idea per viewport" principle, the Stage A viewport/reduced-motion matrix, and
  **Stage B performance gates that this redesign must not regress: LCP <= 2.5s, CLS <= 0.10,
  INP <= 200ms, all filter/section transitions <= 0.35s, WebGL excluded from the initial route
  chunk.** Also the source of F-01, F-04 and F-05.
- `.planning/STATE.md` - Locked rules and the launch gate sequence. Note F-02 (brand count) and
  F-03 (route lock) before treating any single rule as current.
- `.planning/ROADMAP.md` - Locked architecture block and Phase 9 entry.
- `.planning/NEVER-BUILD.md` - Rejected-ideas register. Currently a template with no
  Hardware Collection entries; the deferred ideas below are candidates for it.

### Project instructions
- `CLAUDE.md` - Commands, stack, agent roles, quality rules.
- `.agents/AGENTS.md` and `.agents/registry.yaml` - Multi-agent registry and workspace boundaries.

### Sanity schema (all require changes this phase)
- `src/sanity/schemaTypes/category.ts` - Add `heroImage`, `gallery[]`, `searchKeywords[]` (D-10,
  D-14). Already has `overview`, `keyFeatures`, `suitableFor`, `brands`, `featured`, `displayOrder`,
  `whatsappMessage`, `primaryRail`, `families` - reuse, do not duplicate.
- `src/sanity/schemaTypes/brand.ts` - Already generic CRUD with `featured`, `displayOrder`,
  `authorizedStatus`, `logo`, `officialCatalog`. No cap on brand count - supports D-05 as-is.
- `src/sanity/schemaTypes/product.ts` - Add `searchKeywords[]` (D-14). Has `images[]`.
- `src/sanity/schemaTypes/index.ts` - Register the new `space` type (D-11).
- `src/sanity/schemaTypes/siteSettings.ts` - Add the default fallback image (D-12).

### Code to be modified
- `src/hooks/useCollectionsState.ts` - **Line 218** `standardBrands` 6-brand whitelist (D-07);
  `getProductDisplayImage()` hardcoded PNG fallback map (D-12); `SHOWROOM_FAMILIES_NAV` (D-02);
  substring search at the `displayCategories` memo (D-14).
- `src/data/catalog.ts` - **Line 7**: `brand` is a TypeScript union of exactly 6 string literals.
  A 7th brand will not type-check. Blocking for D-05/D-07.
- `src/app/collections/CollectionsClient.tsx` - Page composition.
- `src/components/collections/` - `CollectionFilterRail.tsx`, `CollectionSearchBar.tsx`,
  `MobileFilters.tsx` removed or rebuilt per D-18; `ProductCard.tsx` becomes editorial;
  `ShortlistPill.tsx` re-framed per D-19; `ProductDetailDrawer.tsx` retained per NAV plan S3E.
- Brand de-hardcode also touches: `src/app/layout.tsx` (JSON-LD), `src/app/page.tsx`,
  `src/components/BrandTrustStrip.tsx`, `src/components/Footer.tsx`,
  `src/components/catalog/CatalogLibrary.tsx`, `src/components/home/CategoryDiscovery.tsx`,
  `src/components/home/FloatingCTA.tsx`, `src/components/home/HeroStage.tsx`,
  `src/components/ShowroomExperience.tsx`, `src/data/home.ts`,
  `src/lib/__tests__/catalogFiltering.test.ts`.

### Not applicable
- `.planning/CONSTITUTION.md` - Generic platform boilerplate for a different product (designer
  decision platform, Dataset v1, FC/DIR/OI/PL artifacts). Only **Law 6 - "Every Screen Exists to
  Reduce Cognitive Load: what should I know / what should I do / why"** is genuinely apt here and
  supports this redesign. Do not treat the rest as binding.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/hooks/useCollectionsState.ts` - Shortlist logic, WhatsApp prefill construction
  (`getWhatsAppShortlistLink`), `?product=` URL sync with focus restoration, and centralized scroll
  lock all survive the redesign. Filter state (`activeCategory`, `activeBrand`,
  `isBrandDropdownOpen`, `isMobileFilterOpen`) does not.
- `src/components/collections/ProductDetailDrawer.tsx` - Lookbook drawer is locked by NAV plan S3E
  and carries over unchanged.
- `src/lib/scrollLock.ts`, `src/lib/motionTokens.ts` - Established primitives; reuse rather than
  reimplement.
- `src/components/consultation/` - `FloatingConsultationCapsule`, `ConsultationDrawer`,
  `ConsultationForm`, `ConsultationSuccess` already exist and back the enquiry paths D-20 needs.
- `SHOWROOM_FAMILIES_NAV` in `useCollectionsState.ts` - Its six groupings (handles, door, bathroom,
  kitchen-wardrobes, furniture) are close to D-02's space vocabulary and give the space-to-category
  mapping a starting point.

### Established Patterns
- State ownership is isolated in a single hook (`useCollectionsState`) consumed by a thin client
  component - commit `cd42afc` deliberately extracted this. Preserve that separation.
- Sanity is the single source of truth; `src/data/catalog.ts` holds types plus static reference data.
- Motion via `motion/react` with `AnimatePresence mode="popLayout"`; GSAP reserved for cinematic
  desktop sequences; R3F gated to desktop >= 1024px.
- Tailwind v4 utility classes with inline hex tokens (`#090909`, `#c8a96e`, `#e8e3d9`) rather than
  a token layer - match the surrounding style.

### Integration Points
- `src/app/collections/page.tsx` - Server component fetching categories/products/brands/settings;
  the new `/collections/[slug]` routes need a sibling fetch path.
- Homepage `CategoryDiscovery` deep-links into filtered `/collections` and must repoint to the new
  routes (F-05).
- `src/app/layout.tsx` JSON-LD emits brand data - must reflect 20+ brands (D-07).
- `src/app/studio/[[...tool]]` - Embedded Sanity Studio; new schema types surface here automatically
  once registered in `schemaTypes/index.ts`.

</code_context>

<specifics>
## Specific Ideas

- The governing sentence for this phase, from the source brief: **"Don't make the collection page
  easier by giving users more controls. Make it easier by giving them better starting points."**
- Visual weighting target for chapter and space imagery: roughly **70% environment / 20% product
  detail / 10% text-interface** - contextual scenes over isolated product shots.
- The experience should read as walking a showroom with a knowledgeable salesperson:
  curiosity -> recognition -> discovery -> confidence -> enquiry.
- Four mental models must all be served: *"I know exactly what I want"* -> search;
  *"I know what I'm working on"* -> space tiles; *"I don't know what I need"* -> ask an expert;
  *"I already know the brand"* -> brand discovery.
- Visual identity is explicitly **not** being changed: near-black background, gold accents,
  Cormorant Garamond display, DM Sans body, fine borders, editorial section labels. This is UX
  evolution, not rebranding.
- Plain-language labels in primary navigation ("Kitchen Hardware", not "Modular Kitchen Fittings &
  Mechanisms"). Technical terminology appears only after the visitor enters a collection.
- Entire cards must be interactive targets, not small text links. Every visual card needs a title,
  a short description and a clear action - imagery is never the sole navigation affordance.
- Gold-on-black contrast must be measured against WCAG rather than assumed adequate because the
  palette is a luxury one.

</specifics>

<deferred>
## Deferred Ideas

- **Product hotspots on lifestyle imagery** (source brief S12D) - needs per-image coordinate
  authoring in Studio, a keyboard-accessible non-pointer equivalent, and a mobile interaction that
  is not hover. Own phase.
- **The four unshipped entry systems** - action-led use-case tiles (S4), "I'm Looking For..."
  natural-language paths (S7), scenario cards (S9), "START HERE" pathways (S11). Consciously cut by
  D-01 as redundant with D-02's space tiles. Revisit only with evidence that space-led entry
  under-serves a real visitor segment.
- **`/catalogs` route disposition** - see F-03. Phase 8 launch review.
- **Homepage redesign** beyond brand de-hardcoding - out of scope.
- **Scroll progress / active-chapter indicator** (S11) - listed under Claude's Discretion; if the
  planner judges it not to earn its place, it becomes a deferred idea rather than a gap.

### Reviewed Todos (not folded)
- `.planning/tasks/001-setup.md` - "Connect domain-specific sources" is the only open item;
  workspace-initialization scope, unrelated to this phase.

</deferred>

---

*Phase: 9-Collections Guided Discovery Redesign*
*Context gathered: 2026-08-29*
