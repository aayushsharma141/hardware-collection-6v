# Phase 9: Collections Guided Discovery Redesign - Pattern Map

**Mapped:** 2026-08-29
**Files analyzed:** 27 (new + modified, per CONTEXT.md code_context, RESEARCH.md structure recommendation, and 09-UI-SPEC.md Component Inventory)
**Analogs found:** 25 / 27

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/app/collections/[slug]/page.tsx` | route (server component) | request-response | `src/app/collections/page.tsx` | role-match (new dynamic segment; only sibling for the async-params idiom is `src/app/studio/[[...tool]]/page.tsx`) |
| `src/components/collections/CategoryDetailClient.tsx` | component (client) | request-response | `src/app/collections/CollectionsClient.tsx` | exact (same server/client split, same hook-consumption shape) |
| `src/sanity/schemaTypes/space.ts` | model (Sanity schema) | CRUD | `src/sanity/schemaTypes/curatedCollection.ts` (structure) + `src/sanity/schemaTypes/subcategory.ts` (reference-array idiom) | exact |
| `src/sanity/schemaTypes/category.ts` (ADD `heroImage`, `gallery[]`, `searchKeywords[]`) | model (Sanity schema) | CRUD | itself (additive edit — see current `image`/`brands[]` fields) | exact |
| `src/sanity/schemaTypes/product.ts` (ADD `searchKeywords[]`) | model (Sanity schema) | CRUD | itself (additive edit — see `features`/`finishes` string-array fields) | exact |
| `src/sanity/schemaTypes/siteSettings.ts` (ADD `defaultCategoryImage`) | model (Sanity schema) | CRUD | itself (additive edit — see grouped-field convention) | exact |
| `src/sanity/schemaTypes/index.ts` (register `spaceType`) | config | CRUD | itself | exact |
| `src/sanity/queries.ts` (ADD `getCategoryBySlugQuery`, `getSpacesQuery`, `getCountsQuery`) | service (GROQ query module) | CRUD | itself — `getProductsByCategoryQuery` (parameterized single-arg pattern) | exact |
| `src/components/collections/SpaceIntentRail.tsx` | component (client) | request-response / scroll-driven | `src/components/home/CategoryDiscovery.tsx` (desktop seam-grid) + `src/components/home/ProductReel.tsx` (mobile CSS-snap rail) | role-match |
| `src/components/collections/CollectionsHero.tsx` | component (client) | request-response | `src/app/collections/CollectionsClient.tsx` lines 77-114 (masthead block, extracted) | exact |
| `src/components/collections/CollectionIndex.tsx` | component (client) | request-response | `src/components/collections/CollectionFilterRail.tsx` (`.index-row` anatomy, rebuilt as full-width list not sidebar) | role-match |
| `src/components/collections/FeaturedChapters.tsx` | component (client) | request-response | `src/components/home/CategoryDiscovery.tsx` (card/threshold anatomy) + `src/components/home/ProductReel.tsx` (alternation/chapter framing) | role-match |
| `src/components/collections/CompactCollectionGrid.tsx` | component (client) | request-response | `src/components/home/CategoryDiscovery.tsx` `.threshold-card` treatment | role-match |
| `src/components/collections/BrandDiscovery.tsx` | component (client) | request-response | `src/components/home/InteractiveBrandWall.tsx` (featured tier) + `src/components/BrandTrustStrip.tsx` (alphabetical logo-wall tier, ticker removed) | exact (two-tier composite of two existing components) |
| `src/components/collections/CollectionSearch.tsx` | component (client) | request-response | `src/components/collections/CollectionSearchBar.tsx` (input field chrome, filter dropdown removed) | role-match |
| `src/components/collections/ProductCard.tsx` | component (client) | request-response | itself (retained, edited: drop `spanClass` filter-driven grid logic) | exact |
| `src/components/collections/ShortlistPill.tsx` | component (client) | request-response | itself (retained unchanged) | exact |
| `src/components/collections/ProductDetailDrawer.tsx` | component (client) | request-response | itself (retained unchanged) | exact |
| `src/hooks/useCollectionsState.ts` (edit: remove filter state, add image-fallback chain, search-keyword match) | hook | transform | itself (edit in place) | exact |
| `src/data/catalog.ts` (widen `Product.brand` union; reconcile `BRANDS`) | model (static data) | CRUD | `src/components/catalog/CatalogLibrary.tsx` `BRAND_REGISTRY`/`BRAND_ALIASES` (source of truth to reconcile from) | exact |
| `src/components/BrandTrustStrip.tsx` (remove Jaquar/Asian Paints/Philips; repoint hrefs) | component (client) | request-response | itself (edit in place) + `CatalogLibrary.tsx` alias pattern | exact |
| `src/components/Footer.tsx` (repoint `?category=`/`?brand=` links) | component | request-response | itself (edit in place) | exact |
| `src/components/home/CategoryDiscovery.tsx` (repoint hrefs to space slugs) | component | request-response | itself (edit in place) | exact |
| `src/components/home/ProductReel.tsx` (repoint hrefs) | component | request-response | itself (edit in place) | exact |
| `src/components/home/InteractiveBrandWall.tsx` (repoint hrefs to drawer-open, dead code but pattern reused) | component | event-driven | `src/components/collections/BrandDiscovery.tsx`'s new consultation-drawer-open pattern (see Shared Patterns) | role-match |
| `src/data/home.ts` (CATEGORY_FAMILIES/SIGNATURE_PIECES href repoint) | model (static data) | CRUD | itself (edit in place) | exact |
| `src/data/__tests__/brands.test.ts` | test | transform | `src/lib/__tests__/catalogFiltering.test.ts` | role-match |
| `src/data/__tests__/homeLinks.test.ts` | test | transform | `src/lib/__tests__/catalogFiltering.test.ts` | role-match |
| `src/components/collections/__tests__/FeaturedChapters.test.ts` | test | transform | `src/hooks/__tests__/useCollectionsState.test.ts` | no analog (new `__tests__` directory under `components/collections/`) — see No Analog Found |

## Pattern Assignments

### `src/app/collections/[slug]/page.tsx` (route, request-response)

**Analog:** `src/app/collections/page.tsx` (server/client split convention) — this project has exactly one existing dynamic-segment file, `src/app/studio/[[...tool]]/page.tsx`, which is not a data-fetching analog (it wraps `NextStudio` with no params), so the `async params` idiom must come from RESEARCH.md's verified Next.js 16.3.3 doc pattern, not from an in-repo precedent.

**Imports + revalidate pattern** (`src/app/collections/page.tsx` lines 1-8):
```tsx
import React, { Suspense } from "react";
import CollectionsClient from "./CollectionsClient";
import { getCategories, getSubcategories, getAllProducts, getBrands, getSiteSettings } from "@/sanity/queries";
import { CATEGORIES, BRANDS, PRODUCTS } from "@/data/catalog";
import { Category, Product, Brand } from "@/types/catalog";

