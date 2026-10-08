import { describe, it, expect } from "vitest";
import { parse, evaluate } from "groq-js";
import {
  placeHeroSlides,
  toCollectionsHeroSlide,
  toHomeHeroSlide,
  usableManagerSlides,
  type PlacedSlide,
} from "../heroSlides";
import { HERO_FALLBACK_IMAGE } from "../offers";
import { getHeroManagerQuery } from "@/content/sanity/queries";
import type { HeroManagerData, HeroManagerSlide } from "@/types/hero";

const enquire = (title: string) => `wa://${title}`;
const placed = (slide: string, position?: number): PlacedSlide<string> => ({ kind: "offer", slide, position });

describe("placeHeroSlides", () => {
  const own = ["F1", "F2", "F3", "F4", "F5", "F6", "F7"];

  it("returns the page's own slides untouched when the editor placed none, however many", () => {
    expect(placeHeroSlides(own, [])).toEqual(own);
  });

  it("replaces three of six and alternates them with the page's own", () => {
    expect(placeHeroSlides(own, [placed("O1"), placed("O2"), placed("O3")], 6)).toEqual([
      "F1", "O1", "F2", "O2", "F3", "O3",
    ]);
  });

  it("with one offer, takes one slot from the end of the page's own", () => {
    expect(placeHeroSlides(own, [placed("O1")], 6)).toEqual(["F1", "O1", "F2", "F3", "F4", "F5"]);
  });

  it("puts a pinned slide on the slot it asked for", () => {
    expect(placeHeroSlides(own, [placed("O1", 1)], 6)).toEqual(["O1", "F1", "F2", "F3", "F4", "F5"]);
    expect(placeHeroSlides(own, [placed("O1", 4)], 6)).toEqual(["F1", "F2", "F3", "O1", "F4", "F5"]);
  });

  it("places several pinned slides each on its own slot", () => {
    expect(placeHeroSlides(own, [placed("B", 5), placed("A", 2)], 6)).toEqual(["F1", "A", "F2", "F3", "B", "F4"]);
  });

  it("clamps a slot past the end to the last place", () => {
    expect(placeHeroSlides(["F1", "F2"], [placed("O1", 6)], 6)).toEqual(["F1", "F2", "O1"]);
  });

  it("mixes pinned and floating slides, floating ones between the page's own", () => {
    expect(placeHeroSlides(own, [placed("P", 1), placed("O1"), placed("O2")], 6)).toEqual([
      "P", "F1", "O1", "F2", "O2", "F3",
    ]);
  });

  it("never exceeds the cap", () => {
    const many = ["a", "b", "c", "d", "e", "f", "g", "h"].map((s) => placed(s));
    expect(placeHeroSlides(own, many, 6)).toHaveLength(6);
  });
});

describe("usableManagerSlides", () => {
  const offer = (id: string): HeroManagerSlide => ({
    slideType: "offer",
    offer: { _id: id, title: id },
  });

  it("keeps at most three offers, in the order the editor arranged them", () => {
    const out = usableManagerSlides([offer("a"), offer("b"), offer("c"), offer("d")], (s) => s.offer?.title ?? null);
    expect(out.map((p) => p.slide)).toEqual(["a", "b", "c"]);
  });

  it("drops entries that resolve to nothing, such as an offer reference with no document", () => {
    const out = usableManagerSlides([{ slideType: "offer", offer: null }, offer("b")], (s) => s.offer?.title ?? null);
    expect(out.map((p) => p.slide)).toEqual(["b"]);
  });

  it("does not let other slide types use up the offer limit", () => {
    const promo: HeroManagerSlide = { slideType: "promotional", title: "Sale" };
    const out = usableManagerSlides([promo, promo, promo, offer("a"), offer("b"), offer("c")], (s) =>
      s.slideType === "offer" ? s.offer!.title : s.title!
    );
    expect(out).toHaveLength(6);
  });

  it("copes with no slides at all", () => {
    expect(usableManagerSlides(null, () => "x")).toEqual([]);
    expect(usableManagerSlides(undefined, () => "x")).toEqual([]);
  });
});

describe("toCollectionsHeroSlide", () => {
  it("turns an offer into an enquiry slide with its end date", () => {
    const slide = toCollectionsHeroSlide(
      { slideType: "offer", offer: { _id: "o", title: "Festive", validUntil: "2026-11-15", imageUrl: "img" } },
      2,
      enquire
    );
    expect(slide).toMatchObject({
      id: "manager-2",
      title: "Festive",
      tagline: "Current offer · until 15 Nov 2026",
      image: "img",
      offerHref: "wa://Festive",
    });
  });

  it("falls back to a showroom photo when an offer has no image", () => {
    const slide = toCollectionsHeroSlide({ slideType: "offer", offer: { _id: "o", title: "T" } }, 0, enquire);
    expect(slide?.image).toBe(HERO_FALLBACK_IMAGE);
    expect(slide?.tagline).toBe("Current offer");
  });

  it("links a collection to the family it is filed under, on the same page", () => {
    const slide = toCollectionsHeroSlide(
      { slideType: "collection", collection: { name: "Digital Locks", slug: "digital-locks", primaryRail: "door-hardware" } },
      0,
      enquire
    );
    expect(slide?.href).toBe("#smart-security");
    expect(slide?.ctaLabel).toBe("Explore Digital Locks");
  });

  it("links a brand to its catalogue", () => {
    const slide = toCollectionsHeroSlide({ slideType: "brand", brand: { name: "Hafele", slug: "hafele" } }, 0, enquire);
    expect(slide?.href).toBe("/catalogues?brand=hafele");
  });

  it("opens an external promotional link in a new tab, an internal one in place", () => {
    const external = toCollectionsHeroSlide({ slideType: "promotional", title: "T", link: "https://example.com/x" }, 0, enquire);
    const internal = toCollectionsHeroSlide({ slideType: "custom", title: "T", link: "/catalogues" }, 0, enquire);
    expect(external?.external).toBe(true);
    expect(internal?.external).toBe(false);
  });

  it("returns null when what a slide needs is missing", () => {
    expect(toCollectionsHeroSlide({ slideType: "offer", offer: null }, 0, enquire)).toBeNull();
    expect(toCollectionsHeroSlide({ slideType: "collection", collection: null }, 0, enquire)).toBeNull();
    expect(toCollectionsHeroSlide({ slideType: "brand", brand: null }, 0, enquire)).toBeNull();
    expect(toCollectionsHeroSlide({ slideType: "promotional" }, 0, enquire)).toBeNull();
  });
});

