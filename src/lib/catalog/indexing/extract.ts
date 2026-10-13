import type { IndexedPage } from "../search/types";

export interface PageBatch {
  numPages: number;
  pages: IndexedPage[];
  /** The first page not yet extracted, or null when the whole PDF is done. */
  nextPage: number | null;
}

/** Extracts a run of pages; injected into the indexer so tests need no PDF. */
export type ExtractPages = (pdfUrl: string, fromPage: number, deadline: number) => Promise<PageBatch>;

/**
 * Page-by-page text from a PDF, stopping at `deadline` (epoch ms) so a large
 * catalogue is finished over several invocations. The extraction mirrors
 * `scripts/build-catalog-index.mjs` (same pdf.js call, same whitespace and
 * case handling), so a page number means the same thing in both indexes.
 */
export const extractPages: ExtractPages = async (pdfUrl, fromPage, deadline) => {
  const response = await fetch(pdfUrl);
  if (!response.ok) throw new Error(`PDF download failed: HTTP ${response.status}`);
  const data = new Uint8Array(await response.arrayBuffer());

  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const task = getDocument({ data, useSystemFonts: true, verbosity: 0 });
  const pdf = await task.promise;

  try {
    const pages: IndexedPage[] = [];
    let page = fromPage;
    for (; page <= pdf.numPages; page++) {
      // Always take at least one page so every invocation makes progress.
      if (pages.length > 0 && Date.now() >= deadline) break;
      const handle = await pdf.getPage(page);
      const content = await handle.getTextContent();
      const text = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
      pages.push({ page, text });
      handle.cleanup();
    }
    return { numPages: pdf.numPages, pages, nextPage: page > pdf.numPages ? null : page };
  } finally {
    await task.destroy();
  }
};
