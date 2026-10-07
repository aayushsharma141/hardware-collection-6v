# 001 — Replace transition-all and sluggish timings

- **Status**: TODO
- **Commit**: 3f1d1d5
- **Severity**: HIGH
- **Category**: Performance & Easing/Duration
- **Estimated scope**: 4 files, small size

## Problem

Multiple core UI components and CSS utilities are using `transition-all`, which creates silent bugs when future classes are added (animating accidental properties like `box-shadow` or `width` on the main thread). Furthermore, many UI interactions (like hover and press) are using `duration-300` (300ms) or `duration-200` which makes the interface feel sluggish. 

Timing bands should be strictly enforced:
- **Press and hover feedback**: 100–150ms.
- **Small state changes**: 180–250ms.

```tsx
/* src/components/ui/button.tsx:7 — current */
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
```

```tsx
/* src/components/ui/FloatingActionButtons.tsx:12 — current */
        className="w-12 h-12 rounded-none flex items-center justify-center bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200"
```

```css
/* src/app/globals.css:231 — current */
  .transition-premium {
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
```

```tsx
/* src/components/collections/BrandDiscovery.tsx:173 — current */
                className="relative flex items-center justify-center shrink-0 h-20 md:h-24 w-44 md:w-56 px-6 py-4 rounded-none bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/40 focus-visible:border-[var(--accent)] transition-all duration-300 group/cell cursor-pointer"
```

## Target

```tsx
/* src/components/ui/button.tsx */
/* Use: transition-colors duration-150 instead of transition-all, and add active:scale-[0.97] */
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,background-color,border-color,text-decoration-color,fill,stroke,transform] duration-150 active:scale-[0.97] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
```

```tsx
/* src/components/ui/FloatingActionButtons.tsx */
        className="w-12 h-12 rounded-none flex items-center justify-center bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] shadow-sm hover:shadow-md active:scale-[0.97] transition-[color,background-color,border-color,transform,box-shadow] duration-150 ease-out"
```

```css
/* src/app/globals.css */
/* Define the custom curve at the top level or inside @theme inline */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);

/* Later in the file: */
  .transition-premium {
    transition: transform 200ms var(--ease-out), opacity 200ms var(--ease-out), background-color 200ms var(--ease-out), border-color 200ms var(--ease-out), color 200ms var(--ease-out);
  }
```

```tsx
/* src/components/collections/BrandDiscovery.tsx */
/* Add active:scale-[0.97] for responsive press, and ensure transform is in the transition list.
Note: verified that this element only animates border on hover natively; the image inside it handles its own scale. Adding transform allows our new active state to work. */
                className="relative flex items-center justify-center shrink-0 h-20 md:h-24 w-44 md:w-56 px-6 py-4 rounded-none bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)]/40 focus-visible:border-[var(--accent)] transition-[border-color,transform] duration-150 ease-out active:scale-[0.97] group/cell cursor-pointer"
```

## Repo conventions to follow

- Tailwind utility classes are preferred for simple transitions (`transition-[...] duration-150`).
- Use `ease-out` for UI hover/interaction transitions, mapping to our strict custom `cubic-bezier`.
- Global CSS should list explicit properties rather than `all`.
- Buttons must scale on press (`active:scale-[0.97]`) to feel responsive.

## Steps

1. In `src/components/ui/button.tsx`, replace `transition-all` with `transition-[color,background-color,border-color,text-decoration-color,fill,stroke,transform] duration-150 active:scale-[0.97]`.
2. In `src/components/ui/FloatingActionButtons.tsx`, replace `transition-all duration-200 active:scale-[0.98]` with `transition-[color,background-color,border-color,transform,box-shadow] duration-150 ease-out active:scale-[0.97]` on both buttons.
3. In `src/app/globals.css`, add `--ease-out: cubic-bezier(0.23, 1, 0.32, 1);` to the `@theme inline` block if not already there, and replace `.transition-premium { transition: all 0.3s ... }` with explicit properties and 200ms duration using `var(--ease-out)`.
4. In `src/components/collections/BrandDiscovery.tsx`, replace `transition-all duration-300` on the brand alphabetical buttons with `transition-[border-color,transform] duration-150 ease-out active:scale-[0.97]`.

## Boundaries

- Do NOT touch other components.
- Do NOT change markup/structure.
- If a step doesn't match the code you find, STOP and report instead of improvising.

## Verification

- **Mechanical**: Run `npm run build` to verify Tailwind compiles successfully with the arbitrary values.
- **Feel check**: run the UI, hover and press the Floating Action Buttons, standard Buttons, and Brand Cards.
  - Button presses should feel snappy and responsive immediately upon interaction (scaling to 0.97).
  - Hover colors should blend smoothly without animating layout.
  - In DevTools, set playback to 10% (Animations panel) and confirm that layout properties (like width/height/margin) are not animating.
- **Done when**: All `transition-all` usages cited are removed, standard hovers are 150ms, states are 200ms, and custom easing curves are applied globally.
