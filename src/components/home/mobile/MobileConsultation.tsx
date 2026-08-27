"use client";
import React, { useState } from "react";

export default function MobileConsultation() {
  const [activeTab, setActiveTab] = useState<"Architect" | "Homeowner">("Architect");

  return (
    <section className="w-full px-margin-mobile py-unit-xl bg-surface-obsidian border-t border-outline-variant lg:hidden">
      <div className="max-w-xl mx-auto flex flex-col space-y-unit-lg">
        <div className="flex flex-col space-y-unit-xs text-center">
          <p className="font-label-caps text-label-caps text-primary uppercase tracking-widest">The Invitation</p>
          <h2 className="font-headline-md text-headline-md text-text-bone">Private Consultation</h2>
        </div>
        
        <form className="flex flex-col space-y-unit-md" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-row gap-unit-sm justify-center mb-unit-sm">
            <button 
              onClick={() => setActiveTab("Architect")}
              className={`px-unit-md py-unit-xs border font-ui-button text-ui-button uppercase rounded-none transition-colors ${
                activeTab === "Architect" 
                  ? "border-primary bg-primary/10 text-primary" 
                  : "border-outline-variant text-text-muted hover:text-text-bone"
              }`} 
              type="button"
            >
              Architect
            </button>
            <button 
              onClick={() => setActiveTab("Homeowner")}
              className={`px-unit-md py-unit-xs border font-ui-button text-ui-button uppercase rounded-none transition-colors ${
                activeTab === "Homeowner" 
                  ? "border-primary bg-primary/10 text-primary" 
                  : "border-outline-variant text-text-muted hover:text-text-bone"
              }`} 
              type="button"
            >
              Homeowner
            </button>
          </div>
          
          <input 
            className="w-full bg-transparent border-b border-outline-variant pb-unit-sm pt-unit-md text-text-bone placeholder:text-text-muted font-body-md text-body-md focus:outline-none focus:border-primary transition-colors rounded-none" 
            placeholder="Name" 
            type="text"
            required
          />
          <input 
            className="w-full bg-transparent border-b border-outline-variant pb-unit-sm pt-unit-md text-text-bone placeholder:text-text-muted font-body-md text-body-md focus:outline-none focus:border-primary transition-colors rounded-none" 
            placeholder="Phone or Email" 
            type="text"
            required
          />
          <button 
            className="w-full mt-unit-lg px-unit-lg py-unit-md bg-primary text-on-primary font-ui-button text-ui-button uppercase tracking-widest rounded-none hover:brightness-110 transition-all active:scale-95 duration-200" 
            type="submit"
          >
            Book Consultation
          </button>
        </form>
      </div>
    </section>
  );
}
