"use client";

import { Category, Product, SiteSettings, getSlugString } from "@/types/catalog";
import ProductCard from "@/components/collections/ProductCard";
import { buildCategoryConsultMessage, buildWhatsAppLink } from "@/lib/integrations/whatsapp";

export interface FamilySection {
  category: Category;
  products: Product[];
}

export interface FamilySectionsProps {
  familyName: string;
  sections: FamilySection[];
  settings?: SiteSettings | null;
  shortlist: Product[];
  onSelectProduct: (product: Product) => void;
  onToggleShortlist: (product: Product) => void;
  displayImageFor: (product: Product) => string;
}

/**
 * FamilySections — the body of a showroom-family page (Phase 12).
 *
 * Every board item in the family is a section here, in board order, with
 * `id={categorySlug}`. Links elsewhere on the site point at
 * `/collections/<family>#<categorySlug>` (see lib/collections/routes.ts), so
 * these ids are what make those links land on the right item.
 *
 * Sections with products expand into product cards. Sections without stay a
 * single compact row with a WhatsApp enquiry — most board items have no
 * products in the CMS yet, and a full empty state per item would bury the few
 * that do.
 */
export default function FamilySections({
  familyName,
  sections,
  settings,
  shortlist,
  onSelectProduct,
  onToggleShortlist,
  displayImageFor,
}: FamilySectionsProps) {
  if (sections.length === 0) return null;

  const isShortlisted = (product: Product) =>
    shortlist.some((p) => (p._id || p.id) === (product._id || product.id));

  return (
    <section aria-labelledby="family-sections-heading" className="py-16 md:py-24">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="max-w-3xl mb-10">
          <span className="hc-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] mb-2 block">
            On the showroom wall
          </span>
          <h2
            id="family-sections-heading"
            className="hc-serif text-3xl sm:text-4xl font-normal tracking-[0.02em] text-[var(--text-primary)]"
          >
            Everything we carry in {familyName}
          </h2>
        </div>

        {/* Jump list — the board itself, as in-page navigation. Not a filter:
            every section stays on the page (D-18). */}
        <nav aria-label={`Jump to a collection in ${familyName}`} className="mb-12">
          <ul className="flex flex-wrap gap-x-2 gap-y-1">
            {sections.map(({ category }) => {
              const slug = getSlugString(category.slug);
              return (
                <li key={slug}>
                  <a
                    href={`#${slug}`}
                    className="hc-focus inline-flex min-h-[44px] items-center rounded-sm px-3 py-2 text-sm font-light text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors duration-150"
                  >
                    {category.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <ol className="border-b border-[var(--border)]">
          {sections.map(({ category, products }, i) => {
            const slug = getSlugString(category.slug);
            const name = category.name || "Collection";
            // Ranked by each brand's Display Order in Studio, so one field
            // controls brand priority everywhere.
            const brandNames = [...((category.brandRefs ?? []) as Array<{ name: string; displayOrder?: number }>)]
              .sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999))
              .map((b) => b.name)
              .filter(Boolean);
            const enquiryUrl = buildWhatsAppLink(
              buildCategoryConsultMessage(name, category.whatsappMessage),
              settings
            );

            return (
              <li key={slug}>
                <section
                  id={slug}
                  aria-labelledby={`${slug}-heading`}
                  className="scroll-mt-28 border-t border-[var(--border)] py-8 md:py-10"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-baseline gap-5 md:gap-8 min-w-0">
                      <span className="hc-mono text-sm md:text-base font-medium text-[#c8a96e] shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h3
                          id={`${slug}-heading`}
                          className="hc-serif text-2xl sm:text-3xl font-normal tracking-[0.01em] text-[var(--text-primary)]"
                        >
                          {name}
                        </h3>
                        {category.description && (
                          <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed mt-2 max-w-2xl">
                            {category.description}
                          </p>
                        )}
                        {brandNames.length > 0 && (
                          <p className="text-xs text-[var(--text-secondary)] font-light mt-2">
                            Authorised:{" "}
                            <span className="text-[var(--text-primary)]">{brandNames.join(" · ")}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {products.length === 0 && (
                      <a
                        href={enquiryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hc-focus inline-flex min-h-[44px] shrink-0 items-center gap-2 self-start pl-10 md:pl-0 text-xs uppercase tracking-widest font-semibold text-[var(--accent)] hover:text-[var(--text-primary)] transition-colors duration-150"
                      >
                        Ask about {name}
                        <span aria-hidden="true">&rarr;</span>
                      </a>
                    )}
                  </div>

                  {products.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-8">
                      {products.map((product, idx) => (
                        <ProductCard
                          key={product._id || product.id || product.name}
                          product={product}
                          index={idx}
                          totalInCategory={products.length}
                          isShortlisted={isShortlisted(product)}
                          onSelect={onSelectProduct}
                          onToggleShortlist={onToggleShortlist}
                          displayImage={displayImageFor(product)}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
