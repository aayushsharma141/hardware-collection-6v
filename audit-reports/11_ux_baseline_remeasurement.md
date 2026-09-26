# UI/UX Baseline Re-Measurement & Stale Audit Reconciliation

**Target:** `Hardware Collection` (`aayushsharma141/hardware-collection-6v`)  
**Commit Baseline:** `a866c42` (post-unblock, clean checkout verified)  
**Evaluation Standard:** Apple Human Interface Guidelines (HIG), Amazon High-Performance CX, and WCAG 2.2 AA  
**Auditor Persona:** Principal Software Architect, Senior Application Security Auditor & Lead Performance Engineer  
**Audit Mode:** Read-Only Static Architecture & Codebase Inspection  

---

## 1. Executive Verdict & Tiering Justification

### Final Verdict Tier:
- [ ] Beginner / Freelancer-level
- [ ] Intermediate agency-level
- [x] **Professional production-level**
- [ ] Elite / FAANG-level

### Justification:
The workspace has evolved significantly since the September 5, 2026 audits (`03`, `05`, `07`, `08`, `09`). The visual architecture has definitively transitioned from the legacy dark obsidian motif (`#0E0C0C`) to an editorial luxury warm ivory (`#fbf5ea` / `#f7f0e2`) and wine crimson (`#8b1a42`) identity. Major structural flaws—such as mobile zebra-striping, broken modal keyboard traps, unescaped entity strings, and missing legal routes—have been resolved. 

However, the application remains at **Professional production-level** rather than **Elite / FAANG-level** due to four measurable discrepancies:
1. **Contrast Drift:** Direct use of `#c8a96e` (2.1:1 contrast against `#fbf5ea`) across eyebrow headers and sub-labels instead of the designated WCAG-compliant `--color-brass-ink` (`#85683a`, 4.9:1).
2. **Vestigial Dark Obsidian Island:** `FloatingConsultationCapsule.tsx` renders a hardcoded dark pill (`bg-[#0E0C0C]/90`, `border-white/[0.14]`) over ivory surfaces on `/collections` and `/catalogs`.
3. **Brand Constitution Violation:** `ConsultationForm.tsx` uses gold button fills (`bg-gradient-to-r from-[#C8A96E] to-[#e5c487]`), directly violating Law 10 / Brand Guidelines restricting gold to rules/hairlines.
4. **Missing Site Chrome on Legal Pages:** `/privacy` and `/terms` lack the global `<Footer />` component, creating a dead-end navigation experience.

---

## 2. Quantitative Metric Re-Measurement vs. Stale Baselines

| Dimension | Stale Baseline (2026-09-05) | Current Measured Baseline (`a866c42`) | Variance & Significance |
|---|---|---|---|
| **SSG Collection Routes** | 39 routes (`09_wcag_ux_code_audit.md`) | **54 dynamic SSG collection routes** (47 categories + 7 spaces) | **+15 routes** (+38.5%). Result of `074657e` showroom taxonomy expansion. |
| **Total Route Surface** | ~43 routes | **59 public routes** (`/`, `/collections`, `/catalogs`, `/privacy`, `/terms`, + 54 collections) | Expanded public crawl surface. |
| **Primary Color System** | Deep Obsidian (`#0E0C0C`, `08_benchmark_comparison.md`) | **Warm Ivory (`#fbf5ea`) + Wine Crimson (`#8b1a42`)** | Complete visual inversion. Old audit documentation is completely obsolete regarding color contrast and palette. |
| **E2E Test Suites** | 30 tests across 3 engines (`09_wcag_ux_code_audit.md`) | **10 test definitions across 3 devices (Chromium, Pixel 7, iPhone 14) = 30 runs** | Test count verified intact across `mobile-journeys.spec.ts` and `motion-protocol.spec.ts`. |
| **Public Asset Weight** | 91.0 MB | **68.2 MB** (referenced assets compressed 96% to 1.2 MB; 52 MB orphaned) | Critical reduction in active bandwidth; 47 unreferenced files pending user deletion approval. |
| **TypeScript / Strictness** | Strict clean (19,644 LOC) | **Zero `any`, zero `@ts-ignore`, zero `console.log`** across 135 files | Preserved at the highest standard. |

---

## 3. Forensic Status of Historical Bugs (BUG-01 to BUG-20)

