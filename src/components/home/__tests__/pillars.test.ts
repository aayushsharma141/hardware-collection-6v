import { describe, expect, it } from "vitest";
import { LEGACY_PILLARS } from "@/content/fallback/legacyPillars";
import { MAX_PILLARS, pillarGridClass, resolvePillars } from "../pillars";

describe("resolvePillars", () => {
  it("uses the built-in three when Studio has none", () => {
    for (const empty of [undefined, null, []]) {
      expect(resolvePillars(empty).map((p) => p.title)).toEqual(LEGACY_PILLARS.map((p) => p.title));
    }
  });

  it("uses Studio's pillars, trimmed, in order", () => {
    const out = resolvePillars([
      { _key: "a", title: " One ", description: " first " },
      { _key: "b", title: "Two", description: "second" },
    ]);
    expect(out).toEqual([
      { key: "a", title: "One", description: "first" },
      { key: "b", title: "Two", description: "second" },
    ]);
  });

  it("skips a pillar still being written (no title) and falls back if none remain", () => {
    expect(resolvePillars([{ _key: "a", title: "  ", description: "x" }]).map((p) => p.title)).toEqual(
      LEGACY_PILLARS.map((p) => p.title)
    );
    expect(resolvePillars([{ _key: "a", description: "x" }, { _key: "b", title: "Real" }]).map((p) => p.title)).toEqual(["Real"]);
  });

  it("caps at the four Studio allows and keeps a missing description empty", () => {
    const many = Array.from({ length: 6 }, (_, i) => ({ _key: `k${i}`, title: `T${i}` }));
    const out = resolvePillars(many);
    expect(out).toHaveLength(MAX_PILLARS);
    expect(out[0].description).toBe("");
  });

  it("gives a stable key when Studio supplies none", () => {
    expect(resolvePillars([{ title: "A" }, { title: "B" }]).map((p) => p.key)).toEqual(["pillar-0", "pillar-1"]);
  });
});

describe("pillarGridClass", () => {
  it("fills the row for every count", () => {
    expect(pillarGridClass(1)).toBe("sm:grid-cols-1");
    expect(pillarGridClass(2)).toBe("sm:grid-cols-2");
    expect(pillarGridClass(3)).toBe("sm:grid-cols-3");
    expect(pillarGridClass(4)).toContain("lg:grid-cols-4");
  });
});
