# 002 — Hero CTA Tactile Press Feedback

- **Status**: DONE
- **Commit**: 87c87cd
- **Severity**: MEDIUM
- **Category**: Feedback & Physicality
- **Estimated scope**: 1 file (`src/components/home/HeroStage.tsx`)

## Problem

The primary "Explore Collections" button and secondary "WhatsApp The Showroom" button (`src/components/home/HeroStage.tsx:161-196`) have hover effects but lack physical `:active` depression feedback. For an architectural hardware store whose primary tagline is "Touch Before You Decide", the primary interactive buttons feel static and weightless upon click.

```tsx
/* src/components/home/HeroStage.tsx:167 — current */
className="brass-plate hc-focus h-[54px] px-8 bg-[#8b1a42] text-white text-xs sm:text-[13px] font-bold uppercase tracking-[0.18em] flex items-center gap-3.5 no-underline hover:bg-[#6b1432] btn-tactile transition-premium rounded shadow-lg"
```

## Target

Tactile spring/compression on `:active` with subtle scale (`0.975`) and rapid snap-back:

```css
/* target */
.btn-tactile:active {
  transform: scale(0.975);
  transition: transform 120ms cubic-bezier(0.23, 1, 0.32, 1);
}
```

## Repo conventions to follow

- Existing `.btn-tactile` class in `src/app/globals.css` or Tailwind arbitrary `:active:scale-[0.975]` utility.
- Duration: 120ms–140ms, inside the button press feedback budget (<160ms).

## Steps

1. In `src/components/home/HeroStage.tsx`, locate the primary button links (`line 167` and `line 177`) and the secondary WhatsApp link (`line 191`).
2. Add `:active:scale-[0.975] active:transition-transform active:duration-100 transition-all duration-200` to both primary and secondary CTAs.

## Boundaries

- Do NOT change link URLs or click tracking handlers.
- Do NOT alter padding, font sizes, or color values.

## Verification

- **Feel check**: Click and hold the primary CTA button; observe immediate subtle compression, then release to feel the natural spring recovery.
- **Done when**: Clicking either hero CTA produces a distinct physical response without visual jitter.
