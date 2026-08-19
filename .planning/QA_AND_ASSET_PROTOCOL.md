# Hardware Collection Production QA & Asset Readiness Protocol

## 1. Architectural Freeze Confirmation
- **Status:** FROZEN.
- **Engines:** Next.js App Router + `motion/react` (UI/Drawers/Transitions) + GSAP `useGSAP()` / `matchMedia()` (Cinematic/Horizontal Journey) + Three.js / R3F (Isolated Product Moment).
- **Core Principle:** One dominant motion idea per viewport; conversion controls remain stable, predictable, and immediately clickable.

---

## 2. Stage A — Runtime QA Matrix

| Viewport / Environment | Dimensions | Expected Motion Behavior | Status / Verification Checklist |
| :--- | :--- | :--- | :--- |
| **Desktop Flagship** | 1440 × 900 | Full editorial hierarchy; GSAP horizontal scroll; 3D Product Moment with demand rendering; Subtle custom cursor | [x] Build verified; [ ] Chrome browser test |
| **Standard Laptop** | 1280 × 720 | Proportional padding; Hero CTAs fully visible above fold; No vertical clipping on pinned sections | [ ] Verified responsive layout |
| **Tablet Portrait** | 768 × 1024 | **NO WebGL**; **NO custom cursor**; **NO horizontal scroll**; Clean vertical editorial cards | [x] Gated by `min-width: 1024px` |
| **Mobile Standard** | 390 × 844 | Touch-optimized vertical stack; Static photographic fallback; Instant tap response; No horizontal overflow | [x] Verified zero horizontal scroll |
| **Reduced Motion** | System setting | `MotionConfig reducedMotion="user"`; No 3D WebGL; Simple opacity transitions; Static layouts | [x] Gated across all 3 engines |
| **WebGL Lifecycle** | 10+ Rapid Scroll Cycles | Memory stable; Canvas unmounts without duplicate RAF loops or GPU leakage | [x] Verified demand loop & R3F disposal |

---

## 3. Stage B — Performance Acceptance Gates

- **LCP (Largest Contentful Paint):** $\le$ 2.5s (Hero image prioritized via `next/image` / preload).
- **CLS (Cumulative Layout Shift):** $\le$ 0.10 (Fixed aspect ratios on all cards and fallback containers).
- **INP (Interaction to Next Paint):** $\le$ 200ms (All filter transitions executed in $\le 0.35$s via `motion/react`).
- **WebGL Chunk Isolation:** Three.js bundle excluded from initial route chunk; loaded on desktop only within 800px viewport margin.

---

## 4. Stage C — Conversion Funnel Verification

Every section terminates with a clear, stable conversion path:

1. **Hero Stage:** Primary CTA $\rightarrow$ `/collections` (Immediate catalogue discovery).
2. **Category Discovery:** Card tap $\rightarrow$ Filtered category in `/collections`.
3. **The Product Moment (3D):** Primary CTA $\rightarrow$ Direct WhatsApp Technical Consultation (`wa.me/919431111550`).
4. **Showroom Experience:** Primary CTA $\rightarrow$ Google Maps Flagship Navigation.
5. **Product Drawer (`CollectionsClient.tsx`):** "Inquire About This Product" $\rightarrow$ Prefilled WhatsApp message with product SKU and brand name.
6. **Floating Final CTA:** Primary CTA $\rightarrow$ Direct WhatsApp Specialist connection.

---

## 5. Stage D — Client Asset Specification Handover

To transition from placeholder geometry to launch-ready digital showroom:

### 1. 3D Asset Requirements (GLB)
- **Object:** Signature Architectural Pull Handle or Mortise Handle.
- **Format:** Binary glTF (`.glb`) compressed with Draco or Meshopt.
- **Polycount:** Under 50,000 polygons with clean normal bevels.
- **Materials:** PVD Satin Brass / Matte Black PBR workflow (Albedo, Metalness, Roughness, Normal). Texture dimensions $\le 2048 \times 2048$.

### 2. High-Resolution Macro Photography (1:1 & 16:9)
- **Shot 1 (Tactile Statement):** Extreme close-up of knurled metal, brushed grain, and chamfered handle edges.
- **Shot 2 (Material Journey):** Five isolated finish plates (Satin Brass, Matte Black, Polished Chrome, Antique Bronze, Satin Stainless).
- **Shot 3 (Showroom Flagship):** Wide architectural interior capture of the 7,500 sq ft Sakchi showroom displays.
