# Hardware Collection — Use-Case Wireframes & Information Architecture

**Document:** `audit-reports/04_use_case_wireframes.md`  
**Status:** Architectural Specification & Wireframe Blueprint  
**Scope:** Homepage (`/`), Collections Hub (`/collections`), Collection Detail (`/collections/[slug]`), and Catalogs (`/catalogs`)  

---

## 1. Section-by-Section Wireframe Analysis

This section analyzes every major section of the Hardware Collection digital showroom against user intent, business objectives, cognitive load, and interaction affordances.

### 1.1 Fixed Navigation Header (`Navbar.tsx`)
- **User Objective:** Instantly understand where they are, navigate to collections/brands/catalogs, or contact the showroom.
- **Business Objective:** Establish brand prestige ("HARDWARE COLLECTION"), provide immediate phone contact, and drive high-intent visitors to book a consultation.
- **Information Hierarchy:**
  1. Brand Wordmark (Left)
  2. Main Route Links: `COLLECTIONS` · `BRANDS` · `CATALOG` (Center)
  3. Direct Contact: `+91 98351 90738` (Right)
  4. Conversion Action: `BOOK CONSULTATION` (Right Accent Button)
- **Primary Action:** `BOOK CONSULTATION` (Opens consultation modal/flow)
- **Secondary Action:** `CALL +91 98351 90738` / Click `COLLECTIONS`
- **Visual Anchor:** Clean typographic Cormorant Garamond wordmark with subtle gold divider dot.
- **Expected Interaction:** Fixed on scroll with frosted glass backdrop blur (`rgba(255,255,255,0.92)`).
- **Abandonment Risk:** If navbar obscures page content on navigation (as currently happening on `/collections`), user experiences immediate visual distrust.
- **Mobile Adaptation:** Collapses center links and phone number into a clean hamburger icon; opens full-screen slide-over drawer with 48px touch targets for Call, WhatsApp, and Directions.
- **Desktop Adaptation:** Wide horizontal layout with hover underline animations on nav links.

---

### 1.2 Homepage Hero Stage (`HeroStage.tsx` / `MobileHero.tsx`)
- **User Objective:** Immediately understand what Hardware Collection offers and whether it solves their renovation or project need.
- **Business Objective:** Communicate 20+ year legacy, authorized tier-1 partnerships (Häfele, Dorset, etc.), and frame the physical showroom as the ultimate destination.
- **Information Hierarchy:**
  1. Eyebrow: `ARCHITECTURAL HARDWARE EXPERTS SINCE 2002 · SAKCHI`
  2. Headline (H1): `The Art of the Finish.`
  3. Value Proposition Subtitle: `German-engineered fittings, biometric security, and luxury modular kitchen hardware for discriminating spaces.`
  4. Primary Conversion: `EXPLORE COLLECTIONS`
  5. Secondary Conversion: `WHATSAPP THE SHOWROOM` / `VISIT SAKCHI SHOWROOM`
  6. Right-Side Visual: Tactile finish study aperture (Solid Forged Brass, Knurled Satin Gold)
- **Primary Action:** `EXPLORE COLLECTIONS`
- **Secondary Action:** `WHATSAPP THE SHOWROOM`
- **Visual Anchor:** High-resolution architectural photography with subtle depth and tactile material close-up.
- **Expected Interaction:** Autoplay carousel with manual pause/play control and slide pagination indicators.
- **Abandonment Risk:** If the hero feels like an e-commerce website with "Buy Now" prices, luxury buyers bounce; if it feels too abstract, homeowners don't know what is sold.
- **Mobile Adaptation:** Full-height viewport card with one-touch tap to `EXPLORE COLLECTIONS` or `GET SHOWROOM DIRECTIONS`. Scrim balanced to avoid dark-mode dissonance.
- **Desktop Adaptation:** Split editorial layout with left-aligned typographic column and right-aligned interactive finish aperture.

