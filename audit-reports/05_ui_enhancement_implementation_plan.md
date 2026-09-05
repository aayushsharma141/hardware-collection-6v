# Hardware Collection — UI Enhancement Implementation Plan

**Document:** `audit-reports/05_ui_enhancement_implementation_plan.md`  
**Status:** Ready for User Review (Pre-Implementation Lock)  
**Execution Rule:** Do NOT modify source code until explicit user approval of this plan.  
**Scope:** Fix objective defects (P0), implement high-value UX improvements (P1), and enforce viewport container consistency across Next.js App Router components.  

---

## 1. Summary of Changes & Architecture Impact

This implementation plan translates the findings from `03_ui_ux_enhancement_analysis.md` and `04_use_case_wireframes.md` into concrete, low-risk engineering tasks. 

No new database models, e-commerce libraries, or third-party frameworks will be introduced. All work operates strictly within the existing **Next.js 16 (App Router) + React 19 + Tailwind CSS + Sanity CMS** architecture.

### Change Classification Overview

| Scope | Changes Planned | Risk Level |
| :--- | :--- | :--- |
| **CSS / Spacing Patches** | Padding adjustments (`pt-32` on hero), max-width constraints (`max-w-7xl mx-auto`), hover color contrast fixes (`hover:text-[var(--wine)]`). | Very Low (Reversible) |
| **Component-Level Fixes** | Mount `<Footer />` in `/collections/[slug]`, update Navbar CTA label ("BOOK CONSULTATION"), add accessibility focus-trap in Lookbook Drawer, offset floating WhatsApp capsule when shortlist is active. | Low |
| **Copy / Microcopy Polish** | Replace generic labels ("Inquire" → "Book Consultation", "What Our Clients Say" → "Verified Experiences", "Catalogue Spectrum" → "All Hardware Collections"). | Zero Risk |

---

## 2. Component & File Modification Matrix

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      COMPONENT MODIFICATION MATRIX                       │
├────────────────────────────────┬─────────────────┬───────────────────────┤
│ Target Component File          │ Change Class    │ Key Purpose           │
├────────────────────────────────┼─────────────────┼───────────────────────┤
│ 1. CollectionsClient.tsx       │ CSS + Component │ Fix header clipping,  │
│                                │                 │ max-w grid, trap focus│
│ 2. collections/[slug]/page.tsx │ Component-Level │ Mount missing Footer  │
│ 3. FloatingCTA.tsx             │ CSS + a11y      │ Fix WCAG contrast     │
│ 4. CategoryDiscovery.tsx       │ CSS             │ Fix link hover color  │
│ 5. Navbar.tsx                  │ Microcopy       │ Update CTA label      │
│ 6. FloatingConsultationCapsule │ Component-Level │ Prevent tray overlap  │
│ 7. HeroCarousel.tsx            │ Interaction     │ Key listener scope    │
└────────────────────────────────┴─────────────────┴───────────────────────┘
```

### Detailed Component Specifications

#### Task 1: Fix Fixed-Header Overlap & Constrain Grid Width on Collections Hub
- **File:** `src/app/collections/CollectionsClient.tsx`
- **Classification:** CSS-only & Layout Container
- **Exact Changes:**
  1. Update top Hero section padding from `pt-20` to `pt-28 lg:pt-32` so the `<h1>THE COLLECTION</h1>` title clears the 80px fixed header cleanly across all viewports.
  2. Enforce `max-w-7xl mx-auto px-6 lg:px-8` on the Curated Spaces carousel container, Featured Chapters cards, and Catalogue Spectrum grid to prevent distortion on 2133px ultra-wide displays.
- **Regression Risk:** Minimal. Affects layout breathing room only.

#### Task 2: Mount Missing Footer on Dynamic Collection Slug Pages
- **File:** `src/app/collections/[slug]/page.tsx`
- **Classification:** Component-Level
- **Exact Changes:**
  1. Import `<Footer />` from `@/components/layout/Footer`.
  2. Fetch `siteSettings` via `getSiteSettings()` or use existing server context.
  3. Render `<Footer />` at the bottom of the JSX tree, restoring Sakchi NAP, hours, phone numbers, and legal links.
- **Regression Risk:** Zero. Resolves an orphaned page layout bug.

#### Task 3: Remediate WCAG AA Contrast Defect in Consultation Conversion Zone
- **File:** `src/components/home/FloatingCTA.tsx`
- **Classification:** CSS / Accessibility (a11y)
- **Exact Changes:**
  1. In the direct consultation card (`FloatingCTA.tsx`), replace `text-zinc-300` on pearl (`#F8F6F6`) with `text-[var(--text-secondary)]` (`#3D2E38`) for body copy and `text-[var(--muted)]` (`#7A6872`) for helper labels.
  2. Replace initial resting state `text-zinc-300` on "Open in Maps" button with `text-[var(--text-primary)]` with visible border.
