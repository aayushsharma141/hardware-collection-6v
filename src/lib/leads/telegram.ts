import type { LeadNotificationPayload } from "./schema";
import { escapeHtml } from "./escapeHtml";

export async function sendTelegramAlert(leadData: LeadNotificationPayload) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error("Missing Telegram configuration: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set.");
  }

  const { name, phone, customerType, location, projectType } = leadData;

  // HTML rather than Markdown: Markdown has no reliable escape, so a visitor's
  // name with an `_` or `*` made Telegram reject the alert outright.
  const text = `🔔 <b>NEW WEBSITE ENQUIRY</b>

👤 <b>Customer Type</b>
${escapeHtml(customerType || "N/A")}

🧑 <b>Name</b>
${escapeHtml(name)}

📍 <b>Location</b>
${escapeHtml(location || "N/A")}

📞 <b>Phone</b>
${escapeHtml(phone)}

🏗 <b>Project Type</b>
${escapeHtml(projectType || "N/A")}

🌐 <b>Source</b>
Hardware Collection Website`;

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Telegram API Error: ${response.status} - ${errorBody}`);
  }

  return true;
}

