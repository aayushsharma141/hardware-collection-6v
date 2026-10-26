import { describe, expect, it } from "vitest";
import { CreateLeadSchema, LEAD_LIMITS } from "../schema";

/** What the consultation form actually sends (ConsultationForm.handleSubmit). */
const formPayload = {
  intent: "enquiry",
  name: "Rahul Sharma",
  phone: "+91 98351 90000",
  location: "Sakchi, Jamshedpur",
  projectType: "Modular Kitchen",
  source: "home",
  pageUrl: "https://www.hardwarecollection.co/collections?utm_source=google#kitchen",
};

describe("lead payload limits", () => {
  it("accepts what the real form sends", () => {
    expect(CreateLeadSchema.safeParse(formPayload).success).toBe(true);
  });

  it("rejects oversized text instead of storing and forwarding it", () => {
    const huge = "x".repeat(LEAD_LIMITS.message + 1);
    expect(CreateLeadSchema.safeParse({ ...formPayload, message: huge }).success).toBe(false);
    expect(CreateLeadSchema.safeParse({ ...formPayload, name: "x".repeat(LEAD_LIMITS.name + 1) }).success).toBe(false);
    expect(CreateLeadSchema.safeParse({ ...formPayload, location: "x".repeat(LEAD_LIMITS.short + 1) }).success).toBe(false);
  });

  it("caps the shortlist size", () => {
    const item = { slug: "s", name: "n", brand: "b" };
    const tooMany = {
      intent: "consultation",
      name: "Rahul Sharma",
      phone: "9835190000",
      source: "shortlist",
      selectedProducts: Array.from({ length: LEAD_LIMITS.selectedProducts + 1 }, () => item),
    };
    expect(CreateLeadSchema.safeParse(tooMany).success).toBe(false);
  });

  it("truncates an over-long page URL rather than losing the lead", () => {
    const longUrl = `https://www.hardwarecollection.co/?q=${"a".repeat(5000)}`;
    const result = CreateLeadSchema.safeParse({ ...formPayload, pageUrl: longUrl });
    expect(result.success).toBe(true);
    expect(result.success && result.data.pageUrl?.length).toBe(LEAD_LIMITS.pageUrl);
  });
});
