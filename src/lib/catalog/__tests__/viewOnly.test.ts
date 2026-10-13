import { describe, expect, it } from "vitest";
import { versionOfAsset } from "../search/matchLink";
import { withPdfVersions } from "../viewOnly";

const HASH = "0123456789abcdef0123456789abcdef01234567";
const ASSET = `file-${HASH}-pdf`;

describe("withPdfVersions", () => {
  it("replaces each catalogue's asset id with the short fingerprint", () => {
    const [brand] = withPdfVersions([
      { name: "Blum", slug: "blum", catalogues: [{ _id: "c0", catalogueName: "Main", assetId: ASSET }] },
    ]);
    expect(brand.catalogues?.[0]).toEqual({ _id: "c0", catalogueName: "Main", pdfVersion: versionOfAsset(ASSET) });
  });

  it("never lets the full file hash reach the page, so the CDN URL cannot be rebuilt", () => {
    const out = JSON.stringify(
      withPdfVersions([{ name: "Blum", slug: "blum", catalogues: [{ _id: "c0", catalogueName: "Main", assetId: ASSET }] }])
    );
    expect(out).not.toContain(HASH);
    expect(out).not.toContain("assetId");
  });

  it("marks a catalogue with no PDF as having no version", () => {
    const [brand] = withPdfVersions([
      { name: "Blum", catalogues: [{ _id: "c0", catalogueName: "Main", assetId: null }] },
    ]);
    expect(brand.catalogues?.[0].pdfVersion).toBeNull();
  });

  it("leaves brands without catalogues untouched", () => {
    expect(withPdfVersions([{ name: "Becker" }])).toEqual([{ name: "Becker" }]);
    expect(withPdfVersions(null)).toEqual([]);
  });
});
