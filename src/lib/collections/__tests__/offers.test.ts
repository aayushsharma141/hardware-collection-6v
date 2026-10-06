import { describe, it, expect } from "vitest";
import { pickHeroOffers, weaveHeroSlides, formatOfferDate } from "../offers";
import type { Offer } from "@/types/catalog";

const offer = (id: string, extra: Partial<Offer> = {}): Offer => ({ _id: id, title: id, type: "store", ...extra });

describe("pickHeroOffers", () => {
  it("only returns offers ticked for that page", () => {
    const offers = [
      offer("a", { heroPlacement: ["home"] }),
      offer("b", { heroPlacement: ["collections"] }),
      offer("c", { heroPlacement: ["home", "collections"] }),
      offer("d"),
    ];
    expect(pickHeroOffers(offers, "home").map((o) => o._id)).toEqual(["a", "c"]);
    expect(pickHeroOffers(offers, "collections").map((o) => o._id)).toEqual(["b", "c"]);
  });

  it("keeps three when more are ticked, lowest hero order first", () => {
    const offers = ["a", "b", "c", "d", "e"].map((id, i) =>
      offer(id, { heroPlacement: ["collections"], heroOrder: 5 - i })
    );
    expect(pickHeroOffers(offers, "collections").map((o) => o._id)).toEqual(["e", "d", "c"]);
  });

  it("ranks offers with no order after numbered ones, then by soonest end date", () => {
    const offers = [
      offer("later", { heroPlacement: ["home"], validUntil: "2026-12-31" }),
      offer("sooner", { heroPlacement: ["home"], validUntil: "2026-10-31" }),
      offer("ongoing", { heroPlacement: ["home"] }),
      offer("ranked", { heroPlacement: ["home"], heroOrder: 9 }),
    ];
    expect(pickHeroOffers(offers, "home", 4).map((o) => o._id)).toEqual(["ranked", "sooner", "later", "ongoing"]);
  });

  it("does not reorder the array it is given", () => {
    const offers = [offer("b", { heroPlacement: ["home"], heroOrder: 2 }), offer("a", { heroPlacement: ["home"], heroOrder: 1 })];
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
    expect(weaveHeroSlides(own, ["O1", "O2", "O3"])).toEqual(["F1", "O1", "F2", "O2", "F3", "O3"]);
  });

  it("with one offer, the offer takes one slot and the rest stay collections", () => {
    expect(weaveHeroSlides(own, ["O1"])).toEqual(["F1", "O1", "F2", "F3", "F4", "F5"]);
  });

  it("appends offers after a short list of the page's own slides", () => {
    expect(weaveHeroSlides(["H1", "H2", "H3"], ["O1", "O2", "O3"])).toEqual(["H1", "O1", "H2", "O2", "H3", "O3"]);
  });

  it("never exceeds the cap, even with many offers", () => {
    expect(weaveHeroSlides(own, ["O1", "O2", "O3", "O4", "O5", "O6", "O7"], 6)).toHaveLength(6);
  });
});

describe("formatOfferDate", () => {
  it("formats a plain date without a timezone shift", () => {
    expect(formatOfferDate("2026-11-15")).toBe("15 Nov 2026");
  });
});
