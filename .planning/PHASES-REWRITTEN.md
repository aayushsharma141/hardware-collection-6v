# Hardware Collection — Rewritten Phase Roadmap
**As of 2026-09-26 · Updated with actual completion status**

---

## Executive Summary

The site is **feature-complete at 95% delivery**. What remains is:
1. **Phase 10 execution** — Light theme visual upgrade (brand plinths, catalogue viewer styling)
2. **Phase 11 final gate** — Photography + coverage regression testing (all taxonomy is seeded)
3. **Live deployment** — Vercel hardwarecollection.co with Sanity env vars

The public API is locked: `/`, `/collections`, `/collections/[slug]`, `/catalogs`. No new routes or public features will ship.

---

## Completed Phases (0–9)

| Phase | Name | Status | Key Deliverables | Evidence |
|---|---|---|---|---|
| **0** | Foundation & Freeze | ✅ COMPLETE | System scaffolding, APEP topology, locked rules | BASE |
| **1** | Sanity CMS Architecture | ✅ COMPLETE | Schema types, queries, studio route, env wiring | Sanity dataset live, 48 categories, 6 spaces, 22 brands |
| **2** | Homepage | ✅ COMPLETE | Navbar, Hero, BrandTrustStrip, Testimonials, Footer, WhatsApp CTA | Live at `/` |
| **2.5** | Content & QA Corrections | ✅ COMPLETE | Stale nav removed, brand completeness, focus-visible a11y, JSON-LD | All Phase 2 content verified |
| **3** | Catalog UX + Friction Layer | ✅ COMPLETE | `/collections` page, ProductCatalog, search, filter UX, specialist CTA | Live at `/collections` |
| **4** | Production Readiness | ✅ COMPLETE | Build verification, route audit, console audit, mobile QA, keyboard, CTA, SEO | All CI gates passing |
| **5** | Lead Operations | ✅ COMPLETE | WhatsApp Business setup, Google Sheet pipeline, lead webhook | Operational in production |
| **6** | Final QA | ✅ COMPLETE | Build verified, no hydration errors, graceful fallbacks | 11/11 test suites, 62/62 tests green |
| **7** | Mukesh Acceptance | ✅ COMPLETE | Business-truth validation: brands, products, showroom, claims | Owner sign-off 2026-08-30 |
| **8** | Production Launch Verification | ✅ COMPLETE | Vercel deployment readiness, NAP verification, accessibility audit, consent compliance | hc-demo deployment green |
| **9** | Collections Guided Discovery Redesign | ✅ COMPLETE | 18 plans across 6 waves. Replaced filter-driven UX with progressive-disclosure showroom discovery. 35 missing categories seeded. | 18/18 plans done, main branch at commit 75093cf, all CI passing |

---

## Active Phases (10–11)

### Phase 10: Brand Showcase & Light Roster Presentation
**Status: READY FOR EXECUTION**  
**Owner decision dependency:** None — all 22 brand assets verified and in place

#### What's done
- ✅ All 22 brand assets verified, converted to transparent formats, deployed to `public/brands/`
- ✅ Architectural rules documented: light surface `#FAF7F2`, plinth cards, no filters
- ✅ `CANONICAL_BRANDS_BY_ID` and `src/content/fallback/brands.ts` canonical source established

#### What's remaining (3 plans)
1. **10-01: Homepage `BrandTrustStrip.tsx` light-theme upgrade**
   - Convert from dark to light ivory background
   - Apply plinth card styling (`h-20 md:h-24 w-44 md:w-56 px-6 py-4 rounded-xl bg-white/90 border border-[#E7E0D4] shadow-[0_2px_8px_rgba(0,0,0,0.02)]`)
   - Test: all 22 brands render in authentic colors on light background
   - Estimate: 2–3 hours

2. **10-02: Catalogue Library page styling alignment**
   - `/catalogs` page brand cards should match the light-theme treatment
   - Ensure the CatalogViewerModal uses consistent ivory background and branding
   - Test: brand card grid on desktop, tablet, mobile
   - Estimate: 1–2 hours

3. **10-03: Visual & responsive audit on hc-demo**
   - Screenshot both updated surfaces (homepage + /catalogs) on mobile, tablet, desktop
   - Verify no artificial filters, authentic brand colors preserved
   - Measure text readability (WCAG AA) on light backgrounds
   - Compare to reference light-theme catalog
   - Estimate: 1–2 hours

**Gated on:** None. Ready to execute immediately after Phase 9 merge.

---

### Phase 11: Showroom Taxonomy Completion
**Status: 95% DONE — AWAITING PHOTOGRAPHY**  
**Last updated:** 2026-09-26 amendment

#### What's done (Waves 1–5 = Data Layer)
- ✅ All 35 missing categories seeded to Sanity (script: `scripts/cms/seed-showroom-categories.ts`)
- ✅ Categories seeded to fallback `src/content/fallback/catalog.ts` (13 → 48 total)
- ✅ Board order preserved via `displayOrder` reconciliation
- ✅ Query projection updated: `getCategoriesQuery` now includes `families` and `primaryRail`
- ✅ `/collections/[slug]` routes working for all 54 paths (13 existing + 35 new)
- ✅ D-13 empty state handles missing products gracefully (routes to WhatsApp consultation)

**Verification snapshot:**
- Build: 54 paths pre-rendered (13 existing + 35 new)
- All paths resolve without 404 ✅
- No fallback slug absent from Sanity ✅
- Board items → category slugs mapping complete ✅

#### What's remaining (Waves 0 & 6)

