import { describe, expect, it } from "vitest";
import { planOwnerContentRestore, resolveRefs, type Doc, type RestoreInput } from "../ownerContentRestore";

const PILLARS = [{ _key: "leg1", title: "Curated Selection", description: "Premium brands." }];
const img = (id: string) => ({ _type: "image", asset: { _type: "reference", _ref: id } });
const ref = (id: string) => ({ _type: "reference", _ref: id });

const declared = {
  homePage: new Set(["valuePropositions", "materialFinishes", "legacyPillars", "legacyYearsOfTrust", "featuredCategories", "showroomGallery", "heroHeadline"]),
  siteSettings: new Set(["seo", "googleMapsUrl"]),
};

function input(over: Partial<RestoreInput> = {}): RestoreInput {
  return {
    oldDocs: [],
    currentDocs: [{ _id: "homePage", _type: "homePage" }, { _id: "siteSettings", _type: "siteSettings" }],
    existingIds: new Set(["homePage", "siteSettings", "image-ok"]),
    legacyPillars: PILLARS,
    declared,
    ...over,
  };
}

describe("resolveRefs", () => {
  const exists = (id: string) => id.startsWith("ok");

  it("keeps existing references and removes missing ones from an array, reporting them", () => {
    const dropped: string[] = [];
    expect(resolveRefs([ref("ok-1"), ref("gone-1"), ref("ok-2")], exists, dropped)).toEqual([ref("ok-1"), ref("ok-2")]);
    expect(dropped).toEqual(["gone-1"]);
  });

  it("resolves an array whose every reference is missing to undefined, not an empty array", () => {
    expect(resolveRefs([ref("gone")], exists, [])).toBeUndefined();
  });

  it("keeps a text item but removes its image when the asset is missing", () => {
    const dropped: string[] = [];
    const out = resolveRefs([{ _key: "m", name: "SATIN", image: img("gone-asset") }], exists, dropped);
    expect(out).toEqual([{ _key: "m", name: "SATIN" }]);
    expect(dropped).toEqual(["gone-asset"]);
  });

  it("drops a gallery image whose asset is missing and keeps the others", () => {
    expect(resolveRefs([img("ok-a"), img("gone-b")], exists, [])).toEqual([img("ok-a")]);
  });

  it("leaves plain values alone", () => {
    expect(resolveRefs({ label: "Go", n: 3, list: ["a"] }, exists, [])).toEqual({ label: "Go", n: 3, list: ["a"] });
  });
});

