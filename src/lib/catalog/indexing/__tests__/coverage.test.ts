import { describe, expect, it, vi } from "vitest";
import { normalizeBrandKey } from "@/content/fallback/brands";
import type { Brand } from "@/types/catalog";
import type { ExtractPages } from "../extract";
import { applyOcr, assessCoverage, syncCatalogues, type ReindexDeps } from "../reindex";
import type { CatalogueSource } from "../sources";
import { KEYS, type KeyValueStore, type Manifest } from "../store";

vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() } }));

const pages = (texts: string[]) => texts.map((text, i) => ({ page: i + 1, text }));

describe("assessCoverage", () => {
  it("is full when nearly every page has text", () => {
    expect(assessCoverage(pages(Array(20).fill("text")))).toMatchObject({ coverage: "full", emptyPages: 0 });
    expect(assessCoverage(pages([...Array(18).fill("text"), "", ""]))).toMatchObject({ coverage: "full" });
  });

  it("is partial when a real share of pages has no text", () => {
    expect(assessCoverage(pages([...Array(14).fill("text"), ...Array(6).fill("")]))).toMatchObject({
      coverage: "partial",
      textPages: 14,
      emptyPages: 6,
    });
  });

  it("is none for a scanned catalogue, and for an empty one", () => {
    expect(assessCoverage(pages(["", "", ""])).coverage).toBe("none");
    expect(assessCoverage(pages(["  ", ""])).coverage).toBe("none");
    expect(assessCoverage([]).coverage).toBe("none");
  });
});

function memoryStore(): KeyValueStore {
  const data = new Map<string, unknown>();
  return {
    get: async <T,>(key: string) => (data.has(key) ? (structuredClone(data.get(key)) as T) : null),
    set: async (key, value) => void data.set(key, structuredClone(value)),
    del: async (...keys) => void keys.forEach((k) => data.delete(k)),
  };
}

const source: CatalogueSource = {
  catalogId: "godrej-0",
  brandSlug: "godrej",
  brand: "Godrej",
  catalogueIndex: 0,
  title: "Godrej",
  assetId: "file-godrej-pdf",
  pdfUrl: "https://cdn.example/godrej",
};
const scanned: ExtractPages = async () => ({ numPages: 3, pages: pages(["", "", ""]), nextPage: null });

describe("processing status", () => {
  const deps = (kv: KeyValueStore): ReindexDeps => ({
    kv,
    extract: scanned,
    brandKeyOf: (slug) => normalizeBrandKey({ slug } as Brand),
  });

  it("never reports a scanned catalogue as plainly complete", async () => {
    const kv = memoryStore();
    const result = await syncCatalogues([source], deps(kv), { budgetMs: 60_000 });
    expect(result.outcomes["godrej-0"]).toBe("needs_ocr");
    expect(result.coverage["godrej-0"]).toMatchObject({ coverage: "none", emptyPages: 3, pages: 3 });
    expect((await kv.get<Manifest>(KEYS.manifest))!["godrej-0"].coverage).toBe("none");
  });

  it("moves a catalogue to full coverage only once OCR has supplied its text", async () => {
    const kv = memoryStore();
    await syncCatalogues([source], deps(kv), { budgetMs: 60_000 });
    await applyOcr(source, { "1": "digital lock", "2": "fingerprint keypad", "3": "rfid card" }, deps(kv));
    expect((await kv.get<Manifest>(KEYS.manifest))!["godrej-0"]).toMatchObject({ coverage: "full", emptyPages: 0 });
    const again = await syncCatalogues([source], deps(kv), { budgetMs: 60_000 });
    expect(again.coverage).toEqual({});
  });

  it("stays partial when OCR recovers only some pages", async () => {
    const kv = memoryStore();
    await syncCatalogues([source], deps(kv), { budgetMs: 60_000 });
    await applyOcr(source, { "1": "digital lock" }, deps(kv));
    expect((await kv.get<Manifest>(KEYS.manifest))!["godrej-0"].coverage).toBe("partial");
  });
});
