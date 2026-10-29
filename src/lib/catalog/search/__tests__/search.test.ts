import { describe, expect, it } from "vitest";
import { normalizeBrandKey } from "@/content/fallback/brands";
import type { Brand } from "@/types/catalog";
import { CATEGORY_TERMS } from "../categoryTerms";
import { assetIdFromPdfUrl, buildMatchHref, parseMatchParams } from "../matchLink";
import { countPhrase, fold, stem, tokenize } from "../normalize";
import { rankCategories } from "../rank";
import { compileTerms, isCredible, matchPages, scorePage, scoreQuery } from "../score";
import type { CatalogueIndex } from "../types";

const brandKeyOf = (slug: string) => normalizeBrandKey({ slug } as Brand);

function catalogue(
  brandSlug: string,
  catalogueIndex: number,
  pages: string[],
  brand = brandSlug
): CatalogueIndex {
  return {
    catalogId: `${brandSlug}-${catalogueIndex}`,
    brandSlug,
    brand,
    catalogueIndex,
    title: `${brand} catalogue`,
    assetId: `file-${brandSlug}-${catalogueIndex}`,
    pages: pages.map((text, i) => ({ page: i + 1, text })),
  };
}

describe("normalize", () => {
  it("folds accents and punctuation", () => {
    expect(fold("Häfele — Drawer-Runners (50 kg)")).toBe("hafele drawer runners 50 kg");
  });

  it("stems plurals and -ing but leaves glass/brass alone", () => {
    expect(stem("runners")).toBe("runner");
    expect(stem("hinges")).toBe("hinge");
    expect(stem("closing")).toBe("close");
    expect(stem("glass")).toBe("glass");
    expect(stem("brass")).toBe("brass");
    expect(stem("batteries")).toBe("battery");
  });

  it("counts consecutive-token phrases only", () => {
    const tokens = tokenize("drawer runners and a drawer with runners");
    expect(countPhrase(tokens, tokenize("drawer runner"))).toBe(1);
  });
});

describe("page scoring", () => {
  const drawer = compileTerms(CATEGORY_TERMS["drawer-channels"]);

  it("finds drawer-channel pages that never use the website's wording", () => {
    const [match] = matchPages(
      [
        { page: 1, text: "welcome to our range" },
        { page: 7, text: "telescopic slides with soft close drawer mechanism, load capacity 40 kg" },
      ],
      drawer
    );
    expect(match.page).toBe(7);
  });

  it("does not treat one passing single-word mention as credible", () => {
    expect(isCredible(scorePage(tokenize("our hinge range is on page 9"), compileTerms(CATEGORY_TERMS["hinges-soft-close"])))).toBe(false);
  });

  it("lets repetition or supporting vocabulary lift a single-word hit", () => {
    const hinges = compileTerms(CATEGORY_TERMS["hinges-soft-close"]);
    const text = "hinge hinge hinge overlay opening angle 110";
    expect(isCredible(scorePage(tokenize(text), hinges))).toBe(true);
  });

  it("pushes down pages dominated by a neighbouring category", () => {
    const withExclusion = scorePage(
      tokenize("drawer runner for wardrobe sliding door and sink"),
      drawer
    );
    const without = scorePage(tokenize("drawer runner"), drawer);
    expect(withExclusion.score).toBeLessThan(without.score);
  });

  it("orders pages by score, then page number", () => {
    const matches = matchPages(
      [
        { page: 3, text: "drawer runner" },
        { page: 1, text: "drawer runner" },
        { page: 2, text: "drawer runner drawer slide telescopic slide ball bearing slide" },
      ],
      drawer
    );
    expect(matches.map((m) => m.page)).toEqual([2, 1, 3]);
  });

  it("returns a snippet around the hit", () => {
    const [match] = matchPages([{ page: 1, text: "intro text here. quadro v6 drawer system for kitchens" }], drawer);
    expect(match.snippet).toContain("quadro");
  });
});

describe("free-text scoring", () => {
  it("matches across accents and plurals", () => {
    expect(scoreQuery("häfele drawer runner", "hafele runners")?.score).toBeGreaterThan(0);
    expect(scoreQuery("nothing relevant", "hafele")).toBeNull();
  });

  it("uses synonyms at lower weight", () => {
    const exact = scoreQuery("handle", "handles")!.score;
    const synonym = scoreQuery("knob", "handles", { handles: ["knob"] })!.score;
    expect(synonym).toBeLessThan(exact);
  });
});

