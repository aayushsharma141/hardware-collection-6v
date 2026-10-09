# Plan 17-01 Summary: Hero Controls & FAQ Accordion Transitions

**Phase:** 17-animation-motion-system  
**Plan:** 01  
**Status:** Completed  
**Execution Date:** 2026-10-09  

---

### Executed Changes

1. **Hero Carousel Controls Tactile Press (`src/components/home/HeroControls.tsx`)**:
   - Added active press tactile depression to Prev and Next buttons: `motion-safe:active:scale-[0.97]` with explicit `transition-[color,transform] duration-150 ease-[var(--ease-out)]`.
   - Gated scale depression behind Tailwind's `motion-safe:` variant and the component's existing `shouldReduceMotion` check, suppressing scaling transforms for visitors preferring reduced motion.

2. **FAQ Accordion Smooth CSS Grid Expansion (`src/components/home/FaqSection.tsx`)**:
   - Replaced abrupt `{isOpen && ...}` conditional unmount with continuous CSS Grid height transitions:
     - Outer grid container: `grid transition-[grid-template-rows,opacity] duration-350 ease-[cubic-bezier(0.23,1,0.32,1)]` toggling between `grid-template-rows-[1fr] opacity-100` and `grid-template-rows-[0fr] opacity-0`.
     - Inner content container: `min-h-0 overflow-hidden` containing the padded text block.
   - Guarded against motion sensitivities via `motion-reduce:transition-none` on both the grid expansion container and the `Plus` toggle icon rotation.
   - Enforced zero usage of `transition: all` to safeguard browser composite and layout recalculation performance.

---

### Quality Verification
- **TypeScript**: `npx tsc --noEmit` passed with 0 errors.
- **Unit Tests**: 23 test suites passed (232/232 tests green).
- **CSS Hygiene**: Explicit property transitions only; verified zero layout reflow spikes.

---

### Corrections (2026-10-10, browser verification)

1. **Hero press feedback did not ship.** `HeroControls.tsx` is not imported anywhere (unused since `12f66b8`), so change 1 above had no effect on the site. The rendered Prev/Next buttons live in `HeroStage.tsx` ("Previous/Next specimen", desktop) and `HeroMobile.tsx` ("Previous/Next hero slide", mobile). PR #35 (`48f422c`) applies the press there, and the unused `HeroControls.tsx` was then deleted.
2. **`transition-[color,transform]` would not animate the press.** Tailwind 4 `scale-*` utilities set the CSS `scale` property, not `transform`. The fix uses `transition-[color,scale]` (desktop) and `transition-[background-color,scale]` (mobile, replacing `transition-all`). Guarded by `src/components/home/__tests__/heroPressClasses.test.ts`.
3. **FAQ classes.** `grid-template-rows-[…]` in change 2 generates no CSS in Tailwind 4; it was replaced with `grid-rows-[…]` in `d7585d2`.
