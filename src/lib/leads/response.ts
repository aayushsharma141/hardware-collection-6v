export type TelegramStatus = "sent" | "failed" | "pending";

export type LeadSubmitResult =
  | { ok: true; leadId: string; telegramStatus: TelegramStatus }
  | { ok: false; message: string };

export const LEAD_SUBMIT_FALLBACK_ERROR =
  "Failed to submit enquiry. Please try again, or call our showroom directly.";

const TELEGRAM_STATUSES: readonly TelegramStatus[] = ["sent", "failed", "pending"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// `body` is null when the response was not JSON (e.g. a platform error page).
export function parseLeadResponse(httpOk: boolean, body: unknown): LeadSubmitResult {
  if (!isRecord(body)) return { ok: false, message: LEAD_SUBMIT_FALLBACK_ERROR };

  if (!httpOk || body.success !== true) {
    const error = body.error;
    const message = isRecord(error) && typeof error.message === "string" ? error.message : null;
    return { ok: false, message: message || LEAD_SUBMIT_FALLBACK_ERROR };
  }

  const data = isRecord(body.data) ? body.data : null;
  const leadId = data && typeof data.lead_id === "string" ? data.lead_id : null;
  if (!leadId) return { ok: false, message: LEAD_SUBMIT_FALLBACK_ERROR };

  const status = data?.telegram_status;
  const telegramStatus = TELEGRAM_STATUSES.includes(status as TelegramStatus)
    ? (status as TelegramStatus)
    : "pending";

  return { ok: true, leadId, telegramStatus };
}
