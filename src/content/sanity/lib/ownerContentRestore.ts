/**
 * Planning for restoring owner-edited content from a documents export of the old
 * Sanity project (gfwqxrd2, 2026-10-23) into the new one (hoghkg00), which was
 * re-seeded from the repo's fallback and so lacks it. Pure, so it can be tested
 * without a Sanity project; `scripts/cms/restore-owner-content.ts` fetches, prints
 * and (only with --apply) commits.
 *
 * Rules, all aimed at never overwriting what is already there:
 *  - Types in CREATE_TYPES are created only when no document with that _id exists.
 *  - For the singletons in SET_FIELDS, a field is written only when the current
 *    document does not have it (`setIfMissing`). `legacyPillars` is written from the
 *    repo's built-in set, not the export, because the export predates the 2026-10-24
 *    decision to keep the site's three pillars.
 *  - Fields in COMPARE_ONLY that exist on both sides with different values are never
 *    written; they are listed so the owner can choose.
 *  - References are kept only where the target exists in the new dataset. A dangling
 *    reference is dropped (an item) or the key removed (an image on a text item), and
 *    reported, never written.
 *  - `mainLogo` / `mainLogoInverse` are never restored (the owner decided the logo is
 *    not editable).
 */

export type Doc = { _id: string; _type: string; [field: string]: unknown };

export const CREATE_TYPES: readonly string[] = ["legalPage", "offer", "space"];

/** Singleton fields that are restored when missing. */
export const SET_FIELDS: Record<string, string[]> = {
  homePage: [
    "heroHeadline",
    "primaryCta",
    "secondaryCta",
    "ctaHeading",
    "ctaDescription",
    "valuePropositions",
    "materialFinishes",
    "legacyPillars",
    "legacyYearsOfTrust",
    "legacyBrandsCount",
    "legacyShowroomImage",
    "showroomGallery",
    "featuredCategories",
    "featuredProducts",
    "trustedBrands",
    "testimonials",
  ],
  siteSettings: ["seo"],
};

/** Fields present on both sides whose differing values are reported, not written. */
export const COMPARE_ONLY: Record<string, string[]> = {
  siteSettings: [
    "phone",
    "secondaryPhone",
    "whatsapp",
    "email",
    "googleMapsEmbedUrl",
    "defaultWhatsappMessage",
    "address",
    "openingHours",
    "businessName",
    "ownerName",
    "linkedinUrl",
    "pinterestUrl",
    "instagramUrl",
    "facebookUrl",
  ],
};

/**
 * Fields where the owner chose the old project's value: written (`set`) when the current
 * value differs. googleMapsUrl is the owner-pinned short link (approved 2026-10-14); the
 * re-seeded project holds a generic search link instead.
 */
export const ADOPT_OLD: Record<string, string[]> = {
  siteSettings: ["googleMapsUrl"],
};

/**
 * Repo image stand-ins for the finishes, by finish name: the old assets are gone with the
 * old project (its CDN returns 402). The script uploads these and passes their asset ids.
 */
export const FINISH_IMAGE_FILES: Record<string, string> = {
  SATIN: "HC-04-SATIN.png",
  BRASS: "HC-04-PVD-BRASS.png",
  "MATTE BLACK": "HC-04-MATTE.png",
  CHROME: "HC-04-BRUSHED.png",
  BRONZE: "HC-04-DARK-METAL.png",
};

export const NEVER_RESTORE: readonly string[] = ["mainLogo", "mainLogoInverse"];

export interface PillarValue {
  _key: string;
  title: string;
  description: string;
}

export interface RestoreInput {
  oldDocs: readonly Doc[];
  /** Current documents of the singleton types (homePage, siteSettings). */
  currentDocs: readonly Doc[];
  /** Every _id in the new dataset, documents and assets. */
  existingIds: ReadonlySet<string>;
  legacyPillars: readonly PillarValue[];
  /** Fields each type's registered schema declares; anything else is skipped. */
  declared: Readonly<Record<string, ReadonlySet<string>>>;
  /** Asset id per finish name; replaces the old (unrecoverable) finish image. */
  finishImages?: Readonly<Record<string, string>>;
}

export type Mutation =
  | { createIfNotExists: Doc }
  | { patch: { id: string; setIfMissing: Record<string, unknown> } }
  | { patch: { id: string; set: Record<string, unknown> } };

export interface RestorePlan {
  mutations: Mutation[];
  creates: { id: string; type: string }[];
  sets: { id: string; field: string }[];
  /** Differing values on both sides: not written. */
  decisions: { id: string; field: string; current: unknown; old: unknown }[];
  /** References or images removed because their target is not in the new dataset. */
  dropped: { id: string; field: string; ref: string }[];
  skipped: { id: string; field: string; reason: string }[];
}

const SYSTEM_FIELDS = ["_rev", "_createdAt", "_updatedAt"];
const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isRef = (v: unknown): v is { _ref: string } => isObject(v) && typeof v._ref === "string";
const imageAssetRef = (v: unknown): string | undefined => (isObject(v) && isRef(v.asset) ? v.asset._ref : undefined);
const missing = (v: unknown) => v === undefined || v === null;

