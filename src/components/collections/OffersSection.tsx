import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Offer } from "@/types/catalog";

export interface OffersSectionProps {
  offers: Offer[];
  /** Prefilled WhatsApp link asking about one offer by title. */
  enquiryHref: (offerTitle: string) => string;
}

const TYPE_LABEL: Record<Offer["type"], string> = {
  store: "Store offer",
  brand: "Brand offer",
  seasonal: "Seasonal offer",
  occasional: "Limited deal",
};

function formatDate(isoDate: string): string {
  // `validUntil` is a plain date ("2026-11-15"); format it without a timezone shift.
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Current offers from the Sanity `offer` documents. Renders nothing when none
 * are live: an empty "offers" heading would read as "no reason to visit".
 */
export default function OffersSection({ offers, enquiryHref }: OffersSectionProps) {
  if (offers.length === 0) return null;

  return (
    <section
      id="offers"
      aria-labelledby="offers-heading"
      className="border-t border-[var(--border)] bg-[var(--surface-raised)] py-16 md:py-24"
    >
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 md:px-8">
        <header className="mb-10 max-w-2xl">
          <p className="hc-mono mb-3 text-[11px] uppercase tracking-[0.22em] text-brass-ink">At the showroom now</p>
          <h2 id="offers-heading" className="hc-serif text-3xl font-light leading-tight sm:text-4xl">
            Current offers
          </h2>
        </header>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <li
              key={offer._id}
              className="flex flex-col overflow-hidden rounded border border-[var(--border)] bg-[var(--surface)]"
            >
              {offer.imageUrl && (
                <div className="relative aspect-[16/9] bg-[var(--surface-raised)]">
                  <Image
                    src={offer.imageUrl}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-3 p-6">
                <p className="hc-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brass-ink">
                  {offer.type === "brand" && offer.brandName ? `${offer.brandName} offer` : TYPE_LABEL[offer.type] ?? "Offer"}
                </p>
                <h3 className="hc-serif text-xl font-light leading-snug">{offer.title}</h3>
                {offer.description && (
                  <p className="text-sm font-light leading-relaxed text-[var(--text-secondary)]">{offer.description}</p>
                )}
                <div className="mt-auto flex items-center justify-between gap-4 pt-3">
                  <span className="text-xs font-light text-[var(--text-secondary)]">
                    {offer.validUntil ? `Until ${formatDate(offer.validUntil)}` : "Ongoing"}
                  </span>
                  <a
                    href={enquiryHref(offer.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hc-focus hc-mono inline-flex min-h-11 items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-brass-ink transition-colors hover:text-[var(--text-primary)]"
                  >
                    Enquire
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
