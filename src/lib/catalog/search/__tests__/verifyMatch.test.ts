import { describe, expect, it } from "vitest";
import type { Brand } from "@/types/catalog";
import { buildMatchHref, parseMatchParams, versionOfAsset } from "../matchLink";
import { verifyBrandMatch } from "../verifyMatch";
import type { BrandMatch } from "../types";

const HASH_A = "a".repeat(40);
const HASH_B = "b".repeat(40);
const version = (hash: string) => versionOfAsset(`file-${hash}-pdf`);

const match = (catalogueIndex: number, hash: string, page = 7): BrandMatch => ({
  brandKey: "blum",
  brand: "Blum",
  strength: 50,
  catalogues: [
    { catalogueIndex, title: "Blum", version: version(hash), pages: [{ page, score: 40, snippet: "x" }] },
  ],
});

const brand = (hashes: string[]): Brand => ({
  name: "Blum",
  slug: "blum",
  catalogues: hashes.map((h, i) => ({ _id: `c${i}`, catalogueName: `Cat ${i}`, pdfVersion: version(h) })),
});

describe("verifyBrandMatch", () => {
  it("keeps a match from the PDF Sanity serves at that catalogue position", () => {
    expect(verifyBrandMatch(brand([HASH_A]), match(0, HASH_A))?.catalogues).toHaveLength(1);
  });

  it("drops a match found in a PDF that has since been replaced", () => {
    expect(verifyBrandMatch(brand([HASH_B]), match(0, HASH_A))).toBeNull();
  });

  it("drops a match whose catalogue position now holds a different file", () => {
    expect(verifyBrandMatch(brand([HASH_B, HASH_A]), match(0, HASH_A))).toBeNull();
    expect(verifyBrandMatch(brand([HASH_B, HASH_A]), match(1, HASH_A))?.catalogues[0].catalogueIndex).toBe(1);
  });

  it("drops a match when the catalogue no longer exists or the brand has none", () => {
    expect(verifyBrandMatch(brand([HASH_A]), match(3, HASH_A))).toBeNull();
    expect(verifyBrandMatch({ name: "Blum", slug: "blum", catalogues: [] }, match(0, HASH_A))).toBeNull();
  });

  it("keeps only the verified catalogues of a brand with several", () => {
    const both: BrandMatch = {
      ...match(0, HASH_A),
      catalogues: [...match(0, HASH_A).catalogues, ...match(1, HASH_B).catalogues],
    };
    const verified = verifyBrandMatch(brand([HASH_A, "c".repeat(40)]), both);
    expect(verified?.catalogues.map((c) => c.catalogueIndex)).toEqual([0]);
  });
});

describe("match link version", () => {
  it("carries a fingerprint of the PDF and parses it back", () => {
    const href = buildMatchHref(match(1, HASH_A), "Drawer Channels");
    const params = new URL(href, "http://x").searchParams;
    expect(params.get("v")).toBe(versionOfAsset(`file-${HASH_A}-pdf`));
    expect(parseMatchParams(params, 3)?.version).toBe("a".repeat(12));
  });

  it("ignores a malformed version rather than trusting it", () => {
    expect(parseMatchParams(new URLSearchParams("page=3&v=zz"), 1)?.version).toBe("");
  });
});
