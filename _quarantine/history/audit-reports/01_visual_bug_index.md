# Visual Bug & UI/UX Defect Forensic Index (01_visual_bug_index.md)

**Target Repository:** Hardware Collection (Jamshedpur Architectural Flagship)  
**Inspection Suite:** Chrome DevTools Protocol (`chrome-devtools-mcp`)  
**Devices Emulated:**
- Mobile Small / Standard: 375x667 @ 2x (iPhone SE / 8)
- Tablet Portrait: 768x1024 @ 2x (iPad Mini / Air)
- Tablet Landscape / Small Laptop: 1024x768 @ 1x (iPad Landscape / 11" MacBook)
- Desktop Standard: 1440x900 @ 1x (MacBook Pro / High-DPI Desktop)
- Full HD / Wide: 1920x889 @ 1x (Standard 1080p Desktop)

---

## Master Defect Ledger (Remediation Complete)

```
Total Defects Discovered: 20
Total Defects Resolved & Verified: 20 (100%)
P0 - Blocker (Critical Polish / Data Corruption): 3 / 3 RESOLVED & VERIFIED
P1 - Critical (Layout Breaking / Visual Loss / Broken Routes): 9 / 9 RESOLVED & VERIFIED
P2 - Major (Ergonomics / Contrast / Duplication): 6 / 6 RESOLVED & VERIFIED
P3 - Minor (Typographic Aesthetics / Visual Clutter): 2 / 2 RESOLVED & VERIFIED
Compiler Status: TypeScript tsc --noEmit: 0 ERRORS
```

---

### Index of Detailed Defect Entries

#### 1. Entity & Typographic Defects

##### VBUG-01: Raw Unescaped `&mdash;` Rendered to End-Users
- **Component:** `MaterialJourney.tsx`
- **File:** `src/components/home/MaterialJourney.tsx:37, 45, 53, 61`
- **Breakpoints:** All Viewports (Mobile, Tablet, Desktop)
- **Visual Impact:** Text renders literal HTML entities: `"without glare &mdash; the professional's choice"`. Users see the string `&mdash;` directly in the headline/description.
- **Root Cause:** React JSX does not automatically decode HTML entity names stored inside JavaScript string literals in object arrays.
- **Remediation:** Replace `"&mdash;"` with unicode character `" — "` (`\u2014`).

##### VBUG-02: Raw Unescaped `&middot;` in Specifications and Badges
- **Component:** `MaterialJourney.tsx`, `ProductReel.tsx`, `CollectionsHero.tsx`, `ConsultationForm.tsx`
- **File:**
  - `src/components/home/MaterialJourney.tsx:38, 46, 54, 62, 70`
  - `src/components/home/ProductReel.tsx:205`
  - `src/components/collections/CollectionsHero.tsx:33`
  - `src/components/consultation/ConsultationForm.tsx:314`
- **Breakpoints:** All Viewports
- **Visual Impact:** Rendered text displays `&middot;` as raw code: `"9H surface &middot; Application: Bathrooms"`, `"{product.index} &middot; {product.category}"`.
- **Root Cause:** Raw entity strings in template literals without HTML entity decoding.
- **Remediation:** Replace `"&middot;"` with literal middle dot `" · "` (`\u00B7`).

##### VBUG-03: Exaggerated Numerals in Cormorant Garamond
- **Component:** `AboutStory.tsx`
- **File:** `src/components/home/AboutStory.tsx:94, 114`
- **Breakpoints:** All Viewports
- **Visual Impact:** Numeral `1` renders like capital `I` with a wide top serif and bottom base, making `"10+"` appear as `"IO+"` and `"100%"` appear as `"IOO%"`.
- **Remediation:** Add `font-sans` or `font-feature-settings: "tnum"` / tabular figures for quantitative statistics.

---

#### 2. Layout, Responsive & Viewport Clipping Defects

##### VBUG-04: Navbar Phone Pill Multi-Line Text Wrapping at 1024px
- **Component:** `Navbar.tsx`
- **File:** `src/components/layout/Navbar.tsx:292-298`
- **Breakpoints:** 1024px (Tablet Landscape, iPad Air, 11" Laptops)
- **Visual Impact:** The telephone link inside the floating navbar wraps spaces into a 3-line vertical stack:
  ```
  +91
  98351
  90738
  ```
  This stretches the height of the pill and misaligns the navbar vertical centering.
- **Root Cause:** Missing `whitespace-nowrap shrink-0` on the anchor tag.
- **Remediation:** Add `whitespace-nowrap` to the inner span and container.

##### VBUG-05: HeroStage Aperture Specimen Card Viewport Overflow at 1024px
- **Component:** `HeroStage.tsx`
- **File:** `src/components/home/HeroStage.tsx:159, 245`
- **Breakpoints:** 1024px (Tablet Landscape)
- **Visual Impact:** The specimen card on the right overflows past the right viewport boundary by ~140px, causing the right edge of the card to be clipped or causing horizontal scrollbars.
- **Root Cause:** The container layout uses `minmax(480px, 580px)` for the text column, `gap-16` (64px), fixed `w-[460px]` for the card, and `mx-[80px]` (160px). Total minimum width required = 480 + 64 + 460 + 160 = 1164px > 1024px.
- **Remediation:** Change `w-[460px]` to fluid `w-full max-w-[460px]`, reduce gap to `gap-8` on `lg`, and responsive margin `mx-6 lg:mx-10 xl:mx-[80px]`.

##### VBUG-06: Floating Navbar Occlusion of "Back to All Collections" Breadcrumb
- **Component:** `SpaceLandingClient.tsx`, `CategoryDetailClient.tsx`
- **File:**
  - `src/components/collections/SpaceLandingClient.tsx:49-57`
  - `src/components/collections/CategoryDetailClient.tsx:83-91`
- **Breakpoints:** 768px, 1024px, 1440px
- **Visual Impact:** On all category and space detail pages, the floating navbar sits fixed at `top: 16px` with a ~64px height. The breadcrumb link has `pt-8` (32px), placing it directly underneath the navbar capsule. Only an unclickable `<` arrow peeks out on the left.
- **Root Cause:** Lack of top clearance for the fixed floating navigation bar.
- **Remediation:** Increase container top padding to `pt-28 lg:pt-32`.

##### VBUG-07: Floating Specialist Trigger Overlapping Chapter 02 Title
- **Component:** `CollectionsClient.tsx`, `FeaturedChapters.tsx`
- **File:** `src/app/collections/CollectionsClient.tsx:210-230`
- **Breakpoints:** 1024px (Tablet Landscape)
- **Visual Impact:** The floating pill `"NEED HELP CHOOSING? CONSULT A SPECIALIST"` rests with sticky bottom coordinates directly over the text of Chapter 02 (`"CABINET & FURNITURE HARDWARE"`), slicing through the text.
- **Remediation:** Increase bottom offset and clamp z-index, or anchor the button statically beneath the chapter list.

---

#### 3. Visual Polish, Theme Continuity & Color Contrast Defects

##### VBUG-08: Mobile "Zebra-Striping" Discontinuity (5x Theme Flips)
- **Component:** Mobile Home Flow
- **File:** `page.tsx`, `MobileCategoryDiscovery.tsx`, `MobileProductReel.tsx`, `MobileReviews.tsx`, `MobileConsultation.tsx`
- **Breakpoints:** Mobile (375px–768px)
- **Visual Impact:** Scrolling down the home page triggers 5 jarring color transitions:
  1. Hero: Light Ivory (`#fdf8f0`)
  2. Badges: Light Ivory (`#fdf8f0`)
  3. Discovery: Jet Black Obsidian (`#11100f`)
  4. Product Reel: Jet Black Obsidian (`#11100f`)
  5. Reviews: Jet Black Obsidian (`#11100f`)
  6. Story: Light Ivory (`#fdf8f0`)
  7. Consultation: Jet Black Obsidian (`#11100f`) with Ivory Form Card
  8. Footer: Light Ivory (`#fdf8f0`)
  Hard rectangular seams cut across the screen with zero transition or thematic harmony.
- **Root Cause:** Hardcoded `bg-surface-obsidian` on mobile components without accounting for the light ivory site theme.
- **Remediation:** Standardize mobile components to use warm ivory backgrounds (`bg-[#fdf8f0]` and `bg-[#f7f0e4]`) with subtle borders.

##### VBUG-09: Invisible Dorset SeekLogo on Light Ivory Cards
- **Component:** `CatalogLibrary.tsx`
- **File:** `public/brands/dorset-seeklogo.svg`, `src/components/catalog/CatalogLibrary.tsx:101-108`
- **Breakpoints:** All Viewports (`/catalogs`)
- **Visual Impact:** The Dorset card in the catalog library appears blank in the logo area.
- **Root Cause:** `dorset-seeklogo.svg` contains hardcoded `.st0 { fill: #ffffff; }`. On an ivory card (`#f7f0e4`), pure white has a 1.05:1 contrast ratio.
- **Remediation:** Change `.st0 { fill: #1a1017; }` or use the dark asset `dorset-logo.webp`.

##### VBUG-10: Invisible Hettich and Kich SVG Logos
- **Component:** `BrandTrustStrip.tsx`, `CatalogLibrary.tsx`
- **File:** `public/brands/Hettich.svg`, `public/brands/kich_logo.svg`
- **Breakpoints:** All Viewports
- **Visual Impact:** Brand lettering vanishes on light backgrounds due to hardcoded `#ffffff` gradient stops and path fills.
- **Remediation:** Provide dark-fill variants or apply CSS `filter: brightness(0)` on light backgrounds.

##### VBUG-11: Border-White/[0.15] Ghost Button Invisibility on Light Ground
- **Component:** `CategoryDetailClient.tsx`, `CollectionsHero.tsx`
- **File:** `src/components/collections/CategoryDetailClient.tsx:142`, `src/components/collections/CollectionsHero.tsx:76`
- **Breakpoints:** All Viewports
- **Visual Impact:** Buttons styled with `border-white/[0.15]` appear completely borderless and unstyled on ivory backgrounds. Dividers styled with `bg-white/[0.20]` are completely invisible.
- **Root Cause:** Dark mode utility classes left in place when switching the page to ivory.
- **Remediation:** Change `border-white/[0.15]` to `border-[#1a1017]/[0.15]` and `bg-white/[0.20]` to `bg-[#1a1017]/[0.12]`.

##### VBUG-12: Primary Button Text Overridden by Hardcoded `text-[#090909]`
- **Component:** `CategoryDetailClient.tsx`, `SpaceLandingClient.tsx`
- **File:**
  - `src/components/collections/CategoryDetailClient.tsx:133, 327, 368`
  - `src/components/collections/SpaceLandingClient.tsx:101, 158`
- **Breakpoints:** All Viewports
- **Visual Impact:** `.brass-plate` sets `background-color: var(--wine)` (`#8b1a42`). The hardcoded class `text-[#090909]` forces near-black text onto dark burgundy, producing an illegible 1.8:1 contrast ratio.
- **Remediation:** Remove `text-[#090909]` and replace with `text-white font-medium`.

---

#### 4. Architecture, Navigation & Information Flow Defects

##### VBUG-13: Broken Sub-Footer Links to Missing `/privacy` and `/terms` Pages
- **Component:** `Footer.tsx`
- **File:** `src/components/layout/Footer.tsx:420, 423`
- **Breakpoints:** All Viewports
- **Visual Impact:** Clicking "Privacy Policy" or "Terms & Conditions" routes visitors to an unstyled 404 page.
- **Root Cause:** Missing route folders in `src/app/privacy` and `src/app/terms`.
- **Remediation:** Create `src/app/privacy/page.tsx` and `src/app/terms/page.tsx` using the project's layout and typography.

##### VBUG-14: Redundant Stacked Headings in Collections Page
- **Component:** `CollectionsClient.tsx`, `SpaceIntentRail.tsx`
- **File:** `src/app/collections/CollectionsClient.tsx:120-130` and `src/components/collections/SpaceIntentRail.tsx:60-70`
- **Breakpoints:** All Viewports (`/collections`)
- **Visual Impact:** Visitors see two nearly identical headings stacked 20px apart:
  - `"INTENT-LED SPECIFICATION / Browse by Architectural Space"`
  - `"CURATED SPACES / Explore by Architectural Space"`
- **Remediation:** Remove the redundant outer heading in `CollectionsClient.tsx`.

##### VBUG-15: Mobile Category Discovery Skipping Number `02`
- **Component:** `MobileCategoryDiscovery.tsx`
- **File:** `src/components/home/mobile/MobileCategoryDiscovery.tsx:38, 92-130`
- **Breakpoints:** Mobile (375px)
- **Visual Impact:** Family `02` is plucked as the focal item above, while the numbered list below displays `01`, `03`, `04`, `05`. To visitors, category `02` appears missing.
- **Remediation:** Keep natural sequential numbering or display `01` through `05` coherently.

##### VBUG-16: Duplicate `<AboutStory>` DOM Tree Bloat
- **Component:** `page.tsx`, `ShowroomCinematic.tsx`
- **File:** `src/app/page.tsx:128, 147`
- **Breakpoints:** All Viewports
- **Visual Impact:** `<AboutStory>` is instantiated twice in the root page markup (once for mobile and once inside `ShowroomCinematic`). Because `AboutStory.tsx` internally duplicates its markup with `lg:hidden` and `hidden lg:block`, four complete copies of the component DOM and images are rendered.
- **Remediation:** Render `<AboutStory>` once at the root level outside viewport conditionals.

##### VBUG-17: Sub-44px Touch Targets in Footer (Apple HIG Violation)
- **Component:** `Footer.tsx`
- **File:** `src/components/layout/Footer.tsx:220-234, 420-435`
- **Breakpoints:** Mobile & Tablet
- **Visual Impact:** Social media buttons (`w-9 h-9`, 36px) and sub-footer links (16px line-height) are too small for comfortable touch interaction, causing mis-taps.
- **Remediation:** Enforce `min-w-[44px] min-h-[44px]` on social icon buttons and expand link tap padding.

##### VBUG-18: Mobile Drawer Menu Logo Maroon Focus Outline
- **Component:** `Navbar.tsx`
- **File:** `src/components/layout/Navbar.tsx:236, 340`
- **Breakpoints:** Mobile (375px)
- **Visual Impact:** Tapping the hamburger menu triggers autofocus on `<Link href="/">`, painting an unsightly maroon focus rectangle around the logo.
- **Remediation:** Add `tabIndex={-1}` or suppress auto-focus on initial modal drawer open.

##### VBUG-19: Catalog Library Partner Badge Overlapping Country Text
- **Component:** `CatalogLibrary.tsx`
- **File:** `src/components/catalog/CatalogLibrary.tsx:88-96`
- **Breakpoints:** All Viewports (`/catalogs`)
- **Visual Impact:** The `"AUTHORIZED PARTNER"` rounded badge overlaps the country label (`"GERMANY"`, `"AUSTRIA"`, `"INDIA / GLOBAL"`).
- **Remediation:** Change container from `flex items-center justify-between` to `flex flex-wrap items-center justify-between gap-2`.

##### VBUG-20: Visual Collision in Showroom Cinematic Chapter 1
- **Component:** `ShowroomCinematic.tsx`
- **File:** `src/components/home/ShowroomCinematic.tsx:210-240`
- **Breakpoints:** Desktop (1440px)
- **Visual Impact:** The large serif text `"FLAGSHIP SHOWROOM SAKCHI"` sits directly on top of the physical white signage `"HARDWARE COLLECTION"` in the background photo.
- **Remediation:** Darken the background scrim or adjust vertical headline positioning.