describe("toHomeHeroSlide", () => {
  it("builds an offer slide the home stage can draw", () => {
    const slide = toHomeHeroSlide(
      { slideType: "offer", offer: { _id: "o", title: "Festive", validUntil: "2026-11-15", description: "Details", brandName: "Hafele" } },
      1,
      enquire
    );
    expect(slide).toMatchObject({
      id: "manager-1",
      eyebrow: "CURRENT OFFER · UNTIL 15 NOV 2026",
      title: "Festive",
      description: "Details",
      primaryCta: "Enquire about this offer",
      ctaTarget: "wa://Festive",
      specimenCaption: "Hafele",
    });
  });

  it("sends a collection to its family anchor and a promo with no link to /collections", () => {
    const c = toHomeHeroSlide(
      { slideType: "collection", collection: { name: "Glass Fittings", slug: "glass-door-fittings", primaryRail: "glass" } },
      0,
      enquire
    );
    expect(c?.ctaTarget).toBe("/collections#glass");
    const p = toHomeHeroSlide({ slideType: "promotional", title: "Sale" }, 0, enquire);
    expect(p?.ctaTarget).toBe("/collections");
  });
});

/** The real query, run over a small dataset with references, as the Studio would store it. */
describe("getHeroManagerQuery", () => {
  const NOW = new Date("2026-10-06T10:00:00Z");
  const ref = (id: string) => ({ _type: "reference", _ref: id });
  const dataset = [
    { _id: "o-live", _type: "offer", title: "Live", offerType: "store", validUntil: "2026-10-06", image: { asset: ref("img-1") } },
    { _id: "o-ongoing", _type: "offer", title: "Ongoing", offerType: "seasonal" },
    { _id: "o-expired", _type: "offer", title: "Expired", offerType: "store", validUntil: "2026-10-05" },
    { _id: "o-off", _type: "offer", title: "Off", offerType: "store", active: false },
    { _id: "img-1", _type: "sanity.imageAsset", url: "https://cdn.test/live.jpg" },
    { _id: "cat-1", _type: "category", name: "Digital Locks", slug: { current: "digital-locks" }, primaryRail: "door-hardware" },
    { _id: "brand-1", _type: "brand", name: "Hafele", slug: { current: "hafele" } },
    {
      _id: "heroManager",
      _type: "heroManager",
      homeHero: [
        { _key: "1", slideType: "offer", offer: ref("o-live"), position: 2 },
        { _key: "2", slideType: "offer", offer: ref("o-expired") },
        { _key: "3", slideType: "promotional", title: "Sale", subtitle: "Now on" },
      ],
      collectionHero: [
        { _key: "1", slideType: "offer", offer: ref("o-ongoing") },
        { _key: "2", slideType: "offer", offer: ref("o-off") },
        { _key: "3", slideType: "offer", offer: ref("o-missing") },
        { _key: "4", slideType: "collection", collection: ref("cat-1") },
        { _key: "5", slideType: "brand", brand: ref("brand-1") },
      ],
    },
  ];

  async function run(): Promise<HeroManagerData> {
    const result = await evaluate(parse(getHeroManagerQuery), { dataset, timestamp: NOW });
    return (await result.get()) as HeroManagerData;
  }

  it("keeps a live offer, including one that ends today, with its image and position", async () => {
    const { home } = await run();
    const live = home?.find((s) => s.offer?._id === "o-live");
    expect(live).toMatchObject({ position: 2, offer: { title: "Live", imageUrl: "https://cdn.test/live.jpg" } });
  });

  it("drops an expired offer, a switched-off one and one whose document is gone", async () => {
    const { home, collections } = await run();
    expect(home?.some((s) => s.offer?._id === "o-expired")).toBe(false);
    expect(collections?.some((s) => s.offer?._id === "o-off")).toBe(false);
    expect(collections?.filter((s) => s.slideType === "offer").map((s) => s.offer?._id)).toEqual(["o-ongoing"]);
  });

  it("leaves other slide types alone and resolves their references", async () => {
    const { home, collections } = await run();
    expect(home?.find((s) => s.slideType === "promotional")).toMatchObject({ title: "Sale", subtitle: "Now on" });
    expect(collections?.find((s) => s.slideType === "collection")?.collection).toMatchObject({
      name: "Digital Locks",
      slug: "digital-locks",
      primaryRail: "door-hardware",
    });
    expect(collections?.find((s) => s.slideType === "brand")?.brand).toMatchObject({ name: "Hafele", slug: "hafele" });
  });

  it("keeps each page's slides in the order the editor arranged them", async () => {
    const { collections } = await run();
    expect(collections?.map((s) => s.slideType)).toEqual(["offer", "collection", "brand"]);
  });

  it("is null when no Hero Manager document exists", async () => {
    const result = await evaluate(parse(getHeroManagerQuery), { dataset: [], timestamp: NOW });
    expect(await result.get()).toBeNull();
  });
});
