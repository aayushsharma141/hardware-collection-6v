# Hardware Collection — UI/UX Architecture & Use-Case Analysis

**Document:** `audit-reports/03_ui_ux_enhancement_analysis.md`  
**Evaluation Standard:** Apple Human Interface Guidelines & Luxury Digital Showroom Architecture  
**Status:** Canonical Audit & Architecture Specification  
**Author:** Senior Software & Experience Architect  
**Project Scope:** Public digital showroom (`/`, `/collections`, `/catalogs`, `/collections/[slug]`)  

---

## Executive Summary

Hardware Collection is a single-location, 20+ year architectural hardware, digital lock, and modular kitchen systems retailer operating in Sakchi, Jamshedpur (owned by Mukesh Khandelwal). 

This audit resets the interface evaluation from superficial CSS patching to foundational UI/UX architecture. The core strategic premise established across all workspace documents is clear:
> **The website is a physical showroom trust engine and lead-generation platform, not an online store.** The website’s job is to establish that the Sakchi showroom is worth visiting and to seamlessly transition the visitor into a contextual WhatsApp consultation with a showroom specialist.

Through comprehensive analysis of 20+ root project documents, live multi-viewport testing (375×667, 768×1024, 1024×768, 1440×900, 1920×1080, 2133×1012), and persona journey mapping, this report diagnoses the current digital experience, separates objective defects from UX enhancement opportunities, and establishes a prioritized roadmap.

---

## 1. Project Context & Business Constraint Extraction

The table below synthesizes the complete root documentation (`PROJECT_INSTRUCTIONS.md`, `PRODUCT.md`, `COMPANY.md`, `BRANDS.md`, `CUSTOMER_PERSONAS.md`, `SALES_PLAYBOOK.md`, `FAQ.md`, `GBP_STRATEGY.md`, `WEBSITE_CMS.md`, `CONSTITUTION.md`, `NEVER-BUILD.md`, and `NAV_AND_COLLECTIONS_PLAN.md`) into binding UX rules.

| Source Document | Foundational Constraint | Concrete UX / UI Decision Affected |
| :--- | :--- | :--- |
| **PROJECT_INSTRUCTIONS.md** §1, §3 | **Retail Showroom, Not eCommerce**: No cart, no checkout, no online payment, no SKU-level transactional pricing. | Every product and category interaction must terminate in a **Consultation CTA** ("WhatsApp Specialist" or "Experience in Showroom") rather than an "Add to Cart" or "Buy Now" button. |
| **PROJECT_INSTRUCTIONS.md** §6, **PRODUCT.md** | **Contextual WhatsApp Ingestion**: WhatsApp number (`+91 98351 90738`) must carry prefilled, URL-encoded contextual payloads. | Generic "Contact Us" links are forbidden. Every button must encode the active product name, brand, or category so the showroom specialist immediately knows what the customer is viewing. |
| **COMPANY.md** & **PRODUCT.md** | **Local Sakchi Destination**: Single showroom at 1/18, Kashidih, Near Durga Puja Maidan, Sakchi, Jamshedpur. Open 10 AM – 8 PM. | Address, operating hours, driving directions, and local Sakchi landmark cues must be permanently accessible in the header, footer, and mobile conversion bar. Disambiguation from the Kolkata namesake is mandatory. |
| **BRANDS.md** & **PRODUCT.md** | **Authorized Dealership Reality**: Core partnerships: Häfele, Dorset, Labacha, Godrej, Hettich, Kich + expanded authorized showroom roster. | Brand logos must render as verified partners with official catalog links. No unverified superlatives ("#1 in Jharkhand", "cheapest in city") are permitted without empirical measurement. |
| **CUSTOMER_PERSONAS.md** & **SALES_PLAYBOOK.md** | **Dual Primary Audiences**: Homeowners (renovating, aesthetic-focused) vs. Architects/Designers (specifying, technical detail). | Visual hierarchy must balance tactile sensory imagery (finishes, soft-close motion, luxury handles) with technical cut-sheets, dimensions, and brand specifications without polarizing either group. |
| **WEBSITE_CMS.md** & **NAV_AND_COLLECTIONS_PLAN.md** | **Locked 2-Route Canonical System**: Public routes are strictly `/` (home), `/collections`, and `/catalogs` + `/collections/[slug]`. Product detail via Lookbook Drawer (`?product=<slug>`). | Do not build sprawling separate page hierarchies. Product inspection happens in a high-speed slide-over Lookbook Drawer that preserves catalog browsing state. |
| **CONSTITUTION.md** (Laws 5, 6, 10) | **Context Over Content & Reduced Cognitive Load**: "Every screen must answer: What should I know? What should I do? Why?" | Eliminates redundant banners, confusing nested accordions, and conflicting CTAs. Trust and clarity outrank decorative visual clutter. |
| **UI-REVIEW.md** & Brand Design Spec | **Bright Architectural Palette Mandate**: Wine Crimson (`#8B1A42`), Gold (`#C8A96E` - accent only), Pearl/White surfaces (`#F8F6F6` / `#FFFFFF`), Deep Ink text (`#1A1017`). | Dark-mode text colors on bright backgrounds are accessibility violations. Gold is strictly restricted to accents, hairlines, and badges—never button fill backgrounds. |

