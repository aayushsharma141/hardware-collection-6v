import { LazyImage as Image } from "@/components/ui/lazy-image";
import { ArrowRight } from "lucide-react";
import { Offer } from "@/types/catalog";
import { formatOfferDate } from "@/lib/collections/offers";

export interface OffersSectionProps {
  offers: Offer[];
  /** Prefilled WhatsApp link asking about one offer by title. */
  enquiryHref: (offerTitle: string) => string;
}

const TYPE_LABEL: Record<Offer["type"], string> = {
  store: "Showroom Privilege",
  brand: "Brand Special",
  seasonal: "Seasonal Privilege",
  occasional: "Showroom Feature",
};

/**
 * 02 · ATTENTION — Offer card
 * Visual message: “There is something worth exploring now.”
 * Image-led / Crimson-wine distinctive identity with restrained gold accents.
 */
export default function OffersSection({ offers, enquiryHref }: OffersSectionProps) {
  if (offers.length === 0) return null;

  return (
    <section id="offers" aria-labelledby="offers-heading" className="py-14 md:py-24 border-t border-[var(--border)]">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 md:px-8">
        <header className="mb-10 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 id="offers-heading" className="hc-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-tight text-[var(--text-primary)] text-balance">
              Featured Offers & Privileges
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)] hc-mono font-medium">
            Direct Sakchi Showroom Consultation
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => {
            const categoryLabel =
              offer.type === "brand" && offer.brandName
                ? `${offer.brandName} Special`
                : TYPE_LABEL[offer.type] ?? "Showroom Privilege";

            return (
              <li key={offer._id}>
                <div className="group relative h-full flex flex-col justify-between rounded-2xl overflow-hidden bg-[#5B1E31] text-white border border-[#5B1E31] hover:border-[var(--color-brass)]/70 transition-[transform,border-color,box-shadow] duration-300 shadow-[0_4px_24px_rgba(91,30,49,0.12)] hover:-translate-y-1">
                  {/* Top Image Stage (When image exists) */}
                  {offer.imageUrl && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#421422]">
                      <Image
                        src={offer.imageUrl}
                        alt={offer.title}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#5B1E31] via-transparent to-black/20" />
                    </div>
                  )}

                  {/* Card Content */}
                  <div className={`flex-1 flex flex-col justify-between p-7 sm:p-8 ${!offer.imageUrl ? 'pt-8' : 'pt-4'}`}>
                    <div>
                      {/* Restrained Eyebrow / Tag */}
                      <span className="hc-mono text-[10.5px] font-medium uppercase tracking-[0.22em] text-[var(--color-brass)] block mb-2.5">
                        {categoryLabel}
                      </span>

                      {/* Main Focal Point: Short Offer Title */}
                      <h3 className="hc-serif text-2xl sm:text-[26px] font-light leading-snug text-white tracking-tight text-balance mb-3">
                        {offer.title}
                      </h3>

                      {/* Refined Description */}
                      {offer.description && (
                        <p className="text-[13.5px] font-light leading-relaxed text-[#F5F2EC]/80 line-clamp-3 mb-6">
                          {offer.description}
                        </p>
                      )}
                    </div>

                    {/* Footer: Single Action + Restrained Validity */}
                    <div className="border-t border-white/15 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
                      {offer.validUntil ? (
                        <span className="hc-mono text-[11px] text-[var(--color-brass)] uppercase tracking-wider">
                          Valid through {formatOfferDate(offer.validUntil)}
                        </span>
                      ) : (
                        <span className="hc-mono text-[11px] text-[var(--color-brass)] uppercase tracking-wider">
                          Showroom Privilege
                        </span>
                      )}

                      <a
                        href={enquiryHref(offer.title)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#FDFBF7] text-[#5B1E31] hover:bg-[var(--color-brass)] hover:text-white motion-safe:active:scale-[0.98] transition-[background-color,color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brass)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#5B1E31] text-xs hc-mono font-medium uppercase tracking-wider group/btn shrink-0"
                      >
                        <span>Enquire on WhatsApp</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
