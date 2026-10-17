---
name: Hardware Collection
description: A specimen-plate showroom. Hairlines, pill controls and softly rounded cards, warm ink on ivory, one brass/wine index mark.
colors:
  ivory: "#fbf5ea"
  pearl: "#f7f0e2"
  mist: "#ece4d6"
  ink: "#1a1017"
  charcoal: "#3d2e38"
  muted: "#7a6872"
  wine: "#8b1a42"
  wine-deep: "#6b1432"
  brass: "#c8a96e"
  brass-ink: "#85683a"
  obsidian: "#11100f"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
  body:
    fontFamily: "DM Sans, -apple-system, Segoe UI, sans-serif"
  wordmark:
    fontFamily: "Jost, sans-serif"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
rounded:
  none: "0"
  card: "1rem"
  chip: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "32px"
---

# Design System: Hardware Collection

Written 2026-10-12 after the UI audit. It records the contract that Phase 1 put
into `src/app/globals.css`; later phases bring components in line with it.

## Overview

The site is a showroom of finishes and mechanisms, so the interface behaves like a
spec sheet: hairline rules instead of shadows, pill controls and softly rounded cards, warm tonal depth,
and a single "you are here" mark. Product photography carries the colour; the UI
stays quiet around it.

## Colors

Ivory is the page, ink is the text, wine is the action and the active state, brass
is decoration. **Brass is never body text on ivory** (2.07:1). Use `brass-ink`
for brass-coloured text (4.79:1). Wine is not legible on obsidian (1.98:1); on dark
grounds use brass or white.

Neutral black is not used for scrims or shadows. Both are tinted from ink.

## Typography

Cormorant Garamond for display, DM Sans for body and UI, Jost for the wordmark only.
Manrope and Cinzel are no longer loaded (their tokens alias DM Sans and Cormorant). `.hc-mono` is the one exception to the web-font stack: it uses the system monospace stack (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas`) for codes, indices and measurements, so nothing extra is downloaded. Letter-spacing has three
steps: `--track-tight` (-0.01em), `--track-label` (0.14em), `--track-caps` (0.2em).
Floor: 12px for text, 11px for uppercase labels.

## Elevation & Depth

Hairline first (`--border`, `--rule`). The only shadow is `--shadow-float`, offset and
tinted, for UI that genuinely floats (nav, popovers, dialogs). Cards sit flat on a
hairline. No glints, sweeps or glow halos on hover.

## Shapes

Pills for controls, soft cards for structure, per `.agents/rules/anti_ui_slop.md`
(which supersedes the earlier square-corner contract). CTAs, inputs, chips, status
dots and carousel buttons are `rounded-full` (9999px). Cards, dialogs and framed media
are `rounded-2xl` (1rem). Don't mix a square button beside a pill. Dark tool surfaces
such as the catalogue viewer (`.hc-viewer`) stay square. Bare `rounded` is fixed at
0.25rem and is swept out per component.

## Motion

One curve: `--ease-ui` = cubic-bezier(0.23, 1, 0.32, 1). Tailwind's default
transition easing is set to the same curve. Three speeds: `--t-fast` 140ms (press,
colour), `--t-base` 200ms (hover), `--t-slow` 320ms (panels). Nothing in UI is longer.
Press scale is `--press` (0.97). Never `transition: all`.

## Overlays and layers

One scrim, `--scrim` (warm ink at 55%); `--scrim-strong` for full-bleed viewers.
Layers use `--z-*`: raised 10, sticky 40, overlay 50, modal 60, toast 70, top 100.

## Focus and selection

Focus ring is 2px wine, 3px offset, flipping to brass inside `.hc-viewer` and any
`[data-surface="dark"]` ancestor. Text selection is wine with white text.

## Do's and Don'ts

- Do express "active" with one mark: a 2px wine rule. Don't invent a new idiom per component.
- Do gate custom hover behind `@media (hover: hover) and (pointer: fine)`.
- Don't animate `filter` on product photography; it changes the finish colour.
- Don't add a shimmer, sweep or gradient glint for decoration.
- Don't hard-code hex values in components; use the tokens.
- Don't state comparative claims in copy; see PRODUCT.md.
