# Phase 1: Ponytail Cleanup & De-duplication

## Context
Following the Ponytail Audit Report, the user has requested full execution of all 5 findings to reduce codebase bloat, over-engineering, and file tree depth.

## Decisions

### 1. Mobile-Specific Components (Shrink)
- **Problem**: `src/components/home/mobile/` contains entirely duplicated component variants for mobile.
- **Decision**: We will merge these variants into their desktop counterparts (e.g., `HeroStage.tsx`, `CategoryDiscovery.tsx`) using Tailwind responsive prefixes (`hidden lg:flex`, `lg:hidden`) or by adapting the layout to naturally scale. We will then delete the `mobile/` directory entirely.

### 2. Custom Hooks (Native)
- **Problem**: `useFocusTrap.ts` and `useScrollVelocity.ts` reinvent standard features.
- **Decision**: 
  - Delete `useScrollVelocity.ts` and replace its imports with `useScroll` from `framer-motion` if necessary.
  - Evaluate `useFocusTrap.ts`. If standard `inert` or headless UI exists, use that. Otherwise, strip it down to absolute minimum lines.

### 3. Polyfills (Delete)
- **Problem**: `src/lib/polyfills.ts` is redundant in modern Next.js environments.
- **Decision**: Delete the file and remove its import from `layout.tsx` (or wherever it is sourced). 

### 4. Over-split Hero (Yagni)
- **Problem**: The Hero component is fragmented across 7+ files (`AtmosphericBackground`, `ParticleWave`, `PointerLight`, etc.).
- **Decision**: Consolidate visual and interactive layers back into `HeroStage.tsx` or a single `HeroVisuals.tsx`. The goal is to remove nested component hops that just pass props down without doing independent work.

### 5. Test File Proximity (Shrink)
- **Problem**: Next.js App router allows colocation, but tests are buried in `__tests__/` subfolders inside every component directory.
- **Decision**: Flatten the directory tree. Move `__tests__/foo.test.ts` to `foo.test.ts` so it sits directly alongside `foo.ts`. Delete the empty `__tests__` directories.

## Next Steps
Proceed to the implementation phase (`/gsd-plan-phase` or direct execution) using this document as the rigid boundary. Do not add new features; this is purely a subtractive operation.
