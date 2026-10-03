# Hardware Collection — Animation & Motion Test Protocol

**Document:** `MOTION_TEST_PROTOCOL.md`
**Purpose:** Pre-client validation of all cinematic motion, animation, parallax, scroll choreography, 3D, micro-interactions, and responsive fallbacks.

---

## 01 — Test Objective

The objective is to verify that motion makes Hardware Collection feel like a **digital material showroom**, without turning the website into an animation showcase.

Every animation must answer at least one of:

* Does it communicate material?
* Does it create depth?
* Does it improve product discovery?
* Does it establish premium brand perception?
* Does it guide the visitor toward showroom/WhatsApp conversion?

If an animation does none of these:

> **REMOVE IT.**

---

# 02 — Motion Stack Responsibility

| Technology            | Responsibility                                          | Must NOT be used for          |
| --------------------- | ------------------------------------------------------- | ----------------------------- |
| `motion/react`        | UI transitions, drawer, filters, micro-interactions     | cinematic scroll timelines    |
| GSAP + ScrollTrigger  | Hero film, horizontal journeys, parallax, pinned scenes | basic buttons                 |
| CSS                   | gradients, light sweeps, atmospheric effects            | complex timeline choreography |
| Three.js              | Single authentic 3D product moment                      | decorative 3D everywhere      |
| Browser native scroll | Mobile/default scrolling                                | unnecessary scroll hijacking  |

---

# 03 — Global Motion Rules

### Rule 01 — One dominant motion

At any viewport position:

```text
ONE dominant motion
+
supporting micro-motion
+
stable conversion controls
```

Never:

```text
parallax
+ text reveal
+ cursor effect
+ light sweep
+ floating object
+ scale animation
+ horizontal scroll
```

all competing simultaneously.

---

### Rule 02 — Conversion stability

These must never move unexpectedly:

```text
WhatsApp
Call
Directions
Inquire
Product enquiry
Selection tray
```

No:

* magnetic CTA movement during scrolling
* aggressive scale pulses
* bouncing buttons
* delayed CTA appearance when user needs it
* cursor-dependent positioning

---

# 04 — Motion Token Test

Verify the centralized tokens are actually being used.

### Required categories

```text
micro
standard
editorial
cinematic
```

### Test

Search codebase for:

```text
duration:
ease:
delay:
y:
x:
scale:
```

Identify hardcoded animation values.

### Pass

```text
Global token
      ↓
Component
      ↓
Animation
```

### Fail

```text
Component A → random 0.37
Component B → random 0.62
Component C → random 1.73
```

---

# 05 — CH01 Hero Motion Test

## The Art of the Finish

### Test A — Initial load

Expected:

```text
BLACK
 ↓
atmosphere
 ↓
eyebrow
 ↓
headline
 ↓
product
 ↓
supporting copy
 ↓
CTA
```

But these elements should **overlap**, not appear like a slideshow.

### PASS

The hero feels like one cinematic composition.

### FAIL

It feels like:

```text
fade
wait
fade
wait
fade
```

---

## Test B — Scroll timeline

Scroll slowly from:

```text
0%
→
25%
→
50%
→
75%
→
100%
```

Verify:

* typography depth
* product entrance
* macro clip reveal
* light sweep
* aperture transition

### PASS

Scroll position feels directly connected to visual progression.

### FAIL

Animation continues independently of scroll position.

---

## Test C — Scroll reversal

Scroll:

```text
DOWN
↓
↓
↓
UP
↑
↑
↑
```

Expected:

> animation reverses naturally.

No:

* jumps
* flashes
* incorrect opacity
* stuck transforms
* duplicated timelines

---

# 06 — Parallax Test

Test every parallax layer.

### Required depth relationship

```text
Background       slowest
Environment      slow
Photography      medium
Product          normal
Typography       slightly faster
UI               fixed
```

### Test

Move through the section slowly.

Ask:

> Does this actually create depth?

### PASS

The viewer perceives spatial separation.

### FAIL

The image simply moves up/down.

That is **translation**, not convincing parallax.

---

# 07 — CH02 Brand Wall

### Test

Hover:

```text
HÄFELE
```

Expected:

```text
HÄFELE       100%
others        15%
image          100%
metadata       reveal
CTA             reveal
```

Move pointer away.

Expected:

```text
all brands return smoothly
```

### Test rapid movement

Move:

```text
HÄFELE → DORSET → LABACHA → KICH
```

rapidly.

### PASS

No flickering or animation queue buildup.

### FAIL

Multiple animations compete or remain stuck.

---

# 08 — CH03 Category Cinema

### Desktop

