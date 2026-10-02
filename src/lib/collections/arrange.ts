/**
 * How a showroom section lays its products out on the 12-column desktop grid.
 *
 * Featured products get more room than the rest, but a fixed span per product
 * (8 columns featured, 4 regular) leaves a hole whenever the two do not divide
 * the rows evenly — five featured and six regular products left a third of two
 * rows empty. Planning the rows up front removes the holes: every row is built
 * to add up to exactly 12 columns, so a section is a solid block however many
 * products it holds.
 *
 * Pure and import-free, so it can be tested without rendering anything. The
 * card order it returns is also the visual order, which keeps keyboard focus
 * order the same as reading order.
 */

export type DesktopSpan = 4 | 6 | 8 | 12;
export type TabletSpan = 6 | 12;

export interface PlacedProduct<T> {
  product: T;
  /** Columns taken at lg and up (12-column grid). */
  lg: DesktopSpan;
  /** Columns taken at md (two per row, the last one widening when the count is odd). */
  md: TabletSpan;
}

interface ProductLike {
  featured?: boolean;
}

export function arrangeProducts<T extends ProductLike>(products: readonly T[]): PlacedProduct<T>[] {
  const featured = products.filter((p) => p.featured === true);
  const regular = products.filter((p) => p.featured !== true);

  const rows: { product: T; lg: DesktopSpan }[][] = [];

  // A featured product pairs with a regular one: 8 + 4. The pair alternates
  // sides row to row so the large specimen does not always sit on the left.
  let flip = false;
  while (featured.length > 0 && regular.length > 0) {
    const row = [
      { product: featured.shift() as T, lg: 8 as DesktopSpan },
      { product: regular.shift() as T, lg: 4 as DesktopSpan },
    ];
    rows.push(flip ? row.reverse() : row);
    flip = !flip;
  }

  // Featured products left over share a row in pairs: 6 + 6. An odd one out
  // takes the full width rather than leaving half a row empty.
  while (featured.length > 0) {
    const pair = featured.splice(0, 2);
    const span: DesktopSpan = pair.length === 2 ? 6 : 12;
    rows.push(pair.map((product) => ({ product, lg: span })));
  }

  // Regular products left over go three to a row: 4 + 4 + 4. Four is split 2 + 2
  // (a row of three would strand one), two share a row, one takes the width.
  while (regular.length > 0) {
    const take = regular.length === 4 ? 2 : Math.min(3, regular.length);
    const group = regular.splice(0, take);
    const span: DesktopSpan = take === 3 ? 4 : take === 2 ? 6 : 12;
    rows.push(group.map((product) => ({ product, lg: span })));
  }

  const ordered = rows.flat();
  const oddCount = ordered.length % 2 === 1;
  return ordered.map((placed, index) => ({
    ...placed,
    md: oddCount && index === ordered.length - 1 ? 12 : 6,
  }));
}
