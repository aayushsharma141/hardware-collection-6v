"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

export interface HeroSlide {
  /** The showroom family this slide shows; the "Explore" link jumps to its tile. */
  id: string;
  title: string;
  tagline: string;
  image: string;
  /** Set on an offer slide: the WhatsApp enquiry for that offer. Its button replaces "Explore". */
  offerHref?: string;
}

export interface CollectionsHeroProps {
  slides: HeroSlide[];
  whatsappHref?: string; // Kept as optional to satisfy existing parent passing it
}

const AUTOPLAY_MS = 5000;

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The /collections hero: a full-bleed carousel that slides through the showroom
 * collections, under a fixed heading. Each slide's link opens that collection in
 * the explorer below (`#<family id>` is the id of its tile).
 *
 * Autoplay is a courtesy, not a requirement: it is off for visitors who ask for
 * reduced motion, pauses while the pointer is over the hero or focus is inside
 * it.
 */
export default function CollectionsHero({ slides }: CollectionsHeroProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const reducedMotion = useSyncExternalStore(subscribeToMotionPreference, prefersReducedMotion, () => false);
  const playing = !reducedMotion;

  // Disable loop and autoplay if only 1 slide to prevent Embla crash
  const isMultiple = slides.length > 1;

  // One plugin instance for the life of the hero; whether it runs is driven below.
  const autoplay = useMemo(
    () => Autoplay({ delay: AUTOPLAY_MS, playOnInit: false, stopOnInteraction: false, stopOnMouseEnter: true }),
    []
  );

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect).on("reInit", onSelect);
    return () => {
      api.off("select", onSelect).off("reInit", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || !isMultiple) return;
    const autoplayPlugin = api.plugins().autoplay;
    if (!autoplayPlugin) return;

    if (playing) autoplayPlugin.play();
    else autoplayPlugin.stop();
  }, [api, playing, isMultiple]);

  if (slides.length === 0) return null;
  const active = slides[Math.min(current, slides.length - 1)];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections and offers"
      className="relative isolate overflow-hidden bg-[#1a1017] text-white"
    >
      <Carousel
        setApi={setApi}
        plugins={isMultiple ? [autoplay] : []}
        opts={{ loop: isMultiple, duration: 28 }}
        className="absolute inset-0 -z-10 h-full [&_[data-slot=carousel-content]]:h-full"
      >
        <CarouselContent className="ml-0 h-full">
          {slides.map((slide, index) => (
            <CarouselItem
              key={slide.id}
              aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}
              className="relative h-full min-w-0 basis-full pl-0"
            >
              <Image
                src={slide.image}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[var(--text-primary)]/80"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[var(--text-primary)] to-transparent opacity-90"
      />

      <div className="mx-auto flex min-h-[560px] w-full max-w-[1320px] flex-col justify-end gap-12 px-4 pb-8 pt-32 sm:px-6 md:min-h-[640px] md:px-8 md:pt-40">

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div aria-live={playing ? "off" : "polite"} className="max-w-md">
            {active.offerHref ? (
              <p className="hc-mono text-[9.5px] uppercase tracking-[0.25em] text-[var(--color-brass)] font-semibold mb-1">
                SPECIAL OFFER
              </p>
            ) : active.tagline ? (
              <p className="hc-mono text-[10px] uppercase tracking-[0.2em] text-white/70 mb-1">
                {active.tagline}
              </p>
            ) : null}
            <p className="hc-serif mt-1 text-3xl font-light">{active.title}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {active.offerHref ? (
                <>
                  <Button
                    asChild
                    className="bg-[#fbf5ea] text-[#1a1017] hover:bg-white active:scale-[0.98] h-11 rounded-none px-6 text-xs font-bold uppercase tracking-[0.16em] transition-all"
                  >
                    <a href={active.offerHref} target="_blank" rel="noopener noreferrer">
                      <MessageCircle aria-hidden="true" className="h-4 w-4 mr-2" />
                      Enquire Offer
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded-none border-white/40 bg-transparent px-5 text-xs font-medium uppercase tracking-[0.16em] text-white hover:border-white hover:bg-white/10 hover:text-white active:scale-[0.98] transition-all"
                  >
                    <a href="#offers">
                      All offers
                      <ArrowRight aria-hidden="true" className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </>
              ) : (
                <Button
                  asChild
                  className="bg-[#fbf5ea] text-[#1a1017] hover:bg-white active:scale-[0.98] h-11 rounded-none px-6 text-xs font-bold uppercase tracking-[0.16em] transition-all"
                >
                  <a href={`#${active.id}`}>
                    Explore
                    <ArrowRight aria-hidden="true" className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div role="group" aria-label="Choose a slide" className="flex items-center">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Show ${slide.title}`}
                  aria-current={index === current}
                  onClick={() => api?.scrollTo(index)}
                  className="hc-focus group flex h-11 w-7 items-center justify-center"
                >
                  <span
                    className={`block h-[2px] rounded-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                      index === current ? "w-6 bg-white" : "w-3 bg-white/30 group-hover:bg-white/60"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
