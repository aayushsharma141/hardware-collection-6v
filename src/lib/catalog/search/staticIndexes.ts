import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { CatalogueIndex } from "./types";

/**
 * Where `scripts/build-catalog-index.mjs` writes the per-page text of every
 * catalogue at build time (`<brand-slug>-<n>.json`). The same files power the
 * viewer's in-catalogue search, through /api/catalog/<slug>/<n>/search.
 *
 * Deliberately not under `public/`: the text includes price lists, and
 * anything there is downloadable. next.config.ts traces this folder into the
 * functions that read it.
 */
export const STATIC_INDEX_DIR = path.join(process.cwd(), "catalog-index");

interface StaticIndexFile {
  catalog?: string;
  brand?: string;
  title?: string;
  assetId?: string;
  pages?: { page: number; text: string }[];
}

/**
 * The build-time catalogue indexes, in the shape the matcher takes. Files that
 * are unreadable, malformed or missing an asset id are skipped: an index that
 * cannot be tied to an exact PDF must not produce page links.
 */
export async function readStaticIndexes(dir: string = STATIC_INDEX_DIR): Promise<CatalogueIndex[]> {
  let names: string[];
  try {
    names = await readdir(dir);
  } catch {
    return [];
  }

  const indexes: CatalogueIndex[] = [];
  for (const name of names.sort()) {
    const match = /^(.+)-(\d+)\.json$/.exec(name);
    if (!match) continue;
    try {
      const raw = JSON.parse(await readFile(path.join(dir, name), "utf8")) as StaticIndexFile;
      if (!raw.assetId || !Array.isArray(raw.pages)) continue;
      indexes.push({
        catalogId: `${match[1]}-${match[2]}`,
        brandSlug: match[1],
        brand: raw.brand || match[1],
        catalogueIndex: Number(match[2]),
        title: raw.title || "",
        assetId: raw.assetId,
        pages: raw.pages.filter((p) => typeof p?.page === "number" && typeof p?.text === "string"),
      });
    } catch {
      // A corrupt file only costs that catalogue's matches.
    }
  }
  return indexes;
}
