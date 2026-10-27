import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { logger } from "@/lib/logger";

/**
 * Per-visitor limit for the lead endpoints: 5 requests a minute, shared across
 * serverless instances through Upstash Redis.
 *
 * Without the Upstash variables there is no limit at all. That is fine locally,
 * but in production it means the form can be flooded, so the gap is logged as
 * an error (once per instance, on first use rather than at build time).
 */
let limiter: Ratelimit | null | undefined;
let reportedMissing = false;

function getLimiter(): Ratelimit | null {
  if (limiter !== undefined) return limiter;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  limiter = url && token
    ? new Ratelimit({ redis: new Redis({ url, token }), limiter: Ratelimit.slidingWindow(5, "1 m"), analytics: true })
    : null;
  return limiter;
}

/** The visitor's address: the first entry of x-forwarded-for, which Vercel sets. */
export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/**
 * True when the request may proceed.
 *
 * `failClosed` refuses the request in production when no limiter is configured.
 * Use it for endpoints that are not the visitor-facing form (e.g. retry), where
 * an unlimited caller gains something and a refusal costs the visitor nothing.
 */
export async function allowLeadRequest(
  scope: string,
  ip: string,
  options: { failClosed?: boolean } = {}
): Promise<boolean> {
  const active = getLimiter();
  if (!active) {
    const production = process.env.NODE_ENV === "production";
    if (production && !reportedMissing) {
      reportedMissing = true;
      logger.error("api.ratelimit_unconfigured", {
        route: scope,
        missing: "UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN",
      });
    }
    return !(production && options.failClosed);
  }
  const { success } = await active.limit(`ratelimit_${scope}_${ip}`);
  return success;
}
