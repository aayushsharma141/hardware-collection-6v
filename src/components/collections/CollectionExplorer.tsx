"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Product } from "@/types/catalog";
import {
  productCategorySlug,
  sectionCategories,
  type ShowroomSection,
} from "@/lib/collections/showroom";
import ShowcaseCard from "./ShowcaseCard";

/** Products shown per selection: proof the showroom carries it, not a catalogue. */
const PRODUCTS_PER_VIEW = 4;

export interface CollectionExplorerProps {
  sections: ShowroomSection<Product>[];
  /** Category slug -> display name. */
  categoryNames: ReadonlyMap<string, string>;
  getImage: (product: Product) => string;
  onOpenProduct: (product: Product, trigger: HTMLElement) => void;
  /** Prefilled WhatsApp link asking about a family or category by name. */
  enquiryHref: (label: string) => string;
  /** `/catalogues?brand=…` for a brand name, when that brand has a catalogue. */
  catalogueHrefFor: (brandName: string) => string | undefined;
  /** The product open in the quick view, so a deep link also opens its family. */
  activeProduct: Product | null;
  groupIdOf: (product: Product) => string;
}

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}
const readHash = () => window.location.hash.slice(1);
const readServerHash = () => "";

/**
 * Family → category → a few products → enquire.
 *
 * Each showroom family (the CMS `primaryRail`) is a native <details>; sharing
 * `name` makes them exclusive, so opening one closes the last and the page stays
 * calm on a phone. Contents stay in the DOM, so "Find in page" still reaches
 * products inside a closed family. `#door-hardware`-style links from the
 * homepage and footer open the matching family.
 */
export default function CollectionExplorer({
  sections,
  categoryNames,
  getImage,
  onOpenProduct,
  enquiryHref,
  catalogueHrefFor,
  activeProduct,
  groupIdOf,
}: CollectionExplorerProps) {
  const [openId, setOpenId] = useState<string | null>(sections[0]?.group.id ?? null);

  // Follow in-page links (/collections#kitchen-wardrobes), adjusting state during
  // render rather than in an effect.
  const hash = useSyncExternalStore(subscribeToHash, readHash, readServerHash);
  const [seenHash, setSeenHash] = useState(readServerHash);
  if (hash !== seenHash) {
    setSeenHash(hash);
    if (sections.some((s) => s.group.id === hash)) setOpenId(hash);
  }

  // A ?product= deep link opens the quick view; open that product's family behind it.
  const [seenProduct, setSeenProduct] = useState<Product | null>(null);
  if (activeProduct !== seenProduct) {
    setSeenProduct(activeProduct);
    if (activeProduct) setOpenId(groupIdOf(activeProduct));
  }

  if (sections.length === 0) {
    return (
      <section id="explorer" className="mx-auto w-full max-w-[1320px] scroll-mt-24 px-4 py-16 text-center sm:px-6 md:px-8">
        <p className="text-[var(--text-secondary)] font-light">
          Our collection is being photographed. Ask us on WhatsApp what you&apos;re looking for.
        </p>
      </section>
    );
  }

  return (
    <section
      id="explorer"
      aria-labelledby="explorer-heading"
      className="mx-auto w-full max-w-[1320px] scroll-mt-24 px-4 py-16 sm:px-6 md:px-8 md:py-24"
    >
      <header className="mb-10 max-w-2xl md:mb-14">
        <p className="hc-mono mb-3 text-[11px] uppercase tracking-[0.22em] text-brass-ink">The collection</p>
        <h2 id="explorer-heading" className="hc-serif text-3xl font-light leading-tight sm:text-4xl lg:text-5xl">
          What are you looking for?
        </h2>
        <p className="mt-4 text-base font-light leading-relaxed text-[var(--text-secondary)]">
          Open a family to see what&apos;s inside. These are a few pieces from each, and the full range is on display at
          the showroom.
        </p>
      </header>

      <div className="border-t border-[var(--border)]">
        {sections.map((section, index) => {
          const { group } = section;
          const vocabulary = sectionCategories(section.products, categoryNames, group.id);
          return (
            <details
              key={group.id}
              id={group.id}
              name="collection-families"
              open={openId === group.id}
              onToggle={(e) => {
                const isOpen = e.currentTarget.open;
                setOpenId((current) => (isOpen ? group.id : current === group.id ? null : current));
              }}
              className="group scroll-mt-24 border-b border-[var(--border)]"
            >
              <summary className="hc-focus flex cursor-pointer list-none items-start gap-4 py-6 sm:gap-6 md:py-8 [&::-webkit-details-marker]:hidden">
                <span className="hc-mono w-7 shrink-0 pt-2 text-[11px] tracking-[0.2em] text-[var(--text-secondary)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="hc-serif block text-2xl font-light leading-tight text-[var(--text-primary)] transition-colors group-hover:text-brass-ink sm:text-3xl">
                    {group.title}
                  </span>
                  <span className="mt-2 block text-sm font-light leading-relaxed text-[var(--text-secondary)]">
                    {vocabulary.length > 0 ? vocabulary.map((c) => c.name).join(" · ") : group.description}
                  </span>
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className="mt-2 h-5 w-5 shrink-0 text-[var(--text-secondary)] transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>

              <FamilyPanel
                section={section}
                vocabulary={vocabulary}
                getImage={getImage}
                onOpenProduct={onOpenProduct}
                enquiryHref={enquiryHref}
                catalogueHrefFor={catalogueHrefFor}
              />
            </details>
          );
        })}
      </div>
    </section>
  );
}

