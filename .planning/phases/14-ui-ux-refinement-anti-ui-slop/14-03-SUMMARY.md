# Plan 14-03: Collections Hero Carousel & Offers System - Summary

**Executed:** 2026-10-07
**Status:** Complete

---

## 1. What was built

- **`CollectionsHero.tsx`**:
  - Stabilized autoplay lifecycle using `api?.plugins()?.autoplay` with calm 6.5s interval (`AUTOPLAY_MS = 6500`).
  - Added pause-on-hover (`stopOnMouseEnter: true`) and pause-on-interaction, with complete suppression under `prefers-reduced-motion`.
  - Finalized sleek linear slide indicators (`h-[2px]`, `w-6` active bar with `cubic-bezier(0.16, 1, 0.3, 1)` easing) and eliminated all bulky circular navigation buttons.
  - Implemented subtle brass promotional tag (`SPECIAL OFFER`) above the title for active offer slides.
  - Configured dual offer CTAs: cream "Enquire Offer" button routing to WhatsApp with pre-filled context, and outline "All offers" anchor button linking to `#offers`.
  - Added tactile feedback states (`active:scale-[0.98]`) on all buttons.

---

## 2. Verification

- `npm run lint`: Passed with 0 errors, 0 warnings.
- Carousel interaction verified: smooth transitions, zero layout shifts, proper offer slide badging.
