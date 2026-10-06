import { describe, it, expect } from "vitest";
import { formatOfferDate, HERO_MAX_OFFERS, HERO_MAX_SLIDES } from "../offers";

describe("formatOfferDate", () => {
  it("formats a plain date without a timezone shift", () => {
    expect(formatOfferDate("2026-11-15")).toBe("15 Nov 2026");
  });
});

describe("hero limits", () => {
  it("allows three offers in a hero of six slides", () => {
    expect(HERO_MAX_OFFERS).toBe(3);
    expect(HERO_MAX_SLIDES).toBe(6);
  });
});
