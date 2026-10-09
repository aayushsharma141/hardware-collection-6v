# Phase 16: Local Search Entity & SEO Foundation — Execution Plan (Amended)

**Objective:** Implement the technical SEO foundation, local search entity authority, crawlability architecture, and preview indexation protection across the codebase for Hardware Collection (Sakchi, Jamshedpur).

**Locked Decisions & Architecture Constraints:**
- **Routes:** Exactly three public content routes (`/`, `/collections`, `/catalogues`) plus approved legal routes (`/privacy`, `/terms`). No dynamic slug routes (`/collections/[slug]` or `/brands/[slug]`).
- **Canonical Host:** Locked to `https://www.hardwarecollection.co`. All canonical URLs, sitemaps, structured data, and redirects must unify on this host.
- **Taxonomy:** 7 canonical showroom families (`door`, `smart-security`, `kitchen`, `wardrobe-furniture`, `bathroom-hardware`, `glass`, `furniture-fittings`) driven by `primaryRail`. All families and Sanity categories must be present in server-rendered HTML.
- **Heading Structure:** Exactly one semantic `<h1>` per page.
- **Preview Indexation:** Non-production environments (including `hc-demo-ten.vercel.app` and `*.vercel.app`) must return `X-Robots-Tag: noindex, nofollow`, decoupled from `VERCEL_ENV`.
- **Business Identity (NAP):** Address spelling and secondary phone (`+91 70336 50739`) are **pending client/GBP verification**. They must not enter production schema without explicit confirmation.
- **Release Control:** Production site remains private until client approval is granted.

---

## Task 1: Canonical Host Lock & Domain Redirection Configuration

**Intended Outcome:**
Lock `https://www.hardwarecollection.co` as the definitive canonical host across all configurations. Identify and resolve the `jamshedpurhardware.com` redirect to prevent 2-hop redirect chains and 404 errors on deep links.

**Context & Findings:**
Live HTTP inspection reveals:
1. `http://jamshedpurhardware.com` returns `301 Moved Permanently` to `https://hardwarecollection.co` (bare domain) via an upstream AWS ELB (`awselb/2.0`, `Server: ip-100-74-5-104.eu-west-2.compute.internal`), which is managed upstream (at registrar/DNS/load-balancer level), not inside Next.js or Vercel.
2. `http://jamshedpurhardware.com/collections` currently returns `404 Not Found` (WAFRule: 5) because path-forwarding is not enabled on that upstream endpoint.
3. If the canonical host is `https://www.hardwarecollection.co`, the current setup creates an inefficient 2-hop chain (`jamshedpurhardware.com` → `hardwarecollection.co` → `www.hardwarecollection.co`).

**Files / Systems Involved:**
- `next.config.ts` (host redirect safety net)
- Upstream Registrar / AWS ELB / DNS settings (external control point)
- `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/layout.tsx`

**Prerequisites:** None.

**Implementation Steps:**
1. Formally record `https://www.hardwarecollection.co` as the canonical origin across all application files.
2. In `next.config.ts`, add a redirect rule for any traffic landing on the bare domain (`hardwarecollection.co`) to forward directly to `https://www.hardwarecollection.co/:path*` with `permanent: true`.
3. Document the upstream requirement for the domain administrator: update the `jamshedpurhardware.com` DNS/ELB forwarding rule to point directly to `https://www.hardwarecollection.co/$1` with path preservation enabled (single-hop).

**Verification:**
- Run `curl.exe -s -D - -o NUL https://hardwarecollection.co` locally or on deployment to confirm 301 redirect to `https://www.hardwarecollection.co`.
- Verify no internal link or canonical tag references the bare domain or HTTP.

**Acceptance Criteria:**
- All codebase canonical references use `https://www.hardwarecollection.co`.
- Upstream redirect requirements documented with zero two-hop chains.

**External Dependency:** Registrar/DNS access to update `jamshedpurhardware.com` ELB forwarding.

---

