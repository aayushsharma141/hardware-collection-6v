import { OTHER_GROUP, railGroupId } from "@/lib/collections/showroom";

/**
 * Planning for rewriting each category's `primaryRail` to one of the seven
 * showroom families. Pure, so it can be tested without a Sanity project;
 * `scripts/cms/migrate-category-rails.ts` fetches, prints and (only with
 * --apply) commits.
 *
 * Every category was written with one of the five rails used before
 * 2026-10-06 (`door-hardware`, `handles-knobs`...). The site never minded: it
 * resolves them through `railGroupId`, but Studio checks the value against the
 * seven allowed ones and shows an error on every category. The new value is
 * exactly what `railGroupId` returns for the old one, so no category moves.
 */

export interface CategoryDoc {
  _id: string;
  slug?: { current?: string } | null;
  primaryRail?: string | null;
}

export interface RailMigration {
  id: string;
  slug: string;
  from: string | null;
  to: string;
}

export interface RailPlan {
  migrations: RailMigration[];
  /** Already one of the seven families. */
  unchanged: number;
  /** The site would show these under "More Hardware"; there is no family to write, so a person must choose. */
  unresolved: { id: string; slug: string; from: string | null }[];
  mutations: { patch: { id: string; set: { primaryRail: string } } }[];
}

export function planCategoryRails(categories: readonly CategoryDoc[]): RailPlan {
  const plan: RailPlan = { migrations: [], unchanged: 0, unresolved: [], mutations: [] };

  for (const doc of categories) {
    const slug = doc.slug?.current ?? "";
    const from = doc.primaryRail || null;
    const to = railGroupId(from, slug);

    if (to === OTHER_GROUP.id) {
      plan.unresolved.push({ id: doc._id, slug, from });
    } else if (to === from) {
      plan.unchanged += 1;
    } else {
      plan.migrations.push({ id: doc._id, slug, from, to });
      plan.mutations.push({ patch: { id: doc._id, set: { primaryRail: to } } });
    }
  }
  return plan;
}
