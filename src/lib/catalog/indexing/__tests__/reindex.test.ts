import { beforeEach, describe, expect, it, vi } from "vitest";
import { normalizeBrandKey } from "@/content/fallback/brands";
import type { Brand } from "@/types/catalog";
import type { ExtractPages } from "../extract";
import { applyOcr, rebuildMatches, syncCatalogues, type ReindexDeps } from "../reindex";
import type { CatalogueSource } from "../sources";
import { KEYS, type KeyValueStore, type Manifest, readIndex, readMatches } from "../store";

vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() } }));

function memoryStore(): KeyValueStore & { data: Map<string, unknown> } {
  const data = new Map<string, unknown>();
  return {
    data,
    get: async <T,>(key: string) => (data.has(key) ? (structuredClone(data.get(key)) as T) : null),
    set: async (key, value) => {
      data.set(key, structuredClone(value));
    },
    del: async (...keys) => {
      keys.forEach((k) => data.delete(k));
    },
  };
}

const source = (brandSlug: string, catalogueIndex: number, assetId = `file-${brandSlug}-${catalogueIndex}-pdf`): CatalogueSource => ({
  catalogId: `${brandSlug}-${catalogueIndex}`,
  brandSlug,
  brand: brandSlug[0].toUpperCase() + brandSlug.slice(1),
  catalogueIndex,
  title: `${brandSlug} ${catalogueIndex}`,
  assetId,
  pdfUrl: `https://cdn.example/${assetId}`,
});

/** Serves pages from an in-memory "PDF", honouring from-page and a per-call page cap. */
function fakeExtract(pdfs: Record<string, string[]>, perCall = Infinity): ExtractPages & { calls: string[] } {
  const calls: string[] = [];
  const fn = Object.assign(async (url: string, from: number) => {
    calls.push(`${url}@${from}`);
    const pages = pdfs[url];
    if (!pages) throw new Error("HTTP 404");
    const slice = pages.slice(from - 1, from - 1 + perCall).map((text, i) => ({ page: from + i, text }));
    const end = from - 1 + slice.length;
    return { numPages: pages.length, pages: slice, nextPage: end >= pages.length ? null : end + 1 };
  }, { calls });
  return fn;
}

const brandKeyOf = (slug: string) => normalizeBrandKey({ slug } as Brand);
const depsFor = (kv: KeyValueStore, extract: ExtractPages): ReindexDeps => ({ kv, extract, brandKeyOf });
const budget = { budgetMs: 60_000 };

const URL_BLUM = "https://cdn.example/file-blum-0-pdf";
const URL_YALE = "https://cdn.example/file-yale-0-pdf";
const DRAWER_PAGES = ["contents", "quadro drawer system with full extension and soft close drawer"];