// Use Next.js revalidation strategy for Sanity content
export const revalidate = 60; // Revalidate every 60 seconds
```

**Server component fetch + Suspense wrap pattern** (lines 10-56):
```tsx
export default async function CollectionsPage() {
  const sanityCategories = await getCategories();
  const sanityProducts = await getAllProducts();
  const sanityBrands = await getBrands();
  const settings = await getSiteSettings();
  // ... merge Sanity + static fallback (do NOT replicate this merge for [slug] —
  // the new getCategoryBySlug/getSpaceBySlug queries return a single doc, not a
  // list needing static-fallback merge)

  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-[#0E0C0C] flex items-center justify-center font-dmsans text-xs uppercase tracking-widest text-[#A39E93]">Loading collections...</div>}>
      <CollectionsClient categories={categories} subcategories={sanitySubcategories} products={products} brands={brands} settings={settings} />
    </Suspense>
  );
}
```

**Required async-params idiom for the new file** (from RESEARCH.md, verified against Next.js 16.3.3 official docs — no in-repo precedent exists, this is the one place this phase introduces a genuinely new pattern):
```tsx
import { notFound } from "next/navigation";
import { getCategoryBySlug, getSpaceBySlug, getProductsByCategory, getSiteSettings, getBrands } from "@/sanity/queries";

export const revalidate = 60; // match src/app/collections/page.tsx convention exactly

export async function generateStaticParams() {
  const categories = await getCategorySlugs(); // new, minimal: *[_type=="category"]{ "slug": slug.current }
  return categories.map((c) => ({ slug: c.slug }));
  // dynamicParams defaults to true — do not set it to false (see RESEARCH.md Anti-Patterns)
}

export default async function CollectionOrSpacePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  // D-24: resolve space first, then category — do not build a second route
  const space = await getSpaceBySlug(slug);
  if (space) {
    return <SpaceLandingClient space={space} />; // renders linkedCategories via CompactCollectionGrid
  }
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [products, brands, settings] = await Promise.all([
    getProductsByCategory(slug), // EXISTING query, do not call getAllProducts()
    getBrands(),
    getSiteSettings(),
  ]);

  return <CategoryDetailClient category={category} products={products} brands={brands} settings={settings} />;
}
```

**Error handling:** No existing page in this codebase uses `try/catch` at the page-component level — all error handling lives inside the `queries.ts` fetch functions themselves (`try { ... } catch { console.error(...); return [] / null; }`, see Pattern Assignments for `queries.ts` below). The route itself only ever calls `notFound()` for a missing slug (standard Next.js `next/navigation` import, no existing in-repo call site — this is this phase's first use, correctly modeled on the Next.js docs).

---

### `src/components/collections/CategoryDetailClient.tsx` (component, request-response)

**Analog:** `src/app/collections/CollectionsClient.tsx` (full file, 285 lines — small enough for single read).

**Imports pattern** (lines 1-23):
```tsx
"use client";

import React from "react";
import Footer from "@/components/Footer";
import { MessageCircle, Compass } from "lucide-react";
import { FloatingConsultationCapsule } from "@/components/consultation/FloatingConsultationCapsule";
import { AnimatePresence } from "motion/react";
import {
  Product,
  Category,
  Subcategory,
  Brand,
  SiteSettings,
  getSlugString,
} from "@/types/catalog";
import { useCollectionsState, SHOWROOM_FAMILIES_NAV } from "@/hooks/useCollectionsState";

import ProductCard from "@/components/collections/ProductCard";
import ShortlistPill from "@/components/collections/ShortlistPill";
import ProductDetailDrawer from "@/components/collections/ProductDetailDrawer";
```
Drop `CollectionFilterRail`, `CollectionSearchBar`, `MobileFilters` imports (D-18 removal) — `CategoryDetailClient` has no filter UI at all, it renders one category's fixed product set.

**Props interface convention** (lines 25-31):
```tsx
export interface CollectionsClientProps {
  categories: Category[];
  subcategories?: Subcategory[];
  products: Product[];
  brands: Brand[];
  settings?: SiteSettings | null;
}
```
Mirror this shape for `CategoryDetailClientProps` but with a single `category: Category` (not `categories[]`) plus `products: Product[]` already scoped server-side.

**Empty-state panel pattern to reuse verbatim for D-13's empty-category variant** (lines 167-200):
```tsx
{displayCategories.length === 0 && (
  <div className="bg-[#11100f] border border-white/[0.12] p-12 text-center my-6">
    <Compass className="w-10 h-10 text-[#c8a96e] mx-auto mb-3 stroke-[1.5]" />
    <h2 className="hc-serif text-3xl text-white mb-2 uppercase" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
      {/* swap copy for D-13's "See {Category Name} at Our Sakchi Showroom" */}
    </h2>
    <p className="font-dmsans text-xs md:text-sm text-[#aaa49a] max-w-md mx-auto mb-6 leading-relaxed font-light">
      {/* copy per Copywriting Contract */}
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a
        href={`https://wa.me/${settings?.whatsappNumber || "919835190738"}?text=...`}
        target="_blank" rel="noopener noreferrer"
        className="brass-plate px-7 py-3.5 bg-[#c8a96e] text-[#090909] font-dmsans font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 no-underline"
      >
        <MessageCircle className="w-4 h-4 fill-current" />
        <span>Consult on WhatsApp</span>
      </a>
    </div>
  </div>
)}
```

**Product grid + AnimatePresence pattern** (lines 226-246):
```tsx
<div className="grid grid-cols-1 md:grid-cols-12 gap-5">
  <AnimatePresence mode="popLayout">
    {cat.products.map((prod: Product, idx: number) => {
      const isShortlisted = shortlist.some(p => (p._id || p.id) === (prod._id || prod.id));
      const displayImg = getProductDisplayImage(prod);
      return (
        <ProductCard
          key={prod._id || prod.id}
          product={prod}
          index={idx}
          totalInCategory={cat.products.length}
          isShortlisted={isShortlisted}
          onSelect={handleProductSelect}
          onToggleShortlist={toggleShortlist}
          displayImage={displayImg}
        />
      );
    })}
  </AnimatePresence>
