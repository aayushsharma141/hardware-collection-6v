# Phase 16: Local Search Entity & SEO Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-10-09
**Phase:** 16-Local Search Entity & SEO Foundation
**Areas discussed:** Phase Scope & Roadmap Boundaries, Homepage H1 Semantic Structure & Visual Styling, Taxonomy Crawlability on /collections, Canonical Address & NAP Standardization

---

## Phase Scope & Roadmap Boundaries

| Option | Description | Selected |
|--------|-------------|----------|
| Codebase Technical Foundation (Phases 0 & 1) | Scope Phase 16 strictly to the codebase technical implementation: Clean codebase, single H1s, metadata/schema, crawlable HTML taxonomy on /collections, sitemap /catalogues fix, and internal links. Treat GBP and Search Console monitoring as operational milestones. | ✓ |
| Combined Codebase + Operations | Include both the codebase implementation AND the operational GBP / citation checklist within this phase's tracking. | |

**User's choice:** Scope Phase 16 to the codebase technical implementation (User Roadmap Phase 0 & 1): Clean codebase, single H1s, metadata/schema, crawlable HTML taxonomy on /collections, sitemap /catalogues fix, and internal links. Treat GBP and Search Console monitoring as operational milestones.
**Notes:** Operational tasks such as GBP profile updates, photo uploads, review solicitation, and directory citations will be tracked as separate operational milestones and will not block engineering verification.

---

## Homepage H1 Semantic Structure & Visual Styling

| Option | Description | Selected |
|--------|-------------|----------|
| Dual-layer Editorial Headline | Display 'Architectural Hardware Showroom in Sakchi, Jamshedpur' as the unified semantic H1 alongside 'The Art of the Finish.' editorial title, consolidating desktop and mobile into one single H1 in DOM. | ✓ |
| Display Priority with Screen-Reader/Crawler H1 | Keep 'The Art of the Finish.' as the dominant visual display, while embedding 'Architectural Hardware Showroom in Sakchi, Jamshedpur' as the crawlable semantic H1 in the hero section. | |

**User's choice:** Dual-layer editorial headline: Display 'Architectural Hardware Showroom in Sakchi, Jamshedpur' as the unified semantic H1 alongside 'The Art of the Finish.' editorial title, consolidating desktop and mobile into one single H1 in DOM.
**Notes:** This solves the dual-H1 audit issue (where HeroMobile and HeroStage both rendered independent H1s) and pairs clear local-search positioning with the luxury brand voice.

---

## Taxonomy Crawlability on /collections

| Option | Description | Selected |
|--------|-------------|----------|
| Server-rendered Semantic Taxonomy | Render all 5 showroom families, ~50 subcategories, and semantic summaries in server HTML so Googlebot indexes the full catalog without clicking, while using CSS/state for user expansion. | ✓ |
| Hybrid Preview | Show all 5 families with inline preview category tags/links visible by default in the initial HTML view, expanding details on click. | |

**User's choice:** Server-rendered semantic taxonomy: Render all 5 showroom families, ~50 subcategories, and semantic summaries in server HTML so Googlebot indexes the full catalog without clicking, while using CSS/state for user expansion.
**Notes:** Googlebot must see the complete category language (Door Hardware, Digital Locks, Kitchen Sinks & Faucets, Drawer Channels, etc.) on initial page load without requiring JavaScript clicks or hash navigation.

---

## Canonical Address & NAP Standardization

| Option | Description | Selected |
|--------|-------------|----------|
| Standardized Canonical String | 1/18, Kashidih, Near Durga Puja Maidan, Sakchi, Jamshedpur, Jharkhand 831001 | ✓ |
| Await GBP Pin Inspection | Check the live GBP spelling first before finalizing the address string in config and schema. | |

**User's choice:** `1/18, Kashidih, Near Durga Puja Maidan, Sakchi, Jamshedpur, Jharkhand 831001`
**Notes:** The user explicitly locked this canonical address string for use in `src/lib/config.ts`, `Footer.tsx`, and Schema.org structured data.

---

## Agent's Discretion

- Typographic scaling and layout styling for the dual-layer hero H1 across mobile, tablet, and desktop viewports.
- Markup technique for rendering collapsed taxonomy elements in `CollectionExplorer.tsx` so search crawlers parse all links and text without visual distortion.
- Schema.org entity enrichment parameters (openingHoursSpecification, geo coordinates, sameAs references).

---

## Deferred Ideas

- Post-launch 6–8 week Google Search Console observation experiment.
- Evaluation of candidate dedicated route pages (`/collections/door-hardware`, `/brands/hafele`) based on GSC query position data.
- Physical showroom photo refresh (Phase 11 Wave 0 Mukesh dependency).
