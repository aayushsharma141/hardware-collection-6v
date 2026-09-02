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
 */

export const runtime = "nodejs";

const MAX_INDEX = 50;

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
    urls = await client.fetch<string[] | null>(
      `*[_type == "brand" && slug.current == $slug][0].officialCatalogs[].asset->url`,
      { slug }
    );
  } catch (err) {
    console.error("Catalog lookup failed:", err);
    return new Response("Upstream error", { status: 502 });
  }

  const target = urls?.[i];
  if (!target) return new Response("Not found", { status: 404 });

  const range = req.headers.get("range");
  const upstream = await fetch(target, {
    headers: range ? { Range: range } : undefined,
    cache: "no-store",
  });

  if (!upstream.ok && upstream.status !== 206) {
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

  return new Response(upstream.body, { status: upstream.status, headers });
}
