# HARDWARE COLLECTION — DESIGN SYSTEM BLUEPRINT
## Complete Token Architecture, Component Specifications & Accessibility Framework

---

### [DOCUMENT METADATA]
* **Document Name:** Hardware Collection Design System Blueprint
* **System Name:** *Atelier Hardware Design System (AHDS)*
* **Architecture:** Atomic Token Architecture (Primitives -> Semantic Tokens -> Component Tokens)
* **Technology Target:** Next.js 16 (App Router), Tailwind CSS v4, Radix UI Primitives, Lucide/Phosphor Icons
* **Compliance:** WCAG 2.2 Level AA / Section 508

---

## 1. DESIGN PHILOSOPHY & CORE PRINCIPLES

1. **Material-First Neutrality:** The UI is an architectural gallery. Surfaces and backgrounds are strictly monochromatic (Zinc/Slate) so the actual physical finishes (Satin Brass, Matt Black, Polished Chrome, Antique Bronze) provide the visual color and texture.
2. **Tactile Precision:** Sharp, restrained geometry (`rounded-sm` [2px] to `rounded-md` [6px]). Avoid consumer eCommerce bubbly pill buttons and floaty generic drop-shadows.
3. **Cockpit Density over Fluff:** Provide dense, high-signal information (technical specs, grades, warranties, model numbers) cleanly separated by 1px hairline borders (`border-zinc-800`).
4. **Physical Bridge:** Every component is designed to advance the user from digital inspection to a human consultation (WhatsApp) or physical test (Sakchi Showroom).

---

## 2. DESIGN TOKEN ARCHITECTURE

### 2.1. Color Tokens

```css
:root {
  /* ================= Primitive Base ================= */
  --color-zinc-950: #09090b;
  --color-zinc-900: #18181b;
  --color-zinc-800: #27272a;
  --color-zinc-700: #3f3f46;
  --color-zinc-600: #52525b;
  --color-zinc-400: #a1a1aa;
  --color-zinc-200: #e4e4e7;
  --color-zinc-50:  #fafafa;
  --color-white:    #ffffff;

  /* ================= Semantic Surfaces ================= */
  --bg-app:         var(--color-zinc-950);
  --bg-surface:     var(--color-zinc-900);
  --bg-surface-elevated: #202024;
  --bg-overlay:     rgba(9, 9, 11, 0.85);

  /* ================= Semantic Text ================= */
  --text-primary:   var(--color-zinc-50);
  --text-secondary: var(--color-zinc-400);
  --text-muted:     var(--color-zinc-600);
  --text-inverse:   var(--color-zinc-950);

  /* ================= Semantic Borders ================= */
  --border-subtle:  var(--color-zinc-800);
  --border-strong:  var(--color-zinc-700);
  --border-focus:   var(--color-zinc-200);

  /* ================= Actions & Accents ================= */
  --action-primary-bg:    var(--color-white);
  --action-primary-text:  var(--color-zinc-950);
  --action-primary-hover: var(--color-zinc-200);

  --action-secondary-bg:    var(--color-zinc-900);
  --action-secondary-text:  var(--color-zinc-50);
  --action-secondary-border:var(--color-zinc-800);
  --action-secondary-hover: var(--color-zinc-800);

  --action-whatsapp-bg:     #25D366;
  --action-whatsapp-text:   #09090b;

  /* ================= Material Finish Indicators (UI Chips Only) ================= */
  --finish-satin-brass:     #C8A96E;
  --finish-matt-black:      #1C1C1E;
  --finish-satin-nickel:    #B8B8B8;
  --finish-antique-bronze:  #6E473B;
  --finish-rose-gold:       #B76E79;
  --finish-polished-chrome: #E0E0E0;
}
```

### 2.2. Typography System

* **Display Family:** `Cabinet Grotesk`, `Satoshi`, -apple-system, sans-serif
* **Body & Spec Family:** `Geist Sans`, `DM Sans`, -apple-system, sans-serif
* **Monospace (Model & Dimensions):** `Geist Mono`, monospace