**Wave 0: Photography & Brand Attribution** (blocking, owner task)
- [ ] 35 hero images at 1376×768px (one per new category)
  - Why: Handles & Knobs has 11 style collections. A shared stock image makes them indistinguishable.
  - Target: distinct photography per collection
  - Deadline: owner + photographer (no engineering blocker)

- [ ] Brand attribution per collection
  - Which partner supplies "Kids Handles"? "Classical Handles"? "Ceramic Handles"?
  - Seeded with empty `brands[]` as a deliberate Studio reminder
  - No code fix needed; Studio flags each as "needs content"

**Wave 6: Coverage Regression Gate** (engineering)
1. **`SHOWROOM_FAMILIES.flatMap(f => f.subcategories)`** must resolve to routable categories
   - Add to `scripts/release-verification.ts` as a gated assertion
   - Assert: every board string → valid `/collections/[slug]` path
   - Estimate: 1–2 hours

2. **Sitemap & internal-link pass**
   - Extend `src/app/sitemap.ts` to include all 54 category paths
   - Search `src/components/collections/` for any hard-coded category lists; ensure Phase 11 categories are linked
   - Check FeaturedChapters, family rails, brand discovery routes
   - Estimate: 1–2 hours

3. **Release verification**
   - `npm run build` — all 54 paths pre-render, zero 404s
   - `npm test` — all tests pass
   - `npm run test:e2e` — spot-check 2–3 new category pages load
   - Estimate: 30 minutes

**Total remaining:** ~5–6 hours engineering (Wave 6) + owner-dependent photography (Wave 0)

---

## Catalogue Viewer Status — Fully Implemented

### Current state
- ✅ `/catalogs` route live and linked in navbar
- ✅ `CatalogLibrary.tsx` — brand grid with 22 brands, card click opens viewer
- ✅ `CatalogViewerModal.tsx` — full PDF viewer with zoom, pan, search, annotations
- ✅ Viewer subcomponents: `PdfCanvas`, `ThumbnailDrawer`, `AnnotationLayer`, `CatalogSearch`, etc.
- ✅ WhatsApp CTA integrated into viewer
- ✅ Query parameter sync: `?brand=` opens specific catalog

### What Phase 10 fixes
The catalogue viewer is **fully functional** but uses **dark theme** styling. Phase 10-02 will:
- Align brand card background to light ivory `#FAF7F2`
- Update modal chrome to match light-theme aesthetic
- Ensure PDF canvas remains readable on both light nav + dark background

No new functionality needed; only visual consistency with Phase 10's light-theme update.

---

## Beyond Phase 11: Future Roadmap (Locked)

These phases are **explicitly deferred** pending Phase 8 launch completion and owner sign-off:

### Phase 12: Advanced Guided Discovery (Conditional)
- Would add filtering by material, finish, use-case
- Gated on: owner demand + Phase 11 completion
- Risk: D-18 (no filter UI) may preclude this indefinitely

### Phase 13: Lead Analytics & Conversion Optimization
- Would track WhatsApp CTA clicks, consultation form submissions
- Gated on: launch metrics + Phase 8 live
- Deferred pending owner business goals

### Phase 14: Mobile App (Out of Scope)
- No mobile app planned
- Responsive web is the delivery vehicle
- May revisit if owner demand changes

---

## Locked Rules (Immutable)

- **Public routes only:** `/`, `/collections`, `/collections/[slug]`, `/catalogs`
- **No e-commerce:** No pricing, no cart, no stock, no SKU
- **No fake products:** Every product seeded from Sanity or listed in fallback is canonical
- **WhatsApp is conversion:** All CTAs route to WhatsApp (919835190738, not 919431111550)
- **Sanity is source of truth:** Fallback exists for resilience only
- **Typographic lock:** Cormorant Garamond (display) + DM Sans (body)
- **Visual system:** Near-black `#131314` + gold `#e5c487`/`#c8a96e` (Phase 10 adds light ivory `#FAF7F2`)

---

## Launch Gate Checklist

Before marking Phase 8 complete and deploying to hardwarecollection.co:

- [ ] Phase 10 complete (light theme, brand plinths, catalogue styling)
- [ ] Phase 11 Wave 6 complete (coverage gate, sitemap, regression test)
- [ ] `/collections/[slug]` returns 200 for all 54 paths (no fallback 404s)
- [ ] Sanity env vars injected into `hardware-collection-6v` Vercel project
- [ ] `npm run build` passes zero errors
- [ ] `npm run test:e2e` passes all specs
- [ ] Search Console + Google Business Profile updated
- [ ] Analytics wired (GA4 + event tracking)
- [ ] Ssl cert auto-renewed
- [ ] NAP consistency verified (address, phone, business name)
- [ ] Consent banner / privacy / terms compliant

---

## Evidence Trail

- **Phases 0–9:** Full completion evidence in individual phase folders
- **Phase 10 context:** `.planning/phases/10-brand-showcase-light-presentation/10-CONTEXT.md`
- **Phase 11 amendment:** `.planning/phases/11-showroom-taxonomy-completion/11-CONTEXT.md` § 8
- **CI Status:** Main branch at `75093cf`, all gates passing (`hc-demo` deployment green)
- **Recent commits:**
  - `75093cf` — Lint fixes (globals.css, ShowroomCinematic.tsx)
  - `92f7424` — PR #17 merged (dependency audit, evidence re-sign)
  - `49fa694` — PR #15 merged (consultation form redesign)
  - `1bbb487` — Dependency audit fixes applied

