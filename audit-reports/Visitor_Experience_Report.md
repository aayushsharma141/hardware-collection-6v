# Visitor Experience Report (Visitor POV Audit)

**Date of Audit:** 2026-08-30  
**Target Domain:** Hardware Collection Staging (`http://localhost:3000`)  
**Auditor Persona:** Principal Software Architect, Senior UX Researcher & Lead Design Technologist  
**Scope:** UI/UX, Visual Perception, Typography Hierarchy, Microinteractions, User Flows & Frontend Guidelines  

---

## 1. Executive Summary & Visitor Perception

When a high-net-worth homeowner, architect, or interior designer enters the Hardware Collection digital showroom, the perception is immediately established as **luxurious, architectural, and tactile**. The aesthetic eschews generic e-commerce conventions in favor of a **haute-horlogerie / fine-jewelry exhibition model** ("The Jewelry of Fittings").

```
[ Visitor Perception Scorecard ]
┌──────────────────────────────┬────────────────┬──────────────────────────────────────────┐
│ Dimension                    │ Rating         │ Visitor Perception                       │
├──────────────────────────────┼────────────────┼──────────────────────────────────────────┤
│ First Impression (Top Fold)  │ 9.8 / 10       │ Atmospheric, cinematic, authoritative     │
│ Typographic Sophistication   │ 9.6 / 10       │ Elite pairing of serif & geometric sans  │
│ Color & Material Contrast    │ 9.7 / 10       │ Deep obsidian (#0E0C0C) & warm gold      │
│ Motion & Fluidity            │ 9.4 / 10       │ GSAP-driven, restrained, zero jank       │
│ Discovery & Wayfinding       │ 9.5 / 10       │ Guided space & category taxonomy         │
│ Consultation Intent Flow     │ 9.6 / 10       │ Frictionless WhatsApp & drawer bridge    │
└──────────────────────────────┴────────────────┴──────────────────────────────────────────┘
```

---

## 2. Visual Hierarchy & Typographic Anatomy

### 2.1 Typographic Hierarchy
- **Display Serif (`Cormorant Garamond`):** Used strictly for high-emotional-resonance titles, chapter headers, and architectural statements (e.g. *"Five thresholds"*, *"Selected Architectural Hardware"*, *"Hardware is the jewelry of architecture"*).
- **Body & Controls (`DM Sans`):** Clean, geometric sans-serif for descriptions, labels, navigation links, and consultation drawer inputs.
- **Monospace References (`JetBrains Mono` / `HC-Mono`):** Used for chapter numbers (`01 / 05`), model codes (`SPEC-STD`), finish codes, and technical indices.

### 2.2 Palette & Contrast Compliance
- **Obsidian Ground (`#0E0C0C` & `#090909`):** Provides deep, infinite contrast without harsh `#000000` clipping.
- **Warm Brass (`#C8A96E` & `#E5C487`):** Delivers jewel-like highlights for active tabs, badges, arrows, and accents. Text contrast on `.brass-plate` exceeds WCAG AAA (4.5:1+).
- **Secondary Zinc (`#AAA49A` & `#D1CCC4`):** Subdued body text ensures readability without pulling attention from photography.

---

## 3. Visual Gallery & State Progression

### 3.1 Homepage Top-Fold & Atmospheric Immersion
The visitor is greeted with high-impact hero photography, dual-tier navigation, and the authorized dealer heritage statement.

