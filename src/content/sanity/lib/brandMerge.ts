/**
 * Planning for merging a duplicate Sanity brand into the one that survives.
 * Pure: it takes documents and returns the mutations and a readable summary, so
 * the rules can be tested without a Sanity project. `scripts/cms/merge-duplicate-brands.ts`
 * fetches, prints and (only with --apply) commits.
 *
 * The order is what makes it safe. Every reference to the duplicate is moved
 * to the survivor first, then the duplicate is deleted, all in one transaction,
 * so there is never a moment where something points at a missing brand.
 */

export type Doc = { _id: string; _type?: string; [field: string]: unknown };

export type Mutation =
  | { patch: { id: string; set?: Record<string, unknown>; unset?: string[] } }
  | { delete: { id: string } };

export interface RefHit {
  path: string;
  /** `set` points the reference at the survivor; `unset` drops a member the list already has. */
  action: "set" | "unset";
}

const isRef = (value: unknown, id: string): boolean =>
  typeof value === "object" && value !== null && (value as { _ref?: unknown })._ref === id;

/**
 * Every reference to `dropId` inside a document, as a Sanity patch path.
 * Array members are addressed by `_key`, so a path stays valid however the
 * array is ordered. A member whose list already holds `keepId` is removed
 * rather than repointed, which would leave the survivor listed twice.
 */
export function findReferences(doc: Doc, dropId: string, keepId: string): RefHit[] {
  const hits: RefHit[] = [];

  const walk = (value: unknown, path: string): void => {
    if (Array.isArray(value)) {
      const listHasKeep = value.some((member) => isRef(member, keepId));
      value.forEach((member, index) => {
        const key = (member as { _key?: unknown } | null)?._key;
        const here = `${path}${typeof key === "string" ? `[_key=="${key}"]` : `[${index}]`}`;
        if (isRef(member, dropId)) {
          hits.push(listHasKeep ? { path: here, action: "unset" } : { path: `${here}._ref`, action: "set" });
        } else {
          walk(member, here);
        }
      });
      return;
    }
    if (typeof value !== "object" || value === null) return;
    if (isRef(value, dropId)) {
      hits.push({ path: `${path}._ref`, action: "set" });
      return;
    }
    for (const [name, child] of Object.entries(value)) {
      if (name.startsWith("_")) continue;
      walk(child, path ? `${path}.${name}` : name);
    }
  };

  for (const [name, child] of Object.entries(doc)) {
    if (!name.startsWith("_")) walk(child, name);
  }
  return hits;
}

const isEmpty = (value: unknown): boolean =>
  value == null ||
  value === "" ||
  (Array.isArray(value) && value.length === 0) ||
  (typeof value === "object" && !Array.isArray(value) && !("_ref" in value) && !("asset" in value) && Object.keys(value).filter((k) => !k.startsWith("_")).length === 0);

export interface MergeInput {
  /** The brand that survives, and its draft if it has one. */
  keep: Doc | null;
  keepDraft: Doc | null;
  /** The duplicate, and its draft if it has one. */
  drop: Doc | null;
  dropDraft: Doc | null;
  /** Every document (drafts included) that references the duplicate. */
  referrers: Doc[];
  /** The slug the survivor should end up with. */
  targetSlug: string;
  /** Slugs of every other brand, to catch a collision. */
  otherSlugs: string[];
  /**
   * Fields where the duplicate's value replaces the survivor's even though the
   * survivor has one, for when the duplicate holds the better content. Any
   * other field the survivor already has stays as it is.
   */
  preferDrop?: string[];
}

export interface MergePlan {
  problems: string[];
  /** Human-readable account of what applying would do. */
  steps: string[];
  mutations: Mutation[];
  alreadyDone: boolean;
}

const slugOf = (doc: Doc | null): string | undefined => (doc?.slug as { current?: string } | undefined)?.current;

export function planMerge(input: MergeInput): MergePlan {
  const { keep, keepDraft, drop, dropDraft, referrers, targetSlug, otherSlugs, preferDrop = [] } = input;
  const plan: MergePlan = { problems: [], steps: [], mutations: [], alreadyDone: false };

  if (!keep) {
    plan.problems.push("The survivor brand does not exist, so there is nothing to merge into.");
    return plan;
  }

  if (otherSlugs.includes(targetSlug)) {
    plan.problems.push(`The slug "${targetSlug}" is already used by another brand; refusing to create a collision.`);
    return plan;
  }

  const slugChange = slugOf(keep) !== targetSlug;

  if (!drop) {
    if (!slugChange && !dropDraft) {
      plan.alreadyDone = true;
      plan.steps.push(`Nothing to do: ${keep._id} already has slug "${targetSlug}" and the duplicate is gone.`);
      return plan;
    }
    plan.problems.push("The duplicate brand does not exist, but the survivor's slug is still wrong. Check the ids before continuing.");
    return plan;
  }

  const set: Record<string, unknown> = {};
  for (const [field, value] of Object.entries(drop)) {
    if (field.startsWith("_") || field === "slug") continue;
    if (isEmpty(value)) continue;
    if (isEmpty(keep[field])) {
      set[field] = value;
      plan.steps.push(`Copy "${field}" from ${drop._id} to ${keep._id}: ${JSON.stringify(value)}`);
    } else if (preferDrop.includes(field) && JSON.stringify(keep[field]) !== JSON.stringify(value)) {
      set[field] = value;
      plan.steps.push(`Replace "${field}" on ${keep._id}: ${JSON.stringify(keep[field])} -> ${JSON.stringify(value)} (taken from ${drop._id})`);
    } else if (JSON.stringify(keep[field]) !== JSON.stringify(value)) {
      plan.steps.push(`Field "${field}" differs; ${keep._id} keeps its own value.`);
    }
  }
  if (slugChange) {
    set.slug = { _type: "slug", current: targetSlug };
    plan.steps.push(`Change slug of ${keep._id}: "${slugOf(keep) ?? "(none)"}" -> "${targetSlug}"`);
  }

  // The survivor's draft would otherwise overwrite these on its next publish.
  for (const doc of [keep, keepDraft]) {
    if (doc && Object.keys(set).length > 0) plan.mutations.push({ patch: { id: doc._id, set } });
  }
  if (keepDraft) plan.steps.push(`${keepDraft._id} has an unpublished draft; the same changes are applied to it.`);

  for (const referrer of referrers) {
    if (referrer._id === drop._id || referrer._id === dropDraft?._id) continue;
    const hits = findReferences(referrer, drop._id, keep._id);
    if (hits.length === 0) continue;
    const setPaths = Object.fromEntries(hits.filter((h) => h.action === "set").map((h) => [h.path, keep._id]));
    const unsetPaths = hits.filter((h) => h.action === "unset").map((h) => h.path);
    plan.mutations.push({
      patch: { id: referrer._id, ...(Object.keys(setPaths).length ? { set: setPaths } : {}), ...(unsetPaths.length ? { unset: unsetPaths } : {}) },
    });
    for (const hit of hits) {
      plan.steps.push(
        hit.action === "set"
          ? `Repoint ${referrer._type ?? "document"} ${referrer._id}: ${hit.path} -> ${keep._id}`
          : `Remove duplicate entry from ${referrer._type ?? "document"} ${referrer._id}: ${hit.path} (already lists ${keep._id})`
      );
    }
  }

  plan.mutations.push({ delete: { id: drop._id } });
  plan.steps.push(`Delete ${drop._id}`);
  if (dropDraft) {
    plan.mutations.push({ delete: { id: dropDraft._id } });
    plan.steps.push(`Delete ${dropDraft._id} (its unpublished draft)`);
  }
  return plan;
}
