---
phase: 09-collections-guided-discovery
plan: 19
status: complete_with_failures
wave: 7
executed: 2026-08-30
executed_by: orchestrator (inline — gsd-executor has no browser tools and cannot perform Tasks 2-3)
verified_against: 4ffebf0
---

# 09-19 — Stage B Performance & Accessibility Gate

Run inline rather than via `gsd-executor`: Tasks 2 and 3 require a browser, and the executor agent's
toolset (Read/Write/Edit/Bash/Grep/Glob) has none. An executor would have run Task 1 and halted at
both checkpoints.

## Task 1 — Automated phase gate

| Command | Result |
|---|---|
| `npm test` | ✅ 11/11 suites, 62/62 tests |
| `npm run build` | ✅ 36 static pages, 24 SSG collection routes |
| `npx tsc --noEmit` | ✅ exit 0 |
| `npm run lint` | ✅ **exit 0** as of `131bec6` — was exit 1 with 5 errors; 24 warnings remain |
| `node scripts/audit-dependencies.cjs` | ⚠️ exit 0, but see finding G-02 |
| `npx tsx scripts/release-verification.ts` | ❌ **GATE-02 FAILED, pipeline aborted** — see G-03 |

## Task 2 — Stage B performance

| Gate | Threshold | Measured | Verdict |
|---|---|---|---|
| CLS | ≤ 0.10 | **0** on `/collections` | ✅ pass |
| Horizontal overflow @375px | none | none (scrollWidth 375 = clientWidth) | ✅ pass |
| Image surfaces pinned | all | 27 of 28 (the 1 unpinned is decorative, empty alt) | ✅ pass |
| LCP | ≤ 2.5s | **not measured** | ⚠️ deferred |
| INP | ≤ 200ms | **not measured** | ⚠️ deferred |

LCP and INP were not measured because only the dev server was available (port 3000 occupied);
dev-mode figures are not representative of production and reporting them would be misleading. These
require `npm run build && npm start` plus a Lighthouse run.

The CLS result is the headline: this phase added space tiles, chapters, Tier-2 cards, a brand logo
wall, category heroes and a gallery strip, and the aspect-ratio discipline held at zero shift.

## Task 3 — Accessibility contract

| Check | Result |
|---|---|
| `data-lenis-prevent` on the space rail | ✅ present — first real consumer in the codebase |
| `scroll-snap-type` | ✅ `x mandatory` |
| `overscroll-behavior` | ❌ **`auto`** — 09-10 required `contain` |
| Touch targets ≥ 44px | ❌ **22 interactive elements below 44px** (28px and 36px heights) |
| Exactly one filled button visible | ✅ confirmed visually |
| Filled CTA avoids bone-on-brass (1.76:1) | ✅ dark text on brass, confirmed visually |
| No console errors | ✅ only HMR logs and one CSS preload warning |

## Findings

### G-01 — RESOLVED 2026-08-30 in commit `131bec6`
`npm run lint` now exits 0. The four raw anchors became `next/link` `Link` components and
`displayBrands` is typed `Brand[]`. Verified by a live click-through: the JS context survives
navigation to `/collections`, confirming client-side routing rather than a full document reload.
The 24 warnings are unchanged and were never gate-blocking. Original finding retained below.

### G-01 (original) — `npm run lint` fails (5 errors) — BLOCKING for the documented phase gate
Four are `@next/next/no-html-link-for-pages`: raw `<a href="/collections">` instead of `next/link`
in `src/components/home/MaterialJourney.tsx`, `ProductReel.tsx`, and `SignatureCollection.tsx` (×2).
Raw anchors to internal routes force a full document reload instead of client-side navigation —
a direct INP and perceived-performance regression. The fifth is a `no-explicit-any`.
Also 24 warnings, including an unused `brands` binding in `useCollectionsState.ts:30` left behind by
09-18's subtractive pass.

### G-02 — `audit-dependencies.cjs` is not a CVE scanner
`CLAUDE.md` describes it as "dependency CVE audit" and this plan expected "zero critical CVE alerts".
The script actually reports *"Legacy `button.tsx` Dependencies"* and *"Legacy Tokens Dependencies"*
under a "Phase 29D.1" heading — a legacy-migration audit for a different codebase. It exits 0 while
checking nothing about vulnerabilities. The CVE threshold in CLAUDE.md is therefore unenforced.

### G-03 — `release-verification.ts` is non-functional boilerplate — MOST SERIOUS
`CLAUDE.md` names this as the release authority: *"Release claims are validated against
scripts/evidence-engine.ts and scripts/release-verification.ts."* It validates nothing here:

- `cwd: "apps/web"` — this project is not a monorepo; that path does not exist
- `GATE-02` runs `src/test/telemetry/collector-resilience.test.ts` — absent
- `GATE-03` runs `src/test/chaos` — absent
- `GATE-04` runs `npm run test:load:tier-a` — not defined in `package.json`
- `GATE-05` is a hardcoded `console.log(...'Result: PASSED')` that can never fail

It nonetheless writes a signed Ed25519 evidence bundle to `docs/evidence/`, so a failing,
inapplicable pipeline is producing cryptographically-signed release evidence. Same category as
`CONSTITUTION.md`, already flagged in 09-CONTEXT.md as boilerplate for a different product.

### G-04 — `overscroll-behavior` is `auto`, not `contain`
09-10 required `overscroll-behavior: contain` on the space rail (RESEARCH Pitfall 4) so a horizontal
overscroll at the rail's end cannot chain into a vertical page scroll. It is `auto`.

### G-05 — 22 interactive elements below the 44px touch-target floor
Navbar items at 36px, category deep links at 28px. UI-SPEC §10 sets 44px as a floor and lists it as
a named spacing exception.

### G-06 — Hero stat row reads "2 COLLECTIONS" against 24 rendered routes
Carried from the 00-03 UAT (test 18). Visually confirmed in this pass. Violates D-09. The brand
count (22) is correct, so the defect is isolated to the collections count.

## Task 4 — Dispositions

**Not decided.** All six findings are recorded and awaiting owner disposition: fix now, defer with an
owner, or accept with a stated reason. Per the plan, this gate must not be closed with an unexplained
failing threshold.

## Verdict

**Phase 9 is still NOT closeable on this gate.** One of the six documented phase-gate commands fails
(`release-verification`), another provides no real assurance (`audit-dependencies`), and two
Stage B thresholds (LCP, INP) remain unmeasured. The measured thresholds that were checkable — CLS,
horizontal overflow, aspect-ratio coverage — all pass cleanly.
