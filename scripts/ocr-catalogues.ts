/**
 * OCR for catalogue pages that have no text layer (scanned or image-only PDFs),
 * so their products can be found by the /collections catalogue search.
 *
 * Runs locally, not on Vercel: it renders each empty page with pdf.js and
 * @napi-rs/canvas and reads it with tesseract.js. Results are stored in Redis
 * under the PDF's Sanity asset id, so they survive reindexing and are dropped
 * automatically when the PDF is replaced (which then needs OCR again).
 *
 *   npx tsx scripts/ocr-catalogues.ts                      # every catalogue not fully searchable
 *   npx tsx scripts/ocr-catalogues.ts --catalog labacha-0  # one catalogue
 *   npx tsx scripts/ocr-catalogues.ts --catalog godrej-0 --out ocr-godrej.json --pages 1-4
 *                                                          # dry run: write JSON, touch nothing
 *
 * Needs NEXT_PUBLIC_SANITY_* and, unless --out is given, UPSTASH_REDIS_REST_*.
 */
import { writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createClient } from "next-sanity";
import { createWorker } from "tesseract.js";
import { normalizeBrandKey } from "../src/content/fallback/brands";
import { extractPages } from "../src/lib/catalog/indexing/extract";
import { applyOcr } from "../src/lib/catalog/indexing/reindex";
import { fetchCatalogueSources, type CatalogueSource } from "../src/lib/catalog/indexing/sources";
import { createUpstashStore, readIndex, readManifest, type OcrPages } from "../src/lib/catalog/indexing/store";
import type { Brand } from "../src/types/catalog";

try {
  process.loadEnvFile(path.resolve(process.cwd(), ".env.local"));
} catch {
  // CI provides the environment directly.
}

const argv = process.argv.slice(2);
const option = (name: string) => {
  const at = argv.indexOf(name);
  return at >= 0 ? argv[at + 1] : undefined;
};

/** Render scale: ~150 dpi for a typical A4 page; enough for catalogue type, and about twice as fast as 200 dpi. */
const SCALE = 2;
/** Below this mean confidence a page's OCR is treated as noise and not stored. */
const MIN_CONFIDENCE = 60;

function pageRange(spec: string | undefined): ((page: number) => boolean) | null {
  if (!spec) return null;
  const [from, to] = spec.split("-").map(Number);
  return (page) => page >= from && page <= (to || from);
}

async function emptyPages(source: CatalogueSource): Promise<number[]> {
  const kv = createUpstashStore();
  const stored = kv ? await readIndex(kv, source.catalogId) : null;
  const pages =
    stored && stored.assetId === source.assetId
      ? stored.pages
      : (await extractPages(source.pdfUrl, 1, Number.POSITIVE_INFINITY)).pages;
  return pages.filter((p) => !p.text.trim()).map((p) => p.page);
}

async function ocrCatalogue(source: CatalogueSource, wanted: number[]): Promise<OcrPages> {
  const response = await fetch(source.pdfUrl);
  if (!response.ok) throw new Error(`PDF download failed: HTTP ${response.status}`);
  const data = new Uint8Array(await response.arrayBuffer());
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const task = getDocument({ data, useSystemFonts: true, verbosity: 0 });
  const pdf = await task.promise;
  // Keep the downloaded language model out of the repository.
  const worker = await createWorker("eng", undefined, { cachePath: path.join(os.tmpdir(), "hc-tesseract") });
  const ocr: OcrPages = {};

  try {
    for (const pageNumber of wanted) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: SCALE });
      const { canvas } = pdf.canvasFactory.create(Math.ceil(viewport.width), Math.ceil(viewport.height)) as {
        canvas: { toBuffer(type: "image/png"): Buffer };
      };
      await page.render({ canvas: canvas as unknown as HTMLCanvasElement, viewport }).promise;
      const image = canvas.toBuffer("image/png");
      const { data: result } = await worker.recognize(image);
      const text = result.text.replace(/\s+/g, " ").trim();
      const kept = result.confidence >= MIN_CONFIDENCE && text.length > 0;
      if (kept) ocr[String(pageNumber)] = text.toLowerCase();
      console.log(
        `  p.${String(pageNumber).padEnd(4)} confidence ${result.confidence.toFixed(0).padStart(3)}  ${kept ? `"${text.slice(0, 70)}"` : "(discarded)"}`
      );
      page.cleanup();
    }
  } finally {
    await worker.terminate();
    await task.destroy();
  }
  return ocr;
}

async function main() {
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

  const out = option("--out");
  const only = option("--catalog");
  const inRange = pageRange(option("--pages"));
  const kv = createUpstashStore();
  if (!kv && !out) throw new Error("UPSTASH_REDIS_REST_* are not set; pass --out <file> for a dry run.");

  let targets = sources;
  if (only) targets = sources.filter((s) => s.catalogId === only);
  else if (kv) {
    const manifest = await readManifest(kv);
    targets = sources.filter((s) => manifest[s.catalogId]?.assetId === s.assetId && manifest[s.catalogId]?.coverage !== "full");
  }
  if (targets.length === 0) {
    console.log("[ocr] nothing to do.");
    return;
  }

  const collected: Record<string, OcrPages> = {};
  for (const source of targets) {
    const wanted = (await emptyPages(source)).filter((p) => !inRange || inRange(p));
    console.log(`[ocr] ${source.catalogId}: ${wanted.length} page(s) without text`);
    if (wanted.length === 0) continue;
    const ocr = await ocrCatalogue(source, wanted);
    collected[source.catalogId] = ocr;
    console.log(`[ocr] ${source.catalogId}: recovered ${Object.keys(ocr).length}/${wanted.length} page(s)`);
    if (!out && kv) {
      const applied = await applyOcr(source, ocr, {
        kv,
        extract: extractPages,
        brandKeyOf: (slug) => normalizeBrandKey({ slug } as Brand),
      });
      console.log(
        applied
          ? `[ocr] ${source.catalogId}: stored and merged; matches rebuilt.`
          : `[ocr] ${source.catalogId}: stored; it will be merged when this PDF is next indexed.`
      );
    }
  }

  if (out) {
    await writeFile(out, JSON.stringify(collected, null, 2));
    console.log(`[ocr] wrote ${out}; nothing stored.`);
  }
}

main().catch((error) => {
  console.error("[ocr] failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
