import { describe, expect, it } from "vitest";
import { findReferences, planMerge, type Doc } from "../brandMerge";

const ref = (id: string, key = `k-${id}`) => ({ _key: key, _type: "reference", _ref: id });

describe("findReferences", () => {
  it("finds a plain reference field", () => {
    const refs = findReferences({ _id: "p1", brand: ref("drop") }, "drop", "keep");
    expect(refs).toEqual([{ path: "brand._ref", action: "set" }]);
  });

  it("addresses array members by _key, so reordering cannot misdirect the patch", () => {
    const doc = { _id: "c1", brands: [ref("a", "k1"), ref("drop", "k2")] };
    expect(findReferences(doc, "drop", "keep")).toEqual([{ path: 'brands[_key=="k2"]._ref', action: "set" }]);
  });

  it("falls back to the index when an array member has no _key", () => {
    const doc = { _id: "c1", brands: [{ _type: "reference", _ref: "a" }, { _type: "reference", _ref: "drop" }] };
    expect(findReferences(doc, "drop", "keep")).toEqual([{ path: "brands[1]._ref", action: "set" }]);
  });

  it("removes the member instead of pointing it at the survivor when the list already holds the survivor", () => {
    const doc = { _id: "c1", brands: [ref("keep", "k1"), ref("drop", "k2")] };
    expect(findReferences(doc, "drop", "keep")).toEqual([{ path: 'brands[_key=="k2"]', action: "unset" }]);
  });

  it("finds references nested in object arrays, such as hero slides", () => {
    const doc = { _id: "hm", homeHero: [{ _key: "s1", slideType: "brand", brand: ref("drop") }] };
    expect(findReferences(doc, "drop", "keep")).toEqual([{ path: 'homeHero[_key=="s1"].brand._ref', action: "set" }]);
  });

  it("ignores references to other documents", () => {
    expect(findReferences({ _id: "p1", brand: ref("other") }, "drop", "keep")).toEqual([]);
  });
});

const keepDoc = (extra: Record<string, unknown> = {}): Doc => ({
  _id: "brand-decore",
  _type: "brand",
  name: "Decor Bath",
  slug: { _type: "slug", current: "decore" },
  logo: { _type: "image" },
  ...extra,
});
const dropDoc = (extra: Record<string, unknown> = {}): Doc => ({
  _id: "brand-decor-bath",
  _type: "brand",
  name: "Decor Bath",
  slug: { _type: "slug", current: "decor-bath" },
  country: "India",
  ...extra,
});

const base = {
  keep: keepDoc(),
  drop: dropDoc(),
  keepDraft: null,
  dropDraft: null,
  referrers: [] as Doc[],
  targetSlug: "decor-bath",
  otherSlugs: ["blum", "hafele"],
};

describe("planMerge", () => {
  it("copies a field the survivor lacks, sets the target slug and deletes the duplicate", () => {
    const plan = planMerge(base);
    expect(plan.problems).toEqual([]);
    expect(plan.mutations).toContainEqual({
      patch: { id: "brand-decore", set: { country: "India", slug: { _type: "slug", current: "decor-bath" } } },
    });
    expect(plan.mutations).toContainEqual({ delete: { id: "brand-decor-bath" } });
  });

  it("never overwrites a field the survivor already has", () => {
    const plan = planMerge({ ...base, keep: keepDoc({ country: "Italy" }) });
    const patch = plan.mutations.find((m) => "patch" in m && m.patch.id === "brand-decore");
    expect(JSON.stringify(patch)).not.toContain("India");
    expect(plan.steps.some((s) => s.includes("country") && s.includes("keeps"))).toBe(true);
  });

  it("takes the duplicate's value for a field named in preferDrop, even when the survivor has one", () => {
    const plan = planMerge({
      ...base,
      keep: keepDoc({ description: "Premium Finishes", brandPositioning: "Premium Finishes" }),
      drop: dropDoc({ description: "Bathroom hardware and fittings.", brandPositioning: "Premium Bath Hardware" }),
      preferDrop: ["description", "brandPositioning"],
    });
    const patch = plan.mutations.find((m) => "patch" in m && m.patch.id === "brand-decore");
    expect(patch).toMatchObject({ patch: { set: { description: "Bathroom hardware and fittings.", brandPositioning: "Premium Bath Hardware" } } });
  });

  it("leaves other differing fields with the survivor when preferDrop is set", () => {
    const plan = planMerge({
      ...base,
      keep: keepDoc({ description: "Keep me", featured: false }),
      drop: dropDoc({ description: "Take me", featured: true }),
      preferDrop: ["description"],
    });
    const patch = JSON.stringify(plan.mutations);
    expect(patch).toContain("Take me");
    expect(patch).not.toContain('"featured"');
  });

  it("does not copy the duplicate's slug or system fields", () => {
    const plan = planMerge({ ...base, targetSlug: "decore" });
    const patch = JSON.stringify(plan.mutations);
    expect(patch).not.toContain('"_rev"');
    expect(patch).not.toContain('"current":"decor-bath"');
  });

  it("re-points every referrer before the duplicate is deleted", () => {
    const plan = planMerge({
      ...base,
      referrers: [{ _id: "cat1", _type: "catalogue", brand: ref("brand-decor-bath") }, { _id: "drafts.p1", _type: "product", brand: ref("brand-decor-bath") }],
    });
    const idx = (pred: (m: (typeof plan.mutations)[number]) => boolean) => plan.mutations.findIndex(pred);
    const del = idx((m) => "delete" in m && m.delete.id === "brand-decor-bath");
    expect(idx((m) => "patch" in m && m.patch.id === "cat1")).toBeGreaterThanOrEqual(0);
    expect(idx((m) => "patch" in m && m.patch.id === "cat1")).toBeLessThan(del);
    expect(idx((m) => "patch" in m && m.patch.id === "drafts.p1")).toBeLessThan(del);
    expect(plan.mutations).toContainEqual({ patch: { id: "cat1", set: { "brand._ref": "brand-decore" } } });
  });

  it("deletes the duplicate's draft too, and patches the survivor's draft so it cannot revert the merge", () => {
    const plan = planMerge({ ...base, keepDraft: { ...keepDoc(), _id: "drafts.brand-decore" }, dropDraft: { ...dropDoc(), _id: "drafts.brand-decor-bath" } });
    expect(plan.mutations).toContainEqual({ delete: { id: "drafts.brand-decor-bath" } });
    expect(plan.mutations.some((m) => "patch" in m && m.patch.id === "drafts.brand-decore")).toBe(true);
  });

  it("refuses when another brand already uses the target slug", () => {
    const plan = planMerge({ ...base, otherSlugs: ["decor-bath"] });
    expect(plan.problems[0]).toMatch(/decor-bath.*already used/);
  });

  it("refuses when the survivor or the duplicate is missing", () => {
    expect(planMerge({ ...base, drop: null }).problems[0]).toMatch(/duplicate/i);
    expect(planMerge({ ...base, keep: null }).problems[0]).toMatch(/survivor/i);
  });

  it("is idempotent: nothing left to do once the duplicate is gone and the slug is right", () => {
    const plan = planMerge({ ...base, drop: null, keep: keepDoc({ slug: { _type: "slug", current: "decor-bath" } }) });
    expect(plan.problems).toEqual([]);
    expect(plan.mutations).toEqual([]);
    expect(plan.alreadyDone).toBe(true);
  });
});
