# HARDWARE COLLECTION — SAKCHI, JAMSHEDPUR
## Digital Material Showroom: Master UX/UI Strategy & Technical Implementation Blueprint

---

### [RESEARCH STATUS & METRICS]
* **Document Version:** 2.0 (Master Synthesis — Strategic Research + Hostile Review Pass + Technical Blueprint)
* **Target Environment:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Sanity CMS, Vercel
* **Locked Architecture:** 2 Canonical Routes (`/` and `/collections`)
* **Conversion Paradigm:** WhatsApp-First + Physical Sakchi Showroom Visit (Zero eCommerce Cart/Checkout)

---

## 1. EXECUTIVE VERDICT

[RECOMMENDATION]
Hardware Collection Sakchi must NOT be built as an eCommerce catalog or a dark "fashion-luxury" brochure. The core product is a **Digital Material Showroom Interface** designed to bridge digital browsing to physical action.

```
Manufacturer Website (Häfele / Dorset / Godrej)
        ↓
Catalog specs & brand marketing (No local stock, no physical touch in Jamshedpur)

Hardware Collection Digital Showroom
        ↓
1. Discover curated architectural hardware across top brands
2. Compare finishes (Brass, Matt Black, Satin Chrome, Rose Gold)
3. Verify local availability at Sakchi showroom (20+ years authorized dealer)
4. Consult via WhatsApp (Contextual pre-filled spec payload)
5. Visit Sakchi Showroom (Touch, test mechanisms, finalize project orders)
```

**Strategic Value Proposition:** "See it online. Touch, test, and finalize in Sakchi."

---

## 2. MARKET & COMPETITOR BENCHMARKING

[RESEARCH]
Analysis of digital strategies across architectural hardware manufacturers, luxury retailers, and local distributors:

| Brand / Competitor | Core Strength | Critical Weakness | Strategic Action for Hardware Collection |
| :--- | :--- | :--- | :--- |
| **Häfele / Hettich** | Deep engineering specs, functional categorization | Overwhelming PDF catalogs, sterile B2B aesthetic, no local Jamshedpur purchase path | **ADAPT:** Clear functional taxonomy (Door, Kitchen, Wardrobe). **AVOID:** Complex B2B order forms. |
| **Dorset / Godrej** | High brand trust in India, robust mechanical security | Generic consumer marketing, no curated luxury architectural finish comparison | **DIFFERENTIATE:** Showcase Dorset & Godrej alongside luxury architectural hardware in high-end finishes. |
| **Alexander Marchant** | Material-first editorial layout, physical showroom appointments | US-centric pricing, dense desktop-first filters | **COPY:** Macro material photography, "Visit Showroom to Experience Finish" callouts. |
| **FORMANI** | Architectural minimalism, designer collaboration highlights | Heavy European minimalism with slow load times | **ADAPT:** Editorial typography, architectural finish switchers. **AVOID:** Slow WebGL/heavy video. |
| **Local Jamshedpur Competitors** | Physical proximity | Non-existent or broken websites, zero search visibility, unverified dealership claims | **DOMINATE:** Authorized partner verification, fast mobile WhatsApp integration, ranked local SEO. |

---

## 3. DESIGN OPPORTUNITY & STRATEGIC POSITIONING

[INFERENCE]
Why a homeowner or architect in Jamshedpur chooses Hardware Collection over a manufacturer website:

1. **Multi-Brand Curation:** Compare a Häfele sliding system with a Dorset lock and Labacha profile handles in one interface.
2. **Material Reality:** Digital representation of tactile finishes (brushed brass, knurled metal, satin nickel) with direct invitations to feel the weight in person.
3. **Frictionless Local Advisory:** Direct WhatsApp connection with senior showroom staff who know local contractor requirements, site conditions, and inventory.

---

## 4. TARGET PERSONAS & USER JOURNEYS

### Persona 1: The Premium Homeowner (Renovating / Building in Jamshedpur)
* **Psychology:** High design aspiration, fear of making expensive finish mistakes ("Will this gold look cheap in my bathroom?").
* **Journey:**
  1. Lands on `/` via Google Search ("premium door handles Jamshedpur").
  2. Sees local proof ("Authorized Dealer · Sakchi Showroom · 20+ Years").
  3. Explores "Door Hardware" -> Views Mortise Handles.
  4. Clicks "Inquire on WhatsApp" -> Receives guidance & showroom location.
  5. Visits showroom on weekend to test grip and finish.

