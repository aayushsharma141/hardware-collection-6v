# Phase 12 — Collections Route Consolidation

**Status:** Steps 1–5 and 7 DONE (PR #23, 2026-09-26). Remaining: step 6 (homepage cards), plus content (see §9).
**Created:** 2026-09-26
**Supersedes:** Phase 11's routing assumption (not its content work)

---

## 1. The decision

Collapse `/collections/[slug]` from **54 routes to 11**: five showroom families and
six spaces. The ~50 board sub-items stay fully visible as named, searchable content
inside the family pages — they simply stop each minting a URL.

Homepage collection cards use the **board's five families** (Handles & Knobs, Door
Hardware, Bathroom, Kitchen & Wardrobes, Furniture Hardware), not the five drawn in
the September mockup.

Owner-confirmed 2026-09-26.

## 2. Why this reverses Phase 11

Phase 11 made all 35 board items routable, on the reasoning (owner, 2026-09-05,
marked Certain) that category pages earn their keep through direct sharing, SEO and
deep product intent.

The measured state says otherwise:

| | |
|---|---:|
| category routes | 48 |
| products in the CMS | 1 |
| categories with a hero image | 0 |

Forty-seven of forty-eight category pages render the D-13 empty state, and forty-eight
URLs compete for the same local-search terms with nothing on them. The taxonomy was
real; the pages behind it were not.

**Content and routes are separate decisions.** Nothing from Phase 11 is discarded —
the 48 Sanity category documents become the content rendered inside 11 pages.

## 3. Blockers

### B-1 — The Sanity token no longer authenticates
`SANITY_API_TOKEN` in `.env.local` returns `Unauthorized - Session not found` as of
2026-09-26. It worked earlier the same day. A peer session is on
`security/rotate-evidence-signing-key`, so a credential rotation is the likely cause.
All CMS steps below are blocked until it is replaced.

### B-2 — `bathroom` is both a family slug and a space slug
`SHOWROOM_FAMILIES` and `SPACES` both claim `bathroom`. Routing both at 11 routes is a
direct D-27 violation, and `resolveCollectionSlug` resolves spaces first, so the family
page would be unreachable.

**Recommendation:** keep the space on `bathroom` (it is an established live route) and
route the family as `bathroom-hardware`. No redirect needed; nothing currently resolves
to a family slug.

### B-3 — 13 previously-live category URLs will stop resolving
The 13 categories that predate the September expansion have been live and prerendered
for months, and two of them — `digital-locks` and `mortise-door-locks` — are listed in
`sitemap.xml`, so they are very likely indexed.

Collapsing them without redirects turns indexed pages into 404s. **Every one of the 13
needs a permanent redirect to its family page** before this ships. The 35 added in
September need no redirect: they have never resolved.

## 4. A design note on the 11

Five families and six spaces overlap more than the count suggests:

| Family | Nearest space |
|---|---|
| Bathroom | Bathroom (same slug — B-2) |
| Kitchen & Wardrobes | Kitchen + Wardrobe |
| Door Hardware | Entrance |
| Handles & Knobs | *(none)* |
| Furniture Hardware | *(none)* |
| *(none)* | Living / Interior, Commercial |

Four of the eleven cover near-identical ground under two vocabularies. That is
defensible — it is the two-entry-system model of D-01, answering "what room am I
working on?" and "what kind of hardware?" separately — but it should be a deliberate
choice, not an accident of keeping both lists. If the page ever feels doubled, this is
why, and the spaces are the half to cut.

## 5. Work

1. **Resolve B-2** — family route slug.
2. **Create 5 family categories in Sanity.** They do not exist today; `CATEGORIES`
   holds 48 leaves and the families live only in `SHOWROOM_FAMILIES`. *(Blocked on B-1.)*
3. **Restrict routing to the 11.** `generateStaticParams` emits families + spaces only;
   `resolveCollectionSlug` resolves only those.
4. **Add the 13 permanent redirects** (B-3), plus a test asserting each old slug
   redirects rather than 404s.
5. **Rebuild the family page** to show its leaf items as sections, with products,
   authorised brands, and room for featured products and showroom highlights.
6. **Homepage cards → the five families.**
7. **Update `sitemap.xml`** — it hardcodes `digital-locks` and `mortise-door-locks`,
   both of which stop existing.