## Task 2: Deployment-Level Indexing Controls (`SITE_INDEXABLE` & Request Host Protection)

**Intended Outcome:**
Guarantee that preview deployments, branch previews, and the demo site (`hc-demo-ten.vercel.app`) serve `X-Robots-Tag: noindex, nofollow`, even if `hc-demo` is configured as a production environment in Vercel. Ensure production becomes indexable only when explicitly authorized.

**Files Modified:**
- `next.config.ts`
- `src/app/robots.ts`

**Prerequisites:** Task 1.

**Implementation Steps:**
1. In `next.config.ts`, implement a security/indexing header rule in `headers()` that injects:
   ```json
   { "key": "X-Robots-Tag", "value": "noindex, nofollow" }
   ```
   Apply this header dynamically:
   - When the request host matches `*.vercel.app` (e.g. using Next.js `has: [{ type: 'host', value: '(?<subdomain>.*)\\.vercel\\.app' }]`), OR
   - When the environment variable `SITE_INDEXABLE !== 'true'`.
2. Configure the default behavior: if `SITE_INDEXABLE` is not explicitly set to `'true'`, default to serving `noindex, nofollow`.
3. In `src/app/robots.ts`, maintain crawling permissions (`allow: '/'`) across all hosts so search engine bots can fetch responses and read the `X-Robots-Tag: noindex, nofollow` header. (Do not use `disallow: /` in `robots.txt` as a substitute, which blinds Googlebot from detecting the header).

**Verification:**
- Test with curl setting `Host: hc-demo-ten.vercel.app` or inspecting Vercel preview deployment response headers to confirm `X-Robots-Tag: noindex, nofollow` is present.
- Test with `SITE_INDEXABLE=true` on the canonical host to confirm `X-Robots-Tag` is omitted in production.

**Acceptance Criteria:**
- `hc-demo-ten.vercel.app` returns `X-Robots-Tag: noindex, nofollow`.
- Production returns indexable headers only when `SITE_INDEXABLE=true`.
- `robots.txt` does not block crawling of preview hosts.

---

## Task 3: Homepage Single Semantic H1 & Intent-Driven Metadata

**Intended Outcome:**
Consolidate the homepage heading structure so exactly one semantic `<h1>` exists in the rendered HTML document across all breakpoints, while preserving the dual-layer editorial luxury presentation. Update homepage metadata.

**Files Modified:**
- `src/app/page.tsx`
- `src/components/home/HeroStage.tsx`
- `src/components/home/HeroMobile.tsx`

**Prerequisites:** Task 1.

**Implementation Steps:**
1. In `src/app/page.tsx`:
   - Render the single semantic `<h1>` in a shared location in the DOM:
     `<h1 className="sr-only">Architectural Hardware Showroom in Sakchi, Jamshedpur</h1>`
     or place it directly within the main hero section wrapper before viewport branching.
   - Update `generateMetadata()`:
     - Title: `Architectural Hardware Showroom in Sakchi, Jamshedpur | Hardware Collection`
     - Description: `Hardware Collection is a premium architectural hardware showroom in Sakchi, Jamshedpur, offering door hardware, digital locks, kitchen and wardrobe systems, bathroom and glass hardware from authorized brands.`
     - Alternates: `canonical: 'https://www.hardwarecollection.co'`
2. In `src/components/home/HeroStage.tsx` (desktop):
   - Replace `<h1 className="hero-h1 ...">` with `<p className="hero-h1 hc-serif ...">` or `<div role="heading" aria-level={2} ...>` to maintain identical GSAP animations and visual editorial typography ("The Art of the Finish.") without rendering an `<h1>`.
3. In `src/components/home/HeroMobile.tsx` (mobile):
   - Replace `<h1 className="hc-serif ...">` with a styled `<p className="hc-serif ...">` or `<h2 className="hc-serif ...">`.

**Verification:**
- Run `npm test` and execute an automated DOM inspection check (`document.querySelectorAll('h1').length === 1`) on the rendered homepage HTML.
- View at 375px (mobile) and 1440px (desktop) to ensure visual typography and GSAP animations are 100% intact.

