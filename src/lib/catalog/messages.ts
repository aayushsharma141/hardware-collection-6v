/**
 * Pre-filled WhatsApp messages for the two catalogue conversion paths.
 *
 * Both carry brand, catalogue and page so staff can confirm the model,
 * availability and current price without a round of clarifying questions.
 */

export interface CatalogueContext {
  brand: string;
  catalogue: string;
  page: number;
}

/**
 * Catalogue titles often already carry the brand ("Labacha Long Handle"), so
 * naming both would stutter in the message staff receive.
 */
function describe({ brand, catalogue }: CatalogueContext): string {
  const title = catalogue.trim();
  // Compared without diacritics: brand records spell it "Hafele" while the
  // catalogue title is "Häfele Sliding Systems", and a naive comparison would
  // let both through as "Hafele Häfele Sliding Systems".
  return fold(title).startsWith(fold(brand)) ? title : `${brand} ${title}`;
}

/**
 * The catalogue title with a leading brand removed, for the viewer header,
 * where "Häfele · Häfele Sliding Systems" reads as a stutter and eats the
 * width a phone does not have. Returns the title unchanged when it does not
 * begin with the brand.
 */
export function shortCatalogueTitle(brand: string, catalogue: string): string {
  const title = catalogue.trim();
  if (!fold(title).startsWith(fold(brand))) return title;
  const trimmed = title.slice(brand.trim().length).replace(/^[\s·—–-]+/, "");
  return trimmed || title;
}

/** Lowercased and stripped of accents, for comparison only. */
function fold(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Path A — the customer marked and captured a specific product. */
export function buildMarkedEnquiryMessage(context: CatalogueContext): string {
  return (
    `Hi, I'm interested in this product from the ${describe(context)} catalogue ` +
    `(page ${context.page}). Please share the price and availability.`
  );
}

/** Path B — the customer is on a page and wants help without marking. */
export function buildPageEnquiryMessage(context: CatalogueContext): string {
  return (
    `Hi, I'm interested in products on page ${context.page} of the ${describe(context)} ` +
    `catalogue. Please help me identify the available options.`
  );
}

/** The catalogue itself could not be shown. */
export function buildCatalogueUnavailableMessage(brand: string, catalogue?: string): string {
  return catalogue
    ? `Hi, I was trying to view the ${brand} ${catalogue} catalogue and it did not open. Could you help me with the products in it?`
    : `Hi, could you help me with the ${brand} range? I was trying to view their catalogue.`;
}

/** Provenance stamped onto a capture and shown in the share preview. */
export function buildCaption(context: CatalogueContext): string {
  return `${describe(context)} · Page ${context.page}`;
}
