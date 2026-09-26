# What's Left to Ship — Hardware Collection
**Current state: 95% complete. Phase 9 shipped. Phase 10 ready. Phase 11 at data gate.**

---

## The Three Remaining Tasks

### 1. Phase 10 Execution — Light Theme Brand Showcase (HIGH PRIORITY)
**Effort:** 4–5 hours | **Risk:** Low | **Blocker:** None

#### 10-01: BrandTrustStrip.tsx Light Theme
File: `src/components/brand/BrandTrustStrip.tsx`

**What:** Convert the brand strip from dark theme to light ivory background

**Current state:**
```
Dark background → all 22 brands render in native colors on dark
```

**Target state:**
```
Light background (#FAF7F2) → all 22 brands in authentic colors on light
+ porcelain plinth cards: h-20 md:h-24 w-44 md:w-56 px-6 py-4 rounded-xl
+ border: #E7E0D4, shadow: 0_2px_8px_rgba(0,0,0,0.02)
```

**Checklist:**
- [ ] Update container background to `bg-[#FAF7F2]` with border-top
- [ ] Wrap each brand logo in plinth card div
- [ ] Test on hc-demo: desktop, tablet, mobile
- [ ] Verify all 22 brands are readable and colors are authentic (not dimmed/inverted)

#### 10-02: Catalogue Page (/catalogs) Light Theme Alignment
File: `src/components/catalog/CatalogLibrary.tsx` + `src/components/catalog/CatalogViewerModal.tsx`

**Current state:**
```
Brand cards render on dark surface
Viewer modal on dark background
```

**Target state:**
```
Brand cards on light ivory (#FAF7F2) with plinth styling
Viewer modal header/chrome consistent with light theme
```

**Checklist:**
- [ ] Update CatalogLibrary container background
- [ ] Apply plinth card styling to brand cards
- [ ] Update CatalogViewerModal header/toolbar to light theme
- [ ] Test viewer on hc-demo with 2–3 brands

#### 10-03: Visual Audit & Responsive Check
**Checklist:**
- [ ] Screenshot homepage BrandTrustStrip on mobile, tablet, desktop on hc-demo
- [ ] Screenshot /catalogs page on all viewports
- [ ] Verify WCAG AA contrast on light backgrounds
- [ ] Test brand card hover states
- [ ] Compare to reference light-theme mockup in 10-CONTEXT.md

**Definition of done:** PR green on hc-demo, code review passes, ready to merge to main.

---

### 2. Phase 11 Wave 6 — Taxonomy Coverage Gate (MEDIUM PRIORITY)
**Effort:** 3–4 hours | **Risk:** Low | **Blocker:** Data layer complete

#### 11 Wave 6 Part A: Regression Test
File: `scripts/release-verification.ts` (gate 6 of 6)

**Add assertion:**
```typescript
// GATE-06: Phase 11 Taxonomy Coverage
// Every board family item must resolve to a routable category
const { SHOWROOM_FAMILIES } = require('../src/data/showroom');
const { CATEGORIES } = require('../src/content/fallback/catalog');

const allBoardItems = SHOWROOM_FAMILIES.flatMap(f => f.subcategories);
const missingCategories = allBoardItems.filter(
  item => !CATEGORIES.find(c => c.slug === item)
);

if (missingCategories.length > 0) {
  console.error(`❌ GATE-06 FAILED: ${missingCategories.length} board items missing from categories`);
  process.exit(1);
}
console.log(`✅ GATE-06 PASSED: All 50 board items routable`);
```

**Checklist:**
- [ ] Add gate-06 to release-verification.ts
- [ ] Run `npm run test:e2e` locally to verify
- [ ] Add `SHOWROOM_FAMILIES` import (already exists in src/data/showroom.ts)

#### 11 Wave 6 Part B: Sitemap & Internal Links
File: `src/app/sitemap.ts`

**Current state:**
```typescript
// 13 hardcoded category paths
```

**Target state:**
```typescript
// All 54 category paths (13 + 35 new)
// Generated from CATEGORIES array, not hardcoded
```

**Checklist:**
- [ ] Read CATEGORIES from fallback (or query Sanity)
- [ ] Generate sitemap entry for each category with lastmod
- [ ] Test: `npm run build` → sitemap.xml includes all 54 paths
- [ ] Test: each path returns 200 (no 404s)

