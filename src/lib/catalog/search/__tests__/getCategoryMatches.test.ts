import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { KeyValueStore } from "../../indexing/store";

vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));

const { loadCategoryMatches } = await import("../getCategoryMatches");
const { readStaticIndexes } = await import("../staticIndexes");

const HASH = "1".repeat(40);
let dir: string;

beforeEach(async () => {
  dir = await mkdtemp(path.join(os.tmpdir(), "hc-indexes-"));
});
afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

const write = (name: string, body: unknown) =>
  writeFile(path.join(dir, name), typeof body === "string" ? body : JSON.stringify(body));

const blumIndex = {
  catalog: "blum-0",
  brand: "Blum",
  title: "Blum Catalog",
  assetId: `file-${HASH}-pdf`,
  pages: [
    { page: 1, text: "contents" },
    { page: 2, text: "tandembox drawer system with full extension and soft close drawer" },
  ],
};

describe("readStaticIndexes", () => {
  it("reads build-time indexes and takes brand slug and catalogue position from the file name", async () => {
    await write("blum-0.json", blumIndex);
    await write("decor-bath-1.json", { ...blumIndex, brand: "Decor Bath" });
    const indexes = await readStaticIndexes(dir);
    expect(indexes.map((i) => [i.brandSlug, i.catalogueIndex])).toEqual([
      ["blum", 0],
      ["decor-bath", 1],
    ]);
  });

  it("skips malformed files and indexes not tied to a PDF", async () => {
    await write("blum-0.json", blumIndex);
    await write("broken-0.json", "{not json");
    await write("noasset-0.json", { ...blumIndex, assetId: undefined });
    await write("readme.txt", "x");
    expect((await readStaticIndexes(dir)).map((i) => i.catalogId)).toEqual(["blum-0"]);
  });

  it("returns nothing for a missing directory", async () => {
    expect(await readStaticIndexes(path.join(dir, "nope"))).toEqual([]);
  });
});

describe("loadCategoryMatches", () => {
  const storeWith = (value: unknown, fail = false): KeyValueStore => ({
    get: async () => {
      if (fail) throw new Error("ECONNRESET");
      return value as never;
    },
    set: async () => {},
    del: async () => {},
  });

  it("prefers the live index when it has been built", async () => {
    await write("blum-0.json", blumIndex);
    const live = { generatedAt: 1, matches: { safes: [] } };
    expect(await loadCategoryMatches({ kv: storeWith(live), staticDir: dir })).toEqual({ safes: [] });
  });

  it("searches the build-time catalogue text when Redis is not configured", async () => {
    await write("blum-0.json", blumIndex);
    const matches = await loadCategoryMatches({ kv: null, staticDir: dir });
    expect(matches?.["drawer-channels"][0]).toMatchObject({ brandKey: "blum" });
    expect(matches?.["drawer-channels"][0].catalogues[0]).toMatchObject({ catalogueIndex: 0, version: HASH.slice(0, 12) });
    expect(JSON.stringify(matches)).not.toContain(HASH);
    expect(matches?.["drawer-channels"][0].catalogues[0].pages[0].page).toBe(2);
  });

  it("turns an asset id stored by an older reindex into the fingerprint, so no hash reaches the page", async () => {
    const page = { page: 4, score: 30, snippet: "x" };
    const live = { generatedAt: 1, matches: { safes: [{ brandKey: "blum", brand: "Blum", strength: 1, catalogues: [{ catalogueIndex: 0, title: "Blum", assetId: `file-${HASH}-pdf`, pages: [page] }] }] } };
    const matches = await loadCategoryMatches({ kv: storeWith(live), staticDir: dir });
    expect(matches?.safes[0].catalogues[0]).toEqual({ catalogueIndex: 0, title: "Blum", version: HASH.slice(0, 12), pages: [page] });
  });

  it("falls back to the build-time text when Redis is unreachable or not yet built", async () => {
    await write("blum-0.json", blumIndex);
    expect(await loadCategoryMatches({ kv: storeWith(null, true), staticDir: dir })).toHaveProperty("drawer-channels");
    expect(await loadCategoryMatches({ kv: storeWith(null), staticDir: dir })).toHaveProperty("drawer-channels");
  });

  it("is null only when there is no catalogue text at all", async () => {
    expect(await loadCategoryMatches({ kv: null, staticDir: dir })).toBeNull();
  });
});
