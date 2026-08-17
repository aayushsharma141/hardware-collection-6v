# Performance & Core Web Vitals Review Workflow

**Trigger:** `/workflow performance_review`  
**Purpose:** Audit LCP, CLS, INP, image formats, code-splitting, and bundle sizes.

---

## Performance Gates

1. **LCP (Largest Contentful Paint):** Target `< 1.2s`. Preload key visual assets.
2. **CLS (Cumulative Layout Shift):** Target `< 0.01`. Enforce explicit container aspect ratios (`16:9`, `3:4`).
3. **INP (Interaction to Next Paint):** Target `< 50ms`. Defer non-critical listeners via `runWhenIdle`.
4. **Bundle Splitting:** Verify routes use React `lazy()` and `Suspense` with `PageSkeleton`.

---

## Blocker Categorization

- **MUST FIX:** Un-optimized raw PNG/JPG image assets > 500KB; un-lazy-loaded route chunks > 2MB.
- **SHOULD FIX:** Synchronous layout reflows in animations.
- **COULD FIX:** Fine-tuning web font loading display (`font-display: swap`).
- **IGNORED:** Staging-only dev server metrics.
