# Browser POV Audit — Collections Route (`/collections`)
**Date:** 2026-10-06  
**Auditor:** Antigravity Browser Agent (Interactive POV Session)  
**Target:** `http://localhost:3000/collections`  
**Devices Tested:** Desktop (1280×800) & Mobile Phone (390×844)  

---

## 1. Automated Test Suite Results

| Test Suite | Spec / Scope | Result | Notes |
| :--- | :--- | :---: | :--- |
| **Vitest Unit** | `src/content/sanity/__tests__/schemaQueryParity.test.ts` | **FAIL** | `offer.heroPlacement missing from schema: expected false to be true`. `heroPlacement` & `heroOrder` were deleted from Sanity schema. |
| **Vitest Unit** | All other catalog, taxonomy & lead tests (20 files, 193 tests) | **PASS** | Taxonomies, route inventory, scrollLock, leads schema passed. |
| **Console Issues** | Image optimization warnings | **WARNING** | 20 warnings logged: `Lazy-loaded images should have explicit dimensions`. |

---

## 2. Route Walkthrough & Observations (`/collections`)

### A. Hierarchy & Above-the-fold
- **Desktop (1280×800):**
  - Primary `<h1>` *"Explore Our Collections"* renders with luxury serif styling.
  - However, there is a vast vertical void between the `<h1>` and the bottom slide controls (`FITTINGS • SINKS • FAUCETS` / `Kitchen Hardware`).
  - Below the hero, the top portion of *"Browse by Collection"* is partially clipped at the bottom fold.
  - Slide indicators on the bottom right are thin, low-contrast dashes (28px clickable width) that are difficult to discern against varied background imagery.
- **Mobile Phone (390×844):**
  - The hero title and active slide information take up the whole screen, but the central viewport is an empty dark image scrim.
  - The slide indicator dots are condensed in the bottom left corner and fail the WCAG touch target size (< 44px).

---

### B. Conversion Path & Lead Gen
- **Desktop:**
  - Visitor can reach "Book Consultation" in the fixed header (opens slide-over consultation drawer).
  - WhatsApp CTA appears on product quick views and at the bottom Showroom CTA section.
  - Direct showroom phone (`+91 98351 90738`) is present in header.
- **Mobile:**
  - Floating action buttons (Call & WhatsApp) render on the bottom right.
  - **Flaw:** Floating buttons lack backdrop blur, border shielding, or smart collision avoidance. They float directly on top of product cards, brand logos, and section text, obscuring content.

---

### C. Motion & Transitions
- Carousel autoplay slides smoothly via Embla Carousel.
- Quick view modal (`ProductQuickView`) and Consultation drawer open smoothly.
- **Flaw:** In `CollectionExplorer`, clicking a collection card or accordion row triggers `scrollIntoView({ block: 'start' })`, which causes an abrupt instant jump that gets partially hidden underneath the sticky navbar.

---

### D. Layout & Responsiveness
- **Desktop:** No horizontal scroll (`scrollWidth === clientWidth`).
- **Mobile:**
  - No horizontal overflow detected.
  - **Major Scroll Fatigue:** The 7 category tiles form a 2-column grid that extends for ~1,700px vertically before reaching the active panel content. A mobile user must scroll past all 7 tiles to see any products.
  - **Header Clip:** When scrolling down to category panels or section headers, the sticky navbar (64px) covers section headers and icons because scroll offsets lack `scroll-mt`.

---

### E. Content & Assets
- **Broken / Mismatched Product Imagery:**
  - "Hafele Mortise Lock" displays a decorative flower vase with eucalyptus leaves (`/cinema/showroom/interior.png` / fallback image) instead of door hardware or a mortise lock.
- **Brand Logo Sizing Disparity:**
  - Square or vertical brand logos (e.g., **Tattva**, **Labacha**) are scaled down to microscopic, unreadable specks (barely 6-8px high) because uniform `max-h-12 w-auto max-w-full object-contain` is applied to logos with large viewBox padding.
  - Meanwhile, wide horizontal logos (**Blum**, **Dorset**, **Geze**) look oversized and dominant.
- **Spelling Inconsistencies:**
  - Category filter: *"Mortise & Door Locks"* (American spelling with 's').
  - Product card: *"Mortice Handle"* (British spelling with 'c').

---

### F. Key Journey Interactions

1. **Hero Slide Offers Missing:**
   - **Root Cause Identified:** `pickHeroOffers(offers, "collections")` filters offers where `heroPlacement?.includes("collections")`.
   - In Sanity Studio schema `src/content/sanity/schemaTypes/offer.ts`, `heroPlacement` was deleted!
   - In Sanity documents, `heroPlacement` is `null`.
   - Result: Active offers (like *Festival Season Digital Lock Combo*) never appear in the Hero Carousel, leaving the Hero showing only generic category slides.