describe("planOwnerContentRestore", () => {
  it("creates old documents that do not exist yet, without system fields", () => {
    const plan = planOwnerContentRestore(
      input({ oldDocs: [{ _id: "offer-1", _type: "offer", _rev: "r", _createdAt: "x", _updatedAt: "y", title: "Bulk" }] })
    );
    expect(plan.creates).toEqual([{ id: "offer-1", type: "offer" }]);
    expect(plan.mutations).toEqual([{ createIfNotExists: { _id: "offer-1", _type: "offer", title: "Bulk" } }]);
  });

  it("never touches a document that already exists, or a type outside the list", () => {
    const plan = planOwnerContentRestore(
      input({
        oldDocs: [{ _id: "offer-1", _type: "offer", title: "Bulk" }, { _id: "brand-x", _type: "brand" }, { _id: "drafts.offer-2", _type: "offer" }],
        existingIds: new Set(["homePage", "siteSettings", "offer-1"]),
      })
    );
    expect(plan.creates).toEqual([]);
  });

  it("sets only the fields the current document lacks", () => {
    const plan = planOwnerContentRestore(
      input({
        oldDocs: [{ _id: "homePage", _type: "homePage", heroHeadline: "Old", legacyYearsOfTrust: 10 }],
        currentDocs: [{ _id: "homePage", _type: "homePage", heroHeadline: "New", extra: 1 }, { _id: "siteSettings", _type: "siteSettings" }],
      })
    );
    expect(plan.mutations).toEqual([{ patch: { id: "homePage", setIfMissing: { legacyYearsOfTrust: 10, legacyPillars: [{ _type: "legacyPillar", ...PILLARS[0] }] } } }]);
  });

  it("takes legacyPillars from the repo set, not from the export", () => {
    const plan = planOwnerContentRestore(
      input({ oldDocs: [{ _id: "homePage", _type: "homePage", legacyPillars: [{ _key: "x", title: "Expert Selection" }] }] })
    );
    const patch = plan.mutations.find((m) => "patch" in m) as { patch: { setIfMissing: Record<string, unknown> } };
    expect(patch.patch.setIfMissing.legacyPillars).toEqual([{ _type: "legacyPillar", ...PILLARS[0] }]);
  });

  it("drops dangling references, reports them, and skips a field left with none", () => {
    const plan = planOwnerContentRestore(
      input({
        oldDocs: [
          {
            _id: "homePage",
            _type: "homePage",
            featuredCategories: [ref("category-gone")],
            materialFinishes: [{ _key: "m1", name: "SATIN", image: img("image-ok") }, { _key: "m2", name: "BRASS", image: img("image-gone") }],
          },
        ],
      })
    );
    expect(plan.skipped).toContainEqual({ id: "homePage", field: "featuredCategories", reason: expect.stringContaining("not in the new dataset") });
    expect(plan.dropped.map((d) => d.ref).sort()).toEqual(["category-gone", "image-gone"]);
    const patch = plan.mutations.find((m) => "patch" in m) as { patch: { setIfMissing: Record<string, unknown> } };
    expect(patch.patch.setIfMissing.materialFinishes).toEqual([{ _key: "m1", name: "SATIN", image: img("image-ok") }, { _key: "m2", name: "BRASS" }]);
    expect(patch.patch.setIfMissing).not.toHaveProperty("featuredCategories");
  });

  it("skips a field the schema does not declare", () => {
    const plan = planOwnerContentRestore(
      input({ oldDocs: [{ _id: "homePage", _type: "homePage", ctaHeading: "Ready?" }], declared: { ...declared, homePage: new Set(["legacyPillars"]) } })
    );
    expect(plan.skipped).toContainEqual({ id: "homePage", field: "ctaHeading", reason: "not declared by the schema" });
  });

  it("never restores the logo fields", () => {
    const plan = planOwnerContentRestore(
      input({ oldDocs: [{ _id: "siteSettings", _type: "siteSettings", mainLogo: img("image-ok"), seo: { metaTitle: "T" } }] })
    );
    const patch = plan.mutations.find((m) => "patch" in m && m.patch.id === "siteSettings") as { patch: { setIfMissing: Record<string, unknown> } };
    expect(patch.patch.setIfMissing).toEqual({ seo: { metaTitle: "T" } });
  });

  it("reports differing contact values without writing them", () => {
    const plan = planOwnerContentRestore(
      input({
        oldDocs: [{ _id: "siteSettings", _type: "siteSettings", defaultWhatsappMessage: "Old", address: "A" }],
        currentDocs: [{ _id: "homePage", _type: "homePage" }, { _id: "siteSettings", _type: "siteSettings", defaultWhatsappMessage: "New", address: "A" }],
      })
    );
    expect(plan.decisions).toEqual([{ id: "siteSettings", field: "defaultWhatsappMessage", current: "New", old: "Old" }]);
    expect(plan.mutations.some((m) => "patch" in m && m.patch.id === "siteSettings")).toBe(false);
  });

  it("replaces the Maps link with the owner-pinned old one, and stops once they match", () => {
    const oldDocs: Doc[] = [{ _id: "siteSettings", _type: "siteSettings", googleMapsUrl: "https://maps.app.goo.gl/x" }];
    const plan = planOwnerContentRestore(
      input({ oldDocs, currentDocs: [{ _id: "homePage", _type: "homePage" }, { _id: "siteSettings", _type: "siteSettings", googleMapsUrl: "https://maps/search" }] })
    );
    expect(plan.mutations).toContainEqual({ patch: { id: "siteSettings", set: { googleMapsUrl: "https://maps.app.goo.gl/x" } } });
    expect(plan.decisions).toEqual([]);

    const done = planOwnerContentRestore(
      input({ oldDocs, currentDocs: [{ _id: "homePage", _type: "homePage" }, { _id: "siteSettings", _type: "siteSettings", googleMapsUrl: "https://maps.app.goo.gl/x" }] })
    );
    expect(done.mutations).toEqual([]);
  });

  it("gives each finish its stand-in image by name and keeps the text", () => {
    const plan = planOwnerContentRestore(
      input({
        oldDocs: [{ _id: "homePage", _type: "homePage", materialFinishes: [{ _key: "m1", name: "SATIN", image: img("image-gone") }, { _key: "m2", name: "OTHER", image: img("image-gone") }] }],
        finishImages: { SATIN: "image-new-satin" },
      })
    );
    const patch = plan.mutations.find((m) => "patch" in m && "setIfMissing" in m.patch) as { patch: { setIfMissing: Record<string, unknown> } };
    expect(patch.patch.setIfMissing.materialFinishes).toEqual([{ _key: "m1", name: "SATIN", image: img("image-new-satin") }, { _key: "m2", name: "OTHER" }]);
  });

  it("is idempotent: planning over a restored dataset changes nothing", () => {
    const oldDocs: Doc[] = [{ _id: "offer-1", _type: "offer", title: "Bulk" }, { _id: "homePage", _type: "homePage", legacyYearsOfTrust: 10 }];
    const restored = input({
      oldDocs,
      existingIds: new Set(["homePage", "siteSettings", "offer-1"]),
      currentDocs: [{ _id: "homePage", _type: "homePage", legacyYearsOfTrust: 10, legacyPillars: [{ _type: "legacyPillar", ...PILLARS[0] }] }, { _id: "siteSettings", _type: "siteSettings" }],
    });
    expect(planOwnerContentRestore(restored).mutations).toEqual([]);
  });
});
