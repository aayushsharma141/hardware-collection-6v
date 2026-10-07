# PLAN.md: Phase 15 — Animation Polish & GPU Acceleration

## Overview
This phase executes the animation opportunities and fixes identified in the previous review (based on Emil Kowalski's design engineering philosophy). The goal is to eliminate silent performance bugs caused by `transition-all`, enforce strict UI duration bands, and ensure snappy, hardware-accelerated interactions.

Every chunk includes specific execution skills and a mandated review gate using designated critique skills, as per the user's instructions.

## Wave 1: Core Primitives & Global Easing

### Chunk 1: Global Easing Variables
- **Target**: `src/app/globals.css`
- **Execution Skills**: `/impeccable polish`, `/emil-design-eng`
- **Task**: 
  - Add the custom curve: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1);` inside `@theme inline`.
  - Rewrite `.transition-premium` to explicitly list: `transform`, `opacity`, `background-color`, `border-color`, `color`—all running at `200ms var(--ease-out)`.
- **Review Gate**: 
  - **Skills**: `/ui-review`, `/review-animations`
  - **Verification**: Ensure no `all` keyword exists in `.transition-premium` and check that duration strictly stays in the 180-250ms band for state changes.

### Chunk 2: Base Button Component
- **Target**: `src/components/ui/button.tsx`
- **Execution Skills**: `/impeccable polish`, `/emil-design-eng`
- **Task**: 
  - Replace `transition-all` with explicit property lists: `transition-[color,background-color,border-color,text-decoration-color,fill,stroke,transform]`.
  - Set interaction timing: `duration-150`.
  - Add press state: `active:scale-[0.97]`.
- **Review Gate**: 
  - **Skills**: `/ui-review`, `/impeccable critique`, `/gsd-code-review`
  - **Verification**: Confirm absence of `transition-all` and verify `active:scale-[0.97]` is present.

## Wave 2: Component-Level Interaction Refinement

### Chunk 3: Floating Action Buttons (FABs)
- **Target**: `src/components/ui/FloatingActionButtons.tsx`
- **Execution Skills**: `/impeccable polish`, `/emil-design-eng`
- **Task**: 
  - Replace `transition-all duration-200 active:scale-[0.98]` with `transition-[color,background-color,border-color,transform,box-shadow] duration-150 ease-out active:scale-[0.97]` on both the consultation and showroom FABs.
- **Review Gate**: 
  - **Skills**: `/gsd-ui-review`, `/review-animations`
  - **Verification**: Confirm hover/press timings are restricted to the 100-150ms band and scale is set to `0.97`.

### Chunk 4: Brand Discovery Cards
- **Target**: `src/components/collections/BrandDiscovery.tsx`
- **Execution Skills**: `/impeccable polish`, `/emil-design-eng`
- **Task**: 
  - On the alphabetical brand button (line ~173), replace `transition-all duration-300` with `transition-[border-color,transform] duration-150 ease-out active:scale-[0.97]`.
  - Add entry stagger sequence to the grid: `opacity: 0; transform: translateY(10px)` transitioning to settled over 400ms.
  - Implement stagger using inline `style={{ transitionDelay: 'calc(var(--i) * 40ms)' }}`. 
  - Wrap entry animation in a `prefers-reduced-motion: no-preference` check, falling back to pure opacity fade.
- **Review Gate**: 
  - **Skills**: `/ui-a11y`, `/review-animations`, `/impeccable critique`
  - **Verification**: Ensure reduced motion fallback is properly implemented, stagger delay is capped, and hover duration does not exceed 150ms.

## Final Verification & Sign-off

- **Skills**: `/gsd-verify-work`, `/ui-review`
- **Actions**:
  - Run mechanical build: `npm run build`.
  - Run DevTools performance trace (playback at 10%) on `FloatingActionButtons.tsx` and `BrandDiscovery.tsx` to verify layout properties are excluded from transitions.
