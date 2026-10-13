import { describe, expect, it } from "vitest";
import { railGroupId, SHOWROOM_GROUPS } from "@/lib/collections/showroom";
import { planCategoryRails, type CategoryDoc } from "../categoryRails";

const cat = (slug: string, primaryRail?: string | null, id = `category-${slug}`): CategoryDoc => ({
  _id: id,
  slug: { current: slug },
  primaryRail,
});

const VALID = new Set(SHOWROOM_GROUPS.map((g) => g.id));

describe("planCategoryRails", () => {
  it("leaves a category alone when its rail is already one of the seven families", () => {
    const plan = planCategoryRails([cat("hinges-soft-close", "furniture-fittings")]);
    expect(plan.migrations).toEqual([]);
    expect(plan.unchanged).toBe(1);
  });

  it("gives a canonical category its own family, not the one its legacy rail names", () => {
    // Digital Locks still says door-hardware in Sanity but belongs in Smart & Security.
    const [m] = planCategoryRails([cat("digital-locks", "door-hardware")]).migrations;
    expect(m).toMatchObject({ id: "category-digital-locks", from: "door-hardware", to: "smart-security" });
  });

  it("maps each legacy rail to the family that replaced it", () => {
    const plan = planCategoryRails([
      cat("ceramic-collection", "handles-knobs"),
      cat("shaving-mirrors", "bathroom"),
      cat("kitchen-appliances", "kitchen-wardrobes"),
      cat("bed-fittings", "furniture-hardware"),
      cat("door-knobs", "door-hardware"),
    ]);
    expect(plan.migrations.map((m) => m.to)).toEqual(["wardrobe-furniture", "bathroom-hardware", "kitchen", "furniture-fittings", "door"]);
  });

  it("reports, and does not write, a category the site would put under 'other'", () => {
    const plan = planCategoryRails([cat("mystery", "something-old"), cat("blank", null)]);
    expect(plan.migrations).toEqual([]);
    expect(plan.unresolved.map((u) => u.slug)).toEqual(["mystery", "blank"]);
  });

  it("never changes where the site shows a category: the new rail resolves to the same family as the old", () => {
    const docs = [
      cat("digital-locks", "door-hardware"),
      cat("cabinet-wardrobe-handles", "handles-knobs"),
      cat("bathroom-accessories", "bathroom"),
      cat("kitchen-sinks-faucets", "kitchen-wardrobes"),
      cat("drawer-channels", "furniture-hardware"),
      cat("ladders", "bathroom"),
      cat("lights", "kitchen-wardrobes"),
    ];
    for (const m of planCategoryRails(docs).migrations) {
      expect(VALID.has(m.to), m.slug).toBe(true);
      expect(railGroupId(m.to, m.slug), m.slug).toBe(railGroupId(m.from, m.slug));
    }
  });

  it("patches drafts as well, so an unpublished edit cannot bring the old value back", () => {
    const plan = planCategoryRails([cat("ladders", "bathroom"), cat("ladders", "bathroom", "drafts.category-ladders")]);
    expect(plan.migrations.map((m) => m.id)).toEqual(["category-ladders", "drafts.category-ladders"]);
    expect(plan.mutations).toContainEqual({ patch: { id: "drafts.category-ladders", set: { primaryRail: "bathroom-hardware" } } });
  });

  it("is idempotent: a second pass over migrated data plans nothing", () => {
    const first = planCategoryRails([cat("ladders", "bathroom"), cat("digital-locks", "door-hardware")]);
    const migrated = first.migrations.map((m) => cat(m.slug, m.to, m.id));
    const second = planCategoryRails(migrated);
    expect(second.mutations).toEqual([]);
    expect(second.unchanged).toBe(2);
  });
});
