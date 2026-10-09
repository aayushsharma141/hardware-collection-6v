# Phase 16: Local Search Entity & SEO Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-10-09
**Phase:** 16-Local Search Entity & SEO Foundation
**Areas discussed:** Phase Scope & Roadmap Boundaries, Homepage H1 Semantic Structure & Title Optimization, Taxonomy Crawlability on /collections, NAP & Address Verification, Schema.org Subtype, Domain Redirects & Canonical Host, Environment Indexing Controls, Documentation Rules

---

## Phase Scope & Roadmap Boundaries

| Option | Description | Selected |
|--------|-------------|----------|
| Codebase Technical Foundation (Phases 0 & 1) | Scope Phase 16 strictly to the codebase technical implementation: Clean codebase, single H1s, metadata/schema, crawlable HTML taxonomy on /collections, sitemap /catalogues fix, and internal links. Treat GBP and Search Console monitoring as operational milestones. | ✓ |
| Combined Codebase + Operations | Include both the codebase implementation AND the operational GBP / citation checklist within this phase's tracking. | |

**User's choice:** Scope Phase 16 to the codebase technical implementation (User Roadmap Phase 0 & 1): Clean codebase, single H1s, metadata/schema, crawlable HTML taxonomy on /collections, sitemap /catalogues fix, and internal links. Treat GBP and Search Console monitoring as operational milestones.
**Notes:** Operational tasks such as GBP profile updates, photo uploads, review solicitation, and directory citations will be tracked as separate operational milestones and will not block engineering verification.

---

## Homepage H1 Semantic Structure & Title Optimization

| Option | Description | Selected |
|--------|-------------|----------|
| Front-loaded Title + Dual-layer Editorial Headline | Display 'Architectural Hardware Showroom in Sakchi, Jamshedpur' as the unified semantic H1 alongside 'The Art of the Finish.' editorial title, consolidating desktop and mobile into one single H1 in DOM. Title: 'Architectural Hardware Showroom in Sakchi, Jamshedpur \| Hardware Collection'. | ✓ |
| Display Priority with Screen-Reader/Crawler H1 | Keep 'The Art of the Finish.' as the dominant visual display, while embedding 'Architectural Hardware Showroom in Sakchi, Jamshedpur' as the crawlable semantic H1 in the hero section. | |

**User's choice:** Dual-layer editorial headline with front-loaded title: 'Architectural Hardware Showroom in Sakchi, Jamshedpur \| Hardware Collection'.
**Notes:** This solves the dual-H1 audit issue (where HeroMobile and HeroStage both rendered independent H1s), prevents title snippet truncation in SERPs, and pairs clear local-search positioning with the luxury brand voice.

---

## Taxonomy Crawlability on /collections

| Option | Description | Selected |
|--------|-------------|----------|
| 7 Showroom Families & Sanity Categories in Server HTML | Render all 7 showroom families (`door`, `smart-security`, `kitchen`, `wardrobe-furniture`, `bathroom-hardware`, `glass`, `furniture-fittings`) and their Sanity categories in server HTML so Googlebot indexes the full catalog without clicking, while using CSS/state for user expansion. | ✓ |
| Legacy 5-Family Board / Subcategory Filter Level | Render the obsolete 5-family board and subcategory chips. | |

**User's choice:** All 7 showroom families and their Sanity categories in server HTML.
**Notes:** Corrected from obsolete 5-family board. The codebase runs on the 7 families defined in `src/lib/collections/showroom.ts`. Subcategories are filter tags only when multiple exist; Sanity categories are the browsable and indexable level.

---

## Canonical Address & NAP Standardization

| Option | Description | Selected |
|--------|-------------|----------|
| Mark Pending GBP & Client Confirmation | Mark canonical address spelling ('Kasidih, near Baradwari Durga Puja Maidan' vs 'Kashidih') and secondary phone (+91 70336 50739) as PENDING confirmation. Sanity `siteSettings` is canonical source; `config.ts` is fallback. | ✓ |
| Premature Hardcode | Lock address and secondary phone immediately without verifying against live GBP card and client intake. | |

**User's choice:** Mark D-10 as pending GBP confirmation.
**Notes:** Canonical address source is client's verified Google Business Profile. Sanity site settings is canonical source feeding site and schema; `config.ts` is resilience fallback.

---

## Structured Data Schema Subtype

| Option | Description | Selected |
|--------|-------------|----------|
| `HardwareStore` | Use `@type: "HardwareStore"` — the most specific schema.org LocalBusiness subtype matching GBP category. | ✓ |
| `HomeGoodsStore` | Use `@type: "HomeGoodsStore"` (furnishings category). | |

**User's choice:** `HardwareStore`.
**Notes:** Google guidelines advise using the most specific applicable LocalBusiness subtype. HardwareStore directly aligns with GBP "Hardware store" classification.

---

## Domain Redirects & Canonical Host

| Option | Description | Selected |
|--------|-------------|----------|
| Single-Hop Direct & Host Unification | Redirect `jamshedpurhardware.com` directly to final canonical host in 1 hop with path forwarding. Explicitly choose `www` vs bare host across Vercel, canonical tags, sitemap, and JSON-LD. | ✓ |
| Two-hop Chain / Inconsistent Hosts | Let `jamshedpurhardware.com` redirect to bare domain then redirect again to `www`. | |

**User's choice:** Single-hop redirect with path preservation and host unification.
**Notes:** Two-hop redirect chains waste crawl equity. Vercel primary host and codebase canonical tags must match.

---

## Environment Indexing Controls

| Option | Description | Selected |
|--------|-------------|----------|
| Dynamic Noindex on Non-Production | Serve `X-Robots-Tag: noindex, nofollow` on preview/staging deployments (`hc-demo-ten.vercel.app`, `*.vercel.app`). | ✓ |
| Rely on robots.txt alone | Let preview URLs be crawlable without response header protection. | |

**User's choice:** Dynamic noindex on non-production.

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
