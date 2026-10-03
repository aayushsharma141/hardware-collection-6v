<!-- generated-by: gsd-doc-writer -->
# Performance & Core Web Vitals Review Workflow

**Trigger:** `/workflow performance_review`

## Purpose

Check that the public routes meet the performance gates in `PRODUCT.md`
(`## Capabilities and Constraints`): **LCP ≤ 2.5s, CLS ≤ 0.10, INP ≤ 200ms**, and that
heavy client code stays out of the initial route chunk. The audience is largely
mid-range Android on mobile data, so load speed decides who the site reaches.

## When to run

- Before a production release (feeds `production_readiness`).
- After adding images, animation, or a new client component to `/`, `/collections` or `/catalogues`.
- After any dependency upgrade to `next`, `motion`, `gsap`, `lenis`, `pdfjs-dist` or `three`.

## Inputs

- `PRODUCT.md` — the gate thresholds.
- `next.config.ts` — `images.remotePatterns` (cdn.sanity.io, lh3.googleusercontent.com, images.unsplash.com).
- `src/app/` routes and `src/components/` client components.
- `public/` static assets.

The repo has **no automated Web Vitals, Lighthouse or bundle-analyzer tooling**. Field and
lab measurements are manual (step 5).

## Steps

1. **Build.** Run `npm run build` and record the route table it prints. A route that fails
   to prerender or unexpectedly becomes dynamic is a finding.
2. **Code-splitting.** Heavy, interaction-only UI must load through `next/dynamic`. The
   reference pattern is `src/components/catalog/CatalogViewerModal.tsx`, which loads
   `PdfCanvas`, `ThumbnailDrawer`, `CatalogSearch`, `CatalogueInfo` and `SharePreview` with
   `dynamic(..., { ssr: false })`. Grep `src/` for new imports of `pdfjs-dist`, `three`,
   `@react-three/fiber` or `@react-three/drei` that are not behind `next/dynamic`.
3. **Three.js rule.** `PRODUCT.md` requires the Three.js bundle to stay out of the initial
   chunk and load on desktop only. Grep `src/` for `three` / `@react-three` imports; any
   found must be dynamically imported and gated to desktop. (At the time of writing no file
   in `src/` imports them, although they are listed in `package.json`.)
4. **Images.** Content images should come through `next/image` from the allowed remote
   hosts. List large static files with `find public -type f -size +500k` and confirm each
   one is either a downloadable asset (catalogue PDFs, `pdf.worker.min.mjs`) or is not on
   the initial render path of `/`.
5. **Measure (manual).** With `npm run build && npm start`, run Lighthouse in Chrome
   DevTools (mobile emulation, throttled) on `/`, `/collections` and `/catalogues`. Record
   LCP, CLS and TBT (as an INP proxy). For field data, use PageSpeed Insights against the
   production URL. <!-- VERIFY: production URL for PageSpeed Insights -->
6. **Reduced motion and mobile.** Confirm with DevTools device emulation that mobile and
   tablet get no WebGL and no custom cursor, as `PRODUCT.md` `## Accessibility & Inclusion`
   requires. `tests/e2e/motion-protocol.spec.ts` and `tests/e2e/mobile-journeys.spec.ts`
   cover parts of this — run `npm run test:e2e`.

## Pass/fail criteria

- **MUST FIX:** any route over a `PRODUCT.md` gate; a `three`/`@react-three` or
  `pdfjs-dist` import in the initial chunk; a large `public/` image on the first render of `/`.
- **SHOULD FIX:** layout shift from images without explicit dimensions or `sizes`; a client
  component that could be a server component.
- **COULD FIX:** font-loading and preload tuning.
- **Pass:** all three gates met on all three routes, steps 2–4 clean.

## Output

`docs/reviews/performance-YYYY-MM-DD.md` (create `docs/reviews/` on first run) with the
build route table, the measured LCP/CLS/TBT per route and device profile, and findings
by severity with file paths.
