/** A catalogue PDF in Sanity, positioned the way `/api/catalog/<slug>/<n>` serves it. */
export interface CatalogueSource {
  catalogId: string;
  brandSlug: string;
  brand: string;
  catalogueIndex: number;
  title: string;
  assetId: string;
  pdfUrl: string;
}

interface SanityLike {
  fetch<T>(query: string): Promise<T>;
}

interface BrandRow {
  slug: string;
  name: string;
  catalogues: { title: string; pdfUrl: string | null; assetId: string | null }[];
}

/** Same ordering contract as `scripts/build-catalog-index.mjs` and the PDF proxy: `_createdAt` ascending. */
const QUERY = `*[_type == "brand" && defined(slug.current)]{
  "slug": slug.current,
  name,
  "catalogues": *[_type == "catalogue" && brand._ref == ^._id] | order(_createdAt asc) {
    "title": coalesce(catalogueName, ""),
    "pdfUrl": pdfFile.asset->url,
    "assetId": pdfFile.asset._ref
  }
}`;

export async function fetchCatalogueSources(client: SanityLike): Promise<CatalogueSource[]> {
  const brands = await client.fetch<BrandRow[]>(QUERY);
  const sources: CatalogueSource[] = [];
  for (const brand of brands ?? []) {
    brand.catalogues.forEach((entry, index) => {
      if (!entry.pdfUrl || !entry.assetId) return;
      sources.push({
        catalogId: `${brand.slug}-${index}`,
        brandSlug: brand.slug,
        brand: brand.name,
        catalogueIndex: index,
        title: entry.title || `${brand.name} Catalog ${index + 1}`,
        assetId: entry.assetId,
        pdfUrl: entry.pdfUrl,
      });
    });
  }
  return sources;
}