Test horizontal movement.

Verify:

```text
category
   ↓
specimen
   ↓
material
   ↓
application
   ↓
CTA
```

### Critical test

Try using a normal mouse wheel.

### PASS

The horizontal journey feels deliberate.

### FAIL

The browser feels hijacked.

---

## Mobile test

At:

```text
390 × 844
```

Expected:

```text
normal vertical scroll
```

No horizontal GSAP pinning.

No forced horizontal interaction.

---

# 09 — CH04 Material Lens Test

This is the most important motion test in the entire website.

Move pointer slowly across the material.

Expected:

```text
pointer
   ↓
radial highlight
   ↓
material detail
   ↓
subtle micro zoom
```

### Test speed

Slow pointer:

```text
←────────→
```

Fast pointer:

```text
←→←→←→
```

### PASS

Highlight follows naturally.

### FAIL

* delayed light
* excessive lag
* giant spotlight
* distracting zoom
* GPU stutter

---

## Material transition test

Test:

```text
SATIN
 ↓
PVD BRASS
 ↓
MATTE
 ↓
BRUSHED
 ↓
DARK METAL
```

The transitions should feel like **material changes**, not card transitions.

---

# 10 — CH05 Product Reel

Test:

```text
hover card
```

Expected:

```text
image scale
+
small label movement
+
arrow movement
```

### Maximum movement

Keep it subtle.

The product itself remains the visual anchor.

### Test selection

Click:

```text
ADD TO SELECTION
```

Expected:

* immediate feedback
* no distracting animation
* selection tray appears cleanly

---

# 11 — Product Drawer Motion Test

### Open

```text
Product card
      ↓
drawer
```

Expected:

* smooth entrance
* backdrop fade
* initial focus
* no page jump

### Keyboard

Test:

```text
TAB
TAB
TAB
SHIFT + TAB
ESC
```

Expected:

```text
focus stays inside drawer
        ↓
ESC
        ↓
focus returns to trigger
```

### FAIL

Focus escapes into the page.

---

# 12 — CH06 Showroom Motion

Test three scenes:

```text
SCENE 01
Exterior

↓

SCENE 02
Interior

↓

SCENE 03
Visit CTA
```

### Camera-motion test

The movement should resemble:

> slow camera movement

not:

> zooming a background image.

### Test

Pause scrolling.

Expected:

> visual state remains stable.

---

# 13 — CH07 Quiet Zone Test

This is a **negative motion test**.

Verify that the following are absent:

```text
✕ parallax
✕ cursor light
✕ velocity skew
✕ magnetic CTA
✕ bouncing CTA
✕ dramatic reveal
```

Expected:

```text
space
typography
trust
CTA
```

The user should feel the website **slow down**.

---

# 14 — Scroll Velocity Test

Rapidly scroll:

```text
slow
→ medium
→ fast
→ reverse
```

Check decorative velocity skew.

### PASS

Small visual response.

### FAIL

Text bends noticeably or becomes difficult to read.

### Hard rule

```text
Content → NEVER distorted
Decorative layer → MAY skew
```

---

# 15 — Custom Cursor Test

Desktop fine pointer only.

Test:

```text
body
text
image
button
link
input
textarea
select
modal
```

Expected:

```text
normal cursor
```

on:

* form controls
* text selection
* precision UI
* accessibility-sensitive interactions

### Mobile

```text
NO CUSTOM CURSOR
```

---

# 16 — Magnetic Button Test

Test three modes:

```text
none
subtle
standard
```

### WhatsApp CTA

Movement must remain restrained.

### Test pointer distance

Move pointer:

```text
far → near → center → far
```

### FAIL

If the button appears to chase the pointer.

### PASS

It feels like a slight physical response.

---

# 17 — Reduced Motion Protocol

Enable:

```text
Windows
Settings
→ Accessibility
→ Visual effects
→ Animation effects OFF
```

Then reload.

Expected:

```text
GSAP cinematic timelines
        ↓
disabled/simplified

parallax
        ↓
disabled

velocity skew
        ↓
disabled

Material Lens
        ↓
disabled

3D
        ↓
disabled

UI transitions
        ↓
simple fades / instant states
```

No functionality should disappear.

---

# 18 — Mobile Motion Protocol

Test:

```text
390 × 844
393 × 852
412 × 915
```

### Must NOT occur

```text
horizontal overflow
scroll-jacking
WebGL
custom cursor
large parallax
desktop pinned sections
```

### Must remain

```text
normal scroll
product discovery
WhatsApp
call
selection
drawer
navigation
```

---

# 19 — Tablet Protocol

Test:

