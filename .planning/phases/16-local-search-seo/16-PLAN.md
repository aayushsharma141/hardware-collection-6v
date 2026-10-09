# Phase 16: Local Search Entity & SEO Foundation — Execution Plan

**Objective:** Implement the technical SEO foundation, local search entity authority, and crawlability architecture while preserving the locked 3-route structure and 7-family taxonomy. 

**Constraints & Rules:**
- Do not create `/collections/[slug]` or `/brands/[slug]`.
- Do not add unverified address/phone data to production schema. (Marked as external dependencies).
- Ensure all 7 showroom families and Sanity categories are server-rendered.
- Production release is pending client approval; verify locally and on preview deployments.

---

## Task 1: Canonical Host & Domain Redirection Strategy
**Outcome:** Unified canonical host and single-hop redirect from legacy domain.
**Files Modified:** `next.config.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/layout.tsx`, `src/app/collections/page.tsx`, `src/app/catalogues/page.tsx`
**Dependencies:** Vercel dashboard access (for final DNS config).
**Implementation:**
1. Standardize on exactly one canonical host (e.g., `https://www.hardwarecollection.co`) in all codebase references (`sitemap.ts`, `layout.tsx` JSON-LD, metadata canonical links).
2. Configure `redirects()` in `next.config.ts` to enforce the chosen canonical host internally if necessary.
3. Configure `jamshedpurhardware.com` to redirect directly to the canonical host in a single hop while preserving paths (usually configured in Vercel, but documented in codebase if middleware/config is used).
**Verification:** Run `npm run build` & check canonical URLs in output. (Manual check: Use a redirect checker on `jamshedpurhardware.com/collections` to verify single-hop).
**External Dependency:** Domain configurations in Vercel require owner access.

## Task 2: Preview Environment Indexation Controls
**Outcome:** Prevent search engines from indexing non-production preview deployments (`*.vercel.app`).
**Files Modified:** `next.config.ts`
**Implementation:**
1. Add a `headers()` function to `next.config.ts` that applies `X-Robots-Tag: noindex, nofollow` to all routes (`source: '/(.*)'`) when the `VERCEL_ENV` is not `production`.
**Verification:** Deploy to a Vercel preview environment and verify the `X-Robots-Tag` header is present. Ensure it is NOT present in production builds.

## Task 3: Homepage H1 Unification & Metadata
**Outcome:** A single semantic `<h1>` on the homepage and front-loaded metadata.
**Files Modified:** `src/app/page.tsx`, `src/components/home/HeroMobile.tsx`, `src/components/home/HeroStage.tsx`
**Implementation:**
1. Update `src/app/page.tsx` metadata:
   - Title: `Architectural Hardware Showroom in Sakchi, Jamshedpur | Hardware Collection`
   - Description: `Hardware Collection is a premium architectural hardware showroom in Sakchi, Jamshedpur, offering door hardware, digital locks, kitchen and wardrobe systems, bathroom and glass hardware from authorized brands.`
2. Refactor `HeroStage.tsx` and `HeroMobile.tsx` to render a single semantic `<h1>Architectural Hardware Showroom in Sakchi, Jamshedpur</h1>` in the DOM, while maintaining the visual dual-layer editorial headline "The Art of the Finish." visually without duplicating the `<h1>` tag (e.g. use `div` or `p` for the visual headline, or use a single `sr-only` H1).
**Verification:** Inspect DOM on homepage (desktop and mobile viewports) and run an automated script (e.g., `document.querySelectorAll('h1').length === 1`) to guarantee exactly one H1 exists.

## Task 4: Collections Page Metadata & H1
**Outcome:** Addition of the missing semantic H1 and metadata on `/collections`.
**Files Modified:** `src/app/collections/page.tsx`, `src/components/collections/CollectionsClient.tsx` (or where the H1 should reside).
**Implementation:**
1. Update `metadata` in `src/app/collections/page.tsx` as per the Context (Title: `Architectural Hardware Collections | Door, Kitchen & Wardrobe Hardware`).
2. Add the semantic `<h1>Architectural Hardware Collections</h1>` to the page rendering hierarchy.
**Verification:** Verify `/collections` page renders exactly one `<h1>`.