## 6. Effect on PR #18

[#18](https://github.com/aayushsharma141/hardware-collection-6v/pull/18) ships
`HardwareFamilyIndex`, which groups the collections page by family — still exactly
right, and more central under this direction. But its 53 leaf links point at routes
this phase removes.

**Do not merge #18 as-is.** Either rework its links to target family pages within this
phase, or merge it first and accept a short window where the links are correct, then
repoint them in step 3.

## 7. Carried forward, still unresolved

- The September mockup reintroduces "Near **Baradwari** Durga Puja Maidan". The settled
  value is "1/18, Kashidih, Near Durga Puja Maidan, Sakchi, Jamshedpur, Jharkhand
  831001" (owner, 2026-09-05). Do not let the mockup regress it.
- The mockup's nav adds `/brands`, `/showroom`, `/projects`, `/our-story` and
  `/contact` — five top-level routes that do not exist. "Simplify" reduces depth here
  but adds breadth; net page count may not fall.
- `heroImage` and brand attribution remain unset on the 35 September categories.

---

## 8. Progress — 2026-09-26

**Done, in PR #23:**

- **B-1 resolved.** Token replaced. *Note: the new token was pasted in plaintext into a chat
  transcript and a shell command during setup — rotate it.*
- **B-2 resolved** as recommended: the family routes as `bathroom-hardware`.
- **Step 2** — five family category documents created in Sanity by
  `scripts/cms/seed-family-categories.ts`. `searchKeywords` carries each family's full
  board sub-item list so every wall name stays searchable.
- **Step 3** — routing restricted to the 11, and actually *enforced* by
  `dynamicParams = false`. The first attempt restricted only `generateStaticParams`,
  which controls prerendering, not routing: the 42 non-routable categories kept
  rendering on demand because their documents exist in Sanity.
- **Step 4** — 13 permanent redirects. They were initially added before the family
  documents existed, which briefly made 13 live URLs redirect into 404s on an
  uncommitted `main`. Step 2 closed that before anything was pushed.
- **Step 7** — sitemap lists the 11.
- **Links** — `src/lib/collections/routes.ts` is now the single rule for where a
  category lives; every category link on the site goes through it. Verified: zero broken
  `/collections` links across 7 crawled pages.

**Remaining:**

- **Step 5** — the family page must render one section per board item with
  `id={categorySlug}`. Links already point at `/collections/<family>#<slug>`; until this
  lands they resolve to the top of the family page rather than the section.
- **Step 6** — homepage collection cards → the five board families.

---

## 9. Step 5 — family page sections (2026-09-26)

**Done.** Each family page renders one numbered section per board item, in board order,
with `id={categorySlug}` and `scroll-mt-28` to clear the fixed nav. Sections with products
expand into product cards; sections without stay a compact row with a WhatsApp enquiry.
A jump list at the top mirrors the showroom wall as in-page navigation (not a filter, D-18).

**It also fixed a regression the route consolidation introduced.** All 7 products on the
site (6 fallback + 1 in Sanity) belonged to categories that now redirect, and the family
pages only looked up products for their own slug, so every product appeared on no
collection page. Family pages now gather products across their members, with the same
per-category fallback the old category pages used. Verified by name in the browser.

Also fixed: the "Authorized Partners" line joined brand *objects*, which would have
printed `[object Object]` the moment a category got brands attached.

Verified on a production build: anchors land at 112px (just under the 96px nav) on direct
load, on click-through from /collections, and from the in-page jump list, with Lenis
active; 375px mobile has no overflow and every target is ≥44px; every WhatsApp link uses
the main number and the calling-only number appears nowhere.

**Content gaps this made visible — owner tasks, not code:**

1. **Brand attribution.** No category in Sanity has any authorised brand attached. The
   fallback holds verified brands for the 13 original categories (with unverified ones
   kept separately in `pendingVerificationBrands`); none of it reached the CMS.
2. **Descriptions.** All 35 September categories carry the same templated sentence —
   "Premium {name} for architectural and interior applications." Listed together on a
   family page, it reads as filler. Each needs one real line of copy.
3. **Photography** — unchanged from Phase 11: product cards without photos fall back to
   the family image, so a sink card shows a kitchen-drawer render.
