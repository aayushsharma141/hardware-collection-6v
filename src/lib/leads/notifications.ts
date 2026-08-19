import { updateNotificationStatus } from "./createLead";
import { sendTelegramAlert } from "./telegram";
import { sendResendEmail } from "./email";
// import { sendWhatsAppAlert } from "./whatsapp"; // Phase 2

export async function processNotifications(leadId: string, leadData: any) {
  // Execute notifications concurrently and update statuses
  await Promise.allSettled([
    notifyTelegram(leadId, leadData),
    notifyEmail(leadId, leadData),
    // notifyWhatsApp(leadId, leadData), // Phase 2
  ]);
}

async function notifyTelegram(leadId: string, leadData: any) {
  try {
    await sendTelegramAlert(leadData);
    await updateNotificationStatus(leadId, "telegram", "sent");
  } catch (error) {
    console.error(`Failed to send Telegram for lead ${leadId}:`, error);
    await updateNotificationStatus(leadId, "telegram", "failed");
  }
}

async function notifyEmail(leadId: string, leadData: any) {
  try {
    await sendResendEmail(leadData);
    await updateNotificationStatus(leadId, "email", "sent");
  } catch (error) {
    console.error(`Failed to send Email for lead ${leadId}:`, error);
    await updateNotificationStatus(leadId, "email", "failed");
  }
}
