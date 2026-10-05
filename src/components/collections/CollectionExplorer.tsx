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
  inSubcategory,
  productCategorySlug,
  subcategoriesOf,
  type FamilyCategory,
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
  /** Family id -> its categories (every item in the collection, with or without products). */
  familyCategories: ReadonlyMap<string, FamilyCategory[]>;
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
  familyCategories,
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
              categories={familyCategories.get(section.group.id) ?? []}
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
  categories: FamilyCategory[];
  brandLogo: (brandName: string) => string | undefined;
  getImage: (product: Product) => string;
  onOpenProduct: (product: Product, trigger: HTMLElement) => void;
  enquiryHref: (label: string) => string;
  catalogueHrefFor: (brandName: string) => string | undefined;
  onClose: () => void;
}

/** Category pills shown before "+N more": enough to scan, not a wall of chips on a phone. */
const PILLS_COLLAPSED = 8;

/**
 * One collection open: its categories, then (where products are tagged) its
 * sub-categories, then a few products. Three levels, three different controls:
 * image tiles pick the collection, rounded pills pick the category, and plain
 * text filters pick the sub-category.
 */
function FamilyPanel({
  section,
  categories,
  brandLogo,
  getImage,
  onOpenProduct,
  enquiryHref,
  catalogueHrefFor,
  onClose,
}: FamilyPanelProps) {
  const { group, products } = section;
  const Icon = FAMILY_ICON[group.id] ?? DoorClosed;

  // `null` = every category in the collection.
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const [showAllPills, setShowAllPills] = useState(false);

  const category = categories.find((c) => c.slug === categorySlug) ?? null;
  const inCategory = category ? products.filter((p) => productCategorySlug(p) === category.slug) : products;
  const subcategories = subcategoriesOf(inCategory);
  const inView = subcategory ? inCategory.filter((p) => inSubcategory(p, subcategory)) : inCategory;
  const shown = inView.slice(0, PRODUCTS_PER_VIEW);
  const label = category?.name ?? group.title;

  const countFor = (slug: string) => products.filter((p) => productCategorySlug(p) === slug).length;
  // Keep the chosen category visible even when the list is collapsed.
  const pills =
    showAllPills || categories.length <= PILLS_COLLAPSED
      ? categories
      : categories.filter((c, i) => i < PILLS_COLLAPSED || c.slug === categorySlug);
  const hiddenPills = categories.length - pills.length;

  const brandNames = [...new Set(inView.map((p) => p.brandName || p.brand).filter((b): b is string => Boolean(b)))];
  const catalogue = brandNames.map((name) => ({ name, href: catalogueHrefFor(name) })).find((c) => c.href);

  const chooseCategory = (slug: string | null) => {
    setCategorySlug(slug);
    setSubcategory(null);
  };

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

      {/* Level 2 — category: every item in the collection, as pills. */}
      {categories.length > 0 && (
        <div className="mt-6 border-t border-[var(--border)] pt-5">
          <p
            id={`${group.id}-categories`}
            className="hc-mono mb-3 text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]"
          >
            Category
          </p>
          <div role="group" aria-labelledby={`${group.id}-categories`} className="flex flex-wrap gap-2">
            {[{ slug: null, name: "All" } as const, ...pills].map((item) => {
              const active = categorySlug === item.slug;
              const count = item.slug ? countFor(item.slug) : 0;
              return (
                <button
                  key={item.slug ?? "all"}
                  type="button"
                  aria-pressed={active}
                  onClick={() => chooseCategory(item.slug)}
                  className={`hc-focus inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[13px] transition-colors ${
                    active
                      ? "border-ink bg-ink text-white"
                      : "border-[var(--border)] bg-[var(--surface-raised)]/60 text-ink hover:border-brass"
                  }`}
                >
                  {item.name}
                  {count > 0 && (
                    <span className={`text-[11px] ${active ? "text-white/70" : "text-[var(--text-secondary)]"}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
            {hiddenPills > 0 && (
              <button
                type="button"
                onClick={() => setShowAllPills(true)}
                className="hc-focus inline-flex min-h-11 items-center rounded-full px-3 text-[13px] text-brass-ink underline underline-offset-4"
              >
                +{hiddenPills} more
              </button>
            )}
          </div>
        </div>
      )}

      {/* Level 3 — sub-category: only where products have been tagged with two or more. */}
      {subcategories.length >= 2 && (
        <div className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-1">
          <span
            id={`${group.id}-subcategories`}
            className="hc-mono mr-2 text-[10px] uppercase tracking-[0.18em] text-[var(--text-secondary)]"
          >
            Sub-category
          </span>
          <div role="group" aria-labelledby={`${group.id}-subcategories`} className="flex flex-wrap items-center">
            {[null, ...subcategories].map((name) => {
              const active = subcategory === name;
              return (
                <button
                  key={name ?? "all"}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSubcategory(name)}
                  className={`hc-focus inline-flex min-h-11 items-center px-3 text-[13px] underline-offset-[6px] transition-colors ${
                    active
                      ? "text-ink underline decoration-[var(--color-brass)] decoration-2"
                      : "text-[var(--text-secondary)] hover:text-ink"
                  }`}
                >
                  {name ?? "All"}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* The selection's heading, its brands, and what's in it. */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h4 className="hc-serif flex items-center gap-4 text-2xl font-light leading-tight">
            {category ? label : "Featured pieces"}
            <Rule />
          </h4>
          {category?.blurb && <p className="mt-1 text-sm font-light text-[var(--text-secondary)]">{category.blurb}</p>}
        </div>
        {shown.length > 0 && brandNames.length > 0 && (
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

      {shown.length === 0 ? (
        // Nothing entered for this selection yet: the showroom still carries it, so say so and hand over.
        <div className="mt-5 grid items-center gap-6 rounded border border-[var(--border)] bg-[var(--surface-raised)]/60 p-5 sm:grid-cols-[minmax(0,220px)_1fr] sm:p-6">
          {category?.image ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded bg-[var(--surface-raised)]">
              <Image src={category.image} alt="" fill sizes="220px" className="object-cover" />
            </div>
          ) : null}
          <div className={`flex flex-col items-start gap-4 ${category?.image ? "" : "sm:col-span-2"}`}>
            <p className="hc-serif text-xl font-light leading-snug">
              {category ? `You'll find ${category.name} at the showroom.` : "More of this range is at the showroom."}
            </p>
            <p className="max-w-xl text-sm font-light leading-relaxed text-[var(--text-secondary)]">
              {category
                ? "We haven't photographed this range for the website yet."
                : "We haven't photographed all of it for the website yet."}{" "}
              Ask us and we&apos;ll share what&apos;s available, or come and see it.
            </p>
            <Button
              asChild
              className="brass-plate h-12 rounded px-6 text-xs font-semibold uppercase tracking-widest text-white hover:opacity-95"
            >
              <a href={enquiryHref(label)} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                Ask about {label}
              </a>
            </Button>
          </div>
        </div>
      ) : (
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
      )}
    </Card>
  );
}
