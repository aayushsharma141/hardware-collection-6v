---
description: Runs browser agent for UI tests and updates visitor reports.
---
<!-- generated-by: gsd-doc-writer -->

# Browser POV Audit Workflow

**Purpose:** Run the browser test suite, then review each public route the way a first-time showroom visitor would, and record what they'd see.

---

## When to run

- After visual, layout or motion changes in `src/components/` or `src/app/globals.css`.
- Before a release, as part of `audit_workflow`.

## Inputs

- Public routes: `/`, `/collections`, `/catalogues`, `/privacy`, `/terms`, and a missing URL for the 404 page.
- Playwright config `playwright.config.ts`, which defines the `chromium`, `mobile-pixel` and `mobile-iphone` projects, and the specs in `tests/e2e/`.
- The previous report in `docs/reviews/`, if one exists.

## Steps

1. **Automated browser run.** Run `npm run test:e2e`. Playwright starts `npm run dev` on `http://localhost:3000` itself. Record pass/fail per spec and per project. On a failure, open the trace with `npx playwright show-trace`; traces are recorded on first retry.
2. **Visitor walk-through.** With `npm run dev` running, use a browser agent if one is available; otherwise open the site manually. Visit each route at desktop width and at a phone width. For each route, note:
   - **Hierarchy:** is the `<h1>` and primary message obvious within the first screen?
   - **Conversion path:** this is a lead-generation site with no cart or prices. Can the visitor reach the consultation form, phone or WhatsApp in one or two steps? Check `MobileConversionBar` and `FloatingConsultationCapsule` on mobile.
   - **Motion:** do animations feel smooth, and does nothing jump or overlap? Repeat with reduced motion enabled in the OS or browser.
   - **Layout:** no horizontal scroll on mobile, and no clipped text or overlapping fixed elements.
   - **Content:** brand, category and catalogue content renders. If Sanity is unreachable, fallback content should still render.
3. **Key journeys.** On `/collections`, search, filter by brand, and open and close a product drawer. On `/catalogues`, open a catalogue, page through it, zoom, and start a WhatsApp enquiry. Submit the consultation form only against a local or test database, never production.
4. **Screenshots.** Capture the first screen of each route on desktop and on mobile, plus any defect. Save them next to the report.
5. **Compare.** If a previous report exists in `docs/reviews/`, note what changed. Don't edit earlier reports; each run writes a new one.

## Pass/fail criteria

- **Fail:** any e2e spec fails; a route errors or renders blank; horizontal overflow on mobile; the consultation path is unreachable on any device.
- **Findings, not failures:** weak hierarchy, motion jank, or copy and visual polish issues. Rate each as SHOULD FIX or COULD FIX.

## Output

Write `docs/reviews/browser-pov-YYYY-MM-DD.md`, with screenshots in `docs/reviews/browser-pov-YYYY-MM-DD/`. The `docs/reviews/` folder doesn't exist yet; create it on the first run. Include the e2e results table, one section per route with observations, and the findings list.
