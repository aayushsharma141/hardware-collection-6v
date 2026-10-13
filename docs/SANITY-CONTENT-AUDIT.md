# Sanity Content Audit (Phase A, read-only)

Measured 2026-10-13 against the `production` dataset and the schema registered in
`src/content/sanity/schemaTypes/index.ts`. Nothing was written to Sanity or to code
during this audit.

**Dataset:** 126 documents (124 published, 2 drafts), 103 assets, 0 broken references.
**Schema:** 16 document types, 4 object types.

---

## 1. Why Studio shows "undefined" and "unknown field"

Every warning an editor sees falls into one of four causes. Each has a different fix.

### A. Data stored in fields the schema does not declare → Studio "Unknown field" banner

| Type | Stored field | Docs | Read by the site? | Origin |
|---|---|---|---|---|
| testimonial | `quote`, `source`, `date`, `approved` | 5/5 | **Yes**, `getTestimonialsQuery` reads all four | Seeded from Google reviews in a shape the schema never had |
| brand | `brandName` | 24/24 | No (`"brandName"` in queries is an alias of `brand->name`) | Brand migration |
| brand | `catalogType` | 15/24 | No | Catalogue migration |
| category | `status` | 13/53 | No | Field removed from schema; values left behind |
| siteSettings | `mainLogo` | 1 | Projected by `getSiteSettings`, used by no component | Field not in schema |
| homePage | `heroSlides` (3 slides) | 1 | No | Pre-Hero-Manager hero |

### B. Values outside a field's allowed list → Studio "Value did not match"

`category.primaryRail` is set on **53 of 53** categories, and every value is one of the
five pre-2026-10-06 rails (`door-hardware`, `handles-knobs`, `kitchen-wardrobes`,
`bathroom`, `furniture-hardware`). The schema only allows the seven family ids.
The site is unaffected because `railGroupId()` in `src/lib/collections/showroom.ts`
translates through `CANONICAL_CATEGORY_FAMILY` and `LEGACY_FAMILY`. Studio has no
translation, so every category form shows an invalid value.

### C. Required fields that are empty → Studio disables Publish

| Field | Empty on | Consequence |
|---|---|---|
| `testimonial.testimonialText` | 5/5 | No testimonial can be re-published after an edit. The text lives in `quote` (cause A) |
| `homePage.heroHeadline` | 1/1 | Homepage Content cannot be published. **Trap:** filling it in replaces the first hero slide's title (`src/app/page.tsx:123`) |
| `product.brand` | 1/11 (`3PbNCBB2cZv8B31WUkE8jD`) | That product cannot be re-published; its card shows no brand |

### D. Fields that exist but are never filled, never read, or both

| Type | Filled but **never shown** | Never filled and never read |
|---|---|---|
| category | `keyFeatures` (48/53), `brands` (10/53) | `applications`, `materialFinishOptions`, `gallery`, `catalogues`, `verificationStatus`, `overview`, `suitableFor` |
| product | — | `overview`, `productGallery`, `features`, `applications`, `suitableFor`, `materialFinish`, `whatsappCtaEnabled`, `ctaMessage`, `relatedProducts`, `curatedCollections`, `officialFiles`, `images`, `subcategory` |
| brand | — | `brandStory`, `knownFor`, `usp`, `popularCategories`, `dealerCertificate`, `showBrand`, `showOnHomepage` |
| siteSettings | — | `businessName` and `ownerName` are filled but never read |
| navigation | — | `socialLinks` (2 entries) is never read |
| Whole types | `space` (6 docs, no query) | `subcategory`, `curatedCollection`, `gallery`, `faq` have 0 documents. `faq` is queried on the homepage and returns nothing |

Fields in the "filled but never shown" column are the most misleading for staff:
editors keep that content up to date and nothing on the site changes.

---

## 2. Content map by nature

