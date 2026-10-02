import { describe, it, expect } from "vitest";
import { arrangeProducts } from "../arrange";

const make = (featured: number, regular: number) => [
  ...Array.from({ length: featured }, (_, i) => ({ id: `f${i}`, featured: true })),
  ...Array.from({ length: regular }, (_, i) => ({ id: `r${i}`, featured: false })),
];

/** Fills rows left to right and reports each row's total width. */
function rowWidths(spans: number[], columns = 12): number[] {
  const rows: number[] = [];
  let current = 0;
  for (const span of spans) {
    if (current + span > columns) {
      rows.push(current);
      current = 0;
    }
    current += span;
  }
  rows.push(current);
  return rows;
}

describe("arrangeProducts", () => {
  it("keeps every product exactly once", () => {
    for (let f = 0; f <= 7; f++) {
      for (let r = 0; r <= 9; r++) {
        const input = make(f, r);
        const out = arrangeProducts(input);
        expect(out.map((o) => o.product.id).sort(), `${f}F ${r}R`).toEqual(
          input.map((p) => p.id).sort()
        );
      }
    }
  });

  it("fills every desktop row to exactly 12 columns, whatever the mix", () => {
    for (let f = 0; f <= 7; f++) {
      for (let r = 0; r <= 9; r++) {
        if (f + r === 0) continue;
        const widths = rowWidths(arrangeProducts(make(f, r)).map((o) => o.lg));
        expect(widths.every((w) => w === 12), `${f} featured, ${r} regular -> ${widths}`).toBe(true);
      }
    }
  });

  it("fills every tablet row to exactly 12 columns", () => {
    for (let n = 1; n <= 16; n++) {
      const widths = rowWidths(arrangeProducts(make(0, n)).map((o) => o.md));
      expect(widths.every((w) => w === 12), `${n} products -> ${widths}`).toBe(true);
    }
  });

  it("gives featured products more room than regular ones when both are present", () => {
    const out = arrangeProducts(make(2, 4));
    const spanOf = (id: string) => out.find((o) => o.product.id === id)?.lg;
    expect(spanOf("f0")).toBe(8);
    expect(spanOf("f1")).toBe(8);
    expect(spanOf("r0")).toBe(4);
  });

  it("alternates which side the featured product sits on", () => {
    const out = arrangeProducts(make(2, 2));
    expect(out.map((o) => `${o.product.id}:${o.lg}`)).toEqual(["f0:8", "r0:4", "r1:4", "f1:8"]);
  });

  it("the live showroom: 2 featured + 4 regular, and 3 featured + 2 regular", () => {
    // Door & Entry, Kitchen & Wardrobe as they stand in Sanity today.
    expect(arrangeProducts(make(2, 4)).map((o) => o.lg)).toEqual([8, 4, 4, 8, 6, 6]);
    expect(arrangeProducts(make(3, 2)).map((o) => o.lg)).toEqual([8, 4, 4, 8, 12]);
  });

  it("never returns a span outside the allowed set", () => {
    for (let f = 0; f <= 6; f++) {
      for (let r = 0; r <= 8; r++) {
        for (const o of arrangeProducts(make(f, r))) {
          expect([4, 6, 8, 12]).toContain(o.lg);
          expect([6, 12]).toContain(o.md);
        }
      }
    }
  });

  it("returns nothing for an empty section", () => {
    expect(arrangeProducts([])).toEqual([]);
  });
});
