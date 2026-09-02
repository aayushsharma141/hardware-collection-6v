import { NextResponse } from "next/server";
import { CreateLeadSchema } from "@/lib/leads/schema";
import { createLead, updateNotificationStatus } from "@/lib/leads/createLead";
import { sendTelegramAlert } from "@/lib/leads/telegram";
import { sendResendEmail } from "@/lib/leads/email";

// In-memory rate limiting for naive protection (edge/serverless compatible per region)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    
    // Rate Limiting
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    
    const clientRecord = rateLimitMap.get(ip) || { count: 0, timestamp: now };
    
    if (clientRecord.timestamp < windowStart) {
      clientRecord.count = 1;
      clientRecord.timestamp = now;
    } else {
      clientRecord.count++;
    }
    
    rateLimitMap.set(ip, clientRecord);

    if (clientRecord.count > MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { success: false, error: "Too many requests" },
        { status: 429 }
      );
    }

    const payload = (await request.json()) as Record<string, unknown>;
    
    // Honeypot check
    if (payload._honey) {
      // Act like it succeeded to fool bots
      return NextResponse.json({ success: true, lead_id: "HC-HONEYPOT", telegram_status: "sent" });
    }

    // Validation
    const parseResult = CreateLeadSchema.safeParse(payload);
    
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Generate Lead ID
    const year = new Date().getFullYear();
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const leadId = `HC-${year}-${randomHex}`;

    // 1. Store in Postgres (Master Truth)
    const leadRecord = await createLead(data, leadId);

    // 2. Trigger Email notification asynchronously without blocking
    sendResendEmail(leadRecord)
      .then(() => updateNotificationStatus(leadRecord.id, "email", "sent"))
      .catch((err) => {
        console.error("Async Email notification failed:", err);
        updateNotificationStatus(leadRecord.id, "email", "failed").catch(() => {});
      });

    // 3. Attempt Telegram Alert
    try {
      await sendTelegramAlert(leadRecord);
      await updateNotificationStatus(leadRecord.id, "telegram", "sent");

      return NextResponse.json({
        success: true,
        lead_id: leadRecord.id,
        telegram_status: "sent",
      });
    } catch (telegramError) {
      console.error("Telegram notification error:", telegramError);
      await updateNotificationStatus(leadRecord.id, "telegram", "failed");

      return NextResponse.json({
        success: true,
        lead_id: leadRecord.id,
        telegram_status: "failed",
        notification_error: "We couldn't notify our Telegram desk yet.",
      });
    }
  } catch (error) {
    console.error("Lead API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

