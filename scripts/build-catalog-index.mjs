#!/usr/bin/env node
/**
 * Builds the per-catalogue text indexes the viewer's search reads from
 * /search-indexes/<brand-slug>-<n>.json, where <n> is the catalogue's position
 * in the brand's list (created order — the same order /api/catalog/<slug>/<n>
 * serves, so index and PDF always refer to the same file).
 *
 * Best-effort by design: the search panel already shows a "not available"
 * state when an index is missing, so anything that goes wrong here — no
 * Sanity credentials, no network, an unreadable PDF — is logged and skipped
 * rather than failing the build.
 *
 *   node scripts/build-catalog-index.mjs
 */

import { createClient } from "@sanity/client";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

try {
  process.loadEnvFile(path.resolve(process.cwd(), ".env.local"));
} catch {
  // Vercel and CI provide the environment directly.
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const outDir = path.resolve(process.cwd(), "public", "search-indexes");

async function main() {
  if (!projectId || !dataset) {
    console.log("[catalog-index] Sanity project not configured; skipping.");
    return;
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-02-12",
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    perspective: "published",
  });

  const brands = await client.fetch(`*[_type == "brand" && defined(slug.current)]{
    "slug": slug.current,
    name,
    "catalogues": *[_type == "catalogue" && brand._ref == ^._id] | order(_createdAt asc) {
      "title": coalesce(catalogueName, ""),
      "pdfUrl": pdfFile.asset->url,
      "size": pdfFile.asset->size,
      "assetId": pdfFile.asset._ref
    }
  }`);

  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  await mkdir(outDir, { recursive: true });

  let built = 0;
  let reused = 0;
  let failed = 0;

  for (const brand of brands) {
    for (const [index, entry] of brand.catalogues.entries()) {
      if (!entry.pdfUrl) continue;
      const catalogId = `${brand.slug}-${index}`;
      const file = path.join(outDir, `${catalogId}.json`);

      // Sanity asset ids are content-addressed, so an unchanged id means the
      // existing index is still correct and the (large) PDF need not be fetched.
      if (existsSync(file)) {
        try {
          const existing = JSON.parse(await readFile(file, "utf8"));
          if (existing.assetId && existing.assetId === entry.assetId) {
            reused++;
            continue;
          }
        } catch {
          // Corrupt index: rebuild it.
        }
      }

      try {
        const res = await fetch(entry.pdfUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = new Uint8Array(await res.arrayBuffer());
        const pdf = await getDocument({ data, useSystemFonts: true, verbosity: 0 }).promise;

        const pages = [];
        for (let n = 1; n <= pdf.numPages; n++) {
          const page = await pdf.getPage(n);
          const content = await page.getTextContent();
          const text = content.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();
          pages.push({ page: n, text });
          page.cleanup();
        }
        if (typeof pdf.destroy === "function") await pdf.destroy();
        else if (typeof pdf.cleanup === "function") pdf.cleanup();

        await writeFile(
          file,
          JSON.stringify({
            catalog: catalogId,
            brand: brand.name,
            title: entry.title || `${brand.name} Catalog ${index + 1}`,
            assetId: entry.assetId,
            pages,
          })
        );
        built++;
      } catch (error) {
        failed++;
        console.warn(`[catalog-index] ${catalogId}: ${error instanceof Error ? error.message : error}`);
      }
    }
  }

  console.log(`[catalog-index] built ${built}, reused ${reused}, failed ${failed}.`);
}

main().catch((error) => {
  console.warn("[catalog-index] skipped:", error instanceof Error ? error.message : error);
});
