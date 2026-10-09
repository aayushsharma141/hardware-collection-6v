# Phase 16: Local Search Entity & SEO Foundation — Plan Outline

## Overview
Phase 16 establishes the technical SEO foundation, local search entity authority, crawlability architecture, and preview indexation protection across the Hardware Collection application, strictly respecting the locked 3-route architecture (`/`, `/collections`, `/catalogues`) and the 7 canonical showroom families.

---

## Waves & Plans Breakdown

### Wave 1: Host Resolution, Deployment Indexing & Infrastructure
- **16-01-PLAN.md — Canonical Host, Domain Redirects & Preview Indexation**
  - Lock `https://www.hardwarecollection.co` as the definitive canonical host across all configs.
  - Add bare domain fallback redirect in `next.config.ts`.
  - Document upstream AWS ELB / registrar forwarding requirements for `jamshedpurhardware.com` (single-hop direct redirect with path preservation to prevent 404s).
  - Implement deployment-level indexation controls in `next.config.ts`: serve `X-Robots-Tag: noindex, nofollow` on `*.vercel.app` (including `hc-demo-ten.vercel.app`) unless explicitly overridden by `SITE_INDEXABLE=true` on production.
  - Preserve crawler access in `src/app/robots.ts` so search engine crawlers can read the noindex header.

### Wave 2: Content Surfaces — Single H1s, Front-Loaded Metadata & Breadcrumbs
- **16-02-PLAN.md — Semantic H1 Unification, Discovery Metadata & Breadcrumb Schema**
  - Consolidate homepage heading structure: render a single semantic `<h1>` in a shared parent component outside `HeroStage` and `HeroMobile` (`src/app/page.tsx`), converting headings inside hero variants into visual display elements.
  - Add missing semantic `<h1>Architectural Hardware Collections</h1>` to `/collections`.
  - Verify single semantic `<h1>Brands & Catalogues</h1>` on `/catalogues`.
  - Update intent-driven, front-loaded metadata across `/`, `/collections`, and `/catalogues`.
  - Add `BreadcrumbList` JSON-LD structured data to `/catalogues` (matching `/collections`).

### Wave 3: Server-Rendered Taxonomy & Bidirectional Crawlable Linking
- **16-03-PLAN.md — Server-Rendered Taxonomy & Cross-Linking Bridges**
  - Refactor `src/components/collections/CollectionExplorer.tsx` to render all 7 canonical showroom families (`door`, `smart-security`, `kitchen`, `wardrobe-furniture`, `bathroom-hardware`, `glass`, `furniture-fittings`) and their Sanity categories into the server-rendered HTML.
  - Use accessible disclosure patterns (`<details>`/`<summary>` or `hidden="until-found"`) for visual collapsing; strictly avoid `aria-hidden="true"`, zero-opacity, or zero-height containers.
  - Implement visible, crawlable bidirectional cross-links using standard `<Link href="...">` tags between `/collections` and `/catalogues`, verifying raw HTML `<a href="...">` output.

### Wave 4: Structured Data Entity Graph, Sitemap & Release Gates
- **16-04-PLAN.md — Schema.org HardwareStore Graph, Sitemap Alignment & Release Gate**
  - Upgrade root JSON-LD graph in `src/app/layout.tsx` to `@type: "HardwareStore"` with full D-11 entity fields (canonical URL, verified telephone, coordinates, opening hours, GBP URL, showroom image, brand list).
  - Strictly gate unverified NAP facts (secondary phone `+91 70336 50739` and address spelling) as external dependencies pending GBP confirmation.
  - Add `/catalogues` to `src/app/sitemap.ts` (`priority: 0.8`, `changeFrequency: 'weekly'`) and unify sitemap URLs to `https://www.hardwarecollection.co`.
  - Execute full automated verification suite (`npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build`, DOM heading audit, raw HTML crawlability checks).
  - Establish release gate checklist for client sign-off and public DNS cutover.
