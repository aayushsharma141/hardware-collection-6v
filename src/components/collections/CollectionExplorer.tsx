"use client";

import { useState, useSyncExternalStore, type ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Armchair,
  ArrowRight,
  Bath,
  ChevronDown,
  DoorClosed,
  Lock,
  MessageCircle,
  PanelsTopLeft,
  Shirt,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/types/catalog";
import {
  familyForAnchor,
  productCategorySlug,
  sectionCategories,
  type ShowroomSection,
} from "@/lib/collections/showroom";
import ShowcaseCard from "./ShowcaseCard";

/** Products shown per selection: proof the showroom carries it, not a catalogue. */
const PRODUCTS_PER_VIEW = 4;

const FAMILY_ICON: Record<string, ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  door: DoorClosed,
  "smart-security": Lock,
  kitchen: UtensilsCrossed,
  "wardrobe-furniture": Shirt,
  "bathroom-hardware": Bath,
  glass: PanelsTopLeft,
  "furniture-fittings": Armchair,
};

/** The family's icon, centred, for a tile that has no photograph yet. */
function TileIcon({ familyId }: { familyId: string }) {
  const Icon = FAMILY_ICON[familyId] ?? DoorClosed;
  return (
    <span className="absolute inset-0 flex items-center justify-center">
      <Icon aria-hidden={true} className="h-8 w-8 text-[var(--text-secondary)] opacity-60" />
    </span>
  );
}

/** The small brass rule that follows each section heading. */
function Rule() {
  return <span aria-hidden="true" className="hidden h-px w-8 bg-[var(--color-brass)] sm:inline-block" />;
}

