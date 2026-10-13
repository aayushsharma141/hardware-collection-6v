import { logger } from "@/lib/logger";
import { rankCategories } from "../search/rank";
import type { CatalogueIndex, IndexedPage } from "../search/types";
import type { ExtractPages } from "./extract";
import type { CatalogueSource } from "./sources";
import {
  KEYS,
  type KeyValueStore,
  type Coverage,
  type Manifest,
  type OcrPages,
  type Progress,
  type StoredMatches,
  readIndex,
  readManifest,
  writeManifest,
} from "./store";

export interface ReindexDeps {
  kv: KeyValueStore;
  extract: ExtractPages;
  /** Brand slug -> canonical brand key (the app passes `normalizeBrandKey`). */
  brandKeyOf: (brandSlug: string) => string;
  now?: () => number;
}

export interface SyncOptions {
  /** Time the whole run may take; work that does not fit is left `pending`. */
  budgetMs: number;
  /** Reindex catalogues even when their stored asset id is current. */
  force?: boolean;
  /** Retry catalogues whose last attempt on this exact PDF failed. */
  retryFailed?: boolean;
}

/**
 * `complete`: fully read and searchable. `needs_ocr`: read, but too many pages
 * have no text for it to be searched properly until OCR is applied. `partial`:
 * extraction is part-way through. It is never reported as `complete` while pages
 * are unsearchable.
 */
export type CatalogueOutcome = "unchanged" | "complete" | "needs_ocr" | "partial" | "failed" | "skipped";

export interface SyncResult {
  outcomes: Record<string, CatalogueOutcome>;
  /** Catalogues still to do (budget ran out, or part-way through). */
  pending: string[];
  /** Catalogues removed because they no longer exist in Sanity. */
  pruned: string[];
  /** Every stored catalogue that is not fully searchable yet, with why. */
  coverage: Record<string, { coverage: Coverage; emptyPages: number; pages: number }>;
  matchesChanged: boolean;
}

/** Share of pages without text above which a catalogue counts as only partly searchable. */
const PARTIAL_EMPTY_SHARE = 0.15;
/** Share above which it is effectively scanned. */
const NONE_EMPTY_SHARE = 0.9;

export function assessCoverage(pages: readonly IndexedPage[]): {
  coverage: Coverage;
  textPages: number;
  emptyPages: number;
} {
  const textPages = pages.filter((p) => p.text.trim().length > 0).length;
  const emptyPages = pages.length - textPages;
  const share = pages.length === 0 ? 1 : emptyPages / pages.length;
  const coverage: Coverage = share >= NONE_EMPTY_SHARE ? "none" : share > PARTIAL_EMPTY_SHARE ? "partial" : "full";
  return { coverage, textPages, emptyPages };
}

/** A page's text, or the OCR text for it when the PDF has none. */
function withOcr(pages: IndexedPage[], ocr: OcrPages | null): IndexedPage[] {
  if (!ocr) return pages;
  return pages.map((p) => (p.text ? p : { ...p, text: (ocr[String(p.page)] ?? "").toLowerCase() }));
}

/** Rebuilds the category -> brand matches from every complete stored index. */
export async function rebuildMatches(deps: ReindexDeps): Promise<StoredMatches> {
  const { kv } = deps;
  const manifest = await readManifest(kv);
  const loaded = await Promise.all(
    Object.entries(manifest)
      .filter(([, entry]) => entry.status === "complete")
      .map(async ([catalogId, entry]) => {
        const index = await readIndex(kv, catalogId);
        // An index built from an older PDF would send visitors to the wrong pages.
        return index && index.assetId === entry.assetId ? index : null;
      })
  );
  const indexes = loaded.filter((i): i is CatalogueIndex => i !== null);
  const stored: StoredMatches = {
    generatedAt: (deps.now ?? Date.now)(),
    matches: rankCategories(indexes, deps.brandKeyOf),
  };
  await kv.set(KEYS.matches, stored);
  return stored;
}

/**
 * Brings the stored indexes in line with the catalogues in Sanity.
 *
 * Idempotent and resumable: a catalogue whose asset id is unchanged is skipped,
 * one that did not finish resumes from its saved page, one that failed is left
 * alone until its PDF changes (or `retryFailed`), so a broken file cannot
 * starve the others. Whatever fits in `budgetMs` is done; the rest is `pending`.
 */
