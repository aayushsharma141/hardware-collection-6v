import { describe, it, expect } from "vitest";

// Self-contained WCAG 2.x contrast-ratio implementation. No production import
// — this proves the UI-SPEC color table's claims are computed, not assumed.

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return [r, g, b];
}

function channelToLinear(c: number): number {
  const cs = c / 255;
  return cs <= 0.03928 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb;
  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  );
}

function contrastRatio(hexA: string, hexB: string): number {
  const lumA = relativeLuminance(hexToRgb(hexA));
  const lumB = relativeLuminance(hexToRgb(hexB));
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("WCAG contrast — UI-SPEC color table", () => {
  const pairs: Array<{ name: string; fg: string; bg: string; expected: number }> = [
    { name: "bone on cinema-black", fg: "#e8e3d9", bg: "#090909", expected: 15.57 },
    { name: "bone on obsidian card", fg: "#e8e3d9", bg: "#11100f", expected: 14.86 },
    { name: "brass on cinema-black", fg: "#c8a96e", bg: "#090909", expected: 8.87 },
    { name: "brass on obsidian card", fg: "#c8a96e", bg: "#11100f", expected: 8.47 },
    { name: "muted grey on cinema-black", fg: "#aaa49a", bg: "#090909", expected: 8.05 },
    { name: "muted grey on graphite frame", fg: "#aaa49a", bg: "#181716", expected: 7.23 },
    { name: "near-black text on brass button fill", fg: "#090909", bg: "#c8a96e", expected: 8.87 },
    { name: "lighter gold on cinema-black", fg: "#e5c487", bg: "#090909", expected: 11.93 },
  ];

  pairs.forEach(({ name, fg, bg, expected }) => {
    it(`${name} (${fg} on ${bg}) meets WCAG AA and matches the measured ratio`, () => {
      const ratio = contrastRatio(fg, bg);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
      expect(ratio).toBeCloseTo(expected, 1);
    });
  });

  it("flags the prohibited pair: bone text directly on brass fill fails AA", () => {
    const ratio = contrastRatio("#e8e3d9", "#c8a96e");
    expect(ratio).toBeCloseTo(1.76, 1);
    expect(ratio).toBeLessThan(4.5);
  });
});