```text
768 × 1024
820 × 1180
```

Pay special attention to:

* GSAP breakpoint
* horizontal sections
* image cropping
* typography
* CTA positioning
* drawer width

The breakpoint should not create a strange "desktop squeezed into tablet" experience.

---

# 20 — Performance Test

Use Chrome DevTools.

### CPU

Test:

```text
4× CPU slowdown
```

### Network

Test:

```text
Fast 3G
Slow 4G
```

### Observe

* frame drops
* image loading
* layout shifts
* long JavaScript tasks
* WebGL initialization
* animation smoothness

### Target

For cinematic sections, aim for:

```text
~60 FPS
```

on a modern desktop.

On constrained devices:

> **stable and usable beats 60 FPS at all costs.**

---

# 21 — WebGL Test

When actual GLB is introduced:

### Test A

Desktop + WebGL:

```text
Canvas loads
```

### Test B

No WebGL:

```text
static fallback
```

### Test C

Reduced motion:

```text
static fallback
```

### Test D

Mobile:

```text
static fallback
```

### Test E

Scroll away from section:

```text
Canvas lifecycle
```

Verify the scene doesn't remain unnecessarily active.

---

# 22 — Image Loading Test

Every cinematic asset:

```text
request
 ↓
loading
 ↓
decoded
 ↓
display
```

Check:

* no broken images
* no layout jumps
* correct aspect ratio
* correct crop
* no blurry desktop hero
* no giant mobile downloads

---

# 23 — Motion Conflict Test

This is one of the most important tests.

At every viewport, identify:

```text
What is moving?
Why is it moving?
What should the eye look at?
```

Example:

### CH04

```text
PRIMARY
Material

SECONDARY
Typography

ATMOSPHERE
Light

STABLE
CTA
```

If everything moves:

> **FAIL.**

---

# 24 — Conversion Interruption Test

Start at:

```text
Homepage
```

Try to reach WhatsApp.

Then repeat while:

* scrolling quickly
* hovering
* opening product drawer
* filtering collections
* selecting products
* using keyboard
* using mobile

### PASS

Conversion remains immediately available.

### FAIL

Animation delays or obscures the conversion path.

---

# 25 — Animation Kill Test

Temporarily disable all animation CSS/JS.

The site must still function.

```text
NO MOTION
   ↓
STILL USABLE
   ↓
STILL NAVIGABLE
   ↓
STILL CONVERTS
```

This is critical.

Motion is enhancement—not infrastructure.

---

# 26 — Visual Quality Scoring

Each chapter gets:

| Category           | Score |
| ------------------ | ----: |
| Composition        |   /10 |
| Depth              |   /10 |
| Motion quality     |   /10 |
| Material realism   |   /10 |
| Typography         |   /10 |
| Hierarchy          |   /10 |
| Accessibility      |   /10 |
| Performance        |   /10 |
| Conversion clarity |   /10 |
| Mobile behavior    |   /10 |

### Minimum gate

```text
90+       Client ready
80–89     Needs refinement
70–79     Major refinement
<70       Reject
```

### Automatic rejection

Regardless of score:

```text
broken CTA
broken keyboard navigation
horizontal overflow
motion-induced unreadability
fake business claims
broken image
hydration error
console error affecting UX
```

---

# 27 — Final Motion Acceptance Checklist

```text
[ ] Hero feels cinematic
[ ] Hero scroll timeline feels connected to scroll
[ ] No animation feels decorative without purpose

[ ] Parallax creates actual depth
[ ] Brand wall feels editorial
[ ] Category cinema feels navigable
[ ] Material Lens feels tactile
[ ] Material transitions feel physical
[ ] Product reel remains product-focused
[ ] Showroom movement feels like camera movement
[ ] Quiet zone actually feels quiet

[ ] No scroll-jacking on mobile
[ ] No horizontal overflow
[ ] No custom cursor on touch
[ ] No WebGL on unsupported devices
[ ] Reduced-motion mode works
[ ] Keyboard navigation works
[ ] Product drawer traps focus
[ ] Focus returns correctly

[ ] WhatsApp CTA always accessible
[ ] Call CTA always accessible
[ ] Directions CTA always accessible

[ ] No console errors
[ ] No broken assets
[ ] No major layout shift
[ ] Images load progressively
[ ] WebGL cleans up correctly
[ ] Performance remains acceptable

[ ] 1440×900 PASS
[ ] 1280×720 PASS
[ ] 1024×768 PASS
[ ] 820×1180 PASS
[ ] 768×1024 PASS
[ ] 390×844 PASS
[ ] Reduced Motion PASS
```
