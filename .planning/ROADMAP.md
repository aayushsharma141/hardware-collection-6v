# Roadmap: Hardware Collection

## Locked Architecture

- **Public routes:** `/` (Home) + `/collections` (Catalog; categories and families are sections on this one page) + `/catalogues`, `/privacy`, `/terms`. `/collections/[slug]` pages no longer exist — retired `/collections/<slug>` URLs permanently redirect via `next.config.ts` (architecture locked in commit ac1e889; originally amended by Phase 9 D-16, 2026-08-30, see 09-CONTEXT.md)
- **No fake products, no pricing, no e-commerce**
- **Sanity CMS is the single source of truth**
- **WhatsApp is the primary conversion mechanism**
- **Feature development: FROZEN**

---

- [x] **Phase 0 — Foundation & Freeze**
  System scaffolding, APEP topology, locked rules. COMPLETE.

- [x] **Phase 1 — Sanity CMS Architecture**
  Schema types, queries, studio route, env wiring. Architecture COMPLETE.
  ⚠️ Production credentials pending (P0 blocker).

- [x] **Phase 2 — Homepage**
  Navbar, Hero, BrandTrustStrip, ShowroomCinematic, ReviewsMobile (testimonials), Footer, WhatsApp CTA. COMPLETE.

- [x] **Phase 2.5 — Content & QA Corrections**
  Stale navigation removed, Labacha + Kich brand completeness fixed, focus-visible a11y added, JSON-LD updated. COMPLETE.

- [x] **Phase 3 — Catalog UX + Friction Layer**
  /collections page, product catalogue, CatalogViewerModal, search, filter (filter UI later deleted in Phase 9 plan 09-18), WhatsApp specialist CTA. Architecture COMPLETE.
  ⚠️ Official PDF catalogs pending (owner dependency — no substitution).

- [x] **Phase 4 — Production Readiness**
  Final QA: Sanity config → build verification → route audit → console audit → mobile → keyboard → CTA → SEO. COMPLETE.

- [x] **Phase 5 — Lead Operations**
  WhatsApp Business setup + Google Sheet lead pipeline. Does not block deployment. COMPLETE.

- [x] **Phase 6 — Final QA**
  Build verified, no hydration errors, graceful fallbacks validated. COMPLETE.

- [x] **Phase 7 — Mukesh Acceptance**
  Business truth validation: brands, products, descriptions, showroom, address, phone, testimonials, claims. COMPLETE.

- [ ] **Phase 8 — Production Launch** 🔄 IN PROGRESS
  Vercel → hardwarecollection.co → Search Console → GBP → Analytics.

- [x] **Phase 9 — Collections Guided Discovery Redesign** ✅ EXECUTED (all 19 plans have SUMMARY files; 09-19 is `complete_with_failures`)
  Replace filter-driven catalogue UX on `/collections` with progressive-disclosure showroom discovery:
  use-case entry, spaces, editorial chapters, brand paths, contextual WhatsApp CTAs.
  Canonical refs: `NAV_AND_COLLECTIONS_PLAN.md` (now retired to `_quarantine/stale-docs/.planning/`; §3B/§3C SUPERSEDED by this phase — see 09-CONTEXT.md)
  Gated on: Phase 8 launch complete. Feature freeze lifts only for this phase.
  **Plans:** 19 across 8 waves. See `.planning/phases/09-collections-guided-discovery/09-PLAN-OUTLINE.md`.

  - Wave 0 — 09-01 test scaffolds · 09-02 pure-logic modules · 09-03 doc corrections + owner decisions
  - Wave 1 *(blocked on Wave 0)* — 09-04 canonical brand roster · 09-05 space schema + slug uniqueness · 09-06 WhatsApp/consultation primitives
  - Wave 2 *(blocked on Wave 1)* — 09-07 GROQ + slug resolver · 09-08 space vocabulary + Sanity seed · 09-13 brand discovery
  - Wave 3 *(blocked on Wave 2)* — 09-09 image migration + search · 09-10 space rail + Tier-2 grid · 09-11 index + chapters · 09-12 hero + search field · 09-14 site-wide brand de-hardcode
  - Wave 4 *(blocked on Wave 3)* — 09-15 `/collections/[slug]` route
  - Wave 5 *(blocked on Wave 4)* — 09-16 atomic landing cutover · 09-17 homepage link repoint
  - Wave 6 *(blocked on Wave 5)* — 09-18 delete filter machinery
  - Wave 7 *(blocked on Wave 6)* — 09-19 Stage B performance + accessibility gate

  Cross-cutting constraints:
  - No visible filter UI anywhere (D-18) — enforced by grep gates in 09-16 and 09-18
  - Motion budget 150/180/200/220–250ms, with `.architecture-rule`'s 220ms as the one named exception
  - CLS ≤ 0.10 — every image surface carries a pinned aspect ratio
  - GROQ `$slug` always a fetch parameter, never interpolated (threat T-9-02)
  - Ships onto a live site: no wave may end with dangling links or a half-migrated roster

  ⚠ 09-03 is not executable by an agent — it holds three blocking owner decisions
  (WhatsApp number F-01, brand removals F-06, unverified claims F-04).