| Content | Nature | Studio location | Feeds | State |
|---|---|---|---|---|
| **Business details** (`siteSettings`) | Singleton, set once | Showroom › Business Settings | Header, footer, WhatsApp links, all pages | Published OK. **A draft is pending** (see H4) |
| **Navigation** | Singleton | Showroom › Navigation | `layout.tsx` (announcement, menu, legal links) | Menu still points to `/catalogs` |
| **Homepage** (`homePage`) | Singleton, curated references | Showroom › Homepage Content | `/` sections. Hero slide 1 text only, from empty fields → hardcoded | Publish blocked (C) |
| **Hero Manager** | Singleton, slide placement | Showroom › Hero Manager | **`/collections` only**. `homeHero` is ignored by `/` | 1 home + 1 collection slide, both type "offer" |
| **Offers** | Time-boxed, many | Showroom › Offers & Deals | Home hero (via `visibleOnHome`), collections hero and band | 3 active. 0 images. "Premium Kitchen Upgrade" is shown nowhere |
| **Products** | Catalogue, many | Catalogue › Products | `/collections` cards and drawer, homepage featured | 11. Only list fields and `specifications` are read |
| **Categories** | Taxonomy | Catalogue › Categories | `/collections` grouping via `primaryRail` | 53 (13 are canonical). 8 have products. All rails are legacy values (B) |
| **Brands** | Reference, partner identity | Catalogue › Brands | `/catalogues`, trust strip, product cards | 24. Duplicates (H2). 4 without logos: becker, decor-bath, dorio, maranello |
| **Catalogues** | PDF documents | Catalogue › Catalogues (PDFs) | `/catalogues` viewer via `/api/catalog/[slug]/[index]` | 16, all linked to a brand and a category |
| **Testimonials** | Social proof | Content › Testimonials | Homepage reviews | 5. Text unreadable in Studio (A, C) |
| **Legal pages** | Static text | Legal Pages | `/privacy`, `/terms` | 2 published |
| Spaces, Sub-categories, Gallery, FAQs | — | Visible in the desk | Nothing (FAQ: queried, empty) | Clutter for trainees |

---

## 3. Findings by severity

### Status, 2026-10-13

- **C1 fixed:** brands and search matches now carry a 12-character `pdfVersion`
  or `version` fingerprint instead of a URL or asset id (`src/lib/catalog/viewOnly.ts`).
  Measured on `/`, `/collections` and `/catalogues`: 0 CDN URLs, 0 full file hashes.
- **M4 fixed:** `document.singletons` and `document.actions` in `sanity.config.ts`.
  Checked in Studio: no Delete, Unpublish or Duplicate; absent from the create menu.
- **M5 fixed in code:** `Navbar.tsx` links `/catalogues` (0 `/catalogs` hrefs on `/`).
  The Navigation document still stores `/catalogs`; edit it in Studio.
- **C3 fixed:** catalogue text indexes moved from `public/search-indexes/` (publicly
  downloadable, with full text and asset ids) to the private `catalog-index/`. The viewer
  searches through `GET /api/catalog/[slug]/[index]/search`, which returns only page numbers
  and snippets (2.4 KB for "hinge" in Hafele, against 155 KB of full text before), rate
  limited to 30 per minute per IP. The old URL returns 404, and the production build traces
  the folder into `/collections` and the search route.

### Critical

**C1. All 16 catalogue PDF URLs are back in the `/catalogues` page source.**
`getBrandsQuery` (`queries.ts:70`) projects `"pdfUrl": pdfFile.asset->url`, and
`CatalogsClient.tsx:55`, `lib/catalog/search/verifyMatch.ts:19` and
`lib/collections/brandLinks.ts:17` now read it on the client. Measured: 16 unique
`cdn.sanity.io/files/…pdf` URLs in the HTML. This breaks the view-only
requirement. *Fix:* project `"assetId": pdfFile.asset._ref` (or a boolean
`hasPdf`) instead of the URL, and switch the three readers to it. The indexing
pipeline (`lib/catalog/indexing/sources.ts`) runs on the server and can keep URLs.
*Risk:* moderate. It touches the catalogue-search feature, which another agent
built, so that feature's tests must pass afterwards.

**C2. Testimonials cannot be edited.** The text is in `quote`, which Studio does
not show. The required `testimonialText` is empty, so Publish is disabled.
*Fix:* either add `quote`/`source`/`date`/`approved` to the schema, or migrate
`quote → testimonialText` and add `source`, `date` and `approved` to the schema
(the query already coalesces both). *Risk:* low.

### High

