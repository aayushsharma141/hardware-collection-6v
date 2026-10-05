import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <section id="offers" aria-labelledby="offers-heading" className="py-6 md:py-10">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 md:px-8">
        <header className="mb-8 flex items-center gap-4">
          <h2 id="offers-heading" className="hc-serif text-3xl font-light leading-tight sm:text-4xl">
            Current Offers
          </h2>
          <span aria-hidden="true" className="hidden h-px w-8 bg-[var(--color-brass)] sm:inline-block" />
        </header>

        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {offers.map((offer) => (
            <li key={offer._id}>
              <Card className="h-full flex-row gap-0 overflow-hidden rounded border-[var(--border)] bg-[var(--surface-raised)]/70 p-0 shadow-none">
                <div className="flex min-w-0 flex-1 flex-col gap-3 p-6">
                  <p className="hc-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brass-ink">
                    {offer.type === "brand" && offer.brandName ? offer.brandName : TYPE_LABEL[offer.type] ?? "Offer"}
                  </p>
                  <h3 className="hc-serif text-xl font-normal leading-snug">{offer.title}</h3>
                  {offer.description && (
                    <p className="text-sm font-light leading-relaxed text-[var(--text-secondary)]">
                      {offer.description}
                    </p>
                  )}
                  <p className="text-xs font-light text-[var(--text-secondary)]">
                    {offer.validUntil ? `Until ${formatDate(offer.validUntil)}` : "Ongoing"}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-auto h-10 w-fit rounded border-[var(--color-brass)] bg-transparent px-4 text-xs font-medium text-brass-ink hover:bg-[var(--color-brass)] hover:text-white"
                  >
                    <a href={enquiryHref(offer.title)} target="_blank" rel="noopener noreferrer">
                      Enquire now
                      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
                {offer.imageUrl && (
                  <div className="relative hidden w-2/5 shrink-0 sm:block">
                    <Image
                      src={offer.imageUrl}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 14vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
