# Roadmap: Hardware Collection

## Locked Architecture

- **Public routes:** `/` (Home) + `/collections` (Catalog) ONLY
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
  Navbar, Hero, BrandTrustStrip, ShowroomExperience, Testimonials, Footer, WhatsApp CTA. COMPLETE.

- [x] **Phase 2.5 — Content & QA Corrections**
  Stale navigation removed, Labacha + Kich brand completeness fixed, focus-visible a11y added, JSON-LD updated. COMPLETE.

- [x] **Phase 3 — Catalog UX + Friction Layer**
  /collections page, ProductCatalog, CatalogViewerModal, search, filter, WhatsApp specialist CTA. Architecture COMPLETE.
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

- [ ] **Phase 9 — Collections Guided Discovery Redesign** ⏸ POST-LAUNCH
  Replace filter-driven catalogue UX on `/collections` with progressive-disclosure showroom discovery:
  use-case entry, spaces, editorial chapters, brand paths, contextual WhatsApp CTAs.
  Canonical refs: `.planning/NAV_AND_COLLECTIONS_PLAN.md` (§3B/§3C SUPERSEDED by this phase — see 09-CONTEXT.md)
  Gated on: Phase 8 launch complete. Feature freeze lifts only for this phase.