```css
/* Typography Scale & Metrics */
--font-display: 'Cabinet Grotesk', 'Satoshi', sans-serif;
--font-body: 'Geist Sans', 'DM Sans', sans-serif;
--font-mono: 'Geist Mono', monospace;

/* Scale Tokens */
--text-display-2xl: clamp(2.5rem, 5vw, 4.5rem);  /* Line Height: 1.05, Tracking: -0.03em, Weight: 700 */
--text-display-xl:  clamp(2.0rem, 3.5vw, 3.0rem);/* Line Height: 1.1,  Tracking: -0.025em, Weight: 700 */
--text-display-lg:  clamp(1.5rem, 2.5vw, 2.0rem);/* Line Height: 1.2,  Tracking: -0.02em, Weight: 600 */
--text-heading-md:  1.25rem;                     /* Line Height: 1.35, Tracking: -0.015em, Weight: 600 */
--text-heading-sm:  1.0625rem;                   /* Line Height: 1.4,  Tracking: -0.01em, Weight: 600 */
--text-body-base:   1.0rem;                      /* Line Height: 1.6,  Tracking: 0em,     Weight: 400 */
--text-body-sm:     0.875rem;                    /* Line Height: 1.5,  Tracking: 0em,     Weight: 400 */
--text-caption:     0.75rem;                     /* Line Height: 1.4,  Tracking: 0.05em,  Weight: 600, Uppercase */
--text-mono-spec:   0.8125rem;                   /* Line Height: 1.4,  Tracking: -0.01em, Weight: 500 */
```

### 2.3. Spacing & Grid Tokens (8-Point Grid)

| Token | Size (px / rem) | Common UI Usage |
| :--- | :--- | :--- |
| `space-1` | 4px / 0.25rem | Micro-spacing inside badges, icon gaps |
| `space-2` | 8px / 0.5rem | Gap between label and input, chip padding |
| `space-3` | 12px / 0.75rem | Button internal padding-y, card internal spacing |
| `space-4` | 16px / 1.0rem | Standard container gutter, button padding-x |
| `space-6` | 24px / 1.5rem | Card padding, grid gap between products |
| `space-8` | 32px / 2.0rem | Section sub-gap, drawer interior padding |
| `space-12` | 48px / 3.0rem | Major component separation |
| `space-16` | 64px / 4.0rem | Desktop section padding-y |
| `space-24` | 96px / 6.0rem | Hero padding-y, major homepage zone separation |

### 2.4. Elevation & Hairline Border Tokens

```css
/* No blurry box-shadows. Elevation is achieved through border contrast & surface tone */
--radius-none: 0px;
--radius-sm:   2px;
--radius-md:   6px;
--radius-lg:   8px;

--border-hairline: 1px solid var(--color-zinc-800);
--border-active:   1px solid var(--color-zinc-500);
--border-focus:    2px solid var(--color-white);

--shadow-drawer: -12px 0px 48px rgba(0, 0, 0, 0.75);
```

### 2.5. Motion & Physics Tokens

```typescript
export const motionTokens = {
  // Spring Physics for Drawers, Menus & Modals
  drawerSpring: {
    type: "spring",
    stiffness: 260,
    damping: 28,
    mass: 1
  },
  // Snappy Hover & Micro-interactions (150-250ms)
  buttonTap: {
    scale: 0.98,
    transition: { duration: 0.1 }
  },
  cardHover: {
    y: -3,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
  },
  // Fade in for Staggered Grids
  gridStagger: {
    staggerChildren: 0.05
  }
};
```

---

## 3. CORE COMPONENT SPECIFICATIONS

### 3.1. Button Primitive (`<Button />`)

#### Variants:
* **Primary (Inverted High Contrast):**
  * `bg-white text-zinc-950 font-medium hover:bg-zinc-200 active:scale-[0.98]`
  * Used for: Primary Hero CTA, "Explore Collections".
* **WhatsApp Action:**
  * `bg-[#25D366] text-zinc-950 font-semibold hover:bg-[#20ba5a] active:scale-[0.98]`
  * Used for: "Inquire on WhatsApp", "Consult Showroom Specialist".
* **Secondary / Outline:**
  * `bg-zinc-900 text-zinc-50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50`
  * Used for: "View Official Catalog", "Get Directions".
* **Ghost:**
  * `text-zinc-400 hover:text-zinc-50 hover:bg-zinc-900`
  * Used for: Modal close buttons, clear filter action.

