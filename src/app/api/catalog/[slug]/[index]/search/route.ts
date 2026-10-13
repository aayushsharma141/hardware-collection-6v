import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { createUpstashStore } from "@/lib/catalog/indexing/store";
import { catalogueIdFrom, findInCatalogue } from "@/lib/catalog/search/findInCatalogue";
import { logger } from "@/lib/logger";

/**
 * Search inside one catalogue: GET /api/catalog/<slug>/<n>/search?q=hinge
 *
 * Returns `{ matches: [{ page, snippet, score }] }`, the ranked pages the
 * viewer lists. The catalogue's page text stays on the server, as the PDF does
 * behind /api/catalog/<slug>/<n>. 404 when the catalogue has no index, which
 * the panel shows as "search unavailable".
 *
 * Each response holds at most 60 short snippets, and requests are rate limited
 * per IP, so the text cannot be pulled out in bulk the way the old public JSON
 * files could be.
 */

export const runtime = "nodejs";

const MAX_QUERY = 80;

let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }),
    // A customer types a handful of searches a minute; a scraper needs thousands.
    limiter: Ratelimit.slidingWindow(30, "1 m"),
  });
}

const HEADERS = { "Cache-Control": "private, max-age=300", "X-Robots-Tag": "noindex" };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; index: string }> }
) {
  const { slug, index } = await params;
  const catalogId = catalogueIdFrom(slug, index);
  if (!catalogId) return NextResponse.json({ error: "Not found" }, { status: 404, headers: HEADERS });

  if (ratelimit) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    try {
      const { success } = await ratelimit.limit(`ratelimit_catalog_search_${ip}`);
      if (!success) {
        logger.warn("api.ratelimit_exceeded", { ip, route: "/api/catalog/search" });
        return NextResponse.json({ error: "Too many searches" }, { status: 429, headers: HEADERS });
      }
    } catch {
      // Redis down: search still works, unthrottled, rather than failing the customer.
    }
  }

  const query = (request.nextUrl.searchParams.get("q") ?? "").slice(0, MAX_QUERY);
  const matches = await findInCatalogue(catalogId, query, { kv: createUpstashStore() });
  if (!matches) return NextResponse.json({ error: "Not found" }, { status: 404, headers: HEADERS });
  return NextResponse.json({ matches }, { headers: HEADERS });
}
