/**
 * Turning a marked catalogue page into a WhatsApp enquiry.
 *
 * The capture is composed here rather than in a component so the compositing
 * rules stay in one place: page pixels, then the customer's marks, then a
 * provenance strip naming the brand, catalogue and page. Staff receive the
 * image already knowing where it came from.
 *
 * On the delivery side there is one honest constraint: a wa.me deep link
 * cannot carry an attachment. Where the platform supports Web Share Level 2
 * the PNG goes to the share sheet as a file and WhatsApp receives it as a real
 * attachment; everywhere else the PNG is placed on the clipboard and the
 * pre-filled chat is opened for the customer to paste. `shareCapture` reports
 * which of the two happened so the UI can say so.
 */

export interface NormPoint {
  /** 0–1, relative to the rendered page canvas. */
  x: number;
  y: number;
}

export interface NormRect {
  /** All values are 0–1, relative to the rendered page canvas. */
  x: number;
  y: number;
  w: number;
  h: number;
}

/** The box the customer's marks occupy, in the same 0–1 page space. */
export function boundsOfStrokes(strokes: Array<{ points: NormPoint[] }>): NormRect | null {
  let minX = 1;
  let minY = 1;
  let maxX = 0;
  let maxY = 0;
  let seen = false;

  for (const stroke of strokes) {
    for (const point of stroke.points) {
      seen = true;
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }
  }
  if (!seen) return null;

  if (maxX - minX < 0.02 && maxY - minY < 0.02) {
    // A single tap — give it something to sit inside.
    return { x: Math.max(0, minX - 0.12), y: Math.max(0, minY - 0.12), w: 0.24, h: 0.24 };
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

export type ShareTransport = "share-sheet" | "clipboard" | "link-only";

export interface ShareResult {
  transport: ShareTransport;
  /** True when the customer dismissed the OS share sheet. */
  cancelled?: boolean;
}

const CAPTION_MIN = 34;
const CAPTION_MAX = 72;

/**
 * Crops `region` out of the page canvas, draws the annotation canvas over it,
 * and stamps the provenance strip.
 */
export async function composeCapture(options: {
  page: HTMLCanvasElement;
  annotations?: HTMLCanvasElement | null;
  region: NormRect;
  caption: string;
}): Promise<Blob | null> {
  const { page, annotations, region, caption } = options;

  const sx = Math.max(0, Math.round(region.x * page.width));
  const sy = Math.max(0, Math.round(region.y * page.height));
  const sw = Math.min(page.width - sx, Math.round(region.w * page.width));
  const sh = Math.min(page.height - sy, Math.round(region.h * page.height));
  if (sw < 16 || sh < 16) return null;

  const strip = Math.min(CAPTION_MAX, Math.max(CAPTION_MIN, Math.round(sh * 0.08)));
  const out = document.createElement("canvas");
  out.width = sw;
  out.height = sh + strip;

  const ctx = out.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(page, sx, sy, sw, sh, 0, 0, sw, sh);

  if (annotations) {
    // The annotation canvas is kept at the same backing size as the page.
    ctx.drawImage(annotations, sx, sy, sw, sh, 0, 0, sw, sh);
  }

  ctx.fillStyle = "#0E0C0C";
  ctx.fillRect(0, sh, out.width, strip);
  const fontSize = Math.round(strip * 0.34);
  ctx.font = `${fontSize}px system-ui, -apple-system, sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillStyle = "#C8A96E";
  ctx.fillText(caption, 14, sh + strip / 2, out.width - 28);

  return new Promise((resolve) => out.toBlob((blob) => resolve(blob), "image/png"));
}

/** Expands a bounding box into a comfortable capture region around the marks. */
export function suggestRegion(bounds: NormRect): NormRect {
  const padX = Math.max(0.05, bounds.w * 0.18);
  const padY = Math.max(0.05, bounds.h * 0.18);
  const x = Math.max(0, bounds.x - padX);
  const y = Math.max(0, bounds.y - padY);
  return {
    x,
    y,
    w: Math.min(1 - x, bounds.w + padX * 2),
    h: Math.min(1 - y, bounds.h + padY * 2),
  };
}

async function copyToClipboard(blob: Blob): Promise<boolean> {
  if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) return false;
  try {
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return true;
  } catch {
    return false;
  }
}

export async function shareCapture(options: {
  blob: Blob;
  message: string;
  whatsAppUrl: string;
  filename?: string;
}): Promise<ShareResult> {
  const { blob, message, whatsAppUrl, filename = "hardware-collection-enquiry.png" } = options;

  const file = new File([blob], filename, { type: "image/png" });
  const payload: ShareData = { files: [file], text: message };

  if (typeof navigator.canShare === "function" && navigator.canShare(payload)) {
    try {
      await navigator.share(payload);
      return { transport: "share-sheet" };
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") {
        return { transport: "share-sheet", cancelled: true };
      }
      // Any other failure falls through to the clipboard route.
    }
  }

  const copied = await copyToClipboard(blob);
  window.open(whatsAppUrl, "_blank", "noopener,noreferrer");
  return { transport: copied ? "clipboard" : "link-only" };
}
