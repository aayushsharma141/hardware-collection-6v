import { SHOWROOM_WHATSAPP_NUMBER } from "@/lib/config";
import { SiteSettings } from "@/types/catalog";

export function resolveWhatsAppNumber(settings?: SiteSettings | null): string {
  return settings?.whatsappNumber || SHOWROOM_WHATSAPP_NUMBER;
}

export function buildWhatsAppLink(
  message: string,
  settings?: SiteSettings | null
): string {
  const number = resolveWhatsAppNumber(settings);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildHeroExpertMessage(): string {
  return "Hardware Collection — I'd like to speak with a hardware expert about my project.";
}

export function buildProjectRequirementMessage(): string {
  return "Hardware Collection — I'd like to send my project requirement for a consultation.";
}

export function buildCategoryConsultMessage(
  categoryName: string,
  whatsappMessage?: string
): string {
  if (whatsappMessage && whatsappMessage.trim().length > 0) {
    return whatsappMessage;
  }
  return `Hardware Collection — Discuss your ${categoryName}.`;
}

export function buildEmptyCategoryMessage(categoryName: string): string {
  return `Hardware Collection — Ask about ${categoryName} availability.`;
}

export function buildSearchZeroResultMessage(query: string): string {
  return `Hardware Collection — I'm looking for ${query}.`;
}

export function buildBrandConsultMessage(brandName: string): string {
  return `Hardware Collection — I'd like to ask about ${brandName} availability.`;
}

export function buildGeneralInquiryWhatsappLink(
  settings?: SiteSettings | string | null
): string {
  const number =
    typeof settings === "string"
      ? settings
      : resolveWhatsAppNumber(settings);
  return `https://wa.me/${number}?text=${encodeURIComponent(buildHeroExpertMessage())}`;
}

