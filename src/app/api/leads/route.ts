import { randomBytes } from "node:crypto";
import { after, NextResponse } from "next/server";
import { CreateLeadSchema } from "@/lib/leads/schema";
import { createLead, updateNotificationStatus } from "@/lib/leads/createLead";
import { sendTelegramAlert } from "@/lib/leads/telegram";
import { sendResendEmail } from "@/lib/leads/email";
import { logger } from "@/lib/logger";
import { ApiError, handleApiError } from "@/lib/api-error";
import { allowLeadRequest, clientIp } from "@/lib/leads/rateLimit";

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);

    // 1. Rate Limiting (Redis-backed for serverless/edge environments)
    if (!(await allowLeadRequest("leads", ip))) {
      logger.warn("api.ratelimit_exceeded", { ip, route: "/api/leads" });
      throw new ApiError(429, "Too many requests", "RATE_LIMIT_EXCEEDED");
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

    // Generate Lead ID. The id is the primary key, so a repeat makes the insert
    // fail and the lead is lost. Four hex digits (65,536 per year) made a repeat
    // likely within a few hundred leads; eight make it negligible.
    const year = new Date().getFullYear();
    const randomHex = randomBytes(4).toString("hex").toUpperCase();
    const leadId = `HC-${year}-${randomHex}`;

    // 4. Store in Postgres (Master Truth)
    const leadRecord = await createLead(data, leadId);
    
    logger.info("lead.created", {
      leadId: leadRecord.id,
      source: data.source,
      intent: data.intent,
      ip
    });

    // 5. Email notification, sent after the response so the visitor does not wait.
    // `after` keeps the serverless function alive until it finishes; a bare
    // floating promise can be frozen mid-send once the response is returned.
    after(async () => {
      try {
        await sendResendEmail(leadRecord);
        await updateNotificationStatus(leadRecord.id, "email", "sent");
      } catch (err) {
        logger.error("lead.notification_failed", { leadId: leadRecord.id, channel: "email", error: (err as Error).message });
        await updateNotificationStatus(leadRecord.id, "email", "failed").catch(() => {});
      }
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