## Task 5: Catalogues Page Metadata & H1 Verification
**Outcome:** Single semantic H1 and exact metadata on `/catalogues`.
**Files Modified:** `src/app/catalogues/page.tsx`, `src/components/catalog/BrandsDirectoryView.tsx` (or `CatalogLibrary.tsx`).
**Implementation:**
1. Update `metadata` in `src/app/catalogues/page.tsx` (Title: `Brands & Catalogues | Authorized Hardware Brands in Jamshedpur`).
2. Ensure exactly one `<h1>Brands & Catalogues</h1>` exists on the `/catalogues` surface.
**Verification:** Verify `/catalogues` page renders exactly one `<h1>`.

## Task 6: Crawlable Taxonomy (Server-Rendered HTML)
**Outcome:** All 7 showroom families and Sanity categories exist in the initial HTML for Googlebot.
**Files Modified:** `src/components/collections/CollectionExplorer.tsx`
**Implementation:**
1. Refactor `CollectionExplorer.tsx` from conditional rendering (`{!activeSection ? Level1 : Level2}`) to a structure where the Category (Level 2) items are always in the DOM but hidden via CSS (`display: none` or `opacity: 0` / `height: 0` with `aria-hidden="true"`, or using native `<details>`/`<summary>`) when not active. 
2. Ensure the text for categories (`Door Hardware`, `Main Door Handles`, etc.) is fully present in the unhydrated HTML payload from the server.
**Verification:** Run `curl http://localhost:3000/collections` (or view page source) and verify category text strings (e.g., "Main Door Handles") are present in the raw HTML payload.

## Task 7: Bidirectional Cross-Linking
**Outcome:** Crawlable standard anchor links bridging `/collections` and `/catalogues`.
**Files Modified:** `src/app/collections/page.tsx`, `src/app/catalogues/page.tsx` (or child client components).
**Implementation:**
1. Add a banner/link in `/collections`: `"Looking for a specific manufacturer? Explore Brands & Catalogues →"` linking to `/catalogues` using `next/link`.
2. Add a banner/link in `/catalogues`: `"Not sure which brand you need? Start with Collections →"` linking to `/collections`.
**Verification:** Run Playwright or click-test locally to ensure `next/link` routes successfully without layout shifts.

## Task 8: Structured Data (Schema.org) & NAP Consistency
**Outcome:** Accurate `HardwareStore` entity schema without leaking unverified data.
**Files Modified:** `src/app/layout.tsx`, `src/lib/config.ts`
**Implementation:**
1. Change `@type: "LocalBusiness"` to `@type: "HardwareStore"` in the JSON-LD of `src/app/layout.tsx`.
2. **External Dependency Check:** Ensure the secondary phone `+91 70336 50739` and precise address spelling `Kasidih, near Baradwari Durga Puja Maidan` are **EXCLUDED** from the schema *unless* `getSiteSettings()` explicitly provides them as verified. If `getSiteSettings()` returns null, fallback to `config.ts` which MUST NOT hardcode unverified data into the JSON-LD (e.g. use only the verified primary WhatsApp number).
**Verification:** Paste the HTML source of the homepage into the Schema Markup Validator and verify the type is `HardwareStore` and contains no unverified secondary phone numbers.

## Task 9: Sitemap Update
**Outcome:** Ensure all three public routes are correctly prioritized in `sitemap.xml`.
**Files Modified:** `src/app/sitemap.ts`
**Implementation:**
1. Add `https://www.hardwarecollection.co/catalogues` to the sitemap array.
2. Set priority to `0.8` and `changeFrequency` to `weekly`.
**Verification:** Access `/sitemap.xml` locally and verify the presence of all 3 routes with the correct canonical host.

## Task 10: Final Audit & Release Gate
**Outcome:** Pre-release technical safety verification.
**Implementation:**
1. Run `npm run lint` and `npx tsc --noEmit`.
2. Run `npm test`.
3. Run `npm run build` to ensure no SSG compilation errors.
4. Obtain final client confirmation on NAP data before deploying to production.
**Verification:** Automated CI gates pass + manual owner sign-off.