---

## 2. User Use-Case & Journey Models

Based on `CUSTOMER_PERSONAS.md`, `SALES_PLAYBOOK.md`, and local search traffic patterns from `GBP_STRATEGY.md`, the platform serves six distinct visitor intents:

```
                  ┌─────────────────────────────────────────────────────────┐
                  │               VISITOR ENTRY (Google / GBP / Direct)    │
                  └───────────────────────────┬─────────────────────────────┘
                                              │
         ┌──────────────────┬─────────────────┼─────────────────┬──────────────────┐
         ▼                  ▼                 ▼                 ▼                  ▼
   1. HOMEOWNER       2. ARCHITECT       3. CONTRACTOR     4. BRAND SEEKER    5. LOCAL VISITOR
   "Renovating"       "Specifying"       "Bulk Supply"     "Needs Dorset"     "Showroom Visit"
         │                  │                 │                 │                  │
   Visual Inspiration  Brand & Specs     Stock & Tiers     Official Catalog   Address & Hours
         │                  │                 │                 │                  │
   Category Discovery  Lookbook Drawer   Direct Form       Direct Filter      Google Maps / Call
         │                  │                 │                 │                  │
         └──────────────────┴─────────────────┼─────────────────┴──────────────────┘
                                              ▼
                                 CONTEXTUAL CONSULTATION
                             (WhatsApp / Phone / In-Person)
```

### Detailed Persona Matrix

