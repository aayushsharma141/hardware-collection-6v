import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import type { SiteSettings } from "@/types/catalog";
import {
  SHOWROOM_ADDRESS,
  SHOWROOM_EMAIL,
  SHOWROOM_PHONE_DISPLAY,
  SHOWROOM_SECONDARY_PHONE_DISPLAY,
  buildWhatsAppUrl,
} from "@/lib/config";

/**
 * Contact block at the foot of the Terms and Privacy pages.
 *
 * Every value comes from Business Settings in Sanity; the constants are only
 * the fallback for when Sanity is unreachable. These pages used to hardcode
 * the email and phones, so editing them in the Studio changed nothing here.
 */
export function LegalContactCard({ settings }: { settings?: SiteSettings | null }) {
  const email = settings?.email?.trim() || SHOWROOM_EMAIL;
  // Same numbers, labels and links as the footer's Contact column.
  const callPhone = settings?.secondaryPhone?.trim() || SHOWROOM_SECONDARY_PHONE_DISPLAY;
  const whatsappPhone = settings?.primaryPhone?.trim() || SHOWROOM_PHONE_DISPLAY;
  const whatsappHref = buildWhatsAppUrl(undefined, settings?.whatsappNumber ?? undefined);

  return (
    <div className="mt-6 p-6 rounded-xl bg-[var(--color-pearl)] border border-[var(--color-ink)]/[0.08] space-y-3 text-sm not-prose">
      <div className="flex items-start gap-3">
        <MapPin className="w-4 h-4 text-[var(--color-wine)] shrink-0 mt-1" />
        <div>
          <strong className="text-[var(--color-ink)] font-medium block">Hardware Collection Showroom</strong>
          <span>{settings?.showroomAddress || SHOWROOM_ADDRESS}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Phone className="w-4 h-4 text-[var(--color-wine)] shrink-0" />
        <a href={`tel:${callPhone.replace(/\s+/g, "")}`} className="hover:text-[var(--color-wine)] transition-colors">
          Call: {callPhone}
        </a>
      </div>
      <div className="flex items-center gap-3">
        <MessageCircle className="w-4 h-4 text-[var(--color-wine)] shrink-0" />
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-wine)] transition-colors">
          Whatsapp: {whatsappPhone}
        </a>
      </div>
      <div className="flex items-center gap-3">
        <Mail className="w-4 h-4 text-[var(--color-wine)] shrink-0" />
        <a href={`mailto:${email}`} className="hover:text-[var(--color-wine)] transition-colors">
          {email}
        </a>
      </div>
    </div>
  );
}