export interface CollectionExplorerProps {
  /** Every family, in page order; a family with no products still appears. */
  sections: ShowroomSection<Product>[];
  /** Category slug -> display name. */
  categoryNames: ReadonlyMap<string, string>;
  /** Category slug -> one-line description. */
  categoryBlurb: (slug: string) => string | undefined;
  /** Category slug -> thumbnail (the category's own image, else one of its products'). */
  categoryImage: (slug: string, products: Product[]) => string | undefined;
  /** Family id -> names of the categories filed under it, for families with no products yet. */
  familyCategoryNames: ReadonlyMap<string, string[]>;
  /** Family id -> tile photograph. */
  familyImage: (familyId: string, products: Product[]) => string | undefined;
  /** Brand name -> logo URL, when the brand has one. */
  brandLogo: (brandName: string) => string | undefined;
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
 * Browse by collection: choose a family tile, see a few pieces from it, then
 * enquire. One family is open at a time, so the page stays short on a phone.
 *
 * The tiles are a shadcn `Tabs` list (arrow-key navigation and roles come with
 * it). Tiles carry the family ids as anchors, so `/collections#kitchen` — and the
 * five older ids still in bookmarks — opens that family.
 */
export default function CollectionExplorer({
  sections,
  categoryNames,
  categoryBlurb,
  categoryImage,
  familyCategoryNames,
  familyImage,
  brandLogo,
  getImage,
  onOpenProduct,
  enquiryHref,
  catalogueHrefFor,
  activeProduct,
  groupIdOf,
}: CollectionExplorerProps) {
  // The first family with products opens by default; with none, the first tile.
  const [openId, setOpenId] = useState<string>(
    () => (sections.find((s) => s.products.length > 0) ?? sections[0])?.group.id ?? ""
  );

  // Follow in-page links, adjusting state during render rather than in an effect.
  const hash = useSyncExternalStore(subscribeToHash, readHash, readServerHash);
  const [seenHash, setSeenHash] = useState(readServerHash);
  if (hash !== seenHash) {
    setSeenHash(hash);
    const family = familyForAnchor(hash);
    if (family && sections.some((s) => s.group.id === family)) setOpenId(family);
  }

  // A ?product= deep link opens the quick view; open that product's family behind it.
  const [seenProduct, setSeenProduct] = useState<Product | null>(null);
  if (activeProduct !== seenProduct) {
    setSeenProduct(activeProduct);
    if (activeProduct) setOpenId(groupIdOf(activeProduct));
  }

  if (sections.length === 0) return null;
  const others = sections.filter((s) => s.group.id !== openId);

  return (
    <section
      id="explorer"
      aria-labelledby="explorer-heading"
      className="mx-auto w-full max-w-[1320px] scroll-mt-24 px-4 py-14 sm:px-6 md:px-8 md:py-20"
    >
      <header className="mb-8 flex flex-col gap-2 md:mb-10 md:flex-row md:items-end md:justify-between">
        <h2 id="explorer-heading" className="hc-serif flex items-center gap-4 text-3xl font-light leading-tight sm:text-4xl lg:text-5xl">
          Browse by Collection
          <Rule />
        </h2>
        <p className="text-sm font-light text-[var(--text-secondary)]">
          Choose a category to explore our featured products
        </p>
      </header>

      <Tabs value={openId} onValueChange={setOpenId} className="gap-0">
        <TabsList
          aria-label="Collections"
          className="grid h-auto w-full grid-cols-2 gap-3 rounded-none bg-transparent p-0 group-data-[orientation=horizontal]/tabs:h-auto sm:grid-cols-4 lg:grid-cols-7"
        >
          {sections.map(({ group, products }) => {
            const image = familyImage(group.id, products);
            return (
              <TabsTrigger
                key={group.id}
                id={group.id}
                value={group.id}
                className="group relative h-auto scroll-mt-28 flex-col items-stretch justify-start gap-0 self-stretch overflow-hidden rounded border border-[var(--border)] bg-ivory p-0 text-left whitespace-normal text-ink shadow-none transition-colors duration-200 hover:border-brass hover:text-ink data-[state=active]:border-brass data-[state=active]:bg-ink data-[state=active]:text-white data-[state=active]:shadow-none after:hidden"
              >
                <span className="relative block aspect-[4/3] w-full bg-[var(--surface-raised)]">
                  {image ? (
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 14vw, (min-width: 640px) 25vw, 50vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  ) : (
                    <TileIcon familyId={group.id} />
                  )}
                </span>
                <span className="flex flex-1 flex-col gap-1 p-3">
                  <span className="hc-serif text-[15px] font-normal leading-snug">{group.title}</span>
                  <span className="hc-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] opacity-70">
                    {group.tagline}
                  </span>
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.group.id} value={section.group.id} className="mt-6">
            <FamilyPanel
              section={section}
              categoryNames={categoryNames}
              categoryBlurb={categoryBlurb}
              categoryImage={categoryImage}
              emptyCategoryNames={familyCategoryNames.get(section.group.id) ?? []}
              brandLogo={brandLogo}
              getImage={getImage}
              onOpenProduct={onOpenProduct}
              enquiryHref={enquiryHref}
              catalogueHrefFor={catalogueHrefFor}
              onClose={() => setOpenId("")}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* The other families, as quiet rows */}
      <ul className="mt-6 border-t border-[var(--border)]">
        {others.map(({ group }) => {
          const Icon = FAMILY_ICON[group.id] ?? DoorClosed;
          return (
            <li key={group.id} className="border-b border-[var(--border)]">
              <button
                type="button"
                onClick={() => {
                  setOpenId(group.id);
                  document.getElementById("explorer")?.scrollIntoView({ block: "start" });
                }}
                className="hc-focus flex min-h-14 w-full items-center gap-4 px-1 py-3 text-left"
              >
                <Icon aria-hidden={true} className="h-5 w-5 shrink-0 text-[var(--text-secondary)]" />
                <span className="hc-serif flex-1 text-lg font-light">{group.title}</span>
                <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

interface FamilyPanelProps {
  section: ShowroomSection<Product>;
  categoryNames: ReadonlyMap<string, string>;
  categoryBlurb: (slug: string) => string | undefined;
  categoryImage: (slug: string, products: Product[]) => string | undefined;
  emptyCategoryNames: string[];
  brandLogo: (brandName: string) => string | undefined;
  getImage: (product: Product) => string;
  onOpenProduct: (product: Product, trigger: HTMLElement) => void;
  enquiryHref: (label: string) => string;
  catalogueHrefFor: (brandName: string) => string | undefined;
  onClose: () => void;
}

function FamilyPanel({
  section,
  categoryNames,
  categoryBlurb,
  categoryImage,
  emptyCategoryNames,
  brandLogo,
  getImage,
  onOpenProduct,
  enquiryHref,
  catalogueHrefFor,
  onClose,
}: FamilyPanelProps) {
  const { group, products } = section;
  const vocabulary = sectionCategories(products, categoryNames, group.id);
  // The first category is selected on open, as in the mockup; a family whose
  // products carry no named category just shows them all.
  const [selected, setSelected] = useState<string | null>(vocabulary[0]?.slug ?? null);
  const Icon = FAMILY_ICON[group.id] ?? DoorClosed;
  // A category named exactly like its family ("Glass Hardware" in Glass Hardware) says nothing new.
  const namedCategories = emptyCategoryNames.filter((name) => name.toLowerCase() !== group.title.toLowerCase());

  const inView = selected ? products.filter((p) => productCategorySlug(p) === selected) : products;
  const shown = inView.slice(0, PRODUCTS_PER_VIEW);
  const activeCategory = vocabulary.find((c) => c.slug === selected);
  const label = activeCategory?.name ?? group.title;
  const blurb = (selected && categoryBlurb(selected)) || undefined;

  const brandNames = [...new Set(inView.map((p) => p.brandName || p.brand).filter((b): b is string => Boolean(b)))];
  const catalogue = brandNames.map((name) => ({ name, href: catalogueHrefFor(name) })).find((c) => c.href);

  return (
    <Card className="gap-0 rounded border-[var(--border)] bg-[var(--surface)] p-5 shadow-none sm:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-[var(--border)] bg-[var(--surface-raised)]">
          <Icon aria-hidden={true} className="h-5 w-5 text-[var(--text-secondary)]" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="hc-serif flex items-center gap-4 text-2xl font-light leading-tight">
            {group.title}
            <Rule />
          </h3>
          <p className="mt-1 text-sm font-light text-[var(--text-secondary)]">{group.description}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label={`Close ${group.title}`}
          className="-mr-2 -mt-1 h-11 w-11 shrink-0 rounded-full text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="mt-6 flex flex-col items-start gap-5 border-t border-[var(--border)] pt-6">
          <p className="max-w-2xl text-base font-light leading-relaxed text-[var(--text-secondary)]">
            {namedCategories.length > 0 ? (
              <>
                We carry <span className="text-[var(--text-primary)]">{namedCategories.join(", ")}</span>. These
                pieces are not photographed online yet — ask us and we&apos;ll share what&apos;s available, or see
                them at the showroom.
              </>
            ) : (
              <>
                This range is not photographed online yet. Ask us and we&apos;ll share what&apos;s available, or see
                it at the showroom.
              </>
            )}
          </p>
          <Button
            asChild
            className="brass-plate h-12 rounded px-6 text-xs font-semibold uppercase tracking-widest text-white hover:opacity-95"
          >
            <a href={enquiryHref(group.title)} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              Ask us about {group.title}
            </a>
          </Button>
        </div>
      ) : (
        <>
          {/* Category tiles — only where a family has more than one to choose from. */}
          {vocabulary.length > 1 && (
            <div
              role="group"
              aria-label={`${group.title} categories`}
              className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
            >
              {vocabulary.map((category) => {
                const isActive = selected === category.slug;
                const thumb = categoryImage(
                  category.slug,
                  products.filter((p) => productCategorySlug(p) === category.slug)
                );
                return (
                  <button
                    key={category.slug}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setSelected(category.slug)}
                    className={`hc-focus flex min-h-16 items-center gap-3 rounded border p-2 text-left transition-colors ${
                      isActive
                        ? "border-[var(--color-brass)] bg-[var(--color-brass-light)]/40"
                        : "border-[var(--border)] bg-[var(--surface-raised)]/60 hover:border-[var(--color-brass)]"
                    }`}
                  >
                    <span className="relative block h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-[var(--surface)]">
                      {thumb && <Image src={thumb} alt="" fill sizes="48px" className="object-cover" />}
                    </span>
                    <span className="text-[13px] leading-snug text-[var(--text-primary)]">{category.name}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h4 className="hc-serif flex items-center gap-4 text-2xl font-light leading-tight">
                {label}
                <Rule />
              </h4>
              {blurb && <p className="mt-1 text-sm font-light text-[var(--text-secondary)]">{blurb}</p>}
            </div>
            {brandNames.length > 0 && (
              <div className="shrink-0 sm:text-right">
                <p className="text-[11px] font-light text-[var(--text-secondary)]">Available from</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 sm:justify-end">
                  {brandNames.map((name, i) => {
                    const logo = brandLogo(name);
                    return (
                      <span key={name} className="flex items-center gap-3">
                        {i > 0 && <span aria-hidden="true" className="h-3 w-px bg-[var(--border)]" />}
                        {logo ? (
                          <Image
                            src={logo}
                            alt={name}
                            width={96}
                            height={28}
                            className="h-5 w-auto max-w-[88px] object-contain"
                            unoptimized={logo.endsWith(".svg")}
                          />
                        ) : (
                          <span className="hc-mono text-[11px] font-semibold uppercase tracking-[0.14em]">{name}</span>
                        )}
                      </span>
                    );
                  })}
                </p>
              </div>
            )}
          </div>

          <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
            {shown.map((product) => (
              <li key={product._id || product.id || product.name}>
                <ShowcaseCard product={product} image={getImage(product)} onOpen={onOpenProduct} />
              </li>
            ))}
            <li>
              <Card className="h-full justify-center gap-4 rounded border-[var(--border)] bg-[var(--surface-raised)]/60 p-6 text-center shadow-none">
                <p className="hc-serif text-xl font-light leading-snug">Looking for more options?</p>
                <p className="text-sm font-light leading-relaxed text-[var(--text-secondary)]">
                  {inView.length > shown.length
                    ? `${inView.length - shown.length} more on display at the showroom. `
                    : "More designs and finishes are on display at the showroom. "}
                  View the brand catalogue or speak to our team.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 w-full rounded border-[var(--color-brass)] bg-transparent px-3 text-[11px] font-medium uppercase tracking-[0.08em] text-brass-ink hover:bg-[var(--color-brass)] hover:text-white"
                >
                  <a href={enquiryHref(label)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle aria-hidden="true" className="h-4 w-4" />
                    Ask on WhatsApp
                  </a>
                </Button>
                {catalogue?.href && (
                  <Link
                    href={catalogue.href}
                    className="hc-focus inline-flex min-h-11 items-center justify-center gap-2 text-xs text-brass-ink hover:text-[var(--text-primary)]"
                  >
                    View {catalogue.name} Catalogue
                    <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </Link>
                )}
              </Card>
            </li>
          </ul>
        </>
      )}
    </Card>
  );
}
