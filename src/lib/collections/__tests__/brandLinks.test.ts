import { describe, expect, it } from "vitest";
import { brandHasCatalogue } from "../brandLinks";

const doc = (pdfVersion: string | null) => ({ _id: "c1", catalogueName: "Main", pdfVersion });

describe("brandHasCatalogue", () => {
  it("is true for catalogue documents with a PDF and a brand slug", () => {
    expect(brandHasCatalogue({ name: "Hafele", slug: { current: "hafele" }, catalogues: [doc("aaaaaaaaaaaa")] })).toBe(true);
    expect(brandHasCatalogue({ name: "Hafele", slug: "hafele", catalogues: [doc("aaaaaaaaaaaa")] })).toBe(true);
  });

  it("is false when the documents have no PDF", () => {
    expect(brandHasCatalogue({ name: "Hafele", slug: "hafele", catalogues: [doc(null)] })).toBe(false);
  });

  it("is false when there is no slug, since PDFs are served by slug", () => {
    expect(brandHasCatalogue({ name: "Hafele", catalogues: [doc("aaaaaaaaaaaa")] })).toBe(false);
  });

  it("accepts an official catalogue file on its own", () => {
    expect(brandHasCatalogue({ name: "Blum", officialCatalogUrl: "https://x/blum.pdf" })).toBe(true);
  });

  it("is false for an unmatched brand or an empty record", () => {
    expect(brandHasCatalogue(undefined)).toBe(false);
    expect(brandHasCatalogue({ name: "Blum", slug: "blum", catalogues: [] })).toBe(false);
  });
});
