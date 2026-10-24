import { LazyImage as Image } from "@/components/ui/lazy-image";

export interface FinishItem {
  _key?: string;
  name?: string;
  subName?: string;
  description?: string;
  specification?: string;
  imageUrl?: string;
  imageLqip?: string;
}

interface FinishesStripProps {
  finishes?: FinishItem[];
}

/**
 * Finishes: a compact row of the hardware finishes the showroom stocks, edited
 * in Studio (Home Page > Material Finishes). One card per finish: sample image,
 * name, a short description. The long technical specification is kept out of the
 * card and carried as the image's description for anyone who wants it.
 *
 * Renders nothing until at least one finish has a name, so a half-edited Studio
 * document never shows an empty heading.
 */
export default function FinishesStrip({ finishes }: FinishesStripProps) {
  const items = (finishes ?? []).filter((finish) => finish.name?.trim() || finish.subName?.trim());
  if (items.length === 0) return null;

  return (
    <section id="finishes" aria-labelledby="finishes-heading" className="py-16 lg:py-24 border-t border-[var(--border)] text-[var(--text-primary)]">
      <div className="px-6 lg:px-12 xl:px-16">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between border-b border-[var(--border)] pb-6 lg:pb-8">
          <h2 id="finishes-heading" className="hc-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[0.95] font-light tracking-[-0.01em] text-balance">
            The finish matters
          </h2>
          <p className="max-w-[420px] text-base lg:text-lg leading-relaxed text-[var(--text-secondary)] font-light text-pretty lg:text-right">
            The surface is what you touch every day. Ask to see any of these in the showroom.
          </p>
        </div>

        <ul
          className="mt-8 lg:mt-10 flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-6 pb-2 -mx-6 px-6 lg:mx-0 lg:px-0 lg:overflow-visible lg:grid lg:gap-6 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ gridTemplateColumns: `repeat(${Math.min(items.length, 5)}, minmax(0, 1fr))` }}
        >
          {items.map((finish, index) => (
            <li
              key={finish._key ?? `${finish.name}-${index}`}
              className="group snap-start shrink-0 basis-[72%] sm:basis-[44%] lg:basis-auto"
            >
              <figure>
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)]">
                  {finish.imageUrl ? (
                    <Image
                      src={finish.imageUrl}
                      alt={`${finish.subName || finish.name} finish sample`}
                      fill
                      sizes="(max-width: 640px) 72vw, (max-width: 1024px) 44vw, 20vw"
                      placeholder={finish.imageLqip ? "blur" : "empty"}
                      blurDataURL={finish.imageLqip}
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                  ) : null}
                </div>
                <figcaption className="mt-4">
                  {finish.name ? (
                    <p className="hc-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{finish.name}</p>
                  ) : null}
                  {finish.subName ? (
                    <p className="hc-serif mt-1 text-2xl font-light leading-tight">{finish.subName}</p>
                  ) : null}
                  {finish.description ? (
                    <p
                      className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)] font-light line-clamp-4"
                      title={finish.specification || undefined}
                    >
                      {finish.description}
                    </p>
                  ) : null}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
