import { describe, expect, it } from "vitest";
import { pageScale } from "./PdfCanvas";

// A4 at 72dpi, the shape almost every catalogue page has.
const A4 = { w: 595, h: 842 };

describe("pageScale", () => {
  it("fits the page to the shell width", () => {
    // 800 - 24 padding = 776 across a 595pt page, below the 1.6x cap.
    expect(pageScale(A4, { w: 800, h: 740 }, "width", 1)).toBeCloseTo(776 / 595, 5);
  });

  it("fits the whole page when height is the binding constraint", () => {
    const scale = pageScale(A4, { w: 1090, h: 740 }, "page", 1);
    expect(scale).toBeCloseTo((740 - 24) / 842, 5);
    // The rendered page must actually fit the viewport.
    expect(A4.h * scale).toBeLessThanOrEqual(740);
  });

  it("multiplies the fit by the zoom level", () => {
    const fit = pageScale(A4, { w: 1090, h: 740 }, "width", 1);
    expect(pageScale(A4, { w: 1090, h: 740 }, "width", 1.5)).toBeCloseTo(fit * 1.5, 5);
    expect(pageScale(A4, { w: 1090, h: 740 }, "width", 0.5)).toBeCloseTo(fit * 0.5, 5);
  });

  it("caps fit-width so a small page is not blown up past 1.6x", () => {
    expect(pageScale({ w: 200, h: 300 }, { w: 1090, h: 740 }, "width", 1)).toBe(1.6);
  });

  it("never returns a scale that would render a page invisibly small", () => {
    expect(pageScale(A4, { w: 40, h: 40 }, "page", 1)).toBe(0.2);
  });

  it("falls back to 1 only while the shell is unmeasured", () => {
    // The regression this guards: an unmeasured shell froze every page at
    // natural size, so zoom and fit changed the label and nothing else.
    expect(pageScale(A4, { w: 0, h: 0 }, "width", 2)).toBe(1);
    expect(pageScale(null, { w: 1090, h: 740 }, "width", 2)).toBe(1);
    // Once measured, zoom must take effect.
    expect(pageScale(A4, { w: 1090, h: 740 }, "width", 2)).toBeGreaterThan(1);
  });
});