**H1. `primaryRail` holds legacy values on all 53 categories.** *Fix:* a migration
that writes `railGroupId(primaryRail, slug)`, the exact value the site computes
today. Grouping on `/collections` stays the same by construction. Then add
`rule.required()`. *Risk:* low with a dry run. This is a production write and
needs your approval.

**H2. Duplicate brands.** `brand-maranello` and `brand-marnello` share the slug
`maranello`. `brand-decor-bath` and `brand-decore` are both named "Decor Bath".
In each pair, the catalogue is attached to the second document. *Fix:* keep one
document per brand, re-point its references, and delete the other. This needs
your decision on which spelling and slug to keep.

**H3. The homepage hero has two controls, and only one works.** The Hero Manager
"Home" slides are never read by `/`. The homepage hero is built from hardcoded
`fallbackHeroSlides` plus offers that have `visibleOnHome` switched on.
`/collections` does read its Hero Manager slides. An editor who arranges home
slides in Hero Manager sees no change on the site. *Fix:* pick one model (Hero
Manager for both pages is the documented intent) and wire `/` to it.

**H4. An unpublished `siteSettings` draft (since 2026-09-28) contains
contradictory opening hours:** "Mon - Sat: 10:30 AM - 8:30 PM / Tuesday: Closed".
It also changes the Maps URL to `maps.app.goo.gl/6qokJfpuQgfNwqZK9`. Anyone who
clicks Publish on Business Settings puts these live. The published hours,
"Wed–Mon 10–8, Tue 10–2", match the code fallback. *Fix:* confirm the real
hours with the owner, then publish or discard the draft.

**H5. Unknown fields (cause A, apart from testimonials).** *Fix:* unset
`brand.brandName`, `brand.catalogType`, `category.status` and
`homePage.heroSlides` in a migration. For `siteSettings.mainLogo`, decide whether
the logo should be editable. If yes, add the field. If no, unset it and remove
the projection. *Risk:* low. No component reads these fields.

### Medium

- **M1.** Product `3PbNCBB2cZv8B31WUkE8jD` (Door Hardware) has no brand.
- **M2.** None of the 3 offers has an image, so offer hero slides fall back to
  stock product art. "Premium Kitchen Upgrade" has both visibility toggles off.
- **M3.** Category `keyFeatures` (48 filled) and `brands` (10 filled) are never
  displayed. Either show them or hide them.
- **M4.** Singletons are not protected. `sanity.config.ts` has no
  `document.actions` or `newDocumentOptions` filter, so Homepage, Hero Manager,
  Business Settings and Navigation can be duplicated or deleted.
- **M5.** The CMS navigation menu and `Navbar.tsx` still use `/catalogs`. That
  costs a 308 redirect hop, and the nav item never shows as active.
- **M6.** `siteSettings.email` is `info@hardwarecollection.in`. Project notes say
  the `.in` domain is not ours, so confirm this address receives mail.
- **M7.** 40 of the 53 categories are outside the 13-category vocabulary in
  `CLAUDE.md`, and 45 have no products. They are hidden on the site, but each
  one appears in every category picker in Studio.

### Low

- Dead schema surface (cause D): 13 product fields, 7 brand fields and 4 empty
  document types. Hide them from the desk before removing anything.
- `seo` is empty on every brand, product, category and legal page.
- 2 published navigation social links are never rendered.

---

## 4. Corrections to the earlier pasted audit

- `siteSettings` has **no** `mainLogo` or `mainLogoInverse` field in the schema.
  The query projects them anyway.
- The Hero Manager does **not** drive the homepage hero (H3).
- The dataset has **53** categories, not 13.
- `primaryRail` cannot be made required until H1 has migrated the data, or every
  category fails validation.

---

## 5. Proposed sequence

1. **No-data-risk code fixes:** C1 (URL leak), M5 (`/catalogs` links), M4 (singleton guards).
2. **Schema alignment:** C2 (testimonial fields), plus `mainLogo` once decided.
3. **Migrations, dry run first, needs your approval:** H1 (rails), H5 (unset fields), C2 (`quote → testimonialText`, if chosen).
4. **Owner decisions:** H2 (brand duplicates), H4 (opening hours), M6 (email), H3 (hero model).
5. **Studio simplification:** hide dead fields and types, use plain-English labels, add `required()` on `primaryRail`.

Steps 1 and 2 change no content. Step 3 changes stored values in a way the
site already reads identically.
