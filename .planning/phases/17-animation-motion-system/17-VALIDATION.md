# Phase 17: Animation Opportunities & Motion System Integration - Validation Contract

**Date:** 2026-10-09  
**Status:** Defined  
**Scope:** Automated checks, visual regression guards, and manual responsive test suites for Phase 17.

---

## 1. Automated Quality Gates

All automated checks must pass without warnings or regressions:

```bash
# 1. Strict TypeScript check
npx tsc --noEmit

# 2. ESLint
npm run lint

# 3. Unit & Integration test suite
npm test

# 4. Architectural rule checks
npm test -- src/lib/collections/__tests__/routeInventory.test.ts
npm test -- src/lib/collections/__tests__/schemaQueryParity.test.ts
```

---

## 2. Motion System Verification Matrix

| Surface | Check Type | Viewport | Expected Behavior | Failure Condition |
|---|---|---|---|---|
| **`HeroControls.tsx`** | Micro-interaction | Any | Clicking Previous/Next triggers `scale(0.97)` depression over 160ms. | Button stays static on click or scales under reduced motion. |
| **`HeroControls.tsx`** | Reduced Motion | Any | With `prefers-reduced-motion: reduce`, button color transitions without scale depression. | Scale transform activates when reduced motion requested. |
| **`FaqSection.tsx`** | CSS Grid Expansion | 390px, 1280px | Clicking question smoothly expands answer via `grid-template-rows: 0fr -> 1fr` over 350ms. | Height jumps abruptly or answers pop in/out instantly. |
| **`FaqSection.tsx`** | CSS Hygiene | Code scan | Explicit `grid-template-rows, opacity` transition. Zero instances of `transition: all`. | Presence of `transition: all` in component styles. |
| **`ConsultationForm.tsx`** | State Transition | 390px, 1280px | Submission cross-fades into `<ConsultationSuccess />` with subtle `scale(0.98 -> 1)`. | Abrupt component snap; content jumps or collapses. |
| **`ConsultationForm.tsx`** | Reduced Motion | Any | With reduced motion active, success screen mounts instantaneously with 0ms delay. | Delay or animated cross-fade occurs under reduced motion. |
| **`CatalogViewerModal.tsx`** | Bottom Sheet Entrance | 390px | Opening `ThumbnailDrawer`, `CatalogSearch`, `CatalogueInfo` slides up from bottom (`y: 100% -> 0`). | Sheet teleports into view or causes background scroll. |
| **`CatalogViewerModal.tsx`** | Touch Drag Coexistence | 390px | Dragging mobile handle resizes height cleanly; 1:1 instantaneous tracking with `duration-0`. | Sheet lags behind finger or motion wrapper overwrites inline height. |
| **`CatalogViewerModal.tsx`** | Boundary Switch | 767px vs 768px | Sheet enters vertically at 767px; enters laterally at 768px. | Wrong entrance direction relative to CSS layout. |
| **`CatalogViewerModal.tsx`** | Resize Stability | 760px ↔ 775px | Dynamic resize across 768px while open adjusts layout without replaying entrance animation. | Sheet re-animates entrance or gets stuck in invalid transform. |
| **`CatalogViewerModal.tsx`** | Lateral Docking | 1280px | Drawers slide laterally from right edge (`x: 100% -> 0`) docking to right panel. | Drawer slides up from bottom or covers full width. |
| **`CatalogViewerModal.tsx`** | Centered Dialog | Any | `PageJump` mounts with centered scale/fade (`scale: 0.95 -> 1`). | Dialog slides up from bottom of viewport. |
| **`CatalogViewerModal.tsx`** | `PdfCanvas` Stability | 1280px | DevTools Paint Flashing shows 0 green repaint flashes on `<canvas>` during drawer slide. | Canvas repaints or flickers during drawer motion. |
| **`CatalogViewerModal.tsx`** | Keyboard Dismiss | 1280px | Pressing `Escape` executes clean reverse exit without focus trapping. | Drawer vanishes instantly or focus remains trapped. |

---

## 3. Evidence Sign-Off

Upon completion of plans 17-01, 17-02, and 17-03, generate verification summary in `17-SUMMARY.md` documenting test results and browser inspection evidence.
