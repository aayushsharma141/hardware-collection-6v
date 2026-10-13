import type { Brand } from "@/types/catalog";
import { brandHasCatalogue } from "@/lib/collections/brandLinks";
import type { BrandMatch } from "./types";

/**
 * Keeps only the parts of a stored match that are about the PDF the viewer will
 * actually open for that brand: the catalogue at `catalogueIndex` in the Sanity
 * brand record must be the same file (`pdfVersion` fingerprint) the page text was extracted
 * from. A match found in a since-replaced or re-ordered catalogue would send the
 * visitor to the wrong pages, so it is dropped rather than shown.
 *
 * Returns `null` when nothing is left, or when the brand has no openable
 * catalogue at all.
 */
export function verifyBrandMatch(brand: Brand, match: BrandMatch): BrandMatch | null {
  if (!brandHasCatalogue(brand)) return null;
  const current = match.catalogues.filter((catalogue) => {
    const served = brand.catalogues?.[catalogue.catalogueIndex]?.pdfVersion;
    return Boolean(served) && served === catalogue.version;
  });
  return current.length > 0 ? { ...match, catalogues: current } : null;
}
