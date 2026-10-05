import Image from "next/image";
import { MapPin, MessageCircle, Phone, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ShowroomCtaProps {
  whatsappHref: string;
  /** Digits for the tel: link; the call button is hidden when absent. */
  phone?: string;
  /** Opens the showroom-visit booking. */
  onVisit: () => void;
  address?: string;
}

// A real photograph of the Sakchi showroom, not a render.
const SHOWROOM_PHOTO = "/Hardware Collection/hardware_collection_sakchi_shop_interior_view.jpeg";

/**
 * The hand-off: everything past recognising a product happens with the team.
 * WhatsApp, a call, or a visit — never a form or a checkout.
 */
export default function ShowroomCta({ whatsappHref, phone, onVisit, address }: ShowroomCtaProps) {
  const lines = (address || "Sakchi, Jamshedpur\nJharkhand – 831001").split(/\n|,\s*(?=Jharkhand)/);

  return (
    <section id="collections-bottom-cta" aria-labelledby="cta-heading" className="relative isolate mt-14 overflow-hidden bg-[#1a1017] text-white md:mt-20">
      <Image
        src={SHOWROOM_PHOTO}
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-center opacity-40"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1a1017] via-[#1a1017]/80 to-[#1a1017]/30" />

      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-10 px-4 py-14 sm:px-6 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-16">
        <div className="max-w-xl">
          <h2 id="cta-heading" className="hc-serif text-3xl font-light leading-tight sm:text-4xl">
            Looking for something specific?
          </h2>
          <p className="mt-3 text-sm font-light leading-relaxed text-white/80 sm:text-base">
            Our team is here to help. Visit our Sakchi showroom or get in touch.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              asChild
              className="brass-plate h-12 rounded px-6 text-xs font-semibold uppercase tracking-widest text-white hover:opacity-95"
            >
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                WhatsApp us
              </a>
            </Button>
            {phone && (
              <Button
                asChild
                variant="outline"
                className="h-12 rounded border-white/40 bg-transparent px-6 text-xs font-medium uppercase tracking-widest text-white hover:border-white hover:bg-white/10 hover:text-white"
              >
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  Call us
                </a>
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onVisit}
              className="h-12 rounded border-white/40 bg-transparent px-6 text-xs font-medium uppercase tracking-widest text-white hover:border-white hover:bg-white/10 hover:text-white"
            >
              <Store aria-hidden="true" className="h-4 w-4" />
              Visit showroom
            </Button>
          </div>
        </div>

        <div className="flex items-start gap-4 lg:justify-end">
          <MapPin aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-[var(--color-brass)]" />
          <div>
            <p className="hc-serif text-2xl font-light">Our Showroom</p>
            <address className="mt-2 text-sm font-light not-italic leading-relaxed text-white/80">
              {lines.map((line) => (
                <span key={line} className="block">
                  {line.trim()}
                </span>
              ))}
            </address>
          </div>
        </div>
      </div>
    </section>
  );
}