---

### 1.3 Brand Authority Strip (`BrandTrustStrip.tsx`)
- **User Objective:** Verify whether the showroom carries genuine, authorized international and domestic brands.
- **Business Objective:** Overcome counterfeit/grey-market fears and establish exclusive dealership authority in Jamshedpur.
- **Information Hierarchy:**
  1. Section Eyebrow: `AUTHORIZED DEALERSHIPS`
  2. Section Title (H2): `Curated From the World’s Leading Architectural Manufacturers.`
  3. Brand Grid: 23 verified logos (Häfele, Blum, Dorset, Godrej, Hettich, Kich, Labacha, etc.) with country of origin.
- **Primary Action:** Click brand logo to filter `/collections?brand=<slug>` or view catalog.
- **Secondary Action:** View full authorized brand roster.
- **Visual Anchor:** Monochrome to color hover transition on brand marks.
- **Abandonment Risk:** Inert text-only lists that look unverified or suspicious.
- **Mobile Adaptation:** Smooth horizontal swipe ribbon or 3-column logo grid.
- **Desktop Adaptation:** 6-column clean architectural grid with generous whitespace.

---

### 1.4 Curated Spaces & Category Discovery (`CategoryDiscovery.tsx` & `/collections`)
- **User Objective:** Navigate by room/space (Kitchen, Entrance, Wardrobe, Bathroom) without knowing obscure hardware industry jargon.
- **Business Objective:** Funnel homeowners and designers into specific product worlds that lead to live showroom demos.
- **Information Hierarchy:**
  1. Space Cards: Kitchen (Soft-Close & Sinks), Entrance (Biometric & Pull Handles), Wardrobe (Sliding & Organization), Bathroom (Luxury Suites).
  2. Architectural Taxonomy: 5 Core Thresholds (Handles & Knobs, Door Hardware, Bathroom, Kitchen & Wardrobes, Furniture Hardware).
  3. Action affordance: `EXPLORE [SPACE]`
- **Primary Action:** Click space card to open filtered collections.
- **Secondary Action:** Review architectural finish specifications.
- **Visual Anchor:** Evocative interior photography showing hardware installed in real residential settings.
- **Expected Interaction:** Smooth card hover zoom with contrast-safe caption text.
- **Abandonment Risk:** Links turning white on white surfaces (DEF-04); overwhelming user with 50 unorganized hardware categories.
- **Mobile Adaptation:** Vertical accordion stack with tap-to-expand overview and direct collection link.
- **Desktop Adaptation:** Multi-column architectural grid with clean 1px hairline borders.

---

### 1.5 Material & Sensory Journey ("Touch Before You Decide")
- **User Objective:** Appreciate the tactile quality, weight, and finish of architectural metals (PVD Rose Gold, Satin Brass, Matte Black).
- **Business Objective:** Create an irresistible urge to physically touch the hardware in the Sakchi showroom ("The room is the close").
- **Information Hierarchy:**
  1. Chapter Eyebrow: `LIVE DEMONSTRATIONS`
  2. Chapter Title: `Touch Before You Decide.`
  3. Finish Specimens: Satin Steel, Living Brass, Matte Black, Polished Chrome, Oil-Rubbed Bronze.
  4. Showroom Callout: `7,500 SQ FT SHOWROOM · WORKING DEMONSTRATION BAYS`
- **Primary Action:** `GET DIRECTIONS →` (Google Maps link)
- **Secondary Action:** `SCHEDULE SHOWROOM VISIT` (WhatsApp)
- **Visual Anchor:** Macro photography of knurled metal textures and soft-close drawer motion.
- **Expected Interaction:** Interactive finish switcher or horizontal exploration.
- **Abandonment Risk:** Heavy WebGL or laggy scroll hijacking on mobile devices.
- **Mobile Adaptation:** Static swipeable photographic cards with zero horizontal overflow.
- **Desktop Adaptation:** Smooth GSAP-driven horizontal reveal with pinned caption details.