| Dimension | Persona 1: Renovating Homeowner | Persona 2: Architect / Designer | Persona 3: Contractor / Builder | Persona 4: Specific Brand Seeker | Persona 5: Local Showroom Visitor | Persona 6: Unsure / Early-Stage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Entry Point** | Google ("luxury kitchen fittings Jamshedpur") | Desktop / Tablet referral or bookmark | Mobile search ("hardware supplier Sakchi") | Search query ("Dorset digital lock dealer Sakchi") | Google Maps / GBP listing ("hardware store near me") | Social media / GBP photo click |
| **User Intent** | Upgrade home; find rust-proof, beautiful, durable finishes. | Find reliable sourcing partner who can read CAD drawings & schedules. | Bulk pricing, consistent stock depth, credit/procurement reliability. | Verify authorized dealer status and check availability of a brand. | Confirm showroom hours, exact location, and physical directions. | Explore possibilities; understand what hardware is needed. |
| **Information Needed** | Visual appearance, soft-close demo proof, tactile feel, reassurance. | Technical cut-sheets, dimensions, finishes, brand authorized certifications. | Stock availability, project delivery timelines, volume quote path. | Official catalogs, model ranges, warranty validation. | Landmark ("Near Baradwari Durga Puja Maidan"), open status, parking. | Orientation by space (Kitchen, Entrance, Wardrobe, Bathroom). |
| **Trust Requirement** | Overcome fear of unbranded/counterfeit hardware; seek guidance. | Confidence in technical expertise and genuine brand supply. | Certainty that orders won't be delayed mid-project. | Official dealer certification badges and verified manufacturer ties. | High rating (~4.4★), real local reviews, verified address. | Approachable expertise without high-pressure sales tactics. |
| **Discovery Mechanism** | Visual space carousel ("Curated Spaces"), Finish studies. | Categorical lookbook, brand filtering, specification lookbook drawer. | Category spectrum overview, direct specification form. | Brand showcase grid, downloadable official PDF catalogs. | Direct header contact module, sticky footer conversion bar. | "Five Thresholds" architectural journey, lifestyle imagery. |
| **Primary CTA** | `WHATSAPP A SPECIALIST` (prefilled with space inquiry) | `REQUEST SPECIFICATION HELP` (schedules & CAD review) | `DIRECT PROJECT ENQUIRY` (form with project tiering) | `VIEW BRAND COLLECTION` / `DOWNLOAD CATALOG` | `GET DRIVING DIRECTIONS` (Google Maps link) | `EXPLORE BY SPACE` (Curated Spaces) |
| **Secondary CTA** | `VISIT SHOWROOM IN SAKCHI` | `DOWNLOAD TECHNICAL CATALOG` | `CALL SHOWROOM DIRECTLY` | `ASK AVAILABILITY VIA WHATSAPP` | `CALL +91 98351 90738` | `WHATSAPP OUR EXPERTS` |
| **Expected Next Step** | Chat on WhatsApp with photos of their current kitchen or door. | Submit schedule or visit showroom to inspect physical display boards. | Receive structured quote via WhatsApp within 24 hours. | Inspect specific product details in Lookbook Drawer. | Navigate to showroom at 1/18 Kashidih, Sakchi. | Narrow down to a specific category (e.g., Digital Locks). |
| **Abandonment Risk** | Overwhelmed by technical jargon; feels unqualified or sees no pricing. | Site feels like a retail consumer blog without technical specifications. | Site looks like an online boutique with no bulk/contractor affordance. | Cannot find brand quickly; suspects unauthorized grey-market resale. | Cannot find address, phone number, or opening hours within 3 seconds. | Gets lost in dense product lists without room context. |
| **Mobile Behavior** | Thumb-driven vertical scrolling; instant tap to WhatsApp. | Reviewing lookbook on iPad/tablet or mobile during site visits. | Direct phone call or quick WhatsApp inquiry from job site. | Fast search/filter on mobile device while standing in front of door. | One-tap click to Google Maps directions or phone dialer. | Swiping through visual story cards and curated spaces. |
| **Desktop Behavior** | Exploring large photo galleries with family on laptop/desktop. | Full-screen lookbook browsing, cross-referencing brand catalogs. | Direct submission of project inquiry form with detailed notes. | Opening brand catalogs in secondary tabs; verifying cut-sheets. | Checking exact showroom bay displays before scheduling visit. | In-depth exploration of material finishes and 7,500 sq ft showroom story. |

---

## 3. Complete Current Interface Audit

The audit was executed against the live application across the complete viewport matrix:
- **Mobile:** 375×667 (iPhone SE), 390×844 (iPhone 14/15)
- **Tablet:** 768×1024 (iPad Portrait), 1024×768 (iPad Landscape)
- **Desktop:** 1440×900 (MacBook/Laptop), 1920×1080 (FHD Desktop), 2133×1012 (Ultra-wide)

### Section-by-Section Analysis

#### 3.1 Header Navigation (`src/components/layout/Navbar.tsx`)
- **Desktop (1440px / 1920px / 2133px):**
  - **Structure:** Logo left ("HARDWARE COLLECTION"), Nav Center (`COLLECTIONS`, `BRANDS`, `CATALOG`), Right Contact (`+91 98351 90738`, `INQUIRE` button).
  - **Findings:** Fixed header has height ~80px with backdrop blur. Clean, architectural typography. However, the `INQUIRE` button label is ambiguous (inquire about what?).
- **Mobile (375px / 390px):**
  - **Structure:** Logo left, Hamburger menu right.
  - **Findings:** Hamburger drawer opens a full-screen drawer with nav links, phone, WhatsApp, and location. Escape key works, body scroll locks. Good implementation.

#### 3.2 Homepage Hero Stage (`src/components/home/HeroStage.tsx` & `MobileHero.tsx`)
- **Desktop:**
  - **Structure:** Cinematic 3-slide carousel. Eyebrow: "ARCHITECTURAL HARDWARE EXPERTS SINCE 2002". Title: "The Art of the Finish." Subtitle with partner brands. CTAs: `EXPLORE COLLECTIONS`, `WHATSAPP THE SHOWROOM`. Right side: "Hero product aperture" showcasing finish study.
  - **Findings:** Visually striking, high-tension luxury aesthetic. However, on ultra-wide screens (2133px), text container and right-hand aperture separate awkwardly across extreme whitespace.
