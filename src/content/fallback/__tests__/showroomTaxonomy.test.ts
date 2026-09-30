import { describe, it, expect } from 'vitest';
import { SHOWROOM_FAMILIES, CATEGORIES } from '../catalog';

describe('Showroom Taxonomy completion', () => {
  it('every SHOWROOM_FAMILIES subcategory resolves to a routable category', () => {
    // The routable definitions are either the category title, its slug, 
    // or one of its explicitly declared subcategories.
    const validIdentifiers = new Set<string>();
    
    CATEGORIES.forEach(cat => {
      validIdentifiers.add(cat.slug);
      validIdentifiers.add(cat.title);
      cat.subcategories?.forEach(sub => validIdentifiers.add(sub));
    });

    const unmapped: string[] = [];

    SHOWROOM_FAMILIES.forEach(family => {
      family.subcategories.forEach(sub => {
        let normalized = sub;
        // Apply historical renames (D2, D3 decisions)
        if (normalized === 'Kitchen Handles (Sale)') normalized = 'Kitchen Handles';

        const directSlug = normalized.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        if (!validIdentifiers.has(normalized) && !validIdentifiers.has(directSlug)) {
           unmapped.push(sub);
        }
      });
    });

    expect(unmapped).toEqual([]);
  });
});
