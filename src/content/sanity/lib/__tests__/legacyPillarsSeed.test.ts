import { describe, expect, it } from "vitest";
import { LEGACY_PILLARS } from "@/components/home/pillars";
import { planLegacyPillars, type HomeDoc } from "../legacyPillarsSeed";

const home = (extra: Partial<HomeDoc> = {}, id = "homePage"): HomeDoc => ({ _id: id, _type: "homePage", ...extra });

describe("planLegacyPillars", () => {
  it("replaces a different set and reports what was there", () => {
    const plan = planLegacyPillars([home({ legacyPillars: [{ _key: "leg1", title: "Expert Selection", description: "x" }] })], LEGACY_PILLARS);
    expect(plan.mutations).toHaveLength(1);
    expect(plan.mutations[0].patch.set.legacyPillars.map((p) => p.title)).toEqual(LEGACY_PILLARS.map((p) => p.title));
    expect(plan.mutations[0].patch.set.legacyPillars.every((p) => p._type === "legacyPillar")).toBe(true);
    expect(plan.before[0].pillars[0].title).toBe("Expert Selection");
  });

  it("fills a document that has none", () => {
    expect(planLegacyPillars([home()], LEGACY_PILLARS).mutations).toHaveLength(1);
  });

  it("patches the draft as well as the published document", () => {
    const plan = planLegacyPillars([home(), home({}, "drafts.homePage")], LEGACY_PILLARS);
    expect(plan.mutations.map((m) => m.patch.id)).toEqual(["homePage", "drafts.homePage"]);
  });

  it("is idempotent and ignores other document types", () => {
    const done = home({ legacyPillars: LEGACY_PILLARS.map((p) => ({ _type: "legacyPillar", ...p })) });
    expect(planLegacyPillars([done, { _id: "s", _type: "siteSettings" }], LEGACY_PILLARS).mutations).toEqual([]);
  });

  it("treats a changed order or text as different", () => {
    const reordered = home({ legacyPillars: [...LEGACY_PILLARS].reverse().map((p) => ({ _type: "legacyPillar", ...p })) });
    expect(planLegacyPillars([reordered], LEGACY_PILLARS).mutations).toHaveLength(1);
  });
});
