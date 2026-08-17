"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, Search, X, CheckCircle2, Plus } from "lucide-react";
import CatalogLibrary from "@/components/catalog/CatalogLibrary";
import CatalogViewerModal from "@/components/catalog/CatalogViewerModal";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function CollectionsClient({ 
  categories, 
  subcategories,
  products, 
  brands, 
  settings 
}: { 
  categories: any[]; 
  subcategories?: any[];
  products: any[]; 
  brands: any[]; 
  settings: any;
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedCatalogBrand, setSelectedCatalogBrand] = useState<any | null>(null);
  const [selection, setSelection] = useState<any[]>([]);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read deep-link from URL
  useEffect(() => {
    const productSlug = searchParams.get("product");
    if (productSlug) {
      const prod = products.find(p => p.slug === productSlug);
      if (prod && (!selectedProduct || selectedProduct.slug !== productSlug)) {
        setSelectedProduct(prod);
      }
    } else {
      if (selectedProduct) setSelectedProduct(null);
    }
  }, [searchParams, products]);

  const handleProductSelect = (product: any | null) => {
    setSelectedProduct(product);
    const params = new URLSearchParams(searchParams.toString());
    if (product) {
      params.set("product", product.slug);
    } else {
      params.delete("product");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleProductSelect(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchParams]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProduct]);

  const toggleSelection = (product: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selection.find(p => p._id === product._id)) {
      setSelection(selection.filter(p => p._id !== product._id));
    } else {
      if (selection.length >= 5) {
        alert("You can select up to 5 products at a time.");
        return;
      }
      setSelection([...selection, product]);
    }
  };

  const getWhatsAppSelectionLink = () => {
    const defaultMessage = "Hi Hardware Collection, I'd like to discuss these products for my project:\n\n";
    const productList = selection.map((p, i) => `${i + 1}. ${p.brandName} - ${p.name}`).join("\n");
    return `https://wa.me/${settings?.whatsappNumber || "919835190738"}?text=${encodeURIComponent(defaultMessage + productList)}`;
  };

  // Derived state for filtering
  const displayCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    // Filter out State C products (missing both image and shortDescription/specs)
    const validProducts = products.filter(p => p.imageUrl || p.shortDescription || (p.specifications && p.specifications.length > 0));

    // First, filter products by search query
    const matchingProducts = validProducts.filter(p => {
      if (!query) return true;
      return (
        p.name.toLowerCase().includes(query) ||
        p.brandName.toLowerCase().includes(query) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(query))
      );
    });

    // Then, figure out which categories to show
    let cats = activeTab === "all" ? categories : categories.filter((c) => c.slug === activeTab);
    
    // If there's a search query, only show categories that have matching products
    if (query) {
      cats = cats.filter(c => matchingProducts.some(p => p.categorySlug === c.slug));
    }

    return cats.map(cat => {
      const catProducts = matchingProducts.filter(p => p.categorySlug === cat.slug);
      
      const subcatsMap = new Map();
      const catSubcategories = (subcategories || []).filter(sub => sub.parentCategorySlug === cat.slug);
      
      const subcatGroups: any[] = [];
      
      catSubcategories.forEach(sub => {
        const prods = catProducts.filter(p => p.subcategorySlug === sub.slug);
        if (prods.length > 0) {
          subcatGroups.push({
            subcat: sub,
            products: prods
          });
        }
      });

      const otherProds = catProducts.filter(p => !p.subcategorySlug || !catSubcategories.find(s => s.slug === p.subcategorySlug));
      if (otherProds.length > 0) {
        subcatGroups.push({
          subcat: null,
          products: otherProds
        });
      }

      return {
        ...cat,
        products: catProducts,
        subcatGroups
      };
    });
  }, [categories, subcategories, products, activeTab, searchQuery]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-main)]">
      <Navbar 
        primaryPhone={settings?.primaryPhone}
        whatsappNumber={settings?.whatsappNumber}
        defaultWhatsappMessage={settings?.defaultWhatsappMessage}
      />

      <main className="w-full pt-20 pb-32">
        {/* Header */}
        <section className="w-full bg-[var(--color-bg-surface-2)] pt-16 pb-12 border-b border-[var(--color-glass-border)]">
          <div className="max-w-[1320px] mx-auto px-6 text-center">
            <h1 className="font-display text-4xl md:text-5xl text-[var(--color-text-main)] mb-4 uppercase tracking-widest">
              The Collection
            </h1>
            <p className="font-body text-[var(--color-text-muted)] max-w-lg mx-auto">
              Architectural hardware for considered spaces. Browse our curated selection of premium fixtures.
            </p>
          </div>
        </section>

        {/* Filter Navigation & Search */}
        <div className="w-full border-b border-[var(--color-glass-border)] sticky top-20 z-30 bg-[var(--color-bg-base)]/90 backdrop-blur-xl">
          <div className="max-w-[1320px] mx-auto px-6 py-4 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div role="tablist" aria-label="Category Filters" className="flex items-center gap-8 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
              <button
                role="tab"
                aria-selected={activeTab === "all"}
                onClick={() => setActiveTab("all")}
                className={`font-body text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${
                  activeTab === "all"
                    ? "text-[var(--color-brand-crimson)] font-bold border-b border-[var(--color-brand-crimson)] pb-1"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
                }`}
              >
                ALL
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  role="tab"
                  aria-selected={activeTab === cat.slug}
                  onClick={() => setActiveTab(cat.slug)}
                  className={`font-body text-xs uppercase tracking-widest whitespace-nowrap transition-colors ${
                    activeTab === cat.slug
                      ? "text-[var(--color-brand-crimson)] font-bold border-b border-[var(--color-brand-crimson)] pb-1"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64 shrink-0">
              <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-glass-border)] rounded-none py-2 pl-10 pr-4 text-xs font-body text-[var(--color-text-main)] focus:outline-none focus:border-black transition-colors placeholder:text-[var(--color-text-muted)]"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-black"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Empty State (No Products at all in CMS) */}
        {products.length === 0 && (
          <div className="max-w-[1320px] mx-auto px-6 py-32 text-center">
            <h3 className="font-display text-3xl mb-4">Explore our curated architectural hardware collection</h3>
            <p className="font-body text-[var(--color-text-muted)] max-w-lg mx-auto mb-8">
              We are currently updating our digital catalog with our authorized premium collections. Please contact us on WhatsApp for immediate consultation and catalog requests.
            </p>
            <a
              href={`https://wa.me/${settings?.whatsappNumber || "919835190738"}?text=Hi%20Hardware%20Collection%2C%20I%20would%20like%20to%20explore%20your%20premium%20hardware%20collections.`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Request Catalog via WhatsApp
            </a>
          </div>
        )}

        {/* No Search Results */}
        {products.length > 0 && displayCategories.length === 0 && (
          <div className="max-w-[1320px] mx-auto px-6 py-32 text-center">
            <h3 className="font-display text-2xl mb-4">No products found for &quot;{searchQuery}&quot;</h3>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveTab("all");
              }}
              className="text-[var(--color-brand-crimson)] font-body text-xs uppercase tracking-widest hover:underline"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Category Sections */}
        {products.length > 0 && (
          <div className="max-w-[1320px] mx-auto px-6 py-16 space-y-24">
            {displayCategories.map((cat, index) => {
              if (cat.products.length === 0) return null;

              return (
                <section key={cat._id} className="space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[var(--color-glass-border)] pb-6">
                    <div>
                      <h2 className="font-display text-3xl">{cat.name}</h2>
                      {cat.description && (
                        <p className="font-body text-sm text-[var(--color-text-muted)] max-w-2xl mt-2 leading-relaxed">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {cat.subcatGroups.map((group: any, gIndex: number) => (
                    <div key={gIndex} className="space-y-6">
                      {group.subcat && (
                        <div className="flex items-center gap-4">
                          <h3 className="font-body text-sm uppercase tracking-widest text-[var(--color-text-main)] font-bold">{group.subcat.name}</h3>
                          <div className="h-px bg-[var(--color-glass-border)] flex-grow"></div>
                        </div>
                      )}
                      
                      <motion.div 
                        initial="hidden"
                        animate="show"
                        variants={{
                          hidden: { opacity: 0 },
                          show: { opacity: 1, transition: { staggerChildren: 0.05 } }
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-glass-border)] border border-[var(--color-glass-border)] items-stretch"
                      >
                        {group.products.map((prod: any) => {
                          const isSelected = selection.some(p => p._id === prod._id);
                          return (
                          <motion.article
                            variants={{
                              hidden: { opacity: 0, y: 20 },
                              show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
                            }}
                            key={prod._id}
                            onClick={() => handleProductSelect(prod)}
                            className={`p-5 bg-[var(--color-bg-base)] cursor-pointer transition-all group flex flex-col justify-between h-full relative z-0 hover:z-10 hover:shadow-xl ${isSelected ? 'ring-2 ring-black' : ''}`}
                          >
                            <div>
                              {prod.imageUrl ? (
                                <div className="relative w-full h-40 bg-[var(--color-bg-surface-2)] shrink-0 mb-4 overflow-hidden border border-[var(--color-glass-border)]">
                                  <Image
                                    src={prod.imageUrl}
                                    alt={prod.name || "Product Image"}
                                    fill
                                    placeholder={prod.imageLqip ? "blur" : "empty"}
                                    blurDataURL={prod.imageLqip}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-40 bg-[var(--color-bg-surface-2)] shrink-0 mb-4 flex items-center justify-center border border-[var(--color-glass-border)]">
                                  <span className="text-[10px] text-[var(--color-text-muted)] uppercase">No Image</span>
                                </div>
                              )}
                              <span className="font-body text-[10px] text-[var(--color-brand-crimson)] uppercase tracking-wider block mb-1">
                                {prod.brandName}
                              </span>
                              <h3 className="font-display text-lg leading-tight mb-2">
                                {prod.name}
                              </h3>
                            </div>

                            {prod.shortDescription && (
                              <p className="font-body text-xs text-[var(--color-text-muted)] mb-4 line-clamp-2">
                                {prod.shortDescription}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between pt-3 border-t border-[var(--color-glass-border)]">
                              <button 
                                onClick={(e) => toggleSelection(prod, e)}
                                className={`flex items-center gap-1 font-body text-[10px] font-bold uppercase tracking-wider transition-colors ${isSelected ? 'text-black' : 'text-[var(--color-text-muted)] hover:text-black'}`}
                              >
                                {isSelected ? <CheckCircle2 className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                {isSelected ? 'Selected' : 'Select'}
                              </button>
                              <span className="font-body text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] group-hover:text-black transition-colors flex items-center">
                                Details <ArrowRight className="w-3 h-3 ml-1" />
                              </span>
                            </div>
                          </motion.article>
                        )})}
                      </motion.div>
                    </div>
                  ))}
                </section>
              );
            })}
          </div>
        )}

        {/* Brand Catalogs Library inline */}
        {products.length > 0 && (
          <CatalogLibrary brands={brands || []} onSelectBrand={setSelectedCatalogBrand} />
        )}
      </main>

      {/* Selection Tray */}
      <AnimatePresence>
        {selection.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-black text-white p-4 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 w-full md:w-auto">
              <span className="font-display text-xl">{selection.length} Product{selection.length !== 1 ? 's' : ''} Selected</span>
              <div className="flex gap-2 overflow-x-auto hide-scrollbar max-w-xs md:max-w-md">
                {selection.map(p => (
                  <div key={p._id} className="relative w-10 h-10 bg-white/10 shrink-0">
                    {p.imageUrl && <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />}
                    <button onClick={() => toggleSelection(p)} className="absolute -top-1 -right-1 bg-white text-black rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <a
              href={getWhatsAppSelectionLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-black px-6 py-3 font-body font-bold text-xs uppercase tracking-widest hover:bg-gray-200 w-full md:w-auto text-center whitespace-nowrap"
            >
              Send to WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Drawer for Product Details */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
              onClick={() => handleProductSelect(null)}
            ></motion.div>
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-xl bg-[var(--color-bg-base)] h-full overflow-y-auto border-l border-[var(--color-glass-border)] flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="sticky top-0 flex items-center justify-between p-6 bg-[var(--color-bg-base)]/90 backdrop-blur-md border-b border-[var(--color-glass-border)] z-10">
                <span className="font-body text-xs font-bold text-[var(--color-brand-crimson)] tracking-widest uppercase">
                  {selectedProduct.brandName}
                </span>
                <button 
                  onClick={() => handleProductSelect(null)}
                  aria-label="Close details"
                  className="text-[var(--color-text-muted)] hover:text-black transition-colors p-2 -mr-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 p-6 md:p-10 space-y-8">
                {selectedProduct.imageUrl && (
                  <div className="relative w-full aspect-square bg-[var(--color-bg-surface-2)] border border-[var(--color-glass-border)] overflow-hidden">
                    <Image
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name || "Product Image"}
                      fill
                      placeholder={selectedProduct.imageLqip ? "blur" : "empty"}
                      blurDataURL={selectedProduct.imageLqip}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain p-4"
                    />
                  </div>
                )}

                <div>
                  <h2 id="drawer-title" className="font-display text-4xl mb-4 leading-tight">
                    {selectedProduct.name}
                  </h2>
                  
                  {selectedProduct.shortDescription && (
                    <p className="font-body text-sm text-[var(--color-text-muted)] leading-relaxed mb-6">
                      {selectedProduct.shortDescription}
                    </p>
                  )}
                  
                  {selectedProduct.catalogReference && (
                    <div className="inline-block bg-[var(--color-bg-surface-2)] border border-[var(--color-glass-border)] px-3 py-1 font-body text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-8">
                      Catalog Ref: <span className="text-black font-bold">{selectedProduct.catalogReference}</span>
                    </div>
                  )}

                  {/* Specification Table if present */}
                  {selectedProduct.specifications && selectedProduct.specifications.length > 0 && (
                    <div className="mb-8">
                      <h3 className="font-body text-xs font-bold uppercase tracking-widest mb-4">Specifications</h3>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
                        {selectedProduct.specifications.map((spec: any, idx: number) => (
                          <div key={idx} className="border-b border-[var(--color-glass-border)] pb-2">
                            <dt className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-1">{spec.key}</dt>
                            <dd className="font-medium">{spec.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="bg-[var(--color-bg-surface-2)] border border-[var(--color-glass-border)] p-6 space-y-6">
                  {selectedProduct.showroomDisplay && (
                    <div className="text-center mb-2 pb-6 border-b border-[var(--color-glass-border)]">
                      <p className="font-body text-sm font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-brand-crimson)]"></span>
                        ON DISPLAY IN SAKCHI SHOWROOM
                      </p>
                      <p className="font-body text-xs text-[var(--color-text-muted)]">
                        Experience the finish and mechanism in person.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-3">
                    <a
                      href={`https://wa.me/${settings?.whatsappNumber || "919835190738"}?text=Hi%20Hardware%20Collection%2C%20I'm%20interested%20in%20the%20${encodeURIComponent(selectedProduct.name)}%20(${encodeURIComponent(selectedProduct.brandName)}).%20Could%20you%20share%20more%20details%3F`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full text-center py-4"
                    >
                      WhatsApp a Specialist
                    </a>
                    <button
                      onClick={() => toggleSelection(selectedProduct)}
                      className="btn-secondary w-full py-4"
                    >
                      {selection.find(p => p._id === selectedProduct._id) ? "Remove from Selection" : "Add to Selection"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Official Catalog Viewer Modal (Friction Layer) */}
      <AnimatePresence>
        {selectedCatalogBrand && (
          <CatalogViewerModal 
            brand={selectedCatalogBrand} 
            onClose={() => setSelectedCatalogBrand(null)} 
          />
        )}
      </AnimatePresence>

      <Footer 
        settings={settings}
        brands={brands}
      />
    </div>
  );
}