- **Mobile (375px):**
  - **Structure:** Full-screen photographic card with dark gradient scrim.
  - **Findings:** The dark scrim (`from-[#090909] via-[#090909]/85`) makes the mobile hero appear like a dark-mode website, contrasting sharply with the bright pearl theme of the rest of the site. Secondary CTA `GET SHOWROOM DIRECTIONS` correctly serves the mobile context.

#### 3.3 Brand Trust Strip (`src/components/brand/BrandTrustStrip.tsx`)
- **Desktop & Mobile:**
  - **Structure:** 23 authorized brand wordmarks/logos (Häfele, Blum, Dorset, Pans, Geze, Ozone, Backer, Tattva, Yale, Labacha, Rexton, Liftor, Taco, Madhuram, Shapes, Furnipart, Maranello, Godrej, Decore, Hettich, Kich).
  - **Findings:** High credibility. Clean grayscale logos with subtle opacity.
  - **Issue:** Headline "Authorized Brands" is passive. Doesn't explain *why* this matters (e.g., "Official Partner & Authorized Dealerships in Jamshedpur").

#### 3.4 Category Discovery / "Five Thresholds" (`src/components/home/CategoryDiscovery.tsx`)
- **Desktop:**
  - **Structure:** 5 Architectural categories: `Handles & Knobs`, `Door Hardware`, `Bathroom`, `Kitchen & Wardrobes`, `Furniture Hardware`.
  - **Findings:** Excellent architectural copy ("Five thresholds"). Strong visual anchors with high-resolution photography.
  - **Issue:** Links like `VIEW HANDLES` use subtle low-contrast text that risks readability violations on light surfaces.
- **Mobile:**
  - **Structure:** Accordion / vertical card stack (`MobileCategoryDiscovery.tsx`). Clean collapsible layout.

#### 3.5 Material Journey / Finish Study (`src/components/home/MaterialJourney.tsx`)
- **Desktop:**
  - **Structure:** Horizontal scroll journey through 5 architectural finishes: Satin Steel, Living Brass, Matte Black, Polished Chrome, Oil-Rubbed Bronze.
  - **Findings:** Outstanding tactile storytelling. Directly reinforces "Touch Before You Decide".
  - **Issue:** On trackpad or touch screens, horizontal scroll can hijack natural vertical browsing momentum.

#### 3.6 Collections Page (`src/app/collections/page.tsx` & `CollectionsClient.tsx`)
- **Hero & Search:**
  - **Title:** "THE COLLECTION"
  - **Issue (Critical):** On desktop, the fixed navbar sits directly over the top of the title on initial load, clipping the letter tops. Top padding is insufficient (`pt-20` vs required `pt-32`).
  - **Search Bar:** Centered input (`Search collections, products and brands`). Well-styled, but floating isolated without category context.
- **Curated Spaces Section:**
  - Horizontal swipe carousel of rooms: Kitchen, Entrance, Wardrobe, Bathroom, Living / Interior, Commercial. High utility for Homeowners.
- **Featured Chapters & All Collections Grid:**
  - Chapter 01 (Digital Locks) to Chapter 05 (Wardrobe Systems).
  - Clean card structure. However, on ultra-wide viewports (2133px), cards stretch horizontally, distorting aspect ratios without a `max-w-7xl` constraint.

#### 3.7 Collection Detail Route (`src/app/collections/[slug]/page.tsx`)
- **Observed Behavior:**
  - Renders category title (e.g. "DIGITAL LOCKS"), specifications ("0.3s Semiconductor Fingerprint Access", "Triple Anti-Prise Heavy Deadbolts"), stock availability notes, and WhatsApp inquiry buttons.
  - **Critical Defect:** The `<Footer>` component is completely missing on this route! The page abruptly terminates after the consultation card with empty whitespace.
  - **Architectural Gap:** There are no individual specimen/product cards on this route! It functions solely as a high-level category summary with a consultation CTA.

#### 3.8 Catalogs Reference Library (`src/app/catalogs/page.tsx`)
- **Observed Behavior:**
  - Lists authorized brand cards with `VIEW CATALOG` and `VISIT WEBSITE`.
  - Clean, high-trust reference library for architects.

