# UI Review — Hardware Collection Bright Palette Overhaul

**Audited:** 2026-08-31
**Baseline:** Abstract 6-pillar standards + Brand Spec (Wine Crimson #8B1A42 primary, Gold #C8A96E accent-only, all sections bright)
**Screenshots:** Not captured (Playwright CLI unavailable in this environment); code-only audit. Dev server confirmed live at localhost:3000.

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 3/4 | Navbar "Inquire" too generic; "What Our Clients Say" is template copy; reviews empty state silently disappears |
| 2. Visuals | 2/4 | CategoryDiscovery hover makes link text invisible on bright surface; ShowroomCinematic still renders dark despite theme-ivory wrapper |
| 3. Color | 2/4 | 46 instances of dark-mode text colors on bright surfaces; gold used as button background in 6 locations, violating brand spec |
| 4. Typography | 2/4 | Defined 8-class type scale bypassed entirely; 32+ distinct font sizes in use across home components |
| 5. Spacing | 3/4 | Arbitrary values px-[68px] and mx-[80px] break the spacing scale; otherwise px-6/lg:px-16 gutter pattern is consistent |
| 6. Experience Design | 2/4 | Zero loading/error/empty-state UI visible; WCAG contrast failures on zinc-300 and #d1ccc4 text on white surfaces |

**Overall: 14/24**

---

## Top 3 Priority Fixes

1. **Dark-mode text colors on bright surfaces** — Users with normal vision cannot read `text-zinc-300` (#d4d4d8 on white = 1.85:1), `text-[#d1ccc4]` (~2.6:1), or `text-[#aaa49a]` (~2.8:1). All fail WCAG AA at normal text sizes. Found in: FloatingCTA body copy (line 127), ShowroomCinematic scene subtitle (line 259), AboutStory desktop body (line 201), CategoryDiscovery subtitles (lines 20, 73, 107), MobileHero description (line 61). Fix: replace with `text-[var(--text-secondary)]` (#3D2E38) or `text-[var(--muted)]` (#7A6872), both of which resolve correctly through theme-light.

2. **Gold (#C8A96E) used as button background in 6 locations** — Brand spec explicitly states gold is "used only as accent, not backgrounds." Active violations: MobileHero primary CTA `bg-[#c8a96e]`, ProductDetailDrawer WhatsApp button `bg-[#C8A96E]`, ShortlistPill selected state `bg-[#C8A96E]`, CollectionSearch filter hover `hover:bg-[#c8a96e]`, AboutStory "TALK TO AN EXPERT" hover `hover:bg-[#C8A96E]`. Fix: replace with Wine Crimson `bg-[#8b1a42]` for filled CTAs. Gold should only appear as text/icon color or as a hairline/dot accent.

3. **ShowroomCinematic (CH06) renders as a dark section** — Despite `<div className="theme-ivory">` in page.tsx, internal dark overlay gradients in CinematicScene dominate: `radial-gradient(circle at center, transparent 0%, rgba(10,10,12,0.9) 100%)` (line 225) and `linear-gradient(to bottom, rgba(10,10,12,0.1) 0%, rgba(10,10,12,0.85) 100%)` (line 244) override the bright theme. The section renders as a near-black cinematic block, directly breaking the all-bright palette mandate. Fix: reduce overlays to photography-only use (max 60% opacity), remove the full-bleed dark radial gradient, and replace `text-[#d1ccc4]` scene subtitles with `text-[var(--text-secondary)]`.

---

## Detailed Findings

### Pillar 1: Copywriting (3/4)

**Strengths:** The high-tension sections carry strong editorial copy. "The Art of the Finish." is distinctive and brand-appropriate. "Touch Before You Decide." (ShowroomCinematic) is tactile and memorable. "TALK TO AN EXPERT" (AboutStory) is direct. "Private consultation · Sakchi, Jamshedpur" gives location context at the conversion point.

**Issues:**

WARNING — `Navbar.tsx:319`: CTA button reads "Inquire" with an ArrowUpRight icon. For a premium architectural hardware consultancy, this label provides zero specificity. Compare: "Book Consultation," "Get Specification Help," or "Speak to an Expert." "Inquire" sounds like a contact form on a commodity retailer.

WARNING — `FloatingCTA.tsx:48`: Section header reads "What Our Clients Say" — standard-issue copy that any business could use. For a brand whose tagline is "The Jewelry of Fittings," this reads as a template placeholder. Consider: "From the Architects We've Worked With" or "Specified By."

WARNING — `FloatingCTA.tsx:27–106`: When the `reviews` prop is an empty array, the entire reviews zone is conditionally hidden without a fallback. No empty state message, no "Reviews coming soon," nothing. The section gap just collapses visually. Users who arrive before testimonials are seeded will see an unexplained blank before the conversion form.

WARNING — `BrandTrustStrip.tsx:78`: "Authorized Brands" as the section headline is factual but inert. The strip is positioned as a credibility moment ("CH02 — LOW tension") and deserves a more editorial label like "Trusted by architects across Jharkhand" or "Specified by India's top brands."

PASS — All CTA labels in hero slides are fed from Sanity CMS with sensible fallbacks. Hero eyebrows include location ("HARDWARE COLLECTION · SAKCHI, JAMSHEDPUR"). Bottom bar "Scroll to showroom families ↓" is directional and specific.

---

### Pillar 2: Visuals (2/4)

**BLOCKER — `CategoryDiscovery.tsx:83`:** Category card action links use `text-[#d1ccc4] hover:text-white`. On a bright surface (`bg-[var(--surface)]` = white, `bg-[var(--surface-raised)]` = pearl #F8F6F6), the hover state makes the link text fully white — it becomes invisible. Every "View Entrance Hardware," "View Kitchen Systems," etc. link disappears on hover. This is the primary navigation gesture for the section.

BLOCKER — `ShowroomCinematic.tsx:208–244` (CinematicScene): Two stacked dark overlay layers — a radial multiply gradient to rgba(10,10,12,0.9) and a linear-gradient to rgba(10,10,12,0.85) — make the cinematic scenes render as near-black despite the `.theme-ivory` wrapper in page.tsx. The background `bg-[var(--surface-raised)]` (pearl) is completely hidden under these overlays. The section contradicts the brand's stated bright palette overhaul and visually breaks the page's tonal consistency.

WARNING — `CategoryDiscovery.tsx:11,98,112`: Desktop and mobile dividers use `border-white/[0.16]` and `border-white/[0.14]`. On a white/pearl surface these are essentially invisible (14–16% white opacity on white). The grid gap background `bg-white/[0.13]` has zero visual effect on white. These structural dividers that define the category grid layout are not rendering.

WARNING — `MobileHero.tsx:46`: Full-bleed dark scrim: `bg-gradient-to-t from-[#090909] via-[#090909]/85 via-45% to-[#090909]/15`. The mobile first-viewport is a dark cinematic experience — #090909 at 85% opacity is near-black. This is the opposite of the "all sections bright" constraint. Note: a scrim is necessary for photographic text legibility, but the desktop hero achieves this with a white-side gradient at 18% image opacity. The mobile implementation is substantially darker and makes MobileHero the darkest section on a page that should be bright.

WARNING — `AboutStory.tsx:263,331–332` (Visit Us Frame): Dark image overlays on the Visit Us background: `bg-gradient-to-t from-black/30 via-black/20 to-transparent` and `bg-gradient-to-r from-black/30 via-black/20 to-transparent`. These create a muddy, desaturated grey-brown over a light surface rather than a clean bright section.

PASS — HeroStage (desktop): white background with 18% opacity image and white-side gradient is the correct bright treatment. Aperture card uses pearl surface with wine accent hairlines — clean. Navbar glass card uses white/95 correctly.

---

### Pillar 3: Color (2/4)

**Audit counts:**
- Instances of dark-mode text on bright-wrapped sections (zinc-300, zinc-500, zinc-600, #d1ccc4, #aaa49a, #88837a): 46 matches across `src/components/home`
- Instances of `bg-[#c8a96e]` or `bg-[#C8A96E]` (gold as background): 6 matches in home + collection components
- Instances of `border-white/[0.0x]` or `border-white/[0.1x]` on bright surfaces: 5 matches in CategoryDiscovery alone

**BLOCKER — Gold as button fill:**
Brand spec: "Gold/decorative: #C8A96E (used only as accent, not backgrounds)." Violations:
- `MobileHero.tsx:72,80`: Primary hero CTA — `bg-[#c8a96e]` (entire button fill)
- `ProductDetailDrawer.tsx:221`: WhatsApp inquiry button — `bg-[#C8A96E]`
- `ShortlistPill.tsx:63`: Selected shortlist state — `bg-[#C8A96E]`
- `CollectionSearch.tsx:306`: Filter hover — `hover:bg-[#c8a96e]`
- `AboutStory.tsx:373`: "TALK TO AN EXPERT" hover — `hover:bg-[#C8A96E]`
The `.brass-plate` component class (globals.css) correctly uses `var(--wine)` (#8B1A42). The named class is ignored in favor of inline gold fills.

**WARNING — Dark-mode muted palette on bright surfaces:**
- `text-[#d1ccc4]` (bone-light, dark-mode secondary) used in: `AboutStory.tsx:201`, `ShowroomCinematic.tsx:259`, `MobileHero.tsx:61`, `HeroCarousel.tsx:208`. Approx contrast against white: 2.6:1 (fails WCAG AA).
- `text-[#aaa49a]` (muted-bone, dark-mode muted) used in: `CategoryDiscovery.tsx:20,73,107`, `ProductReel.tsx:186`. Approx contrast: 2.8:1 (fails WCAG AA at normal text size).
- `text-zinc-300` (#d4d4d8) used in: `FloatingCTA.tsx:127,162`. Contrast against white: 1.85:1 — severe failure.
- `text-zinc-500` (#71717a) used in: `FloatingCTA.tsx:137,141,145`. Contrast: ~4.5:1 — borderline pass for large text, fail for normal.
- `text-zinc-600` (#52525b) used in: `AboutStory.tsx:146,283`. Contrast: ~7.1:1 — passes, but wrong palette.

**WARNING — `BrandTrustStrip.tsx:62–66`:** Fallback text-only brand wordmarks use `text-[var(--text-primary,#e8e3d9)] opacity-55`. The hardcoded fallback `#e8e3d9` is the dark-mode bone color. Under `.theme-ivory`, `--text-primary` correctly resolves to `#1a1017` (ink), so the CSS variable path is fine. However, if CSS variable resolution fails for any reason (SSR timing, missing theme class), text becomes near-invisible bone at 55% opacity on a white background.

**PASS:** Wine crimson (#8B1A42) correctly applied to primary CTAs, active nav indicators, focus rings, scrollbar thumb, HeroStage eyebrow and aperture accents. The 60/30/10 principle is implemented in the token system. `globals.css` semantic token architecture is well-structured.

---

### Pillar 4: Typography (2/4)

**Defined system (globals.css lines 211–218):** 8 named classes — `text-headline-xl` (64px), `text-headline-lg` (40px), `text-headline-lg-mobile` (32px), `text-headline-md` (24px), `text-body-lg` (18px), `text-body-md` (16px), `text-ui-button` (14px), `text-label-caps` (12px).

**Actual usage:** Zero of these 8 classes appear in any home component. All components use raw Tailwind size classes and arbitrary bracket values instead.

**WARNING — Type scale fragmentation:** Arbitrary sizes in home components alone (grep count: 99 matches):
- Micro labels: [9px], [10px], [11px], [11.5px], [12px], [12.5px], [13px], [13.5px]
- Body: text-sm, text-base, text-lg + [15px], [19px], [20px]
- Subheadings: text-2xl, text-3xl, text-4xl, text-5xl + [28px], [30px], [32px], [34px]
- Display: text-6xl, text-7xl, text-8xl + [46px], [56px], [62px], [84px], [96px]
- Effective distinct sizes: approximately 32 (vs 8 system-defined)

This means: every developer must guess what size to add next. There is no enforceable type scale. A reviewer cannot audit compliance because there is no mapping from component to system token.

**WARNING — Font weights:** 5 in use (light, normal, medium, semibold, bold). Best practice for premium editorial is 2–3 weights maximum.

**PASS:** Three-family system (hc-serif for display, hc-mono for captions/labels, DM Sans for UI) is architecturally sound and consistently applied. Font loading via next/font and CSS variable aliases is correct.

---

### Pillar 5: Spacing (3/4)

**Defined spacing scale (globals.css lines 67–76):** xs=4px, sm=8px, md=16px, lg=32px, xl=64px, gutter=24px, margin-mobile=24px, margin-desktop=80px.

**WARNING — Non-scale values:**
- `CategoryDiscovery.tsx:10`: Desktop padding `px-[68px]` — not a multiple of 8; inconsistent with the `margin-desktop=80px` token
- `HeroStage.tsx:83`: `mx-[80px]` — matches the margin-desktop token value but bypasses the token itself (should be `px-[var(--spacing-margin-desktop)]` or a utility class)
- Several arbitrary gap values: `gap-[1px]` in CategoryDiscovery grid gap

**PASS — Gutter pattern:** `px-6 / lg:px-16` (24px / 64px) is consistently applied in: FloatingCTA (line 38), ShowroomCinematic (line 250), ProductReel (lines 82, 104), AboutStory (line 175), BrandTrustStrip (line 74). This is close to the defined gutter (24px) and xl margin (64px).

**PASS — Section padding:** py-16 (64px) and py-20 (80px) are the dominant section heights, with py-24 and py-28 for emphasis. These map loosely to the xl (64px) token. The range is wider than ideal but not chaotic.

---

### Pillar 6: Experience Design (2/4)

**BLOCKER — No error or loading states for any CMS-driven section:** `page.tsx` fetches homeData, testimonials, brands in a Promise.all with no try/catch. If Sanity is unreachable, the page throws an unhandled exception and Next.js will surface the default error boundary or a blank server error. None of the individual section components implement their own loading or error UI.

**WARNING — Empty state: Reviews section silently collapses:**
`FloatingCTA.tsx:34`: `{reviews.length > 0 && (...)}`. When testimonials are an empty array, the entire reviews zone and its horizontal rule disappear with no fallback message. A first-time visitor to the site while Sanity has no testimonials data will see a confusing gap between sections.

**WARNING — WCAG contrast failures for body text:**
- `FloatingCTA.tsx:127`: `text-zinc-300` body copy ("Tell us what you're working on...") on pearl background. #d4d4d8 on #F8F6F6: approximately 1.8:1. WCAG AA requires 4.5:1 for normal text. Users with any visual impairment cannot read this content, which is the primary description in the conversion zone.
- `FloatingCTA.tsx:162`: "Open in Maps" button initial text `text-zinc-300` on pearl surface — same failure. The button's resting state is effectively invisible.

**WARNING — No confirmation for consultation form submission failure.** The `ConsultationForm` renders inline in the conversion zone, but no error state is visible in the component references here.

**PASS — Keyboard accessibility:** Mobile nav implements full Tab trap with Escape-to-close and focus-return-to-trigger (`Navbar.tsx:75–129`). Body scroll lock on menu open. Both menu button and drawer have correct `aria-expanded`, `aria-controls`, `aria-modal`, `aria-label` attributes.

**PASS — Reduced motion:** All GSAP components use `useReducedMotion()` and return static layouts when true. `globals.css` disables all keyframe animations under `prefers-reduced-motion: reduce` (lines 593–612). The `light-sweep-overlay` is suppressed under this preference.

**PASS — Focus rings:** Global `:focus-visible` with 2px wine (#8B1A42) outline is defined in globals.css (line 585). The `.hc-focus` utility class reinforces it on key interactive elements.

**PASS — Mobile conversion path:** Fixed bottom `MobileConversionBar` provides immediate Call / WhatsApp / Visit taps without needing to scroll to the consultation form.

---

## Files Audited

| File | Lines |
|------|-------|
| `src/app/globals.css` | 613 |
| `src/app/page.tsx` | 152 |
| `src/components/Navbar.tsx` | 475 |
| `src/components/home/HeroStage.tsx` | 222 |
| `src/components/home/mobile/MobileHero.tsx` | ~100 (partial) |
| `src/components/home/CategoryDiscovery.tsx` | 149 |
| `src/components/home/MaterialJourney.tsx` | 440 |
| `src/components/home/ProductReel.tsx` | 254 |
| `src/components/home/ShowroomCinematic.tsx` | 304 |
| `src/components/home/FloatingCTA.tsx` | 264 |
| `src/components/home/AboutStory.tsx` | 399 |
| `src/components/Footer.tsx` | 354 |
| `src/components/BrandTrustStrip.tsx` | 164 |

Registry audit: `components.json` not confirmed present; no third-party shadcn registries in scope. Registry audit skipped.
