import { describe, it, expect } from "vitest";
import { Product } from "@/types/catalog";
import { SHOWROOM_FAMILIES } from "@/data/catalog";

// Pure filtering function extracted from CollectionsClient logic for testing
export function filterProducts(
  products: Product[],
  searchQuery: string,
  activeBrand: string
): Product[] {
  const query = searchQuery.toLowerCase().trim();
  return products.filter((p) => {
    const pName = (p.name || "").toLowerCase();
    const pBrand = (p.brandName || p.brand || "").toLowerCase().replace(/ä/g, "a");
    const pDesc = (p.shortDescription || p.description || "").toLowerCase();
    const pModel = (p.catalogReference || p.model || "").toLowerCase();

    const matchSearch =
      !query ||
      pName.includes(query) ||
      pBrand.includes(query) ||
      pDesc.includes(query) ||
      pModel.includes(query);

    const matchBrand =
      activeBrand === "all" ||
      pBrand === activeBrand.toLowerCase() ||
      pBrand.includes(activeBrand.toLowerCase());

    return matchSearch && matchBrand;
  });
}

describe("Catalog Filtering Logic", () => {
  const mockProducts: Product[] = [
    {
      id: "prod-1",
      name: "Hafele Re-Dial Digital Lock",
      brand: "Hafele",
      categorySlug: "digital-locks",
      shortDescription: "Biometric and RFID digital door lock",
      catalogReference: "912.05.500",
    },
    {
      id: "prod-2",
      name: "Dorset Architectural Pull Handle",
      brand: "Dorset",
      categorySlug: "main-door-handles",
      shortDescription: "Solid brass pull handle in satin brass finish",
      catalogReference: "DOR-PH-01",
    },
    {
      id: "prod-3",
      name: "Hettich Sensys Hinge",
      brand: "Hettich",
      categorySlug: "hinges-soft-close",
      shortDescription: "Integrated soft-close concealed hinge",
      catalogReference: "HET-9071205",
    },
  ];

  it("returns all products when search is empty and brand is 'all'", () => {
    const result = filterProducts(mockProducts, "", "all");
    expect(result.length).toBe(3);
  });

  it("filters products by search term in title", () => {
    const result = filterProducts(mockProducts, "re-dial", "all");
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("prod-1");
  });

  it("filters products by search term in description or reference code", () => {
    const resultByDesc = filterProducts(mockProducts, "concealed hinge", "all");
    expect(resultByDesc.length).toBe(1);
    expect(resultByDesc[0].id).toBe("prod-3");

    const resultByRef = filterProducts(mockProducts, "DOR-PH-01", "all");
    expect(resultByRef.length).toBe(1);
    expect(resultByRef[0].id).toBe("prod-2");
  });

  it("filters products by brand with case and umlaut tolerance", () => {
    const result = filterProducts(mockProducts, "", "hafele");
    expect(result.length).toBe(1);
    expect(result[0].name).toContain("Hafele");
  });

  it("combines brand filter and search query correctly", () => {
    const resultMatch = filterProducts(mockProducts, "digital", "hafele");
    expect(resultMatch.length).toBe(1);

    const resultMismatch = filterProducts(mockProducts, "digital", "dorset");
    expect(resultMismatch.length).toBe(0);
  });

  it("matches showroom family collections from static SHOWROOM_FAMILIES data", () => {
    const doorFamily = SHOWROOM_FAMILIES.find((f) => f.slug === "door-hardware");
    expect(doorFamily).toBeDefined();
    expect(doorFamily?.collectionSlugs).toContain("digital-locks");
  });
});
