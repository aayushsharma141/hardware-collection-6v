# Phase 17: Animation Opportunities & Motion System Integration - Plan Outline

**Phase Goal:** Implement targeted, utility-driven animations and motion system refinements across the showroom, catalogue viewer, and consultation funnel with mandatory reduced-motion guards.

---

### Wave Structure

```
Wave 1 (Isolated UI Primitives)
├── Plan 17-01: Hero Carousel Controls & FAQ Accordion Transitions
└── Plan 17-02: Consultation Form Submission State Cross-Fade

Wave 2 (Immersive Catalogue Viewer Overhaul)
└── Plan 17-03: Catalogue Viewer Modal Sheets & Responsive Breakpoint Docking
```

---

### Plan Summary

| Plan | Target Files | Key Deliverables | Dependencies |
|---|---|---|---|
| **17-01** | `src/components/home/HeroControls.tsx`<br>`src/components/home/FaqSection.tsx` | Carousel arrow `:active` feedback with reduced-motion gate; CSS Grid FAQ accordion transition (no `transition: all`). | None |
| **17-02** | `src/components/consultation/ConsultationForm.tsx` | Form-to-success `<AnimatePresence mode="wait">` transition with `useReducedMotion()` instant fallback. | None |
| **17-03** | `src/components/catalog/viewer/useIsDesktop.ts`<br>`src/components/catalog/CatalogViewerModal.tsx`<br>`src/components/catalog/viewer/ThumbnailDrawer.tsx`<br>`src/components/catalog/viewer/CatalogSearch.tsx`<br>`src/components/catalog/viewer/CatalogueInfo.tsx`<br>`src/components/catalog/viewer/PageJump.tsx` | `useIsDesktop` hook via `useSyncExternalStore`; sheet slide entrance/exit (`y` on mobile, `x` on desktop, scale on dialog); outer wrapper motion architecture; 390px/768px/1280px verification. | None |