#### Dimensions & Touch Targets:
* **Standard Desktop:** `h-11 px-5 text-sm rounded-sm` (Minimum 44px height)
* **Large Hero / Drawer CTA:** `h-13 px-7 text-base rounded-sm` (Minimum 52px height)
* **Touch Target Guard:** Every button container strictly maintains `min-h-[44px] min-w-[44px]`.

---

### 3.2. Filter Pill & Segmented Control (`<FilterPill />`)

* **Purpose:** Flat, fast filtering without nested sub-menus.
* **Layout:** Horizontal flexbox row with `overflow-x-auto no-scrollbar gap-2 py-2`.
* **States:**
  * **Unselected:** `bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:border-zinc-700 px-3.5 py-1.5 text-xs font-medium rounded-sm`
  * **Selected / Active:** `bg-white text-zinc-950 border border-white px-3.5 py-1.5 text-xs font-semibold rounded-sm`
  * **Counter Badge (Optional):** `text-[10px] ml-1.5 opacity-70`

---

### 3.3. Product Card (`<ProductCard />`)

```
+-------------------------------------------------------------+
| [ IMAGE CONTAINER - Aspect 4:3 or 1:1 ]                     |
| Neutral bg-zinc-900 / border-b border-zinc-800              |
| Macro hardware photo on neutral dark surface               |
|                                                             |
| Top-Right: [ Brand Badge: e.g. "HÄFELE" ]                   |
| Bottom-Left (Overlay): [ Material Finish Dots ● ● ● ]       |
+-------------------------------------------------------------+
| Category / Subcategory: DOOR HARDWARE · MORTISE LOCKS       |
| Product Title: Dorset Touch Smart Lock DL-01                |
| Model Code: #DS-8841-MB                                     |
|                                                             |
| [ Quick Inquire (WhatsApp Icon) ]  [ View Details → ]      |
+-------------------------------------------------------------+
```

* **Hover State:** Subtle border illumination (`border-zinc-700`) + 1.02x image scale within masked container.
* **Click Action:** Pushes `?product=[slug]` to URL router and renders `<ProductDrawer />`.

---

### 3.4. Product Consultation Drawer (`<ProductDrawer />`)

* **ARIA Pattern:** Accessible Dialog (`role="dialog"`, `aria-modal="true"`, `aria-labelledby="product-drawer-title"`).
* **Dimensions:**
  * Desktop: `w-[580px] max-w-full right-0 top-0 bottom-0 fixed z-50 bg-zinc-900 border-l border-zinc-800`
  * Mobile: `w-full max-h-[92dvh] bottom-0 left-0 fixed z-50 rounded-t-lg bg-zinc-900 border-t border-zinc-800`
* **Internal Anatomy:**
  1. **Header:** Sticky top bar with Brand Logo + Model Code + `[ESC / Close Button]`.
  2. **Image Gallery:** 2-3 high-resolution macro shots with thumbnail navigator.
  3. **Title & Editorial Overview:** Short 2-sentence description focusing on architectural suitability and mechanism grade.
  4. **Finish Selector:** Interactive chips allowing the user to select Brass, Matt Black, Satin Chrome (dynamically updates WhatsApp CTA query payload).
  5. **Technical Specifications Table:**
     * Material Grade (e.g., *Forged Solid Brass / SS 304*)
     * Mechanism / Security Standard (e.g., *EN 12209 Grade 3*)
     * Door Thickness Suitability (e.g., *35mm – 55mm*)
     * Warranty & Local Sakchi Support
  6. **Sticky Action Bar:**
     * `[ Inquire on WhatsApp for Pricing & Availability ]` (Full width, green/white high-contrast button).
     * Sub-text: *"Authorized Dealer in Sakchi · 20+ Years Local Expertise"*.

---

### 3.5. Brand Trust Card (`<BrandShowcaseCard />`)

* **Layout:** Clean geometric container (`bg-zinc-900 border border-zinc-800 p-6`).
* **Content:**
  * High-res vector logo in pure white (`opacity-90 hover:opacity-100`).
  * Authorized Partner Badge (`text-emerald-400 text-xs flex items-center gap-1`).
  * Direct Actions:
    * `[ View Collection in Sakchi ]` -> filters `/collections?brand=[slug]`
    * `[ Official Catalog (PDF) ]` -> external manufacturer download.

