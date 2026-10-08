import { describe, it, expect } from "vitest";
import { pickHeroOffers, weaveHeroSlides, formatOfferDate, HERO_MAX_OFFERS, HERO_MAX_SLIDES_HOME, HERO_MAX_SLIDES_COLLECTIONS } from "../offers";
import type { Offer } from "@/types/catalog";

const offer = (id: string, extra: Partial<Offer> = {}): Offer => ({ _id: id, title: id, type: "store", ...extra });

describe("pickHeroOffers", () => {
  it("returns offers toggled via visibleOnHome and visibleOnCollection", () => {
    const offers = [
      offer("a", { visibleOnHome: true }),
      offer("b", { visibleOnCollection: true }),
      offer("c", { visibleOnHome: true, visibleOnCollection: true }),
      offer("d"),
    ];
    expect(pickHeroOffers(offers, "home").map((o) => o._id)).toEqual(["a", "c"]);
    expect(pickHeroOffers(offers, "collections").map((o) => o._id)).toEqual(["b", "c"]);
  });

  it("supports legacy heroPlacement array as fallback", () => {
    const offers = [
      offer("a", { heroPlacement: ["home"] }),
      offer("b", { heroPlacement: ["collections"] }),
      offer("c", { heroPlacement: ["home", "collections"] }),
      offer("d"),
    ];
    expect(pickHeroOffers(offers, "home").map((o) => o._id)).toEqual(["a", "c"]);
    expect(pickHeroOffers(offers, "collections").map((o) => o._id)).toEqual(["b", "c"]);
  });

  it("keeps max when more are toggled, lowest hero order first", () => {
    const offers = ["a", "b", "c", "d", "e"].map((id, i) =>
      offer(id, { visibleOnCollection: true, heroOrder: 5 - i })
    );
    expect(pickHeroOffers(offers, "collections").map((o) => o._id)).toEqual(["e", "d", "c"]);
  });

  it("ranks offers with no order after numbered ones, then by soonest end date", () => {
    const offers = [
      offer("later", { visibleOnHome: true, validUntil: "2026-12-31" }),
      offer("sooner", { visibleOnHome: true, validUntil: "2026-10-31" }),
      offer("ongoing", { visibleOnHome: true }),
      offer("ranked", { visibleOnHome: true, heroOrder: 9 }),
    ];
    expect(pickHeroOffers(offers, "home", 4).map((o) => o._id)).toEqual(["ranked", "sooner", "later", "ongoing"]);
  });

  it("does not reorder the array it is given", () => {
    const offers = [
      offer("b", { visibleOnHome: true, heroOrder: 2 }),
      offer("a", { visibleOnHome: true, heroOrder: 1 }),
    ];
    pickHeroOffers(offers, "home");
    expect(offers.map((o) => o._id)).toEqual(["b", "a"]);
  });
});

describe("weaveHeroSlides", () => {
  const own = ["F1", "F2", "F3", "F4", "F5", "F6", "F7"];

  it("is exactly the page's own slides when there are no offers, however many", () => {
    expect(weaveHeroSlides(own, [])).toEqual(own);
    expect(weaveHeroSlides(["F1", "F2", "F3"], [])).toEqual(["F1", "F2", "F3"]);
  });

  it("replaces three of six with offers and alternates them", () => {
    expect(weaveHeroSlides(own, ["O1", "O2", "O3"], 6)).toEqual(["F1", "O1", "F2", "O2", "F3", "O3"]);
  });

  it("with one offer on collections, the offer takes one slot and rest stay collections (total 7)", () => {
    expect(weaveHeroSlides(own, ["O1"], 7)).toEqual(["F1", "O1", "F2", "F3", "F4", "F5", "F6"]);
  });

  it("with one offer on home, the offer takes one slot and 3 stay home (total 4)", () => {
    expect(weaveHeroSlides(["H1", "H2", "H3", "H4"], ["O1"], 4)).toEqual(["H1", "O1", "H2", "H3"]);
  });

  it("never exceeds the cap, even with many offers", () => {
    expect(weaveHeroSlides(own, ["O1", "O2", "O3", "O4", "O5", "O6", "O7"], 7)).toHaveLength(7);
  });
});

describe("formatOfferDate", () => {
  it("formats a plain date without a timezone shift", () => {
    expect(formatOfferDate("2026-11-15")).toBe("15 Nov 2026");
  });
});

describe("hero limits", () => {
  it("allows correct limits in heroes", () => {
    expect(HERO_MAX_OFFERS).toBe(3);
    expect(HERO_MAX_SLIDES_HOME).toBe(4);
    expect(HERO_MAX_SLIDES_COLLECTIONS).toBe(7);
  });
});