</div>
```

**Retained drawer + shortlist + footer composition** (lines 257-282) — copy verbatim, only `categories`/`products` scope changes:
```tsx
<ShortlistPill shortlist={shortlist} shortlistToast={shortlistToast} whatsappLink={getWhatsAppShortlistLink()} onClear={() => setShortlist([])} />
<ProductDetailDrawer product={selectedProduct} onClose={() => handleProductSelect(null)} shortlist={shortlist} onToggleShortlist={toggleShortlist} displayImage={selectedProduct ? getProductDisplayImage(selectedProduct) : ""} />
<FloatingConsultationCapsule />
<Footer settings={settings || undefined} brands={brands} />
```

---

### `src/sanity/schemaTypes/space.ts` (model, CRUD)

**Analog:** `src/sanity/schemaTypes/curatedCollection.ts` (full file, 58 lines) for the base document shape; `src/sanity/schemaTypes/subcategory.ts` for the `reference` field idiom (`linkedCategories[]` needs an array-of-references, subcategory.ts only has a single reference, so combine with `product.ts`'s `curatedCollections` array-of-reference field, lines 44-50).

**`defineType`/`defineField` idiom** (`curatedCollection.ts` lines 1-49, adapted):
```ts
import { defineField, defineType } from "sanity";

export const spaceType = defineType({
  name: "space",
  title: "Space",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Space Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule) =>
        rule.required().custom((value) =>
          value?.current === "spaces"
            ? 'Slug cannot be "spaces" — reserved.'
            : true
          // D-27: also add cross-type uniqueness check here (async custom
          // validator querying *[_type in ["space","category"] && slug.current == $slug && _id != $id])
        ),
    }),
    defineField({
      name: "image",
      title: "Space Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "linkedCategories",
      title: "Linked Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "description", media: "image" },
  },
});
```

**Reference-array field idiom to mirror for `linkedCategories`** (`src/sanity/schemaTypes/product.ts` lines 44-50):
```ts
defineField({
  name: "curatedCollections",
  title: "Curated Collections",
  type: "array",
  of: [{ type: "reference", to: [{ type: "curatedCollection" }] }],
  description: "Optional: Merchandising collections this product belongs to (e.g., 'Italian Collection').",
}),
```

**Registration pattern** (`src/sanity/schemaTypes/index.ts`, full file, 15 lines):
```ts
import { type SchemaTypeDefinition } from "sanity";

import { categoryType } from "./category";
import { subcategoryType } from "./subcategory";
import { curatedCollectionType } from "./curatedCollection";
import { brandType } from "./brand";
import { productType } from "./product";
import { testimonialType } from "./testimonial";
import { homePageType } from "./homePage";
import { siteSettingsType } from "./siteSettings";
// ADD: import { spaceType } from "./space";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType, subcategoryType, curatedCollectionType, brandType, productType, testimonialType, homePageType, siteSettingsType /* , spaceType */],
};
```

---

### `src/sanity/schemaTypes/category.ts` (model, additive edit)

**Analog:** itself. Existing `image` field to mirror for the new `heroImage` and `gallery[]` fields (lines 122-129):
```ts
defineField({
  name: "image",
  title: "Category Hero Image",
  type: "image",
  options: { hotspot: true },
}),
```
For `heroImage`, copy this block, rename `name: "heroImage"`, `title: "Cinematic Hero Image"`. For `gallery[]`, wrap the same `image` type in an array (mirrors `product.ts` `images[]`, lines 96-105):
```ts
defineField({
  name: "images",
  title: "Images",
  type: "array",
  of: [{ type: "image", options: { hotspot: true } }],
}),
```
For `searchKeywords[]`, mirror the existing `keyFeatures` string-array field (lines 110-115):
```ts
defineField({
  name: "keyFeatures",
  title: "Key Features",
  type: "array",
  of: [{ type: "string" }],
}),
```
Rename to `searchKeywords`, title "Search Keywords / Synonyms", add a `description` noting these are customer-language search terms (D-14).

**D-27 cross-type slug uniqueness:** the existing `slug` field (lines 14-22) uses only `validation: (rule) => rule.required()`. Extend with the same custom async validator described in the `space.ts` block above — both schemas need the matching validator, checking against `*[_type in ["space","category"]]`.

---

### `src/sanity/schemaTypes/product.ts` (model, additive edit)

**Analog:** itself. Mirror the `features`/`finishes` string-array idiom (lines 63-68 and 84-88) for the new `searchKeywords[]` field — identical shape to the `category.ts` addition above, same field name so both types can share one client-side matcher function.

---

### `src/sanity/schemaTypes/siteSettings.ts` (model, additive edit)

**Analog:** itself (full file, 85 lines). Mirror the grouped-field convention (`group: "contact"` / `group: "location"`) for the new `defaultCategoryImage` field — add a new group (e.g. `{ name: "media", title: "Media Defaults" }`) and a field shaped like the existing `image`-type fields elsewhere in the schema set:
```ts
defineField({
  name: "defaultCategoryImage",
  title: "Default Category Fallback Image",
  type: "image",
  group: "media",
  options: { hotspot: true },
  description: "Used when a category has no heroImage/image and a product has no images[] (D-12 resolution chain terminus).",
}),
```

---

### `src/sanity/queries.ts` (service, CRUD — GROQ query module)

**Analog:** itself. This is the single most load-bearing file for this phase's data layer (full file, 228 lines — read once, no re-read needed).

**Parameterized `$param` idiom already used correctly — the exact pattern to copy** (lines 60-74):
```ts
export const getProductsByCategoryQuery = groq`
  *[_type == "product" && category->slug.current == $categorySlug] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    "brandName": brand->name,
    "categorySlug": category->slug.current,
    shortDescription,
    "imageUrl": images[0].asset->url,
    "imageLqip": images[0].asset->metadata.lqip,
    catalogReference,
    "subcategorySlug": subcategory->slug.current,
    "collectionSlugs": curatedCollections[]->slug.current
  }
`;
```
**This query is EXISTING and unused — the new `[slug]` route must call it, never re-derive it or call `getAllProducts()` for a single-category page** (RESEARCH.md Pattern 2, confirmed unused via this read).

**Fetch-function wrapper pattern with try/catch — copy exactly for every new query function** (lines 118-125, repeated identically for every exported fetcher in this file):
```ts
export async function getCategories() {
  try {
    return await client.fetch(getCategoriesQuery);
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}
```
For a single-document fetch (mirrors `getSiteSettings`, lines 210-227, which already takes no params and returns `null` on miss/error — the shape to copy for `getCategoryBySlug`/`getSpaceBySlug` which take a `$slug` param):
```ts
export const getCategoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id, name, "slug": slug.current, eyebrow, description, overview,
    "heroImageUrl": heroImage.asset->url,
    "heroImageLqip": heroImage.asset->metadata.lqip,
    "galleryUrls": gallery[].asset->url,
    keyFeatures, suitableFor,
    "brands": brands[]->{ name, "slug": slug.current, "logoUrl": logo.asset->url },
    whatsappMessage, searchKeywords, status, featured
  }
