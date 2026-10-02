import { describe, it, expect } from "vitest";
import { mergeCategories, mergeProducts } from "../catalogue";
import type { Category, Product } from "@/types/catalog";

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

const c = (slug: string, extra: Partial<Category> = {}): Category => ({ name: slug, slug, ...extra });

describe("mergeCategories", () => {
  it("carries primaryRail from Sanity over the fallback's", () => {
    const merged = mergeCategories([c("safes", { primaryRail: "door-hardware" })], [c("safes", { primaryRail: "kitchen-wardrobes" })]);
    expect(merged).toHaveLength(1);
    expect(merged[0].primaryRail).toBe("kitchen-wardrobes");
  });

  it("keeps the fallback's primaryRail when Sanity has none set (null must not blank it)", () => {
    const sanity = [c("safes", { primaryRail: null as unknown as string })];
    expect(mergeCategories([c("safes", { primaryRail: "door-hardware" })], sanity)[0].primaryRail).toBe("door-hardware");
  });

  it("adds Sanity-only categories and survives Sanity returning nothing", () => {
    expect(mergeCategories([c("a")], [c("b", { primaryRail: "bathroom" })]).map((x) => x.name)).toEqual(["a", "b"]);
    expect(mergeCategories([c("a")], null)).toHaveLength(1);
  });

  it("accepts a fallback category that has a title but no name", () => {
    const merged = mergeCategories([{ slug: "x", title: "Titled" } as unknown as Category], []);
    expect(merged[0].name).toBe("Titled");
  });
});
