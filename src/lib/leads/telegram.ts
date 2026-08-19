export async function sendTelegramAlert(leadData: any) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error("Missing Telegram configuration");
  }

  const { intent, name, phone, source, message } = leadData;
  const leadId = leadData.id || "NEW";

  let detailLines = "";

  if (intent === "consultation") {
    detailLines = `
🏠 ${leadData.projectType || "Project"}
📅 Preferred: ${leadData.consultationDate ? leadData.consultationDate + " · " : ""}${leadData.consultationTime || ""}
📍 Mode: ${leadData.consultationMode || "Showroom"}
${leadData.interest ? `🎯 Interest: ${leadData.interest}` : ""}
${leadData.selectedProducts ? `📦 Products: ${JSON.parse(leadData.selectedProducts).map((p: any) => p.name).join(", ")}` : ""}
`;
  } else if (intent === "enquiry") {
    detailLines = `
🎯 Product Enquiry
${leadData.category || ""}
${leadData.brand || ""}
${leadData.product || ""}
${leadData.quantity ? `Qty: ${leadData.quantity}` : ""}
`;
  } else if (intent === "callback") {
    detailLines = `
📞 Callback Request
Window: ${leadData.consultationTime || "Anytime"}
`;
  }

  const sourceLabels: Record<string, string> = {
    home: "Home Page Studio",
    navbar: "Navigation Bar",
    collections: "Collections Page (Floating Capsule)",
    product_drawer: "Collections → Product Lookbook",
    shortlist: "Collections → Shortlist Drawer",
  };

  const readableSource = sourceLabels[source] || source || "Website Direct";

  const text = `🔔 *NEW WEBSITE LEAD*
━━━━━━━━━━━━━━━━
🆔 ${leadId}
📌 Intent: *${intent.toUpperCase()}*

👤 Name: ${name}
📱 Phone: ${phone}
${leadData.email ? `📧 Email: ${leadData.email}\n` : ""}${detailLines.trim()}

${message ? `💬 Message:\n${message}\n` : ""}📍 Source: *${readableSource}*${leadData.pageUrl ? `\n🔗 URL: ${leadData.pageUrl}` : ""}`;

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
}
