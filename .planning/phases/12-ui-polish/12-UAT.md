# Phase 12 UAT: UI & Visual Polish

## Objective
Validate the GSAP animations, motion constraints, and hover states implemented in Phase 12.

## Test Cases

### Test 1: Global Motion Constants & Hover States
- [ ] Hover over textual links (like "Explore Architecture" or similar rules) and verify an elegant `--brass` (gold) underline expanding from left to right.
- [ ] Hover over CTA buttons and ensure they react luxuriously without abrupt popping.

### Test 2: Navbar Load Reveal
- [ ] Refresh the page. Verify the Navbar smoothly reveals from the top (y: -100 to 0) over a short, elegant duration.

### Test 3: CollectionsHero Typography Stagger
- [ ] Navigate to `/collections`.
- [ ] Verify the "Explore our Collections" typography staggers in from bottom to top smoothly.
- [ ] Verify the hero image slowly fades and scales down into place.

### Test 4: CompactCollectionGrid Scroll Stagger
- [ ] On `/collections`, scroll down to the category grid (Handles & Knobs, etc.).
- [ ] Verify that as cards enter the viewport, they fade in and slide up (y: 30 to 0) sequentially (staggered by 0.1s).

### Test 5: SpaceIntentRail Scroll Stagger
- [ ] On the homepage, scroll down to the "Explore by Architectural Space" section.
- [ ] Verify the rail cards fade and slide in from the left (x: 30 to 0) sequentially as they become visible.
