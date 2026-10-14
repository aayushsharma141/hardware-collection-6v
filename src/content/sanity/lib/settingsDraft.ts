/**
 * Planner for promoting two values from the unpublished `siteSettings` draft
 * into the published document before the draft is discarded.
 *
 * The owner (2026-10-14) confirmed the PUBLISHED opening hours are the right
 * ones, and asked for the draft's pinned Google Maps link and longer SEO title
 * to be kept. Everything else in the draft is deliberately NOT copied: the
 * hours are wrong, `mainLogo` is missing from it, and the rest is identical.
 *
 * Pure, so it can be tested without a dataset.
 */

export interface SettingsDoc {
  _id: string;
  _rev?: string;
  googleMapsUrl?: string | null;
  seo?: { metaTitle?: string | null; [key: string]: unknown } | null;
  [field: string]: unknown;
}

export interface SettingsPlan {
  /** Dotted paths to set on the published document, with their new values. */
  set: Record<string, string>;
  /** Human-readable lines describing each change, old -> new. */
  changes: string[];
  /** The draft is deleted only when there is one. */
  deleteDraft: boolean;
}

const nonEmpty = (value: unknown): value is string => typeof value === "string" && value.trim() !== "";

export function planSettingsDraft(published: SettingsDoc | null, draft: SettingsDoc | null): SettingsPlan {
  const plan: SettingsPlan = { set: {}, changes: [], deleteDraft: false };
  // Without a published document there is nothing to promote the values into, and
  // deleting the draft would lose them.
  if (!published || !draft) return plan;
  plan.deleteDraft = true;

  const draftMaps = draft.googleMapsUrl;
  if (nonEmpty(draftMaps) && draftMaps !== published.googleMapsUrl) {
    plan.set.googleMapsUrl = draftMaps;
    plan.changes.push(`googleMapsUrl: ${published.googleMapsUrl ?? "(empty)"}  ->  ${draftMaps}`);
  }

  const draftTitle = draft.seo?.metaTitle;
  if (nonEmpty(draftTitle) && draftTitle !== published.seo?.metaTitle) {
    plan.set["seo.metaTitle"] = draftTitle;
    plan.changes.push(`seo.metaTitle: ${published.seo?.metaTitle ?? "(empty)"}  ->  ${draftTitle}`);
  }

  return plan;
}
