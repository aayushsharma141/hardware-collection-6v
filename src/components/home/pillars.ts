export interface LegacyPillar {
  _key: string;
  title: string;
  description: string;
}

/**
 * Shown while Studio's Home Page > Legacy Pillars is empty or unreachable. The
 * same wording was copied into Studio by `scripts/cms/seed-legacy-pillars.ts`,
 * so the page reads the same either way. Edit the wording in Studio, not here.
 */
export const LEGACY_PILLARS: readonly LegacyPillar[] = [
  { _key: "leg1", title: "Curated Selection", description: "Premium brands, handpicked for modern spaces." },
  { _key: "leg2", title: "Expert Guidance", description: "Personalized advice for homes and projects." },
  { _key: "leg3", title: "Physical Showroom", description: "Experience and compare before you decide." },
];

export interface StudioPillar {
  _key?: string;
  title?: string;
  description?: string;
}

export interface ResolvedPillar {
  key: string;
  title: string;
  description: string;
}

/** The Studio field allows at most four; more would overflow the row. */
export const MAX_PILLARS = 4;

/**
 * The pillars to show: Studio's, minus any still being written (no title),
 * capped at four; the built-in three when Studio has none.
 */
export function resolvePillars(studio?: StudioPillar[] | null): ResolvedPillar[] {
  const authored = (studio ?? [])
    .filter((pillar) => pillar.title?.trim())
    .slice(0, MAX_PILLARS)
    .map((pillar, index) => ({
      key: pillar._key ?? `pillar-${index}`,
      title: pillar.title!.trim(),
      description: pillar.description?.trim() ?? "",
    }));
  if (authored.length > 0) return authored;
  return LEGACY_PILLARS.map((pillar) => ({ key: pillar._key, title: pillar.title, description: pillar.description }));
}

/** Column layout from the sm breakpoint up: the row fills evenly whatever the count. */
export function pillarGridClass(count: number): string {
  if (count >= 4) return "sm:grid-cols-2 lg:grid-cols-4";
  if (count === 3) return "sm:grid-cols-3";
  if (count === 2) return "sm:grid-cols-2";
  return "sm:grid-cols-1";
}
