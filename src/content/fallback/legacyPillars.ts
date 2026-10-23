/**
 * The "Why Hardware Collection" pillars shown under the About story.
 *
 * Editors change them in Studio (Home Page > Legacy Pillars). This set is what
 * the site shows while that field is empty, and is the same wording that was
 * copied into Studio by `scripts/cms/seed-legacy-pillars.ts`, so the page reads
 * the same either way.
 */
export interface LegacyPillar {
  _key: string;
  title: string;
  description: string;
}

export const LEGACY_PILLARS: readonly LegacyPillar[] = [
  { _key: "leg1", title: "Curated Selection", description: "Premium brands, handpicked for modern spaces." },
  { _key: "leg2", title: "Expert Guidance", description: "Personalized advice for homes and projects." },
  { _key: "leg3", title: "Physical Showroom", description: "Experience and compare before you decide." },
];