### Persona 2: The Architect / Interior Designer (Specifying for Projects)
* **Psychology:** Demands technical accuracy, finish consistency, manufacturer authenticity, and rapid bill-of-materials support.
* **Journey:**
  1. Lands directly on `/collections?category=door-hardware&brand=hafele`.
  2. Filters by Finish ("Matt Black") and Subcategory ("Digital Locks").
  3. Opens Product Consultation Drawer to verify dimensions/specs.
  4. Clicks "Project Spec Enquiry" -> Sends WhatsApp BOM query with model names.
  5. Requests site visit or showroom sample viewing.

### Persona 3: The Contractor / Builder
* **Psychology:** Speed, reliability, stock availability, competitive commercial terms.
* **Journey:**
  1. Searches for specific brand/fitting ("Häfele drawer channels Jamshedpur").
  2. Lands on `/collections`.
  3. Taps floating WhatsApp button -> Shares requirement list directly.

---

## 5. LOCKED INFORMATION ARCHITECTURE (2-ROUTE SYSTEM)

[RECOMMENDATION]
The web application is strictly confined to two canonical SSR/ISR routes:

```
├── / (Home: Brand Authority, Sensory Material Intro, Curated Categories, Sakchi Proof)
└── /collections (The Digital Material Index: Deep Filtering, Fast Search, Product Drawer)
```

### URL Query State Schema (All on `/collections`):
* Category Filter: `/collections?category=door-hardware`
* Subcategory Filter: `/collections?category=door-hardware&sub=digital-locks`
* Brand Filter: `/collections?brand=hafele`
* Finish Filter: `/collections?finish=satin-brass`
* Product Detail Drawer (Deep Linkable & SEO Indexed): `/collections?product=dorset-touch-smart-lock-dl-01`
* Search Query: `/collections?q=knurled+brass`

*Legacy URLs (`/brands`, `/about`, `/contact`, `/products`) permanent-redirect (301) to `/` or `/collections` with appropriate query params.*

---

## 6. HOMEPAGE BLUEPRINT (5 CONCISE ZONES)

[RECOMMENDATION]
Eliminated 13-band template bloat. Condensing into 5 high-density, asymmetric architectural zones:

```
+-------------------------------------------------------------------------+
| ZONE 1: ASYMMETRIC HERO                                                 |
| Left: "Architectural Hardware for Considered Spaces."                   |
|       Authorized Dealer: Häfele · Dorset · Godrej · Hettich · Labacha    |
|       [Explore Collections] [Visit Sakchi Showroom]                     |
| Right: Macro architectural photography (Knurled brass & mortise locks)  |
+-------------------------------------------------------------------------+
| ZONE 2: INTENT-DRIVEN HARDWARE INDEX (Bento Grid)                       |
| [1. Door Hardware]   [2. Handles & Knobs]      [3. Kitchen & Wardrobe]  |
| [4. Bathroom Luxury] [5. Furniture Fittings]                            |
+-------------------------------------------------------------------------+
| ZONE 3: MATERIAL & FINISH GALLERY                                       |
| Interactive finish showcase: Brushed Brass | Matt Black | Satin Nickel  |
| "Experience tactile finishes in our Sakchi showroom."                   |
+-------------------------------------------------------------------------+
| ZONE 4: AUTHORIZED BRAND TRUST STRIP                                    |
| Verified dealer badges: Häfele | Dorset | Labacha | Godrej | Hettich    |
| Quick actions: [View Catalog] | [Official Specs]                        |
+-------------------------------------------------------------------------+
| ZONE 5: SAKCHI SHOWROOM & PROJECT DESK (Cockpit Data Layout)             |
| Address: 1/18 Kashidih, Sakchi, Jamshedpur | Hours: Mon-Sat 10am-8pm    |
| [Get Directions on Google Maps] [WhatsApp a Showroom Specialist]        |
+-------------------------------------------------------------------------+
```

---

## 7. COLLECTIONS & PRODUCT EXPERIENCE

### 7.1. Catalog Layout
* **Desktop:** Sticky top filter bar (Category pills + Brand filter dropdown + Finish filter chips) + 3-4 column responsive grid.
* **Mobile:** Horizontal scrollable category chips + Filter modal drawer + 2-column grid.

### 7.2. Product Consultation Drawer (Modal PDP)
* Triggered by clicking any product card.
* **URL Sync:** Updates history state to `?product=<slug>` without full page reload.
* **Content Hierarchy:**
  1. Verified Brand Badge (e.g., "Authorized Häfele Partner")
  2. Product Title & Model Number
  3. Macro Image Carousel (Clean product shot + installed architectural context)
  4. Available Finishes (Visual material chips)
  5. Technical Specifications Table (Material, Grade, Warranty, Dimensions)
  6. **Primary CTA:** `[ Inquire on WhatsApp ]` (Pre-fills specific product & finish query)
  7. **Secondary Action:** `[ View in Sakchi Showroom ]` (Displays showroom hours & map pin)

