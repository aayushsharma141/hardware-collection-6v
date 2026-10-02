import { describe, it, expect } from "vitest";
import { mergeProducts } from "../catalogue";
import type { Product } from "@/types/catalog";

const p = (id: string, extra: Partial<Product> = {}): Product => ({ id, name: id, slug: id, ...extra });

describe("mergeProducts", () => {
  it("keeps fallback products Sanity does not have", () => {
    expect(mergeProducts([p("a"), p("b")], []).map((x) => x.id)).toEqual(["a", "b"]);
  });

  it("lets a Sanity product win over the fallback one with the same slug", () => {
    const merged = mergeProducts([p("a", { featured: true, name: "Old" })], [p("a", { name: "New", featured: false })]);
    expect(merged).toHaveLength(1);
    expect(merged[0].name).toBe("New");
    expect(merged[0].featured).toBe(false);
  });

  it("adds Sanity-only products", () => {
    const merged = mergeProducts([p("a")], [p("z", { categorySlug: "safes" })]);
    expect(merged.map((x) => x.id)).toEqual(["a", "z"]);
  });

  it("copes with Sanity returning nothing", () => {
    expect(mergeProducts([p("a")], null)).toHaveLength(1);
    expect(mergeProducts([p("a")], undefined)).toHaveLength(1);
  });

  it("matches Sanity's object-shaped slug as well as a plain string", () => {
    const merged = mergeProducts([p("a")], [{ _id: "x", name: "S", slug: { current: "a" } } as Product]);
    expect(merged).toHaveLength(1);
    expect(merged[0].name).toBe("S");
  });
});