---

### 1.6 Showroom Credibility, Google Reviews & Social Proof
- **User Objective:** See proof of real customer experiences and confirm the showroom's reputation in Jamshedpur.
- **Business Objective:** Validate 10+ years of local trust with verified Google Business Profile ratings (~4.4★, 50+ reviews).
- **Information Hierarchy:**
  1. Section Header: `Verified Customer Experiences`
  2. Rating Badge: `4.4 ★ · 50+ Google Reviews · Sakchi, Jamshedpur`
  3. Customer Review Cards: Verified reviewer quotes highlighting showroom breadth and staff helpfulness.
  4. Action Link: `View on Google Maps ↗`
- **Primary Action:** `View on Maps` (Validates public authenticity)
- **Secondary Action:** Read next review
- **Visual Anchor:** Minimalist quote cards with verified Google badge.
- **Abandonment Risk:** Fake testimonials or blank gaps if CMS reviews are empty.
- **Mobile Adaptation:** Single-column horizontal snap carousel.
- **Desktop Adaptation:** 3-column review card grid with subtle border styling.

---

### 1.7 Direct Consultation Zone & Project Intake (`FloatingCTA.tsx`)
- **User Objective:** Request a quote, ask technical advice, or connect with a specialist without high-pressure sales.
- **Business Objective:** Capture qualified leads (Homeowners vs Architects vs Contractors) and route them to Mukesh Khandelwal's showroom team.
- **Information Hierarchy:**
  1. Eyebrow: `PRIVATE CONSULTATION · SAKCHI, JAMSHEDPUR`
  2. Heading: `Let's discuss your project.`
  3. Trust Metrics: `20+ YEARS IN SAKCHI` · `100% AUTHORIZED SOURCING` · `7,500 SQ FT DISPLAY`
  4. Segmented Role Selector: `[Architect/Designer] [Home Owner] [Builder/Project] [Retailer]`
  5. Intake Fields: Name, Phone Number, Location, Project Type (Modular Kitchen, Full Renovation, Door Security).
  6. Alternative Instant Channels: `WHATSAPP US` · `CALL SHOWROOM` · `OPEN IN MAPS`
- **Primary Action:** `SUBMIT ENQUIRY`
- **Secondary Action:** `WHATSAPP US DIRECTLY`
- **Visual Anchor:** Elegant consultation card with Wine Crimson action button.
- **Expected Interaction:** Inline validation with immediate WhatsApp confirmation option upon submission.
- **Abandonment Risk:** Unreadable grey text on white; asking for unnecessary fields (e.g. budget, PAN).
- **Mobile Adaptation:** Full-width form fields with auto-capitalized inputs and native tel keyboards.
- **Desktop Adaptation:** Two-column layout (Left: Showroom facts & direct WhatsApp/Phone; Right: Structured intake form).

---

### 1.8 Lookbook Product Drawer (`CollectionsClient.tsx`)
- **User Objective:** Inspect a specific hardware piece in detail (finishes, dimensions, features) without losing their place in the catalog.
- **Business Objective:** Convert product curiosity into a context-prefilled WhatsApp inquiry or a showroom test booking.
- **Information Hierarchy:**
  1. Authoritative Badge: `HARDWARE COLLECTION · SAKCHI · AUTHORIZED DEALER`
  2. Brand Wordmark & Product Title (H2)
  3. High-resolution specimen imagery
  4. Verified Specifications Table: Material, Finishes, Durability, Application, Showroom Display Status (`● Live Display in Sakchi`).
  5. Primary Conversion: `WHATSAPP A SPECIALIST` (Prefilled: *"Hi, I'm interested in the [Product] by [Brand]..."*)
  6. Secondary Action: `ADD TO SHORTLIST` (Up to 5 items)
