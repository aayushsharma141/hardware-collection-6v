import { describe, expect, it } from "vitest";
import { LEAD_SUBMIT_FALLBACK_ERROR, parseLeadResponse } from "../response";

describe("parseLeadResponse", () => {
  it("reads the lead id and telegram status nested under data", () => {
    const body = { success: true, data: { lead_id: "HC-2026-AB12", telegram_status: "sent" } };
    expect(parseLeadResponse(true, body)).toEqual({
      ok: true,
      leadId: "HC-2026-AB12",
      telegramStatus: "sent",
    });
  });

  it("keeps a failed telegram status so the form can offer a retry", () => {
    const body = {
      success: true,
      data: { lead_id: "HC-2026-CD34", telegram_status: "failed", notification_error: "x" },
    };
    expect(parseLeadResponse(true, body)).toEqual({
      ok: true,
      leadId: "HC-2026-CD34",
      telegramStatus: "failed",
    });
  });

  it("treats an unknown telegram status as pending", () => {
    const body = { success: true, data: { lead_id: "HC-2026-EF56", telegram_status: "weird" } };
    expect(parseLeadResponse(true, body)).toMatchObject({ ok: true, telegramStatus: "pending" });
  });

  it("does not invent a placeholder id when the id is missing", () => {
    expect(parseLeadResponse(true, { success: true, data: {} })).toEqual({
      ok: false,
      message: LEAD_SUBMIT_FALLBACK_ERROR,
    });
    // The old flat shape is no longer the contract and must not be accepted.
    expect(parseLeadResponse(true, { success: true, lead_id: "HC-FLAT" })).toMatchObject({
      ok: false,
    });
  });

  it("shows the message from an api error object, never [object Object]", () => {
    const body = {
      success: false,
      error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many requests" },
    };
    const result = parseLeadResponse(false, body);
    expect(result).toEqual({ ok: false, message: "Too many requests" });
    expect(JSON.stringify(result)).not.toContain("[object Object]");
  });

  it("falls back to a readable message for non-JSON or malformed errors", () => {
    expect(parseLeadResponse(false, null)).toEqual({ ok: false, message: LEAD_SUBMIT_FALLBACK_ERROR });
    expect(parseLeadResponse(false, { success: false, error: "plain" })).toEqual({
      ok: false,
      message: LEAD_SUBMIT_FALLBACK_ERROR,
    });
    expect(parseLeadResponse(false, { success: false, error: { message: "" } })).toEqual({
      ok: false,
      message: LEAD_SUBMIT_FALLBACK_ERROR,
    });
  });

  it("rejects a 2xx response that does not report success", () => {
    expect(parseLeadResponse(true, { success: false })).toEqual({
      ok: false,
      message: LEAD_SUBMIT_FALLBACK_ERROR,
    });
  });
});
