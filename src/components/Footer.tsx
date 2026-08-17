"use client";

import React from "react";
import Link from "next/link";

interface FooterProps {
  settings?: any;
  brands?: any[];
}

export default function Footer({ settings, brands }: FooterProps) {
  const address = settings?.showroomAddress || "1/18, Kashidih, Near Baradwari Durga Puja Maidan,\nSakchi, Jamshedpur, Jharkhand 831001";
  const hours = settings?.showroomHours || "10:00 AM — 8:00 PM (Mon-Sun)";
  const primaryPhone = settings?.primaryPhone || "+91 98351 90738";
  const whatsappNumber = settings?.whatsappNumber || "919835190738";
  const defaultWhatsappMessage = settings?.defaultWhatsappMessage || "Hi Hardware Collection, I would like to connect.";
  const fallbackBrands = ["Häfele", "Dorset", "Labacha", "Hettich", "Godrej", "Kich"];
  return (
    <footer className="bg-[#0e0e0f] border-t border-[#262626] pt-24 pb-12 text-[#d0c5b5]">
      <div className="max-w-[1320px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        <div className="space-y-6">
          <h4 className="font-body text-xs font-bold text-[#e5c487] tracking-[0.2em] uppercase">
            Explore
          </h4>
          <ul className="space-y-3 font-body text-sm">
            <li>
              <Link href="/collections" className="text-[#d0c5b5] hover:text-[#e5e2e3] transition-colors">
                Door Handles & Levers
              </Link>
            </li>
            <li>
              <Link href="/collections" className="text-[#d0c5b5] hover:text-[#e5e2e3] transition-colors">
                Cabinet & Kitchen Hardware
              </Link>
            </li>
            <li>
              <Link href="/collections" className="text-[#d0c5b5] hover:text-[#e5e2e3] transition-colors">
                Biometric & Smart Digital Locks
              </Link>
            </li>
            <li>
              <Link href="/collections" className="text-[#d0c5b5] hover:text-[#e5e2e3] transition-colors">
                Luxury Bathroom Fittings
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <Link href="/brands" className="group flex items-center justify-between">
            <h4 className="font-body text-xs font-bold text-[#e5c487] tracking-[0.2em] uppercase group-hover:underline">
              Authorized Partners
            </h4>
          </Link>
          <ul className="space-y-3 font-body text-sm">
            {brands && brands.length > 0 
              ? brands.map(brand => (
                  <li key={brand._id}>
                    <Link href={`/brands/${brand.slug?.current || brand.name.toLowerCase()}`} className="text-[#d0c5b5] hover:text-[#e5c487] transition-colors">
                      {brand.name} {brand.authorizedStatus ? `(${brand.authorizedStatus})` : ''}
                    </Link>
                  </li>
                ))
              : fallbackBrands.map((name, i) => {
                  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
                  return (
                    <li key={i}>
                      <Link href={`/brands/${slug}`} className="text-[#d0c5b5] hover:text-[#e5c487] transition-colors">
                        {name}
                      </Link>
                    </li>
                  );
                })
            }
          </ul>
        </div>

        <div className="space-y-6">
          <Link href="/showroom" className="group">
            <h4 className="font-body text-xs font-bold text-[#e5c487] tracking-[0.2em] uppercase group-hover:underline">
              Visit Showroom
            </h4>
          </Link>
          <p className="font-body text-sm leading-relaxed text-[#d0c5b5] whitespace-pre-line">
            Hardware Collection<br />
            {address}
          </p>
          <Link href="/showroom" className="inline-block font-body text-xs text-[#e5c487] hover:underline uppercase tracking-wider">
            Explore 7,500 Sq Ft Gallery →
          </Link>
        </div>

        <div className="space-y-6">
          <h4 className="font-body text-xs font-bold text-[#e5c487] tracking-[0.2em] uppercase">
            Connect
          </h4>
          <ul className="space-y-3 font-body text-sm">
            <li>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultWhatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#25D366] hover:underline"
              >
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                WhatsApp Us ({primaryPhone})
              </a>
            </li>
            <li>
              <a href={`tel:${primaryPhone.replace(/\s+/g, '')}`} className="text-[#d0c5b5] hover:text-[#e5e2e3]">
                Call: {primaryPhone}
              </a>
            </li>
            <li className="text-[#d0c5b5]">Hours: {hours}</li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 pt-12 border-t border-[#262626]">
        <p className="font-body text-[10px] text-[#998f81] tracking-widest uppercase">
          © {new Date().getFullYear()} Hardware Collection (Mukesh Khandelwal). All Rights Reserved. Sakchi, Jamshedpur.
        </p>
        <div className="flex gap-8">
          <span className="font-body text-[10px] text-[#998f81] tracking-widest uppercase">
            Authorized Dealer • 100% Genuine
          </span>
        </div>
      </div>
    </footer>
  );
}
