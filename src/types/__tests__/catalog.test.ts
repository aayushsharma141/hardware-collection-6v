import { describe, it, expect } from "vitest";
import { getSlugString } from "../catalog";

describe("getSlugString helper", () => {
  it("extracts slug string from Sanity slug object", () => {
    const slugObj = { current: "digital-locks" };
    expect(getSlugString(slugObj)).toBe("digital-locks");
  });

  it("returns plain string as-is", () => {
    expect(getSlugString("door-hardware")).toBe("door-hardware");
  });

  it("handles empty or null values gracefully", () => {
    expect(getSlugString(undefined)).toBe("");
    expect(getSlugString(null as unknown as string)).toBe("");
    expect(getSlugString("")).toBe("");
  });

  it("handles object without current property", () => {
    expect(getSlugString({} as unknown as string)).toBe("");
  });
});
