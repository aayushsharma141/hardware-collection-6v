# Phase 10 Context: Brand Showcase & Light Roster Presentation

## Objective
Present all 22 authorized architectural hardware brands on the website (`/#brands` and `/collections`) in their authentic original conditions (original corporate shapes, native colors, and high-fidelity transparent formats) on a luxury architectural light/ivory background (`#FAF7F2` / `#FDFBF7`), ensuring maximum visibility and legibility without artificial monochrome/inverted filters.

## Source Assets (Verified & Converted)
All 22 brand assets have been processed and deployed into `public/brands/` and `Hardware Collection/photos/logos/brand-logos/transparent/`:

| Brand | Asset Path | Format | Dimensions | Authentic Brand Colors |
|---|---|---|---|---|
| **Dorio** | `/brands/dorio.svg` | Vector SVG | 117 × 30 | Architectural Metallic Gold (`#D6AD61`) |
| **Decor Bath** | `/brands/decor-bath.webp` | WebP (32-bit alpha) | 381 × 380 | Slate Teal (`rgb(40, 95, 111)`) |
| **Becker** | `/brands/BECKER.png` | PNG (32-bit alpha) | 2151 × 1131 | Charcoal (`#281E1E`) & Blue (`#005096`) |
| **Blum** | `/brands/Blum_logo.svg` | Vector SVG | 100 × 50 | Blum Signature Orange (`#FF671F`) & White |
| **Dorset** | `/brands/dorset-seeklogo.svg` | Vector SVG | 2000 × 538 | Dorset Corporate Red (`#E31E24`) & Black |
| **Furnipart** | `/brands/furnipart-of-denmark-seeklogo.png` | PNG (32-bit alpha) | 2000 × 618 | Danish Navy & Charcoal Crown |
| **GEZE** | `/brands/GEZE_Logo_RGB.png` | PNG (32-bit alpha) | 1134 × 356 | Ochre Yellow & Structural Blue |
| **Godrej** | `/brands/Godrej.svg` | Vector SVG | 398 × 191.73 | Masterbrand Ruby/Magenta Gradient |
| **Häfele** | `/brands/Haefele_Logo.png` | PNG (32-bit alpha) | 4483 × 709 | Häfele Corporate Red (`#D40026`) |
| **Hettich** | `/brands/Hettich.svg` | Vector SVG | 145 × 90.5 mm | 5-Color Accent Bars (`#E30613` to `#1D1D1B`) |
| **LaBacha** | `/brands/labacha_logo.webp` | WebP (32-bit alpha) | 812 × 812 | Italian Granite Magenta (`#BD5EAC`) |
| **Liftor** | `/brands/Liftor.png` | PNG (32-bit alpha) | 872 × 822 | Corporate Blue & Slate Gray |
| **Madhuram** | `/brands/madhuram-logo-black.svg` | Vector SVG | 349.39 × 65.7 | Architectural Solid Black (`#000000`) |
| **Maranello** | `/brands/maranello.svg` | Vector SVG | 325 × 230 | Luxury Bronze (`#5D3D28`) |
| **Ozone** | `/brands/ozone.webp` | WebP (32-bit alpha) | 200 × 65 | Ozone Blue (`#005CA9`) |
| **PANS** | `/brands/PANS.png` | PNG (32-bit alpha) | 2151 × 1131 | Charcoal (`#282828`) & Crimson Red (`#E61E28`) |
| **Philips** | `/brands/philips.png` | PNG (32-bit alpha) | 2000 × 367 | Royal Philips Blue (`#0B5FFF`) |
| **Rexton** | `/brands/rexton-logo.webp` | WebP (32-bit alpha) | 1188 × 421 | Corporate Orange & Gray |
| **Shapes** | `/brands/Shapes_logo_dark-1-768x224.png` | PNG (32-bit alpha) | 768 × 224 | Metallic Charcoal |
| **TACO** | `/brands/TACO logo-header.svg` | Vector SVG | 76.2 × 45.3 mm | Architectural Gold (`#D7B56D`) & White |
| **Tattva** | `/brands/TATTVA.png` | PNG (32-bit alpha) | 1000 × 1000 | Sculptural Jet Black (`#000000`) |
| **Yale** | `/brands/Yale_logo.svg` | Vector SVG | 24 × 24 | Standard Assa Abloy Black (`#000000`) |

## Core Architectural Rules & Decisions
1. **Light Surface (`#FAF7F2`)**: The brands section container must transition from dark `#11100f` to warm ivory `#FAF7F2` with border `#EAE4D9` to match the site's ivory chapters.
2. **Authentic Plinth Cards**: Every logo is enclosed inside an optical plinth (`h-20 md:h-24 w-44 md:w-56 px-6 py-4 rounded-xl bg-white/90 border border-[#E7E0D4] shadow-[0_2px_8px_rgba(0,0,0,0.02)]`).
3. **No Artificial Filters**: No `brightness-0`, no `invert`, and no opacity dimming under 90%. All marks appear in 100% true brand identity.
4. **Canonical Single Source of Truth**: Update `src/content/fallback/brands.ts` with all 22 active brands, slugs, and logo paths.