- **Primary Action:** `WHATSAPP A SPECIALIST`
- **Secondary Action:** `ADD TO SHORTLIST`
- **Visual Anchor:** Framed hardware specimen on clean neutral background.
- **Expected Interaction:** Slide-over modal with backdrop blur, `Escape` key close, and keyboard focus trap.
- **Abandonment Risk:** Focus trapped outside drawer; missing close button on mobile; no back-to-catalog affordance.
- **Mobile Adaptation:** Bottom sheet modal with swipe-down-to-dismiss gesture.
- **Desktop Adaptation:** Right-side slide-over panel occupying 480px width.

---

## 2. Text Wireframe: CURRENT Interface

### Current Desktop Wireframe (`/` and `/collections`)

```text
=============================================================================
CURRENT DESKTOP HOMEPAGE WIREFRAME
=============================================================================
┌───────────────────────────────────────────────────────────────────────────┐
│ [LOGO] HARDWARE COLLECTION   COLLECTIONS  BRANDS  CATALOG   +91 98351...  │ [INQUIRE] (Generic CTA)
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   ARCHITECTURAL HARDWARE EXPERTS SINCE 2002                               │
│   The Art of the Finish.                      ┌───────────────────────┐   │
│   Premium architectural hardware and modular  │ [HERO APERTURE]       │   │
│   solutions, curated for contemporary spaces. │ Finish Study 01/03    │   │
│                                               │ Knurled Satin Gold    │   │
│   [EXPLORE COLLECTIONS]  [WHATSAPP SHOWROOM]  └───────────────────────┘   │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ AUTHORIZED BRANDS (23 Brand Logos: Häfele, Dorset, Blum, Godrej, etc.)    │
├───────────────────────────────────────────────────────────────────────────┤
│ SHOWROOM FAMILIES / 05 — Five Thresholds                                  │
│ [Handles & Knobs] [Door Hardware] [Bathroom] [Kitchen] [Furniture Hardw.] │
│ (Issue: Link hovers turn text white on white surface!)                    │
├───────────────────────────────────────────────────────────────────────────┤
│ THE FINISH — Material Journey (Horizontal Scroll)                         │
│ [01 Satin Steel] [02 Living Brass] [03 Matte Black] [04 Chrome] [05 Bronz]│
├───────────────────────────────────────────────────────────────────────────┤
│ SELECTED HARDWARE — Flagship Specimen Reel                                │
│ [Häfele Pull] [Dorset Mortice] [Godrej Biometric] [Hettich Channel] ...   │
├───────────────────────────────────────────────────────────────────────────┤
│ FLAGSHIP SHOWROOM SAKCHI — Touch Before You Decide                        │
│ 7,500 sq ft display · Working demonstration bays · Live lock testing      │
│ [GET DIRECTIONS →]  [WHATSAPP →]                                          │
├───────────────────────────────────────────────────────────────────────────┤
│ OUR LEGACY — Hardware that completes the space                            │
│ 10+ Years · Authorized Sourcing · Showroom Photos                         │
├───────────────────────────────────────────────────────────────────────────┤
│ VERIFIED REVIEWS — What Our Clients Say                                   │
│ 4.4 ★ (50+ Google Reviews)                                                │
│ [md maaz: "Wide range..."] [Vikash Kumar: "Best store..."] [Pankaj: "..."]│
├───────────────────────────────────────────────────────────────────────────┤
│ PRIVATE CONSULTATION · SAKCHI, JAMSHEDPUR                                 │
│ Tell us what you're working on...                                         │
│ (Issue: text-zinc-300 contrast failure on pearl background!)              │
│ [Role Radios: Architect / Homeowner / Builder] [Name] [Phone] [Submit]    │
├───────────────────────────────────────────────────────────────────────────┤
│ FOOTER — Full NAP: 1/18 Kashidih, Sakchi · Hours · WhatsApp · Legal       │
└───────────────────────────────────────────────────────────────────────────┘
```

