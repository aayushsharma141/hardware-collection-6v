# Visitor Experience & UX Validation Audit Report

**Target:** Hardware Collection Digital Showroom (`/` and `/collections`)  
**Environment:** Next.js 16 (App Router) + React 19 + Sanity CMS  
**Audit Type:** Read-Only UX & Accessibility Validation  
**Evaluation Standard:** Apple HIG & Luxury Showroom UX Baseline  

---

## Executive Summary & Verdict

| Audit Dimension | Status | Notes |
| :--- | :--- | :--- |
| **Architecture & Routing** | ✅ **PASS** | Strict two-route system (`/` and `/collections`) strictly maintained. No rogue PDP routes. |
| **Data Integrity & Brand Rules** | ✅ **PASS** | Zero fake pricing, zero stock claims, no eCommerce "cart/order" language. Clean authority signals. |
| **Conversion & WhatsApp Flow** | ✅ **PASS** | WhatsApp payloads contain verified product and brand names. Cleanly formatted. |
| **Deep-Linking & Query State** | ✅ **PASS** | `/collections?product=<slug>` opens drawer reliably. Invalid slugs fail gracefully. |
| **Hero Carousel Experience** | ⚠️ **P1 FINDINGS** | Autoplay works; keyboard listener scoping and focus ring styling need refinement. |
| **Taxonomy & Progressive Disclosure** | ⚠️ **P1 FINDINGS** | Subcategory grouping logic implemented in frontend; requires active CMS population to fully display. |
| **Accessibility (a11y)** | ⚠️ **P1 FINDINGS** | Dialog semantics present (`role="dialog"`, `aria-modal`), but focus trap and focus return need completion. |
| **Visual & Contrast Quality** | ⚠️ **P2 FINDINGS** | Placeholder blocks in sensory sections require high-res imagery; footer review link needs valid URL. |

**Overall UX Readiness:** **8.8 / 10** — *Architecture and conversion flows are solid and production-grade. Pre-launch fixes are focused on keyboard interaction, focus trapping, and content asset population.*

---

## P0 Findings (Must Fix Before Launch)

*No P0 blockers detected.* Core conversion flows, deep-linking, routing, and selection tray boundaries execute without fatal errors or data corruption.

---

## P1 Findings (UX, Conversion & Accessibility Issues)

### 1. [P1] Drawer Accessibility: Missing Focus Trap & Focus Return
- **Section:** Product Drawer (`src/app/collections/CollectionsClient.tsx`)
- **Observed Behavior:** When the drawer opens, `aria-modal="true"` is set, but pressing the `Tab` key allows keyboard focus to escape behind the backdrop into underlying page links. When the drawer is closed via `Escape`, focus resets to the top `<body>` rather than returning to the specific product card button that opened it.
- **Expected Behavior:** Keyboard focus should be trapped inside the open drawer. Pressing `Escape` or clicking Close should return DOM focus to the triggering element.
- **Recommended Fix:** Implement a `useFocusTrap` hook or `useEffect` that listens for `Tab` key navigation within the drawer ref, and store `triggerRef.current` to call `.focus()` on drawer unmount.

### 2. [P1] Hero Carousel Keyboard Navigation Scope
- **Section:** Homepage Hero Carousel (`src/components/home/HeroCarousel.tsx`)
- **Observed Behavior:** `onKeyDown` is bound to the carousel `<section tabIndex={0}>`. If the visitor tabs into buttons inside the carousel or clicks outside before pressing `ArrowLeft` / `ArrowRight`, key events do not always bubble to the container.
- **Expected Behavior:** When the hero section is in view or focused, arrow keys should reliably advance/rewind slides.
- **Recommended Fix:** Add a scoped `window.addEventListener("keydown", ...)` when the hero carousel is focused or hovered, ensuring global arrow keys navigate the carousel seamlessly without scroll jumping.

