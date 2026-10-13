import type { Brand, CatalogueDocument } from "@/types/catalog";
import { versionOfAsset } from "./search/matchLink";

/** A catalogue as the brand query returns it, on the server only. */
export type CatalogueRow = Omit<CatalogueDocument, "pdfVersion"> & { assetId?: string | null };
export type BrandRow = Omit<Brand, "catalogues"> & { catalogues?: CatalogueRow[] | null };

/**
 * Catalogues are view-only: the PDF is streamed through /api/catalog/<slug>/<n>
 * and its CDN location must never reach the browser. The asset id is not safe
 * either. The project id and dataset are public, so
 * `file-<hash>-pdf` rebuilds the download URL.
 *
 * What the page needs is to know that a PDF exists and which file it is (so a
 * search match can be checked against the file the viewer will open). The
 * 12-character fingerprint from `versionOfAsset` answers both questions and
 * cannot be turned back into a URL. Run this on the server, before brands are
 * handed to a client component.
 */
export function withPdfVersions(brands: BrandRow[] | null | undefined): Brand[] {
  return (brands ?? []).map((brand) => {
    if (!brand.catalogues) return brand as Brand;
    return {
      ...brand,
      catalogues: brand.catalogues.map(({ assetId, ...doc }) => ({
        ...doc,
        pdfVersion: (assetId && versionOfAsset(assetId)) || null,
      })),
    };
  });
}
