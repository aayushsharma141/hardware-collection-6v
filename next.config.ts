import type { NextConfig } from "next";

/**
 * Phase 12 — B-3 redirects.
 * The 13 categories created on 2026-08-30 were live and may be indexed.
 * Each gets a permanent redirect to its family page before the route
 * resolver sees the slug, preventing 404s on indexed URLs.
 *
 * The 35 September categories (created 2026-09-26) have never resolved
 * and need no redirect.
 *
 * bathroom-accessories → /collections/bathroom-hardware resolves B-2:
 * the family slug is bathroom-hardware; the space slug stays bathroom.
 */
const LEGACY_CATEGORY_REDIRECTS = [
  // door-hardware family
  { source: '/collections/digital-locks',        destination: '/collections/door-hardware' },
  { source: '/collections/mortise-door-locks',   destination: '/collections/door-hardware' },
  { source: '/collections/glass-hardware',       destination: '/collections/door-hardware' },
  { source: '/collections/door-closers-stoppers',destination: '/collections/door-hardware' },
  { source: '/collections/safes',                destination: '/collections/door-hardware' },
  // handles-knobs family
  { source: '/collections/main-door-handles',    destination: '/collections/handles-knobs' },
  { source: '/collections/cabinet-wardrobe-handles', destination: '/collections/handles-knobs' },
  // kitchen-wardrobes family
  { source: '/collections/modular-kitchen-hardware', destination: '/collections/kitchen-wardrobes' },
  { source: '/collections/kitchen-sinks-faucets',    destination: '/collections/kitchen-wardrobes' },
  { source: '/collections/wardrobe-hardware-sliding',destination: '/collections/kitchen-wardrobes' },
  { source: '/collections/hinges-soft-close',        destination: '/collections/kitchen-wardrobes' },
  { source: '/collections/drawer-channels',          destination: '/collections/kitchen-wardrobes' },
  // bathroom-hardware family (B-2: family slug ≠ space slug)
  { source: '/collections/bathroom-accessories', destination: '/collections/bathroom-hardware' },
].map((r) => ({ ...r, permanent: true }));

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // UI convenience aliases
      {
        source: '/brands',
        destination: '/#brands',
        permanent: true,
      },
      {
        source: '/showroom',
        destination: '/#showroom',
        permanent: true,
      },
      {
        source: '/catalogs',
        destination: '/catalogues',
        permanent: true,
      },
      // Phase 12: legacy category → family page (B-3)
      ...LEGACY_CATEGORY_REDIRECTS,
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
