"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Pause, Play } from "lucide-react";
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
  whatsappHref: string;
}

const AUTOPLAY_MS = 5500;

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
 * it, and can be stopped with the pause button.
 */
export default function CollectionsHero({ slides, whatsappHref }: CollectionsHeroProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  // `null` = no choice made yet, so follow the visitor's motion preference.
  const [autoplayChoice, setAutoplayChoice] = useState<boolean | null>(null);

  const reducedMotion = useSyncExternalStore(subscribeToMotionPreference, prefersReducedMotion, () => false);
  const playing = autoplayChoice ?? !reducedMotion;

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
    if (!api) return;
    if (playing) autoplay.play();
    else autoplay.stop();
  }, [api, autoplay, playing]);

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
        plugins={[autoplay]}
        opts={{ loop: true, duration: 28 }}
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

      {/* Scrims: left for the text, bottom for the controls. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1a1017]/90 via-[#1a1017]/55 to-[#1a1017]/10"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#1a1017]/80 to-transparent"
      />

      <div className="mx-auto flex min-h-[560px] w-full max-w-[1320px] flex-col justify-between gap-12 px-4 pb-8 pt-32 sm:px-6 md:min-h-[640px] md:px-8 md:pt-40">
        <div className="max-w-2xl">
          <p className="hc-mono mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brass)]">
            Architectural hardware · Sakchi · Jamshedpur
          </p>
          <h1 className="hc-serif text-5xl font-light leading-[1.02] tracking-[-0.01em] sm:text-6xl lg:text-7xl">
            Explore Our Collections
          </h1>
          <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-white/85 sm:text-lg">
            Architectural hardware, kitchen fittings, wardrobe systems and more — available at our Sakchi showroom.
          </p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div aria-live={playing ? "off" : "polite"} className="max-w-md">
            <p className="hc-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
              {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")} · {active.tagline}
            </p>
            <p className="hc-serif mt-1 text-2xl font-light">{active.title}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {active.offerHref ? (
                <>
                  <Button
                    asChild
                    className="brass-plate h-11 rounded px-5 text-xs font-semibold uppercase tracking-widest text-white hover:opacity-95"
                  >
                    <a href={active.offerHref} target="_blank" rel="noopener noreferrer">
                      <MessageCircle aria-hidden="true" className="h-4 w-4" />
                      Enquire about this offer
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded border-white/40 bg-transparent px-5 text-xs font-medium uppercase tracking-widest text-white hover:border-white hover:bg-white/10 hover:text-white"
                  >
                    <a href="#offers">
                      All offers
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </a>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    className="brass-plate h-11 rounded px-5 text-xs font-semibold uppercase tracking-widest text-white hover:opacity-95"
                  >
                    <a href={`#${active.id}`}>
                      Explore {active.title}
                      <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-11 rounded border-white/40 bg-transparent px-5 text-xs font-medium uppercase tracking-widest text-white hover:border-white hover:bg-white/10 hover:text-white"
                  >
                    <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                      <MessageCircle aria-hidden="true" className="h-4 w-4" />
                      Ask our team
                    </a>
                  </Button>
                </>
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
                    className={`block h-[3px] rounded-full transition-all duration-300 motion-reduce:transition-none ${
                      index === current ? "w-6 bg-[var(--color-brass)]" : "w-3 bg-white/40 group-hover:bg-white/70"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Previous slide"
                onClick={() => api?.scrollPrev()}
                className="h-11 w-11 rounded-full text-white hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft aria-hidden="true" className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Next slide"
                onClick={() => api?.scrollNext()}
                className="h-11 w-11 rounded-full text-white hover:bg-white/10 hover:text-white"
              >
                <ChevronRight aria-hidden="true" className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                aria-pressed={!playing}
                onClick={() => setAutoplayChoice(!playing)}
                className="h-11 w-11 rounded-full text-white hover:bg-white/10 hover:text-white"
              >
                {playing ? (
                  <Pause aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <Play aria-hidden="true" className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
