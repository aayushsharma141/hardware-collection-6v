# What's Left to Ship — Hardware Collection
**Rewritten 2026-09-26 evening. Supersedes the morning version — Phase 11's taxonomy plan
was replaced by Phase 12 the same day. See `PHASES-REWRITTEN.md` for the full narrative.**

---

## The Actual Critical Path

```
PR #23 (Phase 12: route consolidation, 54→11)
   │  status: OPEN, code complete, needs review
   ▼
PR #24 (brand priority/copy + Phase 10 plinth cards)
   │  status: OPEN, code complete this session, needs 10-03 visual audit + review
   │  stacked on #23 — rebase after #23 merges
   ▼
main
   │
   ▼
Phase 13 (CMS photography + scheduled offers)
   │  status: PLANNED, owner decisions locked, zero code written
   │  gated explicitly on #23 + #24 merging
   ▼
Launch: Sanity env vars → hardware-collection-6v → remove coming-soon banner
```

Also open, needs a decision: **PR #18** (`feat/collections-family-index`) looks superseded by
PR #23's approach — confirm with the owner whether to close it rather than merge.

---

## 1. PR #23 — Phase 12 Route Consolidation (CODE DONE, awaiting merge)

Nothing to build. This already shipped on its branch:
- `/collections/[slug]` serves exactly 11 routes (5 families, 6 spaces) via
  `ROUTABLE_COLLECTION_SLUGS` in `src/lib/collections/routes.ts`, enforced with
  `dynamicParams = false`.
- 48 category documents live inside their family page as sections (`FamilySections.tsx`),
  not as their own URLs.
- Sitemap regenerated to the 11 routes; 2 previously-indexed legacy category URLs now redirect
  to their family page.

**Remaining action:** code review and merge. No engineering work.

---

## 2. PR #24 — Brand Priority/Copy + Phase 10 Visual Work (IN PROGRESS)

### Already done (this session, commit `e54d097`)
- **BrandTrustStrip.tsx** (`/#brands`): plinth cards applied —
  `h-20 md:h-24 w-44 md:w-56 px-6 py-4 rounded-xl bg-white/90 border-[#E7E0D4] shadow-[0_2px_8px_rgba(0,0,0,0.02)]`.
  Logo sizing reduced (`max-w-[128px]` → `max-w-[200px]` across breakpoints) to fit the fixed
  card without overflow. Inter-card gaps tightened from `gap-10/16/20` to `gap-6/8/12`.
- **BrandDiscovery.tsx** (`/collections`, "Full Manufacturer Directory" section): same plinth
  card, replacing the old `grid-cols-3/4/6` fixed grid with a wrapping flex row so card
  dimensions stay constant instead of stretching to fill columns.
- Verified: `tsc --noEmit` clean, 100/100 unit tests pass, `npm run build` succeeds.

### Deliberately not touched
- `/catalogs` (`CatalogLibrary.tsx`) — already light-themed via the site's global CSS variables
  (`--surface: #fbf5ea` etc., set as the "bright base" default in `globals.css`). Its card design
  is intentionally different from the plinth wall (full card: badge, logo, tagline, CTA button) —
  it's a reference-library listing, not a decorative brand strip.
- `CatalogViewerModal.tsx` — root `bg-[#0E0C0C] text-white` is deliberate cinema-dark chrome for
  reading PDF pages (same convention as Preview/Lightroom/video theater mode), not a dark-theme
  leftover. Confirmed via the component's own doc comment. No change made or needed.

### Remaining: 10-03 Visual & Responsive Audit
- [ ] Screenshot `/` brands section on mobile (375px), tablet (768px), desktop (1920px)
- [ ] Screenshot `/collections` Full Manufacturer Directory grid at the same breakpoints
- [ ] Verify WCAG AA text contrast on the light ivory background
- [ ] Confirm no artificial filters (`brightness-0`, `invert`) — spec explicitly forbids these
- [ ] Spot-check hover states on both surfaces

**Blocker for this step in the current session:** the local dev server's Sanity client throws
"Unauthorized - Session not found" (missing/invalid session-mode credentials in this
environment) on `getHomePage()`, which prevents rendering `/` live in-browser here. Build and
unit tests both pass clean using fallback content, so the code is verified correct; the visual
audit itself needs either fixed dev credentials or running against `hc-demo`.

---

## 3. Phase 11 Taxonomy Plan — RETIRED

Do not resume. The 35-missing-categories/5-waves/photography-gate plan in
`.planning/phases/11-showroom-taxonomy-completion/11-CONTEXT.md` was superseded by Phase 12's
route consolidation. The categories still exist in Sanity as content; they no longer need
individual hero photos to justify shipping a whole page, because they're no longer whole pages.

---

## 4. Phase 13 — CMS Photography & Scheduled Offers (PLANNED, gated, not started)

Full detail: `.planning/phases/13-cms-photography-offers/13-CONTEXT.md`. Four waves:

1. **Image foundation** — `@sanity/image-url`, a `urlForImage()` helper using width+height
   (required for Studio crop/hotspot to work at all), GROQ projects the full image object.
2. **Migrate 23 hardcoded images** into `homePage`/`siteSettings` fields, each with today's file
   as fallback.
3. **Scheduled offers** — new `offer` document (title, line, hotspot image, optional linked
   entity, WhatsApp CTA, `startsAt`/`endsAt`, placement), visibility via GROQ `now()` filter.
   No prices/discount numbers per locked rules.
4. **Studio ergonomics** — grouped image fields, offer status indicator (Scheduled/Live/Expired).

**Cannot start until PR #23 and #24 merge.** Owner decisions (Sanity-only, two meanings of
"rotation", no auto-cycling hero) are already locked — no discovery work needed, straight to
execution once unblocked.

**Still needs owner input before Wave 3:** which pages offers should appear on, and whether an
offer may ever state a discount.

---

## Test Coverage Snapshot (this session, on `feat/brand-priority-and-copy`)

```
TypeScript:  clean (tsc --noEmit)
Unit tests:  15/15 suites, 100/100 tests passing
Build:       succeeds, 11 collection routes + static pages prerendered
Lint:        pre-existing warnings only (unrelated to this session's changes)
```
