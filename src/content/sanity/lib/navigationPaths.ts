/**
 * Planning for repointing stored navigation links from the old "/catalogs"
 * route to "/catalogues". Pure, so it can be tested without a Sanity project;
 * `scripts/cms/fix-navigation-catalogues.ts` fetches, prints and (only with
 * --apply) commits.
 *
 * Navbar.tsx used to translate the old path at render time; that was removed once
 * this had been applied (2026-10-23).
 */

export type NavLink = { _key?: string; label?: string; path?: string };
export type NavDoc = { _id: string; _type: string; mainMenu?: NavLink[]; footerLegalLinks?: NavLink[] };

export const NAV_LIST_FIELDS = ["mainMenu", "footerLegalLinks"] as const;

export interface NavChange {
  id: string;
  field: string;
  key: string;
  before: { label?: string; path?: string };
  after: { label?: string; path?: string };
}

export interface NavPlan {
  mutations: { patch: { id: string; set: Record<string, string> } }[];
  changes: NavChange[];
  /** Links that need a change but have no `_key`, so a patch cannot address them. */
  unaddressable: { id: string; field: string; label?: string }[];
}

const isOldPath = (path?: string) => path === "/catalogs" || path?.startsWith("/catalogs/") === true;
const newPath = (path: string) => path.replace(/^\/catalogs/, "/catalogues");
const newLabel = (label: string) => label.replace(/catalogs/gi, (m) => (m[0] === "C" ? "Catalogues" : "catalogues"));

export function planNavigationPaths(docs: readonly NavDoc[]): NavPlan {
  const plan: NavPlan = { mutations: [], changes: [], unaddressable: [] };

  for (const doc of docs) {
    if (doc._type !== "navigation") continue;
    const set: Record<string, string> = {};

    for (const field of NAV_LIST_FIELDS) {
      for (const link of doc[field] ?? []) {
        const path = isOldPath(link.path) ? newPath(link.path as string) : link.path;
        const label = link.label && /catalogs/i.test(link.label) ? newLabel(link.label) : link.label;
        if (path === link.path && label === link.label) continue;

        if (!link._key) {
          plan.unaddressable.push({ id: doc._id, field, label: link.label });
          continue;
        }
        if (path !== link.path && path) set[`${field}[_key=="${link._key}"].path`] = path;
        if (label !== link.label && label) set[`${field}[_key=="${link._key}"].label`] = label;
        plan.changes.push({
          id: doc._id,
          field,
          key: link._key,
          before: { label: link.label, path: link.path },
          after: { label, path },
        });
      }
    }
    if (Object.keys(set).length) plan.mutations.push({ patch: { id: doc._id, set } });
  }
  return plan;
}