`;

export async function getCategoryBySlug(slug: string) {
  try {
    return await client.fetch(getCategoryBySlugQuery, { slug });
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return null;
  }
}
```
**SECURITY-CRITICAL: never string-interpolate `slug` into the GROQ template literal** — always pass as the second `client.fetch(query, { slug })` argument, exactly as shown. This is the one new user-influenced input this phase adds (RESEARCH.md Security Domain, V5).

**Live-count GROQ for D-09's hero stat row** (new, standard `count()` usage — no existing in-repo analog, but follows this file's flat exported-const convention):
```ts
export const getCollectionCountsQuery = groq`{
  "categoryCount": count(*[_type == "category" && status == "published"]),
  "brandCount": count(*[_type == "brand"])
}`;
```

---

### `src/components/collections/SpaceIntentRail.tsx` (component, request-response / scroll-driven)

**Analog 1 — desktop hairline-seam grid** (`src/components/home/CategoryDiscovery.tsx` lines 89-96, "Five Thresholds" seam technique 09-UI-SPEC.md explicitly says to reuse):
```tsx
<div className="mt-9 grid grid-cols-[0.92fr_1.28fr_0.88fr_1.08fr_0.92fr] gap-[1px] bg-white/[0.13]">
  {CATEGORIES.map((cat) => (
    <article key={cat.id} className={`threshold-card bg-[#11100f] pb-5 flex flex-col justify-between`}>
```
For the 6-tile space rail, adapt the column template to `grid-cols-3` (desktop, 2 rows) / `grid-cols-2` (tablet, 3 rows) per 09-UI-SPEC.md §2, keeping the `gap-[1px] bg-white/[0.13]` seam and `.threshold-card` class.

**Analog 2 — mobile CSS scroll-snap rail** (`src/components/home/ProductReel.tsx` lines 121-139, the file's own doc comment at lines 12-24 states "Horizontal reel on desktop (GSAP), CSS snap on mobile" — this is the confirmed established pattern to copy, not reinvent):
```tsx
<div
  className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-6 lg:hidden"
  style={{ scrollbarWidth: "none", paddingLeft: "16px", paddingRight: "16px" }}
>
  {PRODUCTS.map((p, i) => (
    <a key={i} href={p.href} className="snap-start shrink-0 block group" style={{ width: "78vw" }}>
      <MobileProductCard product={p} />
    </a>
  ))}
</div>
```
D-22 locks this to `snap-center` (not `snap-start`) and requires `role="list"`/`role="listitem"` — neither `ProductReel.tsx` nor `CategoryDiscovery.tsx` currently has these ARIA roles, so this phase adds them fresh (not a gap in analog-finding, a genuine new requirement).

**Lenis opt-out — REQUIRED ADDITION, no existing call site in this codebase.** `data-lenis-prevent` is referenced only once, in `src/app/globals.css:269` as a CSS selector (`.lenis.lenis-smooth [data-lenis-prevent] { ... }`) — it is styled but **never actually applied to any element in `src/components/`** (confirmed via codebase-wide grep). `SmoothScrollProvider.tsx` (full file, 52 lines) initializes Lenis with `orientation: "vertical", gestureOrientation: "vertical"` (lines 22-28) — this is why the rail needs the attribute added for the first time, and why the CSS is already prepared to receive it:
```tsx
<div className="space-intent-rail" data-lenis-prevent role="list" aria-label="Explore by space">
  {spaces.map((s) => <SpaceTile key={s.slug} space={s} />)}
</div>
```
Also add `overscroll-behavior: contain` per RESEARCH.md Pitfall 4 / Code Examples — this is new CSS, no in-repo precedent to copy for that specific property.

**`prefers-reduced-motion` degrade pattern** — copy the existing media-query block shape rather than inventing a new one (`globals.css` line 312 is the existing block start; extend it, do not create a second `@media (prefers-reduced-motion: reduce)` block elsewhere).

---

### `src/components/collections/CollectionsHero.tsx` (component, request-response)

**Analog:** `src/app/collections/CollectionsClient.tsx` lines 77-114 (the exact block being extracted into its own component).
```tsx
<section className="border-b border-[#c8a96e] pt-28 sm:pt-32 pb-7">
  <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
      <div className="lg:col-span-7">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#c8a96e] animate-pulse" />
          <span className="hc-mono text-[10px] uppercase tracking-[0.22em] text-[#aaa49a]">
            Authorized Digital Showroom
          </span>
        </div>
        <h1 className="hc-serif m-0 text-4xl sm:text-7xl lg:text-[84px] font-normal uppercase leading-[0.92] tracking-[0.03em] text-[#e8e3d9]" style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}>
          The <br className="hidden sm:block" />
          Collection
        </h1>
      </div>
      <div className="lg:col-span-5 flex flex-col justify-end pb-1 space-y-4">
        <p className="font-dmsans text-[13px] sm:text-[14px] leading-relaxed text-[#aaa49a] font-light max-w-lg">
          {/* replace hardcoded brand list sentence with the {N}+ live-count sentence, D-09 */}
        </p>
        <div className="flex items-center justify-between border-t border-white/[0.12] pt-3 text-[10px] uppercase tracking-[0.18em]">
          {/* replace static status bar with live-count stat row segments */}
        </div>
      </div>
    </div>
  </div>
</section>
```
Keep the exact grid/spacing/typography classes — 09-UI-SPEC.md §1 confirms this layout rhythm is unchanged; only the description copy and status bar contents change. Add the two hero CTAs (`.brass-plate` fill button + `.rail-button` outline button) using the exact class names already defined in `globals.css` (lines 353-360 for `.rail-button`, 357-360 for `.brass-plate`) and already demonstrated in the empty-state CTA above.

---

### `src/components/collections/CollectionIndex.tsx` (component, request-response)

**Analog:** `src/components/collections/CollectionFilterRail.tsx` (read lines 1-90; `.index-row` anatomy is what to keep, the `<aside>` sticky-sidebar wrapper and all `onSelectCategory`/filter-callback props are what to discard per D-18).

**Row anatomy to keep** (lines 47-58, adapt from a `<button onClick>` state-setter to a `<Link href={`/collections/${slug}`}>`):
```tsx
<button
  onClick={() => onSelectCategory("all")}
  className={`index-row hc-focus flex w-full items-center justify-between text-[11px] uppercase tracking-[0.14em] text-left transition-colors cursor-pointer ${
    activeCategory === "all" ? "is-active text-[#e8e3d9] font-semibold" : "text-[#aaa49a] hover:text-[#e8e3d9]"
  }`}
