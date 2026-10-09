# Phase 17: Animation Opportunities & Motion System Integration - Research

**Date:** 2026-10-09  
**Status:** Completed  
**Subject:** Technical architecture and implementation patterns for Phase 17 motion upgrades

---

## 1. Motion Architecture & Libraries

### 1.1 `motion/react` (v13.1.0)
The repository uses `motion` v13.1.0 with the modern `motion/react` entry point (replacing legacy `framer-motion` imports). Existing usages in `Navbar.tsx`, `ConsultationDrawer.tsx`, `MobileMenu.tsx`, and `FloatingConsultationCapsule.tsx` follow this exact pattern:

```tsx
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
```

### 1.2 Design Tokens (`src/app/globals.css`)
All animations must align with established CSS custom properties in `:root`:
- `--duration-medium`: `350ms` (line 175) — standard modal, drawer, and state expansion duration
- `--duration-quick`: `150ms` (line 173) — tactile button and micro-interaction responses
- `--ease-out`: `cubic-bezier(0.23, 1, 0.32, 1)` (line 181) — luxurious deceleration curve for enters and expansions

---

## 2. Component Implementation Patterns

### 2.1 Catalogue Sheets (`CatalogViewerModal.tsx:651–694`)
- **Wrapper Isolation:** 
  The sheet aside element currently executes dynamic touch dragging by calculating client touch events (`dragRef.current`) and applying inline `style={{ height }}` with `transition-[height] duration-0` (`ThumbnailDrawer.tsx:168`, `CatalogSearch.tsx:228`).
  Applying `<motion.div>` directly to `<aside>` risks style and transform collisions. Therefore, the motion animation is placed on an outer wrapper, preserving `<aside>`'s direct height styling and touch listeners intact.
- **`useIsDesktop.ts` Hook Pattern:**
  Mirroring [`CollectionsHero.tsx:31-36`](file:///E:/Hardware-Collection/src/components/collections/CollectionsHero.tsx#L31-L36), use `useSyncExternalStore` for SSR-safe subscription to `(min-width: 768px)`:
  ```ts
  import { useSyncExternalStore } from "react";

  function subscribe(onChange: () => void) {
    if (typeof window === "undefined") return () => {};
    const media = window.matchMedia("(min-width: 768px)");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }

  const getSnapshot = () => (typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false);
  const getServerSnapshot = () => false;

  export function useIsDesktop(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  }
  ```
- **Mount-Time Direction Resolution:**
  When a sheet mounts, resolve `isDesktop = useIsDesktop()`.
  - Mobile (`< 768px`): `initial={{ y: "100%", opacity: 0 }}`, `animate={{ y: 0, opacity: 1 }}`, `exit={{ y: "100%", opacity: 0 }}`
  - Desktop (`≥ 768px`): `initial={{ x: "100%", opacity: 0 }}`, `animate={{ x: 0, opacity: 1 }}`, `exit={{ x: "100%", opacity: 0 }}`
  - Dialog (`PageJump`): `initial={{ scale: 0.95, opacity: 0 }}`, `animate={{ scale: 1, opacity: 1 }}`, `exit={{ scale: 0.95, opacity: 0 }}`
  - Locking at mount avoids replaying entrance animations if the viewport resizes while the drawer is already open.
- **Reduced Motion:**
  ```tsx
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: [0.23, 1, 0.32, 1] };
  ```

### 2.2 Consultation Form Success State (`ConsultationForm.tsx:218`)
- **State Transition:**
  Currently, `if (successLeadId) return <ConsultationSuccess />` replaces form inputs instantly.
  By wrapping in `<AnimatePresence mode="wait">` and keying on `Boolean(successLeadId)`, the form cleanly cross-fades into the confirmation screen.
- **Motion Parameters:**
  - Standard: `initial={{ opacity: 0, scale: 0.98 }}`, `animate={{ opacity: 1, scale: 1 }}`, `exit={{ opacity: 0, scale: 0.98 }}` over `350ms`.
  - Reduced Motion: `useReducedMotion()` sets `duration: 0` and eliminates scale transforms.

### 2.3 FAQ Accordion (`FaqSection.tsx:103`)
- **CSS Grid Trick for Height Animation:**
  Avoids costly JavaScript height measuring (`scrollHeight`) and layout thrashing.
  ```tsx
  <div
    className={`grid transition-[grid-template-rows,opacity] duration-350 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
      isOpen ? "grid-template-rows-[1fr] opacity-100" : "grid-template-rows-[0fr] opacity-0"
    }`}
  >
    <div className="min-h-0 overflow-hidden">
      <div className="pb-5 pt-0 text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed max-w-3xl">
        <p>{faq.answer}</p>
      </div>
    </div>
  </div>
  ```
- **Strictly No `transition: all`:**
  Target explicit properties: `grid-template-rows` and `opacity`.

### 2.4 Hero Navigation Arrows (`HeroControls.tsx:22`)
- **Active Tactile Press:**
  Buttons currently possess hover styles but lack active press depression.
  Add `motion-safe:active:scale-[0.97] transition-transform duration-150 ease-out`.
  `HeroControls` already imports and computes `const shouldReduceMotion = useReducedMotion();`. The Tailwind `motion-safe:` variant automatically disables the scale depression if the user prefers reduced motion.

---

## 3. Verification & Performance Guardrails

1. **`PdfCanvas` Raster Stability:**
   Drawer sliding must execute as a compositor layer transform without triggering CPU repaints on `<canvas>` elements. Verified via Chrome DevTools Paint Flashing (no green flashes over PDF viewer).
2. **Breakpoints Matrix:**
   - 390 px (Mobile): Vertical slide, drag handle height tracking intact.
   - 767 px vs 768 px: Docking switch boundary; verify no re-entrance on resize.
   - 1280 px (Desktop): Lateral right-edge docking and keyboard `Escape` dismiss.
3. **Reduced Motion Emulation:**
   Emulate `prefers-reduced-motion: reduce` in browser across all 4 surfaces; assert 0ms instantaneous transitions.
