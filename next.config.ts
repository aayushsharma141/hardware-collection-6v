import type { NextConfig } from "next";
import { SHOWROOM_GROUPS, showroomHref } from "./src/lib/collections/showroom";

/**
 * `/collections` is the only collections route. Category, family and space
 * pages (`/collections/<slug>`) no longer exist, but the 13 categories created
 * on 2026-08-30 were live and may be indexed, as may the family and space
 * pages before them. Each retired URL gets one permanent redirect straight to
 * the place its products now are — an anchor on the catalogue — and never to
 * another retired URL. A redirect that lands on a 404 is worse than no redirect.
 *
 * The category and family anchors are generated from the same mapping the page
 * renders from, so the two cannot drift apart.
 */
const LEGACY_CATEGORY_REDIRECTS = SHOWROOM_GROUPS.flatMap((group) =>
  group.categories.map((slug) => ({
    source: `/collections/${slug}`,
    destination: showroomHref(group.id),
  }))
);

/** The pre-Phase-12 space pages, sent to the nearest showroom group. */
const LEGACY_SPACE_REDIRECTS = [
  { source: '/collections/kitchen', destination: showroomHref('kitchen-wardrobe') },
  { source: '/collections/wardrobe', destination: showroomHref('kitchen-wardrobe') },
  { source: '/collections/entrance', destination: showroomHref('door-entry') },
  { source: '/collections/bathroom', destination: showroomHref('bathroom-glass') },
  // No single group matches these two, so they land on the catalogue itself.
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