>
  <span>All collections</span>
  <span className="hc-mono text-[10px] text-[#aaa49a]">{products.length}</span>
</button>
```
Rewrite as (per D-04/D-15 — full-row link, numbered `01 -`, no active/filter state at all):
```tsx
<Link
  href={`/collections/${category.slug}`}
  className="index-row hc-focus architecture-rule flex w-full items-center justify-between text-[11px] uppercase tracking-[0.14em] text-left transition-colors text-[#aaa49a] hover:text-[#e8e3d9]"
>
  <span className="hc-mono text-[#c8a96e]">{String(idx + 1).padStart(2, "0")}</span>
  <span>{category.name}</span>
  <ChevronRight className="w-3.5 h-3.5 text-[#c8a96e]" />
</Link>
```
`.index-row` CSS already defines `min-height: 44px` (`globals.css` line 398) — satisfies the §10 touch-target floor for free, no new CSS needed for that constraint. `.index-row.is-active` (line 399) is now unused since there is no active state — drop that modifier class from the new component.

---

### `src/components/collections/FeaturedChapters.tsx` (component, request-response)

**Analog:** `src/components/home/CategoryDiscovery.tsx` (full file, 213 lines) for the card/border/image anatomy; `src/components/home/ProductReel.tsx` for the "chapter" framing concept (`data-chapter="5"` attribute convention, `ChapterLabel()` helper pattern, lines 141-146 and 251-264).

**Bordered split-frame card anatomy to adapt for Pattern B (2nd/4th chapter)** (`CategoryDiscovery.tsx` lines 118-154):
```tsx
<div className={`border-t ${cat.isFocal ? "border-[#c8a96e]" : "border-[#c8a96e]/[0.65]"} bg-[#090909] px-5 xl:px-6 pt-5 pb-4 flex-1 flex flex-col justify-between`}>
  <div>
    <h3 className={`hc-serif leading-[0.94] text-[#e8e3d9] ${cat.isFocal ? "text-[36px]" : "text-[28px] xl:text-[30px]"}`}>
      {cat.name}
    </h3>
    <p className="mt-3 text-[11px] leading-[1.5] text-[#aaa49a]">{cat.subtitle}</p>
  </div>
  <a href={cat.href} className="threshold-action mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#d1ccc4] no-underline hover:text-white">
    <span>View {cat.name}</span>
    <svg className="w-3.5 h-3.5 text-[#c8a96e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  </a>
</div>
```
Rename `threshold-action` link text to "Explore {Category Name} →" per 09-UI-SPEC.md §4, swap the hardcoded `href` for `/collections/${category.slug}`.

**Chapter numbering / "CHAPTER 01" mono label idiom** (`ProductReel.tsx` `ChapterLabel()`, lines 251-264):
```tsx
<p className="hc-mono text-[#c8a96e] font-medium tracking-[0.22em] text-[10px] sm:text-[11px] uppercase mb-1">
  Selected hardware
</p>
```
Adapt the label text to `CHAPTER 01` / `01 / 04` per spec, keep the `hc-mono`/tracking/color classes verbatim.

**Motion — reveal-on-mount pattern** (`ProductCard.tsx` lines 40-45, the codebase's established `motion/react` reveal idiom, reusable for chapter entrance):
```tsx
<motion.article
  layout
  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14 }}
  animate={{ opacity: 1, y: 0 }}
  exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
  transition={{ duration: 0.22, ease: "easeOut" }}
>
```
09-UI-SPEC.md §4 specifies 220-250ms and `whileInView` instead of mount-only `initial`/`animate` (chapters reveal on scroll, not on page load) — swap `initial`/`animate` for `initial` + `whileInView` + `viewport={{ once: true }}`, same duration/easing convention.

**Hard-cap enforcement (D-03) — no existing analog, new logic:**
```ts
const featuredChapters = categories.filter(c => c.featured).slice(0, 5); // hard cap, even if editors over-flag
```

---

### `src/components/collections/CompactCollectionGrid.tsx` (component, request-response)

**Analog:** `src/components/home/CategoryDiscovery.tsx` `.threshold-card` treatment (same file as FeaturedChapters' analog, different tier — see CSS at `globals.css` lines 380-387 for the exact hover/focus behavior already defined: `.threshold-card::before` brass left-border-on-hover, `.threshold-card .threshold-image` contrast/brightness filter on hover). Reuse the class names directly; do not reinvent hover chrome.

Also the reusable target for §2's "multiple linked categories" space-landing case (`SpaceLandingClient` renders this same component for `linkedCategories[]`).

---

### `src/components/collections/BrandDiscovery.tsx` (component, request-response)

**Analog 1 — featured-brand editorial tier** (`src/components/home/InteractiveBrandWall.tsx`, full file, 203 lines). Copy the hover-dim/brighten typographic list wholesale, only swap the hardcoded 6-brand `BRANDS` array (lines 21-70) for `brands.filter(b => b.featured)` from Sanity:
```tsx
<motion.h3
  animate={{
    color: isHovered ? "#ffffff" : isDimmed ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.35)",
    x: isHovered ? 12 : 0,
  }}
  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
  className="text-5xl lg:text-7xl xl:text-8xl font-light tracking-tight cursor-default leading-none"
>
  {brand.name}
</motion.h3>
```
**Change the `href`/`<a>` navigation to a drawer-open button** (see Shared Patterns "Brand → Consultation Drawer" below) — do not keep `href={brand.href}` navigating to `/collections?brand=X`, that is exactly the pattern D-18/09-UI-SPEC.md §6 retires.

**Analog 2 — alphabetical logo-wall tier** (`src/components/BrandTrustStrip.tsx`, full file, 375 lines). Reuse `renderBrandVisual()` (lines 229-255) for its structure and wordmark fallback — but note the excerpt below predates commit `3dbb84d`, which removed `brightness-0 invert` and the `opacity-55` dimming. **Logos now render in FULL COLOUR; do not copy the monochrome classes from the snippet below.** See the 2026-08-30 amendment in 09-UI-SPEC.md §6:
```tsx
const renderBrandVisual = (brand: BrandItem) => {
  if (brand.logo) {
    return (
      <div className={`relative flex items-center justify-center ${brand.containerClass || "w-40 md:w-52 lg:w-60 h-12 md:h-16 lg:h-20"}`}>
        <Image src={brand.logo} alt={brand.name} fill className={`object-contain transition-transform duration-300 ease-out group-hover/item:scale-105 ${brand.imageClass || ""}`} unoptimized={brand.logo.endsWith(".svg")} />
      </div>
    );
  }
  return (
    <span className="font-sans font-medium uppercase tracking-[0.28em] text-lg md:text-xl lg:text-2xl whitespace-nowrap text-[#e8e3d9]/55 group-hover/item:text-[#e8e3d9] transition-colors duration-300">
      {brand.name}
    </span>
  );
};
```
**Do NOT reuse the ticker/marquee** (`.animate-ticker-left`/`.animate-ticker-right`, lines 344-371 and the `<style jsx global>` block) — 09-UI-SPEC.md §6 explicitly replaces continuous motion with a static `localeCompare`-sorted grid. Replace the two `<div className="flex w-max ... animate-ticker-*">` lanes with a plain grid:
```tsx
<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6">
  {[...brands].sort((a, b) => a.name.localeCompare(b.name)).map((brand) => (
    <div key={brand._id} className="aspect-[3/2] threshold-card ..." aria-label={`Ask about ${brand.name} in a consultation`} title={`${brand.name} — Ask about availability`}>
      {renderBrandVisual(brand)}
    </div>
  ))}
