# UI Mathematical Precision Rules

When implementing any frontend UI, styling, layout, or Tailwind classes in this project, strictly adhere to these 7 mathematical formulas:

## 1. Nested Corner Radius Formula
$$\text{Inner Radius} = \text{Outer Radius} - \text{Padding}$$
* **Rule:** Nested child containers must follow the curvature of their parent container rather than repeating the same border radius.
* **Example:** If a card has `rounded-[24px]` and `p-[8px]`, the inner image or container MUST be `rounded-[16px]`.

## 2. Optical Alignment
* **Rule:** Elements with asymmetric visual mass (play buttons, arrow chevrons, triangular badges) must be optically balanced rather than strictly mathematically centered. Always adjust alignment based on perceptual weight.

## 3. Harmonic Spacing Scale (8pt / 4pt Rhythm)
* **Rule:** All padding, margins, gaps, widths, and heights MUST strictly be multiples of `4px` or `8px` (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`).
* **Enforcement:** Never use arbitrary pixel classes (e.g., `p-[17px]`, `gap-[13px]`).

## 4. Color Contrast Ratios (WCAG 2.2 AA)
$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$
* **Text / Headings:** Minimum **4.5:1** contrast ratio against the background.
* **UI Components & Icons:** Minimum **3.0:1** contrast ratio.
* **Enforcement:** Unreadable low-contrast text is strictly forbidden.

## 5. Vertical Rhythm & Line Height
$$\text{Line Height} = \text{Font Size} \times (1.4 \text{ to } 1.6)$$
* **Body / Subheadings:** Maintain a `1.4`–`1.6` multiplier (`leading-relaxed` or `leading-normal`) for effortless reading.
* **Display / Hero Headings:** Tighten to `1.05`–`1.2` multiplier (`leading-none` or `leading-tight`) to avoid loose headline breaks.

## 6. Touch Target Sizing (44px Minimum)
* **Rule:** All interactive touch elements (buttons, filter chips, drawer handles, close icons) MUST have a minimum bounding box of **$44 \times 44\text{px}$** (Apple iOS HIG) or **$48 \times 48\text{dp}$** (Material Design).
* **Enforcement:** Add padding or transparent bounding containers if the visual icon is smaller than 44px.

## 7. Modular Font Size Scale (1.25x Ratio)
$$\text{Next Size} = \text{Current Size} \times 1.25 \text{ (rounded to nearest multiple of 4)}$$
* **Body:** `16px` (Base)
* **Subheading:** $16 \times 1.25 = 20\text{px}$
* **Heading:** $20 \times 1.25 = 25\text{px} \rightarrow 24\text{px}$ or $28\text{px}$
* **Display:** $25 \times 1.25 = 31.25\text{px} \rightarrow 32\text{px}$
* **Hero Display:** $32 \times 1.25 = 40\text{px}$ / $48\text{px}$
