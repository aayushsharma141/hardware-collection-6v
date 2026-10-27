import { NextResponse } from "next/server";
import { prisma, updateNotificationStatus } from "@/lib/leads/createLead";
import { sendTelegramAlert } from "@/lib/leads/telegram";
import { logger } from "@/lib/logger";
import { ApiError, handleApiError } from "@/lib/api-error";
import { allowLeadRequest, clientIp } from "@/lib/leads/rateLimit";

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);

    if (!(await allowLeadRequest("leads_retry", ip, { failClosed: true }))) {
      logger.warn("api.ratelimit_exceeded", { ip, route: "/api/leads/retry" });
      throw new ApiError(429, "Too many requests", "RATE_LIMIT_EXCEEDED");
    }

    const body = (await request.json().catch(() => null)) as { lead_id?: unknown } | null;
    const lead_id = body && typeof body === "object" ? body.lead_id : undefined;

    if (!lead_id || typeof lead_id !== "string" || lead_id.length > 64) {
      return NextResponse.json(
        { success: false, error: "Invalid lead ID provided" },
        { status: 400 }
      );
    }

    // 1. Fetch existing lead record
    const existingLead = await prisma.lead.findUnique({
      where: { id: lead_id },
    });

    if (!existingLead) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    // 2. Idempotency check - if already sent, do not re-send
    if (existingLead.telegramStatus === "sent") {
      return NextResponse.json({
        success: true,
        lead_id: existingLead.id,
        telegram_status: "sent",
      });
    }

    // 3. Concurrency guard: atomically claim the retry attempt only if not already claimed or sent
    const claim = await prisma.lead.updateMany({
      where: {
        id: lead_id,
        telegramStatus: "failed",
      },
      data: {
        telegramStatus: "pending",
      },
    });

    if (claim.count === 0 && existingLead.telegramStatus !== "pending") {
      // Another worker/request claimed or updated it
      const current = await prisma.lead.findUnique({ where: { id: lead_id } });
      return NextResponse.json({
        success: true,
        lead_id,
        telegram_status: current?.telegramStatus ?? "pending",
      });
    }

    // 4. Attempt to send Telegram notification
    try {
      await sendTelegramAlert(existingLead);
      await updateNotificationStatus(existingLead.id, "telegram", "sent");

      return NextResponse.json({
        success: true,
        lead_id: existingLead.id,
        telegram_status: "sent",
      });
    } catch (telegramError) {
      console.error("Retry Telegram notification error:", telegramError);
      await updateNotificationStatus(existingLead.id, "telegram", "failed");

      return NextResponse.json({
        success: true,
        lead_id: existingLead.id,
        telegram_status: "failed",
        notification_error: "We couldn't notify our Telegram desk yet.",
      });
    }
  } catch (error) {
    return handleApiError(error, logger);
  }
}
