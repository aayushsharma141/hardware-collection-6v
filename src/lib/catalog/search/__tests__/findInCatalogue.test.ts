import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { KeyValueStore } from "../../indexing/store";
import { catalogueIdFrom, findInCatalogue, loadCataloguePages, MAX_RESULTS, searchPages } from "../findInCatalogue";

const pages = [
  { page: 1, text: "contents and introduction" },
  { page: 2, text: "tandembox drawer system with soft close drawer runners" },
  { page: 3, text: "concealed hinge for kitchen cabinet doors" },
];

describe("searchPages", () => {
  it("returns ranked pages with a snippet, never the page text itself", () => {
    const hits = searchPages(pages, "drawer");
    expect(hits[0]).toMatchObject({ page: 2 });
    expect(hits[0].snippet.length).toBeGreaterThan(0);
    expect(Object.keys(hits[0]).sort()).toEqual(["page", "score", "snippet"]);
  });

  it("applies the catalogue synonyms", () => {
    expect(searchPages(pages, "kitchen").map((h) => h.page)).toContain(3);
  });

  it("ignores queries shorter than two characters and caps the result count", () => {
    expect(searchPages(pages, "d")).toEqual([]);
    const many = Array.from({ length: MAX_RESULTS + 10 }, (_, i) => ({ page: i + 1, text: "drawer" }));
    expect(searchPages(many, "drawer")).toHaveLength(MAX_RESULTS);
  });
});

describe("catalogueIdFrom", () => {
  it("builds the index id from a brand slug and catalogue position", () => {
    expect(catalogueIdFrom("decor-bath", "1")).toBe("decor-bath-1");
  });

  it("rejects anything that could reach outside the index folder", () => {
    for (const [slug, index] of [["../etc", "0"], ["blum", "-1"], ["blum", "51"], ["blum", "1.5"], ["Blum", "0"], ["blum/x", "0"], ["", "0"]]) {
      expect(catalogueIdFrom(slug, index), `${slug} ${index}`).toBeNull();
    }
  });
});

describe("loadCataloguePages", () => {
  let dir: string;
  beforeEach(async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), "hc-find-"));
  });
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  const store = (value: unknown, fail = false): KeyValueStore => ({
    get: async () => {
      if (fail) throw new Error("ECONNRESET");
      return value as never;
    },
    set: async () => {},
    del: async () => {},
  });

  it("prefers the live index", async () => {
    await writeFile(path.join(dir, "blum-0.json"), JSON.stringify({ pages: [{ page: 9, text: "static" }] }));
    const live = { pages: [{ page: 4, text: "live" }] };
    expect(await loadCataloguePages("blum-0", { kv: store(live), dir })).toEqual(live.pages);
  });

  it("falls back to the build-time file when Redis is missing, empty or unreachable", async () => {
    await writeFile(path.join(dir, "blum-0.json"), JSON.stringify({ pages: [{ page: 9, text: "static" }] }));
    for (const kv of [null, store(null), store(null, true)]) {
      expect(await loadCataloguePages("blum-0", { kv, dir })).toEqual([{ page: 9, text: "static" }]);
    }
  });

  it("is null when the catalogue has no index", async () => {
    expect(await loadCataloguePages("blum-0", { kv: null, dir })).toBeNull();
  });
});

describe("findInCatalogue", () => {
  it("is null for an unknown catalogue and hits for a known one", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "hc-find-"));
    try {
      await writeFile(path.join(dir, "blum-0.json"), JSON.stringify({ pages }));
      expect(await findInCatalogue("blum-1", "drawer", { kv: null, dir })).toBeNull();
      expect((await findInCatalogue("blum-0", "drawer", { kv: null, dir }))?.[0].page).toBe(2);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