</div>
```

**Brand roster reconciliation — the pattern to reuse for the canonical single source** (`src/components/catalog/CatalogLibrary.tsx` lines 181-236, `normalizeBrandKey()` + `BRAND_ALIASES`):
```ts
const BRAND_ALIASES: Record<string, string[]> = {
  hafele:   ["hafele", "haefele", "hfele", "hafeleindia"],
  dorset:   ["dorset", "dorsetindia"],
  // ... one row per canonical brand
};

const ALIAS_TO_KEY: Record<string, string> = Object.entries(BRAND_ALIASES).reduce(
  (acc, [key, aliases]) => { for (const alias of aliases) acc[alias] = key; return acc; },
  {} as Record<string, string>,
);

const normalizeBrandKey = (brand: Brand): string => {
  const raw = (brand?.slug as { current?: string })?.current ?? (brand?.slug as string) ?? brand?.id ?? brand?.name ?? "";
  const cleaned = String(raw).toLowerCase().replace(/[^a-z0-9]/g, "");
  return ALIAS_TO_KEY[cleaned] ?? cleaned;
};
```
This is full-string-equality alias matching (explicitly documented in the source file's own comment, lines 181-187, as chosen over substring matching to avoid collisions like "kich" vs "kich-pro"). **Reuse this exact function** as the single canonical brand-key resolver everywhere the brand roster needs de-duplication (D-26 reconciliation) — do not write a second normalizer in `data/catalog.ts` or `BrandTrustStrip.tsx`.

**Brands to remove per D-26** (currently only in `src/components/BrandTrustStrip.tsx` `LANE_1_BRANDS`, lines 79-103): `jaquar` (id `jaquar`), `asian_paint`, `philips` — delete these three object entries; they are absent from `CatalogLibrary.tsx`'s `BRAND_REGISTRY`, confirming they are not part of the reconciled architectural-hardware roster.

**Brands missing from `src/data/catalog.ts` `BRANDS` array** (verified: array starts line 194, does not include `hettich`/`kich` as of this read) — add entries shaped like the existing `BrandInfo` objects (lines 194-231 show the `id`/`name`/`country`/`tier`/`authorized`/`logo`/`tagline`/`description`/`keyHighlights` shape to copy).

---

### `src/components/collections/CollectionSearch.tsx` (component, request-response)

**Analog:** `src/components/collections/CollectionSearchBar.tsx` — read the file directly when implementing (not re-read here since it was not needed for excerpt extraction beyond its prop contract, visible via its usage in `CollectionsClient.tsx` lines 152-165):
```tsx
<CollectionSearchBar
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  activeBrand={activeBrand}
  onBrandChange={setActiveBrand}
  availableBrands={availableBrands}
  isBrandDropdownOpen={isBrandDropdownOpen}
  onToggleBrandDropdown={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
  brandDropdownRef={brandDropdownRef}
  totalSpecimensCount={totalSpecimensCount}
  activeCategory={activeCategory}
  onResetFilters={handleResetFilters}
  searchInputRef={searchInputRef}
/>
```
Drop every brand-dropdown-related prop (`activeBrand`, `onBrandChange`, `availableBrands`, `isBrandDropdownOpen`, `onToggleBrandDropdown`, `brandDropdownRef`) per D-18 — the new `CollectionSearch` keeps only `searchQuery`/`onSearchChange`/`searchInputRef` plus new props for the D-14 results-list rendering (grouped "Collections"/"Products" headers, per 09-UI-SPEC.md §8). Focus/border-color transition timing (150ms) should reuse whatever transition utility class `CollectionSearchBar.tsx`'s input element already uses — verify exact class at implementation time since the file's JSX body was not captured in this excerpt pass.

---

### `src/hooks/useCollectionsState.ts` (hook, transform — edit in place)

**Analog:** itself (full file, 369 lines, already read in full — no re-read needed for any range).

**Section to DELETE entirely** (D-18 — filter state): `activeCategory`/`setActiveCategory` (line 46), `activeBrand`/`setActiveBrand` (line 47), `isBrandDropdownOpen` (line 52), `isMobileFilterOpen` (line 53), `brandDropdownRef` (line 57), the `searchParams.get("category")`/`.get("brand")` sync block (lines 60-78), `handleResetFilters` (lines 331-335), `activeFamilySlug`/`getFamilyCollections` (lines 186-205) if no longer consumed after `CollectionFilterRail` removal, and the `familyMatch`/`targetCategories` branch of `displayCategories` (lines 249-272) — **but keep** the `?product=` sync logic (lines 69-77, 91-120) verbatim, it backs the retained `ProductDetailDrawer` (NAV plan S3E).

**Section to KEEP verbatim** — shortlist logic (lines 133-148), WhatsApp link builder (lines 150-164):
```ts
const getWhatsAppShortlistLink = useCallback(() => {
  const defaultNumber = settings?.whatsappNumber || "919835190738";
  if (shortlist.length === 0) {
    const genericMsg = "Hardware Collection — Product Consultation\n\nHi, I would like to consult with an expert regarding architectural hardware and digital lock specifications for my project.";
    return `https://wa.me/${defaultNumber}?text=${encodeURIComponent(genericMsg)}`;
  }
  const itemsList = shortlist.map((p, i) => `${i + 1}. ${p.brandName || p.brand || "Hardware Collection"} — ${p.name}`).join("\n");
  const message = `Hardware Collection — Product Consultation\n\nI'm interested in:\n\n${itemsList}\n\nI'd like to know about suitability, availability and specifications.`;
  return `https://wa.me/${defaultNumber}?text=${encodeURIComponent(message)}`;
}, [settings?.whatsappNumber, shortlist]);
```

**Section to REPLACE** — `getProductDisplayImage()` hardcoded PNG map (D-12, lines 320-329):
```ts
// CURRENT (delete this body):
const getProductDisplayImage = useCallback((prod: Product) => {
  if (prod.imageUrl) return prod.imageUrl;
  const cat = String(prod.categorySlug || prod.category || "").toLowerCase();
  if (cat.includes("lock") || cat.includes("security") || cat.includes("safe")) return "/cinema/categories/HC-03-SECURITY.png";
  // ...five more hardcoded PNG branches
  return "/cinema/categories/HC-03-DOORS.png";
}, []);
```
Replace with the D-12 resolution chain `product.images[0] -> category.image -> siteSettings default`, keeping the exact function signature/call-site shape (every `ProductCard`/`ProductDetailDrawer` call site passes a `Product` and expects a `string` back — do not change the contract, only the body):
```ts
const getProductDisplayImage = useCallback((prod: Product, category?: Category, settings?: SiteSettings | null) => {
  if (prod.imageUrl) return prod.imageUrl;
  if (category?.imageUrl) return category.imageUrl;
  return settings?.defaultCategoryImageUrl || ""; // never a hardcoded /cinema/*.png path
}, []);
```

**Section to EXTEND** — `displayCategories` search matching, currently substring-only over name/brand/desc/model (lines 237-247):
```ts
const matchingProducts = products.filter(p => {
  const pName = (p.name || "").toLowerCase();
  const pBrand = (p.brandName || p.brand || "").toLowerCase().replace(/ä/g, "a");
  const pDesc = (p.shortDescription || p.description || "").toLowerCase();
  const pModel = (p.catalogReference || p.model || "").toLowerCase();
  const matchSearch = !query || pName.includes(query) || pBrand.includes(query) || pDesc.includes(query) || pModel.includes(query);
  const matchBrand = activeBrand === "all" || pBrand === activeBrand.toLowerCase() || pBrand.includes(activeBrand.toLowerCase());
  return matchSearch && matchBrand;
});
```
D-14 extends `matchSearch` with an additional `pKeywords.some(k => k.includes(query))` clause reading `p.searchKeywords` (new field) — same `.includes()` substring idiom, same lowercasing convention, no new matching technique introduced.

**Brand-normalization idiom already present in this file, keep the pattern (do not remove) even after filter-state removal** (lines 207-231, `availableBrands` — note this is a DIFFERENT, weaker normalizer than `CatalogLibrary.tsx`'s `normalizeBrandKey` — only strips `ä`→`a`, not full alias table). If `availableBrands` survives into the redesign (used anywhere outside the removed filter UI), consider replacing its ad-hoc `standardBrands` hardcoded array + `.replace(/ä/g, "a")` with the canonical `normalizeBrandKey()`/`BRAND_ALIASES` pattern instead, per D-26/Pitfall 1 — do not leave a fourth roster copy behind.

---

### Test files — Vitest idiom

**Analog:** `src/lib/__tests__/catalogFiltering.test.ts` (full file, 103 lines) and `src/hooks/__tests__/useCollectionsState.test.ts` (full file, 28 lines).

**Import + describe/it structure** (`catalogFiltering.test.ts` lines 1-11):
```ts
import { describe, it, expect } from "vitest";
import { Product } from "@/types/catalog";
import { SHOWROOM_FAMILIES } from "@/data/catalog";

// Pure filtering function extracted from CollectionsClient logic for testing
export function filterProducts(products: Product[], searchQuery: string, activeBrand: string): Product[] {
  // ... pure function, re-implemented in the test file itself, not imported from the hook
}
```
**Convention confirmed:** this codebase extracts a pure, dependency-free copy of the logic under test directly into the `.test.ts` file rather than importing the hook (which has `"use client"` + `useSearchParams()`/`usePathname()` React dependencies that would require a DOM/router test harness). Follow this same pattern for the new D-14 `searchKeywords[]` matcher and D-03 featured-chapter-cap tests — write a pure exported function co-located in the test file, do not attempt to unit-test `useCollectionsState` directly by importing it.

**Fixture-construction style** (lines 35-60) — inline object literals matching the `Product`/`Brand` type shapes, 2-3 per test, no factory/builder abstraction:
```ts
const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Hafele Re-Dial Digital Lock",
    brand: "Hafele",
    categorySlug: "digital-locks",
    shortDescription: "Biometric and RFID digital door lock",
    catalogReference: "912.05.500",
  },
  // ...
];
```

**Simple import-and-assert style for static-data tests** (`useCollectionsState.test.ts`, full file):
```ts
import { describe, it, expect } from "vitest";
import { SHOWROOM_FAMILIES_NAV } from "../useCollectionsState";

