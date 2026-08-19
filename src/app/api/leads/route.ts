import { NextResponse } from "next/server";
import { CreateLeadSchema } from "@/lib/leads/schema";
import { createLead } from "@/lib/leads/createLead";
import { processNotifications } from "@/lib/leads/notifications";

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

    const payload = await request.json();
    
    // Honeypot check
    if (payload._honey) {
      // Act like it succeeded to fool bots
      return NextResponse.json({ success: true, event_id: "HC-HONEYPOT" });
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
    const leadId = `HC-${year}-${randomHex}`; // Ideally, an auto-increment or DB sequence, but this works for serverless without a sequence counter readily available.

    // Store in Postgres (Master Truth)
    const leadRecord = await createLead(data, leadId);

    // Process notifications safely without failing the lead submission
    try {
      await processNotifications(leadRecord.id, leadRecord);
    } catch (e) {
      console.error("Notification process failed:", e);
    }

    return NextResponse.json({
      success: true,
      lead_id: leadRecord.id,
    });
  } catch (error) {
    console.error("Lead API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
