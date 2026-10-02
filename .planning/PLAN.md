# PLAN.md: Ponytail Audit Execution

## Overview
This phase executes the findings from the Ponytail audit to reduce over-engineering and deduplicate codebase artifacts. 

## Checklist

### 1. Consolidate Mobile Components
- [ ] Edit `src/app/page.tsx` to conditionally render the mobile UI components directly within the main desktop components using Tailwind responsive classes (`hidden lg:flex`, `lg:hidden`, etc.) where possible, or keep the existing logical separation in `page.tsx` but move the files out of the nested `mobile/` directory and rename them (e.g. `MobileHero.tsx` -> `HeroMobile.tsx`) to sit alongside their desktop counterparts.
- [ ] If combining into single responsive components is too complex due to entirely different GSAP DOM structures, simply rename and move the components out of `src/components/home/mobile/` to `src/components/home/`.
  - Move `MobileHero.tsx` to `src/components/home/HeroMobile.tsx`
  - Move `MobileCategoryDiscovery.tsx` to `src/components/home/CategoryDiscoveryMobile.tsx`
  - Move `MobileProductReel.tsx` to `src/components/home/ProductReelMobile.tsx`
  - Move `MobileReviews.tsx` to `src/components/home/ReviewsMobile.tsx`
  - Move `MobileConsultation.tsx` to `src/components/home/ConsultationMobile.tsx`
- [ ] Update imports in `src/app/page.tsx`.
- [ ] Delete the `src/components/home/mobile` folder.

### 2. Clean Custom Hooks
- [ ] Delete `src/hooks/useScrollVelocity.ts` (it is entirely unused).
- [ ] Review `src/hooks/useFocusTrap.ts`. If it can be replaced by the native HTML `inert` attribute in `CatalogViewerModal.tsx`, replace its usage and delete `useFocusTrap.ts`. Otherwise, leave it but simplify if possible.

### 3. Remove Legacy Polyfills
- [ ] Remove the import for `polyfills.ts` from `src/app/layout.tsx`.
- [ ] Remove the import for `polyfills.ts` from `src/components/catalog/viewer/PdfCanvas.tsx`.
- [ ] Delete `src/lib/polyfills.ts`.

### 4. Flatten Hero Components
- [ ] In `src/components/home/`, identify the components split across `cinema/`, `visual/`, and `hero/`.
- [ ] Consolidate visual and interactive layers (`AtmosphericBackground.tsx`, `PointerLight.tsx`, `ParticleWave.tsx`, `HeroCarousel.tsx`, etc.) back into `HeroStage.tsx` or a unified `HeroVisuals.tsx` component if they only exist to pass props down or add single `div` wrappers.
- [ ] Delete the unused subfolders if they become empty (`src/components/home/cinema`, `src/components/home/hero`, `src/components/visual`).

### 5. Flatten Test Directories
- [ ] Move any `*.test.ts` or `*.test.tsx` files out of `__tests__` subdirectories and place them directly next to their target files.
- [ ] Run a `find` command to delete all empty `__tests__` directories in `src/components/`.

## Validation
- Ensure `npm run build` succeeds after these refactors.
- Verify no functionality is lost on mobile or desktop on the home page.
