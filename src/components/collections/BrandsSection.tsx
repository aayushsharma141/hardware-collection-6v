import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/types/catalog";
import { CANONICAL_BRANDS_BY_ID, normalizeBrandKey } from "@/content/fallback/brands";

export interface BrandsSectionProps {
  brands: Brand[];
}

/**
 * The brands the showroom is authorised for: those marked `featured` in Sanity,
 * so the row is edited in the Studio, not here. If none are marked, every brand
 * is shown rather than an empty row. A brand with a catalogue on the site links
 * to it; one without is just its logo.
 */
export default function BrandsSection({ brands }: BrandsSectionProps) {
  const featured = brands.filter((b) => b.featured);
  const shown = featured.length > 0 ? featured : brands;
  if (shown.length === 0) return null;

  return (
    <section
      id="brands"
      aria-labelledby="brands-heading"
      className="py-10 md:py-14"
    >
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 md:px-8">
        <header className="mb-8 flex flex-col gap-2 md:mb-10 md:flex-row md:items-end md:justify-between">
          <h2 id="brands-heading" className="hc-serif flex items-center gap-4 text-3xl font-light leading-tight sm:text-4xl">
            Authorized Brands
            <span aria-hidden="true" className="hidden h-px w-8 bg-[var(--color-brass)] sm:inline-block" />
          </h2>
          <p className="text-sm font-light text-[var(--text-secondary)]">
            We are authorized dealers for leading global brands.
          </p>
        </header>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {shown.map((brand) => {
            const key = normalizeBrandKey(brand);
            const canonical = CANONICAL_BRANDS_BY_ID[key];
            const logo = brand.logoUrl || brand.logo || canonical?.logo;
            const imageStyle = canonical?.imageStyle;
            const inner = (
              <span className="flex h-24 items-center justify-center rounded-none border border-[var(--border)] bg-[var(--surface)] p-4 transition-all duration-300 group-hover:border-[var(--color-brass)] group-hover:shadow-sm">
                {logo ? (
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                    <Image
                      src={logo}
                      alt={brand.name}
                      width={240}
                      height={96}
                      sizes="(min-width: 1024px) 160px, 40vw"
                      style={imageStyle}
                      className="max-h-12 w-auto max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
                      unoptimized={typeof logo === "string" && logo.endsWith(".svg")}
                    />
                  </div>
                ) : (
                  <span className="hc-mono text-center text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-[var(--text-primary)]">
                    {brand.name}
                  </span>
                )}
              </span>
            );
            return (
              <li key={key || brand.name}>
                {brand.catalogues?.length ? (
                  <Link
                    href={`/catalogues?brand=${key}`}
                    aria-label={`${brand.name} catalogue`}
                    className="group hc-focus block"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="group">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