### 3. [P1] Hero Autoplay Pause Feedback
- **Section:** Homepage Hero Carousel (`src/components/home/HeroCarousel.tsx`)
- **Observed Behavior:** Hovering over the carousel correctly sets `isPlaying = false`, but the bottom toggle icon continues to display the `Pause` icon until clicked.
- **Expected Behavior:** Visual indicator should explicitly communicate whether autoplay is actively running or paused by user interaction.
- **Recommended Fix:** Decouple `isHovered` from `isManuallyPaused` state so the play/pause button state reflects explicit user overrides, while hover temporarily suspends the interval timer without confusing the UI button state.

### 4. [P1] Taxonomy Subcategory Grouping Empty State Fallback
- **Section:** Collections Taxonomy (`src/app/collections/CollectionsClient.tsx`)
- **Observed Behavior:** When viewing a category where subcategories are not yet populated in Sanity, products are grouped under `otherProds` without a sub-header, rendering a flat grid.
- **Expected Behavior:** If a category has no subcategories, render a clean, unified category view without orphaned layout dividers.
- **Recommended Fix:** Ensure the template cleanly skips the divider elements when `cat.subcatGroups.length === 1 && !cat.subcatGroups[0].subcat`.

---

## P2 Findings (Visual Polish & Content Refinements)

### 1. [P2] Sensory Section Imagery Placeholders
- **Section:** Homepage Sensory Section (`src/app/page.tsx`)
- **Observed Behavior:** Secondary showroom sensory blocks show text placeholders (`[ MACRO PHOTOGRAPHY ]` / `[ SHOWROOM PHOTOGRAPHY ]`) when Sanity image assets are missing.
- **Expected Behavior:** High-resolution architectural photography of brass/matte black hardware finishes or fallback images should render.
- **Recommended Fix:** Provide high-fidelity static fallback imagery from `/public/Hardware Collection/` when Sanity assets are null.

### 2. [P2] Google Reviews "See All" External Link
- **Section:** Homepage Trust & Reviews Section (`src/app/page.tsx`)
- **Observed Behavior:** The "See all Google reviews →" button has `href="#"` fallback when `siteSettings.googleMapsUrl` is not provided.
- **Expected Behavior:** Link should point directly to Hardware Collection's Google Maps review profile URL or hide the link if unavailable.
- **Recommended Fix:** Bind `href` directly to `settings?.googleMapsUrl || "https://maps.google.com/..."` with `target="_blank"` and `rel="noopener noreferrer"`.

### 3. [P2] Selection Tray Floating WhatsApp Button Spacing on Mobile
- **Section:** Mobile Viewport (`390px` & `430px`)
- **Observed Behavior:** When 1–5 items are added to the selection tray, the fixed black bar appears at `bottom: 0`. On mobile devices, this can partially overlay the floating WhatsApp bubble if both are active simultaneously.
- **Expected Behavior:** When the selection tray is active, the floating WhatsApp badge should either offset upwards (`bottom: 80px`) or hide temporarily.
- **Recommended Fix:** Add conditional class `bottom-24` to the floating WhatsApp component when `selection.length > 0`.

---

## What Is Working Exceptionally Well

1. **Brand Authority & Showroom Positioning**:
   - The Authorized Brand Showcase cards (Häfele, Dorset, Labacha) cleanly convey official partnership, short positioning descriptions, and direct actionable links without looking like cluttered e-commerce product grids.
2. **Product Drawer & WhatsApp Conversion Flow**:
   - The drawer layout is clean, fast, and legible.
   - The primary CTA is clearly "WhatsApp a Specialist", followed by "Add to Selection".
   - Showroom status is subtly marked with `● ON DISPLAY IN SAKCHI SHOWROOM` without alarming warning colors.
   - WhatsApp message URLs are perfectly generated with product and brand context.
3. **Deep-Linking & Query-State Integrity**:
   - Direct navigation to `/collections?product=<slug>` automatically mounts the drawer with full server-side safety and clean URL cleanup upon dismissal.
   - Non-existent slugs fail gracefully without unhandled crashes.
4. **Performance & Build Stability**:
   - Zero Turbopack / Next.js compilation errors.
   - Zero static generation bailout issues.
   - Clean responsive layout on both desktop and mobile viewports.