#### 3.9 Consultation Form & Footer (`src/components/home/FloatingCTA.tsx` & `Footer.tsx`)
- **Consultation Form:**
  - Segmented persona radio buttons: `Architect / Designer`, `Home Owner`, `Builder / Project`, `Retailer`.
  - Captures Name, Location, Phone Number, Project Type. Directly maps to the business needs of the showroom team.
  - **Defect:** Low-contrast text labels (`text-zinc-300`) on light pearl backgrounds fail WCAG AA readability.
- **Footer:**
  - Comprehensive verified NAP: 1/18 Kashidih, Sakchi; Phone; Hours (Mon-Sun 10 AM - 8 PM, Tue 10 AM - 2 PM). Social links, collections navigation, copyright.
  - Clean, professional closing anchor.

---

## 4. Challenging the Existing Design (Devil's Advocate & Blind Spots)

Applying the structured UX critique frameworks:

```
┌───────────────────────────────────────────────────────────────────────────┐
│                       DEVIL'S ADVOCATE AUDIT                              │
├───────────────────────┬───────────────────────────────────────────────────┤
│ 1. BLIND SPOTS        │ • Are we assuming visitors understand technical   │
│                       │   hardware terms like "mortise", "tandem", "PVD"? │
│                       │ • Do homeowners know what a "schedule" is?        │
│                       │ • Is the 7,500 sq ft showroom scale obvious above │
│                       │   the fold?                                       │
├───────────────────────┼───────────────────────────────────────────────────┤
│ 2. POTENTIAL FRICTION │ • Fixed navbar overlaps page titles on load.      │
│                       │ • Missing Footer on detail routes creates dead-end│
│                       │ • Generic "INQUIRE" button lacks conversion pull. │
│                       │ • Selection tray on mobile covers WhatsApp bubble.│
├───────────────────────┼───────────────────────────────────────────────────┤
│ 3. EDGE CASES         │ • Low bandwidth on mobile in Sakchi/Jamshedpur:   │
│                       │   Heavy hero images delay first contentful paint. │
│                       │ • Empty reviews state silently collapses UI.      │
│                       │ • User searches for unstocked brand: no helpful   │
│                       │   fallback suggestion.                            │
├───────────────────────┼───────────────────────────────────────────────────┤
│ 4. UX WRITING         │ • "INQUIRE" → Replace with "Book Consultation"    │
│                       │ • "What Our Clients Say" → "Verified Experiences" │
│                       │ • "Catalogue Spectrum" → "All Hardware Collections"│
└───────────────────────┴───────────────────────────────────────────────────┘
```

### Critical Questions Answered

1. **Does the homepage explain Hardware Collection quickly?**
   - *Verdict:* Partially. The hero tagline "The Art of the Finish" is poetic and luxurious, but does not immediately tell a first-time homeowner: *"We are Jamshedpur’s largest live hardware showroom where you can test digital locks, modular kitchens, and designer handles in person."* The supporting text carries this, but the headline relies too heavily on abstract luxury tropes.
2. **Is it obvious that this is a physical showroom rather than an eCommerce store?**
   - *Verdict:* Yes, once the visitor scrolls to "Touch Before You Decide" and the Sakchi address blocks. However, the top hero on desktop could state "VISIT OUR SAKCHI SHOWROOM" as a prominent secondary pill or badge to immediately establish physical destination intent.
3. **Can a homeowner understand where to start?**
   - *Verdict:* On the Collections page, the "Curated Spaces" (Kitchen, Entrance, Wardrobe, Bathroom) is the single best onboarding mechanism for homeowners. It translates intimidating hardware terminology into familiar rooms. This should be given higher prominence on the Homepage as well.
4. **Can an architect quickly reach relevant brands and technical cut-sheets?**
   - *Verdict:* Yes, through the `/catalogs` route and the brand strip. However, the search bar on `/collections` currently searches only basic keywords without dedicated filters for technical attributes (e.g., SS 304, PVD Brass, Soft-Close).
5. **Does product discovery naturally lead toward consultation?**
   - *Verdict:* Yes. The Lookbook Drawer and collection detail pages consistently feature `WHATSAPP SPECIALIST` and `REQUEST SPECIFICATION CONSULTATION`.

---

## 5. Categorized Findings

### Category A: Objective Defects (Bugs & Broken UI)

