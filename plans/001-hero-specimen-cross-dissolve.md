# 001 — Smooth Specimen Aperture Cross-Dissolve & Entrance

- **Status**: DONE
- **Commit**: 87c87cd
- **Severity**: MEDIUM
- **Category**: Physicality & origin / Preventing a jarring change
- **Estimated scope**: 1 file (`src/components/home/HeroStage.tsx`)

## Problem

When the hero carousel advances (every 8 seconds or via indicator clicks), the specimen image inside the right aperture card (`src/components/home/HeroStage.tsx:219-225`) snaps abruptly. Because React unmounts and remounts the `<img>` tag with `key={aperture-${currentSlideIndex}}`, the image disappears and reappears without an optical bridge, causing a noticeable visual flash on high-DPI displays.

```tsx
/* src/components/home/HeroStage.tsx:219-225 — current */
<img
  key={`aperture-${currentSlideIndex}`}
  alt="Close detail of a brass hardware finish"
  className="aperture-image absolute inset-[44px_24px_80px] h-[380px] xl:h-[430px] w-[410px] xl:w-[450px] object-contain mix-blend-multiply opacity-[0.88] transition-all duration-500"
  decoding="async"
  src={currentSlide.productUrl || "/cinema/hero/HC-01-HERO-03.png"}
/>
```

## Target

The image enters with a smooth, hardware-accelerated cross-dissolve and micro-scale settlement (`scale(0.97)` → `scale(1.0)` + `opacity: 0` → `0.88`) powered by GSAP in `HeroStage.tsx`'s existing transition timeline or standard CSS entry class:

```tsx
/* target GSAP timeline adjustment in src/components/home/HeroStage.tsx */
const apertureImg = containerRef.current.querySelector(".aperture-image");
if (apertureImg) {
  tl.fromTo(
    apertureImg,
    { autoAlpha: 0, scale: 0.97 },
    { autoAlpha: 0.88, scale: 1.0, duration: 0.6, ease: "power2.out" },
    0.05
  );
}
```

## Repo conventions to follow

- Existing GSAP transitions in `HeroStage.tsx:80-108` already orchestrate `.hero-h1`, `.hero-p`, and `aperture` using timeline offsets and `power2.out` / `power3.out`.
- Easing convention: `power2.out` for physical entrances, matching line 104 (`duration: 0.8, ease: "power2.out"`).
- Exemplar: `src/components/home/HeroStage.tsx:82-107`.

## Steps

1. In `src/components/home/HeroStage.tsx`, inside `useGSAP` (around line 58), add selector for `.aperture-image`:
   ```ts
   const apertureImage = containerRef.current.querySelector(".aperture-image");
   ```
2. Inside `tl` timeline (around line 100), add the entry animation for `apertureImage`:
   ```ts
   if (apertureImage) {
     tl.fromTo(
       apertureImage,
       { autoAlpha: 0, scale: 0.97 },
       { autoAlpha: 0.88, scale: 1.0, duration: 0.6, ease: "power2.out" },
       0.05
     );
   }
   ```
3. Update `.aperture-image` className to remove conflicting `transition-all duration-500` so GSAP has full control of opacity and transform:
   ```tsx
   className="aperture-image absolute inset-[44px_24px_80px] h-[380px] xl:h-[430px] w-[410px] xl:w-[450px] object-contain mix-blend-multiply will-change-transform"
   ```

## Boundaries

- Do NOT touch `src/components/home/mobile/*` or `HeroCarousel.tsx`.
- Do NOT alter image dimensions or absolute bounds `inset-[44px_24px_80px]`.
- Do NOT change the 8000ms auto-advance interval.

## Verification

- **Mechanical**: Run `npm run build` or `npx tsc --noEmit` and ensure clean compile with zero type errors.
- **Feel check**: 
  - Watch the hero aperture card when the slide transitions at `http://localhost:3000`.
  - Confirm the new hardware image softly glides into place without any white flash or abrupt frame pop.
  - Open Chrome DevTools Animations drawer, throttle to 10% speed, and inspect the curve and opacity ramp.
  - Enable `prefers-reduced-motion` in DevTools Rendering panel: confirm the image swaps cleanly with zero scaling.
- **Done when**: Hardware specimen transitions feel like a physical camera shutter opening into a newly lit display case.
