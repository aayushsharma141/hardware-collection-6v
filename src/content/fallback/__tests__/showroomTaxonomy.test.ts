import { describe, it, expect } from 'vitest';
import { SHOWROOM_FAMILIES, CATEGORIES } from '../catalog';

/**
 * Phase 12 family-section labels.
 *
 * After Phase 12, SHOWROOM_FAMILIES.subcategories serves two purposes:
 *   1. Names that also appear as a CATEGORY entry – they are section anchors
 *      on the family page AND standalone category pages/filter tabs.
 *   2. Names that are display-only labels for sections within a family page –
 *      they have no independent CATEGORY entry and are not routes.
 *
 * This set documents the Phase-12 decision to keep these as family-section
 * labels only. Adding a name here is a conscious, reviewed choice; it must
 * NOT be added to CATEGORIES.subcategories (that would corrupt searchKeywords
 * if the seed script is re-run).
 *
 * If a name migrates from here into a real CATEGORY, remove it from this set
 * and the test will still pass (the category check will cover it).
 */
const FAMILY_SECTION_LABELS = new Set<string>([
  // handles-knobs family sections
  'Kids Collection',
  // door-hardware family sections
  'Door Knobs',
  'Door Sliding',
  // bathroom family sections — exact names present in bathroom-accessories
  // CATEGORIES.subcategories; listed here for documentation but they already
  // resolve via the category check.
  // kitchen-wardrobes family sections
  'Lights',
  // furniture-hardware family sections
  'Invisible Locks',
  'Furniture Profiles',
  'Furniture Locks',
  'Carvings',
  'Bed Fittings',
  'Wheels & Legs',
  'Office Fittings',
  'Table Extension',
  'Furniture Fittings',
]);

describe('Showroom Taxonomy completion', () => {
  it('every SHOWROOM_FAMILIES subcategory resolves to a routable category or is a documented family-section label', () => {
    // Routable identifiers: category slugs, titles, and their declared subcategories.
    const routableIdentifiers = new Set<string>();

    CATEGORIES.forEach(cat => {
      routableIdentifiers.add(cat.slug);
      routableIdentifiers.add(cat.title);
      cat.subcategories?.forEach(sub => routableIdentifiers.add(sub));
    });

    const unmapped: string[] = [];

    SHOWROOM_FAMILIES.forEach(family => {
      family.subcategories.forEach(sub => {
        let normalized = sub;
        // Apply historical renames (D2, D3 decisions).
        if (normalized === 'Kitchen Handles (Sale)') normalized = 'Kitchen Handles';

        const directSlug = normalized.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const isRoutable =
          routableIdentifiers.has(normalized) ||
          routableIdentifiers.has(directSlug);

        const isFamilySectionLabel = FAMILY_SECTION_LABELS.has(normalized);

        if (!isRoutable && !isFamilySectionLabel) {
          unmapped.push(sub);
        }
      });
    });

    expect(unmapped).toEqual([]);
  });

  it('FAMILY_SECTION_LABELS contains no name that is also a routable category (documents non-overlap)', () => {
    // If a label graduates to a real category, it should be removed from
    // FAMILY_SECTION_LABELS so this file stays accurate.
    const routableIdentifiers = new Set<string>();
    CATEGORIES.forEach(cat => {
      routableIdentifiers.add(cat.slug);
      routableIdentifiers.add(cat.title);
      cat.subcategories?.forEach(sub => routableIdentifiers.add(sub));
    });

    const overlap: string[] = [];
    for (const label of FAMILY_SECTION_LABELS) {
      const directSlug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (routableIdentifiers.has(label) || routableIdentifiers.has(directSlug)) {
        overlap.push(label);
      }
    }

    // Bathroom Shelves / Mail Boxes are in bathroom-accessories.subcategories
    // AND in FAMILY_SECTION_LABELS is intentionally empty for them (they
    // resolve via the category check). This test alerts if any other label
    // inadvertently appears in both places.
    expect(overlap).toEqual([]);
  });
});
