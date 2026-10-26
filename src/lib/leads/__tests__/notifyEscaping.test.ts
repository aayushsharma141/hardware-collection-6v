import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { escapeHtml } from "../escapeHtml";
import { sendResendEmail } from "../email";
import { sendTelegramAlert } from "../telegram";
import type { LeadNotificationPayload } from "../schema";

const hostile = {
  id: "HC-2026-0A1B2C3D",
  intent: "callback",
  name: `<a href="https://evil.example">Click</a> O_Brien *VIP*`,
  phone: "9835190000",
  email: "",
  source: "home",
  message: "<script>alert(1)</script>",
  pageUrl: "javascript:alert(1)",
} as unknown as LeadNotificationPayload;

describe("escapeHtml", () => {
  it("escapes markup and quotes", () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
  });

  it("treats null and undefined as empty", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });
});

describe("lead notifications escape visitor input", () => {
  const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("STAFF_EMAIL", "staff@example.com");
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "test-token");
    vi.stubEnv("TELEGRAM_CHAT_ID", "1");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    fetchMock.mockClear();
  });

  const sentBody = () => JSON.parse(String((fetchMock.mock.calls[0] as unknown[])[1] && ((fetchMock.mock.calls[0] as unknown[])[1] as RequestInit).body));

  it("staff email contains no live markup from the visitor", async () => {
    await sendResendEmail(hostile);
    const { html } = sentBody();
    expect(html).not.toContain("<script>");
    expect(html).not.toContain('<a href="https://evil.example"');
    expect(html).not.toContain('href="javascript:');
    expect(html).toContain("&lt;script&gt;");
  });

  it("Telegram alert uses HTML mode with the visitor's text escaped", async () => {
    await sendTelegramAlert(hostile);
    const body = sentBody();
    expect(body.parse_mode).toBe("HTML");
    expect(body.text).toContain("&lt;a href=&quot;https://evil.example&quot;&gt;");
    expect(body.text).toContain("O_Brien *VIP*");
  });
});
