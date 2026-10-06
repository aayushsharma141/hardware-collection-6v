---
phase: 14
slug: ui-ux-refinement-anti-ui-slop
status: verified
nyquist_compliant: true
wave_0_complete: true
created: 2026-10-07
---

# Phase 14 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest + eslint + next build |
| **Config file** | `vitest.config.mjs`, `eslint.config.mjs`, `next.config.ts` |
| **Quick run command** | `npm run lint` |
| **Full suite command** | `npm run lint && npm run build` |
| **Estimated runtime** | ~12 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run lint`
- **After every plan wave:** Run `npm run lint && npm run build`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 14-01-01 | 01 | 1 | D-01, D-02, D-03 | — | Mobile-only action buttons fixed bottom-6 right-6 | unit/lint | `npm run lint` | ✅ | ✅ green |
| 14-01-02 | 01 | 1 | D-04 | — | Mobile full-screen luxury overlay, borderless hamburger | unit/lint | `npm run lint` | ✅ | ✅ green |
| 14-02-01 | 02 | 2 | D-05, D-08 | T-14-01 | Sanitized WhatsApp redirect + dual submission | unit/lint | `npm run lint` | ✅ | ✅ green |
| 14-02-02 | 02 | 2 | D-06, D-07 | — | Corrected showroom stats (10+ yrs, 20+ brands) & live map | unit/lint | `npm run lint` | ✅ | ✅ green |
| 14-03-01 | 03 | 3 | D-09, D-10 | — | Stable autoplay + linear indicator progress | unit/lint | `npm run lint` | ✅ | ✅ green |
| 14-03-02 | 03 | 3 | D-11, D-12 | T-14-02 | Offer distinction badge + dual CTAs | unit/lint | `npm run lint` | ✅ | ✅ green |
| 14-04-01 | 04 | 4 | D-13, D-14 | — | Anti-ui-slop styling across Footer, Dialogs, Cards | integration | `npm run lint && npm run build` | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing test infrastructure (`eslint`, `vitest`, Next.js type check & build) covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Responsive mobile floating buttons tap | D-01, D-03 | Visual viewport test | Emulate 375px mobile screen, verify buttons are at bottom-6 right-6 and tap opens dialer/WhatsApp |
| Fullscreen mobile menu overlay | D-04 | Visual layout & UX | Click hamburger on mobile viewport, verify clean fullscreen layout with no card bubbles |
| Carousel autoplay & hover pause | D-09, D-10 | Interaction timing | Observe 6-7s transition; hover mouse and verify slides stay paused until mouse leaves |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-10-07
