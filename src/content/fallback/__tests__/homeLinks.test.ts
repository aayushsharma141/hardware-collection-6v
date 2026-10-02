import { describe, it, expect } from "vitest";
import { CATEGORY_FAMILIES, SIGNATURE_PIECES } from "@/content/fallback/home";
import { SHOWROOM_GROUPS } from "@/lib/collections/showroom";

const ALL_HOME_LINKS = [...CATEGORY_FAMILIES, ...SIGNATURE_PIECES];

// The catalogue is the only collections route, so a homepage tile can only
// point at an anchor on it: `/collections#<showroom-group-id>`.
const GROUP_IDS = new Set([...SHOWROOM_GROUPS.map((g) => g.id), "other"]);
const ANCHOR_SHAPE = /^\/collections#([a-z0-9-]+)$/;

describe("Homepage deep links stay inside the one catalogue route", () => {
  it("links to an in-page anchor on /collections, never a path under it or a query-string filter", () => {
    ALL_HOME_LINKS.forEach((link) => {
      expect(link.href).toMatch(ANCHOR_SHAPE);
      expect(link.href).not.toContain("?");
      expect(link.href).not.toMatch(/^\/collections\/[^#]/);
    });
  });

  it("anchors only to a showroom group the catalogue can render", () => {
    ALL_HOME_LINKS.forEach((link) => {
      const id = link.href.match(ANCHOR_SHAPE)?.[1] ?? "";
      expect(GROUP_IDS.has(id), link.href).toBe(true);
    });
  });

  it("sends the Door Hardware tile and the biometric lock to Door Hardware", () => {
    const door = CATEGORY_FAMILIES.find((f) => f.name === "Door");
    expect(door?.href).toBe("/collections#door-hardware");
    const lock = SIGNATURE_PIECES.find((p) => p.name === "Biometric Lock");
    expect(lock?.href).toBe("/collections#door-hardware");
  });

  it("sends each signature piece to the family its category's primaryRail names", () => {
    // The knob is a cabinet handle, which the business files under Handles & Knobs;
    // the channel is a kitchen runner. No guessing from the name.
    const channel = SIGNATURE_PIECES.find((p) => p.name === "Soft-Close Channel");
    const knob = SIGNATURE_PIECES.find((p) => p.name === "Cabinet Knob");
    expect(channel?.href).toBe("/collections#kitchen-wardrobes");
    expect(knob?.href).toBe("/collections#handles-knobs");
  });
});
