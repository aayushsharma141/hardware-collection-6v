# Accessibility & WCAG 2.1 AA Review Workflow

**Trigger:** `/workflow accessibility_review`  
**Purpose:** Enforce contrast ratios, keyboard navigation, focus management, and screen-reader accessibility.

---

## Accessibility Gates

1. **Text Contrast Check:** Ensure minimum 4.5:1 ratio for normal body text and 3:1 for large display headers across all lighting environments (`gallery`, `entrance`, `workspace`, `consultation`).
2. **Keyboard Navigation:** Verify Tab focus order, Skip-to-Content link `#main-content`, and visible 2px focus indicators.
3. **Semantic HTML:** Enforce native `<button>`, `<a>`, `<header>`, `<main>`, `<section>` usage instead of clickable `<div>` elements.
4. **Screen Reader ARIA:** Verify `aria-expanded`, `aria-controls`, `aria-label`, and `role` attributes on custom popovers and drawers.

---

## Blocker Categorization

- **MUST FIX:** Text contrast < 4.5:1; missing focus indicators; clickable `<div>` without keyboard handlers.
- **SHOULD FIX:** Missing image `alt` description tags.
- **COULD FIX:** Adding landmark ARIA labels to secondary page sections.
- **IGNORED:** Decorative background SVG noise elements.
