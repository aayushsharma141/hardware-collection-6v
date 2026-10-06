# Phase 14: UI/UX Refinement & Anti-UI-Slop Standardization - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-10-06
**Phase:** 14-ui-ux-refinement-anti-ui-slop
**Areas discussed:** Floating Action Buttons & Mobile Navigation, Contact & Consultation Section, Hero Carousel & Offers System, Global Anti-UI-Slop & Component Hardening

---

## Floating Action Buttons & Mobile Navigation

### Question 1: Desktop vs. Mobile Visibility Scope
| Option | Description | Selected |
|--------|-------------|:--------:|
| Mobile-only (`lg:hidden`) | Keep desktop clean since desktop navbar and footer already have dedicated call and inquiry CTAs | ✓ |
| Both mobile and desktop | Persistent floating buttons visible in bottom-right on all viewports | |
| Dual on mobile, single on desktop | Floating WhatsApp only on desktop, dual buttons on mobile | |

**User's choice:** Mobile-only (`lg:hidden`).
**Notes:** Avoid redundant screen chrome on desktop where navigation and footer links are always reachable.

### Question 2: Visual Style & Shape
| Option | Description | Selected |
|--------|-------------|:--------:|
| Architectural square (`rounded-none`, 48x48px) | Perfectly aligns with showroom's luxury anti-ui-slop design system and clean lines | ✓ |
| Subtle micro-rounded corners (`rounded-sm`) | Slight softness while preserving architectural feel | |
| Expandable speed-dial | Single button that fans out on tap | |

**User's choice:** Architectural square (`rounded-none`, 48x48px).
**Notes:** Strict adherence to anti-ui-slop principles by avoiding generic rounded pill buttons.

### Question 3: Scroll & Display Behavior
| Option | Description | Selected |
|--------|-------------|:--------:|
| Always fixed and visible (`bottom-6 right-6`) | Persistent and reliable with immediate one-tap access without scroll jitter | ✓ |
| Scroll-aware auto-hide | Slide out on scroll down, reappear on scroll up | |
| Fixed with footer collision avoidance | Stays fixed until reaching footer | |

**User's choice:** Always fixed and visible (`bottom-6 right-6`).
**Notes:** Guarantees zero layout jumps, immediate conversion accessibility at any scroll depth.

### Question 4: Mobile Menu Transition
| Option | Description | Selected |
|--------|-------------|:--------:|
| Full-screen luxury overlay drawer | Elegant typography, subtle dark/ivory backdrop, direct links and fast contact buttons | ✓ |
| Slide-in right sheet drawer | Slides in smoothly from edge with backdrop blur | |
| Compact header dropdown | Cleanly unfolds right beneath navbar island | |

**User's choice:** Full-screen luxury overlay drawer.
**Notes:** Header hamburger button is kept borderless and transparent without a floating box outline.

---

## Contact & Consultation Section

### Question 1: Consultation Form Submission Pathway
| Option | Description | Selected |
|--------|-------------|:--------:|
| Dual flow (Backend + WhatsApp prefill) | Record lead in Google Sheets/database and open WhatsApp with consultation details pre-typed | ✓ |
| Direct WhatsApp only | 1-tap WhatsApp consultation without form friction | |
| Silent form submission only | Keep user on-page with confirmation message | |

**User's choice:** Dual flow (Backend + WhatsApp prefill).
**Notes:** Captures the lead data reliably while immediately bridging the customer to a real consultation desk specialist.

### Question 2: Showroom Map Display
| Option | Description | Selected |
|--------|-------------|:--------:|
| Responsive embedded iframe + external link button | Clear live interactive map with a 1-tap 'Get Directions' deep link | ✓ |
| Static architectural map card | Photo preview that launches Google Maps on click | |
| Collapsible map container | Compact by default, expands on tap | |

**User's choice:** Responsive embedded iframe + external link button.
**Notes:** Provides both immediate in-context showroom orientation and direct navigation routing.

### Question 3: Showroom Stats Metrics
| Option | Description | Selected |
|--------|-------------|:--------:|
| Physical showroom authority (20+ Years / 12+ Brands / Flagship HQ) | Authentic local trust and verified dealer credibility | |
| Inventory & scale focus (10,000+ Fittings / 20+ Brands / 20+ Years) | Scale and breadth focus | |
| Corrected owner truth: 10+ Years / 20+ Brands / Sakchi Flagship HQ | Owner correction: 10+ years in Sakchi and 20+ authorized brands | ✓ |

**User's choice:** "1st , but thats 10+ years in sakchi, 20+ authorised brands, else same".
**Notes:** Critical business-truth correction. The "20+ years" in Sakchi is officially corrected to "10+ years in Sakchi", and brand count is set to "20+ Authorized Brands".

### Question 4: Consultation Form Fields
| Option | Description | Selected |
|--------|-------------|:--------:|
| Ultra-lean 3 fields | Name, Phone Number, Project Type dropdown | |
| Minimal 2 fields | Name + Phone Number only | |
| Standard 4 fields | Name, Phone Number, Project Type, Optional Message/Date | ✓ |

