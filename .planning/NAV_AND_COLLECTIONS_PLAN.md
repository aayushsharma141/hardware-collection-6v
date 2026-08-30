# Nav Bar & Collections Page � Specification & Implementation Lock

> Fully locked on 19 Aug 2026.
> Incorporates architectural amendments: 20+ authorized brands (amended by Phase 9 D-05/D-26, 2026-08-30, see 09-CONTEXT.md), no unverified sq ft claims, consultation shortlist model, 3 card classes, and strict accessibility.

---

## 1. Locked System Architecture

- **Public Routes:** / and /collections and /collections/[slug] — amended by Phase 9 D-16, 2026-08-30, see 09-CONTEXT.md
- **Product Detail:** Query param ?product=<slug> driving accessible lookbook drawer
- **Authorized Brands:** 20+ architectural hardware brands, CMS-managed in Sanity — amended by Phase 9 D-05/D-26, 2026-08-30, superseding the prior 6-brand line, see 09-CONTEXT.md; canonical roster reconciled in Phase 9 plan 09-04
- **No Ecommerce:** No cart, no pricing, no checkout. Primary conversion is WhatsApp & physical showroom consultation.

---

## 2. Navbar Specification (src/components/Navbar.tsx)

- **Left:** Hardware Collection logo + Cormorant Garamond wordmark
- **Center:** HOME � COLLECTIONS
- **Right:** Subtle bordered phone contact module + Warm-gold/white WhatsApp Inquire capsule CTA
- **Scroll Behavior:** Transparent on hero top ? Frosted #0E0C0C/85 surface with thin warm-metal border on scroll
- **Mobile Menu:** Full-screen luxury drawer with HOME, COLLECTIONS, WHATSAPP, and CALL SHOWROOM

---

## 3. Collections Page Specification (src/app/collections/CollectionsClient.tsx)

### A. Cinematic Header
- Title: THE COLLECTION
- Eyebrow: AUTHORIZED DIGITAL SHOWROOM � SAKCHI, JAMSHEDPUR
- Description: Curated architectural hardware specimens from Hafele, Dorset, Labacha, Godrej, Hettich & Kich.

### B. Floating Command Bar
**SUPERSEDED by Phase 9 D-17, 2026-08-30 — see 09-CONTEXT.md. The no-visible-filters rule replaces this section; do not implement.**
- Hierarchy: Category (ALL � DOOR � LOCKS � KITCHEN � WARDROBE) ? Brand (BRAND ?) ? Search
- Desktop: Sticky beneath navbar with layoutId active indicators
- Mobile: Compact command bar with filter bottom sheet

### C. 12-Column Blueprint Grid & Card Spans
**SUPERSEDED by Phase 9 D-17, 2026-08-30 — see 09-CONTEXT.md. The no-visible-filters rule replaces this section; do not implement.**
- standard: col-span-12 sm:col-span-6 lg:col-span-4
- wide: col-span-12 lg:col-span-8
- eature: col-span-12 (strictly when marked eatured)
- 1px blueprint borders (order-zinc-800/80 hover: order-[#C8A96E]/40), monospace model reference tags

### D. Consultation Shortlist Pill (Floating Bottom Capsule)
**Binding, as re-framed by Phase 9 D-19 (cart vocabulary removed) — see 09-CONTEXT.md.**
- Max 5 items
- **State A (Passive):** ? Need help choosing? Consult an expert ?
- **State B (Browsing):** ? Comparing options? Build a shortlist ?
- **State C (Selected):** {count} Items for Consultation � WhatsApp an Expert ?
- Pre-filled WhatsApp inquiry formatted with numbered brand & product list

### E. Lookbook Product Drawer
**Binding, unchanged — see 09-CONTEXT.md D-17.**
- Badge: HARDWARE COLLECTION � SAKCHI, JAMSHEDPUR � AUTHORIZED DEALER
- Large specimen frame + Overview + Features + Specifications dl list + WhatsApp Consultation trigger
- Focus trap, ESC key close, body scroll lock, URL sync via ?product=<slug>

---

## 4. Animation & Accessibility Budget
**Binding, unchanged — see 09-CONTEXT.md D-17.**
- Button / Filter: 150ms
- Card Hover: 180ms
- Command Bar State: 200ms
- Drawer / Grid Reveal: 220�250ms
- Full prefers-reduced-motion and keyboard accessibility compliance
