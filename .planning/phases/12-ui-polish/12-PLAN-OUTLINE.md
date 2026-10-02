# Phase 12: UI Polish and Visual Animations - Plan Outline

## Context
Based on `12-CONTEXT.md`, the objective is to elevate the visual aesthetic using GSAP + ScrollTrigger for subtle, luxurious micro-interactions and scroll animations across the site. 

## Wave 0: Foundation
- **12-01: GSAP & Animation Primitives Setup**
  - Install `gsap` and `@gsap/react`
  - Create standard easing and timing constants in `src/lib/animations.ts` (ensuring we respect the 150-250ms motion budget).
  - Setup a global hook or context for handling `prefers-reduced-motion: reduce`.
  - Ensure standard CSS transitions are mapped to the brand colors (Near-black `#131314` / Gold `#e5c487` / `#c8a96e`).

## Wave 1: Global Elements
- **12-02: Universal Polish & Navigation**
  - Refine hover states for all primary CTAs and textual links (using an elegant expanding gold underline or fade).
  - Animate the Navbar reveal on load.
  - Implement smooth page routing transitions (using Next.js template.tsx or GSAP route transitions).

## Wave 2: Homepage Surfaces
- **12-03: Hero & Story Section Animations**
  - `CollectionsHero.tsx` or Homepage Hero: Implement a subtle upward fade stagger for typography.
  - `AboutStory.tsx`: Add a ScrollTrigger to reveal the story paragraphs as they enter the viewport.
  - `NormalizedLogo.tsx`: Add a subtle, luxurious hover state or load-in effect.
  - `BrandTrustStrip.tsx` / `BrandDiscovery.tsx`: Add subtle parallax or smooth infinite marquees if applicable.

## Wave 3: Collections & Discovery
- **12-04: Catalog Grids & Rails**
  - `CompactCollectionGrid.tsx` & `CollectionIndex.tsx`: Add stagger effects on scroll so cards gracefully fade and slide up into view.
  - `SpaceIntentRail.tsx`: Enhance the horizontal scroll feel or add hover reveals for the intent cards.
  - Ensure GSAP instances are properly cleaned up on unmount (using `@gsap/react` `useGSAP` hook) to prevent memory leaks and React StrictMode double-fire issues.

## Execution
We will generate detailed `12-XX-PLAN.md` files for each task prior to executing them, or execute them sequentially through the `/gsd-execute-phase` flow.
