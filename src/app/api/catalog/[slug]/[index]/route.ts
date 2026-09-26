import { NextRequest } from "next/server";
import { client } from "@/content/sanity/client";

/**
 * Streams a brand catalog PDF through the site's own origin.
 *
 * The point is that the Sanity CDN URL never reaches the browser: the viewer
 * asks for /api/catalog/<brand>/<n>, so there is no shareable asset link in
 * the page source and nothing for a right-click to save by address. Range
 * requests are forwarded upstream so pdf.js can fetch only the pages being
 * read rather than pulling a 70 MB file to show page one.
 *
 * This is not DRM. Anything the browser renders can still be screenshotted,
 * and the response body is visible in devtools. It stops casual downloading
 * and link-sharing, which is what "view only" can honestly mean on the web.
 *
 * Aborted requests are normal here, not exceptional: pdf.js opens the document
 * with a full GET to learn its length, then drops that request the moment it
 * can switch to ranges. The largest catalog in the library is ~70 MB, so an
 * abandoned read that keeps running server-side is expensive, and an upstream
 * connection reset must never reach the viewer as a 5xx — pdf.js treats that
 * as fatal and the customer sees "Catalogue temporarily unavailable".
 */

export const runtime = "nodejs";

const MAX_INDEX = 50;
const RETRY_DELAY_MS = 250;

// Cache brand -> official catalog asset URLs for 10 minutes to prevent
// repetitive GROQ queries across concurrent Range requests.
interface CacheEntry {
  urls: string[] | null;
  expiresAt: number;
}
const urlCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000;

async function getCatalogUrls(slug: string): Promise<string[] | null> {
  const cached = urlCache.get(slug);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.urls;
  }
  const urls = await client.fetch<string[] | null>(
    `*[_type == "brand" && slug.current == $slug][0].officialCatalogs[].asset->url`,
    { slug }
  );
  urlCache.set(slug, { urls, expiresAt: Date.now() + CACHE_TTL_MS });
  return urls;
}

/**
 * Only the client going away counts as an abort.
 *
 * An AbortError raised for any other reason is a real failure and must be
 * reported as one — answering a viewer that is still waiting with a bodyless
 * 499 leaves pdf.js with an unexplained network error.
 */
function isClientAbort(signal: AbortSignal): boolean {
  return signal.aborted;
}

/**
 * Fetches upstream, retrying once on a transient network failure.
 *
 * A dropped socket to the CDN is not a reason to fail the catalog: the retry
 * costs a quarter second and turns most resets into a served page.
 */
async function fetchUpstream(
  target: string,
  range: string | null,
  signal: AbortSignal
): Promise<Response> {
  const init: RequestInit = {
    headers: range ? { Range: range } : undefined,
    cache: "no-store",
    // Propagated so that when the viewer drops a request, the download from
    // Sanity stops too rather than running to completion unread.
    signal,
  };

  try {
    return await fetch(target, init);
  } catch (err) {
    if (isClientAbort(signal)) throw err;
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    return fetch(target, init);
  }
}

/**
 * Ends the response cleanly when the source dies mid-body.
 *
 * The common cause is the viewer abandoning its opening read, by which point
 * nobody is listening; surfacing that as a stream error only produces a
 * "failed to pipe response" trace for something that worked as intended.
 */
function forgivingStream(source: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const reader = source.getReader();
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) controller.close();
        else controller.enqueue(value);
      } catch {
        controller.close();
      }
    },
    cancel(reason) {
      void reader.cancel(reason).catch(() => {});
    },
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; index: string }> }
) {
  const { slug, index } = await params;

  const i = Number.parseInt(index, 10);
  if (!Number.isInteger(i) || i < 0 || i > MAX_INDEX) {
    return new Response("Not found", { status: 404 });
  }

  let urls: string[] | null = null;
  try {
    urls = await getCatalogUrls(slug);
  } catch (err) {
    console.error("Catalog lookup failed:", err);
    return new Response("Upstream error", { status: 502 });
  }

  const target = urls?.[i];
  if (!target) return new Response("Not found", { status: 404 });

  const range = req.headers.get("range");

  let upstream: Response;
  try {
    upstream = await fetchUpstream(target, range, req.signal);
  } catch (err) {
    if (isClientAbort(req.signal)) {
      // The viewer went away. Nothing to serve and nothing to report.
      return new Response(null, { status: 499 });
    }
    console.error(`Catalog fetch failed for ${slug}/${i}:`, err);
    return new Response("Upstream error", { status: 502 });
  }

  if (!upstream.ok && upstream.status !== 206) {
    console.error(`Catalog upstream returned ${upstream.status} for ${slug}/${i}`);
    return new Response("Upstream error", { status: 502 });
  }

  const headers = new Headers({
    "Content-Type": "application/pdf",
    // inline, and with no filename — nothing here suggests "save me".
    "Content-Disposition": "inline",
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=3600",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex, nofollow",
  });
  for (const h of ["content-length", "content-range", "etag", "last-modified"]) {
    const v = upstream.headers.get(h);
    if (v) headers.set(h, v);
  }

  // When serving range chunks (206 Partial Content), convert to ArrayBuffer
  // so Node.js/Vercel does not use Transfer-Encoding: chunked with Content-Range,
  // which iOS Safari / WebKit rejects as an invalid Range response.
  if (upstream.status === 206) {
    try {
      const buffer = await upstream.arrayBuffer();
      return new Response(buffer, { status: 206, headers });
    } catch (err) {
      if (isClientAbort(req.signal)) return new Response(null, { status: 499 });
      console.error(`Catalog range read failed for ${slug}/${i}:`, err);
      return new Response("Upstream error", { status: 502 });
    }
  }

  if (!upstream.body) return new Response("Upstream error", { status: 502 });

  return new Response(forgivingStream(upstream.body), {
    status: upstream.status,
    headers,
  });
}
