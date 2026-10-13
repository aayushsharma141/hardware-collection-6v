/**
 * Builds or refreshes the catalogue search index in Upstash Redis: the per-page
 * text of every catalogue PDF in Sanity and the category -> brand matches that
 * /collections reads. Same code as POST /api/catalog/reindex, without a time
 * limit, so it is the way to bootstrap the index or rebuild it from scratch.
 *
 *   npx tsx scripts/reindex-catalogues.ts            # changed catalogues only
 *   npx tsx scripts/reindex-catalogues.ts --force    # every catalogue
 *   npx tsx scripts/reindex-catalogues.ts --retry-failed
 *   npx tsx scripts/reindex-catalogues.ts --report   # print the stored matches and coverage, change nothing
 *
 * Needs NEXT_PUBLIC_SANITY_*, UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
 * (read from .env.local when present). After a run, /collections picks the new
 * matches up within its cache window (one hour), or immediately after the next
 * POST to /api/catalog/reindex.
 */
import path from "node:path";
import { createClient } from "next-sanity";
import { normalizeBrandKey } from "../src/content/fallback/brands";
import { extractPages } from "../src/lib/catalog/indexing/extract";
import { syncCatalogues } from "../src/lib/catalog/indexing/reindex";
import { fetchCatalogueSources } from "../src/lib/catalog/indexing/sources";
import { createUpstashStore, readManifest, readMatches } from "../src/lib/catalog/indexing/store";
import type { Brand } from "../src/types/catalog";

try {
  process.loadEnvFile(path.resolve(process.cwd(), ".env.local"));
} catch {
  // CI provides the environment directly.
}

const args = new Set(process.argv.slice(2));

async function report() {
  const kv = createUpstashStore();
  if (!kv) throw new Error("UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set.");
  const manifest = await readManifest(kv);
  console.log("\nCatalogues:");
  for (const [id, entry] of Object.entries(manifest).sort()) {
    const detail = entry.status === "failed" ? `failed: ${entry.error}` : `${entry.status}, coverage ${entry.coverage ?? "?"} (${entry.emptyPages ?? "?"}/${entry.pages} pages without text)`;
    console.log(`  ${id.padEnd(16)} ${detail}`);
  }
  const stored = await readMatches(kv);
  console.log(`\nMatches (built ${stored ? new Date(stored.generatedAt).toISOString() : "never"}):`);
  for (const [slug, brands] of Object.entries(stored?.matches ?? {})) {
    console.log(`  ${slug}`);
    for (const b of brands) {
      const c = b.catalogues[0];
      console.log(`    ${b.brand.padEnd(12)} catalogue ${c.catalogueIndex}, best p.${c.pages[0].page}, pages ${c.pages.map((p) => p.page).join(",")}`);
      console.log(`      "${c.pages[0].snippet}"`);
    }
  }
}

async function main() {
  if (args.has("--report")) return report();

  const kv = createUpstashStore();
  if (!kv) throw new Error("UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set.");
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID / _DATASET are not set.");

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-02-12",
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    perspective: "published",
  });

  const sources = await fetchCatalogueSources(client);
  console.log(`[reindex] ${sources.length} catalogues in Sanity.`);
  const result = await syncCatalogues(
    sources,
    { kv, extract: extractPages, brandKeyOf: (slug) => normalizeBrandKey({ slug } as Brand) },
    { budgetMs: 60 * 60 * 1000, force: args.has("--force"), retryFailed: args.has("--retry-failed") }
  );

  for (const [id, outcome] of Object.entries(result.outcomes)) console.log(`  ${id.padEnd(16)} ${outcome}`);
  if (result.pruned.length) console.log(`[reindex] removed: ${result.pruned.join(", ")}`);
  if (result.pending.length) console.log(`[reindex] still pending: ${result.pending.join(", ")}`);
  const unsearchable = Object.entries(result.coverage);
  if (unsearchable.length) {
    console.log("[reindex] not fully searchable until OCR (npx tsx scripts/ocr-catalogues.ts):");
    for (const [id, c] of unsearchable) console.log(`  ${id.padEnd(16)} ${c.coverage}, ${c.emptyPages}/${c.pages} pages without text`);
  }
}

main().catch((error) => {
  console.error("[reindex] failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