**Acceptance Criteria:**
- Exactly one semantic `<h1>` in the homepage DOM.
- Front-loaded title matches D-06 (~71 chars).
- No visual or animation regression.

---

## Task 4: Collections Page H1, Server-Rendered Taxonomy & Metadata

**Intended Outcome:**
Add the missing semantic `<h1>` to `/collections`, update metadata, and refactor `CollectionExplorer.tsx` so all 7 canonical showroom families and their Sanity categories are server-rendered in the initial HTML for Googlebot.

**Files Modified:**
- `src/app/collections/page.tsx`
- `src/app/collections/CollectionsClient.tsx`
- `src/components/collections/CollectionExplorer.tsx`

**Prerequisites:** Task 1.

**Implementation Steps:**
1. In `src/app/collections/page.tsx`:
   - Update metadata:
     - Title: `{ absolute: "Architectural Hardware Collections | Door, Kitchen & Wardrobe Hardware" }`
     - Description: `Explore curated architectural hardware collections in Sakchi, Jamshedpur. Premium door handles, digital locks, modular kitchen systems, and luxury fittings from top brands.`
     - Canonical: `https://www.hardwarecollection.co/collections`
2. In `src/app/collections/CollectionsClient.tsx`:
   - Ensure the semantic `<h1>` is explicitly rendered:
     `<h1>Architectural Hardware Collections</h1>`
     along with the descriptive subhead:
     `Explore hardware by application—from doors and digital security to kitchens, wardrobes, bathrooms and glass systems.`
3. In `src/components/collections/CollectionExplorer.tsx`:
   - Eliminate the binary toggle `{!activeSection ? Level1 : Level2}` that strips category HTML from the initial DOM.
   - Refactor the component to render all 7 showroom families (`door`, `smart-security`, `kitchen`, `wardrobe-furniture`, `bathroom-hardware`, `glass`, `furniture-fittings`) AND all associated Sanity categories into the server HTML.
   - Use accessible disclosure patterns such as `<details>`/`<summary>` or HTML5 `hidden="until-found"` for collapsed content. Strictly avoid `aria-hidden="true"`, zero opacity, or zero height wrappers that can trigger search engine hidden-text penalties.

**Verification:**
- Fetch unhydrated HTML via `curl.exe http://localhost:3000/collections` and grep for category names (e.g. `Main Door Handles`, `Digital Locks`, `Drawer Channels`). All must be present in the raw output.
- Verify `document.querySelectorAll('h1').length === 1` on `/collections`.

**Acceptance Criteria:**
- Exactly one `<h1>` on `/collections`.
- All 7 families and Sanity categories present in raw server HTML without executing JS.
- Smooth interactive expansion preserved for site visitors.

---

## Task 5: Catalogues Page H1, Metadata & BreadcrumbList Schema

**Intended Outcome:**
Verify single `<h1>` enforcement on `/catalogues`, align intent metadata, and implement the missing `BreadcrumbList` structured data required by D-11.

**Files Modified:**
- `src/app/catalogues/page.tsx`
- `src/app/catalogues/CatalogsClient.tsx`
- `src/components/catalog/BrandsDirectoryView.tsx`

**Prerequisites:** Task 1.

**Implementation Steps:**
1. In `src/app/catalogues/page.tsx`:
   - Update metadata:
     - Title: `{ absolute: "Brands & Catalogues | Authorized Hardware Brands in Jamshedpur" }`
     - Description: `Official architectural hardware catalogues and authorised brand directory for Häfele, Blum, Dorset, Hettich and global partners at Hardware Collection, Sakchi, Jamshedpur.`
     - Canonical: `https://www.hardwarecollection.co/catalogues`
   - Add `BreadcrumbList` JSON-LD structured data:
     ```json
     {
       "@context": "https://schema.org",
       "@type": "BreadcrumbList",
       "itemListElement": [
         { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.hardwarecollection.co/" },
         { "@type": "ListItem", "position": 2, "name": "Brands & Catalogues", "item": "https://www.hardwarecollection.co/catalogues" }
       ]
     }
     ```