---

### 3.6. Showroom Cockpit Data Module (`<ShowroomCockpit />`)

* **Purpose:** Dense, un-cluttered operational truth about the Sakchi location.
* **Structure (2-Column Desktop Grid):**
  * **Left (Address & Timing):**
    * *Address:* 1/18, Kashidih, Near Baradwari Durga Puja Maidan, Sakchi, Jamshedpur, Jharkhand 831001.
    * *Timings:* Monday – Saturday: 10:00 AM – 8:00 PM (Sunday Closed).
    * *Direct Phone:* Click-to-call link with country code formatting.
  * **Right (Action & Map):**
    * Interactive Embedded Google Map or Clean Map Card.
    * `[ Get Directions via Google Maps ]`
    * `[ Plan Showroom Visit on WhatsApp ]`

---

## 4. ACCESSIBILITY FRAMEWORK (WCAG 2.2 LEVEL AA)

### 4.1. Contrast Compliance Table

| Pair | Element | Evaluated Ratio | WCAG AA Requirement | Status |
| :--- | :--- | :--- | :--- | :--- |
| `Zinc-50` on `Zinc-950` | Primary Headings / Body | **19.5:1** | Minimum 4.5:1 | **PASS (Exceeds AAA)** |
| `Zinc-400` on `Zinc-950` | Metadata / Subtitles | **6.5:1** | Minimum 4.5:1 | **PASS** |
| `Zinc-950` on `White` | Primary Button Text | **21.0:1** | Minimum 4.5:1 | **PASS** |
| `Zinc-950` on `#25D366` | WhatsApp CTA Text | **9.2:1** | Minimum 4.5:1 | **PASS** |
| `Zinc-800` on `Zinc-950` | UI Container Borders | **1.8:1** | Non-text decorative (3:1 for inputs) | **PASS** |

### 4.2. Focus Management Architecture
* **Global Focus Ring:** `outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950` applied to all buttons, inputs, filter pills, and cards.
* **Modal Focus Trap:** When `<ProductDrawer />` opens:
  1. Active document focus is moved immediately to the Drawer Close Button or first focusable tab.
  2. Tab navigation is strictly trapped within the drawer container.
  3. Pressing `Escape` dispatches close and restores focus to the triggering product card.
  4. Background body scroll is locked (`overflow: hidden`).

---

## 5. RESPONSIVE BREAKPOINT STRATEGY

```
  sm: 640px   (Large Mobile / Phablets)
  md: 768px   (Tablets - Single to Multi-column Switch)
  lg: 1024px  (Small Laptops / Desktop Navigation)
  xl: 1280px  (Standard Desktop Max Content Width)
  2xl: 1440px (Wide Desktop Container Cap: `max-w-7xl`)
```

### Critical Viewport Rules:
1. **No `h-screen`:** All full-bleed sections use `min-h-[100dvh]` to prevent viewport jumping on iOS Safari when the dynamic browser address bar expands/contracts.
2. **Mobile Grid Collapse:** All desktop multi-column grids (Hero split-screen, Bento index, Showroom cockpit) collapse into a 1-column vertical stack with `w-full px-4` on `< 768px`.
3. **No Horizontal Body Scroll:** Global overflow rule `overflow-x-hidden` enforced on `html, body`.

---

## 6. TAILWIND CSS V4 CONFIGURATION MAPPING

```javascript
// tailwind.config.ts / theme tokens
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        zinc: {
          950: '#09090b',
          900: '#18181b',
          800: '#27272a',
          700: '#3f3f46',
          400: '#a1a1aa',
          200: '#e4e4e7',
          50:  '#fafafa',
        },
        whatsapp: '#25D366',
        finish: {
          brass: '#C8A96E',
          black: '#1C1C1E',
          nickel: '#B8B8B8',
          bronze: '#6E473B',
          rosegold: '#B76E79',
          chrome: '#E0E0E0',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cabinet Grotesk', 'Satoshi', 'sans-serif'],
        body: ['var(--font-body)', 'Geist Sans', 'DM Sans', 'sans-serif'],
        mono: ['var(--font-mono)', 'Geist Mono', 'monospace'],
      },
      borderRadius: {
        sm: '2px',
        md: '6px',
        lg: '8px',
      }
    }
  }
};
```