| ID | Location | Issue Type | Severity | Description & Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **DEF-01** | `/collections` Hero | Layout / Clipping | **P0** | Fixed navigation header (`z-50`) overlaps and clips the top of the main `<h1>` heading ("THE COLLECTION") on initial load. Container needs `pt-32` instead of `pt-20`. |
| **DEF-02** | `/collections/[slug]` | Missing Element | **P0** | The entire `<Footer />` component is omitted on dynamic collection detail routes (`src/app/collections/[slug]/page.tsx`). Page terminates abruptly into white space with no contact or legal links. |
| **DEF-03** | `FloatingCTA.tsx` | Accessibility (WCAG AA) | **P1** | Subtitle text and map link use `text-zinc-300` on pearl (`#F8F6F6`) background. Contrast ratio is ~1.85:1, failing WCAG AA (requires 4.5:1). Completely unreadable for low-vision visitors. |
| **DEF-04** | `CategoryDiscovery.tsx` | Visual Defect | **P1** | Hovering over category links (`VIEW ENTRANCE`, `VIEW KITCHEN`) turns link text white (`hover:text-white`) on bright pearl/white backgrounds, rendering the link invisible on hover. |
| **DEF-05** | Ultra-wide (>1920px) | Layout / Spacing | **P1** | Catalog grid and chapter cards on `/collections` lack an outer max-width wrapper (`max-w-7xl mx-auto`), stretching excessively across 2133px displays and distorting image ratios. |
| **DEF-06** | `CollectionsClient.tsx` | Accessibility (a11y) | **P1** | Product lookbook drawer does not trap keyboard focus (`Tab` escapes to background links), and closing via `Escape` resets focus to `<body>` instead of returning to the triggering card. |
| **DEF-07** | `HeroCarousel.tsx` | Keyboard / Focus | **P2** | Left/Right arrow key navigation is bound to `<section>` without global window listener when focused, causing arrow keys to fail if an inner element is active. |
| **DEF-08** | Mobile Viewport | Layout Collision | **P2** | When items are added to the consultation selection tray, the fixed bottom bar overlaps the floating WhatsApp consultation bubble on 375px/390px screens. |

### Category B: UX Enhancement Opportunities (Value & Conversion Improvements)

| ID | Section | Enhancement Concept | Impact | Proposed UX Behavior |
| :--- | :--- | :--- | :--- | :--- |
| **ENH-01** | Header Navigation | CTA Clarity | **High** | Change generic "INQUIRE" button in Navbar to **"BOOK CONSULTATION"** or **"TALK TO EXPERT"**, creating an explicit, high-value conversion trigger. |
| **ENH-02** | Homepage Hero | Destination Anchoring | **High** | Introduce a prominent showroom badge in the Hero: `"7,500 SQ FT FLAGSHIP SHOWROOM · SAKCHI"`. Immediately informs the visitor that a massive physical experience awaits them. |
| **ENH-03** | Curated Spaces | Homeowner Onboarding | **High** | Surface the "Explore by Architectural Space" (Kitchen, Entrance, Wardrobe, Bath) prominently on the Homepage, providing non-technical homeowners an intuitive visual entry path. |
| **ENH-04** | Brand Showcase | Brand Credibility Story | **Medium** | Enhance the Brand Trust Strip header from inert "Authorized Brands" to `"Authorized Showroom Partner for 20+ Global Architectural Brands"`. |
| **ENH-05** | Collection Detail | Product Grid Density | **High** | Populate `/collections/[slug]` with curated specimen cards from that specific category (e.g., displaying Dorset, Godrej, and Yale digital lock models) with one-click WhatsApp lookup. |
| **ENH-06** | Mobile Conversion Bar | Touch Target Ergonomics | **Medium** | Ensure bottom fixed bar (`CALL` · `WHATSAPP` · `DIRECTIONS`) has 48px minimum touch targets and clean tactile active states for one-handed thumb use on mid-range Android devices. |

---

## 6. Prioritized Enhancement Roadmap

### P0 — Must Fix (Blocks Usability, Structure, or WCAG Standards)

