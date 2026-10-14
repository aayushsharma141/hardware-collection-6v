import { describe, expect, it } from "vitest";
import { planSettingsDraft, type SettingsDoc } from "../settingsDraft";

const published: SettingsDoc = {
  _id: "siteSettings",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Hardware+Collection+Jamshedpur",
  openingHours: "Wed–Mon: 10:00 AM – 8:00 PM\nTuesday: 10:00 AM – 2:00 PM",
  seo: { metaTitle: "Hardware Collection | Premium Architectural Hardware", metaDescription: "Same description" },
};

const draft: SettingsDoc = {
  _id: "drafts.siteSettings",
  googleMapsUrl: "https://maps.app.goo.gl/6qokJfpuQgfNwqZK9",
  openingHours: "Mon - Sat: 10:30 AM - 8:30 PM\nTuesday: Closed",
  seo: { metaTitle: "Hardware Collection | Premium Architectural Hardware in Jamshedpur", metaDescription: "Same description" },
};

describe("planSettingsDraft", () => {
  it("copies the Maps link and the SEO title, and deletes the draft", () => {
    const plan = planSettingsDraft(published, draft);
    expect(plan.set).toEqual({
      googleMapsUrl: "https://maps.app.goo.gl/6qokJfpuQgfNwqZK9",
      "seo.metaTitle": "Hardware Collection | Premium Architectural Hardware in Jamshedpur",
    });
    expect(plan.deleteDraft).toBe(true);
    expect(plan.changes).toHaveLength(2);
  });

  it("never copies the draft's opening hours, which the owner said are wrong", () => {
    expect(Object.keys(planSettingsDraft(published, draft).set)).not.toContain("openingHours");
  });

  it("only touches the two named values, so the rest of the published document is safe", () => {
    expect(Object.keys(planSettingsDraft(published, draft).set).sort()).toEqual(["googleMapsUrl", "seo.metaTitle"]);
  });

  it("does not copy a value that is already the same", () => {
    const same = { ...draft, googleMapsUrl: published.googleMapsUrl };
    expect(Object.keys(planSettingsDraft(published, same).set)).toEqual(["seo.metaTitle"]);
  });

  it("does not blank a published value with an empty draft value", () => {
    const empty: SettingsDoc = { ...draft, googleMapsUrl: "  ", seo: { metaTitle: null } };
    const plan = planSettingsDraft(published, empty);
    expect(plan.set).toEqual({});
    expect(plan.deleteDraft).toBe(true);
  });

  it("does nothing when there is no draft, so a re-run is a no-op", () => {
    expect(planSettingsDraft(published, null)).toEqual({ set: {}, changes: [], deleteDraft: false });
  });

  it("copies nothing and deletes nothing when the published document is missing", () => {
    const plan = planSettingsDraft(null, draft);
    expect(plan.set).toEqual({});
    expect(plan.changes).toEqual([]);
    expect(plan.deleteDraft).toBe(false);
  });
});
