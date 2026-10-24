import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import FinishesStrip, { type FinishItem } from "../FinishesStrip";

const render = (finishes?: FinishItem[]) => renderToStaticMarkup(createElement(FinishesStrip, { finishes }));

describe("FinishesStrip", () => {
  it("renders nothing when Studio has no finishes", () => {
    expect(render(undefined)).toBe("");
    expect(render([])).toBe("");
  });

  it("skips an item still being written (no name at all) and renders nothing if none remain", () => {
    expect(render([{ _key: "a", description: "orphan text" }])).toBe("");
  });

  it("renders each finish's name, sub-name and description in order", () => {
    const html = render([
      { _key: "a", name: "SATIN", subName: "Satin Steel", description: "Restrained." },
      { _key: "b", name: "BRASS", subName: "Living Brass", description: "Warm." },
    ]);
    expect(html.indexOf("Satin Steel")).toBeGreaterThan(-1);
    expect(html.indexOf("Living Brass")).toBeGreaterThan(html.indexOf("Satin Steel"));
    expect(html).toContain("Restrained.");
    expect(html).toContain('id="finishes"');
  });

  it("keeps the technical specification out of the visible text", () => {
    const html = render([{ _key: "a", name: "SATIN", description: "Restrained.", specification: "Surface: 180-grit" }]);
    expect(html.replace(/<[^>]*>/g, " ")).not.toContain("180-grit");
  });
});