/**
 * `value` with every reference to a missing target removed. A reference, or an image
 * whose asset is missing, resolves to `undefined`; inside an array that item is
 * dropped; inside an object that key is removed. An array emptied this way resolves
 * to `undefined` too, so the field is not written empty.
 */
export function resolveRefs(value: unknown, exists: (id: string) => boolean, dropped: string[]): unknown {
  if (Array.isArray(value)) {
    const items = value.map((item) => resolveRefs(item, exists, dropped)).filter((item) => item !== undefined);
    return items.length === 0 && value.length > 0 ? undefined : items;
  }
  if (isRef(value)) {
    if (exists(value._ref)) return value;
    dropped.push(value._ref);
    return undefined;
  }
  const asset = imageAssetRef(value);
  if (asset !== undefined) {
    if (exists(asset)) return value;
    dropped.push(asset);
    return undefined;
  }
  if (isObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, inner] of Object.entries(value)) {
      const resolved = resolveRefs(inner, exists, dropped);
      if (resolved !== undefined) out[key] = resolved;
    }
    return out;
  }
  return value;
}

const strip = (doc: Doc): Doc => {
  const out = { ...doc };
  for (const key of SYSTEM_FIELDS) delete out[key];
  return out;
};

const published = (docs: readonly Doc[], type: string) => docs.find((d) => d._type === type && !d._id.startsWith("drafts."));

export function planOwnerContentRestore(input: RestoreInput): RestorePlan {
  const { oldDocs, currentDocs, existingIds, legacyPillars, declared, finishImages = {} } = input;
  const finishAssets = new Set(Object.values(finishImages));
  const exists = (id: string) => existingIds.has(id) || finishAssets.has(id);
  const plan: RestorePlan = { mutations: [], creates: [], sets: [], decisions: [], dropped: [], skipped: [] };

  // Whole documents that do not exist yet.
  for (const doc of oldDocs) {
    if (!CREATE_TYPES.includes(doc._type) || doc._id.startsWith("drafts.") || exists(doc._id)) continue;
    const dropped: string[] = [];
    const resolved = resolveRefs(strip(doc), exists, dropped) as Doc;
    for (const ref of dropped) plan.dropped.push({ id: doc._id, field: "(document)", ref });
    plan.mutations.push({ createIfNotExists: resolved });
    plan.creates.push({ id: doc._id, type: doc._type });
  }

  // Missing fields on the singletons.
  for (const [type, fields] of Object.entries(SET_FIELDS)) {
    const current = published(currentDocs, type);
    const old = published(oldDocs, type);
    if (!current || !old) continue;

    const setIfMissing: Record<string, unknown> = {};
    for (const field of fields) {
      if (NEVER_RESTORE.includes(field) || !missing(current[field])) continue;
      if (!declared[type]?.has(field)) {
        plan.skipped.push({ id: current._id, field, reason: "not declared by the schema" });
        continue;
      }

      let value: unknown;
      if (type === "homePage" && field === "legacyPillars") {
        value = legacyPillars.map((pillar) => ({ _type: "legacyPillar", ...pillar }));
      } else {
        if (missing(old[field])) continue;
        const dropped: string[] = [];
        let source = old[field];
        if (type === "homePage" && field === "materialFinishes" && Array.isArray(source)) {
          source = source.map((item) => {
            const asset = isObject(item) && typeof item.name === "string" ? finishImages[item.name] : undefined;
            return asset ? { ...(item as object), image: { _type: "image", asset: { _type: "reference", _ref: asset } } } : item;
          });
        }
        value = resolveRefs(source, exists, dropped);
        for (const ref of dropped) plan.dropped.push({ id: current._id, field, ref });
        if (value === undefined) {
          plan.skipped.push({ id: current._id, field, reason: "every reference in it points at something not in the new dataset" });
          continue;
        }
      }
      setIfMissing[field] = value;
      plan.sets.push({ id: current._id, field });
    }
    if (Object.keys(setIfMissing).length) plan.mutations.push({ patch: { id: current._id, setIfMissing } });
  }

  // Owner-chosen old values: overwrite the current one when it differs.
  for (const [type, fields] of Object.entries(ADOPT_OLD)) {
    const current = published(currentDocs, type);
    const old = published(oldDocs, type);
    if (!current || !old) continue;
    const set: Record<string, unknown> = {};
    for (const field of fields) {
      if (missing(old[field]) || JSON.stringify(current[field]) === JSON.stringify(old[field])) continue;
      set[field] = old[field];
      plan.sets.push({ id: current._id, field: `${field} (replaces the current value)` });
    }
    if (Object.keys(set).length) plan.mutations.push({ patch: { id: current._id, set } });
  }

  // Differing values: report only.
  for (const [type, fields] of Object.entries(COMPARE_ONLY)) {
    const current = published(currentDocs, type);
    const old = published(oldDocs, type);
    if (!current || !old) continue;
    for (const field of fields) {
      if (missing(current[field]) || missing(old[field])) continue;
      if (JSON.stringify(current[field]) !== JSON.stringify(old[field])) {
        plan.decisions.push({ id: current._id, field, current: current[field], old: old[field] });
      }
    }
  }

  return plan;
}