```text
=============================================================================
CURRENT DESKTOP COLLECTIONS WIREFRAME (`/collections`)
=============================================================================
┌───────────────────────────────────────────────────────────────────────────┐
│ [FIXED NAVBAR]                                                            │
├───────────────────────────────────────────────────────────────────────────┤
│ (CRITICAL DEFECT: Hero title is clipped under the fixed navbar!)          │
│                       THE COLLECTION                                      │
│     Explore Jamshedpur's finest curated architectural hardware...         │
│     [EXPLORE COLLECTIONS]      [ASK OUR HARDWARE EXPERT]                  │
│                                                                           │
│            [ SEARCH: "Search collections, products and brands" ]          │
├───────────────────────────────────────────────────────────────────────────┤
│ CURATED SPACES — Explore by Architectural Space                           │
│ [Kitchen]  [Entrance]  [Wardrobe]  [Bathroom]  [Living]  [Commercial]     │
├───────────────────────────────────────────────────────────────────────────┤
│ CURATED SPOTLIGHT — Featured Chapters                                     │
│ Chapter 01: Digital Locks                                                 │
│ Chapter 02: Cabinet & Drawer Hardware                                     │
│ Chapter 03: Modular Kitchen Systems                                       │
│ Chapter 04: Luxury Bathroom Fittings                                      │
│ Chapter 05: Wardrobe & Sliding Systems                                    │
│ (Issue: No max-w constraint on 2133px displays — cards stretch excessively)│
├───────────────────────────────────────────────────────────────────────────┤
│ CATALOGUE SPECTRUM — All Architectural Hardware Collections (13 Cards)    │
│ [Mortise Locks] [Door Handles] [Kitchen Fittings] [Drawer Channels] ...   │
├───────────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                                    │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Target Information Architecture & Text Wireframe

The target interface maintains the approved 2-route architecture (`/` and `/collections` + `/catalogs`), eliminates layout clipping and accessibility violations, refines copy from generic templates to authoritative luxury terminology, and organizes the user journey into high-conversion chapters.

### Target Desktop Information Architecture

```text
Navbar (Sticky, transparent to ivory blur, "BOOK CONSULTATION" primary CTA)
  ↓
Hero Stage (Balanced editorial split, "7,500 SQ FT SAKCHI SHOWROOM" badge, dual CTAs)
  ↓
Authorized Brand Authority (23 official brand logos + "Authorized Dealership in Jamshedpur")
  ↓
Curated Spaces & Five Thresholds (Kitchen, Entrance, Wardrobe, Bathroom, Furniture)
  ↓
Material Sensory Journey ("Touch Before You Decide" — 5 Tactile Finish Studies)
  ↓
Curated Hardware Specimens (Selected pieces with direct WhatsApp inquiry triggers)
  ↓
Physical Showroom Experience (Sakchi location proof, working demo bays, live hours)
  ↓
Verified Google Social Proof (4.4★ aggregate, verified local customer quotes)
  ↓
Project Consultation Intake (Segmented persona tabs: Architect, Homeowner, Builder)
  ↓
