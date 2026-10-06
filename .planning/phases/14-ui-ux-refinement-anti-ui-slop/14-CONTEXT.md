# Phase 14: UI/UX Refinement & Anti-UI-Slop Standardization - Context

**Gathered:** 2026-10-06
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase formalizes, stabilizes, and completes the site-wide UI/UX audit findings, responsive interactions, and anti-ui-slop architectural design system standards across Hardware Collection:
1. Mobile navigation and persistent floating dual-action buttons (`FloatingActionButtons.tsx`).
2. Showroom contact and consultation UX, including verified business-truth metrics (`10+ Years in Sakchi`, `20+ Authorized Brands`, `Sakchi Flagship HQ`), dual lead submission flow, and streamlined map framing.
3. Minimalist Collections Hero Carousel with calm autoplay (6-7s), hover-pause, linear indicators, and seamless promotional offer CTAs.
4. Global Anti-UI-Slop enforcement adopting a softened architectural hybrid corner aesthetic (`rounded-none` on containers/buttons, subtle `rounded-sm` on inputs/thumbnails) and unifying color styling to semantic CSS variables.

</domain>

<decisions>
## Implementation Decisions

### Floating Action Buttons & Mobile Navigation
- **D-01 (Scope):** Floating action buttons are strictly mobile-only (`lg:hidden`). Desktop viewports remain clean as the header navbar and footer already host complete calling, consultation, and directions CTAs.
- **D-02 (Form Factor):** Architectural square shape (`rounded-none`, 48x48px, subtle border, distinct phone and WhatsApp brand green icons). Replaces the old bulky bottom sticky bar.
- **D-03 (Scroll Dynamics):** Always fixed and visible in bottom-right corner (`fixed bottom-6 right-6`), providing immediate one-tap contact without scroll jitter or auto-hiding.
- **D-04 (Mobile Menu Header):** The mobile hamburger toggle uses a borderless, transparent icon button that blends directly into the navbar island, triggering a full-screen luxury overlay drawer with architectural typography and rapid contact shortcuts.

### Contact & Consultation Section
- **D-05 (Submission Flow):** Dual submission pathway. Submitting the consultation request records the lead in the backend/Google Sheets and immediately opens WhatsApp with pre-filled lead details so the visitor receives instant human assistance from the Sakchi showroom team.
- **D-06 (Showroom Map):** Responsive live embedded Google Maps iframe with sharp borders and a dedicated "Get Directions" deep link to launch Google Maps on mobile/desktop.
- **D-07 (Verified Metrics):** 3-column architectural divider anchoring physical showroom authority:
  - `10+` Years in Sakchi (Owner correction: 10+ years, not 20+)
  - `20+` Authorized Brands
  - `HQ` Sakchi Flagship Showroom
- **D-08 (Form Complexity):** Standard 4 fields (Name, Phone Number, Project Type dropdown, Optional Notes/Date) balancing low user friction with enough qualification for designers and architects.

### Hero Carousel & Offers System
- **D-09 (Autoplay Physics):** Gentle autoplay with a 6-7s interval that immediately pauses on mouse hover or touch focus, respecting `prefers-reduced-motion`.
- **D-10 (Slide Navigation):** Minimal linear progress bars (`h-[2px]`, active bar expanded to `w-6`) with smooth cubic-bezier transitions. Bulky circular play/pause/arrow buttons are eliminated.
- **D-11 (Promotional Offers):** Active offer slides are visually badged with a subtle brass eyebrow tag (`EXCLUSIVE PRIVILEGE` / `SPECIAL OFFER`) and dual CTAs: a cream button for "Enquire Offer" (WhatsApp handoff) and an outline button for "All offers" (`#offers` anchor).
- **D-12 (Typography Hierarchy):** Ultra-minimal editorial typography: clean static title (`Explore Our Collections`) + active slide title and 1-line architectural subtitle. Zero marketing fluff or paragraphs of filler text.

