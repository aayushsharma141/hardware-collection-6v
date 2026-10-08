# Phase 16: Local Search Entity & SEO Foundation - Context

**Gathered:** 2026-10-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the definitive technical SEO foundation, local search entity authority, and crawlability architecture across the codebase for Hardware Collection (Sakchi, Jamshedpur).

**In scope (Technical Codebase SEO Foundation — Roadmap Phases 0 & 1):**
- Strict three-surface architecture validation: `/` (Local Showroom Authority), `/collections` (Taxonomy & Needs Discovery), `/catalogues` (Brand & Technical Authority), plus legal pages (`/privacy`, `/terms`).
- Semantic `<h1>` unification: Guarantee exactly one semantic `<h1>` per page. Consolidate mobile (`HeroMobile.tsx`) and desktop (`HeroStage.tsx`) on `/` into a unified `<h1>` element in the DOM; add the missing `<h1>` to `/collections`; verify and lock single `<h1>` on `/catalogues`.
- Intent-specific metadata: Titles, descriptions, and canonical URLs matching user commercial intent without keyword stuffing.
- Server-rendered taxonomy on `/collections`: Modify `CollectionExplorer.tsx` so all 5 showroom families, ~50 subcategories, and descriptive summaries exist in server-rendered HTML for Googlebot without requiring user click interactions.
- Bidirectional cross-linking bridge: Seamless links between `/collections` ("Looking for a specific manufacturer? Explore Brands & Catalogues →") and `/catalogues` ("Not sure which brand you need? Start with Collections →").
- Sitemap & Robots: Add `/catalogues` to `src/app/sitemap.ts` and verify `src/app/robots.ts`.
- Structured Data (Schema.org): Rich `LocalBusiness` / `HomeGoodsStore` entity graph on `/` with name, address, telephone, hours, coordinates, logo, and brand relationships; `WebPage` + `BreadcrumbList` on `/collections` and `/catalogues`.
- Canonical NAP lock: Enforce `1/18, Kashidih, Near Durga Puja Maidan, Sakchi, Jamshedpur, Jharkhand 831001` and `+91 98351 90738` consistently in `config.ts`, `Footer.tsx`, and JSON-LD schema.
- Image SEO & accessibility: Descriptive filenames, context-specific `alt` attributes, proper dimensions, and native `Next/Image` optimization.
- Domain hygiene: Verify `jamshedpurhardware.com` 301/308 redirect to `hardwarecollection.co`. Completely exclude `hardwarecollection.in`.

**Out of scope (Deferred to Operational Milestones & Future Sprints):**
- Google Business Profile operational activities (photo uploads, video clips, review solicitation engine, Q&A seeding, weekly Google Posts) — tracked in operations documentation.
- Post-launch 6–8 week Google Search Console measurement sprint (Phases 3 & 4 of user roadmap).
- Creating dedicated route pages (`/collections/door-hardware`, `/brands/hafele`, etc.) — prohibited until 6–8 week Search Console data demonstrates necessity.
- E-commerce mechanics, carts, pricing, or automated checkout (strictly locked).

</domain>

<decisions>
## Implementation Decisions

