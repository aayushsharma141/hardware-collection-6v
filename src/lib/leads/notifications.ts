import { updateNotificationStatus } from "./createLead";
import { sendTelegramAlert } from "./telegram";
import { sendResendEmail } from "./email";
import type { LeadNotificationPayload } from "./schema";

export async function processNotifications(leadId: string, leadData: LeadNotificationPayload) {
  // Execute notifications concurrently and update statuses
  await Promise.allSettled([
    notifyTelegram(leadId, leadData),
    notifyEmail(leadId, leadData),
  ]);
}

async function notifyTelegram(leadId: string, leadData: LeadNotificationPayload) {
  try {
    await sendTelegramAlert(leadData);
    await updateNotificationStatus(leadId, "telegram", "sent");
  } catch (error) {
    console.error(`Failed to send Telegram for lead ${leadId}:`, error);
    await updateNotificationStatus(leadId, "telegram", "failed");
  }
}

async function notifyEmail(leadId: string, leadData: LeadNotificationPayload) {
  try {
    await sendResendEmail(leadData);
    await updateNotificationStatus(leadId, "email", "sent");
  } catch (error) {
    console.error(`Failed to send Email for lead ${leadId}:`, error);
    await updateNotificationStatus(leadId, "email", "failed");
  }
}
