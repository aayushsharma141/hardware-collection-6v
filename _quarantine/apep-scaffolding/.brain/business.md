# Business Logic & Rules: Hardware-Collection
## Key Domain Models

### ProductCategory
- A fixed set of 13 categories. Catalog operates at category-card level only — no individual SKU/inventory management on the website (lead-gen, not e-commerce mandate).
  1. Digital Locks
  2. Mortise & Door Locks
  3. Main Door Handles
  4. Cabinet & Wardrobe Handles
  5. Modular Kitchen Hardware
  6. Kitchen Sinks & Faucets
  7. Wardrobe Hardware & Sliding Systems
  8. Hinges & Soft-Close Systems
  9. Drawer Channels
  10. Bathroom Accessories
  11. Glass Hardware
  12. Door Closers & Stoppers
  13. Safes
- Card fields: Name, Thumbnail, Short Description (1 line), Overview (2-3 sentences), Suitable For (residential/commercial/both), Available Brands, Key Features, Applications, Material/Finish Options, Downloads, Gallery, SEO Keywords, CTA.
- Relationship: ProductCategory 1---N CategoryCard.

### CategoryCard
- Published presentation of one ProductCategory on the website.
- CTA: "View Collection" or "Request Quote via WhatsApp" (lead-gen).
- Must never expose margins, cost prices, or internal stock data.

### Brand
- A manufacturer represented on the site (e.g., Hafele, Hettich, Dorset, Godrej, Labacha).
- Relationship: Brand N---N ProductCategory (available brands listed per category).

### Lead
- A prospective customer inquiry captured via the WhatsApp CTA or the /api/lead endpoint.
- Relationship: Lead N---1 ProductCategory (inquiry references the category of interest).

## Invariants

1. All changes must pass verification before commit.
2. Zero cross-project context pollution.
3. Catalog operates at category-card level only — no SKU/inventory/pricing entities on the website.
4. Margins are confidential (Mukesh only) and must never appear in public or AI-facing content.
5. No fixed prices or live stock counts are stored on the site.
6. Every category card must route to a WhatsApp lead-generation CTA.