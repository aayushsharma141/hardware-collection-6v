import { NextResponse } from "next/server";
import { prisma, updateNotificationStatus } from "@/lib/leads/createLead";
import { sendTelegramAlert } from "@/lib/leads/telegram";

export async function POST(request: Request) {
  try {
    const { lead_id } = await request.json();

    if (!lead_id || typeof lead_id !== "string") {
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
    console.error("Lead Retry API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
