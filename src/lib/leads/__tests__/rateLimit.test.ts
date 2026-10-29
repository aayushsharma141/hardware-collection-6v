import { afterEach, describe, expect, it, vi } from "vitest";

describe("lead rate limiter production fallback", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("fails closed in production when Upstash credentials are missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");

    const { allowLeadRequest } = await import("../rateLimit");

    await expect(
      allowLeadRequest("leads", "203.0.113.10", { failClosed: true })
    ).resolves.toBe(false);
  });

  it("allows local development without Redis so local form work remains possible", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");

    const { allowLeadRequest } = await import("../rateLimit");

    await expect(
      allowLeadRequest("leads", "203.0.113.10", { failClosed: true })
    ).resolves.toBe(true);
  });
});
