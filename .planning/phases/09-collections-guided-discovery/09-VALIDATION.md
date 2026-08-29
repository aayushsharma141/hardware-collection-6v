---
phase: 9
slug: collections-guided-discovery
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-08-29
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Derived from `09-RESEARCH.md` § Validation Architecture.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.11 |
| **Config file** | `vitest.config.mjs` — `include: ["src/**/__tests__/**/*.test.ts"]`, `environment: "node"`, `@/*` → `./src/*` |
| **Quick run command** | `npx vitest run <specific changed test file>` |
| **Full suite command** | `npm test` (= `vitest run`) |
| **Estimated runtime** | ~5-15 seconds (5 existing test files, node environment, no browser) |

**Known constraint:** the config only picks up `.ts` files, **not `.tsx`** — component-level tests are
not exercised by this suite. All new logic in this phase (link-target resolution, search-keyword
matching, brand-roster reconciliation, image fallback chain, featured-chapter cap) is deliberately
unit-testable in `.ts` and fits the existing pattern. Do **not** add `.tsx` test files expecting them
to run without also changing `vitest.config.mjs`.

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run <specific new/changed test file>`
- **After every plan wave:** Run `npm test`
- **Before `/gsd:verify-work`:** Full suite green **plus** `npm run build`, `npx tsc --noEmit`,
  `npm run lint` (the documented command set in `CLAUDE.md`)
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

This project has no `REQUIREMENTS.md` — requirements are carried by CONTEXT.md decisions
`D-01…D-27`. Task IDs are assigned during planning; the planner MUST fill the `Task ID` column and
keep the decision mapping below intact.

| Task ID | Plan | Wave | Decision | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|----------|------------|-----------------|-----------|-------------------|-------------|--------|
| _pending_ | _tbd_ | _tbd_ | D-14 | T-9-01 | Search text never reaches a GROQ string; client-side `Array.filter` only | unit | `npx vitest run src/lib/__tests__/catalogFiltering.test.ts` | ✅ extend | ⬜ pending |
| _pending_ | _tbd_ | _tbd_ | D-12 | — | N/A | unit | `npx vitest run src/hooks/__tests__/useCollectionsState.test.ts` | ✅ extend | ⬜ pending |
| _pending_ | _tbd_ | _tbd_ | D-03 | — | N/A | unit | `npx vitest run src/components/collections/__tests__/FeaturedChapters.test.ts` | ❌ W0 | ⬜ pending |
| _pending_ | _tbd_ | _tbd_ | D-04 | — | N/A | unit | same file as D-03, or a shared collection-index test | ❌ W0 | ⬜ pending |
| _pending_ | _tbd_ | _tbd_ | D-05 / D-07 / D-26 | — | N/A | unit | `npx vitest run src/data/__tests__/brands.test.ts` | ❌ W0 | ⬜ pending |
| _pending_ | _tbd_ | _tbd_ | D-25 / F-05 | — | N/A | unit | `npx vitest run src/data/__tests__/homeLinks.test.ts` | ❌ W0 | ⬜ pending |
| _pending_ | _tbd_ | _tbd_ | D-27 | — | Slug collision silently shadows a document | unit | `npx vitest run src/sanity/__tests__/slugUniqueness.test.ts` | ❌ W0 | ⬜ pending |
| _pending_ | _tbd_ | _tbd_ | D-15 / D-24 | T-9-02 | GROQ `$slug` parameterized, never interpolated | unit | route-resolution test (space-then-category precedence) | ❌ W0 | ⬜ pending |
| _pending_ | _tbd_ | _tbd_ | UI-SPEC color table | — | N/A | unit | `npx vitest run src/lib/__tests__/contrast.test.ts` | ❌ W0 | ⬜ pending |
| _pending_ | _tbd_ | _tbd_ | D-22 | — | N/A | **manual** | see Manual-Only Verifications | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/data/__tests__/brands.test.ts` — canonical roster consistency across `catalog.ts`,
      `BrandTrustStrip.tsx`, `CatalogLibrary.tsx` and `useCollectionsState.ts`. **Highest-value new
      test in this phase** — three rosters currently disagree (F-06), and this is the regression
      guard that stops them diverging again.
- [ ] `src/data/__tests__/homeLinks.test.ts` — every hardcoded homepage href resolves to a real
      category or space slug. Guards the ~60-link repoint in D-25 against dangling targets.
- [ ] `src/sanity/__tests__/slugUniqueness.test.ts` — asserts no slug is claimed by both a `space`
      and a `category` document (D-27). A collision silently shadows one document.
- [ ] `src/components/collections/__tests__/FeaturedChapters.test.ts` — the 3-5 featured-chapter cap
      holds regardless of how many categories carry `featured: true` (D-03).
- [ ] `src/lib/__tests__/contrast.test.ts` — every text/background pair in the UI-SPEC color table
      meets WCAG AA 4.5:1, and the prohibited bone-on-brass pair is asserted as prohibited.
- [ ] Extend `src/lib/__tests__/catalogFiltering.test.ts` — `searchKeywords[]` matching (D-14).
- [ ] Extend `src/hooks/__tests__/useCollectionsState.test.ts` — image fallback chain
      `product.images[0] → category.image → siteSettings default` (D-12), and **remove or update any
      existing assertions against the hardcoded `/public/cinema` PNG map**, which this phase deletes.

No framework install is required — Vitest 4.1.11 is already configured.

---

## Manual-Only Verifications

| Behavior | Decision | Why Manual | Test Instructions |
|----------|----------|------------|-------------------|
| `prefers-reduced-motion` disables smooth scrolling on the space rail without disabling scroll-snap positioning | D-22 | CSS media-query behavior; not observable in Vitest's node environment | Chrome DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce", then scroll the space rail on a mobile viewport. Snap points must still engage; smooth easing must not. |
| Lenis global smooth-scroll does not hijack the horizontal space rail | D-22 | Requires a real browser with the Lenis provider mounted | Confirm `data-lenis-prevent` is present on the rail container, then verify horizontal drag/swipe works without the page scrolling vertically. |
| CLS ≤ 0.10 across the redesigned landing and category pages | QA Stage B | Requires real layout measurement | Lighthouse / PageSpeed run on the deployed preview. Every image surface must have its pinned aspect ratio from the UI-SPEC. |
| Brand logos render legibly on near-black ground | D-08 | Subjective visual judgement per logo | Visual review of the alphabetical logo wall once real brand assets are in Sanity. |
| Gold-on-black focus states are visible for keyboard users | UI-SPEC §10 | Requires real keyboard interaction | Tab through the landing page; every interactive element must show a visible focus ring. |

---

## Validation Sign-Off

- [ ] All tasks have an `<automated>` verify command or a declared Wave 0 dependency
- [ ] Sampling continuity: no 3 consecutive tasks without an automated verify
- [ ] Wave 0 covers all ❌ MISSING references above
- [ ] No watch-mode flags (`--watch`) in any committed command
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