describe("SHOWROOM_FAMILIES_NAV", () => {
  it("defines top-level discovery showroom families", () => {
    expect(SHOWROOM_FAMILIES_NAV).toHaveLength(6);
    expect(SHOWROOM_FAMILIES_NAV.map(f => f.id)).toEqual([
      "all", "handles-knobs", "door-hardware", "bathroom", "kitchen-wardrobes", "furniture-hardware",
    ]);
  });
});
```
Use this exact style for `src/data/__tests__/brands.test.ts` (assert `BRANDS.length`/membership) and `src/data/__tests__/homeLinks.test.ts` (assert every hardcoded href resolves to a real slug).

**CRITICAL constraint confirmed from RESEARCH.md and directly relevant to `FeaturedChapters.test.ts`:** `vitest.config.mjs` `include` is `["src/**/__tests__/**/*.test.ts"]` — **`.ts` only, not `.tsx`.** Any new component-logic test (e.g., D-03's featured-chapter cap) must extract the pure cap-enforcement function into a plain `.ts` file/export, exactly as `catalogFiltering.test.ts` already does for `filterProducts` — do not write a `.test.tsx` expecting it to run, it will be silently skipped by the test runner.

---

## Shared Patterns

### WhatsApp CTA construction
**Source:** `src/hooks/useCollectionsState.ts` lines 150-164 (`getWhatsAppShortlistLink`) and `src/app/collections/CollectionsClient.tsx` line 184 (inline `wa.me` href).
**Apply to:** Hero CTAs, category contextual CTA, brand-drawer CTA, empty-state CTA — every WhatsApp link in this phase.
```ts
const number = settings?.whatsappNumber || "919835190738"; // fallback matches src/lib/config.ts and Footer.tsx
const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
```
Never build this from unsanitized user input (RESEARCH.md Security Domain) — `message` is always a developer-authored template string with data interpolated via `encodeURIComponent`, never raw search-box text concatenated unescaped.

### Brand → Consultation Drawer (replaces `?brand=` navigation)
**Source:** `src/components/consultation/ConsultationContext.ts` (full file, 32 lines) + `src/components/consultation/store.ts` (full file, 17 lines).
**Apply to:** `BrandDiscovery.tsx` (both tiers), category-page "Brands carried" row (§7), any homepage brand link that should stop navigating to `/collections?brand=X`.
```ts
import { useConsultationStore } from "@/components/consultation/store";

