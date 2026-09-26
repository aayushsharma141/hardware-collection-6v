import { describe, expect, it } from "vitest";
import { boundsOfStrokes, suggestRegion } from "../capture";
import {
  buildCaption,
  buildMarkedEnquiryMessage,
  buildPageEnquiryMessage,
  shortCatalogueTitle,
} from "../messages";

describe("boundsOfStrokes", () => {
  it("returns null when nothing has been marked", () => {
    expect(boundsOfStrokes([])).toBeNull();
    expect(boundsOfStrokes([{ points: [] }])).toBeNull();
  });

  it("brackets every point across every stroke", () => {
    const bounds = boundsOfStrokes([
      { points: [{ x: 0.4, y: 0.3 }, { x: 0.6, y: 0.3 }] },
      { points: [{ x: 0.35, y: 0.5 }] },
    ]);
    expect(bounds).toEqual({ x: 0.35, y: 0.3, w: 0.25, h: 0.2 });
  });

  it("gives a single tap an area to sit inside", () => {
    const bounds = boundsOfStrokes([{ points: [{ x: 0.5, y: 0.5 }] }]);
    expect(bounds).toEqual({ x: 0.38, y: 0.38, w: 0.24, h: 0.24 });
  });

  it("does not push a tap near the edge off the page", () => {
    const bounds = boundsOfStrokes([{ points: [{ x: 0.02, y: 0.01 }] }]);
    expect(bounds?.x).toBe(0);
    expect(bounds?.y).toBe(0);
  });
});

describe("suggestRegion", () => {
  it("pads the marked area so the product is not cropped tight", () => {
    const region = suggestRegion({ x: 0.4, y: 0.4, w: 0.2, h: 0.2 });
    expect(region.x).toBeLessThan(0.4);
    expect(region.y).toBeLessThan(0.4);
    expect(region.w).toBeGreaterThan(0.2);
    expect(region.h).toBeGreaterThan(0.2);
  });

  it("stays inside the page", () => {
    const region = suggestRegion({ x: 0, y: 0, w: 1, h: 1 });
    expect(region.x).toBe(0);
    expect(region.y).toBe(0);
    expect(region.x + region.w).toBeLessThanOrEqual(1);
    expect(region.y + region.h).toBeLessThanOrEqual(1);
  });
});

describe("enquiry messages", () => {
  const hafele = { brand: "Häfele", catalogue: "Kitchen Hardware", page: 42 };
  const labacha = { brand: "Labacha", catalogue: "Labacha Long Handle", page: 12 };

  it("names brand, catalogue and page so staff can quote without asking", () => {
    const message = buildMarkedEnquiryMessage(hafele);
    expect(message).toContain("Häfele Kitchen Hardware catalogue");
    expect(message).toContain("page 42");
    expect(message).toContain("price and availability");
  });

  it("offers the no-marking route the same context", () => {
    const message = buildPageEnquiryMessage(hafele);
    expect(message).toContain("page 42");
    expect(message).toContain("Häfele Kitchen Hardware");
  });

  it("drops a brand the header already shows, across accent variants", () => {
    expect(shortCatalogueTitle("Hafele", "Häfele Sliding Systems")).toBe("Sliding Systems");
    expect(shortCatalogueTitle("Labacha", "Labacha Long Handle")).toBe("Long Handle");
    // Nothing to strip, and never strips down to nothing.
    expect(shortCatalogueTitle("Blum", "Kitchen Fittings")).toBe("Kitchen Fittings");
    expect(shortCatalogueTitle("Dorset", "Dorset")).toBe("Dorset");
  });

  it("matches the brand across spelling variants of its accents", () => {
    // Brand records spell it "Hafele"; the catalogue title uses "Häfele".
    const context = { brand: "Hafele", catalogue: "Häfele Sliding Systems", page: 4 };
    expect(buildCaption(context)).toBe("Häfele Sliding Systems · Page 4");
    expect(buildMarkedEnquiryMessage(context)).not.toContain("Hafele Häfele");
  });

  it("does not repeat a brand the catalogue title already carries", () => {
    expect(buildMarkedEnquiryMessage(labacha)).toContain("the Labacha Long Handle catalogue");
    expect(buildMarkedEnquiryMessage(labacha)).not.toContain("Labacha Labacha");
    expect(buildCaption(labacha)).toBe("Labacha Long Handle · Page 12");
  });

  it("stamps captures with where they came from", () => {
    expect(buildCaption(hafele)).toBe("Häfele Kitchen Hardware · Page 42");
  });
});
