/**
 * Planning for removing fields that are stored in Sanity but declared by no
 * schema. Pure, so it can be tested without a Sanity project;
 * `scripts/cms/remove-leftover-fields.ts` fetches, prints and (only with
 * --apply) commits.
 *
 * Studio shows "Unknown field found" on every document that carries one, and an
 * editor cannot clear it from the form. The fields come from earlier
 * migrations and seeds (`brand.brandName`, `brand.catalogType`,
 * `category.status`, `homePage.heroSlides`). Only fields named in the spec are
 * touched, per document type; nothing is removed by pattern.
 */

export type AnyDoc = { _id: string; _type: string; [field: string]: unknown };

/** Document type -> the fields to remove from it. */
export type LeftoverSpec = Record<string, string[]>;

export interface LeftoverPlan {
  mutations: { patch: { id: string; unset: string[] } }[];
  /** How many documents lose each `type.field`. */
  counts: Record<string, number>;
  /** Every value removed, so a dry run can show what would be lost. */
  removed: { id: string; type: string; field: string; value: unknown }[];
  /** `brandName` values that are not the brand's `name`: removing them loses a value, not a duplicate. */
  differing: { id: string; field: string; value: unknown; name: unknown }[];
}

export function planLeftoverFields(docs: readonly AnyDoc[], spec: LeftoverSpec): LeftoverPlan {
  const plan: LeftoverPlan = { mutations: [], counts: {}, removed: [], differing: [] };

  for (const doc of docs) {
    const fields = (spec[doc._type] ?? []).filter((field) => doc[field] !== undefined);
    if (fields.length === 0) continue;

    plan.mutations.push({ patch: { id: doc._id, unset: fields } });
    for (const field of fields) {
      const key = `${doc._type}.${field}`;
      plan.counts[key] = (plan.counts[key] ?? 0) + 1;
      plan.removed.push({ id: doc._id, type: doc._type, field, value: doc[field] });
      if (doc._type === "brand" && field === "brandName" && doc[field] !== doc.name) {
        plan.differing.push({ id: doc._id, field, value: doc[field], name: doc.name });
      }
    }
  }
  return plan;
}
