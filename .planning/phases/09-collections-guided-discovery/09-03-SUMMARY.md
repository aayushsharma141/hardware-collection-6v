---
phase: 09-collections-guided-discovery
plan: 03
subsystem: docs
tags: [planning-docs, locked-rules, business-truth, whatsapp, brand-roster]

requires:
  - phase: 09-collections-guided-discovery (09-CONTEXT.md)
    provides: D-05, D-16, D-17, D-26, D-09 locked decisions and F-01/F-04/F-06 owner resolutions
provides:
  - STATE.md, ROADMAP.md and NAV_AND_COLLECTIONS_PLAN.md corrected to match already-locked Phase 9 decisions (brand count, public-routes lock, S3B/S3C supersession)
  - A single "Phase 9 Business-Truth Confirmations" record in STATE.md for the WhatsApp number, brand-roster removal, and showroom claims
  - NEVER-BUILD.md entry deferring the Footer-into-RootLayout architecture improvement
affects: [09-04, 09-06, 09-12, 09-13, 09-14]

tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - .planning/STATE.md
    - .planning/ROADMAP.md
    - .planning/NAV_AND_COLLECTIONS_PLAN.md
    - .planning/NEVER-BUILD.md

key-decisions:
  - "WhatsApp number confirmed: 919835190738 is the single WhatsApp/calling number site-wide; 919431111550 is calling-only and must never appear in a wa.me link"
  - "Brand roster confirmed: Jaquar, Asian Paints and Philips removed; canonical roster is architectural hardware only (D-26), Hettich and Kich added"
  - "Showroom claims confirmed: '20+ years' ships, '7,500 sq ft' never ships (already removed from source in commit a0c61f9)"

patterns-established: []

requirements-completed: [D-16, D-17]

duration: 12min
completed: 2026-08-30
---

# Phase 9 Plan 03: Locked-Rule Corrections and Business-Truth Confirmations Summary

**Corrected three stale locked-rule statements (brand count, public-routes lock, NAV plan S3B/S3C supersession) and recorded three pre-answered owner confirmations (WhatsApp number, brand-roster removal, showroom claims) in STATE.md.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-08-30
- **Completed:** 2026-08-30
- **Tasks:** 1 (Task 1, auto) + 3 checkpoint:decision tasks pre-answered per orchestrator instructions
- **Files modified:** 4

## Accomplishments
- STATE.md's Locked Rules no longer state "6 authorized brands" or lock public routes to `/` + `/collections` only
- ROADMAP.md's Locked Architecture public-routes line now includes `/collections/[slug]`
- NAV_AND_COLLECTIONS_PLAN.md's S1 brand-count and public-routes lines corrected; S3B/S3C marked SUPERSEDED; S3D/S3E/S4 marked binding as amended
- New "Phase 9 Business-Truth Confirmations" section in STATE.md records all three owner decisions with dates and cross-references to 09-CONTEXT.md
- NEVER-BUILD.md now records the deferred Footer-into-RootLayout architecture improvement as explicitly out of scope for Phase 9
- STATE.md's "Pending Corrections" section is now empty of all three original items (brand count, public routes, WhatsApp number)

## Task Commits

1. **Task 1: Correct stale locked-rule statements + Tasks 2-4: record pre-answered business-truth confirmations** - `97e3182` (docs)

_Note: All four tasks were combined into a single commit since Tasks 2-4's checkpoint:decision resolutions were pre-answered by the orchestrator per this plan's `<owner_decisions_already_made>` block, requiring no separate stop/resume cycle._

## Files Created/Modified
- `.planning/STATE.md` - Locked Rules corrected (brand count, public routes); new "Phase 9 Business-Truth Confirmations" section added; "Pending Corrections" emptied of all three resolved items
- `.planning/ROADMAP.md` - Locked Architecture public-routes line amended to include `/collections/[slug]`
- `.planning/NAV_AND_COLLECTIONS_PLAN.md` - S1 brand-count and public-routes lines corrected (also fixed a stray "6 authorized brands" reference in the document's top amendments line, not explicitly called out in the plan's action list but caught by this plan's own acceptance criteria); S3B/S3C marked SUPERSEDED; S3D/S3E/S4 marked binding-as-amended
- `.planning/NEVER-BUILD.md` - New "Phase 9 — Collections Guided Discovery (2026-08-30)" section recording the deferred Footer-into-RootLayout lift

## Decisions Made
- **WhatsApp number (F-01):** `919835190738` confirmed as the single WhatsApp number and calling number site-wide, 2026-08-30. `919431111550` is an additional calling-only number that must never appear in a `wa.me` link. All 7 shipped code locations were already correct; `QA_AND_ASSET_PROTOCOL.md` S4.3 (the sole wrong reference) was already corrected by the orchestrator prior to this plan.
- **Brand roster (F-06/D-26):** Jaquar, Asian Paints and Philips confirmed removed from every public brand surface, 2026-08-30. Canonical roster is architectural hardware only; Hettich and Kich are added to `catalog.ts` BRANDS. This resolution unblocks 09-04.
- **Showroom claims (F-04/D-09):** "20+ years" confirmed and may ship. The specific "7,500 sq ft" figure is confirmed as NOT correct and must never be shown on any Phase 9 surface (already removed from source in commit `a0c61f9`, was live via `ShowroomCinematic.tsx`). The "113 sq ft shop in 2002" origin sentence was dropped entirely per the owner.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Corrected a fourth stray "6 authorized brands" reference in NAV_AND_COLLECTIONS_PLAN.md**
- **Found during:** Task 1 verification
- **Issue:** The plan's action list only called out the S1 brand-count line, but the document's top-of-file amendments summary line ("Incorporates architectural amendments: 6 authorized brands, ...") also stated the stale "6 authorized brands" figure, which would have caused this plan's own acceptance criteria (`grep -ic "6 Authorized Brands"` returns 0) to fail.
- **Fix:** Updated the line to "20+ authorized brands (amended by Phase 9 D-05/D-26, 2026-08-30, see 09-CONTEXT.md)".
- **Files modified:** `.planning/NAV_AND_COLLECTIONS_PLAN.md`
- **Verification:** `grep -ic "6 Authorized Brands" .planning/NAV_AND_COLLECTIONS_PLAN.md` returns 0.
- **Committed in:** `97e3182` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix, in-scope of Task 1's file)
**Impact on plan:** Necessary to satisfy this plan's own stated acceptance criteria. No scope creep — same file, same task, same locked decision (D-05/D-26).

## Issues Encountered
None. The three checkpoint:decision tasks (Tasks 2-4) were pre-answered by the orchestrator via the `<owner_decisions_already_made>` block in this spawn's prompt, so no stop/resume cycle was needed — this plan executed straight through to completion in a single pass.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- 09-04 (canonical brand roster reconciliation) and 09-06 (WhatsApp CTA primitives) are unblocked — both Wave 1 plans were gated on this plan's confirmations.
- 09-12 (hero stat row copy) and 09-13/09-14 (brand/showroom surfaces) have an unambiguous, dated record of the showroom-claims and brand-roster resolutions to implement against.
- No blockers. Option-a was selected for all three checkpoint decisions (no D-26 revision needed, no cross-plan sequencing flag to surface).
- `git status --short src/` confirms zero source files were touched by this plan.

---
*Phase: 09-collections-guided-discovery*
*Completed: 2026-08-30*
