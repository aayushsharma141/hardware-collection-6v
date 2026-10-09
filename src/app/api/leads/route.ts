import { NextResponse } from "next/server";
import { CreateLeadSchema } from "@/lib/leads/schema";
import { createLead, updateNotificationStatus } from "@/lib/leads/createLead";
import { sendTelegramAlert } from "@/lib/leads/telegram";
import { sendResendEmail } from "@/lib/leads/email";
import { logger } from "@/lib/logger";
import { ApiError, handleApiError } from "@/lib/api-error";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Distributed rate limiting via Upstash Redis.
// Falling back to a no-op limiter if Upstash is not configured.
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
  });
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    
    // 1. Rate Limiting (Redis-backed for serverless/edge environments)
    if (ratelimit) {
      const { success } = await ratelimit.limit(`ratelimit_leads_${ip}`);
      if (!success) {
        logger.warn("api.ratelimit_exceeded", { ip, route: "/api/leads" });
        throw new ApiError(429, "Too many requests", "RATE_LIMIT_EXCEEDED");
      }
    }

    const payload = (await request.json()) as Record<string, unknown>;
    
    // 2. Honeypot check
    if (payload._honey) {
      logger.info("api.honeypot_triggered", { ip, honeypotField: "_honey" });
      // Act like it succeeded to fool bots while maintaining standard response contract
      return NextResponse.json({
        success: true,
        data: {
          lead_id: "HC-HONEYPOT",
          telegram_status: "sent",
        },
      });
    }

    // 3. Validation
    const parseResult = CreateLeadSchema.safeParse(payload);
    
    if (!parseResult.success) {
      throw new ApiError(
        400,
        "Validation failed",
        "VALIDATION_ERROR"
      );
    }

    const data = parseResult.data;

    // Generate Lead ID
    const year = new Date().getFullYear();
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const leadId = `HC-${year}-${randomHex}`;

    // 4. Store in Postgres (Master Truth)
    const leadRecord = await createLead(data, leadId);
    
    logger.info("lead.created", {
      leadId: leadRecord.id,
      source: data.source,
      intent: data.intent,
      ip
    });

    // 5. Trigger Email notification asynchronously without blocking
    // Kept as a floating promise per project scale guidelines
    sendResendEmail(leadRecord)
      .then(() => updateNotificationStatus(leadRecord.id, "email", "sent"))
      .catch((err) => {
        logger.error("lead.notification_failed", { leadId: leadRecord.id, channel: "email", error: (err as Error).message });
        updateNotificationStatus(leadRecord.id, "email", "failed").catch(() => {});
      });

    // 6. Attempt Telegram Alert
    try {
      await sendTelegramAlert(leadRecord);
      await updateNotificationStatus(leadRecord.id, "telegram", "sent");

      return NextResponse.json({
        success: true,
        data: {
          lead_id: leadRecord.id,
          telegram_status: "sent",
        }
      });
    } catch (telegramError) {
      logger.error("lead.notification_failed", { leadId: leadRecord.id, channel: "telegram", error: (telegramError as Error).message });
      await updateNotificationStatus(leadRecord.id, "telegram", "failed");

      return NextResponse.json({
        success: true,
        data: {
          lead_id: leadRecord.id,
          telegram_status: "failed",
          notification_error: "We couldn't notify our Telegram desk yet.",
        }
      });
    }
  } catch (error) {
    return handleApiError(error, logger);
  }
}
