import React from "react";
import Image from "next/image";
import { buildWhatsAppUrl } from "@/lib/config";

export default function MobileProductReel() {
  return (
    <section className="w-full py-unit-xl bg-background flex flex-col space-y-unit-xl border-t border-outline-variant lg:hidden">
      <div className="px-margin-mobile flex flex-col space-y-unit-xs">
        <p className="font-label-caps text-label-caps text-primary uppercase tracking-widest">The Signature</p>
        <h2 className="font-headline-md text-headline-md text-text-bone">Flagship Pieces</h2>
      </div>
      <div className="flex flex-col space-y-unit-xl">
        
        {/* Product 1 */}
        <div className="flex flex-col items-center justify-between px-margin-mobile gap-base">
          <div className="w-full aspect-[4/5] bg-surface-graphite p-unit-lg flex items-center justify-center border border-outline-variant relative overflow-hidden">
            <Image 
              src="/cinema/collection/HC-05-01.png" 
              alt="The Obsidian Lever" 
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain p-12 z-10" 
            />
          </div>
          <div className="w-full flex flex-col space-y-unit-md">
            <h3 className="font-headline-md text-headline-md text-text-bone">The Obsidian Lever</h3>
            <p className="font-body-md text-body-md text-text-muted">A study in contrast. Solid machined brass married with dark, anodized aluminum components for a rigorous, tactile experience.</p>
            <a 
              href={buildWhatsAppUrl("I am interested in The Obsidian Lever")}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start px-unit-lg py-unit-sm border border-primary text-text-bone font-ui-button text-ui-button uppercase tracking-widest rounded-none hover:brightness-110 transition-all active:scale-95 duration-200"
            >
              Inquiry
            </a>
          </div>
        </div>

        {/* Product 2 */}
        <div className="flex flex-col items-center justify-between px-margin-mobile gap-base">
          <div className="w-full aspect-[4/5] bg-surface-graphite p-unit-lg flex items-center justify-center border border-outline-variant relative overflow-hidden">
            <Image 
              src="/cinema/collection/HC-05-02.png" 
              alt="Aura Smart Lock" 
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain p-12 z-10" 
            />
          </div>
          <div className="w-full flex flex-col space-y-unit-md">
            <h3 className="font-headline-md text-headline-md text-text-bone">Aura Smart Lock</h3>
            <p className="font-body-md text-body-md text-text-muted">Seamless integration. Biometric access concealed behind a pristine, glassmorphic panel. Security meets architectural discipline.</p>
            <a 
              href={buildWhatsAppUrl("I am interested in the Aura Smart Lock")}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start px-unit-lg py-unit-sm border border-primary text-text-bone font-ui-button text-ui-button uppercase tracking-widest rounded-none hover:brightness-110 transition-all active:scale-95 duration-200"
            >
              Inquiry
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
