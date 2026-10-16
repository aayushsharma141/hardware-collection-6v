import { describe, expect, it } from "vitest";
import { SHOWROOM_SOCIAL_FALLBACKS } from "../config";
import type { SiteSettings } from "@/types/catalog";

function resolveSocials(settings?: SiteSettings | null, customLinks?: Array<{ platform: string; url: string }>) {
  if (customLinks && customLinks.length > 0) return customLinks;
  if (settings?.socialLinks && settings.socialLinks.length > 0) return settings.socialLinks;

  const fromFields: Array<{ platform: string; url: string }> = [];
  if (settings?.linkedinUrl) fromFields.push({ platform: "LinkedIn", url: settings.linkedinUrl });
  if (settings?.pinterestUrl) fromFields.push({ platform: "Pinterest", url: settings.pinterestUrl });
  if (settings?.instagramUrl) fromFields.push({ platform: "Instagram", url: settings.instagramUrl });
  if (settings?.facebookUrl) fromFields.push({ platform: "Facebook", url: settings.facebookUrl });

  if (fromFields.length > 0) return fromFields;
  return SHOWROOM_SOCIAL_FALLBACKS;
}

describe("Showroom Social Links", () => {
  it("includes all 4 required platforms in fallback configuration", () => {
    const platforms = SHOWROOM_SOCIAL_FALLBACKS.map((s) => s.platform);
    expect(platforms).toEqual(["LinkedIn", "Pinterest", "Instagram", "Facebook"]);

    expect(SHOWROOM_SOCIAL_FALLBACKS.find((s) => s.platform === "LinkedIn")?.url).toBe(
      "https://www.linkedin.com/in/hardware-collection-96687278"
    );
    expect(SHOWROOM_SOCIAL_FALLBACKS.find((s) => s.platform === "Pinterest")?.url).toBe(
      "https://in.pinterest.com/hardwarecollectionjsr/"
    );
    expect(SHOWROOM_SOCIAL_FALLBACKS.find((s) => s.platform === "Instagram")?.url).toBe(
      "https://instagram.com/hardware.collection"
    );
    expect(SHOWROOM_SOCIAL_FALLBACKS.find((s) => s.platform === "Facebook")?.url).toBe(
      "https://www.facebook.com/hardware-collection/"
    );
  });

  it("resolves social links from Sanity siteSettings fields when provided", () => {
    const cmsSettings: SiteSettings = {
      linkedinUrl: "https://linkedin.com/company/custom",
      pinterestUrl: "https://pinterest.com/custom",
      instagramUrl: "https://instagram.com/custom",
      facebookUrl: "https://facebook.com/custom",
    };

    const resolved = resolveSocials(cmsSettings);
    expect(resolved).toEqual([
      { platform: "LinkedIn", url: "https://linkedin.com/company/custom" },
      { platform: "Pinterest", url: "https://pinterest.com/custom" },
      { platform: "Instagram", url: "https://instagram.com/custom" },
      { platform: "Facebook", url: "https://facebook.com/custom" },
    ]);
  });

  it("prioritizes socialLinks array if provided in Sanity", () => {
    const cmsSettings: SiteSettings = {
      linkedinUrl: "https://linkedin.com/ignored",
      socialLinks: [
        { platform: "Instagram", url: "https://instagram.com/from-array" },
      ],
    };

    const resolved = resolveSocials(cmsSettings);
    expect(resolved).toEqual([
      { platform: "Instagram", url: "https://instagram.com/from-array" },
    ]);
  });

  it("falls back to defaults when settings are empty or null", () => {
    expect(resolveSocials(null)).toEqual(SHOWROOM_SOCIAL_FALLBACKS);
    expect(resolveSocials(undefined)).toEqual(SHOWROOM_SOCIAL_FALLBACKS);
    expect(resolveSocials({})).toEqual(SHOWROOM_SOCIAL_FALLBACKS);
  });
});
