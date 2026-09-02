import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const timestamp = new Date().toISOString();

    const telemetryEvent = {
      event_id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      event_type: "lead.consultation.requested",
      timestamp,
      topic: "lead_generation",
      source: "hardware_collection_website",
      payload: {
        ...payload,
        received_at: timestamp,
      },
    };

    // 1. Attempt to send to Webhook (Google Sheets / Zapier / Make)
    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    let webhookSuccess = false;

    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(telemetryEvent),
        });
        if (response.ok) {
          webhookSuccess = true;
        } else {
          console.error("Failed to push lead to webhook:", response.statusText);
        }
      } catch (err) {
        console.error("Webhook fetch error:", err);
      }
    }

    // 2. Append to local project .apep/events.jsonl as fallback / redundant log (local dev only)
    if (!process.env.VERCEL) {
      try {
        const projectRoot = process.cwd();
        const apepDir = path.join(projectRoot, "..", "..", ".apep");
        const localEventsPath = path.join(apepDir, "events.jsonl");

        if (!fs.existsSync(apepDir)) {
          fs.mkdirSync(apepDir, { recursive: true });
        }
        fs.appendFileSync(localEventsPath, JSON.stringify(telemetryEvent) + "\n", "utf8");
      } catch {
        // Non-blocking file append
      }
    }

    return NextResponse.json({
      success: true,
      event_id: telemetryEvent.event_id,
      webhook_delivered: webhookSuccess,
      message: webhookSuccess ? "Lead pushed to webhook." : "Lead recorded in APEP telemetry ledger.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