### Phase Scope & Governance
- **D-01:** **Codebase Technical SEO Boundary.** Phase 16 is strictly scoped to the technical, architectural, and crawlability implementation within this repository (corresponding to Phases 0 & 1 of the user's master roadmap). GBP operations, directory citations, and Search Console monitoring are tracked as external operational milestones.
- **D-02:** **Freeze Architecture at Three Public Surfaces.** No dedicated dynamic SEO routes (`/collections/[slug]` or `/brands/[slug]`) shall be created at this stage. Discovery remains on `/`, `/collections`, and `/catalogues`. Any future landing page creation is postponed until the 6–8 week post-launch GSC experiment concludes.

### Heading Structure & Semantic H1s
- **D-03:** **Single Homepage Semantic H1 with Dual-Layer Editorial Styling.** Consolidate `HeroMobile.tsx` and `HeroStage.tsx` so only a single semantic `<h1>` exists in the rendered DOM for `/`. The semantic H1 text is:
  `Architectural Hardware Showroom in Sakchi, Jamshedpur`
  The visual editorial headline `The Art of the Finish.` remains prominent in the brand presentation layer, cleanly separating search understanding from luxury editorial aesthetics.
- **D-04:** **Add Missing Semantic H1 to `/collections`.** Provide an explicit semantic `<h1>` on `/collections`:
  `Architectural Hardware Collections`
  accompanied by the subhead:
  `Explore hardware by application—from doors and digital security to kitchens, wardrobes, bathrooms and glass systems.`
- **D-05:** **Single Semantic H1 on `/catalogues`.** Ensure exactly one `<h1>` exists across `/catalogues` client views:
  `Brands & Catalogues`
  with subhead:
  `Official manufacturer catalogues and technical references from Hardware Collection's authorized brand partners in Jamshedpur.`

### Metadata & Discovery Titles
- **D-06:** **Intent-Driven Page Metadata.**
  - **Homepage (`/`):**
    - Title: `Hardware Collection | Architectural Hardware Showroom in Sakchi, Jamshedpur`
    - Description: `Hardware Collection is a premium architectural hardware showroom in Sakchi, Jamshedpur, offering door hardware, digital locks, kitchen and wardrobe systems, bathroom and glass hardware from authorized brands.`
  - **Collections (`/collections`):**
    - Title: `Architectural Hardware Collections | Door, Kitchen & Wardrobe Hardware`
    - Description: `Explore curated architectural hardware collections in Sakchi, Jamshedpur. Premium door handles, digital locks, modular kitchen systems, and luxury fittings from top brands.`
  - **Catalogues (`/catalogues`):**
    - Title: `Brands & Catalogues | Authorized Hardware Brands in Jamshedpur`
    - Description: `Official architectural hardware catalogues and authorised brand directory for Häfele, Blum, Dorset, Hettich and global partners at Hardware Collection, Sakchi, Jamshedpur.`

### Crawlability & Taxonomy Pre-rendering
- **D-07:** **Server-Rendered Taxonomy on `/collections`.** Refactor `src/components/collections/CollectionExplorer.tsx` so all 5 showroom families (`Handles & Knobs`, `Door Hardware`, `Bathroom`, `Kitchen & Wardrobes`, `Furniture Hardware`), along with all child categories (~50 categories) and descriptive summaries, are rendered into the initial server HTML. Interactive expansion continues via CSS/client state for human users, but Googlebot and crawlers encounter complete category text and standard `<a>` links immediately on load without requiring JavaScript clicks.
- **D-08:** **Crawlable Internal Linking Bridge.** Implement visible, crawlable standard anchor links (`<Link href="...">`):
  - In `/collections`: Add contextual banner/link: *"Looking for a specific manufacturer? Explore Brands & Catalogues →"* linking to `/catalogues`.
  - In `/catalogues`: Add contextual banner/link: *"Not sure which brand you need? Start with Collections →"* linking to `/collections`.
  - Category listings link directly to relevant brand references, and brand entries cross-link to relevant category anchors.
- **D-09:** **Sitemap Ingestion Fix.** Update `src/app/sitemap.ts` to include `https://hardwarecollection.co/catalogues` with `priority: 0.8` and `changeFrequency: 'weekly'`, alongside `/` (`1.0`) and `/collections` (`0.9`).

### NAP Consistency & Schema.org
- **D-10:** **Canonical NAP Lock.** Lock the canonical business identity across `src/lib/config.ts`, `Footer.tsx`, and JSON-LD structured data:
  - Business Name: `Hardware Collection`
  - Address: `1/18, Kashidih, Near Durga Puja Maidan, Sakchi, Jamshedpur, Jharkhand 831001`
  - Primary Contact / WhatsApp: `+91 98351 90738`
  - Showroom Landline / Secondary: `+91 70336 50739`
- **D-11:** **Structured Data Entity Graph.** In `src/app/layout.tsx` (and page-specific schema where appropriate), provide an expanded Schema.org graph:
  - `@type: "HomeGoodsStore"` (or `LocalBusiness`) with postal address, geo coordinates, telephone, opening hours specification, priceRange, logo, and `sameAs` links.
  - `BreadcrumbList` on `/collections` and `/catalogues`.

### Domain & Launch Discipline
- **D-12:** **Domain Redirection Hygiene.** Ensure `jamshedpurhardware.com` cleanly redirects via 301/308 status to `https://hardwarecollection.co` without redirect chains or loops. Strictly exclude any references or redirects for `hardwarecollection.in`.
- **D-13:** **Private Production Gate.** Maintain private/draft gating until client approval is granted. All SEO improvements are baked directly into the build so the site launches fully optimized upon public DNS cutover.

### Agent's Discretion
- Visual typography scale and responsive margin adjustments to ensure the dual-layer H1 looks immaculate on both 360px mobile screens and 2560px ultra-wide displays.
- Internal component architecture for rendering collapsible taxonomy DOM nodes in `CollectionExplorer.tsx` with zero CLS (Cumulative Layout Shift).
- Exact coordinates formatting and schema markup enrichment in `src/app/layout.tsx`.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Rules & Architecture
- `AGENTS.md` — Canonical repository rules: two-route architecture, primaryRail grouping, Sanity content ownership, test gates.
- `.planning/ROADMAP.md` — Locked architecture constraints and phase history.
- `.planning/STATE.md` — Active operational state, business-truth confirmations (WhatsApp number, brand count, claims).
- `.planning/NEVER-BUILD.md` — Rejected-ideas register (no e-commerce, no premature 50-page SEO sprawl).

### Code to be Modified
- `src/app/page.tsx` — Homepage metadata, layout composition, and chapter sequencing.
- `src/components/home/HeroStage.tsx` — Desktop hero heading structure and H1 rendering.
- `src/components/home/HeroMobile.tsx` — Mobile hero heading structure and duplicate H1 removal.
- `src/app/collections/page.tsx` — Collections metadata, breadcrumb schema, and server data fetching.
- `src/components/collections/CollectionExplorer.tsx` — Showroom families, category taxonomy rendering, and crawlability markup.
- `src/app/catalogues/page.tsx` — Catalogues page metadata, brand data merging, and H1 verification.
- `src/components/catalog/BrandsDirectoryView.tsx` — Brand directory search, alphabet filtering, and heading markup.
- `src/components/catalog/CatalogLibrary.tsx` — Brand catalogues directory and heading hierarchy.
- `src/app/sitemap.ts` — Metadata sitemap generating canonical URLs.
- `src/app/robots.ts` — Robots.txt rules and crawler permissions.
- `src/app/layout.tsx` — Global root shell, JSON-LD Schema.org graph (`LocalBusiness`, `Organization`, `WebSite`).
- `src/lib/config.ts` — Canonical showroom constants (NAP, phone numbers, hours, social links).
- `src/components/layout/Footer.tsx` — Canonical showroom contact details, address display, and cross-navigation links.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/config.ts` — Holds `SHOWROOM_LOCATION`, `PHONE`, and hours; needs NAP standardization with the locked address string.
- `src/content/fallback/brands.ts` — `CANONICAL_BRANDS` list powering JSON-LD and brand references.
- `src/content/fallback/catalog.ts` — Master `CATEGORIES`, `BRANDS`, and `PRODUCTS` used for server merging.
- `src/lib/collections/showroom.ts` — Maps `categorySlug` -> `primaryRail` -> showroom family; guarantees taxonomy grouping integrity.

### Established Patterns
- Server Component -> Client Component boundary: Data is fetched and merged in `page.tsx` (server), then passed into interactive client views.
- Tailwind v4 with custom CSS variables (`--surface`, `--accent`, `--color-wine`).
- Semantic typography using Cormorant Garamond (`hc-serif`) for editorial headings and DM Sans / Manrope for readable body copy.

### Integration Points
- `CollectionExplorer.tsx`: Currently toggles active views with `{!activeSection ? Level1 : Level2}`. Refactoring to render all categories in HTML requires wrapping collapsed sections in accessible disclosure tags or hidden-from-view styling that preserves DOM presence for crawlers.
- `HeroStage.tsx` & `HeroMobile.tsx`: Currently independently render `<h1>` tags inside viewport-scoped media query wrappers (`block lg:hidden` vs `hidden lg:block`), causing search crawlers to detect two `<h1>` elements. Must be unified into a single semantic `<h1>`.

</code_context>

<specifics>
## Specific Ideas

- **The Search Domination Intent:** The target is not simply ranking a website; it is fueling the flywheel:
  `Google Map Pack + Organic Search + Brand Search -> Website / GBP -> WhatsApp Enquiry -> Showroom Visit -> Customer Purchase -> Real Review -> Prominence.`
- **Crawlable Taxonomy Language:** Google must read the following core terms in the initial HTML without executing JS clicks:
  `Door Hardware`, `Main Door Handles`, `Mortise & Door Locks`, `Door Closers & Stoppers`, `Smart Security`, `Digital Locks`, `Safes`, `Kitchen Hardware`, `Kitchen Sinks & Faucets`, `Hinges & Soft-Close Systems`, `Drawer Channels`, `Wardrobe Hardware`, `Cabinet & Wardrobe Handles`, `Sliding Systems`, `Bathroom Hardware`, `Bathroom Accessories`, `Glass Hardware`, `Furniture Hardware`, `Furniture Fittings`.
- **Honest Positioning:** Hardware Collection is an authorized multi-brand architectural showroom, not a discount wholesaler. Do not write or optimize for "cheapest hardware shop Jamshedpur".

</specifics>

<deferred>
## Deferred Ideas

- **Post-Launch 6–8 Week GSC Experiment:** Monitor query impressions across Local, Door, Security, Kitchen, Wardrobe, and Brand clusters after production launch.
- **Candidate Dedicated Route Pages:** Only consider creating `/collections/door-hardware` or `/brands/hafele` if GSC data proves that `/collections` and `/catalogues` cannot win target queries after 6–8 weeks of indexing.
- **Google Business Profile Review Engine:** Automated WhatsApp post-purchase review sequence and physical QR stands in the Sakchi showroom (operational task).
- **Physical Showroom Photography Refresh:** Replacing staging assets with confirmed authentic showroom photography across categories (Phase 11 Wave 0 Mukesh dependency).

</deferred>

---

*Phase: 16-Local Search Entity & SEO Foundation*
*Context gathered: 2026-10-09*
