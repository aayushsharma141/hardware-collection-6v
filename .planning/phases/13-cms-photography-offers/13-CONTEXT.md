# Phase 13 — CMS Photography & Scheduled Offers

**Status:** PLANNED — decisions locked 2026-09-26, not started
**Gated on:** PR #23 (Phase 12) and PR #24 merged

---

## 1. Decisions (owner, 2026-09-26)

- **D1 — Sanity manages all photography.** Not ImageKit. Sanity is already connected
  and serving category images, staff already work in Studio, and it resizes and serves
  WebP/AVIF on the fly. No second vendor, keys or bill.
- **D2 — "Rotation" means two things:**
  1. **Swap any photo, any time** from Studio, live within a minute, no code change.
  2. **Scheduled offers** — offer banners and featured-product highlights with start and
     end dates that appear and disappear on their own.
- Explicitly **not** wanted: an auto-cycling homepage hero.

## 2. Where things stand

| | Today |
|---|---|
| Sanity image CDN | Wired in — `cdn.sanity.io` is an allowed `next/image` host |
| Image URL builder | **None.** Raw asset URLs are served at full size, so Studio crop and hotspot are ignored |
| Hardcoded images | **23 distinct files** under `/public/cinema` and `/public/Hardware Collection`, referenced from components and fallback content — no one can change them without a developer |
| Offers / highlights | No content type exists |
| Category photography | 0 of 53 categories have a hero image; cards share 6 renders |

## 3. Work

### Wave 1 — image foundation
- Add `@sanity/image-url`; one helper, `urlForImage(image).width(w).height(h).auto("format")`,
  in `src/content/sanity/lib/`. Using width **and** height is what makes Studio's crop and
  hotspot take effect (verified against current docs).
- GROQ: project the image object (asset ref + crop + hotspot), not only `asset->url`,
  wherever a component renders it.
- Swap raw `imageUrl` usage in category cards, family pages and product cards for the helper.

### Wave 2 — move the 23 hardcoded images into the CMS
Add image fields to the singletons that already exist (`homePage`, `siteSettings`) rather
than inventing new documents:
- homepage hero slides, the five family cards, the product-reel pieces, showroom
  exterior/interior, material swatches, logo variants.
Every field keeps today's file as its fallback, so the site never renders a blank slot
while photography is being replaced.

### Wave 3 — scheduled offers
- New `offer` document: title, short line, image (hotspot on), optional linked
  category / product / brand, CTA (WhatsApp by default — the primary conversion
  mechanism), `startsAt`, `endsAt`, placement (homepage, collections, family page).
- Visibility in GROQ with `now()`:
  `*[_type == "offer" && startsAt <= now() && (!defined(endsAt) || endsAt > now())]`.
  Pages already revalidate every 60 s, so an offer goes live or expires within about a
  minute of its time, with no deploy and no paid scheduling feature.
- Rendered as a quiet banner/highlight in the site's own register — **no prices, no
  discounts-as-numbers, no cart** (locked rules). "Festival display now open" is fine;
  "20% off" is not, unless the owner explicitly changes that rule.

### Wave 4 — Studio ergonomics
- Group the new image fields so staff find them by page ("Homepage → Hero").
- Preview thumbnails on offers; a "Scheduled / Live / Expired" status in the list view.

## 4. Verification
- Changing an image in Studio shows on the site within ~60 s, with no deploy.
- A crop/hotspot change in Studio visibly changes the rendered crop.
- An offer with a future `startsAt` is absent, then present after that time; it
  disappears after `endsAt`.
- Removing any image in Studio falls back to the current file, never a blank slot.
- LCP does not regress: hero images served resized and in WebP/AVIF.

## 5. Owner input needed before Wave 3
- Placements you want offers to appear in (homepage only, or collections and family
  pages too).
- Whether an offer may state a discount. The locked rules currently forbid pricing.
