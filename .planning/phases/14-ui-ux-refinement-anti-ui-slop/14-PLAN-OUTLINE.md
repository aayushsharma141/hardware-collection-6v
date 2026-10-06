# Phase 14: UI/UX Refinement & Anti-UI-Slop Standardization - Plan Outline

## Overview
Phase 14 solidifies, stabilizes, and systematically enforces all UI/UX audit findings, responsive interactions, and anti-ui-slop architectural design system standards across the Hardware Collection application.

---

## Waves & Plans Breakdown

### Wave 1: Mobile Navigation & Floating Actions
- **14-01-PLAN.md — Mobile Actions & Fullscreen Navigation Overlay**
  - Finalize [`src/components/ui/FloatingActionButtons.tsx`](file:///e:/Hardware-Collection/src/components/ui/FloatingActionButtons.tsx) as the sole global floating action trigger (`lg:hidden`, fixed `bottom-6 right-6`, 48x48px architectural square).
  - Retire legacy and redundant floating widgets (e.g. `FloatingConsultationCapsule.tsx` in `CatalogsClient.tsx`).
  - Refactor [`src/components/layout/MobileMenu.tsx`](file:///e:/Hardware-Collection/src/components/layout/MobileMenu.tsx) from a floating `rounded-3xl` bubble modal into an architectural full-screen luxury overlay with crisp typography, hairline dividers, and rapid contact shortcuts.
  - Verify seamless mobile navbar toggle interaction in [`src/components/layout/Navbar.tsx`](file:///e:/Hardware-Collection/src/components/layout/Navbar.tsx).

### Wave 2: Showroom Consultation & Contact Section
- **14-02-PLAN.md — Consultation Section, Dual Handoff & Verified Metrics**
  - Lock verified business truth metrics in [`src/components/home/ConsultationSection.tsx`](file:///e:/Hardware-Collection/src/components/home/ConsultationSection.tsx): `10+ Years in Sakchi`, `20+ Authorized Brands`, `Sakchi Flagship HQ`.
  - Implement dual submission flow in [`src/components/consultation/ConsultationForm.tsx`](file:///e:/Hardware-Collection/src/components/consultation/ConsultationForm.tsx): records lead in backend/database and triggers pre-filled WhatsApp redirect (`https://wa.me/919835190738`) for instant specialist follow-up.
  - Ensure standard 4 fields (Name, Phone Number, Project Type, Optional Message/Date) with clean validation states.
  - Refine live Google Maps embed with sharp rectilinear framing and a direct "Get Directions" deep link.

### Wave 3: Collections Hero & Offers System
- **14-03-PLAN.md — Collections Hero Carousel & Promotional Offers**
  - Stabilize carousel autoplay in [`src/components/collections/CollectionsHero.tsx`](file:///e:/Hardware-Collection/src/components/collections/CollectionsHero.tsx) (calm 6.5s interval, immediate pause on hover/focus, `prefers-reduced-motion` compliance).
  - Finalize minimal linear progress indicators (`h-[2px]`, `w-6` active state) with zero visual clutter.
  - Enforce subtle promotional offer slide presentation: brass eyebrow badge (`EXCLUSIVE PRIVILEGE` / `SPECIAL OFFER`), cream "Enquire Offer" WhatsApp CTA, and outline "All offers" anchor button.
  - Lock ultra-minimal editorial typography hierarchy (`Explore Our Collections` + active slide name and 1-line subtitle, zero filler text).

### Wave 4: Global Anti-UI-Slop & Token Hardening
- **14-04-PLAN.md — Anti-UI-Slop Component Hardening & Token Standardization**
  - Refactor [`src/components/layout/Footer.tsx`](file:///e:/Hardware-Collection/src/components/layout/Footer.tsx) to eliminate all remaining `rounded-xl` containers, converting to sharp borders and surface variables.
  - Audit and clean up stray `rounded-xl` or `rounded-full` pill artifacts across `ConsultationSuccess.tsx`, `ShowcaseCard.tsx`, and secondary dialogs, standardizing on the softened architectural hybrid (`rounded-none` on containers/buttons, subtle `rounded-sm` on inputs/thumbnails).
  - Standardize all component colors on semantic CSS variables (`var(--surface)`, `var(--text-primary)`, `var(--text-secondary)`, `var(--border)`, `var(--color-wine)`, `var(--color-brass)`).
  - Execute full test suite validation (`npm run lint && npm run build`).
