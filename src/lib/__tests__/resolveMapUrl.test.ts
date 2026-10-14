import { describe, expect, it } from "vitest";
import { SHOWROOM_MAP_URL, resolveMapUrl } from "../config";

describe("resolveMapUrl", () => {
  it("uses the link an editor set in Studio", () => {
    expect(resolveMapUrl("https://maps.app.goo.gl/6qokJfpuQgfNwqZK9")).toBe("https://maps.app.goo.gl/6qokJfpuQgfNwqZK9");
  });

  it("trims stray whitespace from the Studio value", () => {
    expect(resolveMapUrl("  https://maps.app.goo.gl/abc  ")).toBe("https://maps.app.goo.gl/abc");
  });

  it("falls back to the configured default when Studio has nothing", () => {
    expect(resolveMapUrl(undefined)).toBe(SHOWROOM_MAP_URL);
    expect(resolveMapUrl(null)).toBe(SHOWROOM_MAP_URL);
    expect(resolveMapUrl("")).toBe(SHOWROOM_MAP_URL);
    expect(resolveMapUrl("   ")).toBe(SHOWROOM_MAP_URL);
  });

  it("ignores a Studio value that is not a usable link, so the button never breaks", () => {
    expect(resolveMapUrl("maps.app.goo.gl/abc")).toBe(SHOWROOM_MAP_URL);
    expect(resolveMapUrl("not a url")).toBe(SHOWROOM_MAP_URL);
    expect(resolveMapUrl("javascript:alert(1)")).toBe(SHOWROOM_MAP_URL);
    expect(resolveMapUrl("data:text/html,<script>alert(1)</script>")).toBe(SHOWROOM_MAP_URL);
  });
});