2. Verify and enforce that exactly one `<h1>Brands & Catalogues</h1>` exists in the rendered HTML output.

**Verification:**
- View raw HTML of `/catalogues` to confirm JSON-LD contains `BreadcrumbList` with canonical URLs.
- Verify `document.querySelectorAll('h1').length === 1` across desktop and mobile.

**Acceptance Criteria:**
- Valid `BreadcrumbList` JSON-LD rendered on `/catalogues`.
- Single semantic `<h1>`.
- Correct canonical metadata.

---

## Task 6: Schema.org `HardwareStore` Entity Graph & NAP Consistency

**Intended Outcome:**
Upgrade the homepage JSON-LD graph to use the most specific subtype `@type: "HardwareStore"` with complete business entity properties, while preventing unverified NAP data from entering production.

**Files Modified:**
- `src/app/layout.tsx`
- `src/lib/config.ts`

**Prerequisites:** Task 1.

**Implementation Steps:**
1. In `src/app/layout.tsx`:
   - Update the primary LocalBusiness node to `@type: "HardwareStore"`.
   - Populate verified D-11 properties:
     - `@id`: `https://www.hardwarecollection.co/#hardwarestore`
     - `name`: `Hardware Collection`
     - `url`: `https://www.hardwarecollection.co/`
     - `telephone`: `+919835190738` (verified primary contact)
     - `geo`: Verified coordinates (`latitude: 22.8028`, `longitude: 86.2029`)
     - `openingHoursSpecification`: Verified showroom schedule
     - `priceRange`: `₹₹₹`
     - `image`: `https://www.hardwarecollection.co/cinema/showroom/interior.png`
     - `hasMap`: `https://www.google.com/maps/search/?api=1&query=Hardware+Collection+Jamshedpur`
     - `brand`: Authorized brand list from `CANONICAL_BRANDS`
   - **NAP Verification Safeguard:**
     - Address: Use verified address from Sanity `siteSettings.showroomAddress` with fallback to `config.SHOWROOM_ADDRESS`.
     - Secondary phone (`+91 70336 50739`): Mark as **pending GBP confirmation**. Do NOT inject into production JSON-LD `telephone` or `contactPoint` unless explicitly confirmed in Sanity `siteSettings`.
2. In `src/lib/config.ts`:
   - Add explicit inline comments marking secondary phone and precise address spelling as external dependencies pending GBP/client confirmation.

**Verification:**
- Extract JSON-LD from homepage and validate with Schema.org / Google Rich Results validator.
- Confirm `@type` is `HardwareStore` and secondary phone is not exposed without verification.

**Acceptance Criteria:**
- Valid, rich `HardwareStore` entity graph.
- Unverified secondary phone omitted from production schema.
- All IDs and URLs point to `https://www.hardwarecollection.co`.

**External Dependency:** Client/GBP confirmation for secondary phone and exact postal spelling.

---

## Task 7: Bidirectional Crawlable Cross-Linking (Raw HTML `<a>` Verification)

**Intended Outcome:**
Establish visible, crawlable standard HTML anchor links bridging `/collections` and `/catalogues`.

**Files Modified:**
- `src/app/collections/CollectionsClient.tsx`
- `src/app/catalogues/CatalogsClient.tsx`

**Prerequisites:** Task 4, Task 5.

**Implementation Steps:**
1. In `CollectionsClient.tsx`:
   - Add a visible contextual bridge section/banner:
     `"Looking for a specific manufacturer? Explore Brands & Catalogues →"`
     linking with `<Link href="/catalogues">`.
2. In `CatalogsClient.tsx`:
   - Add a visible contextual bridge section/banner:
     `"Not sure which brand you need? Start with Collections →"`
     linking with `<Link href="/collections">`.