export async function syncCatalogues(
  sources: readonly CatalogueSource[],
  deps: ReindexDeps,
  options: SyncOptions
): Promise<SyncResult> {
  const now = deps.now ?? Date.now;
  const started = now();
  const deadline = started + options.budgetMs;
  const { kv } = deps;

  const manifest: Manifest = await readManifest(kv);
  const outcomes: Record<string, CatalogueOutcome> = {};
  const pending: string[] = [];
  const pruned: string[] = [];
  let changed = false;

  const wanted = new Set(sources.map((s) => s.catalogId));
  for (const catalogId of Object.keys(manifest)) {
    if (wanted.has(catalogId)) continue;
    await kv.del(KEYS.index(catalogId), KEYS.progress(catalogId));
    delete manifest[catalogId];
    pruned.push(catalogId);
    changed = true;
  }

  for (const source of sources) {
    const entry = manifest[source.catalogId];
    const current = entry?.assetId === source.assetId;

    if (current && entry.status === "complete" && !options.force) {
      outcomes[source.catalogId] = "unchanged";
      continue;
    }
    if (current && entry.status === "failed" && !options.retryFailed && !options.force) {
      outcomes[source.catalogId] = "skipped";
      continue;
    }
    if (now() >= deadline) {
      pending.push(source.catalogId);
      continue;
    }

    try {
      const result = await indexOne(source, deps, deadline, Boolean(options.force));
      outcomes[source.catalogId] =
        result.status === "complete" && result.entry.coverage !== "full" ? "needs_ocr" : result.status;
      manifest[source.catalogId] = result.entry;
      if (result.status === "partial") pending.push(source.catalogId);
      if (result.status === "complete") changed = true;
    } catch (error) {
      const message = (error instanceof Error ? error.message : String(error)).slice(0, 300);
      logger.error("catalog.reindex_failed", { catalogId: source.catalogId, error: message });
      outcomes[source.catalogId] = "failed";
      manifest[source.catalogId] = {
        assetId: source.assetId,
        status: "failed",
        pages: 0,
        updatedAt: now(),
        error: message,
      };
      // An index built from a different PDF now points at the wrong pages: drop it.
      const stale = await readIndex(kv, source.catalogId);
      if (stale && stale.assetId !== source.assetId) {
        await kv.del(KEYS.index(source.catalogId));
        changed = true;
      }
      await kv.del(KEYS.progress(source.catalogId));
    }
    await writeManifest(kv, manifest);
  }

  await writeManifest(kv, manifest);
  if (changed) await rebuildMatches(deps);

  const coverage: SyncResult["coverage"] = {};
  for (const [catalogId, entry] of Object.entries(manifest)) {
    if (entry.status === "complete" && entry.coverage && entry.coverage !== "full") {
      coverage[catalogId] = { coverage: entry.coverage, emptyPages: entry.emptyPages ?? 0, pages: entry.pages };
    }
  }

  return { outcomes, pending, pruned, coverage, matchesChanged: changed };
}

async function indexOne(
  source: CatalogueSource,
  deps: ReindexDeps,
  deadline: number,
  fresh: boolean
): Promise<{ status: "complete" | "partial"; entry: Manifest[string] }> {
  const { kv, extract } = deps;
  const now = deps.now ?? Date.now;

  const saved = fresh ? null : await kv.get<Progress>(KEYS.progress(source.catalogId));
  const resume = saved && saved.assetId === source.assetId ? saved : null;
  const batch = await extract(source.pdfUrl, resume?.nextPage ?? 1, deadline);
  const pages = [...(resume?.pages ?? []), ...batch.pages];

  if (batch.nextPage !== null) {
    const progress: Progress = {
      assetId: source.assetId,
      numPages: batch.numPages,
      nextPage: batch.nextPage,
      pages,
    };
    await kv.set(KEYS.progress(source.catalogId), progress);
    return {
      status: "partial",
      entry: { assetId: source.assetId, status: "partial", pages: pages.length, updatedAt: now() },
    };
  }

  const ocr = await kv.get<OcrPages>(KEYS.ocr(source.assetId));
  const index: CatalogueIndex = {
    catalogId: source.catalogId,
    brandSlug: source.brandSlug,
    brand: source.brand,
    catalogueIndex: source.catalogueIndex,
    title: source.title,
    assetId: source.assetId,
    pages: withOcr(pages, ocr),
  };
  await kv.set(KEYS.index(source.catalogId), index);
  await kv.del(KEYS.progress(source.catalogId));
  return {
    status: "complete",
    entry: {
      assetId: source.assetId,
      status: "complete",
      pages: pages.length,
      updatedAt: now(),
      ...assessCoverage(index.pages),
    },
  };
}

/**
 * Stores OCR text for a scanned catalogue and folds it into the stored index
 * when that index was built from the same PDF. Returns whether matches changed.
 */
export async function applyOcr(
  source: Pick<CatalogueSource, "catalogId" | "assetId">,
  ocr: OcrPages,
  deps: ReindexDeps
): Promise<boolean> {
  const { kv } = deps;
  await kv.set(KEYS.ocr(source.assetId), ocr);
  const index = await readIndex(kv, source.catalogId);
  if (!index || index.assetId !== source.assetId) return false;
  const pages = withOcr(index.pages, ocr);
  await kv.set(KEYS.index(source.catalogId), { ...index, pages });
  const manifest = await readManifest(kv);
  if (manifest[source.catalogId]?.assetId === source.assetId) {
    manifest[source.catalogId] = {
      ...manifest[source.catalogId],
      updatedAt: (deps.now ?? Date.now)(),
      ...assessCoverage(pages),
    };
    await writeManifest(kv, manifest);
  }
  await rebuildMatches(deps);
  return true;
}
