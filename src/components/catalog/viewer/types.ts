/** Shared vocabulary for the catalogue viewer's four interaction states. */

export type ViewerState = "browse" | "mark" | "capture" | "preview";

export type FitMode = "width" | "page";

export type CatalogueStatus = "loading" | "ready" | "error";

export type AnnotationTool = "select" | "arrow" | "circle" | "box";

/** Geometry is shared with the capture compositor, which owns the definitions. */
export type { NormPoint, NormRect } from "@/lib/catalog/capture";

import type { NormPoint as Point } from "@/lib/catalog/capture";

export interface Stroke {
  tool: AnnotationTool;
  points: Point[];
}