const { openDrawer } = useConsultationStore();

<button onClick={() => openDrawer({ source: "collections", intent: "consultation", brand: { slug: brand.slug, name: brand.name } })}>
  {/* replaces <a href={`/collections?brand=${slug}`}> */}
</button>
```
`ConsultationContext.source` union (line 2-8) currently lists `"home" | "collections" | "product_drawer" | "shortlist" | "navbar"` — add `"category_page"` if the category-page contextual CTA needs a distinct source value; extending a union member is a backward-compatible, single-file change (same low-risk shape as the `Product.brand` union widening in `data/catalog.ts`).

### `.architecture-rule` hover underline (sitewide primitive, do not fork)
**Source:** `src/app/globals.css` lines 349-351.
```css
.architecture-rule { position: relative; }
.architecture-rule::after { content: ''; position: absolute; left: 0; right: 0; bottom: -1px; height: 1px; background: var(--brass); transform: scaleX(0.18); transform-origin: left; transition: transform 220ms var(--standard); }
.architecture-rule:hover::after, .architecture-rule:focus-within::after { transform: scaleX(1); }
```
**Apply to:** Collection Index row hover, chapter CTA hover (§3, §4) — just add the `architecture-rule` class name, do not write new CSS. 09-UI-SPEC.md §10 explicitly names this as an accepted 220ms exception to the 150/180ms NAV-plan buckets — do not retime it.

### `.threshold-card` hover chrome (sitewide primitive)
**Source:** `src/app/globals.css` lines 380-387; established usage `src/components/home/CategoryDiscovery.tsx` line 93.
**Apply to:** `SpaceIntentRail.tsx` tiles, `FeaturedChapters.tsx` Pattern-B cards, `CompactCollectionGrid.tsx` cards — brass left-border-on-hover + image contrast/brightness filter, all via one class name (`className="threshold-card ..."`), zero new CSS needed.

### `.brass-plate` / `.rail-button` CTA button chrome
**Source:** `src/app/globals.css` lines 353-360; established usage `CollectionsClient.tsx` line 187.
**Apply to:** every filled-brass CTA (hero primary, category bottom CTA) uses `.brass-plate`; every outline/secondary CTA (hero secondary) uses `.rail-button`. Both already encode the correct `#090909`-on-brass text-color contract via their CSS (`.brass-plate::after` inset shadow) — do not manually set `text-white` on a `.brass-plate` element, that would reproduce the 1.76:1 contrast failure 09-UI-SPEC.md flags.

### Error handling — Sanity fetch wrapper
**Source:** `src/sanity/queries.ts`, repeated identically across all 8 existing exported fetch functions (e.g. lines 118-125, 210-227).
**Apply to:** every new query function (`getCategoryBySlug`, `getSpaceBySlug`, `getSpaces`, `getCollectionCounts`) — `try { return await client.fetch(query, params) } catch (error) { console.error("Sanity fetch error:", error); return <empty-value matching the return type> }`. List-returning functions return `[]`, single-doc functions return `null`, count-object functions should return `{ categoryCount: 0, brandCount: 0 }` (matches the "zero-count segments are omitted, never rendered as 0" behavior in 09-UI-SPEC.md §1, which needs a real zero value to detect and hide, not a thrown error).

### Reduced-motion primitive
**Source:** `src/app/globals.css` line 312 (existing `@media (prefers-reduced-motion: reduce)` block) and `motion/react`'s `useReducedMotion()` hook, already imported in `ProductCard.tsx` line 6 and `ProductReel.tsx` line 7.
**Apply to:** every new hover-scale/translate effect (space tiles, chapter reveals, brand-wall hover) — call `const shouldReduceMotion = useReducedMotion();` and conditionally drop the `initial`/animate transform props exactly as `ProductCard.tsx` lines 28, 42, 44 already do. Do not create a second reduced-motion detection mechanism.

## No Analog Found

| File | Role | Data Flow | Reason |
|---|---|---|---|
| `src/components/collections/__tests__/FeaturedChapters.test.ts` | test | transform | New `__tests__` subdirectory under `src/components/collections/` — no component-level test directory exists anywhere in this codebase today (confirmed: `src/lib/__tests__/` and `src/hooks/__tests__/` are the only two existing test directories, both under non-component roots). Follow the Vitest idiom pattern above (pure-function extraction into the `.ts` test file) rather than a JSX/RTL-style component test — `vitest.config.mjs` does not include `.tsx` files and no `@testing-library/react` dependency exists in `package.json`. |
| `src/app/collections/[slug]/page.tsx` async-params pattern specifically | route | request-response | `src/app/studio/[[...tool]]/page.tsx` is this codebase's only existing dynamic segment, but it takes no `params` at all (it wraps `NextStudio` unconditionally) — it confirms the file-location convention (`[slug]/page.tsx`) but not the async-params handling idiom. Use RESEARCH.md's verified Next.js 16.3.3 official-docs pattern instead (reproduced in full above). |

## Metadata

**Analog search scope:** `src/app/`, `src/components/collections/`, `src/components/home/`, `src/components/catalog/`, `src/components/consultation/`, `src/hooks/`, `src/sanity/schemaTypes/`, `src/sanity/queries.ts`, `src/data/`, `src/lib/`, `src/lib/__tests__/`, `src/hooks/__tests__/`, `src/app/globals.css` (CSS primitive definitions only).
**Files read in full or by targeted range:** `src/app/collections/page.tsx`, `src/app/studio/[[...tool]]/page.tsx`, `src/app/collections/CollectionsClient.tsx`, `src/hooks/useCollectionsState.ts`, `src/sanity/schemaTypes/{category,curatedCollection,subcategory,index,brand,product,siteSettings}.ts`, `src/sanity/queries.ts`, `src/components/collections/{ProductCard,CollectionFilterRail}.tsx`, `src/components/home/{CategoryDiscovery,ProductReel,InteractiveBrandWall}.tsx`, `src/components/providers/SmoothScrollProvider.tsx`, `src/components/BrandTrustStrip.tsx`, `src/components/catalog/CatalogLibrary.tsx`, `src/data/catalog.ts` (lines 1-120, 194-264), `src/types/catalog.ts` (lines 1-120), `src/components/consultation/{ConsultationContext.ts,store.ts}`, `src/lib/__tests__/catalogFiltering.test.ts`, `src/hooks/__tests__/useCollectionsState.test.ts`, `src/app/globals.css` (grep-targeted class definitions).
**Pattern extraction date:** 2026-08-29
