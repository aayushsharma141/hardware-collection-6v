# Phase 17: Animation Opportunities & Motion System Integration - Context

**Gathered:** 2026-10-09  
**Status:** Ready for planning  
**Canonical Source:** [`.planning/animation_opportunities.md`](file:///E:/Hardware-Collection/.planning/animation_opportunities.md)

<domain>
## Phase Boundary

Implement targeted, utility-driven animations and motion system refinements across the showroom, catalogue viewer, and consultation funnel. Resolve spatial discontinuities, eliminate layout reflow pops, and establish mandatory reduced-motion accessibility guards across all animated surfaces.

**In scope:**
- **Catalogue Sheets Spatial Continuity (`CatalogViewerModal.tsx:651–694`):**
  - Wrap catalogue sheets (`PageJump`, `ThumbnailDrawer`, `CatalogSearch`, `CatalogueInfo`) in `<AnimatePresence>`.
  - Introduce `useIsDesktop.ts` hook using `useSyncExternalStore` with `matchMedia("(min-width: 768px)")` to resolve entrance vectors at mount (`y: 100%` below 768px vs `x: 100%` at 768px+).
  - Separate motion wrapper (`<motion.div>`) from the inner `<aside>` container to avoid collisions with dynamic inline `style={{ height }}` during mobile touch drag.
  - Retain intentional `transition-[height] duration-0` on `<aside>` for lag-free 1:1 finger tracking.
  - Centered dialog motion for `PageJump` (`scale: 0.95 -> 1`, `opacity: 0 -> 1`).
  - Mandatory reduced-motion guard using `useReducedMotion()` from `motion/react`.
- **Consultation Form Success State (`ConsultationForm.tsx:218`):**
  - Wrap form fields and success screen (`ConsultationSuccess`) in `<AnimatePresence mode="wait">`.
  - Smooth cross-fade (`opacity: 0 -> 1`, scale `0.98 -> 1` over 350ms `--duration-medium`).
  - Mandatory reduced-motion guard with `useReducedMotion()`.
- **FAQ Accordion Expansion (`FaqSection.tsx:103`):**
  - Replace `{isOpen && ...}` conditional unmount with continuous CSS Grid transition (`grid-template-rows: 0fr -> 1fr`, inner `overflow-hidden`).
  - Explicit CSS transitions: `grid-template-rows var(--duration-medium) var(--ease-out), opacity var(--duration-medium) var(--ease-out)` (strictly no `transition: all`).
  - Mandatory reduced-motion guard with `@media (prefers-reduced-motion: reduce)`.
- **Hero Carousel Controls Tactile Feedback (`HeroControls.tsx:22`):**
  - Add active press feedback: `:active { transform: scale(0.97); }` with `transition: transform 160ms var(--ease-out)`.
  - Gate on `shouldReduceMotion` or `motion-safe:active:scale-[0.97]`.

**Out of scope:**
- Animating keyboard navigation / focus management in `MobileMenu.tsx` (rejected candidate: never animate keyboard focus jumps).
- Decorative hover transforms on dense alphabetical brand cells in `BrandDiscovery.tsx` (rejected candidate: data scanning legibility must not be hindered).
- Modifying core PDF rendering canvas logic in `PdfCanvas.tsx`.
- Modifying design tokens in `globals.css` (uses existing tokens `--ease-out`, `--duration-medium`, `--duration-quick`).

</domain>

<decisions>
## Implementation Decisions

### Motion Architecture & Spatial Continuity
- **D-17-01:** **Catalogue Viewer Modal Sheet Transitions.** Replace instant sheet teleports in `CatalogViewerModal.tsx:651-694` with physical sheet slide transitions using `<AnimatePresence>`.
- **D-17-02:** **Outer Motion Wrapper Architecture.** Motion transforms must be applied to an outer `<motion.div>` element surrounding the drawer, *never* directly onto the inner `<aside>` element. The inner `<aside>` manages manual touch-drag calculations (`dragRef.current`) and sets runtime inline `style={{ height }}` in `ThumbnailDrawer.tsx:169` and `CatalogSearch.tsx:229`.
- **D-17-03:** **Preserve `duration-0` Touch Drag Tracking.** The existing `transition-[height] duration-0` class on `<aside>` in `ThumbnailDrawer.tsx:168` and `CatalogSearch.tsx:228` is deliberate to ensure the sheet stays locked 1:1 to the user's finger. It must NOT be given a transition duration.
- **D-17-04:** **Option B Breakpoint Hook (`useIsDesktop.ts`).** Create `src/components/catalog/viewer/useIsDesktop.ts` using React's `useSyncExternalStore` subscribed to `matchMedia("(min-width: 768px)")` (mirroring `CollectionsHero.tsx:31-36`). Entrance direction is resolved at mount time:
  - `< 768px` (`false`): Slide from bottom (`y: "100%" -> 0`, `opacity: 0 -> 1`).
  - `≥ 768px` (`true`): Slide from right (`x: "100%" -> 0`, `opacity: 0 -> 1`).
  - Direction is locked on mount so resizing an already-open sheet does not replay entrance motion.
- **D-17-05:** **Centered Dialog Treatment for `PageJump`.** `PageJump` is a centered overlay card (`role="dialog"`), not a bottom or side sheet. It enters with centered scale/fade (`scale: 0.95 -> 1`, `opacity: 0 -> 1`).

### Accessibility & Reduced Motion
- **D-17-06:** **Mandatory Reduced-Motion Handling.** The global rule in `globals.css:443` only resets `.liquid-glass-reflection`. Every animation introduced in Phase 17 must explicitly handle `prefers-reduced-motion: reduce`:
  - `CatalogViewerModal.tsx`: Introduce `useReducedMotion()` from `motion/react`. When true, enforce `duration: 0` and zero spatial translation.
  - `ConsultationForm.tsx`: Introduce `useReducedMotion()` from `motion/react`. When true, swap states instantaneously without scale or fade delay.
  - `FaqSection.tsx`: Add `@media (prefers-reduced-motion: reduce)` / `motion-reduce:transition-none` to snap open/closed instantly.
  - `HeroControls.tsx`: Gate active scale depression using existing `shouldReduceMotion` or `motion-safe:active:scale-[0.97]`.

### Performance & CSS Hygiene
- **D-17-07:** **Strictly Explicit Transition Properties.** Never use `transition: all`. In `FaqSection.tsx`, explicitly declare `transition: grid-template-rows var(--duration-medium) var(--ease-out), opacity var(--duration-medium) var(--ease-out)` to protect composite and layout performance.
- **D-17-08:** **Token Discipline.** Strictly leverage existing design tokens from `globals.css`:
  - `--ease-out`: `cubic-bezier(0.23, 1, 0.32, 1)` (line 181)
  - `--duration-medium`: `350ms` (line 175)
  - `--duration-quick`: `150ms` (line 173)

</decisions>
