import type { NextConfig } from "next";
import { SHOWROOM_GROUPS, railGroupId, showroomHref } from "./src/lib/collections/showroom";
import { CATEGORIES, PRODUCTS } from "./src/content/fallback/catalog";

/**
 * `/collections` is the only collections route. Category, family and space
 * pages (`/collections/<slug>`) no longer exist, but the 13 categories created
 * on 2026-08-30 were live and may be indexed, as may the family and space
 * pages before them. Each retired URL gets one permanent redirect straight to
 * the place its products now are — an anchor on the catalogue — and never to
 * another retired URL. A redirect that lands on a 404 is worse than no redirect.
 *
 * The 13 canonical categories are the ones that had pages, and each carries the
 * `primaryRail` the catalogue now groups by, so a retired URL lands on the
 * family its products are shown under. Redirects are fixed at build time; this
 * is a record of URLs that existed, not a second taxonomy, and new categories
 * never had a URL to redirect.
 */
const LEGACY_CATEGORY_REDIRECTS = [
  ...CATEGORIES.map((category) => ({
    source: `/collections/${category.slug}`,
    destination: showroomHref(railGroupId(category.primaryRail)),
  })),
  // The five family pages — one per showroom family, slug = the family's id.
  // Only generate an anchor redirect for families that have products in the
  // fallback catalogue; empty families fall through to the catch-all below
  // (/collections) rather than landing on a hash that doesn't scroll anywhere.
  ...(() => {
    const catRail = new Map(CATEGORIES.map((c) => [c.slug, railGroupId(c.primaryRail)]));
    const populatedFamilies = new Set(PRODUCTS.map((p) => catRail.get(p.categorySlug)).filter(Boolean));
    return SHOWROOM_GROUPS.filter((g) => populatedFamilies.has(g.id)).map((group) => ({
      source: `/collections/${group.id}`,
      destination: showroomHref(group.id),
    }));
  })(),
];

/** The pre-Phase-12 space pages, sent to the nearest showroom family. */
const LEGACY_SPACE_REDIRECTS = [
  { source: '/collections/kitchen', destination: showroomHref('kitchen-wardrobes') },
  { source: '/collections/wardrobe', destination: showroomHref('kitchen-wardrobes') },
  { source: '/collections/entrance', destination: showroomHref('door-hardware') },
  // No single family matches these two, so they land on the catalogue itself.
  { source: '/collections/living-interior', destination: '/collections' },
  { source: '/collections/commercial', destination: '/collections' },
];

/**
 * Anything else under /collections — the 35 September categories (which never
 * resolved), old nested paths, typos — goes to the catalogue. Listed last:
 * redirects are matched in order and the specific ones above must win.
 */
const LEGACY_CATCH_ALL = [{ source: '/collections/:path+', destination: '/collections' }];

const LEGACY_COLLECTION_REDIRECTS = [
  ...LEGACY_CATEGORY_REDIRECTS,
  ...LEGACY_SPACE_REDIRECTS,
  ...LEGACY_CATCH_ALL,
].map((r) => ({ ...r, permanent: true }));

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https:;",
          },
        ],
      },
    ];
  },
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
      // Retired /collections/<slug> pages → the single catalogue route
      ...LEGACY_COLLECTION_REDIRECTS,
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
