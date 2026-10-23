import { LEGACY_PILLARS } from "@/content/fallback/legacyPillars";

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
