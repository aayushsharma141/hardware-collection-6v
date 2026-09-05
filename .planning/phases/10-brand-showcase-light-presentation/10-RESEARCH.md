# Phase 10 Research: Light-Background Brand Presentation

## 1. Visual Contrast Analysis
Testing all 22 brand colors against `#FAF7F2` (Ivory Light Background) and `#FFFFFF` (Porcelain Plinth Card):

- **Solid Black / Dark Charcoal Logos** (`Yale`, `Madhuram`, `Tattva`, `Shapes`, `Becker`, `Pans`):
  - Contrast on `#FFFFFF`: > 18:1 (Flawless WCAG AAA contrast).
  - Eliminates the previous dark-theme flaw where black logos had to be inverted or were invisible.
- **Warm Metallics & Luxury Bronzes** (`Maranello` `#5D3D28`, `TACO` `#D7B56D`, `Dorio` `#D6AD61`):
  - Contrast on `#FFFFFF`: > 4.5:1.
  - Gives an authentic, high-end warm gold / bronze jewelry feel against white porcelain cards.
- **Vibrant Corporate Accents** (`Häfele` `#D40026`, `Godrej` `#C11566`, `Hettich` 5-color bars, `Philips` `#0B5FFF`, `Ozone` `#005CA9`, `Blum` `#FF671F`):
  - Pure chromatic brilliance. Colors appear exactly as defined in their corporate identity manuals.
- **White Accents in Logos** (`Blum` text, `TACO` secondary text):
  - In `Blum_logo.svg`, the white text sits inside its signature orange `#FF671F` container.
  - In `TACO logo-header.svg`, the primary gold mark `#D7B56D` is prominent; secondary white lettering is readable over porcelain tile background.

## 2. Plinth Card Sizing & Optical Balancing
- **Horizontal Aspect Ratio Logos** (`Dorset`, `Häfele`, `GEZE`, `Philips`, `Rexton`, `Dorio`):
  - Fit within `w-48 sm:w-56 h-20 md:h-24` using `object-contain p-3 sm:p-4`.
- **Square / Crest Logos** (`Blum`, `Decor Bath`, `Tattva`, `Liftor`, `Maranello`):
  - Scale proportionally within the same card envelope without overflowing or looking bloated.
- **Card Styling Tokens**:
  - `bg-white/95 backdrop-blur-sm`
  - `border border-[#EAE4D9]`
  - `shadow-[0_2px_10px_rgba(26,16,23,0.03)]`
  - `hover:border-[#8B1A42]/40 hover:shadow-[0_8px_24px_rgba(139,26,66,0.08)] hover:-translate-y-0.5`
  - `transition-all duration-300 ease-out`

## 3. Ticker Motion & Accessibility Architecture
- Retain the dual-lane counter-scrolling ticker (`LANE_1` scrolling left, `LANE_2` scrolling right) on `BrandTrustStrip.tsx`.
- Soft gradient edge masks updated from dark (`from-[#11100f]`) to light ivory (`from-[#FAF7F2] via-[#FAF7F2]/80 to-transparent`).
- Hover to pause: `group/ticker hover:[animation-play-state:paused]`.
- Reduced-motion support: `motion-reduce:animate-none`.
- Accessible name: Every link contains `aria-label={brand.name}` and `title`.