**User's choice:** Standard 4 fields.
**Notes:** Gives architects, interior designers, and homeowners space to provide project notes before connecting.

---

## Hero Carousel & Offers System

### Question 1: Carousel Autoplay Behavior
| Option | Description | Selected |
|--------|-------------|:--------:|
| Gentle autoplay (6-7s) with pause-on-hover/focus | Calm, premium pacing that pauses whenever interacted with | ✓ |
| Purely manual navigation | No autoplay; explicit click or swipe only | |
| Gentle autoplay without pausing | Continuous rotation | |

**User's choice:** Gentle autoplay (6-7s) with pause-on-hover and pause-on-focus.
**Notes:** Calm pacing avoids distracting movement; respects `prefers-reduced-motion`.

### Question 2: Carousel Navigation Controls
| Option | Description | Selected |
|--------|-------------|:--------:|
| Minimal linear progress bars only | Zero visual clutter, perfectly aligned with architectural luxury minimalism | ✓ |
| Linear progress bars + edge arrows on hover | Subtle chevrons appear on hover | |
| Numbered counter + progress bars | Position indicator e.g. 01 / 06 | |

**User's choice:** Minimal linear progress bars only.
**Notes:** Bulky circular play/pause and next/previous buttons are removed.

### Question 3: Offer Slide Visual Distinction
| Option | Description | Selected |
|--------|-------------|:--------:|
| Subtle brass eyebrow badge + dual CTAs | Subtle brass tag ('EXCLUSIVE PRIVILEGE' / 'SPECIAL OFFER') + 'Enquire Offer' cream button & 'All offers' outline | ✓ |
| Identical typography to collection slides | Non-promotional, differs only in button label | |
| Prominent highlight badge with accent wine | Maximum promotional visibility | |

**User's choice:** Subtle brass eyebrow badge + dual CTAs.
**Notes:** Elegant and understated; routes directly to WhatsApp with prefilled offer details.

### Question 4: Hero Headline & Copy Hierarchy
| Option | Description | Selected |
|--------|-------------|:--------:|
| Ultra-minimal editorial typography | Static title ('Explore Our Collections') + active slide name and 1-line subtitle, zero filler text | ✓ |
| Static title + location subtitle | Location subtitle under main title | |
| Slide-driven headline | Main heading changes dynamically per slide | |

**User's choice:** Ultra-minimal editorial typography.
**Notes:** Eliminates bulky paragraphs and redundant marketing text for a clean aesthetic.

---

## Global Anti-UI-Slop & Component Hardening

### Question 1: Corner Radius Enforcement
| Option | Description | Selected |
|--------|-------------|:--------:|
| Strict architectural square (rounded-none everywhere) | Cards, buttons, dialogs, inputs, and image frames all use zero radius | |
| Softened architectural hybrid | Strict `rounded-none` for main containers & buttons, subtle `rounded-sm` (2px) on input fields & thumbnails | ✓ |
| Selective rounding | Rounded-full on status badges, square on cards | |

**User's choice:** Softened architectural hybrid.
**Notes:** Main containers and buttons remain sharp and rectilinear; internal form fields receive subtle softness.

### Question 2: Color Token Standardization
| Option | Description | Selected |
|--------|-------------|:--------:|
| Strict semantic CSS variables | `var(--surface)`, `var(--text-primary)`, `var(--border)`, `var(--color-wine)`, `var(--color-brass)` | ✓ |
| Curated Tailwind config classes | Defined in tailwind.config.ts | |
| Pragmatic mix | Variables for surfaces, utility classes for micro-elements | |

**User's choice:** Strict semantic CSS variables.
**Notes:** Eliminates arbitrary hex values, stray gray classes, and inconsistent contrast.

### Question 3: Product QuickView Presentation
| Option | Description | Selected |
|--------|-------------|:--------:|
| Centered architectural modal | Luxury ivory canvas, sharp borders, large product photography, 1-tap WhatsApp consultation CTA | ✓ |
| Slide-in right sheet drawer | Slides in smoothly from edge | |
| Minimal inline expandable card | Expands in-place without modal | |

**User's choice:** Centered architectural modal.
**Notes:** Provides a focused, high-fidelity inspection view with sharp luxury framing.

### Question 4: Interaction Physics & Tactile Feedback
| Option | Description | Selected |
|--------|-------------|:--------:|
| Crisp tactile luxury feedback | `active:scale-[0.98]`, 200ms ease-out transitions, subtle depth without heavy blurry drop shadows | ✓ |
| High-motion dynamic effects | Magnetic button pulls, cursor glow tracking | |
| Ultra-restrained static shifts | Instant color shift, zero motion or scale | |

**User's choice:** Crisp tactile luxury feedback.
**Notes:** Reinforces the physical substance and weight of architectural hardware.

---

## Agent Discretion
- Micro-timing for linear progress bar width transition (`cubic-bezier(0.16, 1, 0.3, 1)`).
- Specific form validation microcopy and error states in `ConsultationForm.tsx`.
- Subtle SVG icon padding and line-weights across mobile screens.

## Deferred Ideas
- None (all discussed items remained strictly within the scope of stabilizing and formalizing the UI/UX audit findings).