### Global Anti-UI-Slop & Component Hardening
- **D-13 (Corner Geometry):** Softened architectural hybrid — strict `rounded-none` for all main layout containers, showcase cards, and buttons; subtle `rounded-sm` (2px radius) permitted exclusively on internal form inputs and thumbnail images. Zero generic `rounded-xl` or pill-shaped buttons.
- **D-14 (Color Variables):** Standardize all styling on semantic CSS variables (`var(--surface)`, `var(--text-primary)`, `var(--text-secondary)`, `var(--border)`, `var(--color-wine)`, `var(--color-brass)`), eliminating arbitrary hex codes and raw gray utilities.
- **D-15 (QuickView Presentation):** Centered architectural modal with luxury ivory canvas, sharp borders, high-contrast product photography, and 1-tap WhatsApp consultation CTA.
- **D-16 (Tactile Feedback):** Crisp tactile interaction physics (`active:scale-[0.98]`, 200ms ease-out transitions, subtle lift without heavy blurry drop shadows) echoing the physical weight of solid metal hardware.

### Agent Discretion
- Exact animation timing curve (`cubic-bezier(0.16, 1, 0.3, 1)` or standard `ease-out`) for slide bar progression.
- Specific form validation microcopy and error states in `ConsultationForm.tsx`.
- Refined SVG icons and padding balance across mobile viewport heights.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Navigation & Actions
- `src/components/ui/FloatingActionButtons.tsx` — Mobile floating call & WhatsApp buttons
- `src/components/layout/Navbar.tsx` — Responsive header, brand lockup, and mobile menu toggle
- `src/components/layout/Footer.tsx` — Footer architecture with direct phone, address, and directions

### Contact & Consultation
- `src/components/home/ConsultationSection.tsx` — Showroom stats, action buttons, and map embed
- `src/components/consultation/ConsultationForm.tsx` — Consultation form fields, validation, and submission handler
- `src/lib/config.ts` — Showroom NAP, WhatsApp link generator, and phone constants

### Collections & Hero
- `src/components/collections/CollectionsHero.tsx` — Carousel hero, autoplay integration, and offer CTAs
- `src/components/home/HeroStage.tsx` — Homepage aperture hero and slide indicators
- `src/components/home/AboutStory.tsx` — Simplified architectural 3-pillar brand story

### Anti-UI-Slop Rules & Styling
- `.agents/skills/anti-ui-slop/SKILL.md` — Core rules: no rounded pills, no fuzzy shadows, architectural crispness
- `src/app/globals.css` — CSS design tokens (`--surface`, `--accent`, `--color-wine`, `--color-brass`)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `FloatingActionButtons.tsx`: Clean mobile floating button container with `SHOWROOM_PHONE_HREF` and `generateWhatsAppUrl()`.
- `generateWhatsAppUrl()` in `src/lib/config.ts`: Single source of truth for constructing WhatsApp deep links with custom lead text.
- `EmblaCarousel`: Powering `CollectionsHero` with active autoplay plugin hooks via `api.plugins().autoplay`.

### Established Patterns
- Architectural luxury aesthetic: Ivory/charcoal surfaces, brass accents, crisp rectangular geometry.
- Single WhatsApp number: `+91 98351 90738` site-wide.
- Calling numbers: `+91 98351 90738` (primary) and `+91 94311 11550` (call-only).
- No prices, no shopping cart, no checkout.

### Integration Points
- `src/app/layout.tsx`: Root layout hosting `<FloatingActionButtons />` and `<ConsultationDrawer />`.
- `src/app/page.tsx`: Homepage assembling `HeroStage`, `AboutStory`, and `ConsultationSection`.
- `src/app/collections/page.tsx`: Collections index assembling `CollectionsHero`, `OffersSection`, and `ShowcaseCard`.

</code_context>

<specifics>
## Specific Ideas

- **Business Truth Correction:** Showroom stats MUST display `10+ Years in Sakchi` (not 20+) and `20+ Authorized Brands`.
- **Clean Mobile Toggle:** No box background, border, or shadow on the hamburger icon button in the navbar.
- **Offer Button:** In `CollectionsHero`, the offer CTA uses the cream background (`bg-[#fbf5ea] text-[#1a1017]`) with uppercase font and zero corner radius.

</specifics>

<deferred>
## Deferred Ideas

- None — all discussed items directly clarify the implementation of the UI/UX audit findings and Anti-UI-Slop stabilization.

</deferred>

---

*Phase: 14-ui-ux-refinement-anti-ui-slop*
*Context gathered: 2026-10-06*
