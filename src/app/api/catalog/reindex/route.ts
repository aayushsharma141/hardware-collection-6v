import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { after, NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { client } from "@/content/sanity/client";
import { normalizeBrandKey } from "@/content/fallback/brands";
import { extractPages } from "@/lib/catalog/indexing/extract";
import { syncCatalogues } from "@/lib/catalog/indexing/reindex";
import { fetchCatalogueSources } from "@/lib/catalog/indexing/sources";
import { createUpstashStore } from "@/lib/catalog/indexing/store";
import { CATALOGUE_MATCHES_TAG } from "@/lib/catalog/search/getCategoryMatches";
import { logger } from "@/lib/logger";
import type { Brand } from "@/types/catalog";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Time one invocation spends indexing, leaving headroom under `maxDuration`. */
const BUDGET_MS = 40_000;

/** Webhook documents that can change which catalogues exist. */
const RELEVANT_TYPES = new Set(["catalogue", "brand"]);

function bearerMatches(header: string | null, secret: string): boolean {
  if (!header?.startsWith("Bearer ")) return false;
  const given = Buffer.from(header.slice("Bearer ".length));
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/**
 * Brings the stored catalogue text index (and the category matches built from
 * it) in line with Sanity. Called by a Sanity webhook when a catalogue is
 * created, replaced or deleted, or by hand with `Authorization: Bearer
 * <CATALOG_REINDEX_SECRET>`.
 *
 * It does whatever fits in one invocation and, when catalogues remain,
 * schedules itself again, so a 70 MB PDF is indexed across several short runs.
 * It never returns PDF content.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CATALOG_REINDEX_SECRET;
  if (!secret) {
    logger.error("catalog.reindex_unconfigured", { missing: "CATALOG_REINDEX_SECRET" });
    return NextResponse.json({ message: "Catalogue reindexing is not configured." }, { status: 500 });
  }

  const authorization = req.headers.get("authorization");
  let force = false;
  if (authorization) {
    if (!bearerMatches(authorization, secret)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    force = req.nextUrl.searchParams.get("force") === "1";
  } else {
    // A Sanity webhook: authenticate by signature, then look at what changed.
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret);
    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    if (body?._type && !RELEVANT_TYPES.has(body._type)) {
      return NextResponse.json({ skipped: true, reason: `${body._type} does not affect catalogues` });
    }
  }

  const kv = createUpstashStore();
  if (!kv) {
    logger.error("catalog.reindex_store_missing", { missing: "UPSTASH_REDIS_REST_URL/TOKEN" });
    return NextResponse.json({ message: "Catalogue index store is not configured." }, { status: 503 });
  }

  try {
    const sources = await fetchCatalogueSources(client);
    const result = await syncCatalogues(
      sources,
      { kv, extract: extractPages, brandKeyOf: (slug) => normalizeBrandKey({ slug } as Brand) },
      { budgetMs: BUDGET_MS, force }
    );

    if (result.matchesChanged) revalidateTag(CATALOGUE_MATCHES_TAG, { expire: 0 });

    if (result.pending.length > 0) {
      // Continue in a fresh invocation. The next run resumes from stored
      // progress, so a failed hand-off costs time, never correctness.
      const next = new URL("/api/catalog/reindex", req.url);
      after(async () => {
        try {
          await fetch(next, {
            method: "POST",
            headers: { authorization: `Bearer ${secret}` },
            signal: AbortSignal.timeout(5_000),
          });
        } catch {
          // The request has been sent; only waiting for its answer timed out.
        }
      });
    }

    logger.info("catalog.reindex_run", {
      outcomes: result.outcomes,
      pending: result.pending.length,
      pruned: result.pruned.length,
      notFullySearchable: Object.keys(result.coverage),
    });
    return NextResponse.json({
      outcomes: result.outcomes,
      pending: result.pending,
      pruned: result.pruned,
      // Read, but not fully searchable until OCR is applied (scripts/ocr-catalogues.ts).
      notFullySearchable: result.coverage,
      matchesChanged: result.matchesChanged,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logger.error("catalog.reindex_error", { error: message });
    return NextResponse.json({ message: "Reindex failed." }, { status: 500 });
  }
}
