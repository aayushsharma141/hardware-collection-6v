import Image from "next/image";
import { ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Offer } from "@/types/catalog";
import { formatOfferDate } from "@/lib/collections/offers";

export interface OffersSectionProps {
  offers: Offer[];
  /** Prefilled WhatsApp link asking about one offer by title. */
  enquiryHref: (offerTitle: string) => string;
}

const TYPE_LABEL: Record<Offer["type"], string> = {
  store: "Store Offer",
  brand: "Brand Special",
  seasonal: "Seasonal Privilege",
  occasional: "Limited Deal",
};

/**
 * Current offers from the Sanity `offer` documents. Renders nothing when none
 * are live: an empty "offers" heading would read as "no reason to visit".
 */
export default function OffersSection({ offers, enquiryHref }: OffersSectionProps) {
  if (offers.length === 0) return null;

  return (
    <section id="offers" aria-labelledby="offers-heading" className="py-8 md:py-14 border-t border-[var(--border)]">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 md:px-8">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 id="offers-heading" className="hc-serif text-3xl font-light leading-tight sm:text-4xl">
              Current Offers & Promotions
            </h2>
            <span aria-hidden="true" className="hidden h-px w-8 bg-[var(--color-brass)] sm:inline-block" />
          </div>
          <p className="hidden sm:block text-xs uppercase tracking-widest text-[var(--text-secondary)] hc-mono">
            Direct Showroom Privileges
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <li key={offer._id}>
              <Card className="group h-full flex flex-col sm:flex-row gap-0 overflow-hidden rounded-none border border-[var(--border)] bg-[var(--surface-raised)]/70 p-0 shadow-none transition-all duration-300 hover:border-[var(--color-brass)] hover:shadow-md">
                <div className="flex min-w-0 flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.16em] bg-[var(--color-brass)]/15 text-brass-ink border border-[var(--color-brass)]/30">
                      <Tag className="w-3 h-3 text-[var(--color-brass)]" />
                      {offer.type === "brand" && offer.brandName ? offer.brandName : TYPE_LABEL[offer.type] ?? "Special Offer"}
                    </span>
                  </div>
                  <h3 className="hc-serif text-xl font-normal leading-snug group-hover:text-brass-ink transition-colors duration-200">
                    {offer.title}
                  </h3>
                  {offer.description && (
                    <p className="text-sm font-light leading-relaxed text-[var(--text-secondary)] line-clamp-3">
                      {offer.description}
                    </p>
                  )}
                  <p className="text-xs font-light text-[var(--text-secondary)] flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brass)] inline-block" />
                    {offer.validUntil ? `Valid until ${formatOfferDate(offer.validUntil)}` : "Ongoing showroom benefit"}
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-auto h-10 w-fit rounded-none border-[var(--color-brass)] bg-transparent px-4 text-xs font-medium text-brass-ink hover:bg-[var(--color-brass)] hover:text-white transition-all duration-200"
                  >
                    <a href={enquiryHref(offer.title)} target="_blank" rel="noopener noreferrer">
                      Enquire offer
                      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </a>
                  </Button>
                </div>
                {offer.imageUrl && (
                  <div className="relative h-44 sm:h-auto sm:w-2/5 shrink-0 overflow-hidden bg-[var(--surface)]">
                    <Image
                      src={offer.imageUrl}
                      alt={offer.title}
                      fill
                      sizes="(min-width: 1024px) 14vw, (min-width: 640px) 25vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
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