---

## 8. WHATSAPP CONVERSION SYSTEM

[RECOMMENDATION]
Stateless, context-aware WhatsApp URL generation (`https://wa.me/91XXXXXXXXXX?text=...`).

### Message Templates:

**1. Product Specific:**
```text
Hello Hardware Collection Sakchi,
I am interested in [Product Title] by [Brand] (Model: [ModelNumber]) in [Selected Finish].
Could you confirm availability and advise on project requirements?
Link: https://hardwarecollection.in/collections?product=[slug]
```

**2. Category / BOM Specification (Architects):**
```text
Hello Hardware Collection,
I am specifying hardware for a residential project in Jamshedpur and need technical details / catalog for [Category Name] (e.g. Häfele / Dorset fittings).
```

**3. Showroom Visit Booking:**
```text
Hello Hardware Collection,
I would like to visit your Sakchi showroom to review [Category/Finish] samples in person.
```

---

## 9. DESIGN SYSTEM & TOKENS

### 9.1. Color System (Strict Monochromatic Base + Material Focus)
WCAG 2.2 AA compliant across all states. Crimson & gold reserved purely for micro-accents.

| Token | Hex / Value | Usage | WCAG Ratio |
| :--- | :--- | :--- | :--- |
| `bg-primary` | `#09090b` (Zinc-950) | Main background | 19.5:1 vs Text |
| `bg-surface` | `#18181b` (Zinc-900) | Cards, Modals, Drawers | 14.2:1 vs Text |
| `border-subtle` | `#27272a` (Zinc-800) | 1px clean container dividers | Non-text UI |
| `text-primary` | `#fafafa` (Zinc-50) | Headings, Product Titles | >14:1 |
| `text-muted` | `#a1a1aa` (Zinc-400) | Secondary metadata, specs | 6.5:1 |
| `accent-action` | `#ffffff` (Pure White) | Primary CTA buttons (Inverted) | 21:1 on dark |
| `accent-brand` | `#8B1A4A` (Deep Crimson) | Authorized dealer badge borders | Decorative |
| `accent-gold` | `#C8A96E` (Warm Brass) | Finish indicators only | Micro-indicator |

### 9.2. Typography Scale
* **Display / Headings:** `Cabinet Grotesk` or `Satoshi` (Geometric, Architectural, Heavy)
* **Body / Data:** `Geist Sans` or `DM Sans` (High legibility, tabular numerals)

```css
--font-display: 'Cabinet Grotesk', 'Satoshi', sans-serif;
--font-body: 'Geist Sans', 'DM Sans', -apple-system, sans-serif;

/* Scale */
.text-hero    { font-size: clamp(2.5rem, 5vw, 4.5rem); line-height: 1.05; letter-spacing: -0.03em; font-weight: 700; }
.text-h1      { font-size: clamp(2rem, 3.5vw, 3rem); line-height: 1.1; letter-spacing: -0.02em; font-weight: 700; }
.text-h2      { font-size: clamp(1.5rem, 2.5vw, 2rem); line-height: 1.2; letter-spacing: -0.02em; font-weight: 600; }
.text-h3      { font-size: 1.25rem; line-height: 1.3; font-weight: 600; }
.text-body    { font-size: 1rem; line-height: 1.6; font-weight: 400; }
.text-meta    { font-size: 0.875rem; line-height: 1.4; font-weight: 500; font-family: var(--font-body); }
.text-caption { font-size: 0.75rem; line-height: 1.4; letter-spacing: 0.05em; text-transform: uppercase; font-weight: 600; }
```

### 9.3. Layout & Geometry
* **Containers:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
* **Border Radii:** Restrained geometry (`rounded-sm` [2px] or `rounded-md` [6px]). No pill buttons.
* **Shadows:** Eliminated blurry dropshadows in favor of crisp 1px borders (`border border-zinc-800`).

---

## 10. MOTION & ACCESSIBILITY SPECIFICATIONS

### 10.1. Motion Rules (150-300ms Rule)
* **UI Hover States:** `transition-colors duration-200 ease-out`
* **Product Drawer Slide:** Framer Motion spring physics: `transition: { type: "spring", stiffness: 260, damping: 28 }` (approx. 250ms feel).
* **Reduced Motion:** All transitions fallback to instant opacity swap (`duration: 0.01ms`) under `@media (prefers-reduced-motion: reduce)`.