| Item | Problem & Evidence | Proposed UI Behavior | Affected Components | Validation Method |
| :--- | :--- | :--- | :--- | :--- |
| **P0-1** | **Hero Title Clipping on `/collections`**: Navbar overlaps "THE COLLECTION" header on desktop. | Add `pt-28 md:pt-32` padding to the top hero section container in `CollectionsClient.tsx` to clear the fixed 80px navbar cleanly. | `src/app/collections/CollectionsClient.tsx` | Visual inspection at 1440px & 1920px. |
| **P0-2** | **Missing Footer on Collection Slug Pages**: `/collections/[slug]` has no footer. | Import and render `<Footer />` at the bottom of `src/app/collections/[slug]/page.tsx` with full NAP data. | `src/app/collections/[slug]/page.tsx` | Inspect `/collections/digital-locks` in browser. |
| **P0-3** | **WCAG Contrast Failures in Conversion Zone**: `text-zinc-300` on white/pearl surface in `FloatingCTA.tsx`. | Replace low-contrast classes with `text-[var(--text-secondary)]` (`#3D2E38`) and `text-[var(--muted)]` (`#7A6872`). | `src/components/home/FloatingCTA.tsx` | Chrome DevTools Lighthouse / Accessibility check. |
| **P0-4** | **Disappearing Hover Text in Category Links**: `hover:text-white` on pearl background in `CategoryDiscovery.tsx`. | Replace `hover:text-white` with `hover:text-[var(--wine)]` (`#8B1A42`) with subtle underline animation. | `src/components/home/CategoryDiscovery.tsx` | Mouse hover test in browser. |

### P1 — High-Value UX Improvements (Meaningfully Improves Understanding & Conversion)

| Item | Problem & Evidence | Proposed UI Behavior | Affected Components | Validation Method |
| :--- | :--- | :--- | :--- | :--- |
| **P1-1** | **Max-Width Container Constraint on Wide Screens**: Unconstrained grid stretching at 2133px+. | Enforce `max-w-7xl mx-auto px-6 lg:px-8` across all category grids, chapter cards, and hero sections. | `src/app/collections/CollectionsClient.tsx`, `CatalogLibrary.tsx` | Resize browser window to 2133px and verify layout density. |
| **P1-2** | **Navbar CTA Specificity**: "INQUIRE" button lacks specificity and value proposition. | Update button text to `"BOOK CONSULTATION"` with clean wine-accent outline and calendar/chat icon. | `src/components/layout/Navbar.tsx` | Visual check across all header viewports. |
| **P1-3** | **Product Drawer Focus Trap & Return**: Focus escapes drawer; escape key doesn't return focus. | Implement accessible focus trap inside drawer modal, restoring active focus to triggering button upon close. | `src/app/collections/CollectionsClient.tsx` | Keyboard `Tab` and `Escape` validation. |
| **P1-4** | **Floating Selection Tray vs WhatsApp Bubble Collision on Mobile**: Bottom bar covers bubble. | Add `bottom-24` conditional offset to the floating WhatsApp capsule when `selection.length > 0`. | `src/components/consultation/FloatingConsultationCapsule.tsx` | Mobile testing at 375×667. |

### P2 — Premium Polish (Improves Perceived Quality Without Architectural Changes)

| Item | Problem & Evidence | Proposed UI Behavior | Affected Components | Validation Method |
| :--- | :--- | :--- | :--- | :--- |
| **P2-1** | **Hero Autoplay Feedback**: Play/Pause button state does not differentiate hover from manual pause. | Decouple hover suspension from manual pause button state; display clean tooltip indicator. | `src/components/home/HeroCarousel.tsx` | Carousel interaction testing. |
| **P2-2** | **Consistent Brand Taglines in Brand Trust Strip**: Brands lack clear category descriptors. | Standardize partner card subtitles: "German Kitchen & Door Fittings", "Smart Biometric Security", etc. | `src/components/brand/BrandTrustStrip.tsx` | Visual verification of brand roster. |
| **P2-3** | **Sensory Fallback Imagery**: Macro hardware finish plates show placeholder blocks if image fails. | Embed high-fidelity local fallback images for PVD brass, matte black, and satin steel from `/public/cinema/`. | `src/components/home/MaterialJourney.tsx` | Network throttling / offline test. |

---

## Conclusion

Hardware Collection has an exceptional brand story, verified 20+ year local authority, and genuine authorized partnerships with the world's finest architectural hardware manufacturers. By eliminating objective layout clipping, restoring missing navigational footers, fixing contrast defects, and tuning the conversion touchpoints to explicitly serve both Homeowners and Architects, the digital showroom will achieve the Apple/luxury standard demanded by its physical counterpart.
