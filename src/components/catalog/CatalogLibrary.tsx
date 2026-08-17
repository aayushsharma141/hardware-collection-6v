"use client";

import React from "react";
import { Lock, FileText, ArrowRight } from "lucide-react";

interface CatalogLibraryProps {
  brands: any[];
  onSelectBrand: (brand: any) => void;
}

export default function CatalogLibrary({ brands, onSelectBrand }: CatalogLibraryProps) {
  // If no brands are passed from CMS yet, we use the hardcoded list
  const displayBrands = brands && brands.length > 0 ? brands : [
    { name: "Häfele", slug: "hafele" }, 
    { name: "Dorset", slug: "dorset" }, 
    { name: "Labacha", slug: "labacha" },
    { name: "Godrej", slug: "godrej" }, 
    { name: "Hettich", slug: "hettich" }, 
    { name: "Kich", slug: "kich" }
  ];

  return (
    <section className="w-full border-t border-[#262626] bg-[#0e0e0f] py-24">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <span className="font-body text-xs font-bold text-[#e5c487] tracking-[0.2em] uppercase mb-4 block">
            Reference Library
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-[#e5e2e3] mb-6">
            Official Brand Catalogs
          </h2>
          <p className="font-body text-base text-[#d0c5b5] leading-relaxed">
            Access the complete technical specifications and product lines of our authorized partners. 
            These official catalogs are provided for research and architectural planning. For pricing, availability, and compatibility checks, please consult our specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBrands.map((brand: any, idx: number) => (
            <div 
              key={brand._id || idx} 
              onClick={() => onSelectBrand(brand)}
              className="bg-[#1c1b1c] border border-[#262626] p-8 flex flex-col justify-between h-[300px] group relative overflow-hidden cursor-pointer hover:border-[#e5c487]/50 transition-colors"
            >
              <div className="absolute top-6 right-6 text-[#998f81]">
                <Lock className="w-5 h-5" />
              </div>
              
              <div>
                {brand.logoUrl ? (
                  <div 
                    className="h-10 w-32 bg-contain bg-left bg-no-repeat mb-6 opacity-70 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundImage: `url('${brand.logoUrl}')` }}
                  />
                ) : (
                  <FileText className="w-8 h-8 text-[#e5c487] mb-6" />
                )}
                <h3 className="font-display text-2xl text-[#e5e2e3] mb-2">{brand.name} Catalog</h3>
                <p className="font-body text-xs text-[#d0c5b5]">Volume I • View-Only Access</p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-[#262626] font-body text-xs font-bold text-[#e5c487] uppercase tracking-wider group-hover:text-[#e5e2e3] transition-colors">
                <span>Open Secure Viewer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center border border-[#262626] p-8 md:p-12">
          <h3 className="font-display text-2xl text-[#e5e2e3] mb-4">Need a Physical Copy?</h3>
          <p className="font-body text-[#d0c5b5] max-w-xl mx-auto mb-8">
            We maintain physical copies of all official catalogs in our Sakchi showroom for architects, designers, and contractors.
          </p>
          <a
            href="https://wa.me/919835190738?text=Hi%20Hardware%20Collection%2C%20I%20would%20like%20to%20request%20a%20physical%20catalog."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#e5c487] text-[#131314] px-8 py-3 font-bold uppercase tracking-wider text-xs transition-colors hover:bg-white"
          >
            Request via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