describe("rankCategories", () => {
  // Brands here exist only as catalogue text: nothing in this test knows
  // about CMS product records.
  const catalogues = [
    catalogue("hettich", 0, ["contents", "quadro drawer system, full extension runners, soft close drawer", "overlay hinge sensys"], "Hettich"),
    catalogue("blum", 0, ["tandembox drawer box with undermount runner and soft close drawer", "tandembox side mount drawer slide telescopic slide full extension"], "Blum"),
    catalogue("yale", 0, ["fingerprint lock with keypad and mobile app", "terms and conditions"], "Yale"),
  ];

  it("finds the brand for a category even though it has no CMS product", () => {
    const matches = rankCategories(catalogues, brandKeyOf);
    expect(matches["drawer-channels"].map((m) => m.brandKey)).toEqual(["blum", "hettich"]);
    expect(matches["digital-locks"].map((m) => m.brandKey)).toEqual(["yale"]);
  });

  it("omits brands without a credible page", () => {
    const matches = rankCategories(catalogues, brandKeyOf);
    expect(matches["drawer-channels"].some((m) => m.brandKey === "yale")).toBe(false);
    expect(matches["safes"]).toBeUndefined();
  });

  it("opens each brand at its best page and keeps the other matches", () => {
    const [blum] = rankCategories(catalogues, brandKeyOf)["drawer-channels"];
    expect(blum.catalogues[0].pages[0].page).toBe(2);
    expect(blum.catalogues[0].pages.map((p) => p.page)).toEqual([2, 1]);
  });

  it("keeps multiple catalogues of one brand under one brand entry", () => {
    const labacha = [
      catalogue("labacha", 0, ["kitchen sink and faucet"], "Labacha"),
      catalogue("labacha", 1, ["quartz sink with double bowl, sink mixer"], "Labacha"),
    ];
    const [entry] = rankCategories(labacha, brandKeyOf)["kitchen-sinks-faucets"];
    expect(entry.catalogues).toHaveLength(2);
    expect(entry.catalogues[0].catalogueIndex).toBe(1);
  });

  it("is deterministic across runs and input order", () => {
    const a = rankCategories(catalogues, brandKeyOf);
    const b = rankCategories([...catalogues].reverse(), brandKeyOf);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("ignores catalogues with no extractable text", () => {
    const scanned = catalogue("godrej", 0, ["", "", ""], "Godrej");
    expect(rankCategories([scanned], brandKeyOf)).toEqual({});
  });
});

describe("match links", () => {
  const [blum] = rankCategories(
    [catalogue("blum", 2, ["", "tandembox drawer system", "x", "quadro drawer system", "tandembox drawer slide"], "Blum")],
    brandKeyOf
  )["drawer-channels"];

  it("builds a link carrying catalogue, best page, query and related pages", () => {
    const href = buildMatchHref(blum, "Drawer Channels");
    const url = new URL(href, "http://x");
    expect(url.pathname).toBe("/catalogues");
    expect(url.searchParams.get("brand")).toBe("blum");
    expect(url.searchParams.get("cat")).toBe("2");
    expect(url.searchParams.get("q")).toBe("Drawer Channels");
    expect(url.searchParams.get("pages")?.split(",")).toEqual(["2", "4", "5"]);
    expect(url.searchParams.get("page")).toBe(String(blum.catalogues[0].pages[0].page));
  });

  it("round-trips through the parser", () => {
    const url = new URL(buildMatchHref(blum, "Drawer Channels"), "http://x");
    const parsed = parseMatchParams(url.searchParams, 3);
    expect(parsed?.catalogue).toBe(2);
    expect(parsed?.pages).toEqual([2, 4, 5]);
    expect(parsed?.query).toBe("Drawer Channels");
  });

  it("drops junk instead of guessing", () => {
    const p = (q: string) => parseMatchParams(new URLSearchParams(q), 2);
    expect(p("brand=blum")).toBeNull();
    expect(p("page=abc")).toBeNull();
    expect(p("page=-3")).toBeNull();
    expect(p("page=0")).toBeNull();
    expect(p("page=5&cat=9")?.catalogue).toBe(0);
    expect(p("page=5&pages=2,x,99999999,5,2")?.pages).toEqual([2, 5]);
    expect(p("page=5&q=" + "a".repeat(500))?.query).toHaveLength(80);
  });
});

describe("contents pages", () => {
  const wardrobe = compileTerms(CATEGORY_TERMS["wardrobe-hardware-sliding"]);

  it("ranks a product page above a contents page that merely lists the category", () => {
    const [best] = matchPages(
      [
        { page: 2, text: "contents wardrobe sliding systems pg10 trouser rack pg40 shoe rack pg60 pull down lift pg80" },
        { page: 9, text: "wardrobe sliding systems sliding door kit with rollers and top track" },
      ],
      wardrobe
    );
    expect(best.page).toBe(9);
  });

  it("no longer reads a sink cut-out in a drawer catalogue as a kitchen sink", () => {
    const sinks = compileTerms(CATEGORY_TERMS["kitchen-sinks-faucets"]);
    expect(matchPages([{ page: 26, text: "legrabox pure sink high fronted pull out height 177 mm sink cut out" }], sinks)).toEqual([]);
  });
});

describe("assetIdFromPdfUrl", () => {
  const hash = "0123456789abcdef0123456789abcdef01234567";

  it("derives the Sanity asset id from a CDN file URL", () => {
    expect(assetIdFromPdfUrl(`https://cdn.sanity.io/files/abc123/production/${hash}.pdf`)).toBe(`file-${hash}-pdf`);
    expect(assetIdFromPdfUrl(`https://cdn.sanity.io/files/abc123/production/${hash}.pdf?dl=`)).toBe(`file-${hash}-pdf`);
  });

  it("returns null for anything else", () => {
    expect(assetIdFromPdfUrl(null)).toBeNull();
    expect(assetIdFromPdfUrl("https://example.com/catalogue.pdf")).toBeNull();
  });
});
