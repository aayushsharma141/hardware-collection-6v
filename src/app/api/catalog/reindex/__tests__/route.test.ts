import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const sync = vi.fn();
const store = vi.fn();
const revalidate = vi.fn();
const after = vi.fn();

vi.mock("next/cache", () => ({ revalidateTag: (...args: unknown[]) => revalidate(...args), unstable_cache: (fn: unknown) => fn }));
vi.mock("next/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/server")>()),
  after: (fn: unknown) => after(fn),
}));
vi.mock("@/content/sanity/client", () => ({ client: {} }));
vi.mock("@/lib/catalog/indexing/sources", () => ({ fetchCatalogueSources: async () => [] }));
vi.mock("@/lib/catalog/indexing/reindex", () => ({ syncCatalogues: (...args: unknown[]) => sync(...args) }));
vi.mock("@/lib/catalog/indexing/store", () => ({ createUpstashStore: () => store() }));
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() } }));

const { POST } = await import("../route");

const request = (headers: Record<string, string> = {}, query = "") =>
  new NextRequest(`http://localhost/api/catalog/reindex${query}`, { method: "POST", headers, body: "{}" });

const result = (extra = {}) => ({
  outcomes: { "blum-0": "complete" },
  pending: [],
  pruned: [],
  coverage: {},
  matchesChanged: true,
  ...extra,
});

describe("POST /api/catalog/reindex", () => {
  beforeEach(() => {
    vi.stubEnv("CATALOG_REINDEX_SECRET", "s3cret");
    store.mockReturnValue({});
    sync.mockResolvedValue(result());
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("answers 500 when the secret is not configured, rather than looking like bad auth", async () => {
    vi.stubEnv("CATALOG_REINDEX_SECRET", "");
    expect((await POST(request({ authorization: "Bearer s3cret" }))).status).toBe(500);
    expect(sync).not.toHaveBeenCalled();
  });

  it("rejects a wrong bearer token", async () => {
    expect((await POST(request({ authorization: "Bearer nope" }))).status).toBe(401);
    expect((await POST(request({ authorization: "Basic s3cret" }))).status).toBe(401);
    expect(sync).not.toHaveBeenCalled();
  });

  it("rejects an unsigned webhook call", async () => {
    expect((await POST(request())).status).toBe(401);
    expect(sync).not.toHaveBeenCalled();
  });

  it("answers 503 when the index store is not configured", async () => {
    store.mockReturnValue(null);
    expect((await POST(request({ authorization: "Bearer s3cret" }))).status).toBe(503);
  });

  it("syncs, invalidates the cached matches and reports catalogues needing OCR", async () => {
    sync.mockResolvedValue(result({ coverage: { "godrej-0": { coverage: "none", emptyPages: 4, pages: 4 } } }));
    const response = await POST(request({ authorization: "Bearer s3cret" }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.notFullySearchable).toEqual({ "godrej-0": { coverage: "none", emptyPages: 4, pages: 4 } });
    expect(revalidate).toHaveBeenCalledWith("catalogue-matches", { expire: 0 });
    expect(after).not.toHaveBeenCalled();
    expect(sync.mock.calls[0][2]).toMatchObject({ force: false });
  });

  it("schedules a follow-up run while catalogues are pending", async () => {
    sync.mockResolvedValue(result({ pending: ["hafele-0"], matchesChanged: false }));
    await POST(request({ authorization: "Bearer s3cret" }));
    expect(after).toHaveBeenCalledOnce();
    expect(revalidate).not.toHaveBeenCalled();
  });

  it("honours ?force=1 only for an authenticated caller", async () => {
    await POST(request({ authorization: "Bearer s3cret" }, "?force=1"));
    expect(sync.mock.calls[0][2]).toMatchObject({ force: true });
  });
});