3. Verify that both links render as standard `<a href="...">` elements in the server-rendered HTML.

**Verification:**
- Run `curl.exe http://localhost:3000/collections | grep -i 'href="/catalogues"'`
- Run `curl.exe http://localhost:3000/catalogues | grep -i 'href="/collections"'`
- Verify click transitions in browser.

**Acceptance Criteria:**
- Both cross-links exist in raw unhydrated HTML.
- Seamless navigation between the two discovery routes.

---

## Task 8: Sitemap (`/catalogues` Inclusion) & Robots.txt Alignment

**Intended Outcome:**
Include `/catalogues` in the XML sitemap, unify all sitemap entries to `https://www.hardwarecollection.co`, and ensure `robots.txt` directives properly support crawler header discovery.

**Files Modified:**
- `src/app/sitemap.ts`
- `src/app/robots.ts`

**Prerequisites:** Task 1.

**Implementation Steps:**
1. In `src/app/sitemap.ts`:
   - Set `baseUrl = 'https://www.hardwarecollection.co'`.
   - Include all three public routes:
     - `/` (`priority: 1.0`, `changeFrequency: 'weekly'`)
     - `/collections` (`priority: 0.9`, `changeFrequency: 'weekly'`)
     - `/catalogues` (`priority: 0.8`, `changeFrequency: 'weekly'`)
2. In `src/app/robots.ts`:
   - Reference sitemap: `https://www.hardwarecollection.co/sitemap.xml`.
   - Maintain `allow: '/'` so crawlers can access pages and detect `X-Robots-Tag: noindex, nofollow` on preview deployments.

**Verification:**
- Fetch `/sitemap.xml` and `/robots.txt` locally to verify exact URLs, hostnames, and priorities.

**Acceptance Criteria:**
- `/catalogues` included in `sitemap.xml`.
- 100% hostname consistency (`www.hardwarecollection.co`).

---

## Task 9: Automated Quality Gates & Local Verification Suite

**Intended Outcome:**
Execute the full quality gate pipeline to ensure zero regressions in types, tests, linting, or production builds.

**Prerequisites:** Tasks 1–8.

**Implementation Steps:**
1. Run `npx tsc --noEmit` — verify 0 errors.
2. Run `npm run lint` — verify 0 warnings/errors.
3. Run `npm test` — verify all existing tests pass (baseline: 222 passing tests).
4. Run `npm run build` — verify Next.js static site generation succeeds with zero errors.
5. Execute architectural guard tests:
   - Check that no file links to `/collections/<slug>` (per `routeInventory.test.ts`).
   - Validate heading parity (single H1 on `/`, `/collections`, `/catalogues`).

**Verification:**
- Terminal output of all quality gates returns exit code 0.

**Acceptance Criteria:**
- Zero TypeScript errors.
- All unit tests pass.
- Clean production build.

---

## Task 10: Release Gate, External Verifications & Client Approval

**Intended Outcome:**
Gate the production public cutover on explicit client verifications and deployment checks.

**Prerequisites:** Task 9.

**Checklist & Gates:**
1. **NAP Verification Gate:**
   - Confirm verified address spelling on Google Business Profile (`Kasidih, near Baradwari Durga Puja Maidan` vs `Kashidih`).
   - Confirm status of secondary phone `+91 70336 50739`.
2. **Upstream Redirect Gate:**
   - Verify that `jamshedpurhardware.com` registrar/ELB forwarding is updated to forward directly to `https://www.hardwarecollection.co/$1` in 1 hop.
3. **Deployment Indexing Gate:**
   - Verify `hc-demo-ten.vercel.app` returns `X-Robots-Tag: noindex, nofollow`.
   - Verify production deployment receives `SITE_INDEXABLE=true` only upon authorized public launch.
4. **Client Approval Sign-off:**
   - Present final staging site to client/owner (Mukesh) for formal launch sign-off before DNS cutover.

**Acceptance Criteria:**
- All 4 release checklist items verified before public DNS cutover.
