import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import sitemap from "@/app/sitemap";

const APP = join(__dirname, "..", "..", "..", "app");
const read = (...parts: string[]) => readFileSync(join(APP, ...parts), "utf8");

/**
 * Brands & Catalogues is its own public route (/catalogues), separate from
 * /collections. See "Showroom & Collections Architecture" in CLAUDE.md.
 */
describe("catalogue route", () => {
  it("/catalogues is a real page, not a redirect", () => {
    const page = read("catalogues", "page.tsx");
    expect(page).toContain("<CatalogsClient");
    expect(page).not.toMatch(/\bredirect\(/);
  });

  it("/collections does not embed the brand directory or viewer", () => {
    const client = read("collections", "CollectionsClient.tsx");
    expect(client).not.toContain("<CatalogsClient");
    expect(client).not.toContain('id="brand-catalogues"');
  });

  it("lists all three public content routes in the sitemap", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toEqual([
      "https://www.hardwarecollection.co/",
      "https://www.hardwarecollection.co/collections",
      "https://www.hardwarecollection.co/catalogues",
    ]);
  });

  it("only lists brands from the owner-approved list", () => {
    const page = read("catalogues", "page.tsx");
    expect(page).toContain("authorizedBrandRefs");
  });

  it("rejects a ?brand= value that is not an approved brand, as real code", () => {
    // A `\n` typed inside a `//` comment once swallowed this line, so assert it
    // starts its own line instead of merely appearing somewhere in the file.
    const client = read("catalogues", "CatalogsClient.tsx");
    expect(client).toMatch(/^\s*if \(!matchedBrand\) return null;/m);
    expect(client).not.toContain("\\n");
  });
});
