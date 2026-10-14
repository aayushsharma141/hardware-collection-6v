import { describe, expect, it } from "vitest";
import { planLeftoverFields, type AnyDoc } from "../leftoverFields";

const SPEC = { brand: ["brandName", "catalogType"], category: ["status"], homePage: ["heroSlides"] };

const brand = (id: string, extra: Record<string, unknown> = {}): AnyDoc => ({ _id: id, _type: "brand", name: "Blum", ...extra });

describe("planLeftoverFields", () => {
  it("unsets only the listed fields that are present", () => {
    const plan = planLeftoverFields([brand("b1", { brandName: "Blum", catalogType: "upload", logo: { asset: {} } })], SPEC);
    expect(plan.mutations).toEqual([{ patch: { id: "b1", unset: ["brandName", "catalogType"] } }]);
  });

  it("leaves a document alone when none of the fields are present", () => {
    expect(planLeftoverFields([brand("b1")], SPEC).mutations).toEqual([]);
  });

  it("never touches a field outside the list, or a field with the same name on another type", () => {
    const plan = planLeftoverFields(
      [{ _id: "c1", _type: "category", name: "X", status: "draft", brandName: "keep me", catalogType: "keep me too" }],
      SPEC
    );
    expect(plan.mutations).toEqual([{ patch: { id: "c1", unset: ["status"] } }]);
  });

  it("covers drafts, so an unpublished copy cannot bring the field back", () => {
    const plan = planLeftoverFields([brand("b1", { brandName: "Blum" }), brand("drafts.b1", { brandName: "Blum" })], SPEC);
    expect(plan.mutations.map((m) => m.patch.id)).toEqual(["b1", "drafts.b1"]);
  });

  it("counts what it removes, per field", () => {
    const plan = planLeftoverFields(
      [brand("b1", { brandName: "A", catalogType: "upload" }), brand("b2", { brandName: "B" }), { _id: "c1", _type: "category", status: "x" }],
      SPEC
    );
    expect(plan.counts).toEqual({ "brand.brandName": 2, "brand.catalogType": 1, "category.status": 1 });
  });

  it("flags a brandName that differs from name, since that would lose a value rather than a duplicate", () => {
    const plan = planLeftoverFields([brand("b1", { brandName: "Blum" }), brand("b2", { brandName: "Blüm Austria" })], SPEC);
    expect(plan.differing).toEqual([{ id: "b2", field: "brandName", value: "Blüm Austria", name: "Blum" }]);
  });

  it("is idempotent: a second pass over cleaned data plans nothing", () => {
    expect(planLeftoverFields([brand("b1"), { _id: "homePage", _type: "homePage" }], SPEC).mutations).toEqual([]);
  });

  it("records the value of every non-trivial field it removes, so the dry run can show it", () => {
    const slides = [{ _key: "s1", title: "Craft", description: "Old hero" }];
    const plan = planLeftoverFields([{ _id: "homePage", _type: "homePage", heroSlides: slides }], SPEC);
    expect(plan.removed).toContainEqual({ id: "homePage", type: "homePage", field: "heroSlides", value: slides });
  });
});