- **Regression Risk:** Zero. Directly satisfies WCAG AA 4.5:1 ratio requirement.

#### Task 4: Fix Invisible Link Hover State in Category Discovery
- **File:** `src/components/home/CategoryDiscovery.tsx`
- **Classification:** CSS-only
- **Exact Changes:**
  1. Locate category card navigation links (`VIEW ENTRANCE`, `VIEW KITCHEN`, etc.).
  2. Replace `text-[#d1ccc4] hover:text-white` with `text-[var(--text-secondary)] hover:text-[var(--wine)]` (`#8B1A42`) with subtle underline.
- **Regression Risk:** Zero. Restores visibility of primary navigation links.

#### Task 5: Enhance Navbar Conversion Label & Microcopy
- **File:** `src/components/layout/Navbar.tsx`
- **Classification:** Microcopy & UX Polish
- **Exact Changes:**
  1. Change the desktop header action button from generic `"INQUIRE"` to `"BOOK CONSULTATION"`.
  2. Maintain existing modal/drawer trigger functionality.
- **Regression Risk:** Zero.

#### Task 6: Prevent Mobile Selection Tray & WhatsApp Bubble Collision
- **File:** `src/components/consultation/FloatingConsultationCapsule.tsx`
- **Classification:** Component-Level
- **Exact Changes:**
  1. Add conditional CSS offset to the floating capsule: when `selection.length > 0`, add `bottom-24` class on mobile (`<768px`) to prevent floating WhatsApp bubble from being obscured by the bottom shortlist bar.
- **Regression Risk:** Very Low. Ensures both conversion affordances remain clickable.

#### Task 7: Lookbook Drawer Focus Management
- **File:** `src/app/collections/CollectionsClient.tsx`
- **Classification:** Accessibility (a11y)
- **Exact Changes:**
  1. Add `useEffect` focus trap when drawer is opened (`searchParams.get("product")`).
  2. Store `triggerElementRef.current` and call `.focus()` when drawer is dismissed.
- **Regression Risk:** Low. Strictly enhances keyboard navigation without affecting mouse clicks.

---

## 3. Dependency Graph & Sequencing

```
┌─────────────────────────────────────────────────────────┐
│ PHASE 1: Objective Defect Remediation (P0)               │
│ • Task 1: Fix Collections Header Padding (CollectionsClient)│
│ • Task 2: Mount Missing Footer (collections/[slug])    │
│ • Task 3: Fix WCAG Contrast in Conversion (FloatingCTA) │
│ • Task 4: Fix Category Link Hover Visibility           │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ PHASE 2: Layout Consistency & Microcopy (P1)            │
│ • Task 5: Update Navbar CTA Label ("BOOK CONSULTATION") │
│ • Task 6: Mobile Selection Tray vs WhatsApp Offset      │
│ • Task 7: Ultra-Wide Max-Width Enforcements (max-w-7xl) │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│ PHASE 3: Accessibility Polish & Verification            │
│ • Task 8: Lookbook Drawer Focus Trap & Return           │
│ • Multi-Viewport Validation (375px to 2133px)           │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Viewport Verification & Screenshot Matrix

Upon user approval of this plan, verification will be executed using Chrome DevTools across the complete matrix:

| Viewport | Device Profile | Primary Verification Points | Required Capture |
| :--- | :--- | :--- | :--- |
| **375×667** | iPhone SE / Android | Hero title padding, Mobile Conversion Bar touch targets, selection tray clearance, hamburger navigation. | `mobile_375_home.png`, `mobile_375_collections.png` |
| **768×1024** | iPad Portrait | 2-column tablet grids, Curated Spaces swipe alignment, consultation form readability. | `tablet_768_collections.png` |
| **1024×768** | iPad Landscape | Header layout, 3-column category cards, material journey layout. | `tablet_1024_home.png` |
| **1440×900** | MacBook / Laptop | Standard desktop layout, no header clipping, brand trust strip alignment, footer presence. | `desktop_1440_collections.png`, `desktop_1440_slug.png` |
| **1920×1080** | FHD Desktop | Full visual rhythm, card aspect ratios, contrast verification. | `desktop_1920_home.png` |
| **2133×1012** | Ultra-Wide Monitor | Confirm `max-w-7xl` container prevents awkward horizontal stretching and preserves visual density. | `ultrawide_2133_collections.png` |

---

## 5. Explicit Review & Hold Gate

> [!IMPORTANT]
> **This plan is frozen and awaiting user review.**  
> In accordance with the project instructions and autonomous safety boundaries, no source files have been modified. Implementation will begin immediately upon your confirmation.
