import { describe, it, expect } from "vitest";
import { SHOWROOM_FAMILIES_NAV } from "../useCollectionsState";

describe("SHOWROOM_FAMILIES_NAV", () => {
  it("defines top-level discovery showroom families", () => {
    expect(SHOWROOM_FAMILIES_NAV).toHaveLength(6);
    expect(SHOWROOM_FAMILIES_NAV[0].id).toBe("all");
    expect(SHOWROOM_FAMILIES_NAV.map(f => f.id)).toEqual([
      "all",
      "handles-knobs",
      "door-hardware",
      "bathroom",
      "kitchen-wardrobes",
      "furniture-hardware",
    ]);
  });

  it("assigns appropriate filter slugs to each family", () => {
    const doorHardware = SHOWROOM_FAMILIES_NAV.find(f => f.id === "door-hardware");
    expect(doorHardware?.filterSlugs).toContain("digital-locks");
    expect(doorHardware?.filterSlugs).toContain("mortise-door-locks");

    const kitchen = SHOWROOM_FAMILIES_NAV.find(f => f.id === "kitchen-wardrobes");
    expect(kitchen?.filterSlugs).toContain("modular-kitchen-hardware");
    expect(kitchen?.filterSlugs).toContain("wardrobe-hardware-sliding");
  });
});
