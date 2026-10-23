/**
 * Planning for writing the Home Page "Legacy Pillars" in Studio. Pure, so it
 * can be tested without a Sanity project; `scripts/cms/seed-legacy-pillars.ts`
 * fetches, prints and (only with --apply) commits.
 *
 * The site's About section reads this field. Studio held a different pair of
 * pillars than the three the page used to hardcode, so the field is set to the
 * page's wording (src/content/fallback/legacyPillars.ts) and the page then reads
 * it without any visible change. Drafts are patched too.
 */

export interface PillarValue {
  _key: string;
  title: string;
  description: string;
}

export type HomeDoc = { _id: string; _type: string; legacyPillars?: { _key?: string; _type?: string; title?: string; description?: string }[] };

export interface PillarPlan {
  mutations: { patch: { id: string; set: { legacyPillars: (PillarValue & { _type: "legacyPillar" })[] } } }[];
  /** Per document: what is there now, so the dry run can show what is replaced. */
  before: { id: string; pillars: { title?: string; description?: string }[] }[];
}

const same = (current: HomeDoc["legacyPillars"], desired: readonly PillarValue[]) =>
  (current?.length ?? 0) === desired.length &&
  desired.every((d, i) => current?.[i]?._key === d._key && current?.[i]?.title === d.title && current?.[i]?.description === d.description);

export function planLegacyPillars(docs: readonly HomeDoc[], desired: readonly PillarValue[]): PillarPlan {
  const plan: PillarPlan = { mutations: [], before: [] };
  for (const doc of docs) {
    if (doc._type !== "homePage" || same(doc.legacyPillars, desired)) continue;
    plan.before.push({ id: doc._id, pillars: (doc.legacyPillars ?? []).map(({ title, description }) => ({ title, description })) });
    plan.mutations.push({
      patch: { id: doc._id, set: { legacyPillars: desired.map((d) => ({ _type: "legacyPillar" as const, ...d })) } },
    });
  }
  return plan;
}
