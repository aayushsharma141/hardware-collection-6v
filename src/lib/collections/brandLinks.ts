import type { Brand } from "@/types/catalog";

function slugOf(slug: Brand["slug"]): string {
  if (!slug) return "";
  return (typeof slug === "string" ? slug : slug.current) ?? "";
}

/**
 * Whether the catalogue viewer can open something for this Sanity brand. It is
 * the viewer's own rule (CatalogViewerModal): catalogue documents need a brand
 * slug, because the PDFs are served from /api/catalog/<slug>/<n>, and each needs
 * a PDF; failing that, an official catalogue file. A non-empty `catalogues`
 * array alone is not enough.
 */
export function brandHasCatalogue(brand: Brand | undefined): boolean {
  if (!brand) return false;
  const documents = brand.catalogues?.some((doc) => Boolean(doc.pdfVersion)) ?? false;
  return (documents && Boolean(slugOf(brand.slug))) || Boolean(brand.officialCatalogUrl);
}