- [ ] **Phase 10 — Brand Showcase & Light Roster Presentation** 📋 READY TO EXECUTE
  Display all 21 authorized architectural hardware brands in authentic original conditions on luxury light ivory background.
  - Plan 10-01: Canonical brand list & aliases sync (`brands.ts`)
  - Plan 10-02: Homepage `BrandTrustStrip.tsx` visual upgrade with porcelain plinths
  - Plan 10-03: Visual & responsive audit on staging environment


- [ ] **Phase 11 — Showroom Taxonomy Completion** 📋 DRAFT — BLOCKED ON PHOTOGRAPHY
  Make the site's browsable taxonomy match the physical showroom board. The board lists
  5 families and ~50 sub-items; only 15 are browsable today. 35 categories are missing.
  See `.planning/phases/11-showroom-taxonomy-completion/11-CONTEXT.md`.

  - Wave 0 — photography + copy + brand attribution (owner; blocking, no code)
  - Wave 1 — Handles & Knobs (11 missing — the headline family has zero style pages)
  - Wave 2 — Furniture Hardware (9 missing)
  - Wave 3 — Bathroom (8 missing)
  - Wave 4 — Door Hardware (4 missing)
  - Wave 5 — Kitchen & Wardrobes (3 missing)
  - Wave 6 — coverage regression gate + sitemap/internal-link pass

  This phase is ~90% content production. The `/collections` catalogue sections, the card grid
  and the schema all already work (the old D-13 empty state went with the `[slug]` route;
  empty families are now omitted by `src/lib/collections/showroom.ts`) — nothing needs building to make a
  14th category render. The blocker is that Sanity holds exactly 6 image assets and not one
  photograph of a handle, knob, channel or mirror cabinet exists. Eleven *style* collections
  sharing one generic render would be worse than shipping none.

  Four owner decisions are open (D1 styles-as-categories, D2 drop "(Sale)",
  D3 pluralisation, D4 ship empty categories) — see §6 of 11-CONTEXT.md.

- [x] **Phase 12 — UI & Visual Polish** 📋 COMPLETE
  Elevate the visual aesthetic using GSAP + ScrollTrigger for subtle, luxurious micro-interactions and scroll animations across the site.
  See `.planning/phases/12-ui-polish/12-CONTEXT.md`.

- [x] **Phase 14 — UI/UX Refinement & Anti-UI-Slop Standardization** 📋 COMPLETE
  Formalize and stabilize site-wide UI/UX audit findings: mobile floating action buttons, consultation section with corrected 10+ years & 20+ brands metrics, collections hero carousel with offers integration, and architectural softened-hybrid anti-ui-slop styling.
  See `.planning/phases/14-ui-ux-refinement-anti-ui-slop/14-CONTEXT.md`.