| Bug ID | Description in 2026-09-05 Audits | Current Status on `main` | File & Line Verification |
|---|---|---|---|
| **BUG-01** | Raw `&mdash;` and `&middot;` in `MaterialJourney.tsx` | **RESOLVED** | Clean UTF-8 em-dashes `—` and middle dots `·` verified in `MaterialJourney.tsx`. |
| **BUG-02** | Raw `&middot;` in `ProductReel.tsx` | **RESOLVED** | UTF-8 middle dot verified in `ProductReel.tsx:205`. |
| **BUG-03** | Raw entities in `CollectionsHero.tsx` & `ConsultationForm.tsx` | **RESOLVED** | Clean string literals across both components. |
| **BUG-04** | Severe mobile zebra-striping (black/white 5x cuts) | **RESOLVED** | `MobileHero`, `MobileCategoryDiscovery`, `MobileProductReel`, `MobileReviews`, and `MobileConsultation` standardized on `#fbf5ea` / `--surface-raised`. |
| **BUG-05** | 1024px navbar phone number wrap (3 lines) | **RESOLVED** | Clean `h-11 min-h-[44px] whitespace-nowrap` layout in `Navbar.tsx:355`. |
| **BUG-06** | 1024px hero card overflow (1148px requirement) | **RESOLVED** | Dynamic viewport scaling and responsive grid in `HeroStage.tsx`. |
| **BUG-07** | Dorset seeklogo `#ffffff` fill invisible on ivory | **RESOLVED** | Vector logo converted and contrast-tested. |
| **BUG-08** | Hettich and Kich white fills invisible on ivory | **RESOLVED** | Logo fills inverted/styled for light surfaces. |
| **BUG-09** | Fixed navbar occluding "Back to All Collections" link | **RESOLVED** | `pt-28 md:pt-36` applied across collection headers (`CategoryDetailClient.tsx`, `SpaceLandingClient.tsx`). |
| **BUG-10** | Specialist pill overlapping Chapter 02 heading | **RESOLVED** | Dynamic scroll calculation in `FloatingConsultationCapsule.tsx` hides capsule near section bounds. |
| **BUG-11** | Duplicate headings on `/collections` | **RESOLVED** | Distinct semantic headers: `SpaceIntentRail` vs `FeaturedChapters`. |
| **BUG-12** | Broken `/privacy` and `/terms` 404 routes | **RESOLVED** | Full pages deployed with verified Sakchi showroom operational details. |
| **BUG-13** | Ghost button borders `border-white/[0.15]` invisible | **RESOLVED** | Replaced with dark borders `border-[#1a1017]/[0.10]` on ivory. |
| **BUG-14** | Mobile category discovery skipping `02` | **RESOLVED** | Lead focal card renders focal family; index renders remaining 4 cleanly. |
| **BUG-15** | "AUTHORIZED PARTNER" badge collision with country text | **RESOLVED** | Flexible grid layout in `CatalogLibrary.tsx`. |
| **BUG-16** | `<AboutStory>` duplicated in mobile and desktop tree | **RESOLVED** | Single semantic `<AboutStory id="about" />` in `src/app/page.tsx:156`. |
| **BUG-17** | Social icons and footer links failing 44x44px touch target | **RESOLVED** | `min-w-[44px] min-h-[44px]` applied to all footer interactive controls. |
| **BUG-18** | Focus ring glitch on opening mobile nav drawer | **RESOLVED** | Drawer focus trap manages active focus without jarring focus ring outline. |
| **BUG-19** | Cormorant Garamond numeral `1` kerning resembling `I` | **PARTIAL** | Standard font remains; tabular figures applied selectively (`tabular-nums` in `FloatingCTA.tsx:167`). |
| **BUG-20** | Showroom headline superimposed over physical sign | **RESOLVED** | Pinned scroll sequence repositioned in `ShowroomCinematic.tsx`. |

---

## 4. Current Discrepancies & UX Deficiencies in `main`

### D-01: WCAG 2.2 AA Contrast Failure on Ivory Text Eyebrows
- **Component:** `src/components/home/CategoryDiscovery.tsx:39`, `src/components/home/ProductReel.tsx:211, 283`, `src/components/home/MaterialJourney.tsx:243, 274, 411`, `src/app/collections/CollectionsClient.tsx:134, 148`.
- **Finding:** Hardcoded `text-[#c8a96e]` or `text-[#C8A96E]` rendered directly on ivory `#fbf5ea` or pearl `#f7f0e2`.
- **Measurement:** Contrast ratio is **2.1:1**, severely failing WCAG AA (minimum 4.5:1 for normal text).
- **Remediation:** Replace with semantic token `text-brass-ink` (`#85683a`), which is mathematically tuned to **4.9:1** contrast on `#fbf5ea`.

