import React from "react";

export default function MobileCategoryDiscovery() {
  return (
    <section className="w-full px-margin-mobile py-unit-xl bg-surface-obsidian flex flex-col space-y-unit-lg lg:hidden">
      <div className="flex flex-col space-y-unit-xs">
        <p className="font-label-caps text-label-caps text-primary uppercase tracking-widest">The Gallery</p>
        <h2 className="font-headline-md text-headline-md text-text-bone">Curated Categories</h2>
      </div>
      <div className="grid grid-cols-1 gap-base">
        {/* Card 1 */}
        <a href="/categories/digital-locks" className="relative group cursor-pointer aspect-[4/5] bg-surface-graphite border border-outline-variant overflow-hidden">
          <img 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" 
            alt="Digital Security" 
            src="/cinema/categories/HC-03-SECURITY.png" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-obsidian/90 to-transparent flex items-end p-unit-md">
            <h3 className="font-headline-md text-headline-md text-text-bone">Digital Security</h3>
          </div>
        </a>
        
        {/* Card 2 */}
        <a href="/categories/kitchen-systems" className="relative group cursor-pointer aspect-[4/5] bg-surface-graphite border border-outline-variant overflow-hidden">
          <img 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" 
            alt="Kitchen Systems" 
            src="/cinema/categories/HC-03-KITCHEN.png" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-obsidian/90 to-transparent flex items-end p-unit-md">
            <h3 className="font-headline-md text-headline-md text-text-bone">Kitchen Systems</h3>
          </div>
        </a>

        {/* Card 3 */}
        <a href="/categories/architectural-hardware" className="relative group cursor-pointer aspect-[4/5] bg-surface-graphite border border-outline-variant overflow-hidden">
          <img 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105" 
            alt="Designer Handles" 
            src="/cinema/categories/HC-03-DOORS.png" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-obsidian/90 to-transparent flex items-end p-unit-md">
            <h3 className="font-headline-md text-headline-md text-text-bone">Designer Handles</h3>
          </div>
        </a>
      </div>
    </section>
  );
}
