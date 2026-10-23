import { describe, expect, it } from "vitest";
import { planNavigationPaths, type NavDoc } from "../navigationPaths";

const nav = (extra: Partial<NavDoc> = {}, id = "navigation"): NavDoc => ({ _id: id, _type: "navigation", ...extra });

describe("planNavigationPaths", () => {
  it("repoints /catalogs and the Catalogs label, addressed by _key", () => {
    const plan = planNavigationPaths([
      nav({ mainMenu: [{ _key: "a", label: "Collections", path: "/collections" }, { _key: "b", label: "Brands & Catalogs", path: "/catalogs" }] }),
    ]);
    expect(plan.mutations).toEqual([
      { patch: { id: "navigation", set: { 'mainMenu[_key=="b"].path': "/catalogues", 'mainMenu[_key=="b"].label': "Brands & Catalogues" } } },
    ]);
    expect(plan.changes).toHaveLength(1);
  });

  it("keeps a nested path suffix and covers footer links and the draft", () => {
    const plan = planNavigationPaths([
      nav({ footerLegalLinks: [{ _key: "f", label: "Legal", path: "/catalogs/terms" }] }),
      nav({ mainMenu: [{ _key: "b", label: "catalogs", path: "/catalogs" }] }, "drafts.navigation"),
    ]);
    expect(plan.mutations.map((m) => m.patch.id)).toEqual(["navigation", "drafts.navigation"]);
    expect(plan.mutations[0].patch.set['footerLegalLinks[_key=="f"].path']).toBe("/catalogues/terms");
    expect(plan.mutations[1].patch.set['mainMenu[_key=="b"].label']).toBe("catalogues");
  });

  it("leaves correct links, other types and lookalike paths alone", () => {
    const plan = planNavigationPaths([
      nav({ mainMenu: [{ _key: "a", label: "Brands & Catalogues", path: "/catalogues" }, { _key: "c", label: "Cat", path: "/catalogs-old" }] }),
      { _id: "x", _type: "siteSettings" },
    ]);
    expect(plan.mutations).toEqual([]);
  });

  it("reports a link with no _key instead of guessing", () => {
    const plan = planNavigationPaths([nav({ mainMenu: [{ label: "Catalogs", path: "/catalogs" }] })]);
    expect(plan.mutations).toEqual([]);
    expect(plan.unaddressable).toEqual([{ id: "navigation", field: "mainMenu", label: "Catalogs" }]);
  });

  it("is idempotent: planning cleaned data yields nothing", () => {
    expect(planNavigationPaths([nav({ mainMenu: [{ _key: "b", label: "Brands & Catalogues", path: "/catalogues" }] })]).mutations).toEqual([]);
  });
});
