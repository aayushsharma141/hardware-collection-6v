# Animation Opportunities & Motion System Integration

This report documents high-value animation opportunities across the showroom and catalogue interfaces, filtered strictly through utility, interaction frequency, and spatial continuity gating checks.

---

### Part 1 — Opportunities

| # | Location | Today | Purpose | Frequency | Suggested Motion & Implementation | Reduced-Motion Requirement |
|---|---|---|---|---|---|---|
| **1** | [`CatalogViewerModal.tsx:651–694`](file:///E:/Hardware-Collection/src/components/catalog/CatalogViewerModal.tsx#L651-L694) | Catalogue sheets (`PageJump`, `ThumbnailDrawer`, `CatalogSearch`, `CatalogueInfo`) teleport into view instantaneously | Spatial continuity / Physical sheet metaphor | Occasional | Wrap sheet elements in `<AnimatePresence>`. **Architectural Rule:** Apply `<motion.div>` on an outer wrapper around the sheet component, *never* directly onto the inner `<aside>` container where runtime touch-drag inline `style={{ height }}` is calculated. Retain the intentional `transition-[height] duration-0` class on `<aside>` (lines `:168` and `:228`) to prevent finger-lag during active touch-drag. **Breakpoint-Driven Entrance (Option B):** Implement a dedicated `useIsDesktop()` hook at [`src/components/catalog/viewer/useIsDesktop.ts`](file:///E:/Hardware-Collection/src/components/catalog/viewer/useIsDesktop.ts) using `useSyncExternalStore` with `matchMedia("(min-width: 768px)")` (mirroring [`CollectionsHero.tsx:31-36`](file:///E:/Hardware-Collection/src/components/collections/CollectionsHero.tsx#L31-L36)). When the sheet mounts, resolve entrance vector: below 768 px (`useIsDesktop() === false`), slide in from bottom (`y: "100%" -> 0`, `opacity: 0 -> 1`); at 768 px and above (`useIsDesktop() === true`), slide in laterally from right (`x: "100%" -> 0`, `opacity: 0 -> 1`). Direction is determined at mount time so resizing while open does not replay entrance animation. Uses `transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}` matching token `--ease-out` (`globals.css:181`) and `--duration-medium` (`globals.css:175`). For centered dialogs (`PageJump`), use subtle scale/fade (`scale: 0.95 -> 1`). | **Mandatory:** `CatalogViewerModal.tsx` currently has **no** motion or reduced-motion handling. The implementer must introduce `import { useReducedMotion } from "motion/react"` directly (matching `Navbar.tsx` and `HeroControls.tsx`). When true, disable spatial translations and enforce `transition={{ duration: 0 }}` for immediate rendering. |
| **2** | [`ConsultationForm.tsx:218`](file:///E:/Hardware-Collection/src/components/consultation/ConsultationForm.tsx#L218) | The success state (`<ConsultationSuccess />`) abruptly replaces the form fields via conditional early return | Confirmation feedback / State transition delight | Rare (conversion event) | Wrap form and success container in `<AnimatePresence mode="wait">`. Transition `opacity: 0` to `1` with a subtle scale from `0.98` to `1` over `350ms` using `--duration-medium` and `--ease-out`. | **Mandatory:** Introduce `useReducedMotion()`. When true, eliminate scale transforms and set animation duration to `0ms` to swap states instantaneously. |
| **3** | [`FaqSection.tsx:103`](file:///E:/Hardware-Collection/src/components/home/FaqSection.tsx#L103) | Accordion body (`faq.answer`) snaps open and shut via `{isOpen && ...}`, abruptly pushing subsequent page content downward | Layout jump prevention / Smooth accordion reveal | Occasional | Replace `{isOpen && ...}` conditional unmount with continuous CSS Grid transition: container `grid-template-rows: 0fr` to `1fr` with inner container `overflow-hidden`. Animate strictly explicit properties: `transition: grid-template-rows var(--duration-medium) var(--ease-out), opacity var(--duration-medium) var(--ease-out)` (never `transition: all`). | **Mandatory:** Add `@media (prefers-reduced-motion: reduce)` (or Tailwind `motion-reduce:transition-none`) to disable duration and expand/collapse instantly without height transitions. |
| **4** | [`HeroControls.tsx:22`](file:///E:/Hardware-Collection/src/components/home/HeroControls.tsx#L22) | Previous / Next carousel navigation buttons have `:hover` styles but lack tactile `:active` press feedback | Tactile responsiveness / Press acknowledgment | Frequent (tens/session) | Add `:active { transform: scale(0.97); }` with `transition: transform 160ms var(--ease-out)` to provide physical spring-back tactile feedback on click/tap. | **Mandatory:** Enforce `motion-safe:active:scale-[0.97]` or leverage the existing `shouldReduceMotion` check to prevent scaling when reduced motion is preferred. |

---

### Part 2 — Rejected Candidates

The following candidates were evaluated and intentionally **excluded**:

- **[`MobileMenu.tsx:38`](file:///E:/Hardware-Collection/src/components/layout/MobileMenu.tsx#L38)** — Escape key and Tab focus trapping handlers inside the navigation drawer.  
  *Reason for Rejection:* Keyboard-initiated interaction executed frequently. Focus jumps and keyboard navigation flows must never be delayed or animated.
- **[`BrandDiscovery.tsx:167`](file:///E:/Hardware-Collection/src/components/collections/BrandDiscovery.tsx#L167)** — Alphabetical brand directory grid cells for brands lacking vector logos. Considered subtle scale/slide shifts on hover.  
  *Reason for Rejection:* Dense, scanning-focused directory table. Decorative motion adds visual jitter and compromises fast scanning and readability.

---

### Part 3 — Verdict & Execution Priority

The repository exhibits commendable motion restraint, leveraging GSAP and Framer Motion primarily for hero moments and Lenis for smooth scrolling. 

#### Priority Ordering

1. **Priority 1: `CatalogViewerModal.tsx:651–694` (Modal Sheet Slides)**  
   - **Impact:** Solves the primary spatial disconnect in the app. The catalogue viewer is an immersive full-screen viewport; teleporting sheets on top disrupts the physical overlay metaphor.
   - **Reduced-Motion Status:** Currently unhandled. Implementer must import `useReducedMotion` from `motion/react` as this file contains no prior motion hooks.
   - **Concrete Verification Protocol:**
     - **Mobile Viewport (390 px — `--breakpoint-xs`):**
       - **Bottom Sheet Entrance:** Open `ThumbnailDrawer`, `CatalogSearch`, and `CatalogueInfo`. Confirm sheets slide up smoothly (`translateY(100%) -> 0`) over 350ms (`--duration-medium`) without causing parent document scrolling or layout jitter.
       - **Center Dialog (`PageJump`):** Confirm dialog renders as a centered modal with subtle scale/fade (`scale: 0.95 -> 1`, `opacity: 0 -> 1`), not a bottom-up translate.
       - **Touch Drag Coexistence & Instantaneous Tracking:** Verify the touch-drag handle (`ThumbnailDrawer.tsx:173-183`, `CatalogSearch.tsx:233-243`) works seamlessly. Motion wrapper elements must be placed outside `<aside>` so they do not collide with runtime inline `style={{ height }}` updates. The existing `transition-[height] duration-0` class on `<aside>` must be kept intact so the sheet stays locked to the user's finger without transition lag.
       - **Dismiss Transition:** Confirm backdrop tap, touch-drag down, and close button trigger smooth exit transitions via `<AnimatePresence>`.
       - **Reduced Motion Emulation:** Emulate `prefers-reduced-motion: reduce` in DevTools; verify instant mount and unmount with 0ms duration and zero spatial translation.
     - **Responsive Boundary Check (767 px vs 768 px — Tailwind `md` Breakpoint):**
       - **`useIsDesktop()` Hook Resolution:** Confirm `useIsDesktop()` returns `false` at 767 px and `true` at 768 px.
       - **Entrance Direction per Width:** Open sheet at 767 px and assert translation is vertical (`y: 100% -> 0`). Close, resize viewport to 768 px, reopen and assert translation is lateral (`x: 100% -> 0`).
       - **Docking Mode Switch:** Verify layout below 768px (tested at 767px) docks as bottom sheet (`justify-end`, `style={{ height }}`); at 768px and above, verify it docks as a right-hand sidebar (`md:w-72` / `md:w-80`, `md:!h-full`).
       - **Active Resize Transition (No Re-entrance):** Mount `ThumbnailDrawer` or `CatalogSearch` at 767 px. While open, dynamically resize across the 768px boundary (760px ↔ 775px). Assert that the component switches between bottom sheet and lateral drawer cleanly without clipped height, broken translate styles, layout locks, or replaying the entrance animation mid-session.
     - **Desktop Viewport (1280 px):**
       - **Lateral Side Docking:** Verify side drawers mount docked to the right edge and animate laterally (`translateX(100%) -> 0`), avoiding bottom-up movement.
       - **`PdfCanvas` Stability Measurement:** Verify canvas rendering stability using two concrete measures:
         1. *Paint Flashing:* Enable "Paint flashing" in Chrome DevTools (Rendering panel); confirm the `<canvas>` bounding box does not trigger repaint cycles (no green flashes) during drawer entrance/exit (transform animations remain exclusively on the compositor).
         2. *Visual Snapshot Comparison:* Compare visual snapshot before drawer trigger vs. during drawer animation to confirm zero blank frame, canvas clear, or raster scaling artifacts.
       - **Keyboard Dismiss:** Verify pressing `Escape` initiates clean exit animations without focus trapping or lingering overlay artifacts.
       - **Reduced Motion Emulation:** Verify instant appearance/closure without delay.
2. **Priority 2: `FaqSection.tsx:103` (CSS Grid Accordion Expansion)**  
   - **Impact:** Eliminates severe layout shifting on the homepage FAQ while avoiding expensive JS height measurement hacks.
3. **Priority 3: `ConsultationForm.tsx:218` (Lead Submission State Cross-Fade)**  
   - **Impact:** Polishes the primary commercial conversion funnel with clean exit/enter transitions.
4. **Priority 4: `HeroControls.tsx:22` (Active Button Micro-interaction)**  
   - **Impact:** Quick tactile polish for carousel navigation controls.
