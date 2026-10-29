import type { BrandMatch } from "./types";

/** The most matching pages a link carries; the rest are one search away. */
export const MAX_LINK_PAGES = 12;
const MAX_QUERY = 80;

/**
 * `/collections` link that opens a brand's catalogue at the best-matching page.
 * `?cat=` is the catalogue's index in the brand's list, `page` the best page,
 * `pages` the other matches (ascending, for prev/next), `q` the category name.
 */
export function buildMatchHref(match: BrandMatch, categoryTitle: string): string {
  const catalogue = match.catalogues[0];
  const params = new URLSearchParams({ brand: match.brandKey });
  if (!catalogue) return `/collections?${params}#brand-catalogues`;
  const pages = [...new Set(catalogue.pages.map((p) => p.page))].sort((a, b) => a - b);
  params.set("cat", String(catalogue.catalogueIndex));
  params.set("page", String(catalogue.pages[0].page));
  params.set("q", categoryTitle.slice(0, MAX_QUERY));
  params.set("pages", pages.slice(0, MAX_LINK_PAGES).join(","));
  params.set("v", catalogue.version);
  return `/collections?${params}#brand-catalogues`;
}

/**
 * A short fingerprint of the PDF a match was found in (the start of the Sanity
 * asset hash), carried in the link so the viewer can tell if the file at that
 * catalogue position has since been replaced.
 */
export function versionOfAsset(assetId: string): string {
  return /^file-([0-9a-f]{40})-/i.exec(assetId)?.[1].slice(0, 12).toLowerCase() ?? "";
}

export interface MatchParams {
  catalogue: number;
  page: number;
  query: string;
  pages: number[];
  /** `versionOfAsset` of the PDF the match came from; empty when the link did not say. */
  version: string;
}

function int(value: string | null, min: number, max: number): number | null {
  if (value === null || !/^\d{1,5}$/.test(value)) return null;
  const n = Number(value);
  return n >= min && n <= max ? n : null;
}

/**
 * Reads the match params off a `/collections` URL. Everything is untrusted, so
 * junk is dropped rather than clamped into something plausible: no valid `page`
 * means no match context at all.
 */
export function parseMatchParams(search: URLSearchParams, catalogueCount: number): MatchParams | null {
  const page = int(search.get("page"), 1, 9999);
  if (page === null) return null;
  const catalogue = int(search.get("cat"), 0, Math.max(0, catalogueCount - 1)) ?? 0;
  const query = (search.get("q") ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_QUERY);
  const pages = [
    ...new Set(
      (search.get("pages") ?? "")
        .split(",")
        .map((p) => int(p, 1, 9999))
        .filter((p): p is number => p !== null)
    ),
  ]
    .sort((a, b) => a - b)
    .slice(0, MAX_LINK_PAGES);
  if (!pages.includes(page)) pages.push(page);
  const version = /^[0-9a-f]{12}$/.test(search.get("v") ?? "") ? (search.get("v") as string) : "";
  return { catalogue, page, query, pages: pages.sort((a, b) => a - b), version };
}

/**
 * The Sanity asset id of a file from its CDN URL
 * (`.../files/<project>/<dataset>/<hash>.pdf` -> `file-<hash>-pdf`), so a stored
 * match can be checked against the PDF the viewer would actually open.
 */
export function assetIdFromPdfUrl(url: string | null | undefined): string | null {
  const match = /\/([0-9a-f]{40})\.([a-z0-9]+)(?:\?.*)?$/i.exec(url ?? "");
  return match ? `file-${match[1].toLowerCase()}-${match[2].toLowerCase()}` : null;
}
