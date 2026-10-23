import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ShowroomGallery, { photoRatio, type ShowroomPhoto } from "../ShowroomGallery";

const render = (photos?: ShowroomPhoto[]) => renderToStaticMarkup(createElement(ShowroomGallery, { photos }));

describe("photoRatio", () => {
  it("is width over height, and square when Sanity reported no size", () => {
    expect(photoRatio({ width: 1536, height: 1024 })).toBeCloseTo(1.5);
    expect(photoRatio({ width: 783, height: 1280 })).toBeCloseTo(0.612, 2);
    expect(photoRatio({})).toBe(1);
    expect(photoRatio({ width: 100 })).toBe(1);
  });
});

describe("ShowroomGallery", () => {
  it("renders nothing without photos, or when none has an image", () => {
    expect(render(undefined)).toBe("");
    expect(render([])).toBe("");
    expect(render([{ _key: "a" }])).toBe("");
  });

  it("renders each photo in order with a position-based description", () => {
    const html = render([
      { _key: "a", url: "https://cdn.sanity.io/images/p/d/a-1536x1024.png", width: 1536, height: 1024 },
      { _key: "b", url: "https://cdn.sanity.io/images/p/d/b-783x1280.jpg", width: 783, height: 1280 },
    ]);
    expect(html).toContain("photograph 1 of 2");
    expect(html.indexOf("photograph 2 of 2")).toBeGreaterThan(html.indexOf("photograph 1 of 2"));
    expect(html).toContain('id="showroom-photos"');
  });

  it("shows at most four photos", () => {
    const many = Array.from({ length: 7 }, (_, i) => ({ _key: `k${i}`, url: `https://cdn.sanity.io/images/p/d/${i}-100x100.jpg`, width: 100, height: 100 }));
    expect((render(many).match(/<li/g) ?? []).length).toBe(4);
  });
});