interface FamilyPanelProps {
  section: ShowroomSection<Product>;
  vocabulary: { slug: string; name: string }[];
  getImage: (product: Product) => string;
  onOpenProduct: (product: Product, trigger: HTMLElement) => void;
  enquiryHref: (label: string) => string;
  catalogueHrefFor: (brandName: string) => string | undefined;
}

function FamilyPanel({ section, vocabulary, getImage, onOpenProduct, enquiryHref, catalogueHrefFor }: FamilyPanelProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const { group, products } = section;

  const inView = selected ? products.filter((p) => productCategorySlug(p) === selected) : products;
  const shown = inView.slice(0, PRODUCTS_PER_VIEW);
  const moreCount = inView.length - shown.length;
  const label = (selected && vocabulary.find((c) => c.slug === selected)?.name) || group.title;

  const brandNames = [...new Set(inView.map((p) => p.brandName || p.brand).filter((b): b is string => Boolean(b)))];
  const catalogues = brandNames
    .map((name) => ({ name, href: catalogueHrefFor(name) }))
    .filter((c): c is { name: string; href: string } => Boolean(c.href));

  return (
    <div className="pb-10 sm:pl-[52px] md:pb-12">
      {/* Categories only where they help narrow things down: a family with one category has nothing to choose. */}
      {vocabulary.length > 1 && (
        <div role="group" aria-label={`${group.title} categories`} className="mb-6 flex flex-wrap gap-2">
          {[{ slug: null, name: "All" }, ...vocabulary].map((category) => {
            const isActive = selected === category.slug;
            return (
              <button
                key={category.slug ?? "all"}
                type="button"
                aria-pressed={isActive}
                onClick={() => setSelected(category.slug)}
                className={`hc-focus hc-mono inline-flex min-h-11 items-center rounded-full border px-4 text-[10px] uppercase tracking-[0.16em] transition-colors ${
                  isActive
                    ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--surface)]"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--color-brass)] hover:text-[var(--text-primary)]"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      )}

      {brandNames.length > 0 && (
        <p className="mb-5 text-xs font-light text-[var(--text-secondary)]">
          Available from <span className="text-[var(--text-primary)]">{brandNames.join(" · ")}</span>
        </p>
      )}

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((product) => (
          <li key={product._id || product.id || product.name}>
            <ShowcaseCard product={product} image={getImage(product)} onOpen={onOpenProduct} />
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col gap-4 border-t border-dashed border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-light text-[var(--text-secondary)]">
          {moreCount > 0
            ? `${moreCount} more on display at the showroom.`
            : "More finishes and sizes are on display at the showroom."}
          {catalogues.length > 0 && (
            <>
              {" "}
              Catalogues:{" "}
              {catalogues.map((c, i) => (
                <span key={c.name}>
                  {i > 0 && " · "}
                  <Link href={c.href} className="hc-focus underline decoration-[var(--border)] underline-offset-4 hover:text-[var(--text-primary)] hover:decoration-[var(--color-brass)]">
                    {c.name}
                  </Link>
                </span>
              ))}
            </>
          )}
        </p>
        <a
          href={enquiryHref(label)}
          target="_blank"
          rel="noopener noreferrer"
          className="hc-focus hc-mono inline-flex min-h-11 shrink-0 items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-brass-ink transition-colors hover:text-[var(--text-primary)]"
        >
          Ask about {label}
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
