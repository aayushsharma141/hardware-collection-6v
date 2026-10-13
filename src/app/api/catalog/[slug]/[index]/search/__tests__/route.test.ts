import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const limit = vi.fn();
const find = vi.fn();

// The limiter is built at import time when Upstash is configured.
vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example");
vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "t");
vi.mock("@upstash/redis", () => ({ Redis: class {} }));
vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: Object.assign(
    class {
      limit = (...args: unknown[]) => limit(...args);
    },
    { slidingWindow: () => ({}) }
  ),
}));
vi.mock("@/lib/catalog/indexing/store", () => ({ createUpstashStore: () => null }));
vi.mock("@/lib/catalog/search/findInCatalogue", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/catalog/search/findInCatalogue")>()),
  findInCatalogue: (...args: unknown[]) => find(...args),
}));
vi.mock("@/lib/logger", () => ({ logger: { warn: vi.fn() } }));

const { GET } = await import("../route");

const call = (slug: string, index: string, q = "hinge") =>
  GET(new NextRequest(`http://localhost/api/catalog/${slug}/${index}/search?q=${q}`, { headers: { "x-forwarded-for": "1.2.3.4, 10.0.0.1" } }), {
    params: Promise.resolve({ slug, index }),
  });

describe("GET /api/catalog/[slug]/[index]/search", () => {
  beforeEach(() => {
    limit.mockReset().mockResolvedValue({ success: true });
    find.mockReset().mockResolvedValue([{ page: 4, snippet: "…hinge…", score: 9 }]);
  });

  it("returns only page, snippet and score", async () => {
    const res = await call("hafele", "0");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ matches: [{ page: 4, snippet: "…hinge…", score: 9 }] });
    expect(find).toHaveBeenCalledWith("hafele-0", "hinge", expect.anything());
    expect(res.headers.get("X-Robots-Tag")).toBe("noindex");
  });

  it("is 404 when the catalogue has no index", async () => {
    find.mockResolvedValue(null);
    expect((await call("decor-bath", "0")).status).toBe(404);
  });

  it("is 404 for a slug or position that is not a catalogue, without searching", async () => {
    expect((await call("..", "0")).status).toBe(404);
    expect((await call("blum", "99")).status).toBe(404);
    expect(find).not.toHaveBeenCalled();
  });

  it("is 429 once the caller's IP is over the limit, keyed on the client address", async () => {
    limit.mockResolvedValue({ success: false });
    expect((await call("hafele", "0")).status).toBe(429);
    expect(limit).toHaveBeenCalledWith("ratelimit_catalog_search_1.2.3.4");
    expect(find).not.toHaveBeenCalled();
  });

  it("still searches when the rate limiter itself is unreachable", async () => {
    limit.mockRejectedValue(new Error("ECONNRESET"));
    expect((await call("hafele", "0")).status).toBe(200);
  });
});
