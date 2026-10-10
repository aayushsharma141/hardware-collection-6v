import type { NextConfig } from "next";
import { SHOWROOM_GROUPS, LEGACY_FAMILY, railGroupId, showroomHref } from "./src/lib/collections/showroom";
import { CATEGORIES } from "./src/content/fallback/catalog";

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
    destination: showroomHref(railGroupId(category.primaryRail, category.slug)),
  })),
  // The five family pages that existed before the seven-family catalogue — slug =
  // the old family's id — each to the family that replaced it.
  ...Object.entries(LEGACY_FAMILY).map(([oldId, family]) => ({
    source: `/collections/${oldId}`,
    destination: showroomHref(family),
  })),
  // The seven current families never had a page of their own; a stray
  // /collections/<family> goes to its section.
  ...SHOWROOM_GROUPS.filter((group) => !(group.id in LEGACY_FAMILY)).map((group) => ({
    source: `/collections/${group.id}`,
    destination: showroomHref(group.id),
  })),
];

/** The pre-Phase-12 space pages, sent to the nearest showroom family. */
const LEGACY_SPACE_REDIRECTS = [
  { source: '/collections/kitchen', destination: showroomHref('kitchen') },
  { source: '/collections/wardrobe', destination: showroomHref('kitchen') },
  { source: '/collections/entrance', destination: showroomHref('door') },
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

// Allowlist reflects what the site and the embedded Sanity Studio actually load:
//  - Sanity Studio bridge (core.sanity-cdn.com) and its Inter UI fonts
//    (design-system-static.sanity.io)
//  - the Google Maps location embed on the homepage (frame-src www.google.com)
//  - Sanity API over https and wss (live listeners / visual editing), and the
//    Studio's blob web workers
// 'unsafe-eval'/'unsafe-inline' are required by the current GSAP/Three/Studio
// setup. Verified in-browser against / and /studio with zero CSP violations.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://core.sanity-cdn.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://design-system-static.sanity.io",
  "connect-src 'self' https: wss:",
  "frame-src 'self' https://www.google.com",
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    const defaultHeaders = [
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
            key: "Strict-Transport-Security",
            value: "max-age=31536000",
          },
          {
            key: "Content-Security-Policy",
            value: CONTENT_SECURITY_POLICY,
          },
        ],
      },
    ];

    const indexingHeaders = [];

    // Unless explicitly declared indexable in production, block search engine indexing.
    if (process.env.SITE_INDEXABLE !== "true") {
      indexingHeaders.push({
        source: "/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      });
    }

    // Always unconditionally noindex preview deployments (*.vercel.app)
    indexingHeaders.push({
      source: "/(.*)",
      has: [
        {
          type: "host" as const,
          value: "(?<subdomain>.*)\\.vercel\\.app",
        },
      ],
      headers: [
        {
          key: "X-Robots-Tag",
          value: "noindex, nofollow",
        },
      ],
    });

    return [...defaultHeaders, ...indexingHeaders];
  },
  async redirects() {
    return [
      // Canonical host redirect (bare domain -> www.hardwarecollection.co)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'hardwarecollection.co' }],
        destination: 'https://www.hardwarecollection.co/:path*',
        permanent: true,
      },
      // In-app defense-in-depth for legacy domain (jamshedpurhardware.com -> www.hardwarecollection.co)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'jamshedpurhardware.com' }],
        destination: 'https://www.hardwarecollection.co/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.jamshedpurhardware.com' }],
        destination: 'https://www.hardwarecollection.co/:path*',
        permanent: true,
      },
      // UI convenience aliases
      {
        source: '/brands',
        destination: '/catalogues',
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
