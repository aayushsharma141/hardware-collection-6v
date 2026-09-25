/**
 * Catalogue funnel events.
 *
 * The catalogue is a sales-assistance surface, not a document library, so the
 * measured funnel is open → browse → mark → capture → WhatsApp enquiry.
 * `catalogue_whatsapp_click` is the conversion event; there is deliberately no
 * download event, because the viewer offers no download.
 *
 * Events are pushed to `window.dataLayer`, matching the lead-capture form.
 */

export type CatalogueEvent =
  | "catalogue_open"
  | "catalogue_page_view"
  | "catalogue_zoom"
  | "catalogue_search"
  | "catalogue_mark_start"
  | "catalogue_mark_complete"
  | "catalogue_capture"
  | "catalogue_whatsapp_click";

export interface CatalogueEventPayload {
  brand?: string;
  catalogue?: string;
  page?: number;
  pages?: number;
  /** "marked" (drew on the page) or "page" (enquired without marking). */
  intent?: "marked" | "page";
  query?: string;
  results?: number;
  zoom?: number;
  /** How the capture actually reached WhatsApp. */
  transport?: "share-sheet" | "clipboard" | "link-only";
}

export function trackCatalogue(
  event: CatalogueEvent,
  payload: CatalogueEventPayload = {}
): void {
  if (typeof window === "undefined") return;
  try {
    const win = window as unknown as { dataLayer?: Record<string, unknown>[] };
    win.dataLayer = win.dataLayer || [];
    win.dataLayer.push({ event, ...payload });
  } catch {
    // Analytics must never break the viewer.
  }
}
