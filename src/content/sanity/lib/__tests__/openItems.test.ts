import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { HAFELE_BRAND_ID, HERO_HEADLINE, LOGO_FILES, PULL_HANDLE_PRODUCT_ID, planOpenItems, type OpenItemsState } from "../openItems";

const needsEverything: OpenItemsState = {
  product: { _id: PULL_HANDLE_PRODUCT_ID, name: "Pull Handle", brand: null },
  brands: {
    [HAFELE_BRAND_ID]: { _id: HAFELE_BRAND_ID, name: "Hafele", logo: { asset: { _ref: "x" } } },
    "brand-becker": { _id: "brand-becker", name: "Becker" },
    "brand-dorio": { _id: "brand-dorio", name: "Dorio" },
  },
  homePage: { _id: "homePage" },
  homePageDraft: null,
};

describe("planOpenItems", () => {
  it("plans every missing item", () => {
    const { writes, skipped } = planOpenItems(needsEverything);
    expect(writes.map((w) => `${w.kind}:${w.docId}`)).toEqual([
      `setProductBrand:${PULL_HANDLE_PRODUCT_ID}`,
      "setHeadline:homePage",
      "setLogo:brand-becker",
      "setLogo:brand-dorio",
    ]);
    expect(skipped).toEqual([]);
  });

  it("changes nothing once the items are fixed, so it is safe to re-run", () => {
    const fixed: OpenItemsState = {
      product: { _id: PULL_HANDLE_PRODUCT_ID, name: "Pull Handle", brand: { _ref: HAFELE_BRAND_ID } },
      brands: {
        [HAFELE_BRAND_ID]: { _id: HAFELE_BRAND_ID, name: "Hafele" },
        "brand-becker": { _id: "brand-becker", name: "Becker", logo: { asset: { _ref: "a" } } },
        "brand-dorio": { _id: "brand-dorio", name: "Dorio", logo: { asset: { _ref: "b" } } },
      },
      homePage: { _id: "homePage", heroHeadline: "Anything an editor wrote" },
      homePageDraft: null,
    };
    expect(planOpenItems(fixed).writes).toEqual([]);
  });

  it("never overwrites a brand, headline or logo an editor already set", () => {
    const state: OpenItemsState = {
      ...needsEverything,
      product: { _id: PULL_HANDLE_PRODUCT_ID, name: "Pull Handle", brand: { _ref: "brand-hettich" } },
      homePage: { _id: "homePage", heroHeadline: "Custom" },
    };
    const kinds = planOpenItems(state).writes.map((w) => w.kind);
    expect(kinds).not.toContain("setProductBrand");
    expect(kinds).not.toContain("setHeadline");
  });

  it("treats a whitespace-only headline as empty", () => {
    const state = { ...needsEverything, homePage: { _id: "homePage", heroHeadline: "   " } };
    expect(planOpenItems(state).writes.some((w) => w.kind === "setHeadline")).toBe(true);
  });

  it("fills a draft homePage too, so Studio does not keep a copy that blocks Publish", () => {
    const state = { ...needsEverything, homePageDraft: { _id: "drafts.homePage" } };
    const ids = planOpenItems(state).writes.filter((w) => w.kind === "setHeadline").map((w) => w.docId);
    expect(ids).toEqual(["homePage", "drafts.homePage"]);
  });

  it("does not invent a brand reference when the brand document is missing", () => {
    const state = { ...needsEverything, brands: { ...needsEverything.brands, [HAFELE_BRAND_ID]: undefined } };
    const { writes, skipped } = planOpenItems(state);
    expect(writes.some((w) => w.kind === "setProductBrand")).toBe(false);
    expect(skipped.join(" ")).toContain("does not exist");
  });

  it("keeps the line break the live hero already shows", () => {
    expect(HERO_HEADLINE).toBe("The Art of\nthe Finish.");
  });

  it("only plans logo files that exist in the repo", () => {
    for (const file of Object.values(LOGO_FILES)) expect(existsSync(path.resolve(process.cwd(), file)), file).toBe(true);
  });
});
