import { Redis } from "@upstash/redis";
import type { CatalogueIndex, CategoryMatches, IndexedPage } from "../search/types";

/** The few Redis operations the indexer uses, so tests can swap in a Map. */
export interface KeyValueStore {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
  del(...keys: string[]): Promise<void>;
}

/**
 * The Upstash store, or `null` when it is not configured. Callers treat `null`
 * as "catalogue search is unavailable" and degrade, as `api/leads` does for its
 * rate limiter.
 */
export function createUpstashStore(env: NodeJS.ProcessEnv = process.env): KeyValueStore | null {
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const redis = new Redis({ url, token });
  return {
    get: async <T>(key: string) => (await redis.get<T>(key)) ?? null,
    set: async (key, value) => {
      await redis.set(key, value);
    },
    del: async (...keys) => {
      if (keys.length) await redis.del(...keys);
    },
  };
}

export const KEYS = {
  manifest: "catalog:manifest",
  matches: "catalog:matches",
  index: (catalogId: string) => `catalog:index:${catalogId}`,
  progress: (catalogId: string) => `catalog:progress:${catalogId}`,
  ocr: (assetId: string) => `catalog:ocr:${assetId}`,
} as const;

export type ManifestStatus = "complete" | "partial" | "failed";

/**
 * How much of a catalogue can be searched. `full`: nearly every page has text.
 * `partial`: a real share of pages has none (image-only pages), so matches may
 * be missed. `none`: it is effectively scanned and needs OCR before it can find
 * anything. Only an explicit OCR step moves a catalogue up this scale.
 */
export type Coverage = "full" | "partial" | "none";

export interface ManifestEntry {
  assetId: string;
  status: ManifestStatus;
  pages: number;
  updatedAt: number;
  error?: string;
  /** Present once the whole PDF has been read. */
  coverage?: Coverage;
  /** Pages with usable text, and pages without, after any OCR was applied. */
  textPages?: number;
  emptyPages?: number;
}

export type Manifest = Record<string, ManifestEntry>;

/** A catalogue part-way through extraction, so a long PDF can span invocations. */
export interface Progress {
  assetId: string;
  numPages: number;
  nextPage: number;
  pages: IndexedPage[];
}

/** OCR text for scanned pages, keyed by page number, stored per PDF (asset). */
export type OcrPages = Record<string, string>;

export interface StoredMatches {
  generatedAt: number;
  matches: CategoryMatches;
}

export async function readManifest(kv: KeyValueStore): Promise<Manifest> {
  return (await kv.get<Manifest>(KEYS.manifest)) ?? {};
}

export async function writeManifest(kv: KeyValueStore, manifest: Manifest): Promise<void> {
  await kv.set(KEYS.manifest, manifest);
}

export async function readIndex(kv: KeyValueStore, catalogId: string): Promise<CatalogueIndex | null> {
  return kv.get<CatalogueIndex>(KEYS.index(catalogId));
}

export async function readMatches(kv: KeyValueStore): Promise<StoredMatches | null> {
  return kv.get<StoredMatches>(KEYS.matches);
}