describe("syncCatalogues", () => {
  let kv: ReturnType<typeof memoryStore>;
  beforeEach(() => {
    kv = memoryStore();
  });

  it("indexes new catalogues and finds their brands for a category", async () => {
    const extract = fakeExtract({ [URL_BLUM]: DRAWER_PAGES, [URL_YALE]: ["fingerprint lock with keypad", "rfid"] });
    const result = await syncCatalogues([source("blum", 0), source("yale", 0)], depsFor(kv, extract), budget);

    expect(result.outcomes).toEqual({ "blum-0": "complete", "yale-0": "complete" });
    expect(result.pending).toEqual([]);
    const stored = await readMatches(kv);
    expect(stored?.matches["drawer-channels"].map((m) => m.brandKey)).toEqual(["blum"]);
    expect(stored?.matches["digital-locks"].map((m) => m.brandKey)).toEqual(["yale"]);
  });

  it("skips catalogues whose PDF has not changed", async () => {
    const extract = fakeExtract({ [URL_BLUM]: DRAWER_PAGES });
    await syncCatalogues([source("blum", 0)], depsFor(kv, extract), budget);
    const again = await syncCatalogues([source("blum", 0)], depsFor(kv, extract), budget);
    expect(again.outcomes["blum-0"]).toBe("unchanged");
    expect(extract.calls).toHaveLength(1);
  });

  it("reindexes a replaced PDF and drops the old text", async () => {
    await syncCatalogues([source("blum", 0, "file-blum-0-pdf")], depsFor(kv, fakeExtract({ [URL_BLUM]: DRAWER_PAGES })), budget);
    const NEW_ASSET = `file-${"2".repeat(40)}-pdf`;
    const NEW = `https://cdn.example/${NEW_ASSET}`;
    await syncCatalogues(
      [source("blum", 0, NEW_ASSET)],
      depsFor(kv, fakeExtract({ [NEW]: ["bathroom accessories: towel rail and soap dish"] })),
      budget
    );
    const stored = await readMatches(kv);
    expect(stored?.matches["drawer-channels"]).toBeUndefined();
    expect(stored?.matches["bathroom-accessories"][0].catalogues[0].version).toBe("2".repeat(12));
  });

  it("spans invocations for a long catalogue and resumes from the saved page", async () => {
    const long = Array.from({ length: 5 }, (_, i) => (i === 3 ? "tandembox drawer system, full extension" : "blank"));
    const extract = fakeExtract({ [URL_BLUM]: long }, 2);
    const deps = depsFor(kv, extract);

    const first = await syncCatalogues([source("blum", 0)], deps, budget);
    expect(first.outcomes["blum-0"]).toBe("partial");
    expect(first.pending).toEqual(["blum-0"]);
    expect((await readMatches(kv))?.matches["drawer-channels"]).toBeUndefined();

    await syncCatalogues([source("blum", 0)], deps, budget);
    const last = await syncCatalogues([source("blum", 0)], deps, budget);
    expect(last.outcomes["blum-0"]).toBe("complete");
    expect(extract.calls).toEqual([`${URL_BLUM}@1`, `${URL_BLUM}@3`, `${URL_BLUM}@5`]);
    expect((await readMatches(kv))?.matches["drawer-channels"][0].catalogues[0].pages[0].page).toBe(4);
  });

  it("records a failure for that catalogue only, and does not retry it until its PDF changes", async () => {
    const extract = fakeExtract({ [URL_YALE]: ["fingerprint lock with keypad"] }); // blum has no PDF -> 404
    const sources = [source("blum", 0), source("yale", 0)];

    const first = await syncCatalogues(sources, depsFor(kv, extract), budget);
    expect(first.outcomes).toEqual({ "blum-0": "failed", "yale-0": "complete" });
    const manifest = (await kv.get<Manifest>(KEYS.manifest))!;
    expect(manifest["blum-0"]).toMatchObject({ status: "failed", error: "HTTP 404" });

    const second = await syncCatalogues(sources, depsFor(kv, extract), budget);
    expect(second.outcomes["blum-0"]).toBe("skipped");
    const forced = await syncCatalogues(sources, depsFor(kv, extract), { ...budget, retryFailed: true });
    expect(forced.outcomes["blum-0"]).toBe("failed");
  });

  it("drops a stale index when its replacement cannot be read", async () => {
    await syncCatalogues([source("blum", 0, "file-blum-0-pdf")], depsFor(kv, fakeExtract({ [URL_BLUM]: DRAWER_PAGES })), budget);
    await syncCatalogues([source("blum", 0, "file-blum-broken-pdf")], depsFor(kv, fakeExtract({})), budget);
    expect(await readIndex(kv, "blum-0")).toBeNull();
    expect((await readMatches(kv))?.matches["drawer-channels"]).toBeUndefined();
  });

  it("removes catalogues that no longer exist in Sanity", async () => {
    const extract = fakeExtract({ [URL_BLUM]: DRAWER_PAGES, [URL_YALE]: ["fingerprint lock with keypad"] });
    await syncCatalogues([source("blum", 0), source("yale", 0)], depsFor(kv, extract), budget);
    const result = await syncCatalogues([source("yale", 0)], depsFor(kv, extract), budget);
    expect(result.pruned).toEqual(["blum-0"]);
    expect(await readIndex(kv, "blum-0")).toBeNull();
    expect((await readMatches(kv))?.matches["drawer-channels"]).toBeUndefined();
  });

  it("leaves work it has no time for as pending", async () => {
    let t = 0;
    const deps = { ...depsFor(kv, fakeExtract({ [URL_BLUM]: DRAWER_PAGES, [URL_YALE]: ["keypad"] })), now: () => (t += 10_000) };
    const result = await syncCatalogues([source("blum", 0), source("yale", 0)], deps, { budgetMs: 15_000 });
    expect(result.pending).toContain("yale-0");
  });
});

describe("OCR", () => {
  it("fills pages that have no text layer, and survives a later reindex of the same PDF", async () => {
    const kv = memoryStore();
    const scanned = source("labacha", 0);
    const extract = fakeExtract({ [scanned.pdfUrl]: ["", ""] });
    const deps = depsFor(kv, extract);

    await syncCatalogues([scanned], deps, budget);
    expect((await readMatches(kv))?.matches["kitchen-sinks-faucets"]).toBeUndefined();

    await applyOcr(scanned, { "2": "Quartz sink with double bowl and sink mixer" }, deps);
    const [labacha] = (await readMatches(kv))!.matches["kitchen-sinks-faucets"];
    expect(labacha.catalogues[0].pages[0].page).toBe(2);

    await syncCatalogues([scanned], deps, { ...budget, force: true });
    expect((await readMatches(kv))?.matches["kitchen-sinks-faucets"][0].brandKey).toBe("labacha");
  });

  it("ignores OCR for a PDF that is no longer the stored one", async () => {
    const kv = memoryStore();
    const deps = depsFor(kv, fakeExtract({ "https://cdn.example/file-labacha-0-pdf": [""] }));
    await syncCatalogues([source("labacha", 0)], deps, budget);
    const applied = await applyOcr({ catalogId: "labacha-0", assetId: "file-other-pdf" }, { "1": "quartz sink" }, deps);
    expect(applied).toBe(false);
  });
});

describe("rebuildMatches", () => {
  it("ignores an index whose PDF no longer matches the manifest", async () => {
    const kv = memoryStore();
    const deps = depsFor(kv, fakeExtract({ [URL_BLUM]: DRAWER_PAGES }));
    await syncCatalogues([source("blum", 0)], deps, budget);
    const manifest = (await kv.get<Manifest>(KEYS.manifest))!;
    manifest["blum-0"].assetId = "file-newer-pdf";
    await kv.set(KEYS.manifest, manifest);
    expect((await rebuildMatches(deps)).matches).toEqual({});
  });
});
