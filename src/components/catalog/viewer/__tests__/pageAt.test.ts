import { describe, expect, it } from "vitest";
import { pageAt } from "../PdfCanvas";

// Page tops for four 1000px pages with a 12px gap, after 12px of padding.
const tops = [12, 1024, 2036, 3048];

describe("pageAt", () => {
  it("finds the page whose top is at or above a scroll position", () => {
    expect(pageAt(tops, 0)).toBe(0);
    expect(pageAt(tops, 12)).toBe(0);
    expect(pageAt(tops, 1023)).toBe(0);
    expect(pageAt(tops, 1024)).toBe(1);
    expect(pageAt(tops, 2500)).toBe(2);
  });

  it("clamps past the last page instead of running off the end", () => {
    expect(pageAt(tops, 99999)).toBe(3);
  });

  it("copes with a single page and with a probe inside a gap", () => {
    expect(pageAt([12], 5000)).toBe(0);
    // 1012–1023 is the gap between pages 1 and 2; it still belongs to page 1.
    expect(pageAt(tops, 1015)).toBe(0);
  });
});
