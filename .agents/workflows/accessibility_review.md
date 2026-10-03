<!-- generated-by: gsd-doc-writer -->
# Accessibility & WCAG 2.1 AA Review Workflow

**Trigger:** `/workflow accessibility_review`
**Purpose:** Check contrast, keyboard navigation, focus management and screen-reader semantics on the public showroom routes.

---

## When to run

- Before merging any change to `src/components/layout/`, `src/components/consultation/`, `src/components/collections/`, `src/components/catalog/` or `src/app/globals.css`.
- Before a release, alongside `scripts/release-verification.ts`.

## Inputs

- Routes: `/`, `/collections`, `/catalogues`, `/privacy`, `/terms`, plus the 404 page (`src/app/not-found.tsx`). `/studio` is the Sanity editor and is out of scope.
- Colour tokens in `src/app/globals.css` and the contrast test `src/lib/__tests__/contrast.test.ts`.
- Focus-trap hook `src/hooks/useFocusTrap.ts`.
- Playwright specs in `tests/e2e/` (`mobile-journeys.spec.ts`, `motion-protocol.spec.ts`).

The repo has no automated accessibility scanner (no axe or Lighthouse dependency). Everything not covered by the tests below is a manual check.

## Steps

1. **Contrast.** Run `npm test` and confirm `src/lib/__tests__/contrast.test.ts` passes. For any new colour pairing added to `src/app/globals.css`, add it to that test. Required ratios: 4.5:1 for body text, 3:1 for large text and UI boundaries.
2. **Keyboard and focus (automated).** Run `npm run test:e2e`. These specs cover keyboard behaviour:
   - `mobile-journeys.spec.ts`: the mobile menu closes on Escape.
   - `motion-protocol.spec.ts`: the collections product drawer traps focus and restores it on Escape, and reduced motion falls back cleanly.
3. **Keyboard and focus (manual).** On each route, Tab through the whole page with `npm run dev` running:
   - Every interactive element is reachable and shows a visible focus indicator (`focus-visible` styles).
   - Dialogs (`ConsultationDrawer`, `ProductDetailDrawer`, `CatalogViewerModal`) trap focus while open and return it to the trigger on close.
   - Check for a skip-to-content link. None exists in `src/app/layout.tsx` today. Record its absence as a finding until one is added.
4. **Semantic HTML.** Grep for clickable non-buttons: `onClick` on `<div>` or `<span>` with no `role` and key handler. Confirm each route renders one `<main>` and one `<h1>`, and that `src/app/layout.tsx` keeps `lang="en"`.
5. **ARIA on custom widgets.** Check that `aria-expanded` and `aria-controls` are correct on toggles: `Navbar.tsx`, `MobileMenu.tsx`, `FaqSection.tsx`, and the catalogue viewer controls in `src/components/catalog/viewer/`. Icon-only `lucide-react` buttons need an `aria-label`.
6. **Images.** Every non-decorative `next/image` or `<img>` has a meaningful `alt`. Decorative images use `alt=""`.
7. **Forms.** In `src/components/consultation/ConsultationForm.tsx`, check that every input has a label and that validation errors are announced. Errors come from the Zod schema in `src/lib/leads/schema.ts`.

## Pass/fail criteria

- **MUST FIX (fail):** a contrast pair below threshold; an interactive element that keyboard users can't reach; no visible focus; a dialog that doesn't trap or restore focus; a clickable `<div>` with no keyboard handler; an unlabelled form input.
- **SHOULD FIX:** missing or unhelpful `alt` text; a missing skip link; an icon button with no `aria-label`.
- **COULD FIX:** landmark labels on secondary sections.
- **IGNORED:** decorative background layers (for example `AtmosphericBackground.tsx`, `ParticleWave.tsx`) when marked `aria-hidden`.

The review passes when no MUST FIX items remain.

## Output

Write `docs/reviews/accessibility-review-YYYY-MM-DD.md`. The `docs/reviews/` folder doesn't exist yet; create it on the first run. List each finding with its route, file, severity and the step that found it.
