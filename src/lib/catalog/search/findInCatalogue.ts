import { readFile } from "node:fs/promises";
import path from "node:path";
import { readIndex, type KeyValueStore } from "../indexing/store";
import { scoreQuery } from "./score";
import { STATIC_INDEX_DIR } from "./staticIndexes";
import type { IndexedPage } from "./types";

/**
 * Search inside one catalogue, on the server.
 *
 * The page text of a catalogue is as private as the PDF itself (it includes
 * price lists), so it never leaves the server. The viewer's search panel asks
 * /api/catalog/<slug>/<n>/search and gets back only what it shows: a page
 * number, a short snippet and a score per hit.
 */

export const MAX_RESULTS = 60;
const MAX_INDEX = 50;

/** Words customers use for the same thing, matched alongside the typed term. */
export const SEARCH_SYNONYMS: Record<string, string[]> = {
  handles: ["handle", "pull", "pulls", "knob", "knobs"],
  wardrobe: ["wardrobe", "closet", "sliding", "wardrobe system"],
  kitchen: ["kitchen", "cabinet", "drawer", "hinge", "organizer"],
};

export interface PageHit {
  page: number;
  snippet: string;
  score: number;
}

/** Ranked pages for a query; best first, ties by page so the order is stable. */
export function searchPages(pages: IndexedPage[], term: string): PageHit[] {
  const query = term.trim();
  if (query.length < 2) return [];
  const found: PageHit[] = [];
  for (const page of pages) {
    const result = scoreQuery(page.text, query, SEARCH_SYNONYMS);
    if (result) found.push({ page: page.page, snippet: result.snippet, score: result.score });
  }
  found.sort((a, b) => b.score - a.score || a.page - b.page);
  return found.slice(0, MAX_RESULTS);
}

/**
 * `<slug>-<n>`, the id indexes are stored under, or null for anything that is
 * not a plain brand slug and catalogue position. The id becomes a file name,
 * so this is also the path-traversal guard.
 */
export function catalogueIdFrom(slug: string, index: string): string | null {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 64) return null;
  if (!/^\d{1,2}$/.test(index) || Number(index) > MAX_INDEX) return null;
  return `${slug}-${Number(index)}`;
}

interface Sources {
  kv: KeyValueStore | null;
  dir?: string;
}

/**
 * A catalogue's page text: the live index in Redis (kept current by
 * /api/catalog/reindex, and it covers OCR'd catalogues), else the file built
 * at deploy time. Null when neither exists.
 */
export async function loadCataloguePages(catalogId: string, { kv, dir = STATIC_INDEX_DIR }: Sources): Promise<IndexedPage[] | null> {
  if (kv) {
    try {
      const live = await readIndex(kv, catalogId);
      if (live?.pages?.length) return live.pages;
    } catch {
      // Redis unreachable: the build-time file is the next best source.
    }
  }
  try {
    const raw = JSON.parse(await readFile(path.join(dir, `${catalogId}.json`), "utf8")) as { pages?: IndexedPage[] };
    return Array.isArray(raw.pages) ? raw.pages : null;
  } catch {
    return null;
  }
}

/** Hits for `term` in one catalogue, or null when it has no index. */
export async function findInCatalogue(catalogId: string, term: string, sources: Sources): Promise<PageHit[] | null> {
  const pages = await loadCataloguePages(catalogId, sources);
  return pages ? searchPages(pages, term) : null;
}