Showroom Footer (Full verified NAP, direct WhatsApp, Google Maps driving link)
```

### Target Desktop Wireframe

```text
=============================================================================
TARGET DESKTOP WIREFRAME (`/`)
=============================================================================
┌───────────────────────────────────────────────────────────────────────────┐
│ [HC MONOGRAM] HARDWARE COLLECTION    COLLECTIONS  BRANDS  CATALOG  +91 98351.. │ [BOOK CONSULTATION]
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   7,500 SQ FT FLAGSHIP SHOWROOM · SAKCHI, JAMSHEDPUR                      │
│   The Jewelry of Fittings.                                                │
│   Experience live biometric lock demos, German soft-close kitchens,       │
│   and bespoke architectural brassware from Häfele, Dorset, and Blum.      │
│                                                                           │
│   [EXPLORE COLLECTIONS]      [SCHEDULE SHOWROOM VISIT]                    │
│                                                                           │
│   ┌───────────────────────────────────────────────────────────────────┐   │
│   │ HERO SPECIMEN APERTURE                                            │   │
│   │ Solid Forged Brass Pull Handle · PVD Satin Gold                   │   │
│   │ [● Live Display in Sakchi Showroom]  [Ask Specialist on WhatsApp] │   │
│   └───────────────────────────────────────────────────────────────────┘   │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ AUTHORIZED PARTNERSHIPS                                                   │
│ "Official Dealerships for 20+ Global Architectural Hardware Brands"       │
│ [Häfele] [Blum] [Dorset] [Godrej] [Hettich] [Kich] [Labacha] [Yale] ...   │
├───────────────────────────────────────────────────────────────────────────┤
│ EXPLORE BY ARCHITECTURAL SPACE                                            │
│ Non-technical homeowner onboarding into curated room worlds:              │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐   │
│ │   ENTRANCE    │ │    KITCHEN    │ │   WARDROBE    │ │   BATHROOM    │   │
│ │ Biometric     │ │ Soft-Close    │ │ Silent        │ │ Luxury        │   │
│ │ Deadbolts &   │ │ Tandems &     │ │ Sliding &     │ │ Shower Suites │   │
│ │ Brass Pulls   │ │ Quartz Sinks  │ │ Organizers    │ │ & SS Fixtures │   │
│ │ [Explore →]   │ │ [Explore →]   │ │ [Explore →]   │ │ [Explore →]   │   │
│ └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘   │
├───────────────────────────────────────────────────────────────────────────┤
│ TACTILE FINISH STUDY — "Touch Before You Decide"                          │
│ Highlighting Jamshedpur humidity resistance & architectural durability:   │
│ [Satin Stainless 304]  [Living Antique Brass]  [Architectural Matte Black]│
│ [PVD Rose Gold]        [Brushed Champagne]                                │
├───────────────────────────────────────────────────────────────────────────┤
│ SAKCHI FLAGSHIP SHOWROOM — 1/18 Kashidih                                  │
│ "Hardware you can feel before committing to a drawing or renovation."     │
│ Working kitchen bays · Live lock testing · Open Mon-Sun 10 AM – 8 PM      │
│ [GET DRIVING DIRECTIONS ↗]             [WHATSAPP SHOWROOM TEAM ↗]         │
├───────────────────────────────────────────────────────────────────────────┤
│ VERIFIED SOCIAL PROOF                                                     │
│ 4.4 ★ on Google Business Profile · 50+ Verified Local Homeowners & Pros   │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌─────────────────────┐ │
│ │ "Wide range under    │ │ "Best interior       │ │ "Unique collection  │ │
│ │ one roof..."         │ │ hardware in city..." │ │ with best advice..."│ │
│ │ — Md Maaz            │ │ — Vikash Kumar       │ │ — Pankaj Bagla      │ │
│ └──────────────────────┘ └──────────────────────┘ └─────────────────────┘ │
├───────────────────────────────────────────────────────────────────────────┤
│ PRIVATE PROJECT CONSULTATION                                              │
│ ┌───────────────────────────────────┬───────────────────────────────────┐ │
│ │ DIRECT CONSULTATION               │ INTAKE SPECIFICATION              │ │
│ │ • 20+ Years in Sakchi             │ I AM A: [Architect] [Homeowner]   │ │
│ │ • 100% Genuine Authorized Stock   │ Name: [_________________________] │ │
│ │ • CAD Schedule Reading            │ Phone: [________________________] │ │
│ │ Call: +91 98351 90738             │ Project: [Modular Kitchen     ▼]  │ │
│ │ WhatsApp: 919835190738            │ [SUBMIT CONSULTATION REQUEST]     │ │
│ └───────────────────────────────────┴───────────────────────────────────┘ │
├───────────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                                    │
│ Verified NAP: 1/18 Kashidih, Sakchi · Hours · Collections · Legal Links   │
└───────────────────────────────────────────────────────────────────────────┘
```

---

### Target Mobile Wireframe (375×667 / 390×844)

```text
=============================================================================
TARGET MOBILE WIREFRAME (`/`)
=============================================================================
┌─────────────────────────────────────────┐
│ [HC] HARDWARE COLLECTION          [ ☰ ] │
├─────────────────────────────────────────┤
│                                         │
│ 7,500 SQ FT SHOWROOM · SAKCHI           │
│ The Jewelry of Fittings.                │
│ Premium architectural hardware, digital │
│ locks & modular kitchens in Jamshedpur. │
│                                         │
│ [ EXPLORE COLLECTIONS ]                 │
│ [ GET SHOWROOM DIRECTIONS ]             │
│                                         │
├─────────────────────────────────────────┤
│ AUTHORIZED BRANDS (Swipeable Ribbon)    │
│ [Häfele]  [Dorset]  [Blum]  [Godrej]    │
├─────────────────────────────────────────┤
│ EXPLORE BY SPACE (Vertical Cards)       │
│ ┌─────────────────────────────────────┐ │
│ │ [IMG] ENTRANCE                      │ │
│ │ Digital locks & grand brass pulls   │ │
│ │ Explore Entrance →                  │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ [IMG] KITCHEN                       │ │
│ │ Soft-close systems & quartz sinks   │ │
│ │ Explore Kitchen →                   │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ SHOWROOM PROOF                          │
│ "Touch Before You Decide"               │
│ 1/18 Kashidih, Sakchi (Near Durga Puja) │
│ Open 10:00 AM – 8:00 PM Daily           │
├─────────────────────────────────────────┤
│ VERIFIED REVIEWS                        │
│ 4.4 ★ (50+ Google Reviews)              │
│ "Huge and unique collection..."         │
├─────────────────────────────────────────┤
│ QUICK CONSULTATION                      │
│ Name:  [_____________________________]  │
│ Phone: [_____________________________]  │
│ [ REQUEST WHATSAPP CONSULTATION ]       │
├─────────────────────────────────────────┤
│ FOOTER & LEGAL                          │
│ Sakchi, Jamshedpur · +91 98351 90738    │
├─────────────────────────────────────────┤
│ [FIXED BOTTOM CONVERSION BAR - 48px min]│
│ [ 📞 CALL ]   [ 💬 WHATSAPP ]   [ 📍 VISIT ]
└─────────────────────────────────────────┘
```

---

## 4. Interaction & Transition Specifications

1. **Top Header Overlap Prevention:**
   - On `/collections`, the hero wrapper must specify `pt-28 lg:pt-32` padding so that the main `<h1>THE COLLECTION</h1>` title has a minimum 32px breathing room beneath the fixed navigation bar on all desktop resolutions.
2. **Lookbook Drawer Accessible Keyboard Trapping:**
   - Opening the drawer via `?product=<slug>` locks background body scroll and moves DOM focus to the drawer’s first focusable element (`Close` button).
   - `Tab` and `Shift+Tab` cycles exclusively within the drawer boundary.
   - Hitting `Escape` closes the drawer and restores DOM focus to the originating card button.
3. **Selection Tray vs Floating WhatsApp Offset:**
   - When items exist in the temporary shortlist (`selection.length > 0`), the bottom selection pill sits at `bottom-4 md:bottom-6`. The floating WhatsApp capsule dynamically offsets upward to `bottom-24` or collapses into a compact status icon to prevent UI collision.
4. **Collection Slug Pages Full Footer Integration:**
   - `/collections/[slug]` dynamically renders `<Footer />` at the bottom of the page, ensuring users who land via Google Search have instant access to showroom hours, phone numbers, and driving directions.