### D-02: Vestigial Dark Theme Floating Capsule
- **Component:** `src/components/consultation/FloatingConsultationCapsule.tsx:74-81`.
- **Finding:** Renders `bg-[#0E0C0C]/90 hover:bg-[#161414] border border-white/[0.14] text-white` with `text-[#C8A96E]`.
- **Impact:** While scrolling the warm ivory `/collections` and `/catalogs` hubs, visitors are presented with a jarring obsidian pill that visually conflicts with the light architectural aesthetic.
- **Remediation:** Restyle to match the luxury light surface language (`bg-[#f7f0e2]/95 border border-[#1a1017]/[0.12] text-[#1a1017]` with wine crimson `#8b1a42` accents).

### D-03: Gold Gradient Button Fills Violating Design Constitution
- **Component:** `src/components/consultation/ConsultationForm.tsx:109` & `src/components/consultation/ConsultationSuccess.tsx:57`.
- **Finding:** Form submission CTA uses `bg-gradient-to-r from-[#C8A96E] to-[#e5c487] text-[#0E0C0C]`.
- **Constraint:** Workspace Constitution & Brand Guidelines dictate: *"Gold is strictly restricted to accents, hairlines, and badges—never button fill backgrounds. Primary action fills belong to Wine Crimson (`#8b1a42`)."*
- **Remediation:** Align CTA buttons with `.brass-plate` utility (`bg-[#8b1a42] text-white hover:bg-[#6b1432]`).

### D-04: Missing Global Chrome on Legal Pages
- **Component:** `src/app/privacy/page.tsx` & `src/app/terms/page.tsx`.
- **Finding:** Neither route mounts `<Footer />`. After reading legal disclosures, users have no footer navigation or showroom operational details other than a small static contact box.
- **Remediation:** Mount `<Footer />` at the bottom of both route templates.

### D-05: 19 Unmigrated Raw `<img>` Elements in Animation Components
- **Components:** `InteractiveHero.tsx`, `SpecimenStage.tsx`, `MaterialZoom.tsx`, `ShowroomCinematic.tsx`.
- **Finding:** Raw `<img>` elements bypass Next.js automatic image optimization and generate 30 ESLint warnings (`@next/next/no-img-element`).
- **Context:** Held intentionally during asset optimization to avoid breaking GSAP pin/scrub wrappers without visual browser regression testing.

---

## 5. Elite Benchmarking Matrix (Apple HIG vs Amazon Standards)

| Pillar | Apple HIG Benchmark | Amazon CX Benchmark | Hardware Collection Current State | Grade |
|---|---|---|---|:---:|
| **Tactile Restraint** | Subdued, intentional animations with `prefers-reduced-motion` | Immediate, zero-distraction layout | 28 components respect `prefers-reduced-motion`. MotionProvider coordinates global state. | **Elite** |
| **Touch Targets** | $\ge 44\times 44\text{px}$ on all interactive controls | 1-click low-friction action targets | All navigation pills, drawers, and conversion bars satisfy $\ge 44\times 44\text{px}$. | **Elite** |
| **Conversion Velocity** | Clear, single-purpose calls-to-action | Zero checkout friction, instant handoff | 1-tap WhatsApp deep links with pre-filled SKU/category context. | **Elite** |
| **Visual Legibility** | High-contrast typography on curated backgrounds | Clean tabular data and scanability | 4.9:1 on primary ink, but 2.1:1 text-[#c8a96e] requires brass-ink token fix. | **Production** |
| **Resilience & Fallbacks**| Graceful degradation under zero-network conditions | Static catalog caching and fast pre-rendering | Complete local fallback layer for 54 collections and site settings. | **Elite** |

---

## 6. Prioritized Work Order

```
[Phase 1: Token & Contrast Fixes] (Read-only verified, zero structural risk)
  1. Replace text-[#c8a96e] with text-brass-ink across CategoryDiscovery, ProductReel, MaterialJourney, CollectionsClient.
  2. Invert FloatingConsultationCapsule styling from obsidian (#0E0C0C) to luxury ivory (#f7f0e2).
  3. Align ConsultationForm submit button to Wine Crimson (#8b1a42) per Brand Spec.

[Phase 2: Layout & Chrome Consistency]
  4. Mount <Footer /> in /privacy and /terms.
  5. Delete 52MB of approved orphaned assets in public/ (pending user confirmation).

[Phase 3: Visual Polish & Image Engine]
  6. Safely migrate 19 raw <img> tags to next/image inside GSAP wrappers using Playwright screenshot verification.
```
