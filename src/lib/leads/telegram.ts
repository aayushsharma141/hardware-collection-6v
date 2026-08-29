import type { LeadNotificationPayload } from "./schema";

export async function sendTelegramAlert(leadData: LeadNotificationPayload) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error("Missing Telegram configuration: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set.");
  }

  const { name, phone, customerType, location, projectType } = leadData;

  const text = `🔔 *NEW WEBSITE ENQUIRY*

👤 *Customer Type*
${customerType || "N/A"}

🧑 *Name*
${name}

📍 *Location*
${location || "N/A"}

📞 *Phone*
${phone}

🏗 *Project Type*
${projectType || "N/A"}

🌐 *Source*
Hardware Collection Website`;

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Telegram API Error: ${response.status} - ${errorBody}`);
  }

  return true;
}

