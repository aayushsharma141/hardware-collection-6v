import { describe, expect, it } from "vitest";
import robots from "../robots";

describe("robots.txt", () => {
  it("keeps /studio and /api out of every crawler group", () => {
    const rules = [robots().rules].flat();
    expect(rules.length).toBeGreaterThan(1);
    for (const rule of rules) {
      expect([rule.disallow].flat()).toEqual(expect.arrayContaining(["/studio/", "/api/"]));
    }
  });
});