### 10.2. Accessibility Checklist (WCAG 2.2 AA)
* [x] **Focus Management:** Product Drawer traps focus when open; restores focus to trigger button on `ESC` or close.
* [x] **Touch Targets:** All interactive chips, buttons, and close handles have minimum `44x44px` touch bounding boxes.
* [x] **ARIA Roles:** Drawers use `role="dialog"` and `aria-modal="true"` with `aria-labelledby`.
* [x] **Zero Layout Shift:** Full-screen sections use `min-h-[100dvh]` to prevent mobile URL bar jumpiness.

---

## 11. SANITY CMS SCHEMA BLUEPRINT

```typescript
// Formal Taxonomy & Product Schema Architecture

export const categorySchema = {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (Rule) => Rule.required() },
    { name: 'description', title: 'Editorial Description', type: 'text', rows: 2 },
    { name: 'image', title: 'Hero Material Shot', type: 'image', options: { hotspot: true } },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
};

export const subcategorySchema = {
  name: 'subcategory',
  title: 'Subcategory',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (Rule) => Rule.required() },
    { name: 'category', title: 'Parent Category', type: 'reference', to: [{ type: 'category' }], validation: (Rule) => Rule.required() },
  ],
};

export const brandSchema = {
  name: 'brand',
  title: 'Authorized Brand',
  type: 'document',
  fields: [
    { name: 'name', title: 'Brand Name', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: (Rule) => Rule.required() },
    { name: 'logo', title: 'Vector Logo (SVG/PNG)', type: 'image' },
    { name: 'isAuthorized', title: 'Authorized Partner Status', type: 'boolean', initialValue: true },
    { name: 'officialWebsite', title: 'Manufacturer Official URL', type: 'url' },
    { name: 'catalogPdfUrl', title: 'Official Catalog PDF / URL', type: 'url' },
  ],
};

export const productSchema = {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    { name: 'name', title: 'Product Name', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: (Rule) => Rule.required() },
    { name: 'brand', title: 'Brand', type: 'reference', to: [{ type: 'brand' }], validation: (Rule) => Rule.required() },
    { name: 'category', title: 'Category', type: 'reference', to: [{ type: 'category' }], validation: (Rule) => Rule.required() },
    { name: 'subcategory', title: 'Subcategory', type: 'reference', to: [{ type: 'subcategory' }] },
    { name: 'images', title: 'High-Res Product & Macro Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }], validation: (Rule) => Rule.min(1) },
    { name: 'finishes', title: 'Available Finishes', type: 'array', of: [{ type: 'string' }], options: { list: ['Satin Brass', 'Matt Black', 'Satin Nickel', 'Antique Bronze', 'Polished Chrome', 'Rose Gold'] } },
    { name: 'specifications', title: 'Key Specs', type: 'array', of: [{ type: 'object', fields: [{ name: 'label', type: 'string' }, { name: 'value', type: 'string' }] }] },
    { name: 'featured', title: 'Featured in Digital Showroom', type: 'boolean', initialValue: false },
  ],
};
```

---

## 12. TECHNICAL IMPLEMENTATION PRIORITIES & PHASES

```
[Phase 1: Foundation & Design System]
├── Initialize Tailwind tokens (Zinc-950, Zinc-900, Cabinet Grotesk, Geist)
├── Clean up viewport stability (`min-h-[100dvh]`)
└── Build atomic UI components (Buttons, Chips, Badges, SearchInput)

[Phase 2: Sanity Data Layer & API]
├── Deploy Category, Subcategory, Brand, and Product schemas
├── Seed verified products for Häfele, Dorset, Godrej, Labacha, Hettich, Kich
└── Implement GROQ queries with ISR caching in `src/sanity/queries.ts`

[Phase 3: Core 2-Route Engine & Drawer]
├── Rebuild `/collections` with responsive filter bar (Category, Subcategory, Brand, Finish)
├── Build accessible `ProductDrawer` with URL sync (`?product=<slug>`)
└── Implement context-aware WhatsApp URL generation

[Phase 4: Homepage & Local SEO Polish]
├── Assemble 5-zone asymmetric homepage
├── Inject JSON-LD `LocalBusiness` / `HardwareStore` schema for Sakchi location
└── Run Lighthouse audit (Target: 95+ Performance, 100 Accessibility)
```

---

## 13. DATA ACCURACY AUDIT & COMPLIANCE

* **[STRICT AUDIT RULE] Showroom Area:** The "7,500 sq ft" figure remains completely banned and stripped from all assets until independently verified.
* **[STRICT AUDIT RULE] Authorized Brands:** Only Häfele, Dorset, Labacha, Godrej, Hettich, and Kich may be displayed as authorized partners.
* **[STRICT AUDIT RULE] Pricing:** Zero fabricated prices, discounts, or "Add to Cart" buttons. Every product CTA routes directly to WhatsApp consultation.