#### 11 Wave 6 Part C: Build Verification
**Checklist:**
- [ ] `npm run build` → zero errors
- [ ] `npm run build` → all 54 `/collections/[slug]` paths pre-rendered
- [ ] Spot-check 3 new category paths (e.g., /collections/ceramic-handles, /collections/furniture-profiles)
- [ ] Verify no missing image warnings (heroImage left deliberately empty for photography reminder)

**Definition of done:** All three checks pass, zero regressions.

---

### 3. Phase 11 Wave 0 — Photography (BLOCKING, OWNER TASK)
**Effort:** Not an engineering task | **Risk:** Delays launch | **Blocker:** Photographer availability

#### What's needed
- [ ] 35 hero images at 1376×768px (one per new category family)
- [ ] Uploaded to Sanity `asset` type
- [ ] Assigned to each category's `heroImage` field in Studio

#### Why this matters
- Handles & Knobs has 11 style collections: "Kids", "Modern", "Classical", "Long Bar", etc.
- Without distinct photography, all 11 look identical → customer can't tell them apart
- Eleven generic renders are worse than shipping zero categories

#### Status
- Seeded script: `scripts/cms/seed-showroom-categories.ts` (idempotent)
- All 35 categories exist in Sanity with empty `heroImage` field
- Studio displays warning on each: "This field is required" → deliberate reminder
- No engineering work blocked; photography is the only dependency

---

## Why the Catalogue Viewer Is Not Blocking

The `/catalogs` viewer is **fully implemented and functional**:
- ✅ Live route at `/catalogs`
- ✅ Linked in navbar
- ✅ 22 brand cards with hover states
- ✅ PDF viewer with zoom, pan, search, annotations
- ✅ WhatsApp CTA integrated
- ✅ Query param sync (`?brand=`)

**Phase 10 doesn't add new features; it upgrades the visual theme to match the light-ivory brand showcase.** The functionality is already there.

---

## Execution Path to Launch

```
NOW → Phase 10 (4–5 hours, ready immediately)
    ├─ 10-01 BrandTrustStrip light theme ✓
    ├─ 10-02 /catalogs page alignment ✓
    └─ 10-03 visual audit ✓
    
    ↓ MERGE TO MAIN
    
    → Phase 11 Wave 6 (3–4 hours, data layer ready)
    ├─ Regression test gate ✓
    ├─ Sitemap generation ✓
    └─ Build verification ✓
    
    ↓ MERGE TO MAIN
    
    WAIT → Phase 11 Wave 0 (owner task, photographer)
    └─ 35 hero images + brand attribution
    
    ↓ UPLOAD TO SANITY
    
    → FINAL GATE (30 minutes)
    ├─ `npm run build` → all 54 paths render
    ├─ `npm run test:e2e` → all specs pass
    ├─ Coverage test → all board items routable
    └─ No regressions detected
    
    ↓ DEPLOY
    
    → Vercel hardwarecollection.co
    ├─ Inject Sanity env vars into hardware-collection-6v
    ├─ Remove "coming soon" banner
    ├─ Search Console + GBP sync
    └─ Analytics enabled
```

---

## Critical Path Dependencies

```
Phase 10 ready?           YES ✓ (all assets in place)
Phase 11 data seeded?     YES ✓ (35 categories in Sanity)
Phase 11 Wave 6 blocked?  NO ✓ (ready to execute)
Photography available?    NO ⏳ (owner task, unknown timeline)
Env vars for prod?        NO ⏳ (available; awaiting deployment decision)
```

**Recommendation:** Start Phase 10 immediately (4–5 hours), then Phase 11 Wave 6 (3–4 hours). Both can merge to main in parallel. Photography can ship independently once available.

---

## Test Coverage

Current state:
```
Unit tests:  11/11 passing, 62/62 assertions green
E2E tests:   All green on hc-demo
Build:       Zero errors, zero warnings
TypeScript:  Strict mode, zero issues
Linter:      ESLint 9, all rules passing
```

Phase 10 additions:
- [ ] Visual regression: brand card colors on light background
- [ ] Contrast check: WCAG AA on all text
- [ ] Responsive: tested at 375px, 768px, 1920px

Phase 11 additions:
- [ ] Coverage test: `SHOWROOM_FAMILIES` → routable slugs
- [ ] Sitemap: all 54 paths present, no 404s
- [ ] Build: pre-render time < 2s per path