2. **Collection Explorer Dual Redundancy & "Close" Bug:**
   - The UI renders 7 collection tiles as tabs.
   - Inside the open panel, there is an `X` (close) button.
   - Below the open panel, the UI renders the remaining 6 collections as an accordion list with downward chevrons (`ChevronDown`).
   - **Bug:** When the user clicks the `X` button, `openId` becomes `""`. This causes the active panel to completely vanish, leaving behind an empty dead space and a full list of all 7 collections repeated twice on the screen!

3. **URL Routing Inconsistencies:**
   - Navbar and Footer links point to `/catalogs`, triggering an HTTP 308 redirect to `/catalogues`.
   - Brand and collection links point directly to `/catalogues?brand=...`.

---

## 3. Comprehensive Findings List

### Critical Failures (Must Fix)

| ID | Category | Description | Impact |
| :---: | :---: | :--- | :--- |
| **BUG-01** | **Data / Logic** | `heroPlacement` and `heroOrder` fields missing in `offer.ts` Sanity schema, causing Vitest schema-parity failure and preventing offers from ever appearing in the Collections Hero. | Offers cannot be managed in Studio or displayed in hero. |
| **BUG-02** | **UX / State** | Closing a collection category via `X` button leaves an empty dead state where all 7 collections are duplicated in a list below the tiles with nothing selected. | Broken UI state; disorients user. |
| **BUG-03** | **Asset / Content** | "Hafele Mortise Lock" displays a vase of eucalyptus leaves as its product image. | Severe credibility loss for an architectural hardware showroom. |

---

### Should Fix (High Priority)

| ID | Category | Description | Impact |
| :---: | :---: | :--- | :--- |
| **UX-01** | **Mobile UX** | 7 giant category tiles take up 1,700px of scrolling before any products appear on mobile. | Extreme scroll fatigue on phones. Users may bounce before seeing products. |
| **UX-02** | **Layout** | Sticky navbar obscures the top 64px of section headings when jumped/scrolled to. | Clipped titles like "Door Hardware" and "Authorized Brands". |
| **UX-03** | **Visual** | Microscopic scaling of Tattva and Labacha brand logos due to unconstrained viewBox containment. | Logos are illegible specks. |
| **UX-04** | **Mobile FAB** | Floating action buttons (Phone, WhatsApp) overlap product cards, brand logos, and content. | Blocks interactive elements and text readability. |
| **UX-05** | **Architecture** | Duplicate navigation list: Tab cards at top + accordion rows with `ChevronDown` at bottom. | Confusing mixed mental models (tabs vs accordions). |
| **A11Y-01**| **Accessibility** | Slide indicator buttons (28px width) and "All" filter pill (38px width) fail minimum 44px tap target size. | Fails WCAG 2.1 Touch Target standards. |
| **SEO-01** | **Performance** | Internal navigation links to `/catalogs` trigger unnecessary 308 redirects instead of direct `/catalogues`. | Redirection hop delays navigation. |

---

### Could Fix (Polishing & Enhancements)

| ID | Category | Description | Impact |
| :---: | :---: | :--- | :--- |
| **POL-01** | **Copy** | Inconsistent spelling between "Mortise" and "Mortice" across filters and cards. | Minor editorial inconsistency. |
| **POL-02** | **UI Copy** | Category pill count badges (e.g. `Digital Locks 3`) look like part of the category name rather than a badge `(3)`. | Visual ambiguity. |
| **POL-03** | **Dev Warnings** | 20 console warnings regarding lazy-loaded images missing explicit dimensions. | Potential layout shift warnings in Lighthouse. |
| **POL-04** | **Redundancy** | Showroom CTA section displays full address right above footer which displays the same address. | Visual clutter at bottom of page. |

---

## 4. Captured Evidence

All screenshots are stored in `docs/reviews/browser-pov-2026-10-06/`:
- `collections-desktop-hero.png` — Desktop hero layout & indicator contrast.
- `collections-product-quickview.png` — Product modal showing placeholder vase image on mortise lock.
- `collections-smart-security-panel.png` — Smart & security panel, category pill badges.
- `collections-panel-closed.png` — Bug state: empty space and duplicate list when closing category.
- `collections-offers-section.png` — Current offers section & brand logos.
- `collections-bottom-cta.png` — Bottom showroom CTA styling & duplication.
- `collections-consultation-drawer.png` — Consultation drawer interactive journey.
- `collections-mobile-hero.png` — Mobile hero and FAB placement.
- `collections-mobile-explorer.png` — Mobile 2-column tiles taking 1700px.
- `collections-mobile-panel-content.png` — Sticky header clipping category title.
- `collections-mobile-cards-offers.png` — Single-column product card on mobile.
- `collections-mobile-brands.png` — Brand logos scaling issues (microscopic Tattva & Labacha).
- `collections-mobile-footer.png` — Mobile footer layout.
- `collections-mobile-menu-open.png` — Mobile nav dialog drawer.