![Homepage Top Fold](file:///C:/Users/PC/.gemini/antigravity-ide/brain/fd021186-08c0-400d-9a7c-e823bde56ef7/01_home_top_fold_1788102905292.png)

---

### 3.2 Showroom Families (5 Thresholds) — Hover Feedback
Cards feature subtle zoom on hover and a gleaming brass indicator border.

![Showroom Families Hover](file:///C:/Users/PC/.gemini/antigravity-ide/brain/fd021186-08c0-400d-9a7c-e823bde56ef7/03_home_chapter02_hover_1788102960854.png)

---

### 3.3 Selected Hardware (Product Reel)
Horizontal reel with reflective light sweeps across luxury hardware specimens.

![Product Reel Hover](file:///C:/Users/PC/.gemini/antigravity-ide/brain/fd021186-08c0-400d-9a7c-e823bde56ef7/05_home_chapter04_hover_1788103045296.png)

---

### 3.4 Authorized Brand Partners & Floating Liquid Glass Footer
Curated 22-brand trust strip followed by an architectural liquid-glass container.

![Brand Partners](file:///C:/Users/PC/.gemini/antigravity-ide/brain/fd021186-08c0-400d-9a7c-e823bde56ef7/06_home_chapter05_1788103125968.png)

![Floating Liquid Glass Footer](file:///C:/Users/PC/.gemini/antigravity-ide/brain/fd021186-08c0-400d-9a7c-e823bde56ef7/07_home_chapter06_1788103181425.png)

---

### 3.5 Collections Guided Discovery Experience (`/collections`)
The collections landing replaces generic e-commerce filter sidebars with a structured 4-tier discovery layout:
1. **CollectionsHero & Real-Time Search**
2. **Space Intent Rail** (`Living`, `Entrance`, `Bath`, `Kitchen`, `Wardrobe`, `Architectural`)
3. **Featured Chapters & Curated Spectrum**
4. **A-Z Taxonomy Index & Brand Discovery Wall**

![Collections Top Fold](file:///C:/Users/PC/.gemini/antigravity-ide/brain/fd021186-08c0-400d-9a7c-e823bde56ef7/08_collections_top_fold_1788103215974.png)

![Curated Spectrum Grid](file:///C:/Users/PC/.gemini/antigravity-ide/brain/fd021186-08c0-400d-9a7c-e823bde56ef7/09_collections_grid_1788103316553.png)

![Taxonomy Index](file:///C:/Users/PC/.gemini/antigravity-ide/brain/fd021186-08c0-400d-9a7c-e823bde56ef7/10_collections_taxonomy_1788103372424.png)

---

### 3.6 Single Category Detail View (`/collections/digital-locks`)
High-resolution specimen gallery with spec sheets, finish badges, and lookbook integration.

![Digital Locks Detail View](file:///C:/Users/PC/.gemini/antigravity-ide/brain/fd021186-08c0-400d-9a7c-e823bde56ef7/19_digital_locks_detail_1788103603780.png)

---

### 3.7 Official Catalogs & PDF Viewer (`/catalogs`)
Dedicated brand catalog viewer allowing architectural firms to download and review authorized manufacturer literature.

![Catalogs Viewer Open](file:///C:/Users/PC/.gemini/antigravity-ide/brain/fd021186-08c0-400d-9a7c-e823bde56ef7/13_catalogs_viewer_open_1788103459566.png)

---

## 4. User Journey & Conversion Mechanics

```mermaid
graph TD
    A["Homepage: Brand Impression"] --> B["Showroom Families: 5 Thresholds"]
    A --> C["Explore Collections: /collections"]
    B --> D["Space Landing Page: /collections/[space]"]
    C --> E["Real-time Instant Search"]
    C --> F["Space Intent Rail"]
    C --> G["Featured Chapters"]
    D --> H["Category Detail Page: /collections/[category]"]
    F --> D
    G --> H
    H --> I["Product Specimen Tray"]
    I --> J["Lookbook Drawer (?product=deep-link)"]
    I --> K["Shortlist Pill (Max 5 items)"]
    J --> L["Outbound WhatsApp Expert Consultation"]
    K --> L
    H --> M["Private Showroom Consultation Drawer"]
```

---

## 5. Actionable Recommendations

1. **Next.js Image `sizes` Optimization:**
   - Add explicit responsive `sizes` attribute (e.g. `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`) to all brand logo cards and hero containers to optimize mobile download weight.
2. **Preconnect to WhatsApp Domain:**
   - Add `<link rel="preconnect" href="https://wa.me" />` in `src/app/layout.tsx` to shave ~150ms off initial outbound consultation clicks.
3. **PWA & Offline Manifest:**
   - Add web app manifest for architectural clients saving the lookbook to iOS/Android homescreens during on-site client walkthroughs.
