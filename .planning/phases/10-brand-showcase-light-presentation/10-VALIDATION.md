# Phase 10 Validation Criteria

## Acceptance Criteria
1. **Asset Integrity**: All 22 brand logos must exist in `/public/brands/` with zero missing files or 404s.
2. **True Color & Transparency**: No CSS filters (`invert`, `brightness-0`, or opacity reductions under 90%) applied to brand logos.
3. **Legibility on Light Background**: Every logo (especially dark marks like Yale, Madhuram, Tattva, and gold marks like Dorio, Taco, Maranello) must achieve distinct legibility on `#FAF7F2` with porcelain plinth backdrops.
4. **Motion & Interaction**: Dual-lane marquee maintains smooth 60fps infinite scrolling and pauses cleanly on hover/touch.
5. **Type Safety & Build**: Zero TypeScript errors in `brands.ts` and `BrandTrustStrip.tsx`.
